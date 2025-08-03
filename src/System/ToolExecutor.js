/**
 * ToolExecutor - منفذ الأدوات المركزي لجميع الوكلاء الذكيون
 * يوحد منطق تنفيذ Function Calling ويمنع التكرار
 *
 * @module System.ToolExecutor
 * @requires System.ErrorLogger
 * @requires System.PerformanceProfiler
 * @requires System.AccessControl
 * @since 6.1.0
 * @author G-Assistant Team
 */
defineModule('System.ToolExecutor', function(injector) {
  const errorLogger = injector.get('System.ErrorLogger');
  const performanceProfiler = injector.get('System.PerformanceProfiler');
  const accessControl = injector.get('System.AccessControl');

  // سجل الأدوات المتاحة
  const TOOL_REGISTRY = {
    // أدوات الأوراق
    'sheets.read': 'System.ToolsSheets.batchRead',
    'sheets.write': 'System.ToolsSheets.batchWrite',
    'sheets.create': 'System.ToolsSheets.createSheetFromTemplate',
    'sheets.analyze': 'System.ToolsSheets.summarizeActiveSheetWithGemini',

    // أدوات مالية
    'finance.pnl': 'System.AI.Agents.CFO.runMonthlyPNL',
    'finance.trends': 'System.AI.Agents.CFO.analyzeFinancialTrends',
    'finance.calculate': 'System.Tools.Accounting.calculateGrossProfit',

    // أدوات التطوير
    'dev.review': 'System.Tools.CodeReview.analyzeCode',
    'dev.generate': 'System.Tools.Developer.generateCode',
    'dev.test': 'System.Tools.Developer.runTests',

    // أدوات عامة
    'data.analyze': 'System.Tools.DataAnalysis.performAnalysis',
    'report.generate': 'System.Tools.Reporting.createReport'
  };

  return {
    /**
     * تنفيذ استدعاءات الأدوات من استجابة Gemini
     * @param {Object} toolCallsResponse - استجابة tool_calls من Gemini
     * @param {string} agentId - معرف الوكيل المستدعي
     * @param {Object} context - سياق الطلب
     * @returns {Promise<Object>} نتائج تنفيذ الأدوات
     * @throws {Error} عند فشل التنفيذ
     */
    async executeToolCalls(toolCallsResponse, agentId, context = {}) {
      const timerId = performanceProfiler.startTimer('execute_tool_calls');

      try {
        // التحقق من صحة الاستجابة
        if (!this._validateToolCallsResponse(toolCallsResponse)) {
          throw new Error('Invalid tool_calls response format');
        }

        const results = [];
        const toolCalls = this._extractToolCalls(toolCallsResponse);

        // تنفيذ كل أداة
        for (const toolCall of toolCalls) {
          const toolResult = await this._executeSingleTool(toolCall, agentId, context);
          results.push(toolResult);
        }

        performanceProfiler.endTimer(timerId);

        // تسجيل العملية
        this._logToolExecution(agentId, toolCalls, results, context);

        return {
          success: true,
          results: results,
          executedTools: toolCalls.length,
          agentId: agentId
        };

      } catch (error) {
        performanceProfiler.endTimer(timerId);
        errorLogger.logError(error, {
          operation: 'execute_tool_calls',
          agentId,
          context
        });
        throw error;
      }
    },

    /**
     * تنفيذ أداة واحدة مع التحقق من الصلاحيات
     * @private
     * @param {Object} toolCall - استدعاء الأداة
     * @param {string} agentId - معرف الوكيل
     * @param {Object} context - السياق
     * @returns {Promise<Object>} نتيجة التنفيذ
     */
    async _executeSingleTool(toolCall, agentId, context) {
      const { name, parameters } = toolCall;
      const toolTimerId = performanceProfiler.startTimer(`tool_${name}`);

      try {
        // التحقق من وجود الأداة
        if (!TOOL_REGISTRY[name]) {
          throw new Error(`Unknown tool: ${name}`);
        }

        // التحقق من الصلاحيات
        const requiredPermission = this._getRequiredPermission(name);
        if (requiredPermission) {
          accessControl.checkPermission(requiredPermission, `execute_tool_${name}`);
        }

        // الحصول على الدالة
        const toolFunction = this._getToolFunction(TOOL_REGISTRY[name]);
        if (!toolFunction) {
          throw new Error(`Tool function not found: ${TOOL_REGISTRY[name]}`);
        }

        // تنفيذ الأداة
        const result = await this._safeExecuteFunction(toolFunction, parameters, name);

        performanceProfiler.endTimer(toolTimerId);

        return {
          toolName: name,
          success: true,
          result: result,
          executionTime: Date.now() - toolTimerId
        };

      } catch (error) {
        performanceProfiler.endTimer(toolTimerId);

        return {
          toolName: name,
          success: false,
          error: error.message,
          executionTime: Date.now() - toolTimerId
        };
      }
    },

    /**
     * تنفيذ آمن للدالة مع معالجة الأخطاء
     * @private
     * @param {Function} func - الدالة المراد تنفيذها
     * @param {Object} params - المعاملات
     * @param {string} toolName - اسم الأداة
     * @returns {Promise<any>} نتيجة التنفيذ
     */
    async _safeExecuteFunction(func, params, toolName) {
      try {
        // تنفيذ الدالة مع timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Tool execution timeout')), 30000);
        });

        const executionPromise = Promise.resolve(func(params));

        return await Promise.race([executionPromise, timeoutPromise]);

      } catch (error) {
        errorLogger.logError(error, {
          operation: 'safe_execute_function',
          toolName,
          params
        });
        throw new Error(`Tool execution failed: ${error.message}`);
      }
    },

    /**
     * التحقق من صحة استجابة tool_calls
     * @private
     * @param {Object} response - الاستجابة
     * @returns {boolean} صحيحة أم لا
     */
    _validateToolCallsResponse(response) {
      return response &&
             response.candidates &&
             response.candidates[0] &&
             response.candidates[0].content &&
             response.candidates[0].content.parts;
    },

    /**
     * استخراج استدعاءات الأدوات من الاستجابة
     * @private
     * @param {Object} response - الاستجابة
     * @returns {Array} قائمة استدعاءات الأدوات
     */
    _extractToolCalls(response) {
      const parts = response.candidates[0].content.parts;
      const toolCalls = [];

      parts.forEach(part => {
        if (part.functionCall) {
          toolCalls.push({
            name: part.functionCall.name,
            parameters: part.functionCall.args || {}
          });
        }
      });

      return toolCalls;
    },

    /**
     * الحصول على دالة الأداة من المسار
     * @private
     * @param {string} path - مسار الدالة
     * @returns {Function|null} الدالة أو null
     */
    _getToolFunction(path) {
      try {
        const parts = path.split('.');
        let obj = GAssistant;

        for (const part of parts) {
          obj = obj[part];
          if (!obj) return null;
        }

        return typeof obj === 'function' ? obj : null;
      } catch (error) {
        return null;
      }
    },

    /**
     * تحديد الصلاحية المطلوبة للأداة
     * @private
     * @param {string} toolName - اسم الأداة
     * @returns {string|null} مستوى الصلاحية المطلوب
     */
    _getRequiredPermission(toolName) {
      const permissionMap = {
        'finance.': 'FINANCIAL_MANAGER',
        'dev.': 'ANALYST',
        'sheets.write': 'ANALYST',
        'sheets.create': 'ANALYST'
      };

      for (const [prefix, permission] of Object.entries(permissionMap)) {
        if (toolName.startsWith(prefix)) {
          return permission;
        }
      }

      return 'VIEWER'; // الحد الأدنى للصلاحيات
    },

    /**
     * تسجيل عملية تنفيذ الأدوات
     * @private
     * @param {string} agentId - معرف الوكيل
     * @param {Array} toolCalls - استدعاءات الأدوات
     * @param {Array} results - النتائج
     * @param {Object} context - السياق
     */
    _logToolExecution(agentId, toolCalls, results, context) {
      const logData = {
        timestamp: new Date().toISOString(),
        agentId: agentId,
        toolsExecuted: toolCalls.length,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length,
        tools: toolCalls.map(tc => tc.name),
        context: context
      };

      // حفظ في سجل العمليات
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName('Tool_Execution_Log') ||
          SpreadsheetApp.getActiveSpreadsheet().insertSheet('Tool_Execution_Log');

        if (sheet.getLastRow() === 0) {
          sheet.getRange(1, 1, 1, 7).setValues([[
            'Timestamp', 'Agent', 'Tools Count', 'Success', 'Failures', 'Tools', 'Context'
          ]]);
        }

        sheet.appendRow([
          logData.timestamp,
          logData.agentId,
          logData.toolsExecuted,
          logData.successCount,
          logData.failureCount,
          logData.tools.join(', '),
          JSON.stringify(logData.context)
        ]);

      } catch (error) {
        console.error('Failed to log tool execution:', error);
      }
    },

    /**
     * تسجيل أداة جديدة في السجل
     * @param {string} toolName - اسم الأداة
     * @param {string} functionPath - مسار الدالة
     * @param {string} permission - الصلاحية المطلوبة
     */
    registerTool(toolName, functionPath, permission = 'VIEWER') {
      TOOL_REGISTRY[toolName] = functionPath;
      console.log(`🔧 Tool registered: ${toolName} -> ${functionPath}`);
    },

    /**
     * الحصول على قائمة الأدوات المتاحة
     * @returns {Object} سجل الأدوات
     */
    getAvailableTools() {
      return { ...TOOL_REGISTRY };
    }
  };
});
