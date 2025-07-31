// test_october_integration.js - اختبار شامل لخطة أكتوبر
import axios from 'axios';
import assert from 'assert';

const CONFIG = {
  WEEK1_API: 'http://localhost:8080',
  WEEK2_API: 'http://localhost:3000',
  API_KEY: 'azizsys-october-2024-key',
  TIMEOUT: 5000
};

class OctoberTester {
  constructor() {
    this.results = {
      week1: { passed: 0, failed: 0, tests: [] },
      week2: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] }
    };
  }

  async runTest(testName, testFn, category = 'integration') {
    try {
      console.log(`🧪 ${testName}...`);
      await testFn();
      this.results[category].passed++;
      this.results[category].tests.push({ name: testName, status: 'PASS' });
      console.log(`✅ ${testName} - نجح`);
    } catch (error) {
      this.results[category].failed++;
      this.results[category].tests.push({ name: testName, status: 'FAIL', error: error.message });
      console.log(`❌ ${testName} - فشل: ${error.message}`);
    }
  }

  // اختبارات الأسبوع الأول
  async testWeek1Health() {
    const response = await axios.get(`${CONFIG.WEEK1_API}/health`, { timeout: CONFIG.TIMEOUT });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.status);
  }

  async testWeek1Security() {
    try {
      await axios.post(`${CONFIG.WEEK1_API}/api/v1/process`, {}, { timeout: CONFIG.TIMEOUT });
      throw new Error('يجب أن يفشل بدون API Key');
    } catch (error) {
      assert.strictEqual(error.response?.status, 401);
    }
  }

  async testWeek1APIGateway() {
    const response = await axios.post(`${CONFIG.WEEK1_API}/api/v1/process`, {
      type: 'analyze',
      data: { prompt: 'اختبار النظام', context: 'test' }
    }, {
      headers: { 'X-API-Key': CONFIG.API_KEY },
      timeout: CONFIG.TIMEOUT
    });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.result);
  }

  // اختبارات الأسبوع الثاني
  async testWeek2Health() {
    const response = await axios.get(`${CONFIG.WEEK2_API}/health`, { timeout: CONFIG.TIMEOUT });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.uptime);
  }

  async testWeek2Processor() {
    const response = await axios.post(`${CONFIG.WEEK2_API}/process/invoice`, {
      lines: [
        { item: 'اختبار', amount: 100 },
        { item: 'اختبار 2', amount: 200 }
      ]
    }, { timeout: CONFIG.TIMEOUT });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.processed);
  }

  async testWeek2Metrics() {
    const response = await axios.get(`${CONFIG.WEEK2_API}/metrics`, { timeout: CONFIG.TIMEOUT });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.cache);
    assert.ok(response.data.processing);
  }

  // اختبارات التكامل
  async testFullWorkflow() {
    // 1. معالجة عبر Week1 API Gateway
    const week1Response = await axios.post(`${CONFIG.WEEK1_API}/api/v1/process`, {
      type: 'report',
      data: { sheetId: 'test-sheet', range: 'A1:C5' }
    }, {
      headers: { 'X-API-Key': CONFIG.API_KEY },
      timeout: CONFIG.TIMEOUT
    });

    // 2. معالجة متقدمة عبر Week2 Processor
    const week2Response = await axios.post(`${CONFIG.WEEK2_API}/process/invoice`, {
      lines: week1Response.data.mockData || [{ item: 'test', amount: 100 }]
    }, { timeout: CONFIG.TIMEOUT });

    assert.ok(week1Response.data.result);
    assert.ok(week2Response.data.processed);
  }

  async testPerformance() {
    const startTime = Date.now();
    
    const promises = Array(5).fill().map(() => 
      axios.post(`${CONFIG.WEEK2_API}/process/invoice`, {
        lines: [{ item: 'performance test', amount: 50 }]
      }, { timeout: CONFIG.TIMEOUT })
    );

    await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    assert.ok(duration < 3000, `الأداء بطيء: ${duration}ms`);
  }

  async testCacheEfficiency() {
    const testData = { lines: [{ item: 'cache test', amount: 75 }] };
    
    // الطلب الأول
    const start1 = Date.now();
    await axios.post(`${CONFIG.WEEK2_API}/process/invoice`, testData, { timeout: CONFIG.TIMEOUT });
    const time1 = Date.now() - start1;

    // الطلب الثاني (من الكاش)
    const start2 = Date.now();
    await axios.post(`${CONFIG.WEEK2_API}/process/invoice`, testData, { timeout: CONFIG.TIMEOUT });
    const time2 = Date.now() - start2;

    assert.ok(time2 < time1 * 0.8, `الكاش غير فعال: ${time1}ms vs ${time2}ms`);
  }

  // تشغيل جميع الاختبارات
  async runAllTests() {
    console.log('🚀 بدء اختبارات خطة أكتوبر الشاملة\n');

    // اختبارات الأسبوع الأول
    console.log('📅 اختبارات الأسبوع الأول:');
    await this.runTest('Health Check - Week 1', () => this.testWeek1Health(), 'week1');
    await this.runTest('Security Middleware', () => this.testWeek1Security(), 'week1');
    await this.runTest('API Gateway', () => this.testWeek1APIGateway(), 'week1');

    // اختبارات الأسبوع الثاني
    console.log('\n📅 اختبارات الأسبوع الثاني:');
    await this.runTest('Health Check - Week 2', () => this.testWeek2Health(), 'week2');
    await this.runTest('GenAI Processor', () => this.testWeek2Processor(), 'week2');
    await this.runTest('Metrics Collection', () => this.testWeek2Metrics(), 'week2');

    // اختبارات التكامل
    console.log('\n🔗 اختبارات التكامل:');
    await this.runTest('Full Workflow', () => this.testFullWorkflow(), 'integration');
    await this.runTest('Performance Test', () => this.testPerformance(), 'integration');
    await this.runTest('Cache Efficiency', () => this.testCacheEfficiency(), 'integration');

    this.printResults();
  }

  printResults() {
    console.log('\n📊 نتائج الاختبارات:');
    console.log('='.repeat(50));
    
    ['week1', 'week2', 'integration'].forEach(category => {
      const result = this.results[category];
      const total = result.passed + result.failed;
      const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
      
      console.log(`\n${category.toUpperCase()}:`);
      console.log(`✅ نجح: ${result.passed}`);
      console.log(`❌ فشل: ${result.failed}`);
      console.log(`📈 معدل النجاح: ${percentage}%`);
      
      if (result.failed > 0) {
        console.log('الاختبارات الفاشلة:');
        result.tests.filter(t => t.status === 'FAIL').forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
      }
    });

    const totalPassed = this.results.week1.passed + this.results.week2.passed + this.results.integration.passed;
    const totalFailed = this.results.week1.failed + this.results.week2.failed + this.results.integration.failed;
    const overallPercentage = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);

    console.log('\n🎯 النتيجة الإجمالية:');
    console.log(`📊 ${totalPassed}/${totalPassed + totalFailed} اختبارات نجحت (${overallPercentage}%)`);
    
    if (overallPercentage >= 90) {
      console.log('🎉 ممتاز! النظام جاهز للإنتاج');
    } else if (overallPercentage >= 70) {
      console.log('⚠️ جيد، لكن يحتاج تحسينات');
    } else {
      console.log('❌ يحتاج مراجعة شاملة');
    }
  }
}

// تشغيل الاختبارات
async function main() {
  const tester = new OctoberTester();
  
  try {
    await tester.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في تشغيل الاختبارات:', error.message);
    process.exit(1);
  }
}

// تشغيل الاختبارات مباشرة
main().catch(error => {
  console.error('❌ خطأ في تشغيل الاختبارات:', error.message);
  process.exit(1);
});