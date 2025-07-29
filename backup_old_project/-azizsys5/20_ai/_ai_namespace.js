// *************************************************************************************************
// --- START OF FILE: 20_ai/_ai_namespace.js ---
// *************************************************************************************************

/**
 * @file 20_ai/_ai_namespace.js
 * @module System.AI
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * هذا الملف بمثابة عنصر نائب لمساحة الاسم لوحدة System.AI.
 * يضمن تعريف مساحة الاسم 'AI' بشكل صحيح وإتاحتها للوحدات الأخرى التي تعتمد عليها،
 * مما يحل شجرة التبعيات بشكل صحيح. لا يصدر أي وظائف بنفسه.
 */

defineModule('System.AI', ({ Utils }) => {
  const _subModules = {};

  /**
   * تسجل وحدة فرعية مع حاوية الذكاء الاصطناعي الرئيسية.
   * يسمح هذا لحاوية الذكاء الاصطناعي بالعمل كواجهة موحدة (facade).
   * @param {string} name - اسم الوحدة الفرعية (e.g., 'Core', 'Context').
   * @param {object} reference - الكائن المصدّر للوحدة الفرعية.
   */
  function registerSubModule(name, reference) {
    if (_subModules[name]) {
      Utils.warn(`System.AI: Submodule '${name}' is being re-registered.`);
    }
    _subModules[name] = reference;
    Utils.log(`System.AI: Registered submodule -> ${name}`);
  }

  /**
   * دالة واجهة (facade) تفوض استدعاء 'ask' إلى الوحدة الفرعية Core.
   * توفر نقطة دخول واحدة ومستقرة لتفاعلات الذكاء الاصطناعي.
   * @param {string} userPrompt - طلب المستخدم.
   * @param {object} options - خيارات لاستدعاء 'ask'.
   * @returns {object} UiResponse
   */
  function ask(userPrompt, options = {}) {
    if (_subModules.Core && typeof _subModules.Core.ask === 'function') {
      return _subModules.Core.ask(userPrompt, options);
    }
    Utils.error('System.AI.ask: Core submodule is not registered or does not have an "ask" function.');
    return { type: 'error', text: 'AI Core service is not available.' };
  }

  /**
   * تجلب إصدار نظام الذكاء الاصطناعي، ويمكن أن تجمع الإصدارات من الوحدات الفرعية.
   * @returns {string} إصدار نظام الذكاء الاصطناعي.
   */
  function getVersion() {
    const coreVersion = _subModules.Core?.MODULE_VERSION || 'N/A';
    // يمكن إضافة المزيد من الوحدات هنا
    return `AI System (Core: v${coreVersion})`;
  }

  return {
    registerSubModule,
    ask,
    getVersion,
    getSubModule: (name) => _subModules[name]
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/_ai_namespace.js ---
// *************************************************************************************************