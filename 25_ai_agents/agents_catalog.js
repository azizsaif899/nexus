// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/agents_catalog.gs ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/agents_catalog.gs
 * @module System.Agents.Catalog
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * كتالوج لكل وكلاء G-Assistant:
 * • DeveloperAgent  
 * • GeneralAgent  
 * • CFOAgent  (مثال لوكيل مالي)
 */

defineModule('System.Agents.Catalog', ({ Utils }) => {
  // Get agents from the injector directly since they're already registered
  const injector = GAssistant.Utils.Injector;
  
  function getAgentModule(moduleName) {
    try {
      return injector.get(moduleName)[moduleName];
    } catch (e) {
      Utils.warn(`Agents.Catalog: Failed to get ${moduleName}: ${e.message}`);
      return null;
    }
  }
  
  // Lazy loading of agents to avoid circular dependencies
  const agents = {
    get DeveloperAgent() {
      const agent = getAgentModule('System.AgentDeveloper');
      return agent?.handleRequest;
    },
    get GeneralAgent() {
      const agent = getAgentModule('System.AgentGeneral');
      return agent?.handleRequest;
    },
    get CFOAgent() {
      const agent = getAgentModule('System.AgentCFO');
      return agent?.handleRequest;
    }
  };

  /**
   * يعيد دالة الوكيل المطلوبة أو الـ GeneralAgent كافتراضي إذا لم يتم العثور على الوكيل المحدد.
   * @param {string} agentName اسم الوكيل المطلوب (مثل 'DeveloperAgent', 'CFOAgent').
   * @returns {Function} دالة handleRequest للوكيل المطلوب، أو دالة handleRequest للوكيل العام (GeneralAgent) إذا لم يتم العثور على الوكيل.
   */
  function getAgent(agentName) {
    try {
      // التحقق مما إذا كان الوكيل موجودًا في الكتالوج
      const agentHandler = agents[agentName];
      if (agentHandler && typeof agentHandler === 'function') {
        return agentHandler;
      } else {
        // إذا لم يتم العثور على الوكيل، يتم إرجاع الوكيل العام كافتراضي.
        Utils.warn(`Agents.Catalog: Agent '${agentName}' not found or not ready. Falling back to GeneralAgent.`);
        const fallbackHandler = agents.GeneralAgent;
        if (fallbackHandler && typeof fallbackHandler === 'function') {
          return fallbackHandler;
        } else {
          // إذا فشل حتى الوكيل العام، إرجاع دالة آمنة
          Utils.error('Agents.Catalog: Even GeneralAgent is not available. Returning safe fallback.');
          return ({ sessionId, message, intent }) => ({
            type: 'error',
            text: 'عذراً، الوكلاء غير متوفرين حالياً. يرجى المحاولة لاحقاً.'
          });
        }
      }
    } catch (e) {
      Utils.error(`Agents.Catalog.getAgent failed for '${agentName}': ${e.message}`);
      return ({ sessionId, message, intent }) => ({
        type: 'error',
        text: `خطأ في الوصول للوكيل: ${e.message}`
      });
    }
  }

  const exports = {
    getAgent,
    MODULE_VERSION: '1.0.0'
  };

  // Register with main AI.Agents module
  if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.Agents) {
    GAssistant.AI.Agents.registerSubModule('Catalog', exports);
  }

  return exports;
});

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/agents_catalog.gs ---
// *************************************************************************************************
