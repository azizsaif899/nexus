/**
 * اختبارات الأداء للتحقق من فعالية إصلاحات Batch Operations
 * يقارن الأداء قبل وبعد التحسينات
 * 
 * @module Tests.Performance
 * @requires System.SheetsOptimizer
 * @requires System.NetworkResilience
 * @requires System.PerformanceProfiler
 * @since 6.1.0
 * @author G-Assistant Team
 */

/**
 * اختبار أداء العمليات المجمعة مقابل العمليات الفردية
 * @returns {Object} نتائج الاختبار
 */
function testBatchVsIndividualOperations() {
  const testData = generateTestData(100); // 100 صف
  const sheet = SpreadsheetApp.getActiveSheet();
  
  console.log('🧪 بدء اختبار الأداء: Batch vs Individual Operations');
  
  // الطريقة القديمة (فردية)
  const oldStart = Date.now();
  testData.forEach((row, index) => {
    sheet.getRange(index + 1, 1).setValue(row[0]);
    sheet.getRange(index + 1, 2).setValue(row[1]);
  });
  const oldTime = Date.now() - oldStart;
  
  // مسح البيانات
  sheet.clear();
  
  // الطريقة الجديدة (مجمعة)
  const sheetsOptimizer = GAssistant.Utils.Injector.get('System.SheetsOptimizer');
  const newStart = Date.now();
  sheetsOptimizer.batchWrite(sheet, 'A1', testData);
  const newTime = Date.now() - newStart;
  
  const improvement = ((oldTime - newTime) / oldTime * 100).toFixed(2);
  
  console.log(`⏱️ الطريقة القديمة: ${oldTime}ms`);
  console.log(`⚡ الطريقة الجديدة: ${newTime}ms`);
  console.log(`📈 تحسن الأداء: ${improvement}%`);
  
  return {
    oldTime,
    newTime,
    improvement: parseFloat(improvement),
    passed: improvement > 50 // يجب أن يكون التحسن أكثر من 50%
  };
}

/**
 * اختبار موثوقية NetworkResilience
 * @returns {Object} نتائج الاختبار
 */
function testNetworkResilience() {
  console.log('🌐 بدء اختبار NetworkResilience');
  
  const networkResilience = GAssistant.Utils.Injector.get('System.NetworkResilience');
  const testUrl = 'https://httpstat.us/200'; // خدمة اختبار HTTP
  
  const start = Date.now();
  let success = false;
  let error = null;
  
  try {
    const response = networkResilience.resilientFetch(testUrl);
    success = response.getResponseCode() === 200;
  } catch (e) {
    error = e.message;
  }
  
  const duration = Date.now() - start;
  
  console.log(`🌐 نتيجة الاتصال: ${success ? 'نجح' : 'فشل'}`);
  console.log(`⏱️ وقت الاستجابة: ${duration}ms`);
  if (error) console.log(`❌ الخطأ: ${error}`);
  
  return {
    success,
    duration,
    error,
    passed: success && duration < 10000 // يجب أن ينجح في أقل من 10 ثوان
  };
}

/**
 * اختبار شامل للأداء
 * @returns {Object} تقرير شامل
 */
function runPerformanceTests() {
  console.log('🚀 بدء الاختبارات الشاملة للأداء');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };
  
  // اختبار العمليات المجمعة
  try {
    results.tests.batchOperations = testBatchVsIndividualOperations();
    results.summary.total++;
    if (results.tests.batchOperations.passed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
  } catch (e) {
    results.tests.batchOperations = { error: e.message, passed: false };
    results.summary.total++;
    results.summary.failed++;
  }
  
  // اختبار موثوقية الشبكة
  try {
    results.tests.networkResilience = testNetworkResilience();
    results.summary.total++;
    if (results.tests.networkResilience.passed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
  } catch (e) {
    results.tests.networkResilience = { error: e.message, passed: false };
    results.summary.total++;
    results.summary.failed++;
  }
  
  // حساب معدل النجاح
  results.summary.successRate = (results.summary.passed / results.summary.total * 100).toFixed(2);
  
  console.log('📊 ملخص نتائج الاختبارات:');
  console.log(`✅ نجح: ${results.summary.passed}`);
  console.log(`❌ فشل: ${results.summary.failed}`);
  console.log(`📈 معدل النجاح: ${results.summary.successRate}%`);
  
  // حفظ النتائج
  saveTestResults(results);
  
  return results;
}

/**
 * توليد بيانات اختبار
 * @private
 * @param {number} rows - عدد الصفوف
 * @returns {Array<Array>} بيانات الاختبار
 */
function generateTestData(rows) {
  const data = [];
  for (let i = 0; i < rows; i++) {
    data.push([
      `Test Item ${i + 1}`,
      Math.floor(Math.random() * 1000),
      new Date().toISOString()
    ]);
  }
  return data;
}

/**
 * حفظ نتائج الاختبار
 * @private
 * @param {Object} results - النتائج
 */
function saveTestResults(results) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName('Performance_Test_Results') || 
      SpreadsheetApp.getActiveSpreadsheet().insertSheet('Performance_Test_Results');
    
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 6).setValues([[
        'Timestamp', 'Total Tests', 'Passed', 'Failed', 'Success Rate', 'Details'
      ]]);
    }
    
    sheet.appendRow([
      results.timestamp,
      results.summary.total,
      results.summary.passed,
      results.summary.failed,
      `${results.summary.successRate}%`,
      JSON.stringify(results.tests)
    ]);
    
    console.log('💾 تم حفظ نتائج الاختبار في ورقة Performance_Test_Results');
    
  } catch (e) {
    console.error('فشل في حفظ نتائج الاختبار:', e);
  }
}

// تصدير الدوال للاستخدام الخارجي
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testBatchVsIndividualOperations,
    testNetworkResilience,
    runPerformanceTests
  };
}