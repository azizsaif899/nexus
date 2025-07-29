/**
 * مسجل النظام - تكامل مع Google Cloud Logging
 * @fileoverview System logging with Google Cloud Logging integration
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.SystemLogger', function(injector) {
  
  return {
    /**
     * تسجيل رسالة في Google Cloud Logging
     * @param {Object} logData - بيانات السجل
     * @param {string} level - مستوى السجل (ERROR|WARNING|INFO|DEBUG)
     * @param {Object} options - خيارات إضافية
     * @returns {boolean} نجح التسجيل أم لا
     * @example
     * logger.logToCloud({ message: 'عملية مكتملة' }, 'INFO');
     * @since 3.0.0
     */
    logToCloud(logData, level = 'INFO', options = {}) {
      try {
        const logEntry = this.formatLogEntry(logData, level, options);
        
        // محاولة الإرسال إلى Cloud Logging
        const success = this.sendToCloudLogging(logEntry);
        
        if (!success) {
          // احتياطي: حفظ محلي
          this.logLocally(logEntry);
        }
        
        return success;
        
      } catch (error) {
        console.error('فشل في التسجيل السحابي:', error);
        this.logLocally({ error: error.message, originalData: logData });
        return false;
      }
    },

    /**
     * تنسيق إدخال السجل
     * @param {Object} logData - بيانات السجل
     * @param {string} level - مستوى السجل
     * @param {Object} options - خيارات إضافية
     * @returns {Object} إدخال السجل المنسق
     * @private
     */
    formatLogEntry(logData, level, options) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        severity: level,
        resource: {
          type: 'apps_script_function',
          labels: {
            project_id: this.getProjectId(),
            function_name: options.functionName || 'unknown'
          }
        },
        labels: {
          user_id: this.getCurrentUserId(),
          session_id: this.getSessionId(),
          version: '3.0.0'
        },
        jsonPayload: {
          ...logData,
          environment: 'production',
          source: 'g-assistant'
        }
      };

      return logEntry;
    },

    /**
     * إرسال السجل إلى Cloud Logging
     * @param {Object} logEntry - إدخال السجل
     * @returns {boolean} نجح الإرسال أم لا
     * @private
     */
    sendToCloudLogging(logEntry) {
      try {
        const projectId = this.getProjectId();
        if (!projectId) {
          console.warn('معرف المشروع غير متوفر - تسجيل محلي');
          return false;
        }

        const accessToken = this.getAccessToken();
        if (!accessToken) {
          console.warn('رمز الوصول غير متوفر - تسجيل محلي');
          return false;
        }

        const endpoint = `https://logging.googleapis.com/v2/projects/${projectId}/logs/g-assistant/entries:write`;
        
        const payload = {
          entries: [logEntry]
        };

        const response = UrlFetchApp.fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify(payload)
        });

        return response.getResponseCode() === 200;
        
      } catch (error) {
        console.error('خطأ في إرسال السجل:', error);
        return false;
      }
    },

    /**
     * تسجيل محلي كاحتياطي
     * @param {Object} logData - بيانات السجل
     * @private
     */
    logLocally(logData) {
      try {
        const localLog = this.getLocalLog();
        localLog.push({
          timestamp: new Date().toISOString(),
          data: logData
        });
        
        // الاحتفاظ بآخر 50 إدخال فقط
        if (localLog.length > 50) {
          localLog.splice(0, localLog.length - 50);
        }
        
        PropertiesService.getScriptProperties().setProperty(
          'local_log',
          JSON.stringify(localLog)
        );
        
      } catch (error) {
        console.error('فشل في التسجيل المحلي:', error);
      }
    },

    /**
     * الحصول على السجل المحلي
     * @returns {Array} قائمة السجلات المحلية
     * @private
     */
    getLocalLog() {
      try {
        const savedLog = PropertiesService.getScriptProperties().getProperty('local_log');
        return savedLog ? JSON.parse(savedLog) : [];
      } catch (error) {
        return [];
      }
    },

    /**
     * تسجيل خطأ في النظام
     * @param {Error} error - كائن الخطأ
     * @param {Object} context - سياق الخطأ
     * @example
     * logger.logError(new Error('فشل'), { module: 'System.Test' });
     * @since 3.0.0
     */
    logError(error, context = {}) {
      const errorData = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        context: context
      };
      
      this.logToCloud(errorData, 'ERROR', {
        functionName: context.function || 'unknown'
      });
    },

    /**
     * تسجيل تحذير
     * @param {string} message - رسالة التحذير
     * @param {Object} context - سياق التحذير
     * @example
     * logger.logWarning('أداء بطيء', { responseTime: 5000 });
     * @since 3.0.0
     */
    logWarning(message, context = {}) {
      const warningData = {
        message: message,
        context: context
      };
      
      this.logToCloud(warningData, 'WARNING');
    },

    /**
     * تسجيل معلومات
     * @param {string} message - رسالة المعلومات
     * @param {Object} data - بيانات إضافية
     * @example
     * logger.logInfo('عملية مكتملة', { duration: 1500 });
     * @since 3.0.0
     */
    logInfo(message, data = {}) {
      const infoData = {
        message: message,
        ...data
      };
      
      this.logToCloud(infoData, 'INFO');
    },

    /**
     * الحصول على معرف المشروع
     * @returns {string|null} معرف المشروع
     * @private
     */
    getProjectId() {
      return PropertiesService.getScriptProperties().getProperty('GCP_PROJECT_ID');
    },

    /**
     * الحصول على رمز الوصول
     * @returns {string|null} رمز الوصول
     * @private
     */
    getAccessToken() {
      try {
        const auth = injector.get('System.Auth');
        return auth.getAccessToken(['https://www.googleapis.com/auth/logging.write']);
      } catch (error) {
        console.error('فشل في الحصول على رمز الوصول:', error);
        return null;
      }
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
    },

    /**
     * الحصول على إحصائيات التسجيل
     * @returns {Object} إحصائيات التسجيل
     * @example
     * const stats = logger.getLoggingStats();
     * @since 3.0.0
     */
    getLoggingStats() {
      try {
        const localLog = this.getLocalLog();
        const stats = {
          totalLocalLogs: localLog.length,
          lastLogTime: localLog.length > 0 ? localLog[localLog.length - 1].timestamp : null,
          logLevels: {
            ERROR: 0,
            WARNING: 0,
            INFO: 0,
            DEBUG: 0
          }
        };

        // حساب توزيع مستويات السجل (تقدير)
        localLog.forEach(log => {
          if (log.data.error) {
            stats.logLevels.ERROR++;
          } else if (log.data.message && log.data.message.includes('تحذير')) {
            stats.logLevels.WARNING++;
          } else {
            stats.logLevels.INFO++;
          }
        });

        return stats;
      } catch (error) {
        console.error('فشل في جلب إحصائيات التسجيل:', error);
        return {
          totalLocalLogs: 0,
          lastLogTime: null,
          logLevels: { ERROR: 0, WARNING: 0, INFO: 0, DEBUG: 0 }
        };
      }
    }
  };
});

/**
 * دوال عامة للتسجيل
 */

/**
 * تسجيل خطأ
 * @param {Error} error - كائن الخطأ
 * @param {Object} context - سياق الخطأ
 * @example
 * logError(new Error('فشل'), { module: 'System.Test' });
 * @since 3.0.0
 */
function logError(error, context = {}) {
  try {
    const logger = GAssistant.Utils.Injector.get('Utils.SystemLogger');
    logger.logError(error, context);
  } catch (loggerError) {
    console.error('فشل في تسجيل الخطأ:', loggerError);
    console.error('الخطأ الأصلي:', error);
  }
}

/**
 * تسجيل معلومات
 * @param {string} message - رسالة المعلومات
 * @param {Object} data - بيانات إضافية
 * @example
 * logInfo('عملية مكتملة', { duration: 1500 });
 * @since 3.0.0
 */
function logInfo(message, data = {}) {
  try {
    const logger = GAssistant.Utils.Injector.get('Utils.SystemLogger');
    logger.logInfo(message, data);
  } catch (error) {
    console.error('فشل في تسجيل المعلومات:', error);
  }
}