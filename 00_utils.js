// 🚀 G-Assistant Core Module System (v6 - Topological Runtime)
// إنشاء Logger آمن أولاً
if (typeof Logger === 'undefined') {
  var Logger = {
    log: function() { try { console.log.apply(console, arguments); } catch(e) {} },
    warn: function() { try { console.warn.apply(console, arguments); } catch(e) {} },
    error: function() { try { console.error.apply(console, arguments); } catch(e) {} }
  };
}
if (typeof Logger.warn !== 'function') {
  Logger.warn = function(message) {
    Logger.log('[WARN] ' + message);
  };
}

var GAssistant = GAssistant || { System: {}, Utils: {} };
GAssistant.AI = GAssistant.AI || {};
GAssistant.Tools = GAssistant.Tools || {};
GAssistant.UI = GAssistant.UI || {};
GAssistant.Agents = GAssistant.Agents || {};

// Export to global scope
if (typeof global !== 'undefined') {
  global.GAssistant = GAssistant;
} else if (typeof window !== 'undefined') {
  window.GAssistant = GAssistant;
}

// نظام حقن التبعيات المحسن
GAssistant.Utils.Injector = {
  _moduleFactories: {},
  _moduleExports: {},
  _isInitialized: false,
  
  registerFactory: function(name, factory) {
    this._moduleFactories[name] = factory;
  },

  setExports: function(name, exports) {
    this._moduleExports[name] = exports;
  },

  get: function(...dependencyNames) {
    const resolved = {};
    dependencyNames.forEach(name => {
      const fullName = this._resolveShortNameToFull(name);
      if (this._moduleExports[fullName]) {
        resolved[name] = this._moduleExports[fullName];
      } else if (this._moduleExports[name]) { // Fallback for direct name
        resolved[name] = this._moduleExports[name];
      } else {
        // إنشاء fallback آمن
        resolved[name] = this._createFallback(name);
      }
    });
    return resolved;
  },

  _createFallback: function(name) {
    console.log(`⚠️ Using fallback for: ${name}`); // Use console.log as Logger might not be ready
    const fallback = {
      _isFallback: true,
      log: (msg) => Logger.log(`[${name}] ${msg}`),
      warn: (msg) => Logger.log(`[${name} WARN] ${msg}`),
      error: (msg) => Logger.log(`[${name} ERROR] ${msg}`),
      init: () => true,
      isReady: () => ({ status: 'fallback', name }),
      checkReady: () => false,
      handleRequest: () => ({ type: 'error', text: `${name} not available` }),
      get: (key) => null,
      set: () => true,
      ask: () => ({ type: 'error', text: `${name} not available` }),
      track: () => true,
      process: () => ({ success: false, error: `${name} not available` })
    };
    return fallback;
  },

  _resolveShortNameToFull: function(shortName) {
    const shortNameMap = {
      'Utils': 'System.Utils', 'Config': 'System.Config', 'AI': 'System.AI',
      'UI': 'System.UI', 'Tools': 'System.Tools', 'Telemetry': 'System.Telemetry',
      'DocsManager': 'System.DocsManager', 'Security': 'System.Security',
      'Memory': 'System.Memory', 'Tests': 'System.Tests', 'Dialogue': 'System.UI.Dialogue',
      'Orchestrator': 'System.AI.Orchestrator', 'JsonQuery': 'System.AI.JsonQuery',
      'CodeAssistance': 'System.AI.CodeAssistance', 'Context': 'System.AI.Context',
      'Router': 'System.Agents.Router', 'AgentsCatalog': 'System.Agents.Catalog',
      'DevAgent': 'System.AgentDeveloper', 'CFOAgent': 'System.AgentCFO',
      'GeneralAgent': 'System.AgentGeneral', 'MetricsLogger': 'System.MetricsLogger',
      'ModuleVerifier': 'System.Dev.ModuleVerifier', 'ProjectContextTracker': 'System.ProjectContextTracker',
      'Dispatcher': 'System.Dispatcher', 'ChartOfAccounts': 'System.Accounting.ChartOfAccounts',
      'Ledger': 'System.Accounting.Ledger', 'API': 'System.API.Endpoints'
    };
    const fullName = shortNameMap[shortName];
    if (fullName && this._moduleFactories[fullName]) {
      return fullName;
    }
    return shortName; // Return original name if no mapping found
  },

  buildAllModules: function() {
    // Ensure _moduleExports is initialized
    if (!this._moduleExports) {
      this._moduleExports = {};
      Logger.log('⚠️ _moduleExports was undefined, initialized to empty object');
    }
    
    const sorted = [];
    const visited = new Set(); // Modules whose sub-graph has been fully explored
    const visiting = new Set(); // Modules currently in the recursion stack for cycle detection
    const moduleNames = Object.keys(this._moduleFactories);

    const visit = (moduleName) => {
      if (visited.has(moduleName)) return;
      if (visiting.has(moduleName)) {
        Logger.warn(`Circular dependency detected involving: ${moduleName}. A fallback will be used.`);
        return; // Don't throw, allow fallback mechanism to handle it
      }
      
      visiting.add(moduleName);

      const factory = this._moduleFactories[moduleName];
      // Ensure factory is a function before extracting dependencies
      if (typeof factory === 'function') {
        const deps = this._extractDependencies(factory);
        for (const depName of deps) {
          const resolvedName = this._resolveShortNameToFull(depName);
          if (resolvedName && this._moduleFactories[resolvedName]) {
            visit(resolvedName);
          }
        }
      }

      visiting.delete(moduleName);
      visited.add(moduleName);
      sorted.push(moduleName);
    };

    moduleNames.forEach(visit);

    Logger.log(`🔧 Build order determined for ${sorted.length} modules.`);

    // Now, build the modules in the topologically sorted order
    for (const name of sorted) {
      try {
        const factory = this._moduleFactories[name];
        if (typeof factory !== 'function') {
          Logger.log(`❌ Failed to build ${name}: factory is not a function.`);
          this.setExports(name, this._createFallback(name));
          continue;
        }
        const deps = this._extractDependencies(factory);
        const resolvedDeps = this.get(...deps);
        const exports = factory(resolvedDeps);
        this.setExports(name, exports);
        this._attachToNamespace(name, exports);
        Logger.log(`✅ Built: ${name}`);
      } catch (e) {
        Logger.log(`❌ Failed to build ${name}: ${e.message}\nStack: ${e.stack}`);
        this.setExports(name, this._createFallback(name));
      }
    }

    this._isInitialized = true;
    Logger.log(`🎯 System initialized. ${Object.keys(this._moduleExports).length} modules are now available.`);
  },

  _extractDependencies: function(factory) {
    // This regex is more robust for different function/arrow function styles
    const fnStr = factory.toString();
    const match = fnStr.match(/^(?:async\s+)?(?:function\*?|\s*)\s*(?:\w*\s*)?\(((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*)\)\s*=>|function\s*\w*\s*\(((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*)\)/);
    if (!match) return [];
    
    const paramsStr = (match[1] || match[2] || '').trim();
    if (!paramsStr) return [];

    if (paramsStr.startsWith('{') && paramsStr.endsWith('}')) {
      return paramsStr.slice(1, -1).split(',').map(p => p.split(':')[0].trim()).filter(Boolean);
    }
    return paramsStr.split(',').map(p => p.trim()).filter(Boolean);
  },

  _attachToNamespace: function(name, exports) {
    const parts = name.split('.');
    let current = GAssistant;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] || {};
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = exports;
  }
};

// The global function to register a module factory. It only registers, it does not build.
(function() {
  if (typeof global !== 'undefined') {
    global.defineModule = function(name, factory) {
      GAssistant.Utils.Injector.registerFactory(name, factory);
    };
  } else if (typeof window !== 'undefined') {
    window.defineModule = function(name, factory) {
      GAssistant.Utils.Injector.registerFactory(name, factory);
    };
  } else {
    this.defineModule = function(name, factory) {
      GAssistant.Utils.Injector.registerFactory(name, factory);
    };
  }
})();

// تعريف الوحدة الأساسية Utils مباشرة لأنها ضرورية لعملية الإقلاع
const CoreUtils = {
  log: function(msg, ...args) { 
    if (typeof Logger !== 'undefined' && Logger.log) {
      Logger.log(`[Utils] ${msg}`, ...args);
    } else {
      console.log(`[Utils] ${msg}`, ...args);
    }
  },
  warn: (msg, ...args) => Logger.warn(`[Utils] ${msg}`, ...args),
  error: (msg, ...args) => Logger.error(`[Utils ERROR] ${msg}`, ...args),
  executeSafely: (fn, context, fallback = null) => {
    try { return fn(); } catch (e) { Logger.error(`Error in ${context}: ${e.message}\n${e.stack}`); return fallback; }
  },
  getSheet: (name, headers = []) => CoreUtils.executeSafely(() => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      if (headers.length > 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      }
    }
    return sheet;
  }, `getSheet: ${name}`, null),
  validateString: (value, name) => {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Validation Error: '${name}' must be a non-empty string.`);
    }
  },
  init: () => true
};

// تسجيل Utils مباشرة في النظام لأنها لا يمكن أن تنتظر البناء الطوبولوجي
GAssistant.Utils.Injector.setExports('System.Utils', CoreUtils);
GAssistant.Utils.Injector.registerFactory('System.Utils', () => CoreUtils);
GAssistant.System.Utils = CoreUtils;

// Export Utils.log to GAssistant.Utils for compatibility
GAssistant.Utils.log = CoreUtils.log;
GAssistant.Utils.warn = CoreUtils.warn;
GAssistant.Utils.error = CoreUtils.error;
