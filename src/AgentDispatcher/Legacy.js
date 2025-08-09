/**
 * @module System.AgentDispatcher.Legacy
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AgentDispatcher.Legacy', ({ AgentDispatcher }) => {
  // === المحتوى الأصلي ===
  
  /**
   * @file 25_ai_agents/agent_dispatcher.gs
   * @module System.AgentDispatcher.Legacy
   * @version 1.0.0
   * @author عبدالعزيز
   * @description
   * وحدة توجيه الرسائل إلى وكلاء G-Assistant:
   * • يستخدم IntentAnalyzer.detectIntent لاكتشاف النية  
   * • يوجّه الطلب بناءً على النية (tool_call, general_query, clarification_needed)  
   * • يستدعي handleRequest للوكيل المناسب من AgentsCatalog  
   * • يسجّل كل استدعاء في LongTermMemory وTelemetry وGoogle Sheets  
   */
  
  
  
  const MODULE_VERSION = Config.get('AGENT_DISPATCHER_VERSION')        || '1.0.0';
    const METRICS_SHEET  = Config.get('AGENT_DISPATCHER_METRICS_SHEET') || 'AgentDispatcher_Metrics';
  
    // مرحلة 9: تسجيل الوثائق
    DocsManager.registerModuleDocs('System.AgentDispatcher.Legacy', [
      {
        name: 'dispatch',
        version: MODULE_VERSION,
        description: [
          'يتلقى معرف الجلسة والرسالة، يكتشف النية، ثم يوجّه الطلب للوكيل المناسب.',
          'يدعم النيات: tool_call, general_query, clarification_needed.'
        ].join(' '),
        parameters: {,
          type: 'OBJECT',
          properties: {,
            sessionId: { type: 'STRING', description: 'معرّف جلسة المستخدم.', required: true },
            message:   { type: 'STRING', description: 'نص رسالة المستخدم.',    required: true },
          required: ['sessionId','message'
        },
  
    returns: {
  }
          type: 'OBJECT',
          description: 'استجابة الوكيل الموحدة ({ type, text, data? }).'
        }
    ]);
  
    /**
     * يسجّل استدعاء dispatch في LTM، Telemetry، وSheet.
     * @param {string} status 
     * @param {number} durationMs 
     * @param {object} [meta={}
     * @private
     */
    function _recordInvocation(status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const rec = {
        module:    'System.AgentDispatcher.Legacy',
        action:    'dispatch',
        version:   MODULE_VERSION,
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