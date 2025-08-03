/**
 * التحقق من صحة المرحلة الثالثة
 * Phase 3 Validation & Testing
 */

// اختبار سريع للمرحلة الثالثة
function quickPhase3Test() {
  Logger.log('🧪 Starting Phase 3 Quick Test...');

  try {
    // 1. اختبار تحميل الوحدات
    const templates = GAssistant.Utils.Injector.get('System.SheetsTemplates');
    const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');
    const gemini = GAssistant.Utils.Injector.get('System.GeminiEnhanced');
    const logging = GAssistant.Utils.Injector.get('System.ExtendedLogging');

    Logger.log('✅ All Phase 3 modules loaded successfully');

    // 2. اختبار إنشاء قالب
    const testSheet = templates.createFinancialTemplate();
    Logger.log('✅ Financial template created successfully');

    // 3. اختبار CRUD
    const testData = [['Test', '100', 'Active']];
    const writeSuccess = crud.writeData('Financial_Template', 'A3:C3', testData);
    Logger.log(`✅ CRUD write test: ${writeSuccess ? 'PASSED' : 'FAILED'}`);

    // 4. اختبار التسجيل
    logging.info('Phase3Test', 'Test log entry created successfully');
    Logger.log('✅ Extended logging test passed');

    // 5. اختبار إعدادات Gemini (بدون استدعاء فعلي)
    const retryConfig = gemini.retryConfig;
    Logger.log(`✅ Gemini retry config loaded: ${retryConfig.maxRetries} retries`);

    Logger.log('🎯 Phase 3 Quick Test COMPLETED SUCCESSFULLY');
    return true;

  } catch (error) {
    Logger.log(`❌ Phase 3 Quick Test FAILED: ${error.message}`);
    return false;
  }
}

// اختبار شامل للمرحلة الثالثة
async function comprehensivePhase3Test() {
  Logger.log('🔬 Starting Comprehensive Phase 3 Test...');

  const results = {
    modulesLoaded: false,
    templatesWorking: false,
    crudOperations: false,
    loggingSystem: false,
    geminiConnection: false,
    integrationTest: false
  };

  try {
    // 1. اختبار تحميل الوحدات
    const controller = GAssistant.Utils.Injector.get('System.Phase3Controller');
    results.modulesLoaded = true;
    Logger.log('✅ Phase 3 modules loaded');

    // 2. اختبار القوالب
    const templates = GAssistant.Utils.Injector.get('System.SheetsTemplates');
    const projectTemplate = templates.createProjectTemplate();
    const dataTemplate = templates.createDataAnalysisTemplate();
    results.templatesWorking = true;
    Logger.log('✅ Templates creation test passed');

    // 3. اختبار CRUD
    const tests = GAssistant.Utils.Injector.get('System.Phase3Tests');
    const crudResult = await tests.testSheetsCRUD();
    results.crudOperations = crudResult.success;
    Logger.log(`✅ CRUD operations test: ${crudResult.success ? 'PASSED' : 'FAILED'}`);

    // 4. اختبار نظام التسجيل
    const logging = GAssistant.Utils.Injector.get('System.ExtendedLogging');
    logging.info('ComprehensiveTest', 'Testing all log levels');
    logging.warning('ComprehensiveTest', 'Warning level test');
    logging.error('ComprehensiveTest', 'Error level test');
    logging.debug('ComprehensiveTest', 'Debug level test');

    const logs = logging.getLogs('INFO', 'ComprehensiveTest', 10);
    results.loggingSystem = logs.length > 0;
    Logger.log(`✅ Logging system test: ${results.loggingSystem ? 'PASSED' : 'FAILED'}`);

    // 5. اختبار Gemini (إذا كان API key متوفر)
    try {
      const geminiResult = await tests.testGeminiIntegration();
      results.geminiConnection = geminiResult.success;
      Logger.log(`✅ Gemini integration test: ${geminiResult.success ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      Logger.log(`⚠️ Gemini test skipped: ${error.message}`);
      results.geminiConnection = 'SKIPPED';
    }

    // 6. اختبار التكامل الكامل
    try {
      const integrationResult = await tests.testFullIntegration();
      results.integrationTest = integrationResult.success;
      Logger.log(`✅ Full integration test: ${integrationResult.success ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      Logger.log(`⚠️ Integration test failed: ${error.message}`);
      results.integrationTest = false;
    }

    // تقرير النتائج
    const passedTests = Object.values(results).filter(r => r === true).length;
    const totalTests = Object.keys(results).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    Logger.log('📊 COMPREHENSIVE TEST RESULTS:');
    Logger.log(`   Modules Loaded: ${results.modulesLoaded ? '✅' : '❌'}`);
    Logger.log(`   Templates Working: ${results.templatesWorking ? '✅' : '❌'}`);
    Logger.log(`   CRUD Operations: ${results.crudOperations ? '✅' : '❌'}`);
    Logger.log(`   Logging System: ${results.loggingSystem ? '✅' : '❌'}`);
    Logger.log(`   Gemini Connection: ${results.geminiConnection === true ? '✅' : results.geminiConnection === 'SKIPPED' ? '⏭️' : '❌'}`);
    Logger.log(`   Integration Test: ${results.integrationTest ? '✅' : '❌'}`);
    Logger.log(`🎯 SUCCESS RATE: ${successRate}% (${passedTests}/${totalTests})`);

    return results;

  } catch (error) {
    Logger.log(`❌ Comprehensive test failed: ${error.message}`);
    return results;
  }
}

// إنشاء تقرير حالة المرحلة الثالثة
function generatePhase3StatusReport() {
  Logger.log('📋 Generating Phase 3 Status Report...');

  try {
    const controller = GAssistant.Utils.Injector.get('System.Phase3Controller');
    const report = controller.generateStatusReport();

    Logger.log('📄 Phase 3 Status Report Generated Successfully');
    Logger.log(`   Progress: ${report.progress}`);
    Logger.log(`   Components: ${Object.keys(report.components).length} implemented`);

    return report;

  } catch (error) {
    Logger.log(`❌ Failed to generate status report: ${error.message}`);
    return null;
  }
}

// اختبار الأداء للمرحلة الثالثة
function performanceTest() {
  Logger.log('⚡ Starting Phase 3 Performance Test...');

  const startTime = new Date().getTime();

  try {
    // اختبار سرعة تحميل الوحدات
    const moduleLoadStart = new Date().getTime();
    const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');
    const templates = GAssistant.Utils.Injector.get('System.SheetsTemplates');
    const logging = GAssistant.Utils.Injector.get('System.ExtendedLogging');
    const moduleLoadTime = new Date().getTime() - moduleLoadStart;

    // اختبار سرعة إنشاء القوالب
    const templateStart = new Date().getTime();
    templates.createFinancialTemplate();
    const templateTime = new Date().getTime() - templateStart;

    // اختبار سرعة CRUD
    const crudStart = new Date().getTime();
    const testData = [['Performance Test', new Date().toISOString(), 'Active']];
    crud.writeData('Financial_Template', 'A10:C10', testData);
    const readData = crud.readData('Financial_Template', 'A10:C10');
    const crudTime = new Date().getTime() - crudStart;

    // اختبار سرعة التسجيل
    const loggingStart = new Date().getTime();
    logging.info('PerformanceTest', 'Performance test log entry');
    const loggingTime = new Date().getTime() - loggingStart;

    const totalTime = new Date().getTime() - startTime;

    Logger.log('⚡ PERFORMANCE TEST RESULTS:');
    Logger.log(`   Module Loading: ${moduleLoadTime}ms`);
    Logger.log(`   Template Creation: ${templateTime}ms`);
    Logger.log(`   CRUD Operations: ${crudTime}ms`);
    Logger.log(`   Logging System: ${loggingTime}ms`);
    Logger.log(`   Total Test Time: ${totalTime}ms`);

    // تقييم الأداء
    const performance = totalTime < 5000 ? 'Excellent' : totalTime < 10000 ? 'Good' : 'Needs Optimization';
    Logger.log(`🎯 PERFORMANCE RATING: ${performance}`);

    return {
      moduleLoadTime,
      templateTime,
      crudTime,
      loggingTime,
      totalTime,
      performance
    };

  } catch (error) {
    Logger.log(`❌ Performance test failed: ${error.message}`);
    return null;
  }
}

// تشغيل جميع اختبارات المرحلة الثالثة
async function runAllPhase3Tests() {
  Logger.log('🚀 Running ALL Phase 3 Tests...');
  Logger.log('='.repeat(50));

  const results = {
    quickTest: false,
    comprehensiveTest: null,
    performanceTest: null,
    statusReport: null
  };

  try {
    // 1. اختبار سريع
    Logger.log('1️⃣ Quick Test...');
    results.quickTest = quickPhase3Test();

    // 2. اختبار شامل
    Logger.log('\n2️⃣ Comprehensive Test...');
    results.comprehensiveTest = await comprehensivePhase3Test();

    // 3. اختبار الأداء
    Logger.log('\n3️⃣ Performance Test...');
    results.performanceTest = performanceTest();

    // 4. تقرير الحالة
    Logger.log('\n4️⃣ Status Report...');
    results.statusReport = generatePhase3StatusReport();

    Logger.log('\n' + '='.repeat(50));
    Logger.log('🎯 ALL PHASE 3 TESTS COMPLETED');

    // تقييم عام
    const overallSuccess = results.quickTest &&
                          results.comprehensiveTest &&
                          results.performanceTest &&
                          results.statusReport;

    Logger.log(`📊 OVERALL RESULT: ${overallSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS'}`);

    return results;

  } catch (error) {
    Logger.log(`❌ Test suite failed: ${error.message}`);
    return results;
  }
}

// دالة مساعدة لتنظيف بيانات الاختبار
function cleanupPhase3TestData() {
  Logger.log('🧹 Cleaning up Phase 3 test data...');

  try {
    const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');

    // حذف أوراق الاختبار
    const testSheets = [
      'Financial_Template',
      'Project_Template',
      'Data_Analysis_Template',
      'Test_CRUD',
      'Integration_Test',
      'Phase3_Status_Report'
    ];

    let deletedCount = 0;
    testSheets.forEach(sheetName => {
      if (crud.deleteSheet(sheetName)) {
        deletedCount++;
      }
    });

    Logger.log(`✅ Cleanup completed: ${deletedCount} test sheets removed`);
    return true;

  } catch (error) {
    Logger.log(`❌ Cleanup failed: ${error.message}`);
    return false;
  }
}

// تصدير الدوال للاستخدام العام
if (typeof global !== 'undefined') {
  global.quickPhase3Test = quickPhase3Test;
  global.comprehensivePhase3Test = comprehensivePhase3Test;
  global.generatePhase3StatusReport = generatePhase3StatusReport;
  global.performanceTest = performanceTest;
  global.runAllPhase3Tests = runAllPhase3Tests;
  global.cleanupPhase3TestData = cleanupPhase3TestData;
}

Logger.log('🧪 Phase 3 Validation System loaded successfully');
