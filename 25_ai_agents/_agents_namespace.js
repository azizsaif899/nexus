// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/_agents_namespace.js ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/_agents_namespace.js
 * @module System.AI.Agents
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * مساحة الأسماء الرئيسية لجميع وكلاء الذكاء الاصطناعي المحسنة
 */

defineModule('System.AI.Agents', ({ Utils, Config, DocsManager }) => {
  const MODULE_VERSION = '2.0.0';
  
  DocsManager.registerModuleDocs('System.AI.Agents', [
    {
      name: 'registerSubModule',
      version: MODULE_VERSION,
      description: 'تسجيل وحدة فرعية للوكلاء',
      parameters: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING', required: true },
          module: { type: 'OBJECT', required: true }
        }
      }
    }
  ]);

  const subModules = {};

  function registerSubModule(name, module) {
    subModules[name] = module;
    Utils.log(`AI.Agents: Registered submodule ${name}`);
  }

  return {
    registerSubModule,
    ...subModules,
    MODULE_VERSION
  };
});

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/_agents_namespace.js ---
// *************************************************************************************************