// 🚀 G-Assistant Final Initializer
(function(global) {
  function initializeSystem() {
    try {
      Logger.log('🚀 G-Assistant Initializer v6.0 (Topological Runtime) starting...');

      // تحقق متقدم من جاهزية النظام
      if (!global.GAssistant) {
        throw new Error('❌ GAssistant غير معرف. تأكد من تحميل 00_utils.js أولاً.');
      }
      if (!global.GAssistant.Utils) {
        throw new Error('❌ GAssistant.Utils غير معرف. تأكد من تحميل 00_utils.js أولاً.');
      }
      if (!global.GAssistant.Utils.Injector) {
        throw new Error('❌ GAssistant.Utils.Injector غير معرف. تأكد من تحميل 00_utils.js أولاً.');
      }
      if (typeof global.GAssistant.Utils.Injector.buildAllModules !== 'function') {
        throw new Error('❌ Injector.buildAllModules غير جاهز أو لا يحتوي على buildAllModules.');
      }

      const injector = global.GAssistant.Utils.Injector;

      // 1. Build all registered modules in the correct topological order.
      injector.buildAllModules();

      // 2. Initialize modules that have an init() function and were built successfully.
      let initialized = 0;
      if (injector._moduleExports) {
        Object.keys(injector._moduleExports).forEach(name => {
          const moduleExports = injector._moduleExports[name] || {};
          if (moduleExports && typeof moduleExports.init === 'function' && !moduleExports._isFallback) {
            try {
              moduleExports.init();
              initialized++;
            } catch (e) {
              Logger.log(`❌ Error initializing ${name}: ${e.message}`);
            }
          }
        });
      } else {
        Logger.log('⚠️ Cannot initialize modules: _moduleExports is undefined');
      }

      Logger.log(`🔧 Initialized ${initialized} modules`);

      // 3. Run health check if available.
      if (global.GAssistant.System?.HealthCheck?.runHealthCheckAndSave) {
        const healthReport = global.GAssistant.System.HealthCheck.runHealthCheckAndSave();
        Logger.log(`📊 System health: ${healthReport.systemStatus}`);
      }

      // اختبار نهائي
      const factories = Object.keys(injector._moduleFactories || {}).length;
      const exports = Object.keys(injector._moduleExports || {}).length;
      const fallbacks = Object.keys(injector._moduleExports || {}).filter(name => injector._moduleExports[name]?._isFallback).length;

      Logger.log(`📊 إحصائيات النظام: ${factories} مسجلة, ${exports} مبنية, ${fallbacks} fallbacks`);
      Logger.log('✅ G-Assistant system initialized successfully!');
      return true;

    } catch (e) {
      const errorMessage = `CRITICAL FAILURE: G-Assistant could not be initialized. ${e.stack || e.message}`;
      Logger.log(errorMessage);
      try {
        SpreadsheetApp.getUi().alert('فشل حرج في تهيئة النظام. يرجى مراجعة السجلات.');
      } catch (uiError) {
        // Fallback if UI is not available
      }
      return false;
    }
  }

  global.initializeGAssistantSystem = initializeSystem;
  global.runAdvancedSystemDoctor = runAdvancedSystemDoctor;
  global.systemDoctor = systemDoctor;

  // Run the initialization.
  initializeSystem();
})(this);

// دوال للاختبار
function initializeSystem() {
  return initializeGAssistantSystem();
}

function debugModules() {
  const injector = GAssistant?.Utils?.Injector;
  if (!injector) {
    Logger.log('❌ Injector not available');
    return { factories: 0, exports: 0, fallbacks: 0 };
  }

  const detailed = validateModuleFactoriesDetailed();
  Logger.log(`📦 Detailed: ${detailed.valid.length} valid, ${detailed.fallbacks.length} fallbacks, ${detailed.failed.length} failed`);

  return {
    factories: detailed.total,
    exports: detailed.valid.length + detailed.fallbacks.length,
    fallbacks: detailed.fallbacks.length,
    details: detailed
  };
}


// 🔧 SystemAutoRepairAgent v2.0 - فحص شامل ومتقدم
function runAutoRepair() {
  Logger.log('🔧 Starting SystemAutoRepairAgent v2.0...');

  const results = {
    coreIntegrity: verifyInjectorIntegrity(),
    defineModule: verifyDefineModule(),
    moduleFactories: validateModuleFactoriesDetailed(),
    moduleReadiness: checkModuleReadiness(),
    fileStructure: scanAllFiles(),
    loadOrder: suggestCorrectLoadOrder()
  };

  Logger.log('✅ Comprehensive auto-repair completed:', results);
  return results;
}

function verifyInjectorIntegrity() {
  const exists = !!GAssistant?.Utils?.Injector;
  if (!exists) {
    Logger.log('❌ Injector missing - check 00_utils.js load order');
    return { status: false, issue: '00_utils.js not loaded first' };
  }
  Logger.log('✅ Injector verified');
  return { status: true, buildAllModules: typeof GAssistant.Utils.Injector.buildAllModules === 'function' };
}

function verifyDefineModule() {
  const exists = typeof defineModule === 'function';
  if (!exists) {
    Logger.log('⚠️ defineModule missing, attempting fix...');
    this.defineModule = function(name, factory) {
      GAssistant?.Utils?.Injector?.registerFactory(name, factory);
    };
    Logger.log('✅ defineModule fixed');
    return { status: true, fixed: true };
  }
  Logger.log('✅ defineModule exists');
  return { status: true, fixed: false };
}

function validateModuleFactoriesDetailed() {
  const injector = GAssistant?.Utils?.Injector;
  if (!injector) return { valid: [], invalid: [], failed: [], total: 0 };

  const factories = Object.keys(injector._moduleFactories || {});
  const exports = Object.keys(injector._moduleExports || {});
  const valid = exports.filter(name => !injector._moduleExports[name]?._isFallback);
  const fallbacks = exports.filter(name => injector._moduleExports[name]?._isFallback);
  const failed = factories.filter(name => !exports.includes(name));

  Logger.log(`📦 Module Analysis: ${valid.length} valid, ${fallbacks.length} fallbacks, ${failed.length} failed`);
  Logger.log(`✅ Valid modules: ${valid.join(', ') || 'none'}`);
  if (fallbacks.length > 0) Logger.log(`⚠️ Fallback modules: ${fallbacks.join(', ')}`);
  if (failed.length > 0) Logger.log(`❌ Failed modules: ${failed.join(', ')}`);

  return { valid, fallbacks, failed, total: factories.length };
}

function checkModuleReadiness() {
  const injector = GAssistant?.Utils?.Injector;
  if (!injector) return { ready: [], notReady: [] };

  const ready = [];
  const notReady = [];

  Object.keys(injector._moduleExports || {}).forEach(name => {
    const module = injector._moduleExports[name];
    if (module && !module._isFallback) {
      if (typeof module.isReady === 'function' && module.isReady()) {
        ready.push(name);
      } else if (typeof module === 'object' || typeof module === 'function') {
        ready.push(name + ' (assumed ready)');
      } else {
        notReady.push(name);
      }
    }
  });

  Logger.log(`🚀 Ready modules: ${ready.join(', ') || 'none'}`);
  if (notReady.length > 0) Logger.log(`⚠️ Not ready: ${notReady.join(', ')}`);

  return { ready, notReady };
}

function scanAllFiles() {
  Logger.log('📁 Scanning comprehensive file structure...');

  // محاولة اكتشاف الملفات من مصادر مختلفة
  const discoveredModules = Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {});
  const coreFiles = ['00_utils.js', '99_Initializer.js'];

  // تصنيف الوحدات حسب النوع
  const systemModules = discoveredModules.filter(name => name.startsWith('System.'));
  const agentModules = discoveredModules.filter(name => name.startsWith('Agent.'));
  const otherModules = discoveredModules.filter(name => !name.startsWith('System.') && !name.startsWith('Agent.'));

  Logger.log(`🔍 Core files: ${coreFiles.join(', ')}`);
  Logger.log(`🏗️ System modules (${systemModules.length}): ${systemModules.join(', ') || 'none'}`);
  Logger.log(`🤖 Agent modules (${agentModules.length}): ${agentModules.join(', ') || 'none'}`);
  Logger.log(`📦 Other modules (${otherModules.length}): ${otherModules.join(', ') || 'none'}`);

  return {
    coreFiles,
    systemModules,
    agentModules,
    otherModules,
    totalDiscovered: discoveredModules.length
  };
}

function suggestCorrectLoadOrder() {
  Logger.log('📋 Suggesting optimal load order...');
  const order = [
    '00_utils.js (CRITICAL FIRST - contains Injector & defineModule)',
    '01_*.js (System configuration modules)',
    '10_*.js (Core system modules)',
    '20_*.js (Agent modules)',
    '30_*.js (UI modules)',
    '99_Initializer.js (CRITICAL LAST - runs initialization)'
  ];

  order.forEach((item, i) => Logger.log(`${i + 1}. ${item}`));
  return order;
}

// Legacy functions for backward compatibility
function scanFileStructure() {
  return scanAllFiles();
}

function validateModuleFactories() {
  const detailed = validateModuleFactoriesDetailed();
  return {
    valid: detailed.valid.length,
    invalid: detailed.failed.length,
    failed: detailed.failed
  };
}

// Advanced diagnostic function
function runSystemAutoRepairAgent() {
  Logger.log('====== 🔧 SystemAutoRepairAgent v2.0 - Comprehensive Analysis ======');

  const results = runAutoRepair();

  // Enhanced reporting
  Logger.log('\n📊 DETAILED SYSTEM REPORT:');
  Logger.log(`Core Integrity: ${results.coreIntegrity.status ? '✅' : '❌'}`);
  Logger.log(`DefineModule: ${results.defineModule.status ? '✅' : '❌'} ${results.defineModule.fixed ? '(auto-fixed)' : ''}`);
  Logger.log(`Total Modules: ${results.moduleFactories.total}`);
  Logger.log(`Ready Modules: ${results.moduleReadiness.ready.length}`);
  Logger.log(`File Categories: ${Object.keys(results.fileStructure).length - 1}`);

  return results;
}

// 🩺 System Doctor v3.5 Integration
function runAdvancedSystemDoctor(config = {}) {
  try {
    Logger.log('🩺 Attempting to load System Doctor v3.5...');
    // In Apps Script environment, we'll use the built-in version
    return runSystemAutoRepairAgent();
  } catch (e) {
    Logger.log('⚠️ System Doctor v3.5 fallback to built-in version:', e.message);
    return runAutoRepair();
  }
}

// Alias for easier access
function systemDoctor(config = {}) {
  return runAdvancedSystemDoctor(config);
}
