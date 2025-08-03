defineModule('System.EnhancedTest', ({ Utils, DependencyChecker }) => {
  const MODULE_VERSION = '1.0.0';

  function testAgentModules() {
    const tests = [
      {
        name: 'CFO Agent Module',
        test: () => {
          if (!GAssistant?.AI?.Agents?.CFO) throw new Error('CFO Agent not found');
          if (typeof GAssistant.AI.Agents.CFO.handleRequest !== 'function') {
            throw new Error('CFO handleRequest not a function');
          }
          if (typeof GAssistant.AI.Agents.CFO.runMonthlyPNL !== 'function') {
            throw new Error('CFO runMonthlyPNL not a function');
          }
          return true;
        }
      },
      {
        name: 'Developer Agent Module',
        test: () => {
          if (!GAssistant?.AI?.Agents?.Developer) throw new Error('Developer Agent not found');
          if (typeof GAssistant.AI.Agents.Developer.handleRequest !== 'function') {
            throw new Error('Developer handleRequest not a function');
          }
          return true;
        }
      },
      {
        name: 'DatabaseManager Agent',
        test: () => {
          if (!GAssistant?.AI?.Agents?.DatabaseManager) throw new Error('DatabaseManager not found');
          if (typeof GAssistant.AI.Agents.DatabaseManager.handleRequest !== 'function') {
            throw new Error('DatabaseManager handleRequest not a function');
          }
          return true;
        }
      },
      {
        name: 'Intent Analyzer',
        test: () => {
          if (!GAssistant?.AI?.IntentAnalyzer) throw new Error('IntentAnalyzer not found');
          if (typeof GAssistant.AI.IntentAnalyzer.analyzeIntent !== 'function') {
            throw new Error('analyzeIntent not a function');
          }
          return true;
        }
      },
      {
        name: 'Tool Executor',
        test: () => {
          if (!GAssistant?.AI?.ToolExecutor) throw new Error('ToolExecutor not found');
          if (typeof GAssistant.AI.ToolExecutor.executeTool !== 'function') {
            throw new Error('executeTool not a function');
          }
          return true;
        }
      }
    ];

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

  function testCustomFunctions() {
    const results = { passed: 0, failed: 0, tests: [] };

    const customFunctions = ['GEMINI', 'GEMINI_ANALYZE', 'GEMINI_CODE', 'GEMINI_FORMULA'];
    customFunctions.forEach(funcName => {
      try {
        if (typeof globalThis[funcName] !== 'undefined') {
          results.passed++;
          results.tests.push(`${funcName}: PASSED`);
        } else {
          results.failed++;
          results.tests.push(`${funcName}: NOT FOUND`);
        }
      } catch (e) {
        results.failed++;
        results.tests.push(`${funcName}: ERROR - ${e.message}`);
      }
    });

    results.tests.forEach(test => console.log(test));
    return results;
  }

  function testDependencies() {
    if (DependencyChecker) {
      return DependencyChecker.runDependencyTest();
    }
    return { overall: false, error: 'DependencyChecker not available' };
  }

  function runComprehensiveTest() {
    console.log('🧪 Starting Comprehensive System Test...\n');

    const agentResults = testAgentModules();
    const functionsResults = testCustomFunctions();
    const dependencyResults = testDependencies();

    console.log('\n📊 Test Summary:');
    console.log(`Agent Modules: ${agentResults.passed}/${agentResults.total} passed`);
    console.log(`Custom Functions: ${functionsResults.passed}/${functionsResults.passed + functionsResults.failed} passed`);
    console.log(`Dependencies: ${dependencyResults.overall ? 'PASSED' : 'FAILED'}`);

    if (dependencyResults.conflicts?.hasConflicts) {
      console.log('\n⚠️ Dependency Conflicts:');
      dependencyResults.conflicts.conflicts.forEach(conflict => {
        console.log(`  - ${conflict}`);
      });
    }

    const totalPassed = agentResults.passed + functionsResults.passed + (dependencyResults.overall ? 1 : 0);
    const totalTests = agentResults.total + functionsResults.passed + functionsResults.failed + 1;

    console.log(`\n🎯 Overall: ${totalPassed}/${totalTests} tests passed`);

    const success = totalPassed === totalTests && !dependencyResults.conflicts?.hasConflicts;
    console.log(`\n${success ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    // حفظ النتائج
    const sheet = Utils.getSheet('EnhancedTestResults', [
      'Timestamp', 'AgentsPassed', 'AgentsTotal', 'FunctionsPassed', 'FunctionsTotal',
      'DependenciesOK', 'OverallSuccess'
    ]);

    if (sheet) {
      sheet.appendRow([
        new Date(),
        agentResults.passed,
        agentResults.total,
        functionsResults.passed,
        functionsResults.passed + functionsResults.failed,
        dependencyResults.overall,
        success
      ]);
    }

    return {
      success,
      agentResults,
      functionsResults,
      dependencyResults,
      totalPassed,
      totalTests
    };
  }

  return {
    testAgentModules,
    testCustomFunctions,
    testDependencies,
    runComprehensiveTest,
    MODULE_VERSION
  };
});
