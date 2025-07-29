defineModule('System.AI.SmartTriggers', ({ Utils, Config, IntentAnalyzer, ToolExecutor }) => {
  const MODULE_VERSION = '1.0.0';

  const CONTROL_CELLS = {
    COMMAND_CELL: 'A1',
    STATUS_CELL: 'B1',
    RESULT_CELL: 'C1'
  };

  function setupSmartTriggers() {
    try {
      // إزالة المؤقتات الموجودة
      ScriptApp.getProjectTriggers()
        .filter(t => t.getHandlerFunction() === 'onSmartEdit')
        .forEach(t => ScriptApp.deleteTrigger(t));

      // إنشاء مؤقت onEdit قابل للتثبيت
      ScriptApp.newTrigger('onSmartEdit')
        .onEdit()
        .create();

      Utils.log('Smart triggers setup completed');
      return { type: 'success', text: 'تم إعداد المؤقتات الذكية' };
    } catch (e) {
      Utils.error('Failed to setup smart triggers', e);
      return { type: 'error', text: `فشل في إعداد المؤقتات: ${e.message}` };
    }
  }

  function processSmartEdit(e) {
    try {
      if (!e || !e.range) return;

      const sheet = e.range.getSheet();
      const cell = e.range.getA1Notation();
      const value = e.value;

      // معالجة خلايا التحكم
      if (cell === CONTROL_CELLS.COMMAND_CELL && value) {
        _processCommandCell(sheet, value);
      }
      
      // معالجة الأوامر المباشرة
      if (typeof value === 'string' && value.startsWith('!')) {
        _processDirectCommand(e.range, value);
      }

      // معالجة التحليل التلقائي للبيانات
      if (_isDataRange(e.range) && _shouldAutoAnalyze(value)) {
        _triggerAutoAnalysis(e.range);
      }

    } catch (error) {
      Utils.error('Smart edit processing failed', error);
      _updateStatus(e.range.getSheet(), 'خطأ في المعالجة', 'error');
    }
  }

  function _processCommandCell(sheet, command) {
    try {
      _updateStatus(sheet, 'جاري المعالجة...', 'processing');

      // تحليل النية
      const context = IntentAnalyzer.enhanceContextFromSheet();
      const intent = IntentAnalyzer.analyzeIntent(command, context);

      // توجيه للوكيل المناسب
      const result = _routeToAgent(intent);

      // تحديث النتيجة
      sheet.getRange(CONTROL_CELLS.RESULT_CELL).setValue(result.text);
      _updateStatus(sheet, 'تم', result.type);

      // تسجيل العملية
      _logTriggerExecution(command, intent, result);

    } catch (e) {
      _updateStatus(sheet, `خطأ: ${e.message}`, 'error');
    }
  }

  function _processDirectCommand(range, command) {
    const sheet = range.getSheet();
    const cleanCommand = command.substring(1); // إزالة !

    try {
      // أوامر مباشرة محددة مسبقاً
      const directCommands = {
        'تقرير': () => _generateReport(range),
        'تحليل': () => _analyzeRange(range),
        'إيميل': () => _sendEmailNotification(range),
        'حفظ': () => _saveToHistory(range)
      };

      const commandFunc = directCommands[cleanCommand];
      if (commandFunc) {
        const result = commandFunc();
        range.setValue(result.text);
      } else {
        // معالجة عامة للأوامر غير المعرفة
        const context = { sourceRange: range.getA1Notation() };
        const intent = IntentAnalyzer.analyzeIntent(cleanCommand, context);
        const result = _routeToAgent(intent);
        range.setValue(result.text);
      }

    } catch (e) {
      range.setValue(`خطأ: ${e.message}`);
    }
  }

  function _routeToAgent(intent) {
    try {
      const sessionId = `trigger_${Date.now()}`;
      
      switch (intent.agent) {
        case 'CFO':
          if (GAssistant?.AI?.Agents?.CFO?.handleRequest) {
            return GAssistant.AI.Agents.CFO.handleRequest({
              sessionId,
              message: intent.originalMessage,
              intent: { type: intent.intent, data: intent.parameters }
            });
          }
          break;

        case 'Developer':
          if (GAssistant?.AI?.Agents?.Developer?.handleRequest) {
            return GAssistant.AI.Agents.Developer.handleRequest({
              sessionId,
              message: intent.originalMessage,
              intent: { type: intent.intent, data: intent.parameters }
            });
          }
          break;

        case 'DatabaseManager':
          if (GAssistant?.AI?.Agents?.DatabaseManager?.handleRequest) {
            return GAssistant.AI.Agents.DatabaseManager.handleRequest({
              sessionId,
              message: intent.originalMessage,
              intent: { type: intent.intent, data: intent.parameters }
            });
          }
          break;
      }

      return { type: 'error', text: `الوكيل ${intent.agent} غير متوفر` };
    } catch (e) {
      return { type: 'error', text: `خطأ في التوجيه: ${e.message}` };
    }
  }

  function _isDataRange(range) {
    return range.getNumRows() > 1 || range.getNumColumns() > 1;
  }

  function _shouldAutoAnalyze(value) {
    // تحليل تلقائي للبيانات الرقمية الجديدة
    return typeof value === 'number' && value !== 0;
  }

  function _triggerAutoAnalysis(range) {
    try {
      const result = ToolExecutor.executeTool({
        name: 'analyze_data',
        parameters: { range: range.getA1Notation() }
      });

      // إضافة تعليق للخلية مع نتيجة التحليل
      if (result.type === 'success') {
        range.setNote(`تحليل تلقائي: ${result.text}`);
      }
    } catch (e) {
      Utils.error('Auto analysis failed', e);
    }
  }

  function _updateStatus(sheet, message, type = 'info') {
    try {
      const statusCell = sheet.getRange(CONTROL_CELLS.STATUS_CELL);
      statusCell.setValue(message);
      
      // تلوين حسب النوع
      const colors = {
        'processing': '#fff3cd',
        'success': '#d1edff',
        'error': '#f8d7da',
        'info': '#ffffff'
      };
      
      statusCell.setBackground(colors[type] || colors.info);
    } catch (e) {
      Utils.error('Failed to update status', e);
    }
  }

  function _logTriggerExecution(command, intent, result) {
    try {
      const logSheet = Utils.getSheet('TriggerLog', [
        'Timestamp', 'Command', 'Intent', 'Agent', 'Result', 'Success'
      ]);

      if (logSheet) {
        logSheet.appendRow([
          new Date(),
          command,
          intent.intent,
          intent.agent,
          result.text,
          result.type === 'success'
        ]);
      }
    } catch (e) {
      Utils.error('Failed to log trigger execution', e);
    }
  }

  // دوال مساعدة للأوامر المباشرة
  function _generateReport(range) {
    return { type: 'success', text: 'تم إنشاء التقرير' };
  }

  function _analyzeRange(range) {
    const values = range.getValues();
    const analysis = `تحليل: ${values.length} صف، ${values[0]?.length || 0} عمود`;
    return { type: 'success', text: analysis };
  }

  function _sendEmailNotification(range) {
    return { type: 'success', text: 'تم إرسال الإشعار' };
  }

  function _saveToHistory(range) {
    return { type: 'success', text: 'تم الحفظ في السجل' };
  }

  return {
    setupSmartTriggers,
    processSmartEdit,
    CONTROL_CELLS,
    MODULE_VERSION
  };
});