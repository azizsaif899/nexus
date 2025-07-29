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

'use strict';

defineModule('System.AgentDispatcher.Core', ({ Utils, Config, DocsManager, AI, Telemetry, AgentsCatalog, UI, MetricsLogger }) => {
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
      Utils.validateString(sessionId, 'sessionId');
      Utils.validateString(message, 'message');

      // 1. تحليل النية لاختيار الوكيل
      const intentResult = AI.IntentAnalyzer.detectIntent({ userPrompt: message });
      intentType = intentResult.type;
      toolName = intentResult.toolName || '';

      Utils.log(`System.AgentDispatcher.Core: Intent detected: ${JSON.stringify(intentResult)}`);

      if (intentResult.type === 'tool_call' && intentResult.toolName) {
        // إذا كانت النية هي استدعاء أداة مباشرة، حدد الوكيل بناءً على اسم الأداة
        if (intentResult.toolName.startsWith('Developer.')) {
          agentName = 'developer'; // افتراض أن وكيل 'developer' يتعامل مع جميع أدوات المطور
        } else if (intentResult.toolName.startsWith('System.Info.')) {
          agentName = 'default'; // أو يمكن توجيهها لوكيل 'system' إذا كان موجودًا
        }
        // يمكن إضافة المزيد من قواعد التوجيه هنا لأدوات وكلاء آخرين
        else {
          agentName = 'default'; // وكيل افتراضي للأدوات غير المحددة
          Utils.warn(`System.AgentDispatcher.Core: Unmapped tool '${intentResult.toolName}'. Routing to default agent.`);
        }
      } else if (intentResult.type === 'general_query') {
        // إذا كانت النية استعلامًا عامًا، وجهها إلى وكيل افتراضي (مثلاً وكيل CFO أو وكيل AI عام)
        agentName = 'cfo'; // افتراض أن وكيل CFO هو الوكيل العام الرئيسي
      } else if (intentResult.type === 'clarification_needed') {
        // إذا كانت النية تتطلب توضيحًا، أعد رسالة تحذير مباشرة
        status = 'clarification_needed';
        errorMessage = intentResult.errorMessage || 'الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.';
        finalResponse = UI.Dialogue.createWarning(errorMessage);
        return finalResponse; // الخروج مبكرًا
      } else {
        // نوع نية غير متوقع
        status = 'unknown_intent_type';
        errorMessage = 'حدث خطأ غير متوقع في تحليل النية.';
        finalResponse = UI.Dialogue.createError(errorMessage);
        return finalResponse; // الخروج مبكرًا
      }

      // 2. جلب مثيل الوكيل من الكتالوج
      const agentInstance = AgentsCatalog.getAgent(agentName);
      if (!agentInstance || typeof agentInstance.handleRequest !== 'function') {
        status = 'agent_not_found_or_callable';
        errorMessage = `Agent '${agentName}' not found or does not have a 'handleRequest' method.`;
        throw new Error(errorMessage);
      }

      // 3. استدعاء دالة الوكيل (handleRequest)
      // تمرير كامل كائن النية إلى الوكيل ليتعامل مع التفاصيل
      finalResponse = agentInstance.handleRequest({
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
