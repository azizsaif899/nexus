// *************************************************************************************************
// --- START OF FILE: 00_utils.gs ---
// *************************************************************************************************

/**
 * @file 00_utils.gs
 * @description Core utilities, global namespace setup, and module definition system for G-Assistant.
 * This file should be loaded first in the Apps Script project.
 */
/**
 * ضمان وجود Logger.warn في بيئة Apps Script
 * فإذا لم تكن مُعرّفة، نعيد توجيهها إلى Logger.log مع وسم [WARN]
 */
if (typeof Logger.warn !== 'function') {
  Logger.warn = function(message) {
    Logger.log('[WARN] ' + message);
  };
}
// Ensure global GAssistant namespace exists and its sub-namespaces
var GAssistant = GAssistant || {};
GAssistant.System    = GAssistant.System    || {};
GAssistant.Utils     = GAssistant.Utils     || {};
GAssistant.AI        = GAssistant.AI        || {};
GAssistant.Tools     = GAssistant.Tools     || {};
GAssistant.UI        = GAssistant.UI        || {};
GAssistant.Agents    = GAssistant.Agents    || {};

/**
 * Global registry for modules and their exports.
 * This is the actual Injector for production code.
 * It also manages a simple internal registry of module factories.
 * يجب أن يتم تعريف هذا قبل أي استدعاء لـ defineModule.
 */
GAssistant.Utils.Injector = GAssistant.Utils.Injector || {
  _moduleExports: {},   // Stores the *exported interface* of each defined module
  _moduleFactories: {}, // Stores the *factory function* of each module

  /**
   * Registers a module's factory function. Called by `defineModule`.
   * @param {string} name - The full name of the module (e.g., 'System.Utils').
   * @param {function} factory - The module's factory function.
   */
  registerFactory: function(name, factory) {
    this._moduleFactories[name] = factory;
  },

  /**
   * Stores the exported interface of a module after it's defined.
   * @param {string} name - The full name of the module.
   * @param {object} exports - The public interface of the module.
   */
  setExports: function(name, exports) {
    this._moduleExports[name] = exports;
  },

  /**
   * Resolves and returns specified module dependencies.
   * @param {...string} dependencyNames - Names of dependencies to resolve.
   * @returns {object} An object containing the resolved module instances.
   */
  get: function(...dependencyNames) {
    const resolved = {};
    dependencyNames.forEach(name => {
      let moduleInstance;
      // 1. Try to resolve by full path (e.g., 'System.AI.Core')
      let foundByPath = true;
      const parts = name.split('.');
      let currentPath = GAssistant;
      for (const part of parts) {
        if (currentPath && currentPath[part] !== undefined) {
          currentPath = currentPath[part];
        } else {
          foundByPath = false;
          break;
        }
      }
      if (foundByPath && currentPath !== GAssistant && parts.length > 0) {
        moduleInstance = currentPath;
      }

      // 2. If not found by full path, try common short names
      if (moduleInstance === undefined) {
        switch (name) {
          case 'Utils':          moduleInstance = GAssistant.Utils.Utils || GAssistant.Utils; break;
          case 'Config':         moduleInstance = GAssistant.System.Config; break;
          case 'DocsManager':    moduleInstance = GAssistant.System.DocsManager; break;
          case 'Telemetry':      moduleInstance = GAssistant.System.Telemetry; break;
          case 'AI':             moduleInstance = GAssistant.AI; break;
          case 'Tools':          moduleInstance = GAssistant.Tools; break;
          case 'Dialogue':       moduleInstance = GAssistant.UI.Dialogue; break;
          case 'AgentsCatalog':  moduleInstance = GAssistant.Agents.Catalog; break;
          case 'IntentAnalyzer': moduleInstance = GAssistant.AI.IntentAnalyzer; break;
          case 'LongTermMemory': moduleInstance = GAssistant.AI.LongTermMemory; break;
          case 'GeminiAdapter':  moduleInstance = GAssistant.AI.GeminiAdapter; break;
          case 'ToolExecutor':   moduleInstance = GAssistant.AI.ToolExecutor; break;
          case 'Dispatcher':     moduleInstance = GAssistant.Agents.Dispatcher; break;
          case 'Security':       moduleInstance = GAssistant.System.Security; break;
          case 'DevAgent':       moduleInstance = GAssistant.Agents.Developer; break;
          case 'CFOAgent':       moduleInstance = GAssistant.Agents.CFO; break;
          case 'GeneralAgent':   moduleInstance = GAssistant.Agents.General; break;
        }
      }

      // 3. If still undefined, check the Injector's registry
      if (moduleInstance === undefined) {
        if (this._moduleExports[name]) {
          moduleInstance = this._moduleExports[name];
        } else {
          Logger.warn(`Injector: Could not resolve dependency '${name}'.`);
        }
      }

      resolved[name] = moduleInstance;
    });
    return resolved;
  }
};

/**
 * Defines a module within the GAssistant namespace.
 * This function should be in the global scope.
 * يجب أن يتم تعريف هذه الدالة قبل أي استدعاء لـ defineModule.
 * @param {string} name    - The full name of the module (e.g., 'System.Utils').
 * @param {function(object): object} factory - Factory receiving resolved dependencies.
 */
this.defineModule = function(name, factory) {
  const parts = name.split('.');
  let current = GAssistant;

  // Create nested namespaces
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = current[parts[i]] || {};
    current = current[parts[i]];
  }

  const moduleName = parts[parts.length - 1];

  // Extract argument names to resolve dependencies
  const fnStr = factory.toString();
  const argsMatch = fnStr.match(/^(?:function|\()?\s*\(?([^)]*)\)?\s*=>|function[^(]*\(([^)]*)\)/);
  let argNames = [];
  if (argsMatch) {
    const args = (argsMatch[1] || argsMatch[2] || '').trim();
    if (args.startsWith('{') && args.endsWith('}')) {
      argNames = args.slice(1, -1).split(',').map(a => a.split(':')[0].trim());
    } else {
      argNames = args.split(',').map(a => a.trim()).filter(a => a);
    }
  }

  // Resolve dependencies
  const deps = GAssistant.Utils.Injector.get(...argNames);

  // Build the module
  const exports = factory(deps);

  // Attach to namespace
  current[moduleName] = exports;

  // Register with Injector
  GAssistant.Utils.Injector.setExports(name, exports);
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

// *************************************************************************************************
// --- END OF FILE: 00_utils.gs ---
// *************************************************************************************************
