// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/general_agent.gs ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/general_agent.gs
 * @module System.AgentGeneral
 * @version 1.1.0 // Incrementing version for new features
 * @author عبدالعزيز
 * @description
 * الوكيل العام للتعامل مع الاستعلامات غير المتخصصة:
 * • يوفّر ردًا نصيًا عبر AI.Core  
 * • يُرجع هيكلية موحّدة { type, text, data? }  
 * • يسجل التفاعلات في الذاكرة طويلة المدى.
 * • يتعامل مع الأخطاء العامة ويوفر ردودًا احتياطية.
 */

'use strict';

// Adding DocsManager and Config to dependencies
defineModule('System.AgentGeneral', ({ Utils, AI, DocsManager, Config }) => {
  const MODULE_VERSION = '1.1.0'; // Define module version

  // Register documentation for the module and its functions
  DocsManager.registerModuleDocs('System.AgentGeneral', [
    {
      name: 'handleRequest',
      version: MODULE_VERSION,
      description: 'الواجهة الموحدة لاستقبال الطلبات العامة ومعالجتها عبر AI.Core، مع دعم تسجيل الذاكرة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة للمحادثة.', required: true },
          message:   { type: 'STRING', description: 'نص رسالة المستخدم.', required: true },
          intent:    { type: 'OBJECT', description: 'كائن النية المكتشفة من IntentAnalyzer.', required: true }
        },
        required: ['sessionId', 'message', 'intent']
      },
      returns: {
        type: 'OBJECT',
        description: 'استجابة موحدة ({ type: string, text: string, data?: object }).'
      }
    }
  ]);

  /**
   * الواجهة الموحدة لاستقبال الطلبات العامة.
   * @param {{ sessionId: string, message: string, intent: object }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function handleRequest({ sessionId, message, intent }) {
    Utils.log(`AgentGeneral.handleRequest received: SessionId = "${sessionId}", Message = "${message}", Intent Type = "${intent.type}"`);

    let response;
    try {
      // 1. معالجة مسبقة للرسائل (Pre-processing - بسيطة هنا)
      const processedMessage = message.trim(); // تنظيف بسيط للمسافات البيضاء

      // 2. توجيه الاستعلام الأساسي إلى AI.Core مع سياق إضافي
      // يمكن تخصيص الـ prompt ليوجه AI.Core بشكل أفضل للاستعلامات العامة.
      const promptForAI = `أنت مساعد عام وودود. أجب على السؤال التالي بوضوح وإيجاز: "${processedMessage}"`;
      
      // التأكد من أن AI.Core متاح وقابل للاستدعاء
      if (!AI || !AI.Core || typeof AI.Core.ask !== 'function') {
        Utils.error('AgentGeneral: AI.Core.ask is not defined or callable.');
        response = { type: 'error', text: 'فشل في معالجة الطلب: خدمة الذكاء الاصطناعي غير متوفرة.' };
      } else {
        // تمرير sessionId لـ AI.Core للحفاظ على سياق المحادثة
        // يمكن أيضًا تمرير generationConfig مخصص هنا للاستعلامات العامة
        const aiResponse = AI.Core.ask(promptForAI, { sessionId: sessionId });
        
        // 3. التعامل مع الاستجابات المتعددة من AI.Core
        // AI.Core.ask يعيد بالفعل UiResponse، لذا يمكننا ببساطة تمريرها.
        // يمكن هنا إضافة منطق لمعالجة أنواع معينة من الاستجابات إذا لزم الأمر،
        // مثل تنسيق البيانات الجدولية أو الكود.
        response = {
          type: aiResponse.type || 'text_response',
          text: aiResponse.text || 'لم أتمكن من الحصول على إجابة. الرجاء المحاولة مرة أخرى.',
          data: aiResponse.data
        };

        // 4. التكامل مع الذاكرة طويلة المدى (LongTermMemory)
        if (AI.LongTermMemory && typeof AI.LongTermMemory.save === 'function') {
          AI.LongTermMemory.save('GeneralAgentInteraction', {
            sessionId: sessionId,
            userMessage: processedMessage,
            aiResponse: { type: response.type, text: response.text.substring(0, Math.min(response.text.length, 500)) } // حفظ جزء من الرد
          });
          Utils.log('AgentGeneral: Interaction saved to LongTermMemory.');
        } else {
          Utils.warn('AgentGeneral: AI.LongTermMemory.save is not available. Interaction not saved.');
        }
      }

      return response;

    } catch (e) {
      // 5. التعامل مع الأخطاء العامة
      Utils.error(`AgentGeneral.handleRequest failed for session '${sessionId}': ${e.message}`, e.stack);
      return { type: 'error', text: `💥 حدث خطأ أثناء معالجة طلبك: ${e.message}` };
    }
  }

  return {
    handleRequest
  };
});
// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/test_general_agent.gs ---
// *************************************************************************************************

/**
 * دالة اختبار للوكلاء العامين.
 */
function testGeneralAgent() {
  const res = System.AgentGeneral.handleRequest({
    sessionId: 'test-session',
    message:   'ما هو الطقس اليوم؟',
    intent:    { type: 'general_query', data: {} }
  });
  Logger.log('AgentGeneral response: %s', JSON.stringify(res));
}

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/test_general_agent.gs ---
// *************************************************************************************************

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/general_agent.gs ---
// *************************************************************************************************
