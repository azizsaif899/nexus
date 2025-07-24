// *************************************************************************************************
// --- START OF FILE: 00_module_verifier.js ---
// *************************************************************************************************

/**
 * @file 00_module_verifier.js
 * @module System.Dev.ModuleVerifier
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة تحقق ذكية من جاهزية الوحدات الأخرى قبل استخدامها.
 * تنفذ خطة المراجعة الشاملة لمنع أخطاء التبعيات.
 */

'use strict';

defineModule('System.Dev.ModuleVerifier', ({ Utils }) => {
  const Injector = GAssistant.Utils.Injector;
  const _readyModules = new Set();

  /**
   * يسجل وحدة على أنها جاهزة للاستخدام.
   * يتم استدعاؤها تلقائيًا بواسطة defineModule.
   * @param {string} name - الاسم الكامل للوحدة (e.g., 'System.Config').
   */
  function register(name) {
    if (typeof name !== 'string' || !name.trim()) {
      Utils.warn('[Verifier] Attempted to register a module with an invalid name.');
      return;
    }
    _readyModules.add(name);
  }

  /**
   * يتحقق مما إذا كانت الوحدة قد تم تسجيلها على أنها جاهزة.
   * @param {string} name - الاسم المختصر أو الكامل للوحدة.
   * @returns {boolean}
   */
  function isReady(name) {
    const fullPath = Injector._dependencyMap[name] || name;
    return _readyModules.has(fullPath);
  }

  /**
   * يتحقق من أن وحدة معينة محملة، ليست نسخة وهمية، وتحتوي على الدوال المطلوبة.
   * يدعم التحقق من الخصائص المتداخلة (e.g., 'AI.Core').
   * @param {string} name - الاسم المختصر أو الكامل للوحدة (e.g., 'Config').
   * @param {string[]} [requiredProps=[]] - مصفوفة بأسماء الدوال أو الخصائص المطلوبة.
   * @returns {boolean} - `true` إذا كانت الوحدة جاهزة، وإلا `false`.
   */
  function checkReady(name, requiredProps = []) {
    if (!isReady(name)) {
      Utils.warn(`[Verifier] Prerequisite check failed: Module '${name}' has not been registered as ready.`);
      return false;
    }
    const resolved = Injector.get(name);
    const mod = resolved[name];

    if (!mod || mod._isPlaceholder) {
      Utils.warn(`[Verifier] الوحدة '${name}' غير جاهزة (إما غير موجودة أو نسخة وهمية).`);
      return false;
    }

    const missing = requiredProps.filter(propName => {
      const parts = propName.split('.');
      let current = mod;
      for (const part of parts) {
        if (typeof current !== 'object' || current === null || current[part] === undefined) return true;
        current = current[part];
      }
      return false; // Property exists
    });

    if (missing.length > 0) {
      Utils.warn(`[Verifier] الوحدة '${name}' تفتقر للدوال أو الخصائص المطلوبة: ${missing.join(', ')}`);
      return false;
    }
    return true;
  }

  /**
   * يجري فحص سلامة شامل على الوحدات الأساسية في النظام.
   * @returns {{isHealthy: boolean, report: Array<{module: string, status: string, reason: string}>}}
   */
  function healthCheck() {
    const report = [];
    let isHealthy = true;

    const criticalModules = [
      { name: 'Utils', required: ['log', 'getSheet', 'executeSafely'] },
      { name: 'Config', required: ['get', 'getAll'] },
      { name: 'Telemetry', required: ['track'] },
      { name: 'AI', required: ['Core', 'Memory', 'Dispatcher'] },
      { name: 'Tools', required: ['Catalog', 'Developer'] },
      { name: 'UI', required: ['Dialogue'] }
    ];

    Utils.log('🔬 Running System Health Check...');

    criticalModules.forEach(modInfo => {
      const isReady = checkReady(modInfo.name, modInfo.required);
      const status = isReady ? '✅ OK' : '❌ FAILED';
      const reason = isReady ? 'الوحدة جاهزة ومكتملة.' : `فشل التحقق من جاهزية الوحدة أو تبعياتها.`;

      if (!isReady) {
        isHealthy = false;
      }

      report.push({
        module: modInfo.name,
        status: status,
        reason: reason
      });
    });

    Utils.log('System Health Check Complete.', { isHealthy, report });
    return { isHealthy, report };
  }

  return {
    register,
    isReady,
    checkReady,
    healthCheck
  };
});

// *************************************************************************************************
// --- END OF FILE: 00_module_verifier.js ---
// *************************************************************************************************