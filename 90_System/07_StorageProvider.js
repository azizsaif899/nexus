// *************************************************************************************************
// --- START OF FILE: 90_System/07_StorageProvider.js ---
// *************************************************************************************************

/**
 * @file 90_System/07_StorageProvider.js
 * @module System.Storage.Provider
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * واجهة مجردة للتخزين تدعم بيئات متعددة. تفصل استدعاءات GAS المباشرة
 * وتوفر إمكانية التشغيل في بيئات أخرى مستقبلاً.
 * المراحل المعمارية المطبقة:
 *   • 1: defineModule بدون تبعيات
 *   • 2: واجهة مجردة للتخزين
 *   • 3: دعم بيئات متعددة
 */

defineModule('System.Storage.Provider', () => {
  
  /**
   * يجلب قيمة من التخزين
   * @param {string} key - مفتاح القيمة
   * @returns {string|null} القيمة أو null إذا لم توجد
   */
  function get(key) {
    return executeSafely(() => {
      return PropertiesService.getScriptProperties().getProperty(key);
    }, `StorageProvider.get[${key}]`, null);
  }
  
  function executeSafely(fn, context, fallbackValue = null) {
    try {
      return fn();
    } catch (error) {
      console.error(`Error in ${context}:`, error.message);
      // تسجيل في ErrorLogger إذا كان متاحاً
      if (typeof GAssistant !== 'undefined' && GAssistant.System && GAssistant.System.ErrorLogger) {
        GAssistant.System.ErrorLogger.logError(context, error);
      }
      return fallbackValue;
    }
  }

  /**
   * يحفظ قيمة في التخزين
   * @param {string} key - مفتاح القيمة
   * @param {string} value - القيمة المراد حفظها
   * @returns {boolean} true إذا نجحت العملية
   */
  function set(key, value) {
    return executeSafely(() => {
      PropertiesService.getScriptProperties().setProperty(key, value);
      return true;
    }, `StorageProvider.set[${key}]`, false);
  }

  /**
   * يجلب جميع القيم من التخزين
   * @returns {Object} كائن يحتوي على جميع القيم
   */
  function getAll() {
    return executeSafely(() => {
      return PropertiesService.getScriptProperties().getProperties();
    }, 'StorageProvider.getAll', {});
  }

  /**
   * يحذف قيمة من التخزين
   * @param {string} key - مفتاح القيمة المراد حذفها
   * @returns {boolean} true إذا نجحت العملية
   */
  function remove(key) {
    return executeSafely(() => {
      PropertiesService.getScriptProperties().deleteProperty(key);
      return true;
    }, `StorageProvider.remove[${key}]`, false);
  }
  
  /**
   * تهيئة الوحدة
   */
  function init() {
    // اختبار الاتصال بـ PropertiesService
    const testResult = executeSafely(() => {
      PropertiesService.getScriptProperties().getProperty('__test__');
      return true;
    }, 'StorageProvider.init.test', false);
    
    console.log(`StorageProvider initialized: ${testResult ? 'SUCCESS' : 'FAILED'}`);
    return testResult;
  }

  return {
    get,
    set,
    getAll,
    remove,
    init
  };
});

// *************************************************************************************************
// --- END OF FILE: 90_System/07_StorageProvider.js ---
// *************************************************************************************************