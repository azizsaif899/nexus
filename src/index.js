/**
 * @file src/index.js
 * @module System.Main
 * @description
 * نقطة الدخول الرئيسية لتطبيق G-Assistant.
 * هذا الملف مسؤول عن تهيئة النظام بأكمله بالترتيب الصحيح.
 */

// استيراد الوحدات الأساسية التي لا تعتمد على غيرها أو التي يجب تهيئتها أولاً.
// ملاحظة: تم تصميم Utils ليكون آمنًا للاستيراد في أي وقت.
// ES6 import removed for Apps Script compatibility
// ES6 import removed for Apps Script compatibility
// استيراد الوحدات الأخرى التي سيتم استخدامها بعد التهيئة.
// ES6 import removed for Apps Script compatibility
// ES6 import removed for Apps Script compatibility
/**
 * الدالة الرئيسية لبدء تشغيل التطبيق.
 * تقوم بتهيئة الإعدادات، ثم بقية أجزاء النظام.
 * @returns {Promise<void>}
 */
async function main() {
    try {
        // الخطوة 1: تهيئة الإعدادات أولاً. هذا أمر حاسم.
        Utils.log('System.Main: Initializing configuration...');
        Config.initialize(); // لا حاجة لـ await إذا كانت العمليات داخلها متزامنة
        Utils.log('System.Main: Configuration loaded successfully.');

        // الخطوة 2: حقن مسجل الأخطاء في Utils لكسر التبعية الدائرية.
        // هذا يسمح لـ Utils.error() باستدعاء ErrorLogger.record() دون استيراد مباشر.
        Utils.setErrorLogger(ErrorLogger);

        // الخطوة 3: الآن يمكننا استخدام الوحدات التي تعتمد على الإعدادات بأمان.
        Utils.log('System.Main: Core modules are ready.');

        // الخطوة 4: بدء تشغيل منطق التطبيق الرئيسي
        console.log('--- G-Assistant Ready ---');
        console.log(`Default Model: ${Config.get('GEMINI_DEFAULT_MODEL', 'Not Set')}`);
        console.log('---------------------------');

        // مثال: تسجيل حدث باستخدام Telemetry بعد التهيئة
        Telemetry.trackEvent('system.startup.success');

        // مثال: اختبار تسجيل خطأ بعد الإعداد الكامل
        Utils.error('This is a test error after full system initialization.', { context: 'System.Main' });

    } catch (error) {
        // في حالة فشل التهيئة، يتم تسجيل الخطأ هنا
        Utils.error('FATAL: Application initialization failed.', { errorObj: error });
        // في هذه المرحلة، قد لا يكون flush التلقائي قد تم إعداده، لذا يمكننا محاولة استدعائه يدويًا.
        ErrorLogger.flushBufferToFile();
    }

// بدء تشغيل التطبيق
main();