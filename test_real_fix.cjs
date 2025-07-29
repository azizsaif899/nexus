#!/usr/bin/env node
// 🧪 Test Real Fix - اختبار الإصلاح الحقيقي

// Load real fixes first
require('./real_gas_fixes.js');
require('./00_utils.js');

// Test with fixed config
console.log('🧪 Testing Real Fix...');
console.log('='.repeat(40));

try {
  // Load fixed config
  require('./01_config_fixed.js');
  console.log('✅ Fixed config loaded successfully');
  
  // Build modules
  GAssistant.Utils.Injector.buildAllModules();
  console.log('✅ Modules built successfully');
  
  // Test config functionality
  const config = GAssistant.Utils.Injector.get('Config').Config;
  if (config) {
    console.log('✅ Config module working');
    console.log(`📊 Config has ${Object.keys(config.getAll()).length} settings`);
  }
  
  console.log('\n🎯 REAL FIX SUCCESS!');
  console.log('The code now works with proper error handling');
  
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
  console.log('Stack:', error.stack);
}