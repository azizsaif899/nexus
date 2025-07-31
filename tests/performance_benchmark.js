// performance_benchmark.js - قياس أداء النظام
const axios = require('axios');
const fs = require('fs');

class PerformanceBenchmark {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {}
    };
  }

  async measureEndpoint(name, url, data = null, headers = {}) {
    const measurements = [];
    const iterations = 10;

    console.log(`📊 قياس أداء: ${name}`);
    
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      
      try {
        const response = data 
          ? await axios.post(url, data, { headers, timeout: 5000 })
          : await axios.get(url, { headers, timeout: 5000 });
        
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // تحويل لميلي ثانية
        
        measurements.push({
          iteration: i + 1,
          duration_ms: duration,
          status: response.status,
          success: true
        });
        
        process.stdout.write('.');
      } catch (error) {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000;
        
        measurements.push({
          iteration: i + 1,
          duration_ms: duration,
          status: error.response?.status || 0,
          success: false,
          error: error.message
        });
        
        process.stdout.write('x');
      }
    }
    
    console.log(' ✅');
    
    // حساب الإحصائيات
    const successfulMeasurements = measurements.filter(m => m.success);
    const durations = successfulMeasurements.map(m => m.duration_ms);
    
    const stats = {
      name,
      url,
      total_requests: iterations,
      successful_requests: successfulMeasurements.length,
      success_rate: (successfulMeasurements.length / iterations) * 100,
      avg_response_time: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
      min_response_time: Math.min(...durations) || 0,
      max_response_time: Math.max(...durations) || 0,
      measurements
    };
    
    this.results.tests.push(stats);
    return stats;
  }

  async runBenchmarks() {
    console.log('🚀 بدء قياس الأداء الشامل\n');

    // Week 1 API Gateway
    await this.measureEndpoint(
      'Week1 Health Check',
      'http://localhost:8080/health'
    );

    await this.measureEndpoint(
      'Week1 API Gateway',
      'http://localhost:8080/api/v1/process',
      {
        type: 'analyze',
        data: { prompt: 'اختبار الأداء', context: 'performance' }
      },
      { 'X-API-Key': 'azizsys-october-2024-key' }
    );

    // Week 2 Processors
    await this.measureEndpoint(
      'Week2 Health Check',
      'http://localhost:3000/health'
    );

    await this.measureEndpoint(
      'Week2 Invoice Processor',
      'http://localhost:3000/process/invoice',
      {
        lines: [
          { item: 'اختبار الأداء', amount: 100 },
          { item: 'قياس السرعة', amount: 200 }
        ]
      }
    );

    await this.measureEndpoint(
      'Week2 Metrics',
      'http://localhost:3000/metrics'
    );

    this.generateSummary();
    this.saveResults();
    this.printReport();
  }

  generateSummary() {
    const allTests = this.results.tests;
    
    this.results.summary = {
      total_tests: allTests.length,
      overall_success_rate: allTests.reduce((sum, test) => sum + test.success_rate, 0) / allTests.length,
      avg_response_time: allTests.reduce((sum, test) => sum + test.avg_response_time, 0) / allTests.length,
      fastest_endpoint: allTests.reduce((min, test) => 
        test.avg_response_time < min.avg_response_time ? test : min
      ),
      slowest_endpoint: allTests.reduce((max, test) => 
        test.avg_response_time > max.avg_response_time ? test : max
      )
    };
  }

  saveResults() {
    const filename = `performance_report_${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 تم حفظ التقرير: ${filename}`);
  }

  printReport() {
    console.log('\n📊 تقرير الأداء الشامل');
    console.log('='.repeat(50));
    
    this.results.tests.forEach(test => {
      console.log(`\n🎯 ${test.name}:`);
      console.log(`   📈 معدل النجاح: ${test.success_rate.toFixed(1)}%`);
      console.log(`   ⏱️  متوسط الاستجابة: ${test.avg_response_time.toFixed(2)}ms`);
      console.log(`   🚀 أسرع استجابة: ${test.min_response_time.toFixed(2)}ms`);
      console.log(`   🐌 أبطأ استجابة: ${test.max_response_time.toFixed(2)}ms`);
      
      if (test.success_rate < 100) {
        const failures = test.measurements.filter(m => !m.success);
        console.log(`   ❌ فشل ${failures.length} طلبات`);
      }
    });

    console.log('\n🎯 الملخص الإجمالي:');
    console.log(`   📊 إجمالي الاختبارات: ${this.results.summary.total_tests}`);
    console.log(`   ✅ معدل النجاح العام: ${this.results.summary.overall_success_rate.toFixed(1)}%`);
    console.log(`   ⏱️  متوسط الاستجابة العام: ${this.results.summary.avg_response_time.toFixed(2)}ms`);
    console.log(`   🥇 أسرع endpoint: ${this.results.summary.fastest_endpoint.name} (${this.results.summary.fastest_endpoint.avg_response_time.toFixed(2)}ms)`);
    console.log(`   🐌 أبطأ endpoint: ${this.results.summary.slowest_endpoint.name} (${this.results.summary.slowest_endpoint.avg_response_time.toFixed(2)}ms)`);

    // تقييم الأداء
    const avgTime = this.results.summary.avg_response_time;
    const successRate = this.results.summary.overall_success_rate;
    
    console.log('\n🏆 التقييم:');
    if (avgTime < 300 && successRate > 95) {
      console.log('   🎉 ممتاز! الأداء فائق');
    } else if (avgTime < 500 && successRate > 90) {
      console.log('   ✅ جيد جداً! الأداء مقبول');
    } else if (avgTime < 1000 && successRate > 80) {
      console.log('   ⚠️  مقبول، يحتاج تحسين');
    } else {
      console.log('   ❌ ضعيف، يحتاج مراجعة شاملة');
    }
  }
}

// تشغيل قياس الأداء
async function main() {
  const benchmark = new PerformanceBenchmark();
  
  try {
    await benchmark.runBenchmarks();
  } catch (error) {
    console.error('❌ خطأ في قياس الأداء:', error.message);
    process.exit(1);
  }
}

main();