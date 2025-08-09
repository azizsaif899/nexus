/**
 * @module System.AgentDispatcher.Core
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AgentDispatcher.Core', ({ AgentDispatcher }) => {
  // === المحتوى الأصلي ===
  
  /**
   * @file 25_ai_agents/agent_dispatcher.gs
   * @module System.AgentDispatcher.Core
   * @version 1.0.2 // ✅ تحديث الإصدار بعد المراجعة النهائية والتنظيف
   * @author عبدالعزيز
   * @description
   * وحدة توجيه رسائل المستخدم إلى وكلاء G-Assistant:
   * • يستخدم AI.IntentAnalyzer لتحديد النية (أي وكيل يستجيب)
   * • ينادي الدالة المناسبة في AgentsCatalog بناءً على النية
   * • يسجل كل استدعاء في الذاكرة طويلة الأمد وTelemetry وورقة المقاييس
   */
  
  
  
  const MODULE_VERSION = Config.get('AGENT_DISPATCHER_VERSION') || '1.0.2';
    const METRICS_SHEET = Config.get('AGENT_DISPATCHER_METRICS_SHEET') || 'AgentDispatcher_Metrics';
  
    // مرحلة 9: تسجيل الوثائق
    DocsManager.registerModuleDocs('System.AgentDispatcher.Core', [
      {
        name: 'dispatch',
        version: MODULE_VERSION,
        description: 'يتلقى الرسالة ويحدد الوكيل المناسب بناءً على النية، ثم يوجّهها إليه.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            sessionId: { type: 'STRING', description: 'معرف جلسة المستخدم.', required: true },
            message: { type: 'STRING', description: 'نص رسالة المستخدم.', required: true },
          required: ['sessionId', 'message'
        },
  
    returns: {
  }
          type: 'OBJECT',
          description: 'استجابة الوكيل بـ { type, text, data? }.'
        }
    ]);
  
    /**
     * يسجل استدعاء dispatch في LongTermMemory وTelemetry وSheet.
     * @param {string} status - حالة العملية.
     * @param {number} durationMs - مدة العملية بالمللي ثانية.
     * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
     * @private
     */
    function _recordInvocation(status, durationMs, meta = {}) {
      MetricsLogger.record({
        module: 'System.AgentDispatcher.Core',
        action: 'dispatch',
        version: MODULE_VERSION,
        status: status,
        durationMs: durationMs,
        sheetName: METRICS_SHEET,
        sheetHeaders: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'SessionId', 'Agent', 'IntentType', 'ToolName', 'ErrorMessage'],
        sheetRow: [
          new Date(),
          'dispatch',
          status,
          durationMs,
          MODULE_VERSION,
          meta.sessionId || '',
          meta.agent || '',
          meta.intentType || '',
          meta.toolName || '',
          meta.errorMessage || ''
        ],
        meta: meta
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});