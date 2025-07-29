// اختبارات وحدوية محسنة للوكلاء الذكيين
function testAgentModules() {
  const tests = [];
  
  // اختبار وحدة CFO Agent
  tests.push({
    name: 'CFO Agent Module',
    test: () => {
      if (!GAssistant?.AI?.Agents?.CFO) throw new Error('CFO Agent not found');
      if (typeof GAssistant.AI.Agents.CFO.handleRequest !== 'function') {
        throw new Error('CFO handleRequest not a function');
      }
      return true;
    }
  });

  // اختبار وحدة Developer Agent
  tests.push({
    name: 'Developer Agent Module',
    test: () => {
      if (!GAssistant?.AI?.Agents?.Developer) throw new Error('Developer Agent not found');
      if (typeof GAssistant.AI.Agents.Developer.handleRequest !== 'function') {
        throw new Error('Developer handleRequest not a function');
      }
      return true;
    }
  });

  // اختبار محلل النوايا
  tests.push({
    name: 'Intent Analyzer',
    test: () => {
      if (!GAssistant?.AI?.IntentAnalyzer) throw new Error('IntentAnalyzer not found');
      if (typeof GAssistant.AI.IntentAnalyzer.analyzeIntent !== 'function') {
        throw new Error('analyzeIntent not a function');
      }
      return true;
    }
  });

  // تشغيل الاختبارات
  let passed = 0, failed = 0;
  tests.forEach(test => {
    try {
      test.test();
      console.log(`✅ ${test.name}: PASSED`);
      passed++;
    } catch (e) {
      console.log(`❌ ${test.name}: FAILED - ${e.message}`);
      failed++;
    }
  });

  return { passed, failed, total: tests.length };
}

// اختبار الوظائف المخصصة
function testCustomFunctions() {
  try {
    // اختبار وجود الوظائف العامة
    if (typeof GEMINI === 'undefined') {
      throw new Error('GEMINI function not defined globally');
    }
    
    console.log('✅ Custom Functions: PASSED');
    return true;
  } catch (e) {
    console.log(`❌ Custom Functions: FAILED - ${e.message}`);
    return false;
  }
}

// تشغيل جميع الاختبارات
function runAllAgentTests() {
  console.log('🧪 Starting Agent Module Tests...\n');
  
  const agentResults = testAgentModules();
  const functionsResult = testCustomFunctions();
  
  console.log('\n📊 Test Summary:');
  console.log(`Agent Modules: ${agentResults.passed}/${agentResults.total} passed`);
  console.log(`Custom Functions: ${functionsResult ? 'PASSED' : 'FAILED'}`);
  
  const totalPassed = agentResults.passed + (functionsResult ? 1 : 0);
  const totalTests = agentResults.total + 1;
  
  console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed`);
  
  return totalPassed === totalTests;
}