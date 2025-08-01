/**
 * اختبارات التكامل للأسبوع الثاني والثالث
 * تتحقق من الحلول المحسنة للأداء والتكلفة
 */

class Week23IntegrationTests {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  /**
   * تشغيل جميع الاختبارات
   */
  async runAllTests() {
    console.log('🧪 بدء اختبارات التكامل للأسبوع 2-3...');
    
    const tests = [
      this.testVectorStorePerformance,
      this.testEmbeddingPreprocessor,
      this.testEnhancedCFOAgent,
      this.testSemanticSearchAPI,
      this.testSchedulerIntegration,
      this.testEndToEndWorkflow
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        this.logResult(test.name, false, error.message);
      }
    }

    this.generateReport();
    return this.results;
  }

  /**
   * اختبار أداء Vector Store
   */
  async testVectorStorePerformance() {
    const testName = 'Vector Store Performance';
    console.log(`🔍 ${testName}...`);

    try {
      const vectorStore = Injector.get('Services.VectorStore');
      const embeddingService = Injector.get('Services.EmbeddingService');

      // اختبار التخزين المجمع
      const testItems = [];
      for (let i = 0; i < 10; i++) {
        const embedding = await embeddingService.generateEmbedding(`test content ${i}`);
        testItems.push({
          id: `test_${i}`,
          contentHash: `hash_${i}`,
          embedding
        });
      }

      const batchStart = Date.now();
      await vectorStore.storeBatchEmbeddings(testItems);
      const batchTime = Date.now() - batchStart;

      // اختبار البحث
      const searchStart = Date.now();
      const queryEmbedding = await embeddingService.generateEmbedding('test content');
      const results = await vectorStore.findSimilar(queryEmbedding, { threshold: 0.5 });
      const searchTime = Date.now() - searchStart;

      // التحقق من النتائج
      const passed = batchTime < 5000 && searchTime < 1000 && results.length > 0;
      
      this.logResult(testName, passed, `Batch: ${batchTime}ms, Search: ${searchTime}ms, Results: ${results.length}`);

    } catch (error) {
      this.logResult(testName, false, error.message);
    }
  }

  /**
   * اختبار المعالج المسبق
   */
  async testEmbeddingPreprocessor() {
    const testName = 'Embedding Preprocessor';
    console.log(`🔍 ${testName}...`);

    try {
      const preprocessor = Injector.get('Services.EmbeddingPreprocessor');
      
      // اختبار معالجة التقارير الجديدة
      const result = await preprocessor.processNewReports();
      
      const passed = result.success !== undefined && result.processed >= 0;
      this.logResult(testName, passed, `Processed: ${result.processed} reports`);

    } catch (error) {
      this.logResult(testName, false, error.message);
    }
  }

  /**
   * اختبار وكيل CFO المحسن
   */
  async testEnhancedCFOAgent() {
    const testName = 'Enhanced CFO Agent';
    console.log(`🔍 ${testName}...`);

    try {
      const cfoAgent = Injector.get('Agents.CFO.Enhanced');
      
      // اختبار تحليل التشابه
      const similarityStart = Date.now();
      const similarity = await cfoAgent.analyzeFinancialSimilarity('test_report', {
        threshold: 0.7,
        maxResults: 5
      });
      const similarityTime = Date.now() - similarityStart;

      // اختبار البحث عن المعاملات
      const transactionStart = Date.now();
      const transactions = await cfoAgent.findSimilarTransactions('test transaction');
      const transactionTime = Date.now() - transactionStart;

      const passed = similarityTime < 2000 && transactionTime < 2000;
      this.logResult(testName, passed, 
        `Similarity: ${similarityTime}ms, Transactions: ${transactionTime}ms`);

    } catch (error) {
      this.logResult(testName, false, error.message);
    }
  }

  /**
   * اختبار API البحث الدلالي
   */
  async testSemanticSearchAPI() {
    const testName = 'Semantic Search API';
    console.log(`🔍 ${testName}...`);

    try {
      const api = Injector.get('API.SemanticSearch');
      
      const mockRequest = {
        postData: {
          contents: JSON.stringify({
            query: 'test financial query',
            threshold: 0.6,
            maxResults: 10
          })
        },
        headers: { authorization: 'Bearer test_token' }
      };

      const apiStart = Date.now();
      const result = await api.handleSemanticSearch(mockRequest);
      const apiTime = Date.now() - apiStart;

      const passed = result.success !== undefined && apiTime < 3000;
      this.logResult(testName, passed, `Response time: ${apiTime}ms, Success: ${result.success}`);

    } catch (error) {
      this.logResult(testName, false, error.message);
    }
  }

  /**
   * اختبار تكامل المجدول
   */
  async testSchedulerIntegration() {
    const testName = 'Scheduler Integration';
    console.log(`🔍 ${testName}...`);

    try {
      const scheduler = Injector.get('Services.EmbeddingScheduler');
      
      // اختبار بدء وإيقاف المجدول
      scheduler.start();
      const startStats = scheduler.getStats();
      
      scheduler.stop();
      const stopStats = scheduler.getStats();

      const passed = startStats.isRunning === true && stopStats.isRunning === false;
      this.logResult(testName, passed, `Start: ${startStats.isRunning}, Stop: ${stopStats.isRunning}`);

    } catch (error) {
      this.logResult(testName, false, error.message);
    }
  }

  /**
   * اختبار سير العمل الكامل
   */
  async testEndToEndWorkflow() {
    const testName = 'End-to-End Workflow';
    console.log(`🔍 ${testName}...`);

    try {
      const workflowStart = Date.now();
      
      // 1. معالجة مسبقة
      const preprocessor = Injector.get('Services.EmbeddingPreprocessor');
      await preprocessor.processNewReports();
      
      // 2. تحليل مالي
      const cfoAgent = Injector.get('Agents.CFO.Enhanced');
      await cfoAgent.findSimilarTransactions('test');
      
      // 3. بحث دلالي
      const vectorStore = Injector.get('Services.VectorStore');
      const embeddingService = Injector.get('Services.EmbeddingService');
      
      const queryEmbedding = await embeddingService.generateEmbedding('workflow test');
      await vectorStore.findSimilar(queryEmbedding);
      
      const workflowTime = Date.now() - workflowStart;
      
      const passed = workflowTime < 10000; // أقل من 10 ثوانٍ
      this.logResult(testName, passed, `Total workflow time: ${workflowTime}ms`);

    } catch (error) {
      this.logResult(testName, false, error.message);
    }
  }

  /**
   * تسجيل نتيجة الاختبار
   */
  logResult(testName, passed, details) {
    const result = {
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${details}`);
  }

  /**
   * توليد تقرير شامل
   */
  generateReport() {
    const totalTime = Date.now() - this.startTime;
    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log('\n📊 تقرير اختبارات التكامل:');
    console.log('='.repeat(50));
    console.log(`⏱️  إجمالي الوقت: ${totalTime}ms`);
    console.log(`✅ الاختبارات الناجحة: ${passedTests}/${totalTests}`);
    console.log(`📈 معدل النجاح: ${successRate}%`);
    console.log('');

    // تفاصيل الاختبارات الفاشلة
    const failedTests = this.results.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.log('❌ الاختبارات الفاشلة:');
      failedTests.forEach(test => {
        console.log(`   - ${test.test}: ${test.details}`);
      });
    }

    console.log('='.repeat(50));
    
    return {
      totalTime,
      passedTests,
      totalTests,
      successRate,
      results: this.results
    };
  }
}

// دالة للتشغيل المباشر
function runWeek23IntegrationTests() {
  const tester = new Week23IntegrationTests();
  return tester.runAllTests();
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Week23IntegrationTests;
}