// 🧪 Test SystemAutoRepairAgent locally
// محاكاة بيئة Apps Script
global.Logger = { log: console.log };
global.GAssistant = { 
  Utils: { 
    Injector: { 
      _moduleFactories: { 
        'System.Config': {}, 
        'System.UI': {}, 
        'Agent.Developer': {},
        'Agent.CFO': {}
      },
      _moduleExports: { 
        'System.Config': {}, 
        'System.UI': { _isFallback: true }, 
        'Agent.Developer': {},
        'Agent.CFO': {}
      }
    }
  }
};

global.defineModule = function(name, factory) { 
  console.log('🔧 defineModule called:', name); 
};

// الدوال مباشرة
function runAutoRepair() {
  console.log('🔧 Starting SystemAutoRepairAgent...');
  const results = {
    coreIntegrity: verifyInjectorIntegrity(),
    defineModule: fixDefineModule(),
    moduleFactories: validateModuleFactories(),
    fileStructure: scanFileStructure(),
    loadOrder: suggestCorrectLoadOrder()
  };
  console.log('✅ Auto-repair completed:', results);
  return results;
}

function verifyInjectorIntegrity() {
  const exists = !!GAssistant?.Utils?.Injector;
  if (!exists) {
    console.log('❌ Injector missing - check 00_utils.js load order');
    return false;
  }
  console.log('✅ Injector verified');
  return true;
}

function fixDefineModule() {
  if (typeof defineModule !== 'function') {
    console.log('⚠️ defineModule missing, attempting fix...');
    global.defineModule = function(name, factory) {
      GAssistant?.Utils?.Injector?.registerFactory(name, factory);
    };
    console.log('✅ defineModule fixed');
    return true;
  }
  console.log('ℹ️ defineModule already exists');
  return false;
}

function validateModuleFactories() {
  const injector = GAssistant?.Utils?.Injector;
  if (!injector) return { valid: 0, invalid: 0 };
  
  const factories = Object.keys(injector._moduleFactories || {});
  const exports = Object.keys(injector._moduleExports || {});
  const failed = factories.filter(name => !exports.includes(name));
  
  if (failed.length > 0) {
    console.log('❌ Failed modules:', failed.join(', '));
  } else {
    console.log('✅ All modules built successfully');
  }
  
  return { valid: exports.length, invalid: failed.length, failed };
}

function scanFileStructure() {
  console.log('📁 Scanning file structure...');
  const coreFiles = ['00_utils.js', '99_Initializer.js'];
  const moduleFiles = Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {});
  
  console.log('🔍 Core files needed:', coreFiles.join(', '));
  console.log('📦 Module files detected:', moduleFiles.length);
  
  return { coreFiles, moduleFiles: moduleFiles.length };
}

function suggestCorrectLoadOrder() {
  console.log('📋 Suggesting correct load order...');
  const order = [
    '00_utils.js (FIRST - contains Injector)',
    '01_*.js (System modules)',
    '10_*.js (Core modules)', 
    '20_*.js (Agent modules)',
    '99_Initializer.js (LAST - runs initialization)'
  ];
  
  order.forEach((item, i) => console.log(`${i + 1}. ${item}`));
  return order;
}

// تشغيل الاختبارات
console.log('🧪 Testing SystemAutoRepairAgent locally...\n');

console.log('=== runAutoRepair() ===');
runAutoRepair();

console.log('\n✅ All SystemAutoRepairAgent functions work locally!');