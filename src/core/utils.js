/**
 * @file src/core/utils.js
 * @module System.Utils
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * وحدة الأدوات المساعدة الأساسية - نسخة ES6 للتطوير المحلي
 */

/**
 * يسجل رسالة معلوماتية
 * @param {string} message - الرسالة المراد تسجيلها
 * @param {*} data - بيانات إضافية اختيارية
 */
export function log(message, data) {
  console.log(message, data ? JSON.stringify(data, null, 2) : '');
}

/**
 * يسجل رسالة تحذير
 * @param {string} message - رسالة التحذير
 * @param {*} data - بيانات إضافية اختيارية
 */
export function warn(message, data) {
  console.warn(message, data ? JSON.stringify(data, null, 2) : '');
}

/**
 * يسجل رسالة خطأ
 * @param {string} message - رسالة الخطأ
 * @param {Error} errorObj - كائن الخطأ
 */
export function error(message, errorObj) {
  console.error(message, errorObj ? (errorObj.stack || errorObj.message) : '');
}

/**
 * ينفذ دالة مع معالجة آمنة للأخطاء
 * @param {Function} fn - الدالة المراد تنفيذها
 * @param {string} context - سياق التنفيذ
 * @param {*} fallbackValue - القيمة الافتراضية عند الفشل
 * @returns {*} نتيجة تنفيذ الدالة أو القيمة الافتراضية
 */
export function executeSafely(fn, context, fallbackValue = null) {
  try {
    return fn();
  } catch (e) {
    error(`Error in ${context || 'unknown context'}`, e);
    return fallbackValue;
  }
}

/**
 * يتحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني
 * @returns {boolean} true إذا كان صحيحاً
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * تهيئة الوحدة
 * @returns {boolean} true إذا نجحت التهيئة
 */
export function init() {
  log('System.Utils initialized successfully (ES6 version)');
  return true;
}

/**
 * فحص جاهزية الوحدة
 * @returns {Object} تقرير حالة الوحدة
 */
export function isReady() {
  return {
    status: 'ready',
    dependencies: [],
    lastCheck: new Date(),
    message: 'Core utilities are always ready (ES6 version)'
  };
}