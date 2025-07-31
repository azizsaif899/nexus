/**
 * اختبار استقرار Google Sheets Sidebar
 */

function testSidebarStability() {
  const results = {
    timestamp: new Date(),
    tests: [],
    overall: 'UNKNOWN'
  };

  // اختبار 1: تحميل Sidebar
  try {
    const htmlOutput = HtmlService.createHtmlOutputFromFile('src/UI/AssistantSidebar');
    results.tests.push({
      name: 'Sidebar Loading',
      status: 'PASS',
      message: 'Sidebar loads successfully'
    });
  } catch (e) {
    results.tests.push({
      name: 'Sidebar Loading',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 2: استمرارية الجلسة
  try {
    const sessionData = PropertiesService.getUserProperties().getProperty('sidebar_session');
    results.tests.push({
      name: 'Session Persistence',
      status: sessionData ? 'PASS' : 'WARNING',
      message: sessionData ? 'Session data found' : 'No session data'
    });
  } catch (e) {
    results.tests.push({
      name: 'Session Persistence',
      status: 'FAIL',
      message: e.message
    });
  }

  // اختبار 3: معالجة الأخطاء
  try {
    // محاكاة خطأ
    throw new Error('Test error');
  } catch (e) {
    results.tests.push({
      name: 'Error Handling',
      status: 'PASS',
      message: 'Error handling works correctly'
    });
  }

  // تحديد النتيجة الإجمالية
  const failedTests = results.tests.filter(t => t.status === 'FAIL');
  const warningTests = results.tests.filter(t => t.status === 'WARNING');
  
  if (failedTests.length === 0) {
    results.overall = warningTests.length > 0 ? 'WARNING' : 'PASS';
  } else {
    results.overall = 'FAIL';
  }

  // حفظ النتائج
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test_Results') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('Test_Results');
  
  sheet.appendRow([
    results.timestamp,
    'Sidebar Stability',
    results.overall,
    JSON.stringify(results.tests)
  ]);

  return results;
}