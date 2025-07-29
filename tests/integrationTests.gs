/**
 * اختبارات التكامل بين الوحدات
 * Status: 🟡 Beta
 */

function runIntegrationTests() {
  const testResults = {
    suiteName: 'Integration Tests',
    totalTests: 0,
    passed: 0,
    failed: 0,
    results: []
  };

  // اختبار التكامل بين IntentAnalyzer و Orchestrator
  testResults.results.push(testIntentToOrchestrator());
  
  // اختبار التكامل بين ToolExecutor و UI Controller
  testResults.results.push(testToolExecutorToUI());
  
  // اختبار التكامل بين UserSettings و UI
  testResults.results.push(testUserSettingsIntegration());

  // حساب النتائج
  testResults.totalTests = testResults.results.length;
  testResults.results.forEach(result => {
    if (result.status === 'PASS') {
      testResults.passed++;
    } else {
      testResults.failed++;
    }
  });

  console.log(`Integration Tests: ${testResults.passed}/${testResults.totalTests} passed`);
  return testResults;
}

/**
 * اختبار التكامل بين محلل النوايا والمنسق
 */
function testIntentToOrchestrator() {
  try {
    const analyzer = GAssistant.Utils.Injector.get('System.IntentAnalyzer');
    const orchestrator = GAssistant.Utils.Injector.get('System.AI.Orchestrator.Enhanced');
    
    // محاكاة تحليل النية
    const mockAnalysis = {
      agent: 'General',
      confidence: 0.8,
      reasoning: 'اختبار تكامل'
    };
    
    // التحقق من أن المنسق يمكنه الحصول على الوكيل
    const agent = orchestrator.getAgent(mockAnalysis.agent);
    
    return {
      name: 'Intent Analyzer to Orchestrator',
      status: agent ? 'PASS' : 'FAIL',
      details: { agent: mockAnalysis.agent, found: !!agent }
    };
    
  } catch (error) {
    return {
      name: 'Intent Analyzer to Orchestrator',
      status: 'ERROR',
      details: { error: error.message }
    };
  }
}

/**
 * اختبار التكامل بين منفذ الأدوات ومتحكم الواجهة
 */
function testToolExecutorToUI() {
  try {
    const toolExecutor = GAssistant.Utils.Injector.get('System.ToolExecutor');
    const uiController = GAssistant.Utils.Injector.get('System.UI.Controller');
    
    // محاكاة استدعاء أداة بسيطة
    const mockToolCall = {
      id: 'test_integration',
      function: {
        name: 'getSheetData',
        arguments: '{"range": "A1:A1"}'
      }
    };
    
    // التحقق من أن الأداة يمكن تنفيذها
    const result = toolExecutor.executeSingleTool(mockToolCall);
    
    return {
      name: 'ToolExecutor to UI Controller',
      status: result ? 'PASS' : 'FAIL',
      details: { executed: !!result }
    };
    
  } catch (error) {
    return {
      name: 'ToolExecutor to UI Controller',
      status: 'ERROR',
      details: { error: error.message }
    };
  }
}

/**
 * اختبار التكامل بين إعدادات المستخدم والواجهة
 */
function testUserSettingsIntegration() {
  try {
    const settingsManager = GAssistant.Utils.Injector.get('System.UserSettingsManager');
    
    // اختبار تحميل الإعدادات الافتراضية
    const defaultSettings = settingsManager.loadUserSettings();
    
    // اختبار حفظ إعداد جديد
    const testSettings = { ...defaultSettings, theme: 'dark' };
    const saveResult = settingsManager.saveUserSettings(testSettings);
    
    // اختبار تحميل الإعدادات المحفوظة
    const loadedSettings = settingsManager.loadUserSettings();
    
    const success = saveResult.success && loadedSettings.theme === 'dark';
    
    return {
      name: 'UserSettings Integration',
      status: success ? 'PASS' : 'FAIL',
      details: { 
        saved: saveResult.success,
        loaded: loadedSettings.theme === 'dark'
      }
    };
    
  } catch (error) {
    return {
      name: 'UserSettings Integration',
      status: 'ERROR',
      details: { error: error.message }
    };
  }
}

/**
 * اختبار شامل للنظام
 */
function runSystemHealthCheck() {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    modules: {},
    overall: 'UNKNOWN'
  };

  // فحص الوحدات الأساسية
  const coreModules = [
    'System.ToolExecutor',
    'System.IntentAnalyzer', 
    'System.AI.Orchestrator.Enhanced',
    'System.UI.Controller',
    'System.UserSettingsManager'
  ];

  let healthyModules = 0;

  coreModules.forEach(moduleName => {
    try {
      const module = GAssistant.Utils.Injector.get(moduleName);
      healthCheck.modules[moduleName] = {
        status: 'HEALTHY',
        loaded: !!module
      };
      healthyModules++;
    } catch (error) {
      healthCheck.modules[moduleName] = {
        status: 'ERROR',
        error: error.message
      };
    }
  });

  // تحديد الحالة العامة
  const healthPercentage = (healthyModules / coreModules.length) * 100;
  
  if (healthPercentage === 100) {
    healthCheck.overall = 'HEALTHY';
  } else if (healthPercentage >= 80) {
    healthCheck.overall = 'WARNING';
  } else {
    healthCheck.overall = 'CRITICAL';
  }

  healthCheck.healthPercentage = healthPercentage;

  console.log(`System Health: ${healthCheck.overall} (${healthPercentage}%)`);
  return healthCheck;
}