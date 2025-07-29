/**
 * @file src/Utils.js
 * @module System.Utils
 * @version 22 (Refactored for ES6 and dependency injection)
 * @author عبدالعزيز
 * @description
 * وحدة الأدوات المساعدة الأساسية للمشروع.
 * توفر دوال تسجيل (logging)، تنفيذ آمن، وأدوات مساعدة أخرى.
 * (Converted to standard ES6 module with dependency injection for ErrorLogger)
 */

// لا يوجد استيراد لـ ErrorLogger هنا لكسر التبعية الدائرية.
let _errorLogger = null;

/**
 * حقن وحدة تسجيل الأخطاء لكسر التبعية الدائرية.
 * يجب استدعاؤها مرة واحدة عند بدء التشغيل من `src/index.js`.
 * @param {object} logger - وحدة ErrorLogger.
 */
export function setErrorLogger(logger) {
    _errorLogger = logger;
    log('Utils: ErrorLogger has been successfully injected.');
}

/**
 * يسجل رسالة معلومات عادية في الكونسول.
 * @param {string} message - الرسالة المراد تسجيلها.
 * @param {any} [data] - بيانات إضافية لعرضها.
 */
export function log(message, data) {
    // التأكد من أن console متاح (مهم في بيئات مختلفة)
    if (typeof console !== 'undefined' && console.log) {
        console.log(message, data || '');
    }

/**
 * يسجل رسالة تحذير في الكونسول.
 * @param {string} message - رسالة التحذير.
 * @param {any} [data] - بيانات إضافية لعرضها.
 */
export function warn(message, data) {
    if (typeof console !== 'undefined' && console.warn) {
        console.warn(message, data || '');
    }

/**
 * يسجل خطأ.
 * يقوم دائمًا بالتسجيل في `console.error`.
 * إذا تم حقن مسجل أخطاء دائم، فإنه يستدعي دالة `record` الخاصة به أيضًا.
 * @param {string} message - رسالة الخطأ الرئيسية.
 * @param {object} [details={}] - كائن يحتوي على تفاصيل إضافية مثل `context` أو `errorObj`.
 */
export function error(message, details = {}) {
    if (typeof console !== 'undefined' && console.error) {
        console.error(message, details);
    }

    if (_errorLogger && typeof _errorLogger.record === 'function') {
        try {
            const errorData = {
                message: message,
                ...details
            };
            _errorLogger.record(errorData);
        } catch (e) {
            // في حالة فشل المسجل نفسه، نمنع حدوث حلقة لا نهائية من الأخطاء
            console.error('CRITICAL: The injected error logger itself threw an error.', e);
        }

/**
 * ينفذ دالة بأمان داخل كتلة try...catch.
 * @param {function} fn - الدالة المراد تنفيذها.
 * @param {string} [context='Unknown Context'] - سياق التنفيذ للمساعدة في تصحيح الأخطاء.
 * @param {*} [fallbackValue=null] - القيمة التي يجب إرجاعها في حالة حدوث خطأ.
 * @returns {*} نتيجة الدالة `fn` أو `fallbackValue` عند الفشل.
 */
export function executeSafely(fn, context = 'Unknown Context', fallbackValue = null) {
    try {
return fn();
    } catch (e) {
        error('Execution failed in executeSafely', { context, errorObj: e });
return fallbackValue;
    }

/**
 * يتحقق من أن القيمة عبارة عن سلسلة نصية غير فارغة.
 * @param {*} value - القيمة للتحقق منها.
 * @param {string} name - اسم المتغير للرسائل الواضحة.
 */
export function validateString(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Validation failed: ${name} must be a non-empty string.`);
    }

/**
 * يحلل سلسلة JSON بأمان.
 * @param {string} jsonString - السلسلة المراد تحليلها.
 * @param {*} [fallbackValue={}] - القيمة الافتراضية عند فشل التحليل.
 * @returns {object} الكائن المحلل أو القيمة الافتراضية.
 */
export function safeParse(jsonString, fallbackValue = {}) {
    try {
        // التحقق من أن المدخل هو سلسلة نصية قبل التحليل
        if (typeof jsonString !== 'string') return fallbackValue;
return JSON.parse(jsonString);
    } catch (e) {
        warn('safeParse: Failed to parse JSON string.', { error: e.message });
return fallbackValue;
    }

// يمكن إضافة المزيد من الدوال المساعدة العامة هنا حسب الحاجة