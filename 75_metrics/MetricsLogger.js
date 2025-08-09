// *************************************************************************************************
// --- START OF FILE: 75_metrics/MetricsLogger.js ---
// *************************************************************************************************

/**
 * @file 75_metrics/MetricsLogger.js
 * @module System.MetricsLogger
 * @version 1.1.0
 * @author عبدالعزيز
 * @description
 * وحدة مركزية وموحدة لتسجيل المقاييس والأحداث من جميع أنحاء المشروع.
 * توفر واجهة واحدة لإرسال السجلات إلى وجهات متعددة مثل LongTermMemory،
 * Telemetry، و Google Sheets، مع معالجة آمنة للأخطاء لضمان عدم تأثيرها على العمليات الرئيسية.
 */

defineModule('System.MetricsLogger', ({ Utils, AI, Telemetry, DocsManager }) => {

  // مرحلة 9: تسجيل وثائق الوحدة
  DocsManager.registerModuleDocs('System.MetricsLogger', [
    {
      name: 'record',
      version: '1.1.0',
      description: 'يسجل حدثًا أو مقياسًا في جميع وجهات التسجيل المكونة (LTM, Telemetry, Sheets) بشكل آمن.',
      parameters: {
        type: 'OBJECT',
        properties: {
          module: { type: 'STRING', description: 'اسم الوحدة المصدر.', required: true },
          action: { type: 'STRING', description: 'اسم الإجراء أو الدالة.', required: true },
          version: { type: 'STRING', description: 'إصدار الوحدة المصدر.', required: true },
          status: { type: 'STRING', description: 'حالة العملية (e.g., "success", "error").', required: true },
          durationMs: { type: 'NUMBER', description: 'مدة العملية بالمللي ثانية.', required: true },
          sheetName: { type: 'STRING', description: 'اسم ورقة Google Sheet للتسجيل (اختياري).', optional: true },
          sheetHeaders: { type: 'ARRAY', description: 'رؤوس الأعمدة لورقة Google Sheet (اختياري).', optional: true },
          sheetRow: { type: 'ARRAY', description: 'الصف المراد إضافته إلى ورقة Google Sheet (اختياري).', optional: true },
          meta: { type: 'OBJECT', description: 'بيانات وصفية إضافية (اختياري).', optional: true }
        }
      }
    }
  ]);

  function record({ module, action, version, status, durationMs, sheetName, sheetHeaders, sheetRow, meta = {} }) {
    Utils.executeSafely(() => {
      const ts = new Date().toISOString();
      const recordData = { module, action, version, timestamp: ts, status, durationMs, ...meta };

      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save(`${module.replace(/\./g, '_')}Invocation`, recordData);
      }
      if (Telemetry?.track) {
        Telemetry.track(`${module}.Invocation`, recordData);
      }
      if (sheetName && sheetHeaders && sheetRow) {
        const sheet = Utils.getSheet(sheetName, sheetHeaders);
        if (sheet) sheet.appendRow(sheetRow);
        else Utils.warn(`MetricsLogger: Could not get sheet '${sheetName}'.`);
      }
    }, [], `MetricsLogger.record[${module}.${action}]`);
  }

  return { record };
});

// *************************************************************************************************
// --- END OF FILE: 75_metrics/MetricsLogger.js ---
// *************************************************************************************************
