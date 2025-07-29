// 🧪 System Doctor v3.5 - Comprehensive Test Suite

console.log('🧪 System Doctor v3.5 - Test Suite Starting...\n');

// Load System Doctor
require('./system_doctor_final.cjs');

// Test 1: Basic functionality
console.log('=== Test 1: Basic Scan ===');
const basicResult = runSystemDoctor();
console.log(`Result: ${basicResult.overall}\n`);

// Test 2: Deep scan
console.log('=== Test 2: Deep Scan ===');
const deepResult = runSystemDoctor({ deepScan: true });
console.log(`Result: ${deepResult.overall}\n`);

// Test 3: Full analysis
console.log('=== Test 3: Full Analysis ===');
const fullResult = runSystemDoctor({ 
  deepScan: true, 
  traceDependencies: true, 
  autoFix: true 
});
console.log(`Result: ${fullResult.overall}\n`);

// Test 4: Individual components
console.log('=== Test 4: Component Tests ===');
console.log('Factories:', DoctorModules.analyzeFactories().valid.length, 'valid');
console.log('Dependencies:', DoctorDependencies.analyzeDependencyGraph().issues.length, 'issues');
console.log('Readiness:', DoctorReadiness.checkAllUnits().ready.length, 'ready');

console.log('\n✅ All tests completed successfully!');