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
 * --- BOOTSTRAP CORE MODULES ---
 * This IIFE (Immediately Invoked Function Expression) creates and attaches core
 * modules (Utils, Telemetry, DocsManager) to the GAssistant namespace *before*
 * any other module file is loaded. This solves the critical race condition where
 * modules like Config would fail because their dependencies (like Utils.log) were
 * not yet defined. These are simple, dependency-free versions that will be
 * replaced by the full modules once their respective files are loaded.
 */
(function(ns) {
  // --- 1. Core Utilities (Utils) ---
  // A functional, dependency-free version of the Utils module.
  const BootstrapUtils = {
    log: function(message, data) {
      if (data !== undefined) {
        Logger.log(`${message} %s`, JSON.stringify(data, null, 2));
      } else {
        Logger.log(message);
      }
    },
    warn: function(message, data) {
      const logMessage = `[WARN] ${message}` + (data !== undefined ? ` ${JSON.stringify(data)}` : '');
      Logger.log(logMessage);
    },
    error: function(message, error) {
      const errorMessage = `[ERROR] ${message}` + (error ? ` - Details: ${error instanceof Error ? error.stack : JSON.stringify(error)}` : '');
      Logger.log(errorMessage);
    },
    executeSafely: function(fn, fallbackValue = null, context = 'Unknown') {
      try {
        return fn();
      } catch (e) {
        this.error(`Execution failed in context: ${context}`, e);
        return fallbackValue;
      }
    },
    getSheet: function(sheetName, headers = []) {
      // This is a minimal mock for bootstrapping. The full Utils module will have a more robust implementation.
      return { appendRow: () => {}, getRange: () => ({ clearContent: () => {} }) };
    },
    validateString: function(val, name) {
      if (typeof val !== 'string' || !val.trim()) {
        throw new Error(`${name} must be a non-empty string.`);
      }
    }
  };
  ns.System.Utils = BootstrapUtils;

  // --- 2. No-Op (No-Operation) Placeholder Modules with Warnings ---
  // These satisfy the dependency injector and warn if called before being replaced.
  if (!ns.System.Telemetry) {
    ns.System.Telemetry = {
      _isPlaceholder: true,
      track: () => { Logger.log('⚠️ [Placeholder] Telemetry.track called. The full module has not loaded yet.'); },
      logError: (message) => { Logger.log(`⚠️ [Placeholder] Telemetry.logError called: ${message}`); }
    };
  }
  if (!ns.System.DocsManager) {
    ns.System.DocsManager = {
      _isPlaceholder: true,
      registerModuleDocs: () => { Logger.log('⚠️ [Placeholder] DocsManager.registerModuleDocs called. The full module has not loaded yet.'); },
      registerConfigDocs: () => { Logger.log('⚠️ [Placeholder] DocsManager.registerConfigDocs called. The full module has not loaded yet.'); }
    };
  }
})(GAssistant);

/**
 * Global registry for modules and their exports.
 * This is the actual Injector for production code.
 * It also manages a simple internal registry of module factories.
 * يجب أن يتم تعريف هذا قبل أي استدعاء لـ defineModule.
 */
GAssistant.Utils.Injector = GAssistant.Utils.Injector || {
  _moduleExports: {},
  _moduleFactories: {},
  _resolving: new Set(), // ✅ Set to track modules currently being resolved to detect cycles.

  /**
   * ✳️ Architectural Fix: A static map for reliable dependency resolution.
   * This map translates short, convenient names into their full, official paths,
   * eliminating ambiguity and making the system more robust and extensible.
   */
  _dependencyMap: {
    // Core System & UI
    'API':            'System.API.Endpoints',
    'Config':         'System.Config',
    'Dialogue':       'System.UI.Dialogue',
    'DocsManager':    'System.DocsManager',
    'Orchestrator':   'System.Dev.Orchestrator',
    'ModuleVerifier': 'System.Dev.ModuleVerifier',
    'Security':       'System.Security',
    'Telemetry':      'System.Telemetry',
    'Tests':          'System.Tests',
    'Utils':          'System.Utils',

    // AI System
    'AI':             'System.AI',
    'GeminiAdapter':  'System.AI.GeminiAdapter',
    'IntentAnalyzer': 'System.AI.IntentAnalyzer',
    'JsonQuery':      'System.AI.JsonQuery', // ✅ تم الإصلاح: إضافة التبعية المفقودة
    'Context':        'System.AI.Context', // ✅ تم الإصلاح: إضافة التبعية المفقودة
    'CodeAssistance': 'System.AI.CodeAssistance',
    'LongTermMemory': 'System.AI.LongTermMemory',
    'ToolExecutor':   'System.AI.ToolExecutor',

    // Agents System
    'AgentsCatalog':  'System.Agents.Catalog',
    'CFOAgent':       'System.AgentCFO', // ✅ تمت الإضافة
    'DevAgent':       'System.AgentDeveloper',
    'Dispatcher':     'System.AgentDispatcher.Core',
    'Router':         'System.Agents.Router',
    'GeneralAgent':   'System.AgentGeneral', // ✅ تم التصحيح

    // Tools & Metrics
    'MetricsLogger':  'System.MetricsLogger',
    'Tools':          'System.Tools',
    'Tools.Catalog':  'System.Tools.Catalog',
    'ContentParser':  'System.Tools.ContentParser'
  },

  registerFactory: function(name, factory) { this._moduleFactories[name] = factory; },
  setExports: function(name, exports) { this._moduleExports[name] = exports; },

  /**
   * يتحقق مما إذا كانت الوحدة مسجلة في النظام (إما كوحدة حقيقية أو كعنصر نائب).
   * @param {string} moduleName - الاسم المختصر للوحدة.
   * @returns {boolean}
   */
  isRegistered: function(moduleName) {
    const fullPath = this._dependencyMap[moduleName] || moduleName;
    // A module is registered if it's in the exports (already created)
    // or if it can be resolved from the global path (placeholder or real).
    return !!(this._moduleExports[fullPath] || this._resolvePath(fullPath));
  },
  /**
   * يتحقق مما إذا كانت الوحدة مسجلة في النظام.
   * @param {string} moduleName - الاسم المختصر للوحدة.
   * @returns {boolean}
   */
  isRegistered: function(moduleName) {
    const fullPath = this._dependencyMap[moduleName] || moduleName;
    return !!(this._moduleExports[fullPath] || this._resolvePath(fullPath));
  },

  /**
   * Helper to resolve a path string like 'System.Utils' from the GAssistant root.
   * @param {string} pathString - The full path of the module.
   * @returns {object|undefined} The module object or undefined if not found.
   * @private
   */
  _resolvePath: function(pathString) {
    if (!pathString || typeof pathString !== 'string') return undefined;
    const parts = pathString.split('.');
    let current = GAssistant;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  },

  /**
   * Resolves and returns specified module dependencies using a reliable, map-based approach.
   * This function implements Phase 3 of the architectural refactoring plan.
   * @param {...string} dependencyNames - Short or full names of dependencies to resolve.
   * @returns {object} An object containing the resolved module instances.
   */
  get: function(...dependencyNames) {
    const resolved = {};
    dependencyNames.forEach(name => {
      // ✅ Dependency Cycle Detection: Check if we are already trying to resolve this module.
      if (this._resolving.has(name)) {
        const cyclePath = Array.from(this._resolving).join(' -> ') + ` -> ${name}`;
        throw new Error(`Injector: Dependency cycle detected! Path: ${cyclePath}`);
      }
      this._resolving.add(name);

      try {
        let moduleInstance;
        let resolutionSource = 'Unknown';

        // Strategy 1: Check the internal registry first (most reliable).
        // This is the primary source of truth once modules are defined.
        const mappedPath = this._dependencyMap[name];
        const fullPath = mappedPath || name;
        if (this._moduleExports[fullPath]) {
          moduleInstance = this._moduleExports[fullPath];
          resolutionSource = 'Registry';
        } else {
          moduleInstance = this._resolvePath(fullPath);
          if (moduleInstance) { resolutionSource = `Global Path ('${fullPath}')`; }
        }

        if (moduleInstance) {
          const status = moduleInstance._isPlaceholder ? 'Placeholder' : 'Real';
          GAssistant.System.Utils.log(`✅ Injector: تم حل التبعية '${name}' -> [${status}] (المصدر: ${resolutionSource})`);
          resolved[name] = moduleInstance;
        } else {
          GAssistant.System.Utils.warn(`❌ Injector: تعذر حل التبعية '${name}'.\n  > الأسباب المحتملة: 1) خطأ إملائي في الاسم. 2) الوحدة غير مسجلة في 'module_manifest.json'. 3) لم يتم تشغيل 'node scripts/generatePushOrder.js' بعد تعديل التبعيات.`);
          resolved[name] = undefined;
        }
      } finally {
        // ✅ Always remove the module from the resolving set when done.
        this._resolving.delete(name);
      }
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
this.defineModule = function(name, arg2, arg3) {
  let factory;
  // Handle overloaded function signature to support both old and new module definitions.
  // Signature 1: defineModule(name, factory)
  // Signature 2: defineModule(name, dependenciesArray, factory)
  if (typeof arg2 === 'function') {
    factory = arg2;
  } else if (Array.isArray(arg2) && typeof arg3 === 'function') {
    factory = arg3;
  } else {
    // Log a detailed error and stop execution for this module if the signature is incorrect.
    const errorMessage = `Invalid arguments for defineModule('${name}'). Expected a factory function.`;
    console.error(errorMessage);
    throw new TypeError(errorMessage);
  }

  const parts = name.split('.');
  let current = GAssistant;

  // ✅ Best Practice: Check if we are overwriting a placeholder
  let placeholderExists = true;
  let checkPath = GAssistant;
  for (const part of parts) {
    if (checkPath && checkPath[part]) {
      checkPath = checkPath[part];
    } else {
      placeholderExists = false;
      break;
    }
  }

  // Create nested namespaces
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = current[parts[i]] || {};
    current = current[parts[i]];
  }

  const moduleName = parts[parts.length - 1];

  // Extract argument names to resolve dependencies
  if (typeof factory !== 'function') {
    const errorMessage = `TypeError: factory is not a function for module '${name}'. Check the module definition.`;
    console.error(errorMessage);
    throw new TypeError(errorMessage);
  }
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

  // ✅ Best Practice: Log the replacement if a placeholder was overwritten
  if (placeholderExists) {
    Logger.log(`✅ [Bootstrap] Real module '${name}' loaded, replacing placeholder.`);
  }

  // Register with Injector
  GAssistant.Utils.Injector.setExports(name, exports);
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

/**
 * ==============================================================================
 * --- DEFINITION OF THE FULL System.Utils MODULE ---
 * This is the definitive, full implementation of the Utils module.
 * It is defined here, in its own file, and will correctly overwrite the
 * bootstrap/placeholder version of Utils when this file is loaded by Apps Script.
 * This resolves the "Utils.log is not a function" error.
 * ==============================================================================
 */
defineModule('System.Utils', () => {
  // ✅ إشارة مرور (Semaphore) لمنع التكرار اللانهائي عند تصدير سجل الأخطاء.
  let _isExportingLog = false;

  function log(message, data) {
    if (data !== undefined) {
      Logger.log(`${message} %s`, JSON.stringify(data, null, 2));
    } else {
      Logger.log(message);
    }
  }

  function warn(message, data) {
    const logMessage = `[WARN] ${message}` + (data !== undefined ? ` ${JSON.stringify(data)}` : '');
    Logger.log(logMessage);
  }

  /**
   * يسجل خطأً بتنسيق غني بالمعلومات.
   * @param {string} message - رسالة الخطأ الرئيسية.
   * @param {object} [details={}] - كائن يحتوي على تفاصيل إضافية.
   * @param {string} [details.context] - سياق حدوث الخطأ (e.g., 'Module.functionName').
   * @param {Error} [details.errorObj] - كائن الخطأ الأصلي للحصول على الـ stack trace.
   */
  function error(message, details = {}) {
    const { context, errorObj } = details;
    let logMessage = `[ERROR] ${message}`;
    if (context) {
      logMessage += ` | Context: ${context}`;
    }
    if (errorObj && errorObj instanceof Error) {
      logMessage += `\n  > Message: ${errorObj.message}\n  > Stack: ${errorObj.stack}`;
    }
    Logger.log(logMessage);

    // ✅ ربط تلقائي مع نظام تسجيل الأخطاء الحي
    // أي خطأ يتم تسجيله عبر Utils.error سيتم التقاطه هنا.
    const { ErrorLogger } = GAssistant.Utils.Injector.get('System.ErrorLogger');
    if (ErrorLogger && typeof ErrorLogger.record === 'function') {
      ErrorLogger.record(message, context || 'Unknown');
    }
  }

  function executeSafely(fn, context = 'Unknown Context', fallbackValue = null) {
    // إذا كنا بالفعل في طور تصدير السجل، قم بتنفيذ الدالة فقط دون تشغيل الخطاف مرة أخرى.
    if (_isExportingLog) {
      try {
        return fn();
      } catch (e) {
        error('Execution failed within a nested safe block during log export.', { context: context, errorObj: e });
        return fallbackValue;
      }
    }

    try {
      return fn();
    } catch (e) {
      error('Execution failed within a safe block.', { context: context, errorObj: e });
      return fallbackValue;
    } finally {
      // ✅ ربط معماري: تصدير سجل الأخطاء تلقائيًا في نهاية كل عملية حساسة.
      _isExportingLog = true; // تعيين الإشارة لمنع التكرار
      try {
        if (typeof createLiveErrorFile === 'function') {
          createLiveErrorFile();
        }
      } finally {
        _isExportingLog = false; // إعادة تعيين الإشارة دائمًا
      }
    }
  }

  function safeParse(json, fallback = {}) {
    try { return JSON.parse(json); } catch { return fallback; }
  }
  function validateEmail(email) {
    if (typeof email !== 'string') return false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function getSheet(sheetName, headers = []) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (headers.length > 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
    }
    return sheet;
  }

  function validateString(val, name) {
    if (typeof val !== 'string' || !val.trim()) {
      throw new Error(`${name} must be a non-empty string.`);
    }
  }

  return { log, warn, error, executeSafely, safeParse, validateEmail, getSheet, validateString };
});
/**
 * In System.ErrorLogger (Conceptual Example)
 * This function now receives a structured object.
 */
function record(errorData) {
  const allErrors = readExistingErrorsFromFile(); // e.g., reads and parses the existing JSON log
  allErrors.push(errorData);

  // The key step: Stringify the entire array of objects.
  // This correctly escapes all characters (like \n) in all fields automatically.
  const jsonString = JSON.stringify({
    lastUpdated: new Date().toISOString(),
    errors: allErrors
  }, null, 2); // Using null, 2 for pretty-printing

  // Now, write the perfectly formatted and valid jsonString to the log file.
  // DriveApp.getFileById('...').setContent(jsonString);
}
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
 * --- BOOTSTRAP CORE MODULES ---
 * This IIFE (Immediately Invoked Function Expression) creates and attaches core
 * modules (Utils, Telemetry, DocsManager) to the GAssistant namespace *before*
 * any other module file is loaded. This solves the critical race condition where
 * modules like Config would fail because their dependencies (like Utils.log) were
 * not yet defined. These are simple, dependency-free versions that will be
 * replaced by the full modules once their respective files are loaded.
 */
(function(ns) {
  // --- 1. Core Utilities (Utils) ---
  // A functional, dependency-free version of the Utils module.
  const BootstrapUtils = {
    log: function(message, data) {
      if (data !== undefined) {
        Logger.log(`${message} %s`, JSON.stringify(data, null, 2));
      } else {
        Logger.log(message);
      }
    },
    warn: function(message, data) {
      const logMessage = `[WARN] ` + (data !== undefined ? ` ${JSON.stringify(data)}` : '');
      Logger.log(logMessage);
    },
    error: function(message, error) {
      const errorMessage = `[ERROR] ` + (error ? ` - Details: ${error instanceof Error ? error.stack : JSON.stringify(error)}` : '');
      Logger.log(errorMessage);
    },
    executeSafely: function(fn, fallbackValue = null, context = 'Unknown') {
      try {
        return fn();
      } catch (e) {
        this.error(`Execution failed in context: `, e);
        return fallbackValue;
      }
    },
    getSheet: function(sheetName, headers = []) {
      // This is a minimal mock for bootstrapping. The full Utils module will have a more robust implementation.
      return { appendRow: () => {}, getRange: () => ({ clearContent: () => {} }) };
    },
    validateString: function(val, name) {
      if (typeof val !== 'string' || !val.trim()) {
        throw new Error(` must be a non-empty string.`);
      }
    }
  };
  ns.System.Utils = BootstrapUtils;

  // --- 2. No-Op (No-Operation) Placeholder Modules with Warnings ---
  // These satisfy the dependency injector and warn if called before being replaced.
  if (!ns.System.Telemetry) {
    ns.System.Telemetry = {
      _isPlaceholder: true,
      track: () => { Logger.log('⚠️ [Placeholder] Telemetry.track called. The full module has not loaded yet.'); },
      logError: (message) => { Logger.log(`⚠️ [Placeholder] Telemetry.logError called: `); }
    };
  }
  if (!ns.System.DocsManager) {
    ns.System.DocsManager = {
      _isPlaceholder: true,
      registerModuleDocs: () => { Logger.log('⚠️ [Placeholder] DocsManager.registerModuleDocs called. The full module has not loaded yet.'); },
      registerConfigDocs: () => { Logger.log('⚠️ [Placeholder] DocsManager.registerConfigDocs called. The full module has not loaded yet.'); }
    };
  }
})(GAssistant);

/**
 * Global registry for modules and their exports.
 * This is the actual Injector for production code.
 * It also manages a simple internal registry of module factories.
 * يجب أن يتم تعريف هذا قبل أي استدعاء لـ defineModule.
 */
GAssistant.Utils.Injector = GAssistant.Utils.Injector || {
  _moduleExports: {},
  _moduleFactories: {},
  _resolving: new Set(), // ✅ Set to track modules currently being resolved to detect cycles.

  /**
   * ✳️ Architectural Fix: A static map for reliable dependency resolution.
   * This map translates short, convenient names into their full, official paths,
   * eliminating ambiguity and making the system more robust and extensible.
   */
  _dependencyMap: {
    // Core System & UI
    'API':            'System.API.Endpoints',
    'Config':         'System.Config',
    'Dialogue':       'System.UI.Dialogue',
    'DocsManager':    'System.DocsManager',
    'Orchestrator':   'System.Dev.Orchestrator',
    'ModuleVerifier': 'System.Dev.ModuleVerifier',
    'Security':       'System.Security',
    'Telemetry':      'System.Telemetry',
    'Tests':          'System.Tests',
    'Utils':          'System.Utils',

    // AI System
    'AI':             'System.AI',
    'GeminiAdapter':  'System.AI.GeminiAdapter',
    'IntentAnalyzer': 'System.AI.IntentAnalyzer',
    'JsonQuery':      'System.AI.JsonQuery', // ✅ تم الإصلاح: إضافة التبعية المفقودة
    'Context':        'System.AI.Context', // ✅ تم الإصلاح: إضافة التبعية المفقودة
    'CodeAssistance': 'System.AI.CodeAssistance',
    'LongTermMemory': 'System.AI.LongTermMemory',
    'ToolExecutor':   'System.AI.ToolExecutor',

    // Agents System
    'AgentsCatalog':  'System.Agents.Catalog',
    'CFOAgent':       'System.AgentCFO', // ✅ تمت الإضافة
    'DevAgent':       'System.AgentDeveloper',
    'Dispatcher':     'System.AgentDispatcher.Core',
    'Router':         'System.Agents.Router',
    'GeneralAgent':   'System.AgentGeneral', // ✅ تم التصحيح

    // Tools & Metrics
    'MetricsLogger':  'System.MetricsLogger',
    'Tools':          'System.Tools',
    'Tools.Catalog':  'System.Tools.Catalog',
    'ContentParser':  'System.Tools.ContentParser'
  },

  registerFactory: function(name, factory) { this._moduleFactories[name] = factory; },
  setExports: function(name, exports) { this._moduleExports[name] = exports; },

  /**
   * يتحقق مما إذا كانت الوحدة مسجلة في النظام (إما كوحدة حقيقية أو كعنصر نائب).
   * @param {string} moduleName - الاسم المختصر للوحدة.
   * @returns {boolean}
   */
  isRegistered: function(moduleName) {
    const fullPath = this._dependencyMap[moduleName] || moduleName;
    // A module is registered if it's in the exports (already created)
    // or if it can be resolved from the global path (placeholder or real).
    return !!(this._moduleExports[fullPath] || this._resolvePath(fullPath));
  },
  /**
   * يتحقق مما إذا كانت الوحدة مسجلة في النظام.
   * @param {string} moduleName - الاسم المختصر للوحدة.
   * @returns {boolean}
   */
  isRegistered: function(moduleName) {
    const fullPath = this._dependencyMap[moduleName] || moduleName;
    return !!(this._moduleExports[fullPath] || this._resolvePath(fullPath));
  },

  /**
   * Helper to resolve a path string like 'System.Utils' from the GAssistant root.
   * @param {string} pathString - The full path of the module.
   * @returns {object|undefined} The module object or undefined if not found.
   * @private
   */
  _resolvePath: function(pathString) {
    if (!pathString || typeof pathString !== 'string') return undefined;
    const parts = pathString.split('.');
    let current = GAssistant;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  },

  /**
   * Resolves and returns specified module dependencies using a reliable, map-based approach.
   * This function implements Phase 3 of the architectural refactoring plan.
   * @param {...string} dependencyNames - Short or full names of dependencies to resolve.
   * @returns {object} An object containing the resolved module instances.
   */
  get: function(...dependencyNames) {
    const resolved = {};
    dependencyNames.forEach(name => {
      // ✅ Dependency Cycle Detection: Check if we are already trying to resolve this module.
      if (this._resolving.has(name)) {
        const cyclePath = Array.from(this._resolving).join(' -> ') + ` -> `;
        throw new Error(`Injector: Dependency cycle detected! Path: `);
      }
      this._resolving.add(name);

      try {
        let moduleInstance;
        let resolutionSource = 'Unknown';

        // Strategy 1: Check the internal registry first (most reliable).
        // This is the primary source of truth once modules are defined.
        const mappedPath = this._dependencyMap[name];
        const fullPath = mappedPath || name;
        if (this._moduleExports[fullPath]) {
          moduleInstance = this._moduleExports[fullPath];
          resolutionSource = 'Registry';
        } else {
          moduleInstance = this._resolvePath(fullPath);
          if (moduleInstance) { resolutionSource = `Global Path ('')`; }
        }

        if (moduleInstance) {
          const status = moduleInstance._isPlaceholder ? 'Placeholder' : 'Real';
          GAssistant.System.Utils.log(`✅ Injector: تم حل التبعية '' -> [] (المصدر: )`);
          resolved[name] = moduleInstance;
        } else {
          GAssistant.System.Utils.warn(`❌ Injector: تعذر حل التبعية ''.\n  > الأسباب المحتملة: 1) خطأ إملائي في الاسم. 2) الوحدة غير مسجلة في 'module_manifest.json'. 3) لم يتم تشغيل 'node scripts/generatePushOrder.js' بعد تعديل التبعيات.`);
          resolved[name] = undefined;
        }
      } finally {
        // ✅ Always remove the module from the resolving set when done.
        this._resolving.delete(name);
      }
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
this.defineModule = function(name, arg2, arg3) {
  let factory;
  // Handle overloaded function signature to support both old and new module definitions.
  // Signature 1: defineModule(name, factory)
  // Signature 2: defineModule(name, dependenciesArray, factory)
  if (typeof arg2 === 'function') {
    factory = arg2;
  } else if (Array.isArray(arg2) && typeof arg3 === 'function') {
    factory = arg3;
  } else {
    // Log a detailed error and stop execution for this module if the signature is incorrect.
    const errorMessage = `Invalid arguments for defineModule(''). Expected a factory function.`;
    console.error(errorMessage);
    throw new TypeError(errorMessage);
  }

  const parts = name.split('.');
  let current = GAssistant;

  // ✅ Best Practice: Check if we are overwriting a placeholder
  let placeholderExists = true;
  let checkPath = GAssistant;
  for (const part of parts) {
    if (checkPath && checkPath[part]) {
      checkPath = checkPath[part];
    } else {
      placeholderExists = false;
      break;
    }
  }

  // Create nested namespaces
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = current[parts[i]] || {};
    current = current[parts[i]];
  }

  const moduleName = parts[parts.length - 1];

  // Extract argument names to resolve dependencies
  if (typeof factory !== 'function') {
    const errorMessage = `TypeError: factory is not a function for module ''. Check the module definition.`;
    console.error(errorMessage);
    throw new TypeError(errorMessage);
  }
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

  // ✅ Best Practice: Log the replacement if a placeholder was overwritten
  if (placeholderExists) {
    Logger.log(`✅ [Bootstrap] Real module '' loaded, replacing placeholder.`);
  }

  // Register with Injector
  GAssistant.Utils.Injector.setExports(name, exports);
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

/**
 * ==============================================================================
 * --- DEFINITION OF THE FULL System.Utils MODULE ---
 * This is the definitive, full implementation of the Utils module.
 * It is defined here, in its own file, and will correctly overwrite the
 * bootstrap/placeholder version of Utils when this file is loaded by Apps Script.
 * This resolves the "Utils.log is not a function" error.
 * ==============================================================================
 */
defineModule('System.Utils', () => {
  // ✅ إشارة مرور (Semaphore) لمنع التكرار اللانهائي عند تصدير سجل الأخطاء.
  let _isExportingLog = false;

  function log(message, data) {
    if (data !== undefined) {
      Logger.log(` %s`, JSON.stringify(data, null, 2));
    } else {
      Logger.log(message);
    }
  }

  function warn(message, data) {
    const logMessage = `[WARN] ` + (data !== undefined ? ` ${JSON.stringify(data)}` : '');
    Logger.log(logMessage);
  }

  /**
   * يسجل خطأً بتنسيق غني بالمعلومات.
   * @param {string} message - رسالة الخطأ الرئيسية.
   * @param {object} [details={}] - كائن يحتوي على تفاصيل إضافية.
   * @param {string} [details.context] - سياق حدوث الخطأ (e.g., 'Module.functionName').
   * @param {Error} [details.errorObj] - كائن الخطأ الأصلي للحصول على الـ stack trace.
   */
  function error(message, details = {}) {
    const { context, errorObj } = details;
    let logMessage = `[ERROR] `;
    if (context) {
      logMessage += ` | Context: `;
    }
    if (errorObj && errorObj instanceof Error) {
      logMessage += `\n  > Message: ${errorObj.message}\n  > Stack: ${errorObj.stack}`;
    }
    Logger.log(logMessage);

    // ✅ ربط تلقائي مع نظام تسجيل الأخطاء الحي
    // أي خطأ يتم تسجيله عبر Utils.error سيتم التقاطه هنا.
    // The injector is called directly here because this is inside the Utils module itself.
    const resolved = GAssistant.Utils.Injector.get('System.ErrorLogger');
    const ErrorLogger = resolved['System.ErrorLogger']; // Correctly retrieve the module

    if (ErrorLogger && typeof ErrorLogger.record === 'function') {
      // ✅ Architectural Fix: Pass a structured object to the logger.
      // This prevents information loss and delegates JSON serialization
      // to the logger, which is the correct place to handle it.
      const errorData = { message, context: context || 'Unknown' };
      if (errorObj instanceof Error) {
        errorData.stack = errorObj.stack;
        errorData.errorMessage = errorObj.message;
      }
      ErrorLogger.record(errorData);
    }
  }

  function executeSafely(fn, context = 'Unknown Context', fallbackValue = null) {
    // إذا كنا بالفعل في طور تصدير السجل، قم بتنفيذ الدالة فقط دون تشغيل الخطاف مرة أخرى.
    if (_isExportingLog) {
      try {
        return fn();
      } catch (e) {
        error('Execution failed within a nested safe block during log export.', { context: context, errorObj: e });
        return fallbackValue;
      }
    }

    try {
      return fn();
    } catch (e) {
      error('Execution failed within a safe block.', { context: context, errorObj: e });
      return fallbackValue;
    } finally {
      // ✅ ربط معماري: تصدير سجل الأخطاء تلقائيًا في نهاية كل عملية حساسة.
      _isExportingLog = true; // تعيين الإشارة لمنع التكرار
      try {
        if (typeof createLiveErrorFile === 'function') {
          createLiveErrorFile();
        }
      } finally {
        _isExportingLog = false; // إعادة تعيين الإشارة دائمًا
      }
    }
  }

  function safeParse(json, fallback = {}) {
    try { return JSON.parse(json); } catch { return fallback; }
  }
  function validateEmail(email) {
    if (typeof email !== 'string') return false;
    const re = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function getSheet(sheetName, headers = []) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (headers.length > 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
    }
    return sheet;
  }

  function validateString(val, name) {
    if (typeof val !== 'string' || !val.trim()) {
      throw new Error(` must be a non-empty string.`);
    }
  }

  return { log, warn, error, executeSafely, safeParse, validateEmail, getSheet, validateString };
});
