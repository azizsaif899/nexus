defineModule('System.DependencyChecker', ({ Utils }) => {
  const MODULE_VERSION = '1.0.0';

  function checkDependencyConflicts() {
    const conflicts = [];
    const modules = [];

    // فحص الوحدات الموجودة
    try {
      if (GAssistant?.System?.Config) modules.push('System.Config (OLD)');
      if (GAssistant?.System?.Config?.Enhanced) modules.push('System.Config.Enhanced (NEW)');

      if (GAssistant?.AI?.Agents?.CFO) modules.push('AI.Agents.CFO (NEW)');
      if (GAssistant?.AgentCFO) modules.push('AgentCFO (OLD)');

      if (GAssistant?.AI?.Agents?.Developer) modules.push('AI.Agents.Developer (NEW)');
      if (GAssistant?.AgentDeveloper) modules.push('AgentDeveloper (OLD)');

      // فحص التضارب في الوظائف المخصصة
      if (typeof GEMINI !== 'undefined' && typeof AI !== 'undefined') {
        conflicts.push('GEMINI and AI functions may conflict');
      }

      // فحص تضارب المؤقتات
      const triggers = ScriptApp.getProjectTriggers();
      const triggerFunctions = triggers.map(t => t.getHandlerFunction());
      const duplicates = triggerFunctions.filter((item, index) => triggerFunctions.indexOf(item) !== index);

      if (duplicates.length > 0) {
        conflicts.push(`Duplicate triggers: ${duplicates.join(', ')}`);
      }

    } catch (e) {
      conflicts.push(`Error checking modules: ${e.message}`);
    }

    return {
      modules,
      conflicts,
      hasConflicts: conflicts.length > 0
    };
  }

  function validateModuleStructure() {
    const required = [
      'GAssistant.System.Utils',
      'GAssistant.System.Config',
      'GAssistant.AI.Core',
      'GAssistant.AI.Agents.CFO',
      'GAssistant.AI.Agents.Developer'
    ];

    const missing = [];
    const present = [];

    required.forEach(path => {
      try {
        const parts = path.split('.');
        let current = window;

        for (const part of parts) {
          if (current[part]) {
            current = current[part];
          } else {
            missing.push(path);
            return;
          }
        }
        present.push(path);
      } catch (e) {
        missing.push(path);
      }
    });

    return { present, missing, isValid: missing.length === 0 };
  }

  function runDependencyTest() {
    const conflicts = checkDependencyConflicts();
    const structure = validateModuleStructure();

    const report = {
      timestamp: new Date().toISOString(),
      conflicts: conflicts,
      structure: structure,
      overall: !conflicts.hasConflicts && structure.isValid
    };

    // حفظ التقرير
    const sheet = Utils.getSheet('DependencyCheck', [
      'Timestamp', 'HasConflicts', 'MissingModules', 'Conflicts', 'Status'
    ]);

    if (sheet) {
      sheet.appendRow([
        new Date(),
        conflicts.hasConflicts,
        structure.missing.join(', '),
        conflicts.conflicts.join('; '),
        report.overall ? 'PASS' : 'FAIL'
      ]);
    }

    return report;
  }

  return {
    checkDependencyConflicts,
    validateModuleStructure,
    runDependencyTest,
    MODULE_VERSION
  };
});
