// *************************************************************************************************
// --- START OF FILE: 30_tools/DocsManager.js ---
// *************************************************************************************************

/**
 * @file 30_tools/DocsManager.js
 * @module System.DocsManager
 * @version 21 // تحديث الإصدار ليعكس البنية الجديدة المعتمدة على الذاكرة
 * @author عبدالعزيز
 * @description
 * وحدة مركزية لإدارة وتجميع توثيق جميع الوحدات في المشروع.
 * تعتمد على سجل في الذاكرة (in-memory registry) لتوفير أداء عالٍ ومرونة،
 * وتوفر واجهة لتسجيل التوثيق برمجيًا من كل وحدة.
 */

defineModule('System.DocsManager', ({ Utils, Config, Telemetry }) => {
  const _docsRegistry = {};

  /**
   * يسجل التوثيق لوحدة معينة.
   * @param {string} moduleName - اسم الوحدة (e.g., 'System.Config').
   * @param {Array<object>} docs - مصفوفة من كائنات التوثيق للدوال.
   */
  function registerModuleDocs(moduleName, docs) {
    if (!moduleName || !Array.isArray(docs)) {
      Utils.warn('DocsManager: Invalid arguments for registerModuleDocs.');
      return;
    }
    _docsRegistry[moduleName] = docs;
    Utils.log(`DocsManager: Registered documentation for module "${moduleName}".`);
  }

  /**
   * يسجل توثيق وحدة System.Config بشكل منفصل لكسر التبعية الدائرية.
   * يتم استدعاء هذه الدالة من ملف تهيئة بعد تحميل الوحدتين.
   */
  function registerConfigDocs() {
    registerModuleDocs('System.Config', [
      { name: 'get',     description: 'يجلب قيمة إعداد حسب المفتاح.' },
      { name: 'getAll',  description: 'يجلب جميع الإعدادات، يدعم التحديث الفوري.' },
      { name: 'validate',description: 'يتحقق من صحة الإعدادات المطلوبة.' }
    ]);
  }

  /**
   * يسجل توثيق الوحدات الأساسية (مثل Utils) بشكل منفصل.
   * يتم استدعاء هذه الدالة من ملف تهيئة بعد تحميل جميع الوحدات.
   */
  function registerCoreDocs() {
    registerModuleDocs('System.Utils', [
      { name: 'log', description: 'يسجل رسالة معلوماتية في Logger.' },
      { name: 'warn', description: 'يسجل رسالة تحذير في Logger.' },
      { name: 'error', description: 'يسجل رسالة خطأ في Logger و ErrorLogger.' },
      { name: 'executeSafely', description: 'ينفذ دالة مع معالجة آمنة للأخطاء.' },
      { name: 'safeParse', description: 'يحلل سلسلة JSON بأمان.' },
      { name: 'validateEmail', description: 'يتحقق من صحة البريد الإلكتروني.' },
      { name: 'getSheet', description: 'يجلب ورقة عمل بالاسم أو ينشئها.' },
      { name: 'validateString', description: 'يتحقق من أن القيمة سلسلة نصية غير فارغة.' },
    ]);
  }
    // ✅ Architectural Fix: Centralized documentation registration for all modules.
    // This function is called by the initializer after all files have been loaded.

    // UI Modules
    registerModuleDocs('System.UI', [{ name: 'onOpen', description: 'TODO: Add description.' }]);
    registerModuleDocs('System.UI.ActionHandler', [
        { name: 'renderApiSchemaPanel', description: 'يعرض توثيق واجهة API في لوحة.' },
        { name: 'renderWorkshopPanel', description: 'يعرض محتويات ورشة عمل المطورين.' },
        { name: 'renderInsightsPanel', description: 'يعرض رؤى المشروع في لوحة.' },
        { name: 'sendPromptFromSelection', description: 'يرسل محتوى الخلية المحددة كنصيحة للنموذج.' },
        { name: 'exportLastResponseToDoc', description: 'يصدر آخر استجابة من الجلسة إلى مستند Google Docs.' },
        { name: 'getCodeFromActiveCell', description: 'يجلب نص الخلية النشطة إذا كان خلية واحدة.' },
        { name: 'updateActiveCellWithCode', description: 'يحدّث الخلية النشطة بالنص الجديد.' },
        { name: 'runSystemHealthCheck', description: 'يشغل فحص سلامة النظام ويعرض تقريرًا.' }
    ]);

    // AI & Agents Modules
    registerModuleDocs('System.AI.Orchestrator', [{ name: 'execute', description: 'الدالة التنفيذية الأساسية التي تتلقى طلبًا، تبني السياق، تستدعي النموذج، وتعالج الرد.' }]);
    registerModuleDocs('System.Agents.Router', [{ name: 'route', description: 'يحدد اسم الوكيل المناسب بناءً على كائن النية.' }]);
    registerModuleDocs('System.AgentDispatcher.Core', [{ name: 'dispatch', description: 'يتلقى الرسالة ويحدد الوكيل المناسب بناءً على النية، ثم يوجّهها إليه.' }]);
    registerModuleDocs('System.AgentDeveloper', [
        { name: 'handleRequest', description: 'TODO: Add description.' },
        { name: 'generateCodeFromPrompt', description: 'TODO: Add description.' },
        { name: 'runWeeklyCodeReview', description: 'TODO: Add description.' },
        { name: 'suggestRefactoring', description: 'TODO: Add description.' },
        { name: 'logCodeQualityMetrics', description: 'TODO: Add description.' },
    ]);
    registerModuleDocs('System.AgentCFO', [
      { name: 'handleRequest', description: 'TODO: Add description.' },
      { name: 'runMonthlyPNL', description: 'TODO: Add description.' },
    ]);
    registerModuleDocs('System.AI.JsonQuery', [{ name: 'ask', description: 'TODO: Add description.' }]);

    // Tools Modules
    registerModuleDocs('System.Tools.Catalog', [
      { name: 'register', description: 'TODO: Add description.' },
      { name: 'getFunction', description: 'TODO: Add description.' },
      { name: 'getDeclaration', description: 'TODO: Add description.' },
      { name: 'getDeclarations', description: 'TODO: Add description.' },
    ]);
    registerModuleDocs('System.ToolsDeveloper', [
      { name: 'reviewCode', description: 'يطلب من AI.Core تحليل ومراجعة كود عبر CodeAssistance.' },
      { name: 'generateCode', description: 'يطلب من AI.Core توليد دالة بناءً على وصف عبر CodeAssistance.' },
      { name: 'refactorCode', description: 'يطلب من AI.Core إعادة هيكلة الكود عبر CodeAssistance.' },
      { name: 'applyFormulaToCell', description: 'يطبق صيغة على الخلية النشطة أو خلية محددة.' },
      { name: 'getBuiltinFunctionDoc', description: 'يجلب توثيق دالة مدمجة في Apps Script، مع استخدام الكاش أولاً.' },
      { name: 'exportToolsDocumentationToDoc', description: 'يصدر توثيق جميع الأدوات إلى مستند Google Docs.' },
      { name: 'addCommentsToCode', description: 'يطلب من AI.Core إضافة تعليقات برمجية تفسيرية إلى الكود المقدم.' },
      { name: 'explainCode', description: 'يطلب من AI.Core شرح منطق الكود المقدم بلغة بشرية واضحة.' }
    ]);

    // System & API Modules
    registerModuleDocs('System.Code', [
      { name: 'doGet', description: 'TODO: Add description.' },
      { name: 'doPost', description: 'TODO: Add description.' },
    ]);
    registerModuleDocs('System.API.Endpoints', [
      { name: 'ask', description: 'TODO: Add description.' },
      { name: 'summarizeSheet', description: 'TODO: Add description.' },
      { name: 'getFinancialReport', description: 'TODO: Add description.' },
      { name: 'getSchema', description: 'TODO: Add description.' },
    ]);

    // Other modules from previous fixes
    registerModuleDocs('System.Intro', [{ name: 'getWelcomeMessage', description: 'TODO: Add description.' }]);
    registerModuleDocs('System.Security', [
      { name: 'hasPermission', description: 'TODO: Add description.' },
      { name: 'withPermission', description: 'TODO: Add description.' },
      { name: 'encrypt', description: 'TODO: Add description.' },
      { name: 'decrypt', description: 'TODO: Add description.' },
      { name: 'sanitize', description: 'TODO: Add description.' },
    ]);
    registerModuleDocs('System.Telemetry', [
      { name: 'track', description: 'TODO: Add description.' },
      { name: 'trackEvent', description: 'TODO: Add description.' },
      { name: 'trackError', description: 'TODO: Add description.' },
      { name: 'logError', description: 'TODO: Add description.' },
    ]);
  }

  /**
   * يجلب التوثيق لوحدة معينة.
   * @param {string} moduleName - اسم الوحدة.
   * @returns {Array<object>|undefined} - مصفوفة التوثيق أو undefined إذا لم توجد.
   */
  function getModuleDocs(moduleName) {
    return _docsRegistry[moduleName]
      ? JSON.parse(JSON.stringify(_docsRegistry[moduleName]))
      : undefined;
  }

  /**
   * يجلب توثيق جميع الوحدات.
   * @returns {object} - نسخة من سجل التوثيق.
   */
  function getAllDocs() {
    // Return a copy to prevent mutation
    return JSON.parse(JSON.stringify(_docsRegistry));
  }

  return {
    registerModuleDocs,
    registerConfigDocs,
    registerCoreDocs,
    getModuleDocs,
    getAllDocs
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/DocsManager.js ---
// *************************************************************************************************