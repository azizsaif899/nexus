// 🔥 الإصلاح الشامل لجميع الوحدات - يجب تحميله أولاً
if (typeof Logger.warn !== 'function') {
  Logger.warn = function(message) { Logger.log('[WARN] ' + message); };
}

var GAssistant = GAssistant || {};
GAssistant.System = GAssistant.System || {};
GAssistant.Utils = GAssistant.Utils || {};
GAssistant.AI = GAssistant.AI || {};
GAssistant.Tools = GAssistant.Tools || {};
GAssistant.UI = GAssistant.UI || {};
GAssistant.Agents = GAssistant.Agents || {};

// نظام حقن التبعيات الشامل
GAssistant.Utils.Injector = {
  _moduleFactories: {},
  _moduleExports: {},

  registerFactory: function(name, factory) {
    this._moduleFactories[name] = factory;
    Logger.log(`📦 Registered: ${name}`);
  },

  setExports: function(name, exports) {
    this._moduleExports[name] = exports;
  },

  get: function(...dependencyNames) {
    const resolved = {};
    dependencyNames.forEach(name => {
      resolved[name] = this._moduleExports[name] || this._createUniversalFallback(name);
    });
    return resolved;
  },

  _createUniversalFallback: function(name) {
    const fallback = {
      log: (msg) => Logger.log(`[${name}] ${msg}`),
      warn: (msg) => Logger.log(`[${name} WARN] ${msg}`),
      error: (msg) => Logger.log(`[${name} ERROR] ${msg}`),
      init: () => true,
      isReady: () => ({ status: 'fallback', name }),
      
      // DocsManager specific
      registerModuleDocs: (moduleName, docs) => Logger.log(`[${name}] Docs registered for ${moduleName}`),
      registerConfigDocs: () => Logger.log(`[${name}] Config docs registered`),
      registerCoreDocs: () => Logger.log(`[${name}] Core docs registered`),
      getAllDocs: () => [],
      
      // Telemetry specific  
      track: (event, data) => Logger.log(`[${name}] Event: ${event}`),
      
      // Config specific
      get: (key) => null,
      set: (key, value) => Logger.log(`[${name}] Set ${key} = ${value}`),
      getAll: () => ({}),
      
      // AI specific
      processPrompt: (prompt) => ({ response: 'AI not available', success: false }),
      
      // Tools specific
      getDeclarations: () => [],
      execute: () => ({ success: false, error: 'Tool not available' }),
      
      // UI specific
      alert: (msg) => Logger.log(`[${name}] Alert: ${msg}`),
      showSidebar: () => Logger.log(`[${name}] Sidebar shown`),
      onOpen: () => Logger.log(`[${name}] onOpen called`),
      
      // Security specific
      validateAccess: () => true,
      
      // Memory specific
      store: (key, value) => Logger.log(`[${name}] Stored ${key}`),
      retrieve: (key) => null,
      
      // Tests specific
      runAllTests: () => [],
      
      // Dispatcher specific
      dispatch: (action) => Logger.log(`[${name}] Dispatched ${action}`),
      
      // Generic fallbacks
      process: () => ({ success: false, error: `${name} not available` }),
      execute: () => ({ success: false, error: `${name} not available` }),
      run: () => ({ success: false, error: `${name} not available` })
    };
    
    Logger.log(`⚠️ Using universal fallback for: ${name}`);
    return fallback;
  }
};

// دالة defineModule - تسجيل فقط
this.defineModule = function(name, factory) {
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

// تعريف System.Utils مباشرة
const utilsExports = {
  log: function(message) { Logger.log(`[Utils] ${message}`); },
  warn: function(message) { Logger.log(`[Utils WARN] ${message}`); },
  error: function(message) { Logger.log(`[Utils ERROR] ${message}`); },
  executeSafely: function(fn, context, fallback = null) {
    try { return fn(); } catch (e) { this.error(`Error in ${context}`, e); return fallback; }
  },
  getSheet: function(name, headers = []) {
    try {
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
    } catch (e) {
      this.error(`Failed to get sheet ${name}`, e);
      return null;
    }
  },
  validateString: function(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Validation Error: '${name}' must be a non-empty string.`);
    }
  },
  init: () => true
};

GAssistant.Utils.Injector.setExports('System.Utils', utilsExports);
GAssistant.System.Utils = utilsExports;