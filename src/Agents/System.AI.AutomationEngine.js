defineModule('System.AI.AutomationEngine', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  const TRIGGER_CELLS = {
    COMMAND_QUEUE: 'AutomationCommands!A:C',
    STATUS_LOG: 'AutomationStatus!A:E'
  };

  function setupAutomationTriggers() {
    try {
      // إزالة المؤقتات الموجودة
      ScriptApp.getProjectTriggers()
        .filter(t => t.getHandlerFunction() === 'onAutomationEdit')
        .forEach(t => ScriptApp.deleteTrigger(t));

      // إنشاء مؤقت onEdit للأتمتة
      ScriptApp.newTrigger('onAutomationEdit')
        .onEdit()
        .create();

      return { type: 'success', text: 'تم إعداد مؤقتات الأتمتة' };
    } catch (e) {
      return { type: 'error', text: `فشل في إعداد المؤقتات: ${e.message}` };
    }
  }

  function processAutomationCommand(command, parameters = {}) {
    const start = Date.now();
    let result;

    try {
      switch (command) {
        case 'SEND_EMAIL':
          result = _sendAutomatedEmail(parameters);
          break;
        case 'CREATE_SHEET':
          result = _createAutomatedSheet(parameters);
          break;
        case 'WEBHOOK_CALL':
          result = _callWebhook(parameters);
          break;
        case 'ANALYZE_DATA':
          result = _analyzeDataRange(parameters);
          break;
        default:
          result = { type: 'error', text: `أمر غير معروف: ${command}` };
      }

      _logAutomationResult(command, result, Date.now() - start);
      return result;
    } catch (e) {
      const errorResult = { type: 'error', text: `خطأ في التنفيذ: ${e.message}` };
      _logAutomationResult(command, errorResult, Date.now() - start);
      return errorResult;
    }
  }

  function _sendAutomatedEmail(params) {
    if (!params.to || !params.subject) {
      return { type: 'error', text: 'معاملات البريد الإلكتروني ناقصة' };
    }

    try {
      MailApp.sendEmail({
        to: params.to,
        subject: params.subject,
        htmlBody: params.body || params.htmlBody || 'رسالة تلقائية من G-Assistant'
      });

      return { type: 'success', text: `تم إرسال البريد إلى ${params.to}` };
    } catch (e) {
      return { type: 'error', text: `فشل في إرسال البريد: ${e.message}` };
    }
  }

  function _createAutomatedSheet(params) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .insertSheet(params.name || `AutoSheet_${Date.now()}`);

      if (params.headers) {
        sheet.getRange(1, 1, 1, params.headers.length).setValues([params.headers]);
      }

      if (params.data) {
        sheet.getRange(2, 1, params.data.length, params.data[0].length).setValues(params.data);
      }

      return { type: 'success', text: `تم إنشاء الورقة: ${sheet.getName()}` };
    } catch (e) {
      return { type: 'error', text: `فشل في إنشاء الورقة: ${e.message}` };
    }
  }

  function _callWebhook(params) {
    if (!params.url) {
      return { type: 'error', text: 'URL الـ webhook مطلوب' };
    }

    try {
      const response = UrlFetchApp.fetch(params.url, {
        method: params.method || 'POST',
        headers: params.headers || { 'Content-Type': 'application/json' },
        payload: JSON.stringify(params.payload || {})
      });

      return {
        type: 'success',
        text: `تم استدعاء webhook بنجاح`,
        data: { status: response.getResponseCode() }
      };
    } catch (e) {
      return { type: 'error', text: `فشل في استدعاء webhook: ${e.message}` };
    }
  }

  function _analyzeDataRange(params) {
    if (!params.range) {
      return { type: 'error', text: 'نطاق البيانات مطلوب' };
    }

    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const range = sheet.getRange(params.range);
      const values = range.getValues();

      const analysis = {
        rowCount: values.length,
        columnCount: values[0]?.length || 0,
        nonEmptyCount: values.flat().filter(cell => cell !== '').length,
        summary: `تحليل النطاق ${params.range}: ${values.length} صف، ${values[0]?.length || 0} عمود`
      };

      return {
        type: 'success',
        text: analysis.summary,
        data: analysis
      };
    } catch (e) {
      return { type: 'error', text: `فشل في تحليل البيانات: ${e.message}` };
    }
  }

  function _logAutomationResult(command, result, duration) {
    try {
      const logSheet = Utils.getSheet('AutomationLog', [
        'Timestamp', 'Command', 'Status', 'Duration', 'Details'
      ]);

      if (logSheet) {
        logSheet.appendRow([
          new Date(),
          command,
          result.type,
          duration,
          result.text
        ]);
      }
    } catch (e) {
      Utils.error('Failed to log automation result', e);
    }
  }

  return {
    setupAutomationTriggers,
    processAutomationCommand,
    MODULE_VERSION
  };
});