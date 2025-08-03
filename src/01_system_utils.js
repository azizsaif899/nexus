// *************************************************************************************************
// --- START OF FILE: 01_system_utils.js ---
// *************************************************************************************************

/**
 * @file 01_system_utils.js
 * @module System.Utils
 * @version 21
 * @author عبدالعزيز
 * @description
 * وحدة الأدوات المساعدة الأساسية للنظام. توفر دوال مشتركة للتسجيل، معالجة الأخطاء،
 * والتحقق من صحة البيانات. هذه الوحدة لا تعتمد على أي وحدة أخرى.
 * المراحل المعمارية المطبقة:
 *   • 1: defineModule بدون تبعيات
 *   • 3: معالجة آمنة للأخطاء
 *   • 9: تسجيل في Logger
 */

defineModule('System.Utils', () => {

  /**
   * يسجل رسالة معلوماتية في Logger
   * @param {string} message - الرسالة المراد تسجيلها
   */
  function log(message) {
    Logger.log(`[INFO] ${message}`);
  }

  /**
   * يسجل رسالة تحذير في Logger
   * @param {string} message - رسالة التحذير
   */
  function warn(message) {
    Logger.warn(`[WARN] ${message}`);
  }

  /**
   * يسجل رسالة خطأ في Logger
   * @param {string} message - رسالة الخطأ
   * @param {Error} [error] - كائن الخطأ الاختياري
   */
  function error(message, error) {
    const errorMsg = error ? `${message}: ${error.message}` : message;
    Logger.log(`[ERROR] ${errorMsg}`);
    if (error && error.stack) {
      Logger.log(`[ERROR] Stack: ${error.stack}`);
    }
  }

  /**
   * ينفذ دالة مع معالجة آمنة للأخطاء
   * @param {function} fn - الدالة المراد تنفيذها
   * @param {Array} args - معاملات الدالة
   * @param {string} context - سياق التنفيذ للتسجيل
   * @returns {*} نتيجة تنفيذ الدالة أو null في حالة الخطأ
   */
  function executeSafely(fn, args = [], context = 'Unknown') {
    try {
      return fn.apply(null, args);
    } catch (e) {
      error(`executeSafely[${context}]: ${e.message}`, e);
      return null;
    }
  }

  /**
   * يحلل سلسلة JSON بأمان
   * @param {string} jsonString - السلسلة المراد تحليلها
   * @param {*} defaultValue - القيمة الافتراضية في حالة الفشل
   * @returns {*} الكائن المُحلل أو القيمة الافتراضية
   */
  function safeParse(jsonString, defaultValue = null) {
    return executeSafely(() => JSON.parse(jsonString), [], 'safeParse') || defaultValue;
  }

  /**
   * يتحقق من صحة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني المراد التحقق منه
   * @returns {boolean} true إذا كان البريد صحيحاً
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * يجلب ورقة عمل بالاسم أو ينشئها إذا لم تكن موجودة
   * @param {string} sheetName - اسم ورقة العمل
   * @param {Array<string>} [headers] - رؤوس الأعمدة الاختيارية
   * @returns {GoogleAppsScript.Spreadsheet.Sheet} ورقة العمل
   */
  function getSheet(sheetName, headers = []) {
    return executeSafely(() => {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        if (headers.length > 0) {
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        }
        log(`Utils.getSheet: Created new sheet "${sheetName}"`);
      }

      return sheet;
    }, [], `getSheet[${sheetName}]`);
  }

  /**
   * يتحقق من أن القيمة سلسلة نصية غير فارغة
   * @param {*} value - القيمة المراد التحقق منها
   * @returns {boolean} true إذا كانت سلسلة نصية غير فارغة
   */
  function validateString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  return {
    log,
    warn,
    error,
    executeSafely,
    safeParse,
    validateEmail,
    getSheet,
    validateString
  };
});

// *************************************************************************************************
// --- END OF FILE: 01_system_utils.js ---
// *************************************************************************************************
