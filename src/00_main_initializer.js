/**
 * @file 00_main_initializer.js
 * @description نقطة التهيئة الرئيسية للنظام - تحميل وتهيئة جميع الوحدات
 * @version 1.0.0
 */

defineModule('System.MainInitializer', ({ Utils }) => {
  const MODULE_VERSION = '1.0.0';

  function initializeSystem() {
    try {
      Utils.log('🚀 بدء تهيئة النظام...');

      // 1. التحقق من البيئة الأساسية
      if (!validateEnvironment()) {
        throw new Error('فشل في التحقق من البيئة الأساسية');
      }

      // 2. تحميل الإعدادات
      const config = GAssistant.Utils.Injector.get('Config');
      if (!config.validate()) {
        throw new Error('فشل في التحقق من صحة الإعدادات');
      }

      // 3. تهيئة الوحدات الأساسية
      initializeCoreModules();

      // 4. تهيئة واجهة المستخدم
      initializeUI();

      // 5. تهيئة الذكاء الاصطناعي
      initializeAI();

      // 6. تسجيل النظام كجاهز
      registerSystemReady();

      Utils.log('✅ تم تهيئة النظام بنجاح');
      return { success: true, message: 'النظام جاهز للاستخدام' };

    } catch (error) {
      Utils.error('❌ فشل في تهيئة النظام:', error.message);
      return { success: false, error: error.message };
    }
  }

  function validateEnvironment() {
    const required = [
      'SpreadsheetApp',
      'PropertiesService',
      'HtmlService',
      'CacheService'
    ];

    for (const service of required) {
      if (typeof eval(service) === 'undefined') {
        Utils.error(`خدمة مطلوبة مفقودة: ${service}`);
        return false;
      }
    }

    return true;
  }

  function initializeCoreModules() {
    const coreModules = ['Config', 'Security', 'Telemetry'];

    coreModules.forEach(module => {
      try {
        const moduleInstance = GAssistant.Utils.Injector.get(module);
        if (moduleInstance.init) {
          moduleInstance.init();
        }
        Utils.log(`✅ تم تهيئة وحدة: ${module}`);
      } catch (error) {
        Utils.warn(`⚠️ فشل في تهيئة وحدة ${module}: ${error.message}`);
      }
    });
  }

  function initializeUI() {
    try {
      const ui = GAssistant.Utils.Injector.get('UI');
      if (ui.init) {
        ui.init();
      }
      Utils.log('✅ تم تهيئة واجهة المستخدم');
    } catch (error) {
      Utils.warn('⚠️ فشل في تهيئة واجهة المستخدم:', error.message);
    }
  }

  function initializeAI() {
    try {
      const ai = GAssistant.Utils.Injector.get('AI');
      if (ai.init) {
        ai.init();
      }
      Utils.log('✅ تم تهيئة محرك الذكاء الاصطناعي');
    } catch (error) {
      Utils.warn('⚠️ فشل في تهيئة الذكاء الاصطناعي:', error.message);
    }
  }

  function registerSystemReady() {
    // تسجيل النظام في الذاكرة العامة
    if (typeof GAssistant.System === 'undefined') {
      GAssistant.System = {};
    }

    GAssistant.System.isReady = true;
    GAssistant.System.version = MODULE_VERSION;
    GAssistant.System.startTime = new Date();

    // إضافة دوال النظام العامة
    GAssistant.System.getStatus = () => ({
      ready: GAssistant.System.isReady,
      version: GAssistant.System.version,
      uptime: Date.now() - GAssistant.System.startTime.getTime(),
      modules: Object.keys(GAssistant.Utils.Injector._moduleExports)
    });
  }

  return {
    initializeSystem,
    validateEnvironment,
    MODULE_VERSION
  };
});

// تشغيل التهيئة التلقائية
if (typeof SpreadsheetApp !== 'undefined') {
  // تأخير قصير للسماح بتحميل جميع الوحدات
  Utilities.sleep(100);

  try {
    GAssistant.Utils.Injector.buildAllModules();
    const initializer = GAssistant.Utils.Injector.get('MainInitializer');
    const result = initializer.initializeSystem();

    if (!result.success) {
      console.error('فشل في تهيئة النظام:', result.error);
    }
  } catch (error) {
    console.error('خطأ في التهيئة التلقائية:', error.message);
  }
}
