// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/agent_dispatcher.gs (Legacy) ---
// *************************************************************************************************

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

defineModule('System.AgentDispatcher.Legacy', ({ Utils, Config, DocsManager, AI, Telemetry, AgentsCatalog }) => {
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
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرّف جلسة المستخدم.', required: true },
          message:   { type: 'STRING', description: 'نص رسالة المستخدم.',    required: true }
        },
        required: ['sessionId','message']
      },
      returns: {
        type: 'OBJECT',
        description: 'استجابة الوكيل الموحدة ({ type, text, data? }).'
      }
    }
  ]);

  /**
   * يسجّل استدعاء dispatch في LTM، Telemetry، وSheet.
   * @param {string} status 
   * @param {number} durationMs 
   * @param {object} [meta={}] 
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
    };

    // مرحلة 10: LongTermMemory
    AI.LongTermMemory.save('AgentDispatcherInvocation', rec);

    // مرحلة 11: Telemetry
    Telemetry.track('AgentDispatcher.Invocation', rec);

    // مرحلة 17: Google Sheets Metrics
    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp','Action','Status','DurationMs','Version','SessionId','Agent','IntentType'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        rec.action,
        rec.status,
        rec.durationMs,
        rec.version,
        meta.sessionId || '',
        meta.agent       || '',
        meta.intentType|| ''
      ]);
    }
  }

  /**
   * يوجّه الطلب بناءً على النية المكتشفة:
   * • tool_call → يحدد الوكيل حسب intent.data.toolName  
   * • general_query → يوجّه للوكيل الافتراضي  
   * • clarification_needed → يرد بتحذير للمستخدم  
   * @param {{ sessionId: string, message: string }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function dispatch({ sessionId, message }) {
    const start      = Date.now();
    let status       = 'error';
    let agentName    = '';
    let intentType   = '';
    let response     = { type:'error', text:'فشل التوجيه: خطأ غير معروف.' };

    try {
      Utils.validateString(sessionId, 'sessionId');
      Utils.validateString(message,   'message');

      // 1. اكتشاف النية
      const intentRes = AI.IntentAnalyzer.detectIntent({ action: message });
      intentType = intentRes.type;
      const intentData = intentRes.data || {};

      // 2. تحديد الوكيل أو الرد مباشرة
      switch (intentType) {
        case 'tool_call':
          const toolName = intentData.toolName || intentData.functionName || '';
          if (toolName.startsWith('Developer.')) {
            agentName = 'DeveloperAgent';
          } else {
            agentName = Config.get('AGENT_TOOL_EXECUTOR') || 'GeneralAgent';
          }
          break;

        case 'general_query':
          agentName = Config.get('AGENT_DEFAULT') || 'GeneralAgent';
          break;

        case 'clarification_needed':
          status   = 'clarification_needed';
          response = { type:'warning', text:'هل يمكنك توضيح طلبك أكثر من فضلك؟' };
          break;

        default:
          agentName = Config.get('AGENT_DEFAULT') || 'GeneralAgent';
      }

      // 3. استدعاء handleRequest للوكيل إذا لزم الأمر
      if (intentType !== 'clarification_needed') {
        const agentFn = AgentsCatalog.getAgent(agentName);
        if (typeof agentFn !== 'function') {
          throw new Error(`Agent not found: ${agentName}`);
        }
        response = agentFn({ sessionId, message, intent: intentRes });
        status   = response.type || 'success';
      }

      return response;

    } catch (e) {
      const errMsg = e.message;
      Utils.error(`System.AgentDispatcher.Legacy: ${errMsg}`, e.stack);
      return { type:'error', text:`فشل التوجيه: ${errMsg}` };

    } finally {
      const duration = Date.now() - start;
      _recordInvocation(status, duration, {
        sessionId,
        agent:    agentName,
        intentType
      });
    }
  }

  return {
    dispatch
  };
});

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/agent_dispatcher.gs (Legacy) ---
// *************************************************************************************************
