// *************************************************************************************************
// --- START OF FILE: 90_System/06_ModuleVerifier.js ---
// *************************************************************************************************

/**
 * @file 90_System/06_ModuleVerifier.js
 * @module System.Dev.ModuleVerifier
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة للتحقق من سلامة تحميل الوحدات الأخرى وجاهزيتها.
 * تستخدم في البرمجة الدفاعية لضمان وجود التبعيات قبل تنفيذ المنطق.
 */

defineModule('System.Dev.ModuleVerifier', ({ Utils }) => {

  /**
   * يتحقق مما إذا كانت الوحدة المحددة جاهزة وتحتوي على الوظائف المطلوبة.
   * @param {string} moduleName - اسم الوحدة (e.g., 'AI.Core').
   * @param {string[]} [requiredFunctions=[]] - مصفوفة من أسماء الوظائف المطلوبة.
   * @returns {boolean} - `true` إذا كانت الوحدة جاهزة، وإلا `false`.
   */
  function checkReady(moduleName, requiredFunctions = []) {
    try {
      // The injector returns an object where the key is the full module name.
      // We need to access the module instance from that object.
      const resolvedModules = GAssistant.Utils.Injector.get(moduleName);
      const moduleInstance = resolvedModules[moduleName];

      if (!moduleInstance || moduleInstance._isPlaceholder) return false;

      for (const func of requiredFunctions) {
        // Handle nested function paths like 'AI.Core'
        const funcParts = func.split('.');
        let current = moduleInstance;
        const funcExists = funcParts.every(part => {
            current = current?.[part];
            return current !== undefined;
        });
        if (!funcExists || typeof current !== 'function') return false;
      }
      return true;
    } catch (e) {
      // It's safer to log the error for debugging purposes, if Utils is available.
      if (typeof Utils !== 'undefined' && Utils.error) {
        Utils.error(`ModuleVerifier.checkReady failed for '${moduleName}'`, e);
      }
      return false;
    }
  }

  /**
   * Alias for checkReady - used by some modules
   * @param {string} moduleName - اسم الوحدة
   * @param {string[]} [requiredFunctions=[]] - مصفوفة من أسماء الوظائف المطلوبة
   * @returns {boolean}
   */
  function isReady(moduleName, requiredFunctions = []) {
    return checkReady(moduleName, requiredFunctions);
  }

  /**
   * Basic health check function
   * @returns {object} Health check report
   */
  function healthCheck() {
    const injector = GAssistant?.Utils?.Injector;
    if (!injector) {
      return { isHealthy: false, report: [{ module: 'Injector', status: 'missing', reason: 'Core injector not available' }] };
    }

    const modules = Object.keys(injector._moduleExports || {});
    const report = modules.map(name => {
      const moduleExports = injector._moduleExports[name];
      const isHealthy = moduleExports && !moduleExports._isPlaceholder;
      return {
        module: name,
        status: isHealthy ? 'healthy' : 'degraded',
        reason: isHealthy ? 'Module loaded successfully' : 'Module using fallback or failed to load'
      };
    });

    const healthyCount = report.filter(r => r.status === 'healthy').length;
    const isHealthy = healthyCount > (report.length * 0.7); // 70% threshold

    return { isHealthy, report };
  }

  return { checkReady, isReady, healthCheck };
});

// *************************************************************************************************
// --- END OF FILE: 90_System/06_ModuleVerifier.js ---
// *************************************************************************************************