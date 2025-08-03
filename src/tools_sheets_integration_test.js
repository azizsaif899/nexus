/**
 * اختبار تكامل أدوات Sheets المحسنة مع المرحلة الثالثة
 * Enhanced Sheets Tools Integration Test
 */

// اختبار شامل لأدوات Sheets المحسنة
async function testEnhancedSheetsTools() {
  Logger.log('🧪 Starting Enhanced Sheets Tools Integration Test...');

  const results = {
    basicOperations: false,
    templateCreation: false,
    aiAnalysis: false,
    advancedFeatures: false,
    errorHandling: false
  };

  try {
    const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');

    // 1. اختبار العمليات الأساسية
    Logger.log('1️⃣ Testing basic operations...');

    // كتابة وقراءة خلية
    const writeResult = sheetsTools.writeToCell('Test_Sheet', 'A1', 'Test Value');
    if (writeResult.success) {
      const readResult = sheetsTools.readFromCell('Test_Sheet', 'A1');
      results.basicOperations = readResult.success && readResult.value === 'Test Value';
    }

    Logger.log(`   Basic operations: ${results.basicOperations ? '✅ PASSED' : '❌ FAILED'}`);

    // 2. اختبار إنشاء القوالب
    Logger.log('2️⃣ Testing template creation...');

    const templateResult = sheetsTools.createTemplateSheet('financial');
    results.templateCreation = templateResult.success;

    Logger.log(`   Template creation: ${results.templateCreation ? '✅ PASSED' : '❌ FAILED'}`);

    // 3. اختبار التحليل بالذكاء الصناعي (إذا كان متوفراً)
    Logger.log('3️⃣ Testing AI analysis...');

    try {
      // إضافة بيانات تجريبية للتحليل
      const testData = [
        ['Product', 'Sales', 'Profit'],
        ['Product A', '1000', '300'],
        ['Product B', '1500', '450'],
        ['Product C', '800', '200']
      ];

      // كتابة البيانات التجريبية
      const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');
      crud.writeData('AI_Test_Sheet', 'A1:C4', testData);

      // تحليل البيانات
      const analysisResult = await sheetsTools.analyzeSheetWithAI('AI_Test_Sheet', 'financial');
      results.aiAnalysis = analysisResult.success;

      Logger.log(`   AI analysis: ${results.aiAnalysis ? '✅ PASSED' : '❌ FAILED'}`);
    } catch (error) {
      Logger.log(`   AI analysis: ⏭️ SKIPPED (${error.message})`);
      results.aiAnalysis = 'SKIPPED';
    }

    // 4. اختبار الميزات المتقدمة
    Logger.log('4️⃣ Testing advanced features...');

    // تحليل أنواع الأعمدة
    const columnAnalysis = sheetsTools.analyzeColumnTypes('AI_Test_Sheet');

    // إحصائيات الورقة
    const statsResult = sheetsTools.summarizeSheetStats('AI_Test_Sheet');

    // البحث والاستبدال
    const replaceResult = sheetsTools.findAndReplace('AI_Test_Sheet', 'Product', 'Item');

    results.advancedFeatures = columnAnalysis.success && statsResult.success && replaceResult.success;

    Logger.log(`   Advanced features: ${results.advancedFeatures ? '✅ PASSED' : '❌ FAILED'}`);

    // 5. اختبار معالجة الأخطاء
    Logger.log('5️⃣ Testing error handling...');

    // محاولة قراءة من ورقة غير موجودة
    const errorResult = sheetsTools.readFromCell('NonExistent_Sheet', 'A1');
    results.errorHandling = !errorResult.success && errorResult.error;

    Logger.log(`   Error handling: ${results.errorHandling ? '✅ PASSED' : '❌ FAILED'}`);

    // تقرير النتائج النهائية
    const passedTests = Object.values(results).filter(r => r === true).length;
    const totalTests = Object.keys(results).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    Logger.log('\n📊 ENHANCED SHEETS TOOLS TEST RESULTS:');
    Logger.log(`   Basic Operations: ${results.basicOperations ? '✅' : '❌'}`);
    Logger.log(`   Template Creation: ${results.templateCreation ? '✅' : '❌'}`);
    Logger.log(`   AI Analysis: ${results.aiAnalysis === true ? '✅' : results.aiAnalysis === 'SKIPPED' ? '⏭️' : '❌'}`);
    Logger.log(`   Advanced Features: ${results.advancedFeatures ? '✅' : '❌'}`);
    Logger.log(`   Error Handling: ${results.errorHandling ? '✅' : '❌'}`);
    Logger.log(`🎯 SUCCESS RATE: ${successRate}% (${passedTests}/${totalTests})`);

    return results;

  } catch (error) {
    Logger.log(`❌ Enhanced Sheets Tools test failed: ${error.message}`);
    return results;
  }
}

// اختبار الأداء لأدوات Sheets
function testSheetsToolsPerformance() {
  Logger.log('⚡ Starting Sheets Tools Performance Test...');

  const startTime = new Date().getTime();

  try {
    const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');

    // اختبار سرعة الكتابة
    const writeStart = new Date().getTime();
    for (let i = 1; i <= 10; i++) {
      sheetsTools.writeToCell('Performance_Test', `A${i}`, `Test ${i}`);
    }
    const writeTime = new Date().getTime() - writeStart;

    // اختبار سرعة القراءة
    const readStart = new Date().getTime();
    for (let i = 1; i <= 10; i++) {
      sheetsTools.readFromCell('Performance_Test', `A${i}`);
    }
    const readTime = new Date().getTime() - readStart;

    // اختبار سرعة التحليل
    const analysisStart = new Date().getTime();
    const stats = sheetsTools.summarizeSheetStats('Performance_Test');
    const analysisTime = new Date().getTime() - analysisStart;

    const totalTime = new Date().getTime() - startTime;

    Logger.log('⚡ SHEETS TOOLS PERFORMANCE RESULTS:');
    Logger.log(`   Write Operations (10x): ${writeTime}ms`);
    Logger.log(`   Read Operations (10x): ${readTime}ms`);
    Logger.log(`   Analysis Operations: ${analysisTime}ms`);
    Logger.log(`   Total Test Time: ${totalTime}ms`);

    // تقييم الأداء
    const performance = totalTime < 3000 ? 'Excellent' : totalTime < 6000 ? 'Good' : 'Needs Optimization';
    Logger.log(`🎯 PERFORMANCE RATING: ${performance}`);

    return {
      writeTime,
      readTime,
      analysisTime,
      totalTime,
      performance
    };

  } catch (error) {
    Logger.log(`❌ Performance test failed: ${error.message}`);
    return null;
  }
}

// اختبار التكامل مع المرحلة الثالثة
async function testPhase3Integration() {
  Logger.log('🔗 Testing Phase 3 Integration...');

  try {
    // التحقق من وجود جميع التبعيات
    const dependencies = [
      'System.SheetsCRUD',
      'System.ExtendedLogging',
      'System.GeminiEnhanced',
      'System.SheetsTemplates',
      'System.SheetsTools'
    ];

    const missingDeps = [];
    dependencies.forEach(dep => {
      try {
        GAssistant.Utils.Injector.get(dep);
      } catch (error) {
        missingDeps.push(dep);
      }
    });

    if (missingDeps.length > 0) {
      Logger.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
      return false;
    }

    Logger.log('✅ All Phase 3 dependencies available');

    // اختبار التكامل الفعلي
    const sheetsTools = GAssistant.Utils.Injector.get('System.SheetsTools');
    const logging = GAssistant.Utils.Injector.get('System.ExtendedLogging');

    // اختبار التسجيل
    logging.info('Integration Test', 'Testing Sheets Tools integration');

    // اختبار إنشاء قالب
    const templateResult = sheetsTools.createTemplateSheet('project');

    // اختبار التحليل
    const statsResult = sheetsTools.summarizeSheetStats(templateResult.sheetName);

    const integrationSuccess = templateResult.success && statsResult.success;

    Logger.log(`🔗 Phase 3 Integration: ${integrationSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);

    return integrationSuccess;

  } catch (error) {
    Logger.log(`❌ Integration test failed: ${error.message}`);
    return false;
  }
}

// تشغيل جميع اختبارات أدوات Sheets
async function runAllSheetsToolsTests() {
  Logger.log('🚀 Running ALL Sheets Tools Tests...');
  Logger.log('='.repeat(50));

  const results = {
    enhancedToolsTest: null,
    performanceTest: null,
    integrationTest: null
  };

  try {
    // 1. اختبار الأدوات المحسنة
    Logger.log('1️⃣ Enhanced Tools Test...');
    results.enhancedToolsTest = await testEnhancedSheetsTools();

    // 2. اختبار الأداء
    Logger.log('\n2️⃣ Performance Test...');
    results.performanceTest = testSheetsToolsPerformance();

    // 3. اختبار التكامل
    Logger.log('\n3️⃣ Integration Test...');
    results.integrationTest = await testPhase3Integration();

    Logger.log('\n' + '='.repeat(50));
    Logger.log('🎯 ALL SHEETS TOOLS TESTS COMPLETED');

    // تقييم عام
    const overallSuccess = results.enhancedToolsTest &&
                          results.performanceTest &&
                          results.integrationTest;

    Logger.log(`📊 OVERALL RESULT: ${overallSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS'}`);

    return results;

  } catch (error) {
    Logger.log(`❌ Test suite failed: ${error.message}`);
    return results;
  }
}

// تنظيف بيانات الاختبار
function cleanupSheetsTestData() {
  Logger.log('🧹 Cleaning up Sheets test data...');

  try {
    const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');

    const testSheets = [
      'Test_Sheet',
      'AI_Test_Sheet',
      'Performance_Test',
      'Financial_Template',
      'Project_Template',
      'Data_Analysis_Template'
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
  global.testEnhancedSheetsTools = testEnhancedSheetsTools;
  global.testSheetsToolsPerformance = testSheetsToolsPerformance;
  global.testPhase3Integration = testPhase3Integration;
  global.runAllSheetsToolsTests = runAllSheetsToolsTests;
  global.cleanupSheetsTestData = cleanupSheetsTestData;
}

Logger.log('🧪 Sheets Tools Integration Test System loaded successfully');
