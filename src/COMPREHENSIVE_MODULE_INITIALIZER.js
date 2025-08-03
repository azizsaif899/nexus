/**
 * @file Comprehensive Module Initializer Script
 * @description This script demonstrates a robust module initialization pattern in JavaScript
 * to address common errors related to module dependencies, undefined properties,
 * and initialization order, as observed in the provided log.
 * It serves as a conceptual framework for building a more stable system.
 */

// Global GAssistant object to prevent "Cannot destructure property 'log' of 'GAssistant.Utils' as it is undefined."
// This simulates the expected global structure.
if (typeof GAssistant === 'undefined') {
  GAssistant = {
    Utils: {
      log: function(level, message) {
        const timestamp = new Date().toLocaleTimeString('ar-SA', { hour12: false });
        console.log(`${timestamp} ${level} ${message}`);
      }
      // Add other utility functions if needed by modules
    }
    // Other top-level GAssistant properties
  };
}

// Ensure log function is available
const { log } = GAssistant.Utils;

log('Info', '🚀 G-Assistant Safe Comprehensive Initializer starting...');

/**
 * @namespace Initializer
 * @description Manages the module definition, verification, and initialization process.
 */
const Initializer = (function() {
  const _moduleFactories = new Map(); // Stores module factory functions and their dependencies
  const _moduleExports = new Map();   // Stores initialized module exports
  const _moduleStatus = new Map();    // Tracks module readiness: 'pending', 'building', 'ready', 'failed'

  /**
     * @class ModuleVerifier
     * @description Provides methods to check and manage module readiness.
     * Addresses "ModuleVerifier?.isReady is not a function" and "checkReady is not a function".
     */
  class ModuleVerifier {
    constructor() {
      this.readyModules = new Set();
    }

    /**
         * Checks if a specific module is ready.
         * @param {string} moduleName - The name of the module to check.
         * @returns {boolean} True if the module is ready, false otherwise.
         */
    isReady(moduleName) {
      return _moduleStatus.get(moduleName) === 'ready';
    }

    /**
         * Checks if all specified modules are ready.
         * @param {string[]} moduleNames - An array of module names to check.
         * @returns {boolean} True if all modules are ready, false otherwise.
         */
    checkReady(moduleNames) {
      if (!Array.isArray(moduleNames)) {
        log('Error', `[ModuleVerifier ERROR] Expected an array of module names, got: ${typeof moduleNames}`);
        return false;
      }
      return moduleNames.every(name => this.isReady(name));
    }

    /**
         * Marks a module as ready.
         * @param {string} moduleName - The name of the module to mark as ready.
         */
    markReady(moduleName) {
      _moduleStatus.set(moduleName, 'ready');
      this.readyModules.add(moduleName);
      log('Info', `✅ Built: ${moduleName}`);
    }

    /**
         * Marks a module as failed.
         * @param {string} moduleName - The name of the module to mark as failed.
         */
    markFailed(moduleName) {
      _moduleStatus.set(moduleName, 'failed');
      log('Error', `❌ Failed to build ${moduleName}`);
    }
  }

  const moduleVerifier = new ModuleVerifier();

  /**
     * Defines a module with its factory function and dependencies.
     * @param {string} name - The unique name of the module.
     * @param {string[]} dependencies - An array of module names this module depends on.
     * @param {function} factory - The function that creates and returns the module's exports.
     * It will receive resolved dependencies as arguments.
     */
  function defineModule(name, dependencies, factory) {
    if (_moduleFactories.has(name)) {
      log('Warn', `⚠️ Module '${name}' already defined. Overwriting.`);
    }
    _moduleFactories.set(name, { dependencies, factory });
    _moduleStatus.set(name, 'pending');
    log('Info', `📦 Registered module: ${name}`);
  }

  /**
     * Attempts to build a single module.
     * @param {string} moduleName - The name of the module to build.
     * @returns {boolean} True if the module was built successfully, false otherwise (e.g., dependencies not met).
     */
  function buildModule(moduleName) {
    if (_moduleStatus.get(moduleName) === 'ready') {
      return true; // Already built
    }
    if (_moduleStatus.get(moduleName) === 'building') {
      // This indicates a circular dependency or a module waiting for itself.
      // For simplicity, we'll treat it as not ready for this pass.
      return false;
    }

    const moduleDef = _moduleFactories.get(moduleName);
    if (!moduleDef) {
      log('Error', `[Initializer ERROR] Attempted to build unknown module: ${moduleName}`);
      return false;
    }

    const { dependencies, factory } = moduleDef;

    // Check if all dependencies are ready
    if (!moduleVerifier.checkReady(dependencies)) {
      log('Info', `⚠️ Dependencies for ${moduleName} not yet ready. Retrying later.`);
      return false;
    }

    _moduleStatus.set(moduleName, 'building');
    log('Info', `🔧 Building: ${moduleName}...`);

    try {
      // Resolve dependencies
      const resolvedDependencies = dependencies.map(depName => {
        const exportedModule = _moduleExports.get(depName);
        if (!exportedModule) {
          throw new Error(`Dependency '${depName}' not found or not exported for '${moduleName}'.`);
        }
        return exportedModule;
      });

      // Call the factory function with its resolved dependencies
      const exports = factory(...resolvedDependencies);
      _moduleExports.set(moduleName, exports);
      moduleVerifier.markReady(moduleName);
      return true;
    } catch (error) {
      log('Error', `❌ Failed to build ${moduleName}: ${error.message}`);
      log('Error', `❌ Stack trace: ${error.stack}`);
      moduleVerifier.markFailed(moduleName);
      return false;
    }
  }

  return {
    defineModule,
    buildModule,
    moduleVerifier,
    _moduleFactories,
    _moduleExports,
    _moduleStatus
  };
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Initializer;
}

// Make available globally
global.Initializer = Initializer;
