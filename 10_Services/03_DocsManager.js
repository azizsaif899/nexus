// *************************************************************************************************
// --- START OF FILE: 30_tools/DocsManager.js ---
// *************************************************************************************************

/**
 * @file 30_tools/DocsManager.js
 * @module System.DocsManager
 * @version 21 // تحديث الإصدار ليعكس البنية الجديدة المعتمدة على الذاكرة
 * @author عبدالعزيز
 * @description
 * وحدة مركزية لإدارة وتجميع توثيق جميع الوحدات في المشروع.
 * تعتمد على سجل في الذاكرة (in-memory registry) لتوفير أداء عالٍ ومرونة،
 * وتوفر واجهة لتسجيل التوثيق برمجيًا من كل وحدة.
 */

defineModule('System.DocsManager', ({ Utils, Config, Telemetry }) => {
  const _docsRegistry = {};

  /**
   * يسجل التوثيق لوحدة معينة.
   * @param {string} moduleName - اسم الوحدة (e.g., 'System.Config').
   * @param {Array<object>} docs - مصفوفة من كائنات التوثيق للدوال.
   */
  function registerModuleDocs(moduleName, docs) {
    if (!moduleName || !Array.isArray(docs)) {
      Utils.warn('DocsManager: Invalid arguments for registerModuleDocs.');
      return;
    }
    _docsRegistry[moduleName] = docs;
    Utils.log(`DocsManager: Registered documentation for module "${moduleName}".`);
  }

  /**
   * يسجل توثيق وحدة System.Config بشكل منفصل لكسر التبعية الدائرية.
   * يتم استدعاء هذه الدالة من ملف تهيئة بعد تحميل الوحدتين.
   */
  function registerConfigDocs() {
    registerModuleDocs('System.Config', [
      { name: 'get',     description: 'يجلب قيمة إعداد حسب المفتاح.' },
      { name: 'getAll',  description: 'يجلب جميع الإعدادات، يدعم التحديث الفوري.' },
      { name: 'validate',description: 'يتحقق من صحة الإعدادات المطلوبة.' }
    ]);
  }

  /**
   * يسجل توثيق الوحدات الأساسية (مثل Utils) بشكل منفصل.
   * يتم استدعاء هذه الدالة من ملف تهيئة بعد تحميل جميع الوحدات.
   */
  function registerCoreDocs() {
    registerModuleDocs('System.Utils', [
      { name: 'log', description: 'يسجل رسالة معلوماتية في Logger.' },
      { name: 'warn', description: 'يسجل رسالة تحذير في Logger.' },
      { name: 'error', description: 'يسجل رسالة خطأ في Logger و ErrorLogger.' },
      { name: 'executeSafely', description: 'ينفذ دالة مع معالجة آمنة للأخطاء.' },
      { name: 'safeParse', description: 'يحلل سلسلة JSON بأمان.' },
    ]);
  }

  /**
   * يجلب التوثيق لوحدة معينة.
   * @param {string} moduleName - اسم الوحدة.
   * @returns {Array<object>|undefined} - مصفوفة التوثيق أو undefined إذا لم توجد.
   */
  function getModuleDocs(moduleName) {
    return _docsRegistry[moduleName]
      ? JSON.parse(JSON.stringify(_docsRegistry[moduleName]))
      : undefined;
  }

  /**
   * يجلب توثيق جميع الوحدات.
   * @returns {object} - نسخة من سجل التوثيق.
   */
  function getAllDocs() {
    // Return a copy to prevent mutation
    return JSON.parse(JSON.stringify(_docsRegistry));
  }

  return {
    registerModuleDocs,
    registerConfigDocs,
    registerCoreDocs,
    getModuleDocs,
    getAllDocs
  };
});// *************************************************************************************************
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
          const errorMessage = `❌ Injector: تعذر حل التبعية '${name}'.\n  > الأسباب المحتملة: 1) خطأ إملائي في الاسم. 2) الوحدة غير مسجلة في 'module_manifest.json'. 3) لم يتم تشغيل 'node scripts/generatePushOrder.js' بعد تعديل التبعيات.`;
          GAssistant.System.Utils.warn(errorMessage);
          resolved[name] = undefined;

          // ✅ ربط معماري: تسجيل هذا الفشل الحرج في Telemetry.
          // بما أن Telemetry الآن وحدة ذات تبعيات صفرية، فهذا الاستدعاء آمن.
          const telemetry = GAssistant.System.Telemetry;
          if (telemetry && typeof telemetry.trackError === 'function') {
            telemetry.trackError('Injector.DependencyNotFound', { dependencyName: name });
          }
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
  
  /**
   * ✅ **دالة مركزية جديدة**
   * تسجل استدعاء دالة معينة في سجل مخصص.
   * @param {string} functionName - اسم الدالة التي تم استدعاؤها.
   * @param {string} sheetName - اسم الورقة لتسجيل الاستدعاء فيها.
   */
  function recordInvocation(functionName, sheetName = 'Invocation Log') {
    executeSafely(() => {
      const sheet = getSheet(sheetName, ['Timestamp', 'Function Name', 'User']);
      const user = Session.getActiveUser().getEmail();
      sheet.appendRow([new Date(), functionName, user]);
    }, `recordInvocation for ${functionName}`);
  }

  return { 
    log, 
    warn, 
    error, 
    executeSafely, 
    safeParse, 
    validateEmail, 
    getSheet, 
    validateString,
    recordInvocation // ✅ تصدير الدالة الجديدة
  };
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
defineModule('System.AI.Memory', ({ Utils }) => { // ✅ حقن Utils
  
  // ... باقي الكود الخاص بالوحدة

  function someFunctionThatNeedsRecording() {
    // ...
    Utils.recordInvocation('someFunctionThatNeedsRecording', 'AI_Memory_Log'); // ✅ استدعاء الدالة المركزية
    // ...
  }

  // ... قم بإزالة التعريف القديم لـ _recordInvocation

  return {
    // ...
  };
});
defineModule('System.AI.Memory', ({ Utils }) => { // ✅ حقن Utils
  
  // ... باقي الكود الخاص بالوحدة

  function someFunctionThatNeedsRecording() {
    // ...
    Utils.recordInvocation('someFunctionThatNeedsRecording', 'AI_Memory_Log'); // ✅ استدعاء الدالة المركزية
    // ...
  }

  // ... قم بإزالة التعريف القديم لـ _recordInvocation

  return {
    // ...
  };
});
// دالة _recordInvocation المكررة كانت موجودة هنا
// دالة _recordInvocation المكررة كانت موجودة هنا
defineModule('System.AI.LongTermMemory', ({ Utils }) => { // ✅ حقن Utils
  
  // ... باقي الكود الخاص بالوحدة

  function someOtherFunctionToRecord() {
    // ...
    Utils.recordInvocation('someOtherFunctionToRecord', 'LTM_Log'); // ✅ استدعاء الدالة المركزية
    // ...
  }

  // ... قم بإزالة التعريف القديم لـ _recordInvocation

  return {
    // ...
  };
});
{
  "timeZone": "America/New_York",
  "dependencies": {
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.container.ui",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/documents"
  ],
  "files": [
    "00_utils.js",
    "core_loader.js",
    "01_config.js",
    "03_types.js",
    "70_telemetry/telemetry.js",
    "70_telemetry/error_logger.js",
    "30_tools/0_tools_catalog.js",
    "30_tools/DocsManager.js",
    "30_tools/1_tools_sheets.js",
    "30_tools/2_tools_accounting.js",
    "30_tools/4_tools_developer.js",
    "30_tools/5_tools_project_insights.js",
    "30_tools/6_image_processor.js",
    "30_tools/7_tools_content_parser.js",
    "35_accounting/0_ChartOfAccounts.js",
    "35_accounting/1_Ledger.js",
    "35_accounting/2_Reporting.js",
    "40_security/Security.js",
    "55_operations/0_Invoicing.js",
    "55_operations/1_Expenses.js",
    "55_operations/2_Inventory.js",
    "20_ai/0_ai_constitution.js",
    "20_ai/6_ai_geminiAdapter.js",
    "20_ai/5_ai_core.js",
    "20_ai/1_ai_memory.js",
    "20_ai/2_ai_longTermMemory.g.js",
    "20_ai/4_ai_context.js",
    "20_ai/6_ai_intentAnalyzer.js",
    "20_ai/5_ai_toolExecutor.js",
    "20_ai/8_ai_code_assistance.js",
    "20_ai/3_ai_dispatcher.js",
    "25_ai_agents/_agents_namespace.js",
    "25_ai_agents/agents_catalog.js",
    "25_ai_agents/general_agent.js",
    "25_ai_agents/agent_developer.gs.js",
    "25_ai_agents/agent_cfo.gs.js",
    "25_ai_agents/agent_dispatcher.gs.js",
    "25_ai_agents/2_agents_router.js",
    "10_ui/1_ui_entry.js",
    "10_ui/0_ui_dialogue.js",
    "10_ui/3_ui_status.gs.js",
    "10_ui/3_ui_action_handler.js",
    "10_ui/2_ui_developerSidebar.js",
    "10_ui/4_ui_dev_sidebar_handler.js",
    "80_api/api_endpoints.js",
    "90_dev_runners.js",
    "99_Code.js"
  ]
}
/**
 * @file 5_ai_core.js
 * @description Defines the core AI processing module for the system.
 */

/**
 * @module System.AI.Core
 * @description
 * The central AI module responsible for orchestrating the entire AI response generation process.
 * It takes user input, analyzes intent, executes tools, and synthesizes a final response using
 * the Gemini model.
 * 
 * @param {object} deps - The resolved dependencies.
 * @param {System.AI.GeminiAdapter} deps.GeminiAdapter - The adapter for communicating with the Gemini API.
 * @param {System.AI.IntentAnalyzer} deps.IntentAnalyzer - The module to analyze user intent.
 * @param {System.AI.ToolExecutor} deps.ToolExecutor - The module to execute system tools based on AI requests.
 * @returns {object} The public interface of the AI Core module.
 */
defineModule('System.AI.Core', ({ GeminiAdapter, IntentAnalyzer, ToolExecutor }) => {

    /**
     * Processes a user's query and generates a complete AI response.
     * @param {string} userInput - The text input from the user.
     * @param {string} conversationId - The ID of the current conversation thread.
     * @returns {Promise<string>} A promise that resolves to the final AI-generated response text.
     */
    async function processQuery(userInput, conversationId) {
        // 1. Analyze Intent
        const intent = await IntentAnalyzer.analyze(userInput);

        // 2. Execute Tools if necessary
        const toolResults = await ToolExecutor.execute(intent.tools);

        // 3. Generate Final Response
        const finalResponse = await GeminiAdapter.generateResponse({
            userInput,
            intent,
            toolResults,
            conversationId
        });

        return finalResponse;
    }

    return {
        processQuery
    };
});
defineModule('System.Telemetry', () => {
    // لا تحقن التبعيات هنا مباشرة
    
    let _config = null;
    let _isConfigLoaded = false;

    /**
     * يحاول تحميل وحدة Config بشكل آمن.
     * يتم استدعاؤه قبل كل عملية تتطلب الإعدادات.
     */
    function _ensureConfig() {
        if (_isConfigLoaded) return; // لا تقم بالتحميل مرة أخرى

        try {
            // استخدام Injector مباشرة هنا بدلاً من الحقن
            _config = GAssistant.Utils.Injector.get('Config').Config;
            _isConfigLoaded = true;
        } catch (e) {
            _config = null; // فشل التحميل، استمر بأمان
            _isConfigLoaded = true; // ضع علامة لتجنب المحاولة مرة أخرى
            console.warn('[Telemetry] Could not load Config module. Using fallback mechanisms.');
        }
    }

    function logError(error, context = 'Unknown') {
        _ensureConfig(); // تأكد من محاولة تحميل الإعدادات

        const errorMessage = `[ERROR] Context: ${context} | Message: ${error.message || error}`;
        console.error(errorMessage + (error.stack ? `\nStack: ${error.stack}` : ''));

        // حاول التسجيل في Google Sheet فقط إذا كانت Config متاحة
        const sheetId = _config ? _config.get('telemetry.logSheetId') : null;
        if (sheetId) {
            try {
                const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('ErrorLog');
                sheet.appendRow([new Date(), context, error.message || String(error), error.stack || '']);
            } catch (sheetError) {
                console.error(`[Telemetry] CRITICAL: Failed to write to log sheet. Error: ${sheetError.message}`);
            }
        }
    }

    // ... باقي دوال الوحدة

    return {
        logError
        // ...
    };
});
/**
 * @file 5_ai_core.js
 * @description Defines the core AI processing module for the system.
 */

/**
 * @module System.AI.Core
 * @description
 * The central AI module responsible for orchestrating the entire AI response generation process.
 * It takes user input, analyzes intent, executes tools, and synthesizes a final response using
 * the Gemini model.
 * 
 * @param {object} deps - The resolved dependencies.
 * @param {System.AI.GeminiAdapter} deps.GeminiAdapter - The adapter for communicating with the Gemini API.
 * @param {System.AI.IntentAnalyzer} deps.IntentAnalyzer - The module to analyze user intent.
 * @param {System.AI.ToolExecutor} deps.ToolExecutor - The module to execute system tools based on AI requests.
 * @returns {object} The public interface of the AI Core module.
 */
defineModule('System.AI.Core', ({ GeminiAdapter, IntentAnalyzer, ToolExecutor }) => {

    /**
     * Processes a user's query and generates a complete AI response.
     * @param {string} userInput - The text input from the user.
     * @param {string} conversationId - The ID of the current conversation thread.
     * @returns {Promise<string>} A promise that resolves to the final AI-generated response text.
     */
    async function processQuery(userInput, conversationId) {
        // 1. Analyze Intent
        const intent = await IntentAnalyzer.analyze(userInput);

        // 2. Execute Tools if necessary
        const toolResults = await ToolExecutor.execute(intent.tools);

        // 3. Generate Final Response
        const finalResponse = await GeminiAdapter.generateResponse({
            userInput,
            intent,
            toolResults,
            conversationId
        });

        return finalResponse;
    }

    return {
        processQuery
    };
});
defineModule('System.Telemetry', () => {
    // لا تحقن التبعيات هنا مباشرة
    
    let _config = null;
    let _isConfigLoaded = false;

    /**
     * يحاول تحميل وحدة Config بشكل آمن.
     * يتم استدعاؤه قبل كل عملية تتطلب الإعدادات.
     */
    function _ensureConfig() {
        if (_isConfigLoaded) return; // لا تقم بالتحميل مرة أخرى

        try {
            // استخدام Injector مباشرة هنا بدلاً من الحقن
            _config = GAssistant.Utils.Injector.get('Config').Config;
            _isConfigLoaded = true;
        } catch (e) {
            _config = null; // فشل التحميل، استمر بأمان
            _isConfigLoaded = true; // ضع علامة لتجنب المحاولة مرة أخرى
            console.warn('[Telemetry] Could not load Config module. Using fallback mechanisms.');
        }
    }

    function logError(error, context = 'Unknown') {
        _ensureConfig(); // تأكد من محاولة تحميل الإعدادات

        const errorMessage = `[ERROR] Context: ${context} | Message: ${error.message || error}`;
        console.error(errorMessage + (error.stack ? `\nStack: ${error.stack}` : ''));

        // حاول التسجيل في Google Sheet فقط إذا كانت Config متاحة
        const sheetId = _config ? _config.get('telemetry.logSheetId') : null;
        if (sheetId) {
            try {
                const sheet = SpreadsheetApp.openById(sheetId).getSheetByName('ErrorLog');
                sheet.appendRow([new Date(), context, error.message || String(error), error.stack || '']);
            } catch (sheetError) {
                console.error(`[Telemetry] CRITICAL: Failed to write to log sheet. Error: ${sheetError.message}`);
            }
        }
    }

    // ... باقي دوال الوحدة

    return {
        logError
        // ...
    };
});
