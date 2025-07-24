/**
 * @file 95_stability_reporter.js
 * @description
 * ملف مساعد يحتوي على دوال يمكن تشغيلها يدويًا من محرر Apps Script
 * للحصول على تقرير فوري عن صحة النظام وحالة الوحدات.
 */

'use strict';

/**
 * دالة يمكن تشغيلها من المحرر لطباعة تقرير بحالة الوحدات الأساسية.
 */
function reportModulesStatus() {
  const verifier = GAssistant.Utils.Injector.get('ModuleVerifier').ModuleVerifier;

  if (!verifier || typeof verifier.isReady !== 'function') {
    Logger.log("❌ CRITICAL: ModuleVerifier is not available or not correctly initialized.");
    return;
  }

  const requiredModules = ['Config', 'Telemetry', 'AgentsCatalog', 'Dispatcher', 'AI.Core', 'DocsManager', 'Tools.Catalog'];

  Logger.log('--- 🩺 AzizSys Stability Report ---');
  requiredModules.forEach(moduleName => {
    const status = verifier.isReady(moduleName) ? '✅ جاهز' : '❌ غير جاهز';
    Logger.log(`- ${moduleName}: ${status}`);
  });
  Logger.log('------------------------------------');
}