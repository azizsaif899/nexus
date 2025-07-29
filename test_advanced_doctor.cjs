// Test advanced System Doctor features
const { runSystemDoctor } = require('./system_doctor.cjs');

console.log('🧪 Testing System Doctor v4.0 Advanced Features\n');

console.log('=== 1. Basic Scan ===');
runSystemDoctor();

console.log('\n=== 2. Deep Scan ===');
runSystemDoctor({ deepScan: true });

console.log('\n=== 3. Deep Scan + Dependency Tracing ===');
runSystemDoctor({ deepScan: true, traceDependencies: true });

console.log('\n✅ All advanced features tested!');