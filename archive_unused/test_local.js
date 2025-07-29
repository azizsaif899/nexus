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
      },
      buildAllModules: () => console.log('✅ Building modules...'),
      registerFactory: (name, factory) => console.log('📝 Registering:', name)
    }
  }
};

global.defineModule = function(name, factory) { 
  console.log('🔧 defineModule called:', name); 
};

// تحميل الدوال من الملف الأصلي
const fs = require('fs');
const code = fs.readFileSync('99_Initializer.js', 'utf8');

// استخراج الدوال المطلوبة
eval(code.split('// 🔧 SystemAutoRepairAgent')[1]);

// تشغيل الاختبارات
console.log('🧪 Testing SystemAutoRepairAgent locally...\n');

try {
  console.log('=== runAutoRepair() ===');
  const results = runAutoRepair();
  
  console.log('\n=== Individual Tests ===');
  console.log('verifyInjectorIntegrity():', verifyInjectorIntegrity());
  console.log('fixDefineModule():', fixDefineModule());
  console.log('validateModuleFactories():', validateModuleFactories());
  
  console.log('\n=== scanFileStructure() ===');
  scanFileStructure();
  
  console.log('\n=== suggestCorrectLoadOrder() ===');
  suggestCorrectLoadOrder();
  
  console.log('\n✅ All functions work locally!');
} catch (error) {
  console.error('❌ Error:', error.message);
}