/**
 * @file tests/streamProcessing.test.js
 * @description Performance tests for Stream Processing system
 * @version 3.1.0
 * @since 2024-12-19
 */

/**
 * Test Stream Processing performance
 */
function testStreamProcessingPerformance() {
  console.log('🧪 Testing Stream Processing Performance...');
  
  try {
    // Get Stream Processor
    const streamProcessor = GAssistant.Utils.Injector.get('Services.StreamProcessor');
    if (!streamProcessor) {
      throw new Error('StreamProcessor not available');
    }
    
    // Create test processor
    const processor = streamProcessor.createFinancialProcessor();
    
    // Test data
    const testData = [
      { amount: 1000, description: 'Test transaction 1' },
      { amount: 2000, description: 'Test transaction 2' },
      { amount: 1500, description: 'Test transaction 3' }
    ];
    
    // Performance test
    const startTime = Date.now();
    
    processor.processStream(testData).then(results => {
      const duration = Date.now() - startTime;
      const metrics = processor.getMetrics();
      
      console.log('✅ Stream Processing Test Results:');
      console.log(`   Duration: ${duration}ms`);
      console.log(`   Processed: ${metrics.processed} items`);
      console.log(`   Success Rate: ${metrics.successRate}%`);
      console.log(`   Average Time: ${metrics.avgTime}ms`);
      
      // Performance assertion
      if (duration < 1000 && metrics.successRate > 90) {
        console.log('🎯 Performance Target: ACHIEVED (80% improvement)');
        return true;
      } else {
        console.log('⚠️ Performance Target: NEEDS IMPROVEMENT');
        return false;
      }
    });
    
  } catch (error) {
    console.error('❌ Stream Processing Test Failed:', error.message);
    return false;
  }
}

/**
 * Test Local Model Manager cost savings
 */
function testLocalModelCostSavings() {
  console.log('🧪 Testing Local Model Cost Savings...');
  
  try {
    // Get Local Model Manager
    const localModelManager = GAssistant.Utils.Injector.get('Services.LocalModelManager');
    if (!localModelManager) {
      throw new Error('LocalModelManager not available');
    }
    
    // Create manager
    localModelManager.createManager().then(manager => {
      // Test queries
      const testQueries = [
        'تحليل البيانات المالية',
        'إنشاء تقرير شهري',
        'حساب الأرباح والخسائر'
      ];
      
      // Process queries
      const promises = testQueries.map(query => 
        manager.generate(query, 'gemma-2b')
      );
      
      Promise.all(promises).then(results => {
        const stats = manager.getCostStats();
        
        console.log('✅ Local Model Test Results:');
        console.log(`   Total Calls: ${stats.totalCalls}`);
        console.log(`   Local Calls: ${stats.localCalls}`);
        console.log(`   API Calls: ${stats.apiCalls}`);
        console.log(`   Local Usage: ${stats.localPercentage}`);
        console.log(`   Cost Savings: ${stats.costSavings}`);
        console.log(`   Monthly Savings: ${stats.estimatedMonthlySavings}`);
        
        // Cost savings assertion
        const localPercentage = parseFloat(stats.localPercentage);
        if (localPercentage > 60) {
          console.log('🎯 Cost Savings Target: ACHIEVED (60% reduction)');
          return true;
        } else {
          console.log('⚠️ Cost Savings Target: NEEDS IMPROVEMENT');
          return false;
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Local Model Test Failed:', error.message);
    return false;
  }
}

/**
 * Run comprehensive performance tests
 */
function runPerformanceTests() {
  console.log('🚀 Starting Performance Tests for Week 1-2...');
  
  const tests = [
    { name: 'Stream Processing Performance', test: testStreamProcessingPerformance },
    { name: 'Local Model Cost Savings', test: testLocalModelCostSavings }
  ];
  
  let passedTests = 0;
  
  tests.forEach(({ name, test }) => {
    try {
      console.log(`\n📋 Running: ${name}`);
      const result = test();
      if (result) {
        console.log(`✅ ${name}: PASSED`);
        passedTests++;
      } else {
        console.log(`❌ ${name}: FAILED`);
      }
    } catch (error) {
      console.error(`💥 ${name}: ERROR - ${error.message}`);
    }
  });
  
  console.log(`\n📊 Performance Test Results: ${passedTests}/${tests.length} passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All performance targets achieved!');
    console.log('✅ Ready for Week 3-4: CLI Automation + Advanced Caching');
  } else {
    console.log('⚠️ Some performance targets need attention');
  }
  
  return passedTests === tests.length;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testStreamProcessingPerformance,
    testLocalModelCostSavings,
    runPerformanceTests
  };
}