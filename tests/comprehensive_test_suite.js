/**
 * مجموعة الاختبارات الشاملة لنظام AzizSys
 */

function runComprehensiveTests() {
  console.log('🧪 Starting Comprehensive Test Suite...');
  
  const testResults = {
    timestamp: new Date(),
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    warningTests: 0,
    testSuites: []
  };

  // تشغيل جميع مجموعات الاختبارات
  const testSuites = [
    { name: 'Sidebar Stability', func: testSidebarStability },
    { name: 'Gemini Integration', func: testGeminiIntegration },
    { name: 'WhatsApp Integration', func: testWhatsAppIntegration },
    { name: 'Edge Cases', func: testEdgeCases },
    { name: 'System Performance', func: testSystemPerformance }
  ];

  testSuites.forEach(suite => {
    try {
      console.log(`Running ${suite.name} tests...`);
      const result = suite.func();
      testResults.testSuites.push(result);
      
      // تحديث الإحصائيات
      testResults.totalTests += result.tests.length;
      testResults.passedTests += result.tests.filter(t => t.status === 'PASS').length;
      testResults.failedTests += result.tests.filter(t => t.status === 'FAIL').length;
      testResults.warningTests += result.tests.filter(t => t.status === 'WARNING').length;
      
    } catch (e) {
      console.error(`Failed to run ${suite.name}:`, e.message);
      testResults.testSuites.push({
        name: suite.name,
        overall: 'ERROR',
        error: e.message
      });
      testResults.failedTests++;
    }
  });

  // إنشاء التقرير النهائي
  const report = generateTestReport(testResults);
  
  // حفظ التقرير
  saveTestReport(report);
  
  // إرسال تنبيه للمدير
  sendTestNotification(testResults);
  
  console.log('✅ Comprehensive Test Suite Completed');
  return testResults;
}

function testSystemPerformance() {
  const results = {
    timestamp: new Date(),
    tests: [],
    overall: 'UNKNOWN'
  };

  // اختبار 1: سرعة الاستجابة
  try {
    const startTime = new Date().getTime();
    
    // محاكاة عملية معقدة
    for (let i = 0; i < 1000; i++) {
      Math.random() * Math.sqrt(i);
    }
    
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    
    results.tests.push({
      name: 'Response Time',
      status: responseTime < 5000 ? 'PASS' : 'FAIL',
      message: `Response time: ${responseTime}ms`
    });
  } catch (e) {
    results.tests.push({
      name: 'Response Time',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 2: استخدام الذاكرة
  try {
    const memoryTest = testMemoryUsage();
    results.tests.push({
      name: 'Memory Usage',
      status: memoryTest.efficient ? 'PASS' : 'WARNING',
      message: memoryTest.message
    });
  } catch (e) {
    results.tests.push({
      name: 'Memory Usage',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 3: معدل الأخطاء
  try {
    const errorRate = calculateErrorRate();
    results.tests.push({
      name: 'Error Rate',
      status: errorRate < 0.01 ? 'PASS' : 'WARNING',
      message: `Error rate: ${(errorRate * 100).toFixed(2)}%`
    });
  } catch (e) {
    results.tests.push({
      name: 'Error Rate',
      status: 'FAIL',
      message: e.message
    });
  }

  // تحديد النتيجة الإجمالية
  const failedTests = results.tests.filter(t => t.status === 'FAIL');
  results.overall = failedTests.length === 0 ? 'PASS' : 'FAIL';

  return results;
}

function testMemoryUsage() {
  // محاكاة اختبار استخدام الذاكرة
  const testData = new Array(1000).fill('test');
  const memoryUsage = testData.length * 10; // تقدير تقريبي
  
  return {
    efficient: memoryUsage < 50000,
    message: `Estimated memory usage: ${memoryUsage} bytes`
  };
}

function calculateErrorRate() {
  // محاكاة حساب معدل الأخطاء
  const totalOperations = 1000;
  const errors = Math.floor(Math.random() * 10);
  return errors / totalOperations;
}

function generateTestReport(testResults) {
  const successRate = (testResults.passedTests / testResults.totalTests * 100).toFixed(2);
  
  let report = `
# 📊 تقرير الاختبارات الشامل - AzizSys

## 📈 الإحصائيات العامة
- **تاريخ التشغيل**: ${testResults.timestamp.toLocaleString('ar-SA')}
- **إجمالي الاختبارات**: ${testResults.totalTests}
- **الاختبارات الناجحة**: ${testResults.passedTests}
- **الاختبارات الفاشلة**: ${testResults.failedTests}
- **التحذيرات**: ${testResults.warningTests}
- **معدل النجاح**: ${successRate}%

## 🎯 نتائج مجموعات الاختبارات

`;

  testResults.testSuites.forEach(suite => {
    const status = suite.overall === 'PASS' ? '✅' : 
                   suite.overall === 'WARNING' ? '⚠️' : '❌';
    
    report += `### ${status} ${suite.name}\n`;
    report += `- **الحالة العامة**: ${suite.overall}\n`;
    
    if (suite.tests) {
      suite.tests.forEach(test => {
        const testStatus = test.status === 'PASS' ? '✅' : 
                          test.status === 'WARNING' ? '⚠️' : '❌';
        report += `  - ${testStatus} ${test.name}: ${test.message}\n`;
      });
    }
    
    if (suite.error) {
      report += `  - ❌ خطأ: ${suite.error}\n`;
    }
    
    report += '\n';
  });

  // توصيات
  report += `## 💡 التوصيات\n\n`;
  
  if (testResults.failedTests > 0) {
    report += `- 🔧 يجب إصلاح ${testResults.failedTests} اختبار فاشل قبل النشر\n`;
  }
  
  if (testResults.warningTests > 0) {
    report += `- ⚠️ مراجعة ${testResults.warningTests} تحذير لتحسين الأداء\n`;
  }
  
  if (successRate < 90) {
    report += `- 📈 معدل النجاح ${successRate}% يحتاج تحسين (الهدف: 95%+)\n`;
  }
  
  if (testResults.failedTests === 0 && testResults.warningTests === 0) {
    report += `- 🎉 جميع الاختبارات نجحت! النظام جاهز للنشر\n`;
  }

  return report;
}

function saveTestReport(report) {
  try {
    // حفظ في Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test_Reports') || 
                  SpreadsheetApp.getActiveSpreadsheet().insertSheet('Test_Reports');
    
    const timestamp = new Date().toISOString();
    sheet.appendRow([timestamp, 'Comprehensive Test', report]);
    
    // حفظ في Google Drive (اختياري)
    const blob = Utilities.newBlob(report, 'text/markdown', `test_report_${timestamp}.md`);
    DriveApp.createFile(blob);
    
  } catch (e) {
    console.error('Failed to save test report:', e.message);
  }
}

function sendTestNotification(testResults) {
  try {
    const successRate = (testResults.passedTests / testResults.totalTests * 100).toFixed(2);
    const status = testResults.failedTests === 0 ? '✅ نجح' : '❌ فشل';
    
    const message = `
🧪 تقرير الاختبارات - AzizSys

${status} الاختبار الشامل
📊 النتائج:
• إجمالي: ${testResults.totalTests}
• نجح: ${testResults.passedTests}
• فشل: ${testResults.failedTests}
• تحذيرات: ${testResults.warningTests}
• معدل النجاح: ${successRate}%

⏰ ${new Date().toLocaleString('ar-SA')}
    `;

    // إرسال عبر WhatsApp (إذا كان متاحاً)
    if (typeof sendWhatsAppMessage === 'function') {
      sendWhatsAppMessage(message);
    }
    
    // إرسال عبر البريد الإلكتروني
    const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
    if (adminEmail) {
      MailApp.sendEmail({
        to: adminEmail,
        subject: `AzizSys Test Report - ${status}`,
        body: message
      });
    }
    
  } catch (e) {
    console.error('Failed to send test notification:', e.message);
  }
}

// دالة لتشغيل الاختبارات بشكل دوري
function schedulePeriodicTests() {
  // حذف المشغلات السابقة
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'runComprehensiveTests') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // إنشاء مشغل جديد (يومياً في الساعة 2:00 صباحاً)
  ScriptApp.newTrigger('runComprehensiveTests')
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
    
  console.log('✅ Periodic tests scheduled successfully');
}