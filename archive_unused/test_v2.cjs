// 🧪 Test SystemAutoRepairAgent v2.0
global.Logger = { log: console.log };
global.GAssistant = { 
  Utils: { 
    Injector: { 
      _moduleFactories: { 
        'System.Config': {}, 
        'System.UI': {}, 
        'Agent.Developer': {},
        'Agent.CFO': {},
        'Custom.Module': {}
      },
      _moduleExports: { 
        'System.Config': { isReady: () => true }, 
        'System.UI': { _isFallback: true }, 
        'Agent.Developer': {},
        'Agent.CFO': { isReady: () => false },
        'Custom.Module': {}
      },
      buildAllModules: () => true
    }
  }
};

global.defineModule = function(name, factory) { 
  console.log('🔧 defineModule called:', name); 
};

// v2.0 Functions
function runAutoRepair() {
  console.log('🔧 Starting SystemAutoRepairAgent v2.0...');
  
  const results = {
    coreIntegrity: verifyInjectorIntegrity(),
    defineModule: verifyDefineModule(),
    moduleFactories: validateModuleFactoriesDetailed(),
    moduleReadiness: checkModuleReadiness(),
    fileStructure: scanAllFiles(),
    loadOrder: suggestCorrectLoadOrder()
  };
  
  console.log('✅ Comprehensive auto-repair completed:', results);
  return results;
}

function verifyInjectorIntegrity() {
  const exists = !!GAssistant?.Utils?.Injector;
  if (!exists) {
    console.log('❌ Injector missing - check 00_utils.js load order');
    return { status: false, issue: '00_utils.js not loaded first' };
  }
  console.log('✅ Injector verified');
  return { status: true, buildAllModules: typeof GAssistant.Utils.Injector.buildAllModules === 'function' };
}

function verifyDefineModule() {
  const exists = typeof defineModule === 'function';
  if (!exists) {
    console.log('⚠️ defineModule missing, attempting fix...');
    global.defineModule = function(name, factory) {
      GAssistant?.Utils?.Injector?.registerFactory(name, factory);
    };
    console.log('✅ defineModule fixed');
    return { status: true, fixed: true };
  }
  console.log('✅ defineModule exists');
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
  
  console.log(`📦 Module Analysis: ${valid.length} valid, ${fallbacks.length} fallbacks, ${failed.length} failed`);
  console.log(`✅ Valid modules: ${valid.join(', ') || 'none'}`);
  if (fallbacks.length > 0) console.log(`⚠️ Fallback modules: ${fallbacks.join(', ')}`);
  if (failed.length > 0) console.log(`❌ Failed modules: ${failed.join(', ')}`);
  
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
  
  console.log(`🚀 Ready modules: ${ready.join(', ') || 'none'}`);
  if (notReady.length > 0) console.log(`⚠️ Not ready: ${notReady.join(', ')}`);
  
  return { ready, notReady };
}

function scanAllFiles() {
  console.log('📁 Scanning comprehensive file structure...');
  
  const discoveredModules = Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {});
  const coreFiles = ['00_utils.js', '99_Initializer.js'];
  
  const systemModules = discoveredModules.filter(name => name.startsWith('System.'));
  const agentModules = discoveredModules.filter(name => name.startsWith('Agent.'));
  const otherModules = discoveredModules.filter(name => !name.startsWith('System.') && !name.startsWith('Agent.'));
  
  console.log(`🔍 Core files: ${coreFiles.join(', ')}`);
  console.log(`🏗️ System modules (${systemModules.length}): ${systemModules.join(', ') || 'none'}`);
  console.log(`🤖 Agent modules (${agentModules.length}): ${agentModules.join(', ') || 'none'}`);
  console.log(`📦 Other modules (${otherModules.length}): ${otherModules.join(', ') || 'none'}`);
  
  return {
    coreFiles,
    systemModules,
    agentModules,
    otherModules,
    totalDiscovered: discoveredModules.length
  };
}

function suggestCorrectLoadOrder() {
  console.log('📋 Suggesting optimal load order...');
  const order = [
    '00_utils.js (CRITICAL FIRST - contains Injector & defineModule)',
    '01_*.js (System configuration modules)',
    '10_*.js (Core system modules)', 
    '20_*.js (Agent modules)',
    '30_*.js (UI modules)',
    '99_Initializer.js (CRITICAL LAST - runs initialization)'
  ];
  
  order.forEach((item, i) => console.log(`${i + 1}. ${item}`));
  return order;
}

// Run test
console.log('🧪 Testing SystemAutoRepairAgent v2.0...\n');
runAutoRepair();
console.log('\n✅ SystemAutoRepairAgent v2.0 test completed!');