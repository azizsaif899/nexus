// *************************************************************************************************
// --- START OF FILE: 75_metrics/MetricsLogger.js ---
// *************************************************************************************************

/**
 * @file 75_metrics/MetricsLogger.js
 * @module System.MetricsLogger
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة مركزية وموحدة لتسجيل المقاييس والأحداث من جميع أنحاء المشروع.
 * توفر واجهة واحدة لإرسال السجلات إلى وجهات متعددة مثل LongTermMemory،
 * Telemetry، و Google Sheets، مما يقلل من تكرار الكود ويسهل الصيانة.
 */

defineModule('System.MetricsLogger', ({ Utils, AI, Telemetry }) => {

  /**
   * يسجل حدثًا أو مقياسًا في جميع وجهات التسجيل المكونة.
   * @param {object} args - كائن يحتوي على بيانات السجل.
   * @param {string} args.module - اسم الوحدة المصدر (e.g., 'System.AI.Core').
   * @param {string} args.action - اسم الإجراء أو الدالة التي تم تنفيذها.
   * @param {string} args.version - إصدار الوحدة المصدر.
   * @param {string} args.status - حالة العملية (e.g., 'success', 'error').
   * @param {number} args.durationMs - مدة العملية بالمللي ثانية.
   * @param {string} [args.sheetName] - (اختياري) اسم ورقة Google Sheet للتسجيل.
   * @param {string[]} [args.sheetHeaders] - (اختياري) رؤوس الأعمدة لورقة Google Sheet.
   * @param {any[]} [args.sheetRow] - (اختياري) الصف المراد إضافته إلى ورقة Google Sheet.
   * @param {object} [args.meta={}] - (اختياري) بيانات وصفية إضافية.
   */
  function record({ module, action, version, status, durationMs, sheetName, sheetHeaders, sheetRow, meta = {} }) {
    const ts = new Date().toISOString();
    const recordData = { module, action, version, timestamp: ts, status, durationMs, ...meta };

    // 1. التسجيل في الذاكرة طويلة الأمد (LTM)
    if (AI && AI.LongTermMemory && typeof AI.LongTermMemory.save === 'function') {
      AI.LongTermMemory.save(`${module.replace(/\./g, '_')}Invocation`, recordData);
    }

    // 2. التسجيل في نظام القياس عن بعد (Telemetry)
    if (Telemetry && typeof Telemetry.track === 'function') {
      Telemetry.track(`${module}.Invocation`, recordData);
    }

    // 3. التسجيل في Google Sheets
    if (sheetName && sheetHeaders && sheetRow) {
      const sheet = Utils.getSheet(sheetName, sheetHeaders);
      if (sheet) {
        sheet.appendRow(sheetRow);
      } else {
        Utils.warn(`MetricsLogger: Could not get sheet '${sheetName}'.`);
      }
    }
  }

  return { record };
});

// *************************************************************************************************
// --- END OF FILE: 75_metrics/MetricsLogger.js ---
// *************************************************************************************************