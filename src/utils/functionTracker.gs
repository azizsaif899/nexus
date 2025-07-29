/**
 * متتبع أداء الدوال - استعادة tools_function_tracker.gs
 * @fileoverview Function performance tracker with Cloud Logging integration
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.FunctionTracker', function(injector) {
  
  return {
    /**
     * بدء تتبع تنفيذ دالة
     * @param {string} functionId - معرف الدالة
     * @param {Object} context - سياق التنفيذ
     * @returns {Object} جلسة التتبع
     * @example
     * const session = tracker.startTracking('System.DataProcessor.processData', {
     *   userId: 'user@example.com',
     *   inputSize: 1024
     * });
     * @since 3.0.0
     */
    startTracking(functionId, context = {}) {
      const session = {
        id: this.generateSessionId(),
        functionId: functionId,
        startTime: Date.now(),
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          userId: this.getCurrentUserId(),
          sessionId: this.getSessionId()
        },
        metrics: {
          memoryBefore: this.getMemoryUsage(),
          cpuBefore: this.getCpuUsage()
        }
      };

      // حفظ الجلسة النشطة
      this.saveActiveSession(session);
      
      return session;
    },

    /**
     * إنهاء تتبع تنفيذ دالة
     * @param {Object} session - جلسة التتبع
     * @param {Object} result - نتيجة التنفيذ
     * @param {boolean} result.success - نجح التنفيذ أم لا
     * @param {*} result.data - البيانات المرجعة
     * @param {Error} result.error - الخطأ إن وجد
     * @returns {Object} تقرير الأداء
     * @example
     * const report = tracker.endTracking(session, {
     *   success: true,
     *   data: processedData
     * });
     * @since 3.0.0
     */
    endTracking(session, result = {}) {
      const endTime = Date.now();
      const duration = endTime - session.startTime;

      const performanceReport = {
        sessionId: session.id,
        functionId: session.functionId,
        duration: duration,
        success: result.success !== false,
        timestamp: new Date().toISOString(),
        metrics: {
          ...session.metrics,
          memoryAfter: this.getMemoryUsage(),
          cpuAfter: this.getCpuUsage(),
          memoryDelta: this.getMemoryUsage() - session.metrics.memoryBefore
        },
        context: session.context,
        result: {
          success: result.success !== false,
          error: result.error ? result.error.message : null,
          dataSize: this.calculateDataSize(result.data)
        }
      };

      // تسجيل الأداء
      this.recordPerformance(performanceReport);
      
      // إرسال إلى Cloud Logging
      this.sendToCloudLogging(performanceReport);
      
      // تنظيف الجلسة النشطة
      this.removeActiveSession(session.id);
      
      return performanceReport;
    },

    /**
     * تتبع دالة تلقائياً (Decorator Pattern)
     * @param {string} functionId - معرف الدالة
     * @param {Function} originalFunction - الدالة الأصلية
     * @param {Object} context - سياق إضافي
     * @returns {Function} الدالة المُتتبعة
     * @example
     * const trackedFunction = tracker.wrapFunction(
     *   'System.DataProcessor.processData',
     *   originalProcessData,
     *   { module: 'DataProcessor' }
     * );
     * @since 3.0.0
     */
    wrapFunction(functionId, originalFunction, context = {}) {
      const tracker = this;
      
      return function(...args) {
        const session = tracker.startTracking(functionId, {
          ...context,
          argumentsCount: args.length,
          argumentsSize: tracker.calculateDataSize(args)
        });

        try {
          const result = originalFunction.apply(this, args);
          
          // التعامل مع الدوال غير المتزامنة
          if (result && typeof result.then === 'function') {
            return result
              .then(data => {
                tracker.endTracking(session, { success: true, data });
                return data;
              })
              .catch(error => {
                tracker.endTracking(session, { success: false, error });
                throw error;
              });
          } else {
            tracker.endTracking(session, { success: true, data: result });
            return result;
          }
          
        } catch (error) {
          tracker.endTracking(session, { success: false, error });
          throw error;
        }
      };
    },

    /**
     * تسجيل بيانات الأداء
     * @param {Object} report - تقرير الأداء
     * @private
     */
    recordPerformance(report) {
      try {
        // تحديث سجل الدوال
        const registry = injector.get('Utils.FunctionRegistry');
        registry.recordFunctionCall(report.functionId, {
          duration: report.duration,
          success: report.success,
          memoryUsage: report.metrics.memoryDelta
        });

        // حفظ في سجل الأداء المحلي
        this.saveToLocalPerformanceLog(report);
        
      } catch (error) {
        console.error('فشل في تسجيل الأداء:', error);
      }
    },

    /**
     * إرسال البيانات إلى Cloud Logging
     * @param {Object} report - تقرير الأداء
     * @private
     */
    sendToCloudLogging(report) {
      try {
        const logger = injector.get('Utils.SystemLogger');
        
        // تحديد مستوى السجل بناءً على الأداء
        let logLevel = 'INFO';
        if (!report.success) {
          logLevel = 'ERROR';
        } else if (report.duration > 5000) {
          logLevel = 'WARNING';
        }

        logger.logToCloud({
          type: 'function_performance',
          functionId: report.functionId,
          duration: report.duration,
          success: report.success,
          memoryDelta: report.metrics.memoryDelta,
          context: report.context,
          error: report.result.error
        }, logLevel);
        
      } catch (error) {
        console.error('فشل في إرسال البيانات للسحابة:', error);
      }
    },

    /**
     * حفظ في سجل الأداء المحلي
     * @param {Object} report - تقرير الأداء
     * @private
     */
    saveToLocalPerformanceLog(report) {
      try {
        const performanceLog = this.getPerformanceLog();
        performanceLog.push(report);
        
        // الاحتفاظ بآخر 100 تقرير فقط
        if (performanceLog.length > 100) {
          performanceLog.splice(0, performanceLog.length - 100);
        }
        
        PropertiesService.getScriptProperties().setProperty(
          'performance_log',
          JSON.stringify(performanceLog)
        );
        
      } catch (error) {
        console.error('فشل في حفظ سجل الأداء:', error);
      }
    },

    /**
     * الحصول على سجل الأداء
     * @returns {Array} سجل الأداء
     * @private
     */
    getPerformanceLog() {
      try {
        const savedLog = PropertiesService.getScriptProperties()
          .getProperty('performance_log');
        return savedLog ? JSON.parse(savedLog) : [];
      } catch (error) {
        return [];
      }
    },

    /**
     * الحصول على إحصائيات الأداء
     * @param {Object} filters - مرشحات الاستعلام
     * @param {string} filters.functionId - معرف الدالة
     * @param {number} filters.hours - عدد الساعات الماضية
     * @returns {Object} إحصائيات الأداء
     * @example
     * const stats = tracker.getPerformanceStats({
     *   functionId: 'System.DataProcessor.processData',
     *   hours: 24
     * });
     * @since 3.0.0
     */
    getPerformanceStats(filters = {}) {
      try {
        const performanceLog = this.getPerformanceLog();
        let filteredLog = performanceLog;

        // تطبيق المرشحات
        if (filters.functionId) {
          filteredLog = filteredLog.filter(report => 
            report.functionId === filters.functionId
          );
        }

        if (filters.hours) {
          const cutoffTime = Date.now() - (filters.hours * 60 * 60 * 1000);
          filteredLog = filteredLog.filter(report => 
            new Date(report.timestamp).getTime() > cutoffTime
          );
        }

        // حساب الإحصائيات
        const stats = {
          totalCalls: filteredLog.length,
          successfulCalls: filteredLog.filter(r => r.success).length,
          failedCalls: filteredLog.filter(r => !r.success).length,
          averageDuration: 0,
          minDuration: 0,
          maxDuration: 0,
          totalMemoryUsage: 0,
          averageMemoryUsage: 0
        };

        if (filteredLog.length > 0) {
          const durations = filteredLog.map(r => r.duration);
          const memoryUsages = filteredLog.map(r => r.metrics.memoryDelta || 0);

          stats.averageDuration = Math.round(
            durations.reduce((sum, d) => sum + d, 0) / durations.length
          );
          stats.minDuration = Math.min(...durations);
          stats.maxDuration = Math.max(...durations);
          
          stats.totalMemoryUsage = memoryUsages.reduce((sum, m) => sum + m, 0);
          stats.averageMemoryUsage = Math.round(stats.totalMemoryUsage / memoryUsages.length);
        }

        stats.successRate = stats.totalCalls > 0 ? 
          Math.round((stats.successfulCalls / stats.totalCalls) * 100) : 0;

        return stats;
        
      } catch (error) {
        console.error('فشل في جلب إحصائيات الأداء:', error);
        return { totalCalls: 0, successRate: 0 };
      }
    },

    /**
     * حفظ الجلسة النشطة
     * @param {Object} session - جلسة التتبع
     * @private
     */
    saveActiveSession(session) {
      try {
        const activeSessions = this.getActiveSessions();
        activeSessions[session.id] = session;
        
        PropertiesService.getTemporaryProperties().setProperty(
          'active_tracking_sessions',
          JSON.stringify(activeSessions)
        );
      } catch (error) {
        console.error('فشل في حفظ الجلسة النشطة:', error);
      }
    },

    /**
     * إزالة الجلسة النشطة
     * @param {string} sessionId - معرف الجلسة
     * @private
     */
    removeActiveSession(sessionId) {
      try {
        const activeSessions = this.getActiveSessions();
        delete activeSessions[sessionId];
        
        PropertiesService.getTemporaryProperties().setProperty(
          'active_tracking_sessions',
          JSON.stringify(activeSessions)
        );
      } catch (error) {
        console.error('فشل في إزالة الجلسة النشطة:', error);
      }
    },

    /**
     * الحصول على الجلسات النشطة
     * @returns {Object} الجلسات النشطة
     * @private
     */
    getActiveSessions() {
      try {
        const saved = PropertiesService.getTemporaryProperties()
          .getProperty('active_tracking_sessions');
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        return {};
      }
    },

    /**
     * توليد معرف جلسة
     * @returns {string} معرف الجلسة
     * @private
     */
    generateSessionId() {
      return `TRK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * الحصول على معرف المستخدم الحالي
     * @returns {string} معرف المستخدم
     * @private
     */
    getCurrentUserId() {
      try {
        return Session.getActiveUser().getEmail();
      } catch (error) {
        return 'UNKNOWN_USER';
      }
    },

    /**
     * الحصول على معرف الجلسة
     * @returns {string} معرف الجلسة
     * @private
     */
    getSessionId() {
      try {
        let sessionId = PropertiesService.getTemporaryProperties()
          .getProperty('session_id');
        if (!sessionId) {
          sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          PropertiesService.getTemporaryProperties().setProperty('session_id', sessionId);
        }
        return sessionId;
      } catch (error) {
        return 'UNKNOWN_SESSION';
      }
    },

    /**
     * تقدير استخدام الذاكرة
     * @returns {number} تقدير استخدام الذاكرة بالبايت
     * @private
     */
    getMemoryUsage() {
      try {
        // تقدير بناءً على البيانات المحفوظة
        const properties = PropertiesService.getScriptProperties().getProperties();
        return JSON.stringify(properties).length;
      } catch (error) {
        return 0;
      }
    },

    /**
     * تقدير استخدام المعالج
     * @returns {number} تقدير استخدام المعالج
     * @private
     */
    getCpuUsage() {
      // في Apps Script، لا يمكن قياس استخدام المعالج مباشرة
      // نعيد قيمة ثابتة أو تقدير بناءً على الوقت
      return Date.now() % 100;
    },

    /**
     * حساب حجم البيانات
     * @param {*} data - البيانات
     * @returns {number} حجم البيانات بالبايت
     * @private
     */
    calculateDataSize(data) {
      try {
        return JSON.stringify(data).length;
      } catch (error) {
        return 0;
      }
    }
  };
});

/**
 * دوال عامة لتتبع الأداء
 */

/**
 * تتبع دالة تلقائياً
 * @param {string} functionId - معرف الدالة
 * @param {Function} originalFunction - الدالة الأصلية
 * @returns {Function} الدالة المُتتبعة
 * @example
 * const trackedFunction = trackFunction('MyModule.myFunction', originalFunction);
 * @since 3.0.0
 */
function trackFunction(functionId, originalFunction) {
  try {
    const tracker = GAssistant.Utils.Injector.get('Utils.FunctionTracker');
    return tracker.wrapFunction(functionId, originalFunction);
  } catch (error) {
    console.error('فشل في تتبع الدالة:', error);
    return originalFunction;
  }
}