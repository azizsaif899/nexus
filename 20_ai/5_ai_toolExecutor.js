// *************************************************************************************************
// --- START OF FILE: 20_ai/5_ai_toolExecutor.gs ---
// *************************************************************************************************
/**
 * @file 20_ai/5_ai_toolExecutor.gs
 * @module System.AI.ToolExecutor
 * @version 1.2.0
 * @author عبدالعزيز
 * @description
 * وحدة تنفيذ الأدوات (Tool Executor): مسؤولة عن تلقي استدعاءات الدوال المقترحة من نموذج AI
 * (مثل Gemini) وتنفيذها فعليًا ضمن بيئة Google Apps Script.
 * تعمل كطبقة وسيطة بين قرار النموذج بتنفيذ أداة والتنفيذ الحقيقي لتلك الأداة.
 * المراحل المعمارية المطبقة:
 * • 1   defineModule وربط التبعيات (خاصة Tools.Catalog)
 * • 6   تحقق من صحة المدخلات
 * • 9   تسجيل الوثائق في DocsManager
 * • 10  حفظ سجلات التنفيذ في LongTermMemory
 * • 11  إرسال Telemetry لكل تنفيذ أداة
 * • 17  تسجيل مقاييس التنفيذ في ورقة AI_ToolExecutor_Metrics
 * • 18  تضمين رقم الإصدار من Config
 */

// ✅ تم تغيير 'ToolsCatalog' إلى 'Tools' للحفاظ على الاتساق المعماري
defineModule('System.AI.ToolExecutor', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
  const MODULE_VERSION = Config.get('AI_TOOL_EXECUTOR_VERSION') || '1.2.0';
  // ✅ تم تغيير اسم ورقة المقاييس ليتوافق مع نمط AI_
  const METRICS_SHEET = 'AI_ToolExecutor_Metrics';

  // مرحلة 9: تسجيل وثائق الوحدة
  DocsManager.registerModuleDocs('System.AI.ToolExecutor', [
    {
      name: 'executeFunctionCall',
      version: MODULE_VERSION,
      description: 'ينفذ دالة محددة من كتالوج الأدوات (Tools.Catalog) بناءً على اسمها ووسائطها.',
      parameters: {
        type: 'OBJECT',
        properties: {
          functionName: { type: 'STRING', description: 'الاسم الكامل للدالة المراد تنفيذها (مثلاً "Developer.reviewCode").', required: true },
          args: { type: 'OBJECT', description: 'كائن يحتوي على وسائط الدالة.', optional: true }
        },
        required: ['functionName']
      },
      returns: { type: 'ANY', description: 'نتيجة تنفيذ الدالة، أو كائن خطأ في حالة الفشل.' }
    }
  ]);

  /**
   * التحقق من المدخلات.
   * @param {string} functionName - الاسم الكامل للدالة.
   * @param {object} args - وسائط الدالة.
   * @throws {Error} إذا كانت المدخلات غير صالحة.
   * @private
   */
  function _validateInputs(functionName, args) {
    if (typeof functionName !== 'string' || !functionName.trim()) {
      throw new Error('AI.ToolExecutor: functionName must be a non-empty string.');
    }
    if (args !== undefined && (typeof args !== 'object' || args === null)) {
      throw new Error('AI.ToolExecutor: args must be an object if provided.');
    }
  }

  /**
   * يسجل استدعاء الأداة في LTM، Telemetry، وورقة المقاييس.
   * @param {string} action - نوع الإجراء ('executeFunctionCall').
   * @param {string} status - حالة العملية ('success', 'tool_not_found', 'execution_error', 'exception').
   * @param {number} durationMs - مدة العملية بالمللي ثانية.
   * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
   * @private
   */
  function _recordInvocation(action, status, durationMs, meta = {}) {
    const ts = new Date().toISOString();
    const record = {
      module: 'AI.ToolExecutor',
      function: action,
      version: MODULE_VERSION,
      timestamp: ts,
      status,
      durationMs,
      ...meta
    };

    // مرحلة 10: حفظ في LongTermMemory
    AI.LongTermMemory.save('ToolExecutorInvocation', record);

    // مرحلة 11: إرسال Telemetry
    Telemetry.track('AI.ToolExecutor.Execute', record);

    // مرحلة 17: تسجيل مقاييس التشغيل في ورقة AI_ToolExecutor_Metrics
    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'FunctionName', 'ErrorMessage'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        action,
        status,
        durationMs,
        MODULE_VERSION,
        meta.functionName || '',
        meta.errorMessage || ''
      ]);
    } else {
      Utils.warn(`AI.ToolExecutor._recordInvocation: Missing sheet '${METRICS_SHEET}'.`);
    }
  }

  /**
   * يتحقق من صحة الوسائط المقدمة مقابل مخطط الدالة.
   * @param {string} functionName - اسم الدالة للتحقق.
   * @param {object} args - الوسائط التي اقترحها النموذج.
   * @param {object} schema - مخطط الدالة من كتالوج الأدوات.
   * @throws {Error} إذا فشل التحقق.
   * @private
   */
  function _validateArguments(functionName, args, schema) {
    if (!schema || !schema.parameters) {
      Utils.log(`ToolExecutor: No validation schema for '${functionName}'. Skipping argument validation.`);
      return;
    }

    const { properties, required = [] } = schema.parameters;

    // 1. التحقق من وجود الوسائط المطلوبة
    for (const reqArg of required) {
      if (args[reqArg] === undefined || args[reqArg] === null) {
        throw new Error(`Validation failed for '${functionName}': Missing required argument '${reqArg}'.`);
      }
    }

    // 2. التحقق من أنواع الوسائط المقدمة
    for (const argName in args) {
      if (properties && properties[argName]) {
        const expectedType = (properties[argName].type || 'string').toLowerCase();
        const actualType = typeof args[argName];

        if (expectedType === 'array' && !Array.isArray(args[argName])) {
          throw new Error(`Validation failed for '${functionName}': Argument '${argName}' should be an array, but got ${actualType}.`);
        } else if (expectedType !== 'array' && actualType !== expectedType) {
          throw new Error(`Validation failed for '${functionName}': Argument '${argName}' should be type '${expectedType}', but got '${actualType}'.`);
        }
      } else {
        Utils.warn(`ToolExecutor: Extraneous argument '${argName}' provided for function '${functionName}'. It will be ignored.`);
      }
    }
  }

  /**
   * ينفذ دالة محددة من كتالوج الأدوات (Tools.Catalog) بناءً على اسمها ووسائطها.
   * هذه الدالة هي نقطة الدخول لتنفيذ الأدوات المقترحة بواسطة نموذج AI.
   * @param {string} functionName - الاسم الكامل للدالة المراد تنفيذها (مثلاً "Developer.reviewCode").
   * @param {object} [args={}] - كائن يحتوي على وسائط الدالة.
   * @returns {any} نتيجة تنفيذ الدالة، أو كائن خطأ في حالة الفشل.
   */
  function executeFunctionCall(functionName, args = {}) {
    const context = `ToolExecutor.execute[${functionName}]`;
    console.time(context);
    const start = Date.now();
    let status = 'error'; let errorMessage = ''; let result = null;

    try {
        _validateInputs(functionName, args);
        Utils.log(`AI.ToolExecutor: Attempting to execute tool: '${functionName}' with args: ${JSON.stringify(args)}`);
  
        const callableFunction = Tools.Catalog.getFunction(functionName);
  
        if (typeof callableFunction !== 'function') {
          status = 'tool_not_found';
          errorMessage = `Function '${functionName}' not found or is not callable in Tools.Catalog.`;
          Utils.warn(`AI.ToolExecutor: ${errorMessage}`);
          return { type: 'error', text: errorMessage };
        }
  
        const declaration = Tools.Catalog.getDeclaration(functionName);
        _validateArguments(functionName, args, declaration);
  
        result = callableFunction(args);
  
        status = 'success';
        Utils.log(`AI.ToolExecutor: Successfully executed tool: '${functionName}'.`);
        return { type: 'tool_result', data: result };

    } catch (e) {
      status = 'execution_error';
      errorMessage = e.message;
      Utils.error(`AI.ToolExecutor: ${errorMessage}`, { errorObj: e });
      return { type: 'error', text: errorMessage };

    } finally {
      console.timeEnd(context);
      const duration = Date.now() - start;
      _recordInvocation('executeFunctionCall', status, duration, {
        functionName,
        errorMessage
      });
    }
  }

  return { executeFunctionCall };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/5_ai_toolExecutor.gs ---
// *************************************************************************************************
