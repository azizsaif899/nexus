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

'use strict';

// لاحظ أن التبعيات (DevAgent, CFOAgent, GeneralAgent) سيتم حقنها بواسطة defineModule
// ويجب أن تكون هذه الوحدات معرفة في ملفاتها الخاصة (مثل agent_developer.gs, agent_cfo.gs, general_agent.gs)
// وأن تكون قد تم تسجيلها في النظام لكي يتمكن Injector من جلبها.
defineModule('System.Agents.Catalog', ({ 
  DevAgent,         // مستورد من System.AgentDeveloper
  CFOAgent,         // مستورد من System.AgentCFO
  GeneralAgent      // مستورد من System.GeneralAgent (يجب إنشاء هذا الملف إذا لم يكن موجودًا)
}) => {
  // خريطة اسم الوكيل ← دالة handleRequest في الوكيل
  // يتم هنا ربط اسم الوكيل بالدالة المسؤولة عن معالجة الطلبات لهذا الوكيل.
  const agents = {
    DeveloperAgent: DevAgent.handleRequest,
    GeneralAgent:   GeneralAgent.handleRequest,
    CFOAgent:       CFOAgent.handleRequest
  };

  /**
   * يعيد دالة الوكيل المطلوبة أو الـ GeneralAgent كافتراضي إذا لم يتم العثور على الوكيل المحدد.
   * @param {string} agentName اسم الوكيل المطلوب (مثل 'DeveloperAgent', 'CFOAgent').
   * @returns {Function} دالة handleRequest للوكيل المطلوب، أو دالة handleRequest للوكيل العام (GeneralAgent) إذا لم يتم العثور على الوكيل.
   */
  function getAgent(agentName) {
    // التحقق مما إذا كان الوكيل موجودًا في الكتالوج
    if (agents[agentName]) {
      return agents[agentName];
    } else {
      // إذا لم يتم العثور على الوكيل، يتم إرجاع الوكيل العام كافتراضي.
      // يجب التأكد من أن GeneralAgent.handleRequest موجودة دائمًا.
      Utils.warn(`Agents.Catalog: Agent '${agentName}' not found. Falling back to GeneralAgent.`);
      return agents.GeneralAgent;
    }
  }

  // الواجهة العامة للوحدة
  return {
    getAgent
  };
});

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/agents_catalog.gs ---
// *************************************************************************************************
