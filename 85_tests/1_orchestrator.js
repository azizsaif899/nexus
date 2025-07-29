// *************************************************************************************************
// --- START OF FILE: 85_tests/1_orchestrator.js ---
// *************************************************************************************************

/**
 * @file 85_tests/1_orchestrator.js
 * @module System.Dev.Orchestrator
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة تنسيق مهام النظام والمطورين. تم فصلها عن System.Code لتطبيق مبدأ
 * فصل الاهتمامات. مسؤولة عن تشغيل الاختبارات والتحقق من سلامة النظام.
 */

defineModule('System.Dev.Orchestrator', ({ Utils, Tests }) => {

  function runAllTests() {
    const results = Tests?.runAllTests?.() || [];
    const failed = results.filter(r => !r.success).length;
    SpreadsheetApp.getUi().alert(`✅ شُغّلت ${results.length} اختبار، فشل ${failed}.`);
    return results;
  }

  function verifySystemIntegrity() {
    const verificationResults = [];
    const requiredModules = [
        { name: 'Utils', requiredFunctions: ['log', 'executeSafely', 'getSheet'] },
        { name: 'Config', requiredFunctions: ['get', 'getAll'] },
        { name: 'Telemetry', requiredFunctions: ['track', 'trackEvent', 'trackError'] },
        { name: 'DocsManager', requiredFunctions: ['registerModuleDocs', 'getAllDocs'] },
        { name: 'LongTermMemory', requiredFunctions: ['save', 'load', 'search'] },
        { name: 'AI', requiredFunctions: ['Core', 'Memory', 'Constitution', 'Dispatcher', 'ToolExecutor'] },
        { name: 'Tools', requiredFunctions: ['Catalog', 'Developer', 'Accounting'] },
        { name: 'UI', requiredFunctions: ['onOpen', 'Dialogue'] },
        { name: 'AgentsCatalog', requiredFunctions: ['getAgent', 'registerAgent'] }
    ];

    try {
      Utils.log('🔬 Running System Integrity Verification...');
      const resolvedModules = GAssistant.Utils.Injector.get(...requiredModules.map(m => m.name));

      for (const req of requiredModules) {
        const mod = resolvedModules[req.name];
        let status = '❌ FAILED';
        let reason = 'الوحدة غير محمّلة أو غير موجودة.';

        if (mod) {
          if (mod._isPlaceholder) {
            status = '⚠️ WARNING';
            reason = 'الوحدة لا تزال نسخة وهمية (Placeholder).';
          } else {
            const missingFunctions = req.requiredFunctions.filter(fnName => {
                const parts = fnName.split('.');
                let current = mod;
                for(const part of parts) {
                    if(typeof current !== 'object' || current === null || current[part] === undefined) return true;
                    current = current[part];
                }
                return false;
            });

            if (missingFunctions.length > 0) {
                status = '⚠️ WARNING';
                reason = `الوحدة ناقصة الدوال التالية: ${missingFunctions.join(', ')}`;
            } else {
                status = '✅ OK';
                reason = 'الوحدة مكتملة وجاهزة.';
            }
          }
        }
        verificationResults.push([req.name, status, reason]);
      }
      Utils.log('System Integrity Verification Results:', verificationResults);
    } catch (e) {
      verificationResults.push(['CRITICAL_ERROR', '❌ FAILED', e.message]);
      Utils.error('A critical error occurred during system integrity verification.', e.stack);
    }
    return verificationResults;
  }

  return {
    runAllTests,
    verifySystemIntegrity
  };
});

// *************************************************************************************************
// --- END OF FILE: 85_tests/1_orchestrator.js ---
// *************************************************************************************************