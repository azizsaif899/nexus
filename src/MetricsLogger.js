/**
 * @module System.MetricsLogger
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.MetricsLogger', ({ MetricsLogger }) => {
  // === المحتوى الأصلي ===
  
  
  /**
   * @file 75_metrics/MetricsLogger.js
   * @module System.MetricsLogger
   * @version 1.1.0 // ✅ تحديث الإصدار ليعكس التحسينات في معالجة الأخطاء
   * @author عبدالعزيز
   * @description
   * وحدة مركزية وموحدة لتسجيل المقاييس والأحداث من جميع أنحاء المشروع.
   * توفر واجهة واحدة لإرسال السجلات إلى وجهات متعددة مثل LongTermMemory،
   * Telemetry، و Google Sheets، مع معالجة آمنة للأخطاء لضمان عدم تأثيرها على العمليات الرئيسية.
   */
  
  
  
  // مرحلة 9: تسجيل وثائق الوحدة
    DocsManager.registerModuleDocs('System.MetricsLogger', [
      {
        name: 'record',
        version: '1.1.0',
        description: 'يسجل حدثًا أو مقياسًا في جميع وجهات التسجيل المكونة (LTM, Telemetry, Sheets) بشكل آمن.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            module: { type: 'STRING', description: 'اسم الوحدة المصدر.', required: true },
            action: { type: 'STRING', description: 'اسم الإجراء أو الدالة.', required: true },
            version: { type: 'STRING', description: 'إصدار الوحدة المصدر.', required: true },
            status: { type: 'STRING', description: 'حالة العملية (e.g., "success", "error").', required: true },
            durationMs: { type: 'NUMBER', description: 'مدة العملية بالمللي ثانية.', required: true },
            sheetName: { type: 'STRING', description: 'اسم ورقة Google Sheet للتسجيل (اختياري).', optional: true },
            sheetHeaders: { type: 'ARRAY', description: 'رؤوس الأعمدة لورقة Google Sheet (اختياري).', optional: true },
            sheetRow: { type: 'ARRAY', description: 'الصف المراد إضافته إلى ورقة Google Sheet (اختياري).', optional: true },
            meta: { type: 'OBJECT', description: 'بيانات وصفية إضافية (اختياري).', optional: true }
    ]);
  
    /**
     * يسجل حدثًا أو مقياسًا في جميع وجهات التسجيل المكونة.
     * @param {object} args - كائن يحتوي على بيانات السجل.
     * ... (بقية المعلمات كما هي في JSDoc أعلاه)
     */
    function record({ module, action, version, status, durationMs, sheetName, sheetHeaders, sheetRow, meta = {} }) {
      // ✅ استخدام executeSafely لضمان عدم تسبب أخطاء التسجيل في إيقاف العمليات الرئيسية
      Utils.executeSafely(() => {
        const ts = new Date().toISOString();
        const recordData = { module, action, version, timestamp: ts, status, durationMs, ...meta
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});