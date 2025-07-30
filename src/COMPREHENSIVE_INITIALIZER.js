// نظام التهيئة الشامل - يبني جميع الوحدات بأمان
(function(global) {
  function buildAllModules() {
    const injector = global.GAssistant.Utils.Injector;
    const factories = injector._moduleFactories;
    const built = new Set();
    
    Logger.log(`🔧 Building ${Object.keys(factories).length} modules...`);
    
    Object.keys(factories).forEach(name => {
      if (built.has(name)) return;
      
      try {
        const factory = factories[name];
        
        // استخراج التبعيات بطريقة آمنة
        let deps = [];
        try {
          const fnStr = factory.toString();
          const match = fnStr.match(/\(([^)]*)\)/);
          if (match && match[1].trim()) {
            const params = match[1].trim();
            if (params.startsWith('{') && params.endsWith('}')) {
              deps = params.slice(1, -1).split(',').map(p => p.split(':')[0].trim()).filter(Boolean);
            } else {
              deps = params.split(',').map(p => p.trim()).filter(Boolean);
            }
          }
        } catch (e) {
          Logger.log(`⚠️ Could not extract dependencies for ${name}, using empty deps`);
        }
        
        // حل التبعيات (مع fallbacks)
        const resolvedDeps = injector.get(...deps);
        
        // تنفيذ المصنع
        const exports = factory(resolvedDeps);
        injector.setExports(name, exports);
        
        // ربط بالـ namespace
        const parts = name.split('.');
        let current = global.GAssistant;
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = current[parts[i]] || {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = exports;
        
        built.add(name);
        Logger.log(`✅ Built: ${name}`);
        
      } catch (e) {
        Logger.log(`❌ Failed to build ${name}: ${e.message}`);
        // إنشاء fallback للوحدة الفاشلة
        injector.setExports(name, injector._createUniversalFallback(name));
      }
    });
    
    Logger.log(`🎯 Built ${built.size} modules successfully`);
  }

  function initializeAllModules() {
    const injector = global.GAssistant.Utils.Injector;
    if (!injector || !injector._moduleExports) {
      Logger.log('⚠️ Cannot initialize modules: _moduleExports is undefined');
      return;
    }
    
    let initialized = 0;
    
    Object.keys(injector._moduleExports).forEach(name => {
      const moduleExports = injector._moduleExports[name];
      if (moduleExports && typeof moduleExports.init === 'function') {
        try {
          moduleExports.init();
          initialized++;
        } catch (e) {
          Logger.log(`❌ Error initializing ${name}: ${e.message}`);
        }
      }
    });
    
    Logger.log(`🔧 Initialized ${initialized} modules`);
  }

  function initializeSystem() {
    try {
      Logger.log('🚀 G-Assistant Comprehensive Initializer starting...');
      
      if (!global.GAssistant?.Utils?.Injector) {
        throw new Error('Core system not loaded');
      }
      
      buildAllModules();
      initializeAllModules();
      
      // تفعيل المراقبة والصحة إذا كانت متاحة
      if (global.GAssistant.System?.Telemetry?.track) {
        global.GAssistant.System.Telemetry.track('System.Initialization.Comprehensive', { 
          status: 'success',
          modulesBuilt: Object.keys(global.GAssistant.Utils.Injector._moduleExports).length
        });
      }
      
      if (global.GAssistant.System?.HealthCheck?.runHealthCheckAndSave) {
        const healthReport = global.GAssistant.System.HealthCheck.runHealthCheckAndSave();
        Logger.log(`📊 System health: ${healthReport.systemStatus}`);
      }
      
      Logger.log('✅ G-Assistant system initialized comprehensively!');
      return true;
      
    } catch (e) {
      Logger.log(`❌ Comprehensive initialization failed: ${e.message}`);
      return false;
    }
  }

  global.initializeGAssistantSystem = initializeSystem;
  // استدعاء مباشر - لا حاجة لـ setTimeout في Apps Script
  initializeSystem();
})(this);

// دوال للاختبار والتشخيص
function initializeSystem() {
  return initializeGAssistantSystem();
}

function testSystem() {
  Logger.log('🧪 Comprehensive system test...');
  
  const tests = [
    ['defineModule', () => typeof defineModule !== 'undefined'],
    ['GAssistant', () => typeof GAssistant !== 'undefined'],
    ['Injector', () => GAssistant?.Utils?.Injector !== undefined],
    ['Utils.log', () => typeof GAssistant?.System?.Utils?.log === 'function'],
    ['DocsManager fallback', () => GAssistant?.Utils?.Injector?.get('DocsManager')?.registerModuleDocs !== undefined],
    ['Telemetry fallback', () => GAssistant?.Utils?.Injector?.get('Telemetry')?.track !== undefined]
  ];
  
  tests.forEach(([name, test]) => {
    try {
      const result = test();
      Logger.log(`${result ? '✅' : '❌'} ${name}: ${result ? 'OK' : 'FAILED'}`);
    } catch (e) {
      Logger.log(`❌ ${name}: ERROR - ${e.message}`);
    }
  });
  
  return 'Comprehensive test complete - check console';
}

function debugModules() {
  const injector = GAssistant?.Utils?.Injector;
  if (!injector) {
    Logger.log('❌ Injector not available');
    return;
  }
  
  const factories = Object.keys(injector._moduleFactories);
  const exports = Object.keys(injector._moduleExports);
  
  Logger.log(`📦 Registered factories (${factories.length}): ${factories.slice(0, 10).join(', ')}...`);
  Logger.log(`✅ Built exports (${exports.length}): ${exports.slice(0, 10).join(', ')}...`);
  
  return { factories: factories.length, exports: exports.length };
}