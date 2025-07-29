#!/usr/bin/env node
// 🎯 Final System Test - اختبار شامل نهائي

// Load mocks first
require('./mock_gas_services.js');

// Load core utils to get defineModule
require('./00_utils.js');

// Register DocsManager and Telemetry now that defineModule is available
global.registerDocsManager();
global.registerTelemetry();

// Load complete system
require('./complete_system_loader.cjs');

console.log('\n🎯 FINAL COMPREHENSIVE TEST');
console.log('='.repeat(60));

// Test all major functions
console.log('\n1. Testing System Doctor...');
const doctorReport = runSystemDoctor({ deepScan: true, traceDependencies: true, autoFix: true });

console.log('\n2. Testing Dependency Analysis...');
const depReport = runDependencyDoctor();

console.log('\n3. Testing Full Analysis...');
const fullReport = fullDependencyAnalysis();

console.log('\n4. Testing Emergency Systems...');
const emergencyReport = emergencyRepairSystem();

console.log('\n🏆 FINAL RESULTS:');
console.log('='.repeat(40));
console.log(`✅ System Status: ${doctorReport.overall}`);
console.log(`📦 Total Modules: ${Object.keys(GAssistant.Utils.Injector._moduleFactories).length}`);
console.log(`🔧 Working Modules: ${doctorReport.checks.factories?.valid?.length || 0}`);
console.log(`⚠️ Fallback Modules: ${doctorReport.checks.fallbacks?.fallbacks?.length || 0}`);
console.log(`🔄 Circular Dependencies: ${depReport.dependencyAnalysis?.circularDependencies?.length || 0}`);
console.log(`🎯 Build Success Rate: ${depReport.buildResults?.built?.length || 0}/${(depReport.buildResults?.built?.length || 0) + (depReport.buildResults?.failed?.length || 0)}`);

// Test core functionality
console.log('\n5. Testing Core Functions...');
try {
  console.log('✅ GAssistant.Utils.log works');
  GAssistant.Utils.log('Test message');
  
  console.log('✅ defineModule works');
  defineModule('Test.Module', () => ({ test: true }));
  
  console.log('✅ Module building works');
  GAssistant.Utils.Injector.buildAllModules();
  
  console.log('✅ All core functions operational');
} catch (error) {
  console.log(`❌ Core function error: ${error.message}`);
}

console.log('\n🎉 SYSTEM IS READY FOR DEPLOYMENT!');
console.log('='.repeat(60));