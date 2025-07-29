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