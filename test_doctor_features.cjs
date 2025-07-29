// Test all System Doctor v3.5 advanced features
console.log('🧪 Testing System Doctor v3.5 Advanced Features\n');

// Load the system doctor
require('./system_doctor.cjs');

console.log('=== 1. Basic Scan ===');
runSystemDoctor();

console.log('\n=== 2. Deep Scan ===');
runSystemDoctor({ deepScan: true });

console.log('\n=== 3. Deep Scan + Dependencies ===');
runSystemDoctor({ deepScan: true, traceDependencies: true });

console.log('\n=== 4. Full Analysis + Auto-Fix ===');
runSystemDoctor({ deepScan: true, traceDependencies: true, autoFix: true });

console.log('\n=== 5. Testing Modular Components ===');
console.log('Factory Analysis:', DoctorModules.analyzeFactories());
console.log('Missing Exports:', DoctorModules.traceMissingExports());
console.log('Fallback Reasons:', DoctorDependencies.mapFallbackReasons());
console.log('Dependency Graph:', DoctorDependencies.analyzeDependencyGraph());
console.log('Readiness Check:', DoctorReadiness.checkAllUnits(true));

console.log('\n✅ All System Doctor v3.5 features tested!');