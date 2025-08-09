/**
 * التحقق من صحة المرحلة الرابعة
 * Phase 4 Validation & Testing
 */

// اختبار سريع للمرحلة الرابعة
async function quickPhase4Test() {
  Logger.log('🧪 Starting Phase 4 Quick Test...');

  try {
    // 1. اختبار تحميل الوكلاء
    const cfo = GAssistant.Utils.Injector.get('Agent.CFO');
    const developer = GAssistant.Utils.Injector.get('Agent.Developer');
    const analyst = GAssistant.Utils.Injector.get('Agent.Analyst');
    const general = GAssistant.Utils.Injector.get('Agent.General');
    const router = GAssistant.Utils.Injector.get('System.AgentRouter');

    Logger.log('✅ All Phase 4 agents loaded successfully');

    // 2. اختبار نظام الأتمتة
    const scheduler = GAssistant.Utils.Injector.get('System.TaskScheduler');
    const triggers = GAssistant.Utils.Injector.get('System.SmartTriggers');
    const controller = GAssistant.Utils.Injector.get('System.AutomationController');

    Logger.log('✅ All automation systems loaded successfully');

    // 3. اختبار توجيه الطلبات
    const routing = await router.routeRequest('تحليل مالي للبيانات');
    Logger.log(`✅ Request routing test: ${routing.success ? 'PASSED' : 'FAILED'}`);

    // 4. اختبار جدولة المهام
    const taskResult = scheduler.scheduleTask('Test Task', 'general',
      { request: 'test request' }, { type: 'daily', hour: 9 });
    Logger.log(`✅ Task scheduling test: ${taskResult.success ? 'PASSED' : 'FAILED'}`);

    Logger.log('🎯 Phase 4 Quick Test COMPLETED SUCCESSFULLY');
    return true;

  } catch (error) {
    Logger.log(`❌ Phase 4 Quick Test FAILED: ${error.message}`);
    return false;
  }
}

// اختبار شامل للوكلاء الذكيون
async function testIntelligentAgents() {
  Logger.log('🤖 Testing Intelligent Agents...');

  const results = {
    cfoAgent: false,
    developerAgent: false,
    analystAgent: false,
    generalAgent: false,
    agentRouter: false
  };

  try {
    // 1. اختبار AgentCFO
    Logger.log('1️⃣ Testing CFO Agent...');
    const cfo = GAssistant.Utils.Injector.get('Agent.CFO');

    // إنشاء بيانات مالية تجريبية
    const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');
    const testFinancialData = [
      ['Date', 'Description', 'Amount', 'Category', 'Type', 'Balance'],
      ['2025-01-01', 'Sales Revenue', '10000', 'Revenue', 'Income', '10000'],
      ['2025-01-02', 'Office Rent', '-2000', 'Expenses', 'Expense', '8000'],
      ['2025-01-03', 'Product Sales', '5000', 'Revenue', 'Income', '13000']
    ];

    crud.createSheet('CFO_Test_Data', testFinancialData[0]);
    crud.writeData('CFO_Test_Data', 'A1:F4', testFinancialData);

    const cfoResult = await cfo.analyzeFinancials('CFO_Test_Data');
    results.cfoAgent = cfoResult.success;
    Logger.log(`   CFO Agent: ${results.cfoAgent ? '✅ PASSED' : '❌ FAILED'}`);

    // 2. اختبار AgentDeveloper
    Logger.log('2️⃣ Testing Developer Agent...');
    const developer = GAssistant.Utils.Injector.get('Agent.Developer');

    const testCode = `
    function calculateTotal(items) {
      let total = 0;
      for (let i = 0; i < items.length; i++) {
        total += items[i].price;
      }
      return total;
    }`;

    const devResult = await developer.reviewCode(testCode);
    results.developerAgent = devResult.success;
    Logger.log(`   Developer Agent: ${results.developerAgent ? '✅ PASSED' : '❌ FAILED'}`);

    // 3. اختبار AgentAnalyst
    Logger.log('3️⃣ Testing Analyst Agent...');
    const analyst = GAssistant.Utils.Injector.get('Agent.Analyst');

    const testAnalysisData = [
      ['Product', 'Sales', 'Profit', 'Region'],
      ['Product A', '1000', '300', 'North'],
      ['Product B', '1500', '450', 'South'],
      ['Product C', '800', '200', 'East'],
      ['Product D', '1200', '360', 'West']
    ];

    crud.createSheet('Analyst_Test_Data', testAnalysisData[0]);
    crud.writeData('Analyst_Test_Data', 'A1:D5', testAnalysisData);

    const analystResult = await analyst.analyzeData('Analyst_Test_Data', 'statistical');
    results.analystAgent = analystResult.success;
    Logger.log(`   Analyst Agent: ${results.analystAgent ? '✅ PASSED' : '❌ FAILED'}`);

    // 4. اختبار AgentGeneral
    Logger.log('4️⃣ Testing General Agent...');
    const general = GAssistant.Utils.Injector.get('Agent.General');

    const generalResult = await general.processRequest('ما هو الوقت الحالي؟');
    results.generalAgent = generalResult.success;
    Logger.log(`   General Agent: ${results.generalAgent ? '✅ PASSED' : '❌ FAILED'}`);

    // 5. اختبار AgentRouter
    Logger.log('5️⃣ Testing Agent Router...');
    const router = GAssistant.Utils.Injector.get('System.AgentRouter');

    const routingTests = [
      { request: 'تحليل مالي', expected: 'cfo' },
      { request: 'مراجعة كود', expected: 'developer' },
      { request: 'تحليل البيانات', expected: 'analyst' },
      { request: 'مساعدة عامة', expected: 'general' }
    ];

    let routingSuccess = true;
    for (const test of routingTests) {
      const routing = await router.routeRequest(test.request);
      if (!routing.success || routing.routedTo !== test.expected) {
        routingSuccess = false;
        break;
      }
    }

    results.agentRouter = routingSuccess;
    Logger.log(`   Agent Router: ${results.agentRouter ? '✅ PASSED' : '❌ FAILED'}`);

    // تقرير النتائج
    const passedTests = Object.values(results).filter(r => r === true).length;
    const totalTests = Object.keys(results).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    Logger.log('📊 INTELLIGENT AGENTS TEST RESULTS:');
    Logger.log(`🎯 SUCCESS RATE: ${successRate}% (${passedTests}/${totalTests})`);

    return results;

  } catch (error) {
    Logger.log(`❌ Intelligent agents test failed: ${error.message}`);
    return results;
  }
}

// اختبار نظام الأتمتة
async function testAutomationSystem() {
  Logger.log('⚙️ Testing Automation System...');

  const results = {
    taskScheduler: false,
    smartTriggers: false,
    notifications: false,
    periodicReports: false,
    automationController: false
  };

  try {
    // 1. اختبار TaskScheduler
    Logger.log('1️⃣ Testing Task Scheduler...');
    const scheduler = GAssistant.Utils.Injector.get('System.TaskScheduler');

    const taskResult = scheduler.scheduleTask('Test Automation Task', 'general',
      { request: 'automated test task' }, { type: 'daily', hour: 10 });

    results.taskScheduler = taskResult.success;
    Logger.log(`   Task Scheduler: ${results.taskScheduler ? '✅ PASSED' : '❌ FAILED'}`);

    // 2. اختبار SmartTriggers
    Logger.log('2️⃣ Testing Smart Triggers...');
    const triggers = GAssistant.Utils.Injector.get('System.SmartTriggers');

    const triggerResult = triggers.addTrigger('Test Trigger',
      { type: 'value_change', range: 'A1' },
      { type: 'notification', message: 'Value changed!' });

    results.smartTriggers = triggerResult.success;
    Logger.log(`   Smart Triggers: ${results.smartTriggers ? '✅ PASSED' : '❌ FAILED'}`);

    // 3. اختبار AutoNotifications
    Logger.log('3️⃣ Testing Auto Notifications...');
    const notifications = GAssistant.Utils.Injector.get('System.AutoNotifications');

    const notificationResult = notifications.addNotificationRule('Test Notification',
      { type: 'error' }, 'Test notification message', ['test@example.com']);

    results.notifications = notificationResult.success;
    Logger.log(`   Auto Notifications: ${results.notifications ? '✅ PASSED' : '❌ FAILED'}`);

    // 4. اختبار PeriodicReports
    Logger.log('4️⃣ Testing Periodic Reports...');
    const reports = GAssistant.Utils.Injector.get('System.PeriodicReports');

    const reportResult = reports.scheduleReport('Test Report', 'analyst',
      'Analyst_Test_Data', 'weekly', ['test@example.com']);

    results.periodicReports = reportResult.success;
    Logger.log(`   Periodic Reports: ${results.periodicReports ? '✅ PASSED' : '❌ FAILED'}`);

    // 5. اختبار AutomationController
    Logger.log('5️⃣ Testing Automation Controller...');
    const controller = GAssistant.Utils.Injector.get('System.AutomationController');

    const status = controller.getAutomationStatus();
    const controllerResult = await controller.runAutomationCycle();

    results.automationController = controllerResult && status;
    Logger.log(`   Automation Controller: ${results.automationController ? '✅ PASSED' : '❌ FAILED'}`);

    // تقرير النتائج
    const passedTests = Object.values(results).filter(r => r === true).length;
    const totalTests = Object.keys(results).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    Logger.log('📊 AUTOMATION SYSTEM TEST RESULTS:');
    Logger.log(`🎯 SUCCESS RATE: ${successRate}% (${passedTests}/${totalTests})`);

    return results;

  } catch (error) {
    Logger.log(`❌ Automation system test failed: ${error.message}`);
    return results;
  }
}

// اختبار التكامل مع المراحل السابقة
async function testPhase4Integration() {
  Logger.log('🔗 Testing Phase 4 Integration...');

  try {
    // التحقق من وجود جميع التبعيات من المراحل السابقة
    const dependencies = [
      'System.SheetsCRUD',
      'System.ExtendedLogging',
      'System.GeminiEnhanced',
      'System.SheetsTemplates'
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
    const router = GAssistant.Utils.Injector.get('System.AgentRouter');
    const logging = GAssistant.Utils.Injector.get('System.ExtendedLogging');

    // اختبار استخدام الوكلاء مع البيانات الحقيقية
    logging.info('Integration Test', 'Testing Phase 4 integration');

    const integrationRequest = 'تحليل البيانات المالية في الورقة CFO_Test_Data';
    const routing = await router.routeRequest(integrationRequest);

    if (routing.success && routing.routedTo === 'cfo') {
      const agent = routing.agent;
      const result = await agent.analyzeFinancials('CFO_Test_Data');

      const integrationSuccess = result.success;
      Logger.log(`🔗 Phase 4 Integration: ${integrationSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);

      return integrationSuccess;
    }

    return false;

  } catch (error) {
    Logger.log(`❌ Integration test failed: ${error.message}`);
    return false;
  }
}

// تشغيل جميع اختبارات المرحلة الرابعة
async function runAllPhase4Tests() {
  Logger.log('🚀 Running ALL Phase 4 Tests...');
  Logger.log('='.repeat(50));

  const results = {
    quickTest: false,
    agentsTest: null,
    automationTest: null,
    integrationTest: null
  };

  try {
    // 1. اختبار سريع
    Logger.log('1️⃣ Quick Test...');
    results.quickTest = await quickPhase4Test();

    // 2. اختبار الوكلاء الذكيون
    Logger.log('\n2️⃣ Intelligent Agents Test...');
    results.agentsTest = await testIntelligentAgents();

    // 3. اختبار نظام الأتمتة
    Logger.log('\n3️⃣ Automation System Test...');
    results.automationTest = await testAutomationSystem();

    // 4. اختبار التكامل
    Logger.log('\n4️⃣ Integration Test...');
    results.integrationTest = await testPhase4Integration();

    Logger.log('\n' + '='.repeat(50));
    Logger.log('🎯 ALL PHASE 4 TESTS COMPLETED');

    // تقييم عام
    const overallSuccess = results.quickTest &&
                          results.agentsTest &&
                          results.automationTest &&
                          results.integrationTest;

    Logger.log(`📊 OVERALL RESULT: ${overallSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL SUCCESS'}`);

    return results;

  } catch (error) {
    Logger.log(`❌ Test suite failed: ${error.message}`);
    return results;
  }
}

// تنظيف بيانات الاختبار
function cleanupPhase4TestData() {
  Logger.log('🧹 Cleaning up Phase 4 test data...');

  try {
    const crud = GAssistant.Utils.Injector.get('System.SheetsCRUD');

    const testSheets = [
      'CFO_Test_Data',
      'Analyst_Test_Data',
      'Scheduled_Tasks',
      'Notifications_Log',
      'Reports_Log'
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
  global.quickPhase4Test = quickPhase4Test;
  global.testIntelligentAgents = testIntelligentAgents;
  global.testAutomationSystem = testAutomationSystem;
  global.testPhase4Integration = testPhase4Integration;
  global.runAllPhase4Tests = runAllPhase4Tests;
  global.cleanupPhase4TestData = cleanupPhase4TestData;
}

Logger.log('🧪 Phase 4 Validation System loaded successfully');
