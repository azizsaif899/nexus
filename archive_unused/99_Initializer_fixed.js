// نظام التهيئة المحسن - يستخدم الترتيب الطوبولوجي
(function(global) {
  function initializeSystem() {
    try {
      Logger.log('🚀 G-Assistant Enhanced Initializer starting...');
      
      if (!global.GAssistant?.Utils?.Injector) {
        throw new Error('Core system not loaded');
      }
      
      const injector = global.GAssistant.Utils.Injector;
      
      // بناء جميع الوحدات بالترتيب الصحيح
      injector.buildAllModules();
      
      // تهيئة الوحدات التي تحتاج init
      let initialized = 0;
      Object.keys(injector._moduleExports).forEach(name => {
        const moduleExports = injector._moduleExports[name];
        if (moduleExports && typeof moduleExports.init === 'function' && !moduleExports._isFallback) {
          try {
            moduleExports.init();
            initialized++;
          } catch (e) {
            Logger.log(`❌ Error initializing ${name}: ${e.message}`);
          }
        }
      });
      
      Logger.log(`🔧 Initialized ${initialized} modules`);
      
      // تشغيل فحص الصحة
      if (global.GAssistant.System?.HealthCheck?.runHealthCheckAndSave) {
        const healthReport = global.GAssistant.System.HealthCheck.runHealthCheckAndSave();
        Logger.log(`📊 System health: ${healthReport.systemStatus}`);
      }
      
      Logger.log('✅ G-Assistant system initialized successfully!');
      return true;
      
    } catch (e) {
      Logger.log(`❌ Initialization failed: ${e.message}`);
      return false;
    }
  }

  global.initializeGAssistantSystem = initializeSystem;
  
  // تشغيل التهيئة
  setTimeout(() => {
    initializeSystem();
  }, 100);
})(this);

// دوال للاختبار
function initializeSystem() {
  return initializeGAssistantSystem();
}

function debugModules() {
  const injector = GAssistant?.Utils?.Injector;
  if (!injector) {
    Logger.log('❌ Injector not available');
    return;
  }
  
  const factories = Object.keys(injector._moduleFactories);
  const exports = Object.keys(injector._moduleExports);
  const fallbacks = exports.filter(name => injector._moduleExports[name]?._isFallback);
  
  Logger.log(`📦 Registered: ${factories.length}, Built: ${exports.length}, Fallbacks: ${fallbacks.length}`);
  
  if (fallbacks.length > 0) {
    Logger.log(`⚠️ Fallback modules: ${fallbacks.join(', ')}`);
  }
  
  return { factories: factories.length, exports: exports.length, fallbacks: fallbacks.length };
}