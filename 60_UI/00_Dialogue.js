// *************************************************************************************************
// --- START OF FILE: 10_ui/0_ui_dialogue.gs ---
// *************************************************************************************************

/**
 * @file 10_ui/0_ui_dialogue.gs
 * @module System.UI.Dialogue
 * @version 20
 * @author عبدالعزيز
 * @description
 * وحدة لإنشاء كائنات تفاعل مع المستخدم (نجاح، خطأ، تحذير، جداول).
 * تضم:
 *   • تسجيل Telemetry لكل استدعاء (مرحلة 11)
 *   • حفظ في LongTermMemory (10)
 *   • تسجيل المقاييس في Sheets (17)
 *   • تضمين رقم الإصدار (18)
 *   • واجهة جاهزة للاختبار (13)
 */

defineModule('System.UI.Dialogue', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = Config.get('UI_DIALOGUE_VERSION') || '1.0.0';

  // مرحلة 9: تسجيل الوثائق
  DocsManager.registerModuleDocs('System.UI.Dialogue', [
    { name: 'createSuccess', version: MODULE_VERSION, description: 'استجابة نجاح.' },
    { name: 'createError',   version: MODULE_VERSION, description: 'استجابة خطأ.' },
    { name: 'createWarning', version: MODULE_VERSION, description: 'استجابة تحذير.' },
    { name: 'createInfo',    version: MODULE_VERSION, description: 'استجابة معلومة.' },
    { name: 'createTable',   version: MODULE_VERSION, description: 'استجابة جدول.' }
  ]);

  /** مسجّل استدعاء موحد: LongTermMemory + Sheets + Telemetry */
  function _recordInvocation(type) {
    const timestamp = new Date().toISOString();

    // مرحلة 10: حفظ في LongTermMemory
    AI.LongTermMemory.save('UIDialogueInvocation', {
      module:  'UI.Dialogue',
      type,
      version: MODULE_VERSION,
      timestamp
    });

    // مرحلة 17: تسجيل في Google Sheets
    Utils.getSheet('UI_Dialogue_Metrics', ['Timestamp','Type','Version'])
      .appendRow([new Date(), type, MODULE_VERSION]);

    // مرحلة 11: إرسال إلى Telemetry
    Telemetry.track('UI.Dialogue.Invocation', {
      type,
      version: MODULE_VERSION,
      timestamp
    });
  }

  function createSuccess(message, data) {
    return Utils.executeSafely(() => {
      if (typeof message !== 'string') throw new Error('createSuccess: message must be a string.');
      const resp = { type: 'success', text: message };
      if (data !== undefined) resp.data = data;
      _recordInvocation('success');
      return resp;
    }, [], `UI.Dialogue.createSuccess[v${MODULE_VERSION}]`);
  }

  function createError(message) {
    return Utils.executeSafely(() => {
      if (typeof message !== 'string') throw new Error('createError: message must be a string.');
      const resp = { type: 'error', text: message };
      _recordInvocation('error');
      return resp;
    }, [], `UI.Dialogue.createError[v${MODULE_VERSION}]`);
  }

  function createWarning(message) {
    return Utils.executeSafely(() => {
      if (typeof message !== 'string') throw new Error('createWarning: message must be a string.');
      const resp = { type: 'warning', text: message };
      _recordInvocation('warning');
      return resp;
    }, [], `UI.Dialogue.createWarning[v${MODULE_VERSION}]`);
  }

  function createInfo(message) {
    return Utils.executeSafely(() => {
      if (typeof message !== 'string') throw new Error('createInfo: message must be a string.');
      const resp = { type: 'info', text: message };
      _recordInvocation('info');
      return resp;
    }, [], `UI.Dialogue.createInfo[v${MODULE_VERSION}]`);
  }

  function createTable(title, headers, rows) {
    return Utils.executeSafely(() => {
      if (typeof title !== 'string') throw new Error('createTable: title must be a string.');
      if (!Array.isArray(headers) || !Array.isArray(rows)) throw new Error('createTable: headers and rows must be arrays.');
      const resp = { type: 'table', title, headers, rows };
      _recordInvocation('table');
      return resp;
    }, [], `UI.Dialogue.createTable[v${MODULE_VERSION}]`);
  }

  return {
    createSuccess,
    createError,
    createWarning,
    createInfo,
    createTable
  };
});

// *************************************************************************************************
// --- END OF FILE: 10_ui/0_ui_dialogue.gs ---
// *************************************************************************************************
