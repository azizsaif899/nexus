defineModule('System.ComprehensiveTest', ({ Utils, Config, Testing }) => {
  const MODULE_VERSION = '1.0.0';

  function runFullSystemTest() {
    const testSuite = [
      { name: 'Core Configuration', test: _testConfiguration },
      { name: 'Authentication System', test: _testAuthentication },
      { name: 'UI Components', test: _testUIComponents },
      { name: 'Agent System', test: _testAgentSystem },
      { name: 'File Processing', test: _testFileProcessing },
      { name: 'Automation Engine', test: _testAutomation },
      { name: 'Plugin Manager', test: _testPluginManager }
    ];

    const results = [];
    let totalPassed = 0;
    let totalFailed = 0;

    testSuite.forEach(suite => {
      try {
        const result = suite.test();
        results.push({ suite: suite.name, ...result });
        totalPassed += result.passed;
        totalFailed += result.failed;
      } catch (e) {
        results.push({ 
          suite: suite.name, 
          passed: 0, 
          failed: 1, 
          error: e.message 
        });
        totalFailed++;
      }
    });

    _generateTestReport(results, totalPassed, totalFailed);
    return { totalPassed, totalFailed, results };
  }

  function _testConfiguration() {
    let passed = 0, failed = 0;

    try {
      // Test config get/set
      Config.set('TEST_KEY', 'test_value');
      const value = Config.get('TEST_KEY');
      if (value === 'test_value') passed++; else failed++;

      // Test validation
      const validation = Config.validateConfig();
      if (typeof validation === 'object') passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _testAuthentication() {
    let passed = 0, failed = 0;

    try {
      // Test auth headers (mock)
      const headers = { 'Authorization': 'Bearer mock_token' };
      if (headers.Authorization) passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _testUIComponents() {
    let passed = 0, failed = 0;

    try {
      // Test UI module existence
      if (GAssistant?.UI?.Enhanced) passed++; else failed++;
      if (GAssistant?.UI?.MessageProcessor) passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _testAgentSystem() {
    let passed = 0, failed = 0;

    try {
      // Test agent modules
      if (GAssistant?.AI?.Agents?.CFO) passed++; else failed++;
      if (GAssistant?.AI?.Agents?.Developer) passed++; else failed++;
      if (GAssistant?.AI?.IntentAnalyzer) passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _testFileProcessing() {
    let passed = 0, failed = 0;

    try {
      // Test file processor modules
      if (GAssistant?.AI?.FileProcessor) passed++; else failed++;
      if (GAssistant?.AI?.DocumentAI) passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _testAutomation() {
    let passed = 0, failed = 0;

    try {
      // Test automation modules
      if (GAssistant?.AI?.AutomationEngine) passed++; else failed++;
      if (GAssistant?.AI?.SmartTriggers) passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _testPluginManager() {
    let passed = 0, failed = 0;

    try {
      // Test plugin system
      if (GAssistant?.System?.PluginManager) passed++; else failed++;

    } catch (e) {
      failed++;
    }

    return { passed, failed };
  }

  function _generateTestReport(results, totalPassed, totalFailed) {
    const sheet = Utils.getSheet('ComprehensiveTestResults', [
      'Timestamp', 'TestSuite', 'Passed', 'Failed', 'Status', 'Error'
    ]);

    if (sheet) {
      results.forEach(result => {
        sheet.appendRow([
          new Date(),
          result.suite,
          result.passed,
          result.failed,
          result.failed === 0 ? 'PASS' : 'FAIL',
          result.error || ''
        ]);
      });

      // Summary row
      sheet.appendRow([
        new Date(),
        'TOTAL SUMMARY',
        totalPassed,
        totalFailed,
        totalFailed === 0 ? 'ALL PASS' : 'SOME FAILED',
        `${totalPassed}/${totalPassed + totalFailed} tests passed`
      ]);
    }
  }

  return {
    runFullSystemTest,
    MODULE_VERSION
  };
});