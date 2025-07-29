/**
 * سجل الدوال المركزي - تتبع وتوثيق جميع دوال النظام
 * @fileoverview Central function registry for systematic documentation
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.FunctionRegistry', function(injector) {
  
  return {
    /**
     * تسجيل دالة في السجل المركزي
     * @param {Object} functionInfo - معلومات الدالة
     * @param {string} functionInfo.name - اسم الدالة
     * @param {string} functionInfo.module - الوحدة التابعة لها
     * @param {string} functionInfo.description - وصف الدالة
     * @param {Array} functionInfo.parameters - معاملات الدالة
     * @param {string} functionInfo.returnType - نوع القيمة المرجعة
     * @param {string} functionInfo.example - مثال الاستخدام
     * @returns {boolean} نجح التسجيل أم لا
     * @example
     * registry.registerFunction({
     *   name: 'processData',
     *   module: 'System.DataProcessor',
     *   description: 'معالجة البيانات المدخلة',
     *   parameters: [{ name: 'data', type: 'Object', description: 'البيانات' }],
     *   returnType: 'Object',
     *   example: 'processData({ input: "test" })'
     * });
     * @since 3.0.0
     */
    registerFunction(functionInfo) {
      try {
        const registry = this.getRegistry();
        const functionId = `${functionInfo.module}.${functionInfo.name}`;
        
        registry[functionId] = {
          ...functionInfo,
          id: functionId,
          registeredAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          callCount: 0,
          version: this.extractVersion(functionInfo.module)
        };
        
        this.saveRegistry(registry);
        return true;
        
      } catch (error) {
        console.error('فشل في تسجيل الدالة:', error);
        return false;
      }
    },

    /**
     * تحديث معلومات دالة موجودة
     * @param {string} functionId - معرف الدالة
     * @param {Object} updates - التحديثات
     * @returns {boolean} نجح التحديث أم لا
     * @since 3.0.0
     */
    updateFunction(functionId, updates) {
      try {
        const registry = this.getRegistry();
        
        if (registry[functionId]) {
          registry[functionId] = {
            ...registry[functionId],
            ...updates,
            lastUpdated: new Date().toISOString()
          };
          
          this.saveRegistry(registry);
          return true;
        }
        
        return false;
        
      } catch (error) {
        console.error('فشل في تحديث الدالة:', error);
        return false;
      }
    },

    /**
     * تسجيل استدعاء دالة
     * @param {string} functionId - معرف الدالة
     * @param {Object} callInfo - معلومات الاستدعاء
     * @since 3.0.0
     */
    recordFunctionCall(functionId, callInfo = {}) {
      try {
        const registry = this.getRegistry();
        
        if (registry[functionId]) {
          registry[functionId].callCount = (registry[functionId].callCount || 0) + 1;
          registry[functionId].lastCalled = new Date().toISOString();
          
          // تسجيل تفاصيل الاستدعاء
          if (!registry[functionId].callHistory) {
            registry[functionId].callHistory = [];
          }
          
          registry[functionId].callHistory.push({
            timestamp: new Date().toISOString(),
            ...callInfo
          });
          
          // الاحتفاظ بآخر 10 استدعاءات فقط
          if (registry[functionId].callHistory.length > 10) {
            registry[functionId].callHistory.splice(0, 1);
          }
          
          this.saveRegistry(registry);
        }
        
      } catch (error) {
        console.error('فشل في تسجيل الاستدعاء:', error);
      }
    },

    /**
     * البحث في السجل
     * @param {Object} criteria - معايير البحث
     * @param {string} criteria.module - اسم الوحدة
     * @param {string} criteria.name - اسم الدالة
     * @param {string} criteria.description - كلمات في الوصف
     * @returns {Array} قائمة الدوال المطابقة
     * @example
     * const functions = registry.searchFunctions({ module: 'System.DataProcessor' });
     * @since 3.0.0
     */
    searchFunctions(criteria) {
      try {
        const registry = this.getRegistry();
        const functions = Object.values(registry);
        
        return functions.filter(func => {
          if (criteria.module && !func.module.includes(criteria.module)) return false;
          if (criteria.name && !func.name.includes(criteria.name)) return false;
          if (criteria.description && !func.description.includes(criteria.description)) return false;
          return true;
        });
        
      } catch (error) {
        console.error('فشل في البحث:', error);
        return [];
      }
    },

    /**
     * الحصول على إحصائيات السجل
     * @returns {Object} إحصائيات شاملة
     * @since 3.0.0
     */
    getRegistryStats() {
      try {
        const registry = this.getRegistry();
        const functions = Object.values(registry);
        
        const stats = {
          totalFunctions: functions.length,
          moduleDistribution: {},
          mostCalled: null,
          leastCalled: null,
          totalCalls: 0,
          averageCallsPerFunction: 0
        };
        
        functions.forEach(func => {
          // توزيع الوحدات
          stats.moduleDistribution[func.module] = 
            (stats.moduleDistribution[func.module] || 0) + 1;
          
          // إجمالي الاستدعاءات
          stats.totalCalls += func.callCount || 0;
          
          // الأكثر والأقل استدعاءً
          if (!stats.mostCalled || func.callCount > stats.mostCalled.callCount) {
            stats.mostCalled = func;
          }
          if (!stats.leastCalled || func.callCount < stats.leastCalled.callCount) {
            stats.leastCalled = func;
          }
        });
        
        stats.averageCallsPerFunction = functions.length > 0 ? 
          Math.round(stats.totalCalls / functions.length) : 0;
        
        return stats;
        
      } catch (error) {
        console.error('فشل في جلب الإحصائيات:', error);
        return { totalFunctions: 0, totalCalls: 0 };
      }
    },

    /**
     * مسح السجل من الدوال غير المستخدمة
     * @param {number} daysUnused - عدد الأيام بدون استخدام
     * @returns {number} عدد الدوال المحذوفة
     * @since 3.0.0
     */
    cleanupUnusedFunctions(daysUnused = 30) {
      try {
        const registry = this.getRegistry();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysUnused);
        
        let deletedCount = 0;
        
        Object.keys(registry).forEach(functionId => {
          const func = registry[functionId];
          const lastUsed = new Date(func.lastCalled || func.registeredAt);
          
          if (lastUsed < cutoffDate && (func.callCount || 0) === 0) {
            delete registry[functionId];
            deletedCount++;
          }
        });
        
        this.saveRegistry(registry);
        return deletedCount;
        
      } catch (error) {
        console.error('فشل في تنظيف السجل:', error);
        return 0;
      }
    },

    /**
     * الحصول على السجل الكامل
     * @returns {Object} السجل الكامل
     * @private
     */
    getRegistry() {
      try {
        const savedRegistry = PropertiesService.getScriptProperties()
          .getProperty('function_registry');
        return savedRegistry ? JSON.parse(savedRegistry) : {};
      } catch (error) {
        console.error('فشل في تحميل السجل:', error);
        return {};
      }
    },

    /**
     * حفظ السجل
     * @param {Object} registry - السجل
     * @private
     */
    saveRegistry(registry) {
      try {
        PropertiesService.getScriptProperties().setProperty(
          'function_registry',
          JSON.stringify(registry)
        );
      } catch (error) {
        console.error('فشل في حفظ السجل:', error);
      }
    },

    /**
     * استخراج رقم الإصدار من الوحدة
     * @param {string} moduleName - اسم الوحدة
     * @returns {string} رقم الإصدار
     * @private
     */
    extractVersion(moduleName) {
      try {
        const module = injector.get(moduleName);
        return module.version || '1.0.0';
      } catch (error) {
        return '1.0.0';
      }
    }
  };
});

/**
 * دوال عامة لإدارة السجل
 */

/**
 * تسجيل دالة في السجل المركزي
 * @param {Object} functionInfo - معلومات الدالة
 * @returns {boolean} نجح التسجيل أم لا
 * @example
 * registerFunction({
 *   name: 'processData',
 *   module: 'System.DataProcessor',
 *   description: 'معالجة البيانات'
 * });
 * @since 3.0.0
 */
function registerFunction(functionInfo) {
  try {
    const registry = GAssistant.Utils.Injector.get('Utils.FunctionRegistry');
    return registry.registerFunction(functionInfo);
  } catch (error) {
    console.error('فشل في تسجيل الدالة:', error);
    return false;
  }
}

/**
 * تسجيل استدعاء دالة
 * @param {string} functionId - معرف الدالة
 * @param {Object} callInfo - معلومات الاستدعاء
 * @example
 * recordFunctionCall('System.DataProcessor.processData', { duration: 150 });
 * @since 3.0.0
 */
function recordFunctionCall(functionId, callInfo = {}) {
  try {
    const registry = GAssistant.Utils.Injector.get('Utils.FunctionRegistry');
    registry.recordFunctionCall(functionId, callInfo);
  } catch (error) {
    console.error('فشل في تسجيل الاستدعاء:', error);
  }
}