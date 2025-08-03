defineModule('System.AI.Agents.Orchestrator', ({ Utils, Config, AI, RoleManager }) => {
  const MODULE_VERSION = '1.0.0';

  function routeRequest({ sessionId, message, intent }) {
    const detectedRole = RoleManager.detectIntentRole(message);
    const rolePrompt = RoleManager.getRolePrompt(detectedRole);

    // تحسين الرسالة بناءً على الدور
    const enhancedPrompt = `${rolePrompt}

السؤال: ${message}

يرجى الإجابة بما يتناسب مع دورك المتخصص.`;

    // توجيه للوكيل المناسب
    switch (detectedRole) {
    case RoleManager.ROLES.FINANCIAL:
      if (GAssistant?.AI?.Agents?.CFO?.handleRequest) {
        return GAssistant.AI.Agents.CFO.handleRequest({
          sessionId,
          message: enhancedPrompt,
          intent: { ...intent, role: detectedRole }
        });
      }
      break;

    case RoleManager.ROLES.PROGRAMMER:
      if (GAssistant?.AI?.Agents?.Developer?.handleRequest) {
        return GAssistant.AI.Agents.Developer.handleRequest({
          sessionId,
          message: enhancedPrompt,
          intent: { ...intent, role: detectedRole }
        });
      }
      break;

    default:
      // استخدام AI العام مع الدور المحدد
      if (AI?.Core?.ask) {
        return AI.Core.ask(enhancedPrompt, {
          sessionId,
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
        });
      }
    }

    return {
      type: 'error',
      text: 'لا يمكن توجيه الطلب للوكيل المناسب'
    };
  }

  return {
    routeRequest,
    MODULE_VERSION
  };
});
