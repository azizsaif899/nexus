defineModule('System.Setup', ({ Utils, Config, Auth, Testing }) => {
  const MODULE_VERSION = '1.0.0';

  function initializeProject() {
    Utils.log('Starting G-Assistant initialization...');
    
    const steps = [
      { name: 'Validate Configuration', fn: _validateConfig },
      { name: 'Test Authentication', fn: _testAuth },
      { name: 'Setup Sheets Structure', fn: _setupSheets },
      { name: 'Initialize Agents', fn: _initializeAgents },
      { name: 'Run System Tests', fn: _runTests }
    ];

    const results = [];
    
    for (const step of steps) {
      Utils.log(`Executing: ${step.name}`);
      const start = Date.now();
      
      try {
        const result = step.fn();
        results.push({
          step: step.name,
          status: 'SUCCESS',
          duration: Date.now() - start,
          result
        });
      } catch (e) {
        results.push({
          step: step.name,
          status: 'FAILED',
          duration: Date.now() - start,
          error: e.message
        });
        Utils.error(`Setup step failed: ${step.name}`, e);
      }
    }

    _logSetupResults(results);
    return results;
  }

  function _validateConfig() {
    const validation = Config.validateConfig();
    
    if (!validation.valid) {
      throw new Error(`Missing required configuration: ${validation.missing.join(', ')}`);
    }

    // اختبار الاتصال بـ Gemini
    const geminiKey = Config.get('GEMINI_API_KEY');
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    return { configValid: true, missingKeys: validation.missing };
  }

  function _testAuth() {
    const token = Auth.getServiceAccountToken();
    
    if (!token) {
      throw new Error('Failed to obtain service account token');
    }

    return { tokenObtained: true, tokenLength: token.length };
  }

  function _setupSheets() {
    const requiredSheets = [
      'AgentTriggers_Metrics',
      'AI_CFO_Agent_Metrics', 
      'AI_Developer_Agent_Metrics',
      'AutomationCommands',
      'AutomationLog',
      'TestResults'
    ];

    const created = [];
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    requiredSheets.forEach(sheetName => {
      try {
        let sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) {
          sheet = spreadsheet.insertSheet(sheetName);
          created.push(sheetName);
        }
      } catch (e) {
        Utils.warn(`Failed to create sheet: ${sheetName}`, e);
      }
    });

    return { sheetsCreated: created, totalRequired: requiredSheets.length };
  }

  function _initializeAgents() {
    const agents = [];
    
    // تهيئة Agent Triggers
    if (GAssistant?.AI?.Agents?.Triggers?.setupAgentTriggers) {
      const result = GAssistant.AI.Agents.Triggers.setupAgentTriggers();
      agents.push({ name: 'AgentTriggers', status: result.type || 'unknown' });
    }

    // تهيئة Automation Engine
    if (GAssistant?.AI?.AutomationEngine?.setupAutomationTriggers) {
      const result = GAssistant.AI.AutomationEngine.setupAutomationTriggers();
      agents.push({ name: 'AutomationEngine', status: result.type || 'unknown' });
    }

    return { agentsInitialized: agents };
  }

  function _runTests() {
    const testReport = Testing.getTestReport();
    
    if (testReport.summary.failed > 0) {
      Utils.warn(`${testReport.summary.failed} tests failed out of ${testReport.summary.total}`);
    }

    return testReport.summary;
  }

  function _logSetupResults(results) {
    const sheet = Utils.getSheet('SetupLog', [
      'Timestamp', 'Step', 'Status', 'Duration', 'Details'
    ]);

    if (sheet) {
      results.forEach(r => {
        sheet.appendRow([
          new Date(),
          r.step,
          r.status,
          r.duration,
          JSON.stringify(r.result || r.error || {})
        ]);
      });
    }

    // عرض ملخص في السجل
    const successful = results.filter(r => r.status === 'SUCCESS').length;
    const total = results.length;
    
    Utils.log(`Setup completed: ${successful}/${total} steps successful`);
    
    if (successful === total) {
      Utils.log('🎉 G-Assistant initialized successfully!');
    } else {
      Utils.warn('⚠️ Some setup steps failed. Check SetupLog sheet for details.');
    }
  }

  return {
    initializeProject,
    MODULE_VERSION
  };
});