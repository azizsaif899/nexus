/**
 * @file 70_dependency_guardian.js
 * @module System.DependencyGuardian
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة حماية ومراقبة التبعيات. توفر أدوات للتحقق من جاهزية النظام
 * وانتظار تحميل الوحدات الأساسية قبل متابعة التنفيذ.
 */

'use strict';

defineModule('System.DependencyGuardian', ({ Utils, ModuleVerifier }) => {

  /**
   * ينتظر حتى تصبح مجموعة من الوحدات جاهزة، مع مهلة زمنية.
   * @param {string[]} moduleNames - مصفوفة بأسماء الوحدات (القصيرة) المطلوب انتظارها.
   * @param {number} [timeoutMs=10000] - أقصى مدة انتظار بالمللي ثانية.
   * @returns {boolean} - `true` if successful.
   * @throws {Error} إذا لم تكتمل الوحدات في الوقت المحدد.
   */
  function waitFor(moduleNames, timeoutMs = 10000) {
    const start = Date.now();
    const pollInterval = 200; // 200ms

    while (Date.now() - start < timeoutMs) {
      const allReady = moduleNames.every(name => ModuleVerifier.isReady(name));
      if (allReady) {
        Utils.log(`DependencyGuardian: All awaited modules are ready: [${moduleNames.join(', ')}]`);
        return true;
      }
      Utilities.sleep(pollInterval);
    }

    const notReadyModules = moduleNames.filter(name => !ModuleVerifier.isReady(name));
    const errorMessage = `DependencyGuardian: Timeout waiting for modules: [${notReadyModules.join(', ')}].`;
    Utils.error(errorMessage);
    throw new Error(errorMessage);
  }

  return {
    waitFor
  };
});