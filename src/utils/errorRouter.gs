/**
 * موجه الأخطاء - سياسة إدارة الأخطاء الموحدة
 * @fileoverview Unified error handling and routing system
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.ErrorRouter', function(injector) {
  
  return {
    /**
     * توجيه الخطأ حسب النوع والشدة
     * @param {Error} error - كائن الخطأ
     * @param {Object} context - سياق الخطأ
     * @param {string} context.module - اسم الوحدة
     * @param {string} context.function - اسم الدالة
     * @param {string} context.severity - شدة الخطأ (CRITICAL|HIGH|MEDIUM|LOW)
     * @returns {Object} معلومات توجيه الخطأ
     * @example
     * errorRouter.routeError(new Error('فشل في المعالجة'), {
     *   module: 'System.ToolExecutor',
     *   function: 'executeToolCalls',
     *   severity: 'HIGH'
     * });
     * @since 3.0.0
     */
    routeError(error, context = {}) {
      const errorInfo = {
        id: this.generateErrorId(),
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context: {
          module: context.module || 'UNKNOWN',
          function: context.function || 'UNKNOWN',
          severity: context.severity || 'MEDIUM',
          userId: this.getCurrentUserId(),
          sessionId: this.getSessionId()
        },
        routing: {
          logged: false,
          notified: false,
          escalated: false
        }
      };

      // توجيه الخطأ حسب الشدة
      this.processErrorBySeverity(errorInfo);
      
      // تسجيل الخطأ
      this.logError(errorInfo);
      
      // إشعار المطورين إذا لزم الأمر
      if (this.shouldNotifyDevelopers(errorInfo)) {
        this.notifyDevelopers(errorInfo);
      }

      return errorInfo;
    },

    /**
     * معالجة الخطأ حسب الشدة
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    processErrorBySeverity(errorInfo) {
      const severity = errorInfo.context.severity;
      
      switch (severity) {
        case 'CRITICAL':
          this.handleCriticalError(errorInfo);
          break;
        case 'HIGH':
          this.handleHighSeverityError(errorInfo);
          break;
        case 'MEDIUM':
          this.handleMediumSeverityError(errorInfo);
          break;
        case 'LOW':
          this.handleLowSeverityError(errorInfo);
          break;
        default:
          this.handleUnknownSeverityError(errorInfo);
      }
    },

    /**
     * معالجة الأخطاء الحرجة
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    handleCriticalError(errorInfo) {
      // تسجيل فوري في Google Cloud Logging
      this.logToCloudLogging(errorInfo, 'ERROR');
      
      // إيقاف العمليات غير الحرجة
      this.pauseNonCriticalOperations();
      
      // إشعار فوري للمطورين
      errorInfo.routing.escalated = true;
      errorInfo.routing.notified = true;
      
      console.error(`خطأ حرج في ${errorInfo.context.module}:`, errorInfo.error.message);
    },

    /**
     * معالجة الأخطاء عالية الشدة
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    handleHighSeverityError(errorInfo) {
      // تسجيل في Cloud Logging
      this.logToCloudLogging(errorInfo, 'WARNING');
      
      // محاولة الاسترداد التلقائي
      this.attemptAutoRecovery(errorInfo);
      
      errorInfo.routing.notified = true;
      
      console.warn(`خطأ عالي الشدة في ${errorInfo.context.module}:`, errorInfo.error.message);
    },

    /**
     * معالجة الأخطاء متوسطة الشدة
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    handleMediumSeverityError(errorInfo) {
      // تسجيل محلي
      this.logToLocalStorage(errorInfo);
      
      console.log(`خطأ متوسط في ${errorInfo.context.module}:`, errorInfo.error.message);
    },

    /**
     * معالجة الأخطاء منخفضة الشدة
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    handleLowSeverityError(errorInfo) {
      // تسجيل أساسي فقط
      console.debug(`خطأ منخفض في ${errorInfo.context.module}:`, errorInfo.error.message);
    },

    /**
     * معالجة الأخطاء غير المصنفة
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    handleUnknownSeverityError(errorInfo) {
      // معاملة كخطأ متوسط الشدة
      errorInfo.context.severity = 'MEDIUM';
      this.handleMediumSeverityError(errorInfo);
    },

    /**
     * تسجيل الخطأ في Google Cloud Logging
     * @param {Object} errorInfo - معلومات الخطأ
     * @param {string} level - مستوى السجل
     * @private
     */
    logToCloudLogging(errorInfo, level) {
      try {
        const logger = injector.get('Utils.SystemLogger');
        logger.logToCloud(errorInfo, level);
        errorInfo.routing.logged = true;
      } catch (logError) {
        console.error('فشل في التسجيل السحابي:', logError);
        this.logToLocalStorage(errorInfo);
      }
    },

    /**
     * تسجيل الخطأ محلياً
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    logToLocalStorage(errorInfo) {
      try {
        const errorLog = this.getErrorLog();
        errorLog.push(errorInfo);
        
        // الاحتفاظ بآخر 100 خطأ فقط
        if (errorLog.length > 100) {
          errorLog.splice(0, errorLog.length - 100);
        }
        
        PropertiesService.getScriptProperties().setProperty(
          'error_log',
          JSON.stringify(errorLog)
        );
        
        errorInfo.routing.logged = true;
      } catch (storageError) {
        console.error('فشل في التسجيل المحلي:', storageError);
      }
    },

    /**
     * الحصول على سجل الأخطاء
     * @returns {Array} قائمة الأخطاء المسجلة
     * @private
     */
    getErrorLog() {
      try {
        const savedLog = PropertiesService.getScriptProperties().getProperty('error_log');
        return savedLog ? JSON.parse(savedLog) : [];
      } catch (error) {
        return [];
      }
    },

    /**
     * تحديد ما إذا كان يجب إشعار المطورين
     * @param {Object} errorInfo - معلومات الخطأ
     * @returns {boolean} هل يجب الإشعار
     * @private
     */
    shouldNotifyDevelopers(errorInfo) {
      const severity = errorInfo.context.severity;
      return ['CRITICAL', 'HIGH'].includes(severity);
    },

    /**
     * إشعار المطورين
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    notifyDevelopers(errorInfo) {
      try {
        // محاكاة إرسال إشعار (يمكن تطويره لاحقاً)
        console.error(`🚨 إشعار للمطورين - خطأ ${errorInfo.context.severity}:`, {
          module: errorInfo.context.module,
          function: errorInfo.context.function,
          message: errorInfo.error.message,
          timestamp: errorInfo.timestamp
        });
        
        errorInfo.routing.notified = true;
      } catch (notificationError) {
        console.error('فشل في إشعار المطورين:', notificationError);
      }
    },

    /**
     * إيقاف العمليات غير الحرجة
     * @private
     */
    pauseNonCriticalOperations() {
      try {
        // تعيين علامة لإيقاف العمليات غير الحرجة
        PropertiesService.getScriptProperties().setProperty(
          'system_emergency_mode',
          'true'
        );
        
        console.warn('تم تفعيل وضع الطوارئ - إيقاف العمليات غير الحرجة');
      } catch (error) {
        console.error('فشل في تفعيل وضع الطوارئ:', error);
      }
    },

    /**
     * محاولة الاسترداد التلقائي
     * @param {Object} errorInfo - معلومات الخطأ
     * @private
     */
    attemptAutoRecovery(errorInfo) {
      try {
        // استراتيجيات الاسترداد حسب نوع الخطأ
        const module = errorInfo.context.module;
        
        if (module.includes('Storage')) {
          this.recoverStorageIssues();
        } else if (module.includes('AI')) {
          this.recoverAIServiceIssues();
        }
        
        console.log('تم محاولة الاسترداد التلقائي');
      } catch (recoveryError) {
        console.error('فشل في الاسترداد التلقائي:', recoveryError);
      }
    },

    /**
     * استرداد مشاكل التخزين
     * @private
     */
    recoverStorageIssues() {
      // تنظيف البيانات المؤقتة
      // إعادة تهيئة الاتصالات
    },

    /**
     * استرداد مشاكل خدمات الذكاء الاصطناعي
     * @private
     */
    recoverAIServiceIssues() {
      // إعادة تعيين الاتصالات
      // التبديل إلى خدمة احتياطية
    },

    /**
     * توليد معرف فريد للخطأ
     * @returns {string} معرف الخطأ
     * @private
     */
    generateErrorId() {
      return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        let sessionId = PropertiesService.getTemporaryProperties().getProperty('session_id');
        if (!sessionId) {
          sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          PropertiesService.getTemporaryProperties().setProperty('session_id', sessionId);
        }
        return sessionId;
      } catch (error) {
        return 'UNKNOWN_SESSION';
      }
    }
  };
});

/**
 * دالة عامة لتوجيه الأخطاء
 * @param {Error} error - كائن الخطأ
 * @param {Object} context - سياق الخطأ
 * @returns {Object} معلومات توجيه الخطأ
 * @example
 * routeError(new Error('فشل'), { module: 'System.Test', severity: 'HIGH' });
 * @since 3.0.0
 */
function routeError(error, context = {}) {
  try {
    const router = GAssistant.Utils.Injector.get('Utils.ErrorRouter');
    return router.routeError(error, context);
  } catch (routingError) {
    console.error('فشل في توجيه الخطأ:', routingError);
    console.error('الخطأ الأصلي:', error);
    return null;
  }
}