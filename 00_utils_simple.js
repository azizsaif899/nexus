// نظام الوحدات المبسط
if (typeof Logger.warn !== 'function') {
  Logger.warn = function(message) {
    Logger.log('[WARN] ' + message);
  };
}

var GAssistant = GAssistant || {};
GAssistant.System = GAssistant.System || {};
GAssistant.Utils = GAssistant.Utils || {};

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
      resolved[name] = this._moduleExports[name] || this._createFallback(name);
    });
    return resolved;
  },

  _createFallback: function(name) {
    return {
      log: (msg) => Logger.log(`[${name}] ${msg}`),
      init: () => true
    };
  }
};

// دالة defineModule - تسجيل فقط
this.defineModule = function(name, factory) {
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

// تعريف System.Utils مباشرة
const utilsExports = {
  log: function(message) {
    Logger.log(`[Utils] ${message}`);
  },
  warn: function(message) {
    Logger.log(`[Utils WARN] ${message}`);
  },
  error: function(message) {
    Logger.log(`[Utils ERROR] ${message}`);
  },
  init: () => true
};

GAssistant.Utils.Injector.setExports('System.Utils', utilsExports);
GAssistant.System.Utils = utilsExports;