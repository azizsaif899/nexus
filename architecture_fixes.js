/**
 * @file architecture_fixes.js
 * @description إصلاحات المعمارية والبنية لمشروع G-Assistant
 * @version 1.0.0
 * @author عبدالعزيز
 */

// ===== 1. محسن تحميل الوحدات =====

/**
 * محسن تحميل الوحدات مع حل التبعيات الدائرية
 */
class EnhancedModuleLoader {
  constructor() {
    this.modules = new Map();
    this.loadingPromises = new Map();
    this.dependencyGraph = new Map();
    this.loadOrder = [];
    this.circularDependencies = new Set();
  }

  /**
   * تسجيل وحدة جديدة
   */
  registerModule(name, dependencies, factory) {
    this.dependencyGraph.set(name, {
      dependencies: dependencies || [],
      factory,
      loaded: false,
      loading: false
    });
  }

  /**
   * حل التبعيات الدائرية
   */
  resolveDependencies() {
    const visited = new Set();
    const visiting = new Set();
    const resolved = [];

    const visit = (moduleName) => {
      if (visiting.has(moduleName)) {
        this.circularDependencies.add(moduleName);
        console.warn(`Circular dependency detected: ${moduleName}`);
        return;
      }

      if (visited.has(moduleName)) {
        return;
      }

      visiting.add(moduleName);
      
      const moduleInfo = this.dependencyGraph.get(moduleName);
      if (moduleInfo) {
        moduleInfo.dependencies.forEach(dep => visit(dep));
      }

      visiting.delete(moduleName);
      visited.add(moduleName);
      resolved.push(moduleName);
    };

    Array.from(this.dependencyGraph.keys()).forEach(visit);
    this.loadOrder = resolved;
    
    return {
      loadOrder: resolved,
      circularDependencies: Array.from(this.circularDependencies)
    };
  }

  /**
   * تحميل وحدة واحدة
   */
  async loadModule(name) {
    if (this.modules.has(name)) {
      return this.modules.get(name);
    }

    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    const moduleInfo = this.dependencyGraph.get(name);
    if (!moduleInfo) {
      throw new Error(`Module ${name} not registered`);
    }

    const loadPromise = this._loadModuleInternal(name, moduleInfo);
    this.loadingPromises.set(name, loadPromise);

    try {
      const module = await loadPromise;
      this.modules.set(name, module);
      this.loadingPromises.delete(name);
      return module;
    } catch (error) {
      this.loadingPromises.delete(name);
      throw error;
    }
  }

  async _loadModuleInternal(name, moduleInfo) {
    if (moduleInfo.loading) {
      throw new Error(`Circular loading detected for module: ${name}`);
    }

    moduleInfo.loading = true;

    try {
      // تحميل التبعيات أولاً
      const dependencies = {};
      for (const depName of moduleInfo.dependencies) {
        dependencies[depName] = await this.loadModule(depName);
      }

      // تنفيذ factory function
      const module = moduleInfo.factory(dependencies);
      moduleInfo.loaded = true;
      moduleInfo.loading = false;

      console.log(`✅ Module ${name} loaded successfully`);
      return module;
    } catch (error) {
      moduleInfo.loading = false;
      console.error(`❌ Failed to load module ${name}:`, error.message);
      throw error;
    }
  }

  /**
   * تحميل جميع الوحدات
   */
  async loadAllModules() {
    const { loadOrder, circularDependencies } = this.resolveDependencies();
    
    if (circularDependencies.length > 0) {
      console.warn('Circular dependencies detected:', circularDependencies);
    }

    const results = [];
    for (const moduleName of loadOrder) {
      try {
        const module = await this.loadModule(moduleName);
        results.push({ name: moduleName, success: true, module });
      } catch (error) {
        results.push({ name: moduleName, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * الحصول على وحدة محملة
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * فحص حالة الوحدات
   */
  getModuleStatus() {
    const status = {
      total: this.dependencyGraph.size,
      loaded: this.modules.size,
      loading: this.loadingPromises.size,
      failed: 0,
      modules: {}
    };

    this.dependencyGraph.forEach((info, name) => {
      status.modules[name] = {
        loaded: this.modules.has(name),
        loading: this.loadingPromises.has(name),
        dependencies: info.dependencies
      };
    });

    return status;
  }
}

// ===== 2. نظام حقن التبعيات محسن =====

/**
 * نظام حقن تبعيات محسن مع دعم Singleton و Factory
 */
class EnhancedDependencyInjector {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
    this.resolving = new Set();
  }

  /**
   * تسجيل خدمة كـ Singleton
   */
  registerSingleton(name, factory, dependencies = []) {
    this.services.set(name, {
      type: 'singleton',
      factory,
      dependencies,
      instance: null
    });
  }

  /**
   * تسجيل خدمة كـ Factory
   */
  registerFactory(name, factory, dependencies = []) {
    this.services.set(name, {
      type: 'factory',
      factory,
      dependencies
    });
  }

  /**
   * تسجيل قيمة ثابتة
   */
  registerValue(name, value) {
    this.services.set(name, {
      type: 'value',
      value
    });
  }

  /**
   * حل خدمة
   */
  resolve(name) {
    if (this.resolving.has(name)) {
      throw new Error(`Circular dependency detected while resolving: ${name}`);
    }

    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }

    switch (service.type) {
      case 'value':
        return service.value;

      case 'singleton':
        if (service.instance) {
          return service.instance;
        }
        service.instance = this._createInstance(name, service);
        return service.instance;

      case 'factory':
        return this._createInstance(name, service);

      default:
        throw new Error(`Unknown service type: ${service.type}`);
    }
  }

  _createInstance(name, service) {
    this.resolving.add(name);

    try {
      // حل التبعيات
      const dependencies = {};
      service.dependencies.forEach(depName => {
        dependencies[depName] = this.resolve(depName);
      });

      // إنشاء المثيل
      const instance = service.factory(dependencies);
      this.resolving.delete(name);
      
      return instance;
    } catch (error) {
      this.resolving.delete(name);
      throw new Error(`Failed to create instance of ${name}: ${error.message}`);
    }
  }

  /**
   * فحص ما إذا كانت الخدمة مسجلة
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * إزالة خدمة
   */
  unregister(name) {
    this.services.delete(name);
    this.singletons.delete(name);
  }

  /**
   * الحصول على قائمة الخدمات المسجلة
   */
  getRegisteredServices() {
    return Array.from(this.services.keys());
  }
}

// ===== 3. مدير الأحداث المحسن =====

/**
 * نظام إدارة الأحداث مع دعم async/await
 */
class EnhancedEventManager {
  constructor() {
    this.listeners = new Map();
    this.onceListeners = new Map();
    this.maxListeners = 100;
  }

  /**
   * إضافة مستمع للحدث
   */
  on(eventName, listener) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    const listeners = this.listeners.get(eventName);
    if (listeners.length >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) exceeded for event: ${eventName}`);
    }

    listeners.push(listener);
    return this;
  }

  /**
   * إضافة مستمع يعمل مرة واحدة فقط
   */
  once(eventName, listener) {
    if (!this.onceListeners.has(eventName)) {
      this.onceListeners.set(eventName, []);
    }

    this.onceListeners.get(eventName).push(listener);
    return this;
  }

  /**
   * إزالة مستمع
   */
  off(eventName, listener) {
    if (this.listeners.has(eventName)) {
      const listeners = this.listeners.get(eventName);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * إطلاق حدث
   */
  async emit(eventName, ...args) {
    const results = [];

    // تنفيذ المستمعين العاديين
    if (this.listeners.has(eventName)) {
      const listeners = this.listeners.get(eventName);
      for (const listener of listeners) {
        try {
          const result = await listener(...args);
          results.push({ success: true, result });
        } catch (error) {
          results.push({ success: false, error: error.message });
          console.error(`Event listener error for ${eventName}:`, error);
        }
      }
    }

    // تنفيذ المستمعين لمرة واحدة
    if (this.onceListeners.has(eventName)) {
      const onceListeners = this.onceListeners.get(eventName);
      this.onceListeners.delete(eventName); // إزالة قبل التنفيذ

      for (const listener of onceListeners) {
        try {
          const result = await listener(...args);
          results.push({ success: true, result });
        } catch (error) {
          results.push({ success: false, error: error.message });
          console.error(`Once event listener error for ${eventName}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * إزالة جميع المستمعين لحدث معين
   */
  removeAllListeners(eventName) {
    if (eventName) {
      this.listeners.delete(eventName);
      this.onceListeners.delete(eventName);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
    return this;
  }

  /**
   * الحصول على عدد المستمعين لحدث معين
   */
  listenerCount(eventName) {
    const regular = this.listeners.get(eventName)?.length || 0;
    const once = this.onceListeners.get(eventName)?.length || 0;
    return regular + once;
  }
}

// ===== 4. مدير الحالة المحسن =====

/**
 * مدير حالة مع دعم التفاعل والتاريخ
 */
class EnhancedStateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.history = [{ ...initialState }];
    this.maxHistorySize = 50;
    this.subscribers = new Map();
    this.middleware = [];
  }

  /**
   * الحصول على الحالة الحالية
   */
  getState() {
    return { ...this.state };
  }

  /**
   * تحديث الحالة
   */
  setState(updates, description = 'State update') {
    const prevState = { ...this.state };
    const newState = { ...this.state, ...updates };

    // تطبيق middleware
    let finalState = newState;
    for (const middleware of this.middleware) {
      finalState = middleware(finalState, prevState, updates) || finalState;
    }

    this.state = finalState;

    // إضافة للتاريخ
    this.history.push({
      state: { ...finalState },
      timestamp: new Date().toISOString(),
      description,
      changes: updates
    });

    // تحديد حجم التاريخ
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // إشعار المشتركين
    this._notifySubscribers(finalState, prevState, updates);

    return finalState;
  }

  /**
   * الاشتراك في تغييرات الحالة
   */
  subscribe(callback, selector = null) {
    const id = Date.now() + Math.random();
    this.subscribers.set(id, { callback, selector });

    // إرجاع دالة إلغاء الاشتراك
    return () => {
      this.subscribers.delete(id);
    };
  }

  /**
   * إضافة middleware
   */
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * التراجع عن آخر تغيير
   */
  undo() {
    if (this.history.length > 1) {
      this.history.pop(); // إزالة الحالة الحالية
      const prevState = this.history[this.history.length - 1];
      this.state = { ...prevState.state };
      this._notifySubscribers(this.state, {}, {});
      return this.state;
    }
    return null;
  }

  /**
   * الحصول على تاريخ التغييرات
   */
  getHistory() {
    return [...this.history];
  }

  _notifySubscribers(newState, prevState, changes) {
    this.subscribers.forEach(({ callback, selector }) => {
      try {
        if (selector) {
          const selectedNew = selector(newState);
          const selectedPrev = selector(prevState);
          if (JSON.stringify(selectedNew) !== JSON.stringify(selectedPrev)) {
            callback(selectedNew, selectedPrev, changes);
          }
        } else {
          callback(newState, prevState, changes);
        }
      } catch (error) {
        console.error('State subscriber error:', error);
      }
    });
  }
}

// ===== 5. مدير الذاكرة المحسن =====

/**
 * مدير ذاكرة محسن مع تنظيف تلقائي
 */
class EnhancedMemoryManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.accessTimes = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 30 * 60 * 1000; // 30 دقيقة
    this.cleanupInterval = options.cleanupInterval || 5 * 60 * 1000; // 5 دقائق

    // بدء التنظيف التلقائي
    this.startCleanup();
  }

  /**
   * حفظ في الذاكرة
   */
  set(key, value, customTtl = null) {
    // تنظيف إذا تجاوز الحد الأقصى
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const now = Date.now();
    const expiresAt = now + (customTtl || this.ttl);

    this.cache.set(key, {
      value,
      createdAt: now,
      expiresAt,
      accessCount: 0
    });

    this.accessTimes.set(key, now);
  }

  /**
   * الحصول من الذاكرة
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    const now = Date.now();
    
    // فحص انتهاء الصلاحية
    if (now > item.expiresAt) {
      this.delete(key);
      return null;
    }

    // تحديث إحصائيات الوصول
    item.accessCount++;
    this.accessTimes.set(key, now);

    return item.value;
  }

  /**
   * حذف من الذاكرة
   */
  delete(key) {
    this.cache.delete(key);
    this.accessTimes.delete(key);
  }

  /**
   * فحص وجود مفتاح
   */
  has(key) {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    // فحص انتهاء الصلاحية
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * تنظيف الذاكرة
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    // حذف العناصر المنتهية الصلاحية
    this.cache.forEach((item, key) => {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    });

    // إذا لم يكن هناك عناصر منتهية الصلاحية، احذف الأقل استخداماً
    if (keysToDelete.length === 0 && this.cache.size >= this.maxSize) {
      const sortedByAccess = Array.from(this.cache.entries())
        .sort((a, b) => a[1].accessCount - b[1].accessCount);
      
      const toRemove = Math.floor(this.maxSize * 0.1); // احذف 10%
      for (let i = 0; i < toRemove && i < sortedByAccess.length; i++) {
        keysToDelete.push(sortedByAccess[i][0]);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`Memory cleanup: removed ${keysToDelete.length} items`);
    }
  }

  /**
   * بدء التنظيف التلقائي
   */
  startCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * إيقاف التنظيف التلقائي
   */
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * الحصول على إحصائيات الذاكرة
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let totalAccess = 0;

    this.cache.forEach(item => {
      if (now > item.expiresAt) {
        expired++;
      }
      totalAccess += item.accessCount;
    });

    return {
      totalItems: this.cache.size,
      maxSize: this.maxSize,
      expired,
      totalAccess,
      hitRate: totalAccess / Math.max(this.cache.size, 1)
    };
  }

  /**
   * مسح جميع البيانات
   */
  clear() {
    this.cache.clear();
    this.accessTimes.clear();
  }
}

// ===== 6. تطبيق الإصلاحات =====

/**
 * دالة لتطبيق الإصلاحات المعمارية
 */
function applyArchitectureFixes() {
  try {
    console.log('🔧 Applying architecture fixes...');

    // إنشاء المثيلات العامة
    if (typeof window !== 'undefined') {
      window.EnhancedModuleLoader = new EnhancedModuleLoader();
      window.EnhancedDI = new EnhancedDependencyInjector();
      window.EnhancedEvents = new EnhancedEventManager();
      window.EnhancedState = new EnhancedStateManager();
      window.EnhancedMemory = new EnhancedMemoryManager();
    }

    // تحسين النظام الحالي إذا كان متاحاً
    if (typeof GAssistant !== 'undefined') {
      // استبدال نظام الوحدات القديم
      if (GAssistant.Utils && GAssistant.Utils.Injector) {
        const oldInjector = GAssistant.Utils.Injector;
        GAssistant.Utils.Injector = window.EnhancedDI;
        
        // نقل الخدمات المسجلة
        if (oldInjector.services) {
          Object.keys(oldInjector.services).forEach(name => {
            const service = oldInjector.services[name];
            window.EnhancedDI.registerSingleton(name, service.factory, service.dependencies);
          });
        }
      }

      // إضافة نظام الأحداث
      GAssistant.Events = window.EnhancedEvents;
      
      // إضافة مدير الحالة
      GAssistant.State = window.EnhancedState;
      
      // إضافة مدير الذاكرة
      GAssistant.Memory = window.EnhancedMemory;
    }

    console.log('✅ Architecture fixes applied successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to apply architecture fixes:', error);
    return false;
  }
}

/**
 * دالة لفحص صحة المعمارية
 */
function runArchitectureAudit() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: [],
    score: 0,
    maxScore: 0
  };

  const checks = [
    {
      name: 'Enhanced Module Loader',
      check: () => typeof EnhancedModuleLoader !== 'undefined'
    },
    {
      name: 'Enhanced Dependency Injection',
      check: () => typeof EnhancedDependencyInjector !== 'undefined'
    },
    {
      name: 'Enhanced Event Manager',
      check: () => typeof EnhancedEventManager !== 'undefined'
    },
    {
      name: 'Enhanced State Manager',
      check: () => typeof EnhancedStateManager !== 'undefined'
    },
    {
      name: 'Enhanced Memory Manager',
      check: () => typeof EnhancedMemoryManager !== 'undefined'
    },
    {
      name: 'GAssistant Integration',
      check: () => {
        return typeof GAssistant !== 'undefined' && 
               GAssistant.Events && 
               GAssistant.State && 
               GAssistant.Memory;
      }
    }
  ];

  checks.forEach(checkItem => {
    results.maxScore++;
    try {
      const passed = checkItem.check();
      results.checks.push({
        name: checkItem.name,
        passed,
        status: passed ? 'PASS' : 'FAIL'
      });
      if (passed) results.score++;
    } catch (error) {
      results.checks.push({
        name: checkItem.name,
        passed: false,
        status: 'ERROR',
        error: error.message
      });
    }
  });

  const percentage = Math.round((results.score / results.maxScore) * 100);
  results.percentage = percentage;
  results.grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'F';

  console.log(`Architecture audit completed: ${results.score}/${results.maxScore} (${percentage}%)`);
  return results;
}

// ===== تصدير الوحدات =====

if (typeof defineModule === 'function') {
  defineModule('System.Architecture.Fixes', () => ({
    EnhancedModuleLoader,
    EnhancedDependencyInjector,
    EnhancedEventManager,
    EnhancedStateManager,
    EnhancedMemoryManager,
    applyArchitectureFixes,
    runArchitectureAudit
  }));
} else {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      EnhancedModuleLoader,
      EnhancedDependencyInjector,
      EnhancedEventManager,
      EnhancedStateManager,
      EnhancedMemoryManager,
      applyArchitectureFixes,
      runArchitectureAudit
    };
  }
}

// تطبيق الإصلاحات تلقائياً
if (typeof SpreadsheetApp !== 'undefined') {
  applyArchitectureFixes();
}