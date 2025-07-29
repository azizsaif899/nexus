// *************************************************************************************************
// --- START OF FILE: 20_ai/3_ai_dispatcher.js (Core) ---
// *************************************************************************************************

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

defineModule('System.AgentDispatcher.Core', ({ Utils, Config, DocsManager, AI, Telemetry, AgentsCatalog, UI, MetricsLogger, Router, ModuleVerifier }) => {
  const MODULE_VERSION = Config.get('AGENT_DISPATCHER_VERSION') || '1.0.2';
  const METRICS_SHEET = Config.get('AGENT_DISPATCHER_METRICS_SHEET') || 'AgentDispatcher_Metrics';

  // مرحلة 9: تسجيل الوثائق
  DocsManager.registerModuleDocs('System.AgentDispatcher.Core', [
    {
      name: 'dispatch',
      version: MODULE_VERSION,
      description: 'يتلقى الرسالة ويحدد الوكيل المناسب بناءً على النية، ثم يوجّهها إليه.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف جلسة المستخدم.', required: true },
          message: { type: 'STRING', description: 'نص رسالة المستخدم.', required: true }
        },
        required: ['sessionId', 'message']
      },
      returns: {
        type: 'OBJECT',
        description: 'استجابة الوكيل بـ { type, text, data? }.'
      }
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
    });
  }

  /**
   * يوجّه طلب المستخدم إلى الوكيل المناسب بناءً على النية المكتشفة.
   * @param {{ sessionId: string, message: string }} args
   * @returns {object} استجابة الوكيل (UiResponse).
   */
  function dispatch({ sessionId, message }) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let agentName = '';
    let toolName = '';
    let intentType = '';
    let finalResponse = null;

    try {
      // ✅ تطبيق البرمجة الدفاعية (المرحلة 5 من التحليل)
      if (!ModuleVerifier?.checkReady('AI', ['IntentAnalyzer'])) {
        throw new Error("AgentDispatcher: Dependency 'IntentAnalyzer' is not ready.");
      }
      if (!ModuleVerifier?.checkReady('Router', ['route'])) {
        throw new Error("AgentDispatcher: Dependency 'Router' is not ready.");
      }
      if (!ModuleVerifier?.checkReady('AgentsCatalog', ['getAgent'])) {
        throw new Error("AgentDispatcher: Dependency 'AgentsCatalog' is not ready.");
      }
      if (!AgentsCatalog) {
        throw new Error("فشل حرج: كتالوج الوكلاء (AgentsCatalog) غير مهيأ أو مفقود.");
      }

      Utils.validateString(sessionId, 'sessionId');
      Utils.validateString(message, 'message');

      // 1. تحليل النية لاختيار الوكيل
      const intentResult = AI.IntentAnalyzer.detectIntent({ userPrompt: message });
      intentType = intentResult.type;
      toolName = intentResult.toolName || '';
      Utils.log(`System.AgentDispatcher.Core: Intent detected: ${JSON.stringify(intentResult)}`);

      // 2. توجيه النية إلى الوكيل المناسب باستخدام Router
      agentName = Router.route({ intent: intentResult });
      Utils.log(`System.AgentDispatcher.Core: Intent routed to agent: '${agentName}'`);

      // 2. جلب مثيل الوكيل من الكتالوج
      const agentHandler = AgentsCatalog.getAgent(agentName);
      if (typeof agentHandler !== 'function') {
        status = 'agent_not_found_or_callable';
        errorMessage = `Agent handler for '${agentName}' not found or is not a callable function.`;
        throw new Error(errorMessage);
      }

      // 3. استدعاء دالة الوكيل (handleRequest)
      // تمرير كامل كائن النية إلى الوكيل ليتعامل مع التفاصيل
      finalResponse = agentHandler({
        sessionId,
        message,
        intent: intentResult
      });
      status = finalResponse.type || 'success'; // افتراض أن الوكيل يعيد كائن UiResponse-like

      return finalResponse;

    } catch (e) {
      errorMessage = e.message;
      Utils.error(`System.AgentDispatcher.Core: ${errorMessage}`, e.stack);
      status = 'exception';
      return UI.Dialogue.createError(`💥 فشل التوجيه: ${errorMessage}`);

    } finally {
      const duration = Date.now() - start;
      _recordInvocation(status, duration, {
        sessionId,
        agent: agentName,
        intentType: intentType,
        toolName: toolName,
        errorMessage
      });
    }
  }

  return {
    dispatch
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/3_ai_dispatcher.js (Core) ---
// *************************************************************************************************
