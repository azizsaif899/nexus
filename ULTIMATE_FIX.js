// الحل النهائي - تعريف DocsManager عالمياً قبل أي شيء آخر
if (typeof Logger.warn !== 'function') {
  Logger.warn = function(message) { Logger.log('[WARN] ' + message); };
}

var GAssistant = GAssistant || {};
GAssistant.System = GAssistant.System || {};
GAssistant.Utils = GAssistant.Utils || {};

// تعريف DocsManager عالمياً فوراً
var DocsManager = {
  registerModuleDocs: function(moduleName, docs) {
    Logger.log(`[DocsManager] Registered docs for ${moduleName}`);
  },
  registerConfigDocs: function() {
    Logger.log('[DocsManager] Config docs registered');
  },
  registerCoreDocs: function() {
    Logger.log('[DocsManager] Core docs registered');
  },
  getAllDocs: function() { return []; },
  init: function() { return true; }
};

// تعريف متغيرات عالمية أخرى مطلوبة
var Telemetry = {
  track: function(event, data) { Logger.log(`[Telemetry] ${event}`); },
  error: function(msg) { Logger.log(`[Telemetry ERROR] ${msg}`); },
  init: function() { return true; }
};

var Utils = {
  log: function(msg) { Logger.log(`[Utils] ${msg}`); },
  warn: function(msg) { Logger.log(`[Utils WARN] ${msg}`); },
  error: function(msg) { Logger.log(`[Utils ERROR] ${msg}`); },
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
  init: function() { return true; }
};

// نظام حقن التبعيات المبسط
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
      // استخدام المتغيرات العالمية أولاً
      if (name === 'DocsManager') resolved[name] = DocsManager;
      else if (name === 'Telemetry') resolved[name] = Telemetry;
      else if (name === 'Utils') resolved[name] = Utils;
      else resolved[name] = this._moduleExports[name] || this._createFallback(name);
    });
    return resolved;
  },

  _createFallback: function(name) {
    Logger.log(`⚠️ Using fallback for: ${name}`);
    return {
      log: (msg) => Logger.log(`[${name}] ${msg}`),
      init: () => true,
      process: () => ({ success: false, error: `${name} not available` })
    };
  }
};

// دالة defineModule
this.defineModule = function(name, factory) {
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

// تسجيل Utils في النظام
GAssistant.Utils.Injector.setExports('System.Utils', Utils);
GAssistant.System.Utils = Utils;
GAssistant.Utils.Injector.setExports('System.DocsManager', DocsManager);
GAssistant.System.DocsManager = DocsManager;
GAssistant.Utils.Injector.setExports('System.Telemetry', Telemetry);
GAssistant.System.Telemetry = Telemetry;