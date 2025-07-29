/**
 * @module System.AI.GeminiAdapter
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AI.GeminiAdapter', ({ AI }) => {
  // === المحتوى الأصلي ===
  
  /**
   * @file 20_ai/6_ai_geminiAdapter.gs
   * @module System.AI.GeminiAdapter
   * @version 2.0.1 // ✅ تحديث الإصدار بعد التحسينات النهائية
   * @author عبدالعزيز
   * @description
   * وحدة وسيط موحدة لاستدعاء نموذج Gemini API مباشرة. تتولى:
   * • بناء الحمولة (Payload) وإرسال طلبات HTTP عبر UrlFetchApp.fetch
   * • تحليل الردود الخام من Gemini API
   * • تسجيل مقاييس التنفيذ في ورقة AI_Gemini_Metrics
   * • تضمين رقم إصدار الوحدة من Config في جميع السجلات
   * • **ملاحظة: لا تستدعي AI.Core أو أي وحدات عليا؛ وظيفتها هي الطبقة الأدنى للتفاعل مع API.**
   */
  
  
  
  const MODULE_VERSION = Config.get('GEMINI_ADAPTER_VERSION') || '2.0.1';
    const DEFAULT_MODEL = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-1.5-pro-latest';
    // const MAX_PROMPT_LEN = Config.get('GEMINI_MAX_PROMPT_LEN') || 8192; // ✅ تم إزالة هذا الثابت لأنه لم يعد يستخدم هنا
    const METRICS_SHEET = Config.get('AI_GEMINI_METRICS_SHEET') || 'AI_Gemini_Metrics'; // ✅ استخدام مفتاح Config
    const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
  
    // مرحلة 9: تسجيل وثائق الوحدة
    DocsManager.registerModuleDocs('System.AI.GeminiAdapter', [
      {
        name: 'callGeminiApi',
        version: MODULE_VERSION,
        description: 'يرسل حمولة (payload) إلى Gemini API ويعيد الرد الخام (JSON).',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            model: { type: 'STRING', description: 'اسم نموذج Gemini المستخدم.', required: true },
            payload: { type: 'OBJECT', description: 'الحمولة الكاملة للطلب.', required: true },
          required: ['model', 'payload'
        },
  
    returns: { type: 'ANY', description: 'الرد الخام من Gemini API.' },
      {
        name: 'healthCheck',
        version: MODULE_VERSION,
        description: 'يجري فحصًا بسيطًا للتأكد من استقرار اتصال Gemini API.'
      }
    ]);
  
    /**
     * يسجل استدعاء API في LTM، Telemetry، وSheet.
     * @param {string} action - نوع الإجراء (مثلاً 'callGeminiApi', 'healthCheck').
     * @param {string} status - حالة العملية ('success', 'api_error', 'exception', 'invalid_response').
     * @param {number} durationMs - مدة العملية بالمللي ثانية.
     * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
     * @private
     */
    function _record(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const rec = {
        module: 'System.AI.GeminiAdapter',
        action,
        version: MODULE_VERSION,
        timestamp: ts,
        status,
        durationMs,
        ...meta
  }
  

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});