// نظام الوحدات المحسن - يدعم التحميل المرحلي
if (typeof Logger.warn !== 'function') {
  Logger.warn = function(message) {
    Logger.log('[WARN] ' + message);
  };
}

var GAssistant = GAssistant || {};
GAssistant.System = GAssistant.System || {};
GAssistant.Utils = GAssistant.Utils || {};
GAssistant.AI = GAssistant.AI || {};
GAssistant.Tools = GAssistant.Tools || {};
GAssistant.UI = GAssistant.UI || {};
GAssistant.Agents = GAssistant.Agents || {};

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
      if (this._moduleExports[name]) {
        resolved[name] = this._moduleExports[name];
      } else {
        // إنشاء fallback آمن
        resolved[name] = this._createFallback(name);
      }
    });
    return resolved;
  },

  _createFallback: function(name) {
    return {
      log: (msg) => Logger.log(`[${name}] ${msg}`),
      warn: (msg) => Logger.log(`[${name} WARN] ${msg}`),
      error: (msg) => Logger.log(`[${name} ERROR] ${msg}`),
      init: () => true,
      isReady: () => ({ status: 'fallback', name })
    };
  },

  buildAllModules: function() {
    const built = new Set();
    const building = new Set();

    const buildModule = (name) => {
      if (built.has(name)) return;
      if (building.has(name)) {
        Logger.warn(`Circular dependency detected: ${name}`);
        return;
      }

      const factory = this._moduleFactories[name];
      if (!factory) return;

      building.add(name);

      // استخراج التبعيات
      const deps = this._extractDependencies(factory);
      
      // بناء التبعيات أولاً
      deps.forEach(dep => buildModule(dep));

      // بناء الوحدة
      try {
        const resolvedDeps = this.get(...deps);
        const exports = factory(resolvedDeps);
        this.setExports(name, exports);
        this._attachToNamespace(name, exports);
        built.add(name);
        Logger.log(`✅ Built module: ${name}`);
      } catch (e) {
        Logger.log(`❌ Failed to build ${name}: ${e.message}`);
      }

      building.delete(name);
    };

    Object.keys(this._moduleFactories).forEach(buildModule);
    this._isInitialized = true;
  },

  _extractDependencies: function(factory) {
    const fnStr = factory.toString();
    const match = fnStr.match(/\(([^)]*)\)/);
    if (!match) return [];
    
    const params = match[1].trim();
    if (!params) return [];
    
    if (params.startsWith('{') && params.endsWith('}')) {
      return params.slice(1, -1).split(',').map(p => p.split(':')[0].trim());
    }
    
    return params.split(',').map(p => p.trim()).filter(p => p);
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

// دالة defineModule المحسنة - تسجيل فقط
this.defineModule = function(name, factory) {
  GAssistant.Utils.Injector.registerFactory(name, factory);
};

// تعريف System.Utils مباشرة (حالة خاصة)
const utilsExports = {
  log: function(message, data) {
    try {
      Logger.log(`[Utils] ${message}${data ? ' ' + JSON.stringify(data, null, 2) : ''}`);
    } catch (e) {
      console.log(`[Utils] ${message}${data ? ' ' + JSON.stringify(data, null, 2) : ''}`);
    }
  },

  warn: function(message, data) {
    try {
      Logger.warn(`[Utils] ${message}${data ? ' ' + JSON.stringify(data, null, 2) : ''}`);
    } catch (e) {
      console.warn(`[Utils] ${message}${data ? ' ' + JSON.stringify(data, null, 2) : ''}`);
    }
  },

  error: function(message, errorObj) {
    try {
      Logger.log(`[Utils ERROR] ${message}${errorObj ? ' ' + (errorObj.stack || errorObj.message) : ''}`);
    } catch (e) {
      console.error(`[Utils ERROR] ${message}${errorObj ? ' ' + (errorObj.stack || errorObj.message) : ''}`);
    }
  },

  executeSafely: function(fn, context, fallbackValue = null) {
    try {
      return fn();
    } catch (e) {
      this.error(`Error in ${context || 'unknown context'}`, e);
      return fallbackValue;
    }
  },

  getSheet: function(name, headers = []) {
    if (typeof name !== 'string' || !name.trim()) {
      this.error(`Invalid sheet name: "${name}"`);
      return null;
    }

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
  },

  validateString: function(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Validation Error: '${name}' must be a non-empty string.`);
    }
  },

  init: function() {
    this.log('System.Utils initialized successfully');
    return true;
  },

  isReady: function() {
    return {
      status: 'ready',
      dependencies: [],
      lastCheck: new Date(),
      message: 'Core utilities are always ready'
    };
  }
};

// تسجيل Utils مباشرة
GAssistant.Utils.Injector.setExports('System.Utils', utilsExports);
GAssistant.System.Utils = utilsExports;
GAssistant.Utils.Utils = utilsExports;