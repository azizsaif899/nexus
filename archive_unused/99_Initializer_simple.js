// نظام التهيئة المبسط
(function(global) {
  function buildAllModules() {
    const injector = global.GAssistant.Utils.Injector;
    const factories = injector._moduleFactories;
    
    Object.keys(factories).forEach(name => {
      try {
        const factory = factories[name];
        const deps = injector.get(); // استخدام fallbacks
        const exports = factory(deps);
        injector.setExports(name, exports);
        
        // ربط بالـ namespace
        const parts = name.split('.');
        let current = global.GAssistant;
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = current[parts[i]] || {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = exports;
        
        Logger.log(`✅ Built: ${name}`);
      } catch (e) {
        Logger.log(`❌ Failed to build ${name}: ${e.message}`);
      }
    });
  }

  function initializeSystem() {
    try {
      Logger.log('🚀 Initializing system...');
      buildAllModules();
      Logger.log('✅ System initialized!');
      return true;
    } catch (e) {
      Logger.log(`❌ Initialization failed: ${e.message}`);
      return false;
    }
  }

  global.initializeGAssistantSystem = initializeSystem;
  // استدعاء مباشر - لا حاجة لـ setTimeout في Apps Script
  initializeSystem();
})(this);

// دوال للاختبار
function initializeSystem() {
  return initializeGAssistantSystem();
}

function testSystem() {
  Logger.log('🧪 Testing system...');
  Logger.log(`defineModule: ${typeof defineModule !== 'undefined' ? '✅' : '❌'}`);
  Logger.log(`GAssistant: ${typeof GAssistant !== 'undefined' ? '✅' : '❌'}`);
  Logger.log(`Utils.log: ${typeof GAssistant?.System?.Utils?.log === 'function' ? '✅' : '❌'}`);
  return 'Check console for results';
}