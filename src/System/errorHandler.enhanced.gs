/**
 * معالج الأخطاء المحسن للمستخدمين
 * @fileoverview Enhanced user-facing error handling
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('System.ErrorHandler.Enhanced', function(injector) {
  
  return {
    /**
     * معالجة الأخطاء مع رسائل واضحة للمستخدم
     * @param {Error} error - الخطأ الأصلي
     * @param {Object} context - سياق الخطأ
     * @returns {Object} رسالة خطأ محسنة للمستخدم
     * @since 3.0.0
     */
    handleUserFacingError(error, context = {}) {
      const errorInfo = this.analyzeError(error, context);
      const userMessage = this.generateUserMessage(errorInfo);
      
      // تسجيل الخطأ تقنياً
      this.logTechnicalError(error, context, errorInfo);
      
      return {
        success: false,
        userMessage: userMessage.message,
        actionable: userMessage.actionable,
        severity: errorInfo.severity,
        canRetry: userMessage.canRetry,
        helpLink: userMessage.helpLink
      };
    },

    /**
     * تحليل نوع الخطأ
     * @param {Error} error - الخطأ
     * @param {Object} context - السياق
     * @returns {Object} تحليل الخطأ
     * @private
     */
    analyzeError(error, context) {
      const errorAnalysis = {
        type: 'UNKNOWN',
        severity: 'MEDIUM',
        category: 'SYSTEM',
        isUserError: false,
        isRetryable: false
      };

      const errorMessage = error.message.toLowerCase();

      // أخطاء الشبكة والاتصال
      if (this.isNetworkError(errorMessage)) {
        errorAnalysis.type = 'NETWORK';
        errorAnalysis.category = 'CONNECTION';
        errorAnalysis.isRetryable = true;
        errorAnalysis.severity = 'HIGH';
      }
      
      // أخطاء API
      else if (this.isAPIError(errorMessage)) {
        errorAnalysis.type = 'API';
        errorAnalysis.category = 'SERVICE';
        errorAnalysis.isRetryable = this.isRetryableAPIError(errorMessage);
        errorAnalysis.severity = 'HIGH';
      }
      
      // أخطاء الصلاحيات
      else if (this.isPermissionError(errorMessage)) {
        errorAnalysis.type = 'PERMISSION';
        errorAnalysis.category = 'ACCESS';
        errorAnalysis.isRetryable = false;
        errorAnalysis.severity = 'HIGH';
      }
      
      // أخطاء الحصص والحدود
      else if (this.isQuotaError(errorMessage)) {
        errorAnalysis.type = 'QUOTA';
        errorAnalysis.category = 'LIMIT';
        errorAnalysis.isRetryable = true;
        errorAnalysis.severity = 'MEDIUM';
      }
      
      // أخطاء المستخدم
      else if (this.isUserInputError(errorMessage, context)) {
        errorAnalysis.type = 'USER_INPUT';
        errorAnalysis.category = 'INPUT';
        errorAnalysis.isUserError = true;
        errorAnalysis.isRetryable = true;
        errorAnalysis.severity = 'LOW';
      }

      return errorAnalysis;
    },

    /**
     * فحص أخطاء الشبكة
     * @param {string} errorMessage - رسالة الخطأ
     * @returns {boolean} هل هو خطأ شبكة
     * @private
     */
    isNetworkError(errorMessage) {
      const networkKeywords = [
        'network', 'connection', 'timeout', 'unreachable',
        'dns', 'socket', 'refused', 'failed to fetch'
      ];
      return networkKeywords.some(keyword => errorMessage.includes(keyword));
    },

    /**
     * فحص أخطاء API
     * @param {string} errorMessage - رسالة الخطأ
     * @returns {boolean} هل هو خطأ API
     * @private
     */
    isAPIError(errorMessage) {
      const apiKeywords = [
        'api', 'gemini', 'vertex', 'document ai', 'bigquery',
        'invalid key', 'unauthorized', 'forbidden'
      ];
      return apiKeywords.some(keyword => errorMessage.includes(keyword));
    },

    /**
     * فحص أخطاء الصلاحيات
     * @param {string} errorMessage - رسالة الخطأ
     * @returns {boolean} هل هو خطأ صلاحيات
     * @private
     */
    isPermissionError(errorMessage) {
      const permissionKeywords = [
        'permission', 'access denied', 'unauthorized', 'forbidden',
        'not allowed', 'insufficient privileges'
      ];
      return permissionKeywords.some(keyword => errorMessage.includes(keyword));
    },

    /**
     * فحص أخطاء الحصص
     * @param {string} errorMessage - رسالة الخطأ
     * @returns {boolean} هل هو خطأ حصة
     * @private
     */
    isQuotaError(errorMessage) {
      const quotaKeywords = [
        'quota', 'limit', 'exceeded', 'rate limit', 'too many requests',
        'usage limit', 'billing'
      ];
      return quotaKeywords.some(keyword => errorMessage.includes(keyword));
    },

    /**
     * فحص أخطاء المستخدم
     * @param {string} errorMessage - رسالة الخطأ
     * @param {Object} context - السياق
     * @returns {boolean} هل هو خطأ مستخدم
     * @private
     */
    isUserInputError(errorMessage, context) {
      const inputKeywords = [
        'invalid input', 'empty', 'required', 'format',
        'validation', 'missing parameter'
      ];
      return inputKeywords.some(keyword => errorMessage.includes(keyword));
    },

    /**
     * فحص إمكانية إعادة المحاولة لأخطاء API
     * @param {string} errorMessage - رسالة الخطأ
     * @returns {boolean} يمكن إعادة المحاولة
     * @private
     */
    isRetryableAPIError(errorMessage) {
      const nonRetryableKeywords = [
        'invalid key', 'unauthorized', 'forbidden', 'not found'
      ];
      return !nonRetryableKeywords.some(keyword => errorMessage.includes(keyword));
    },

    /**
     * إنشاء رسالة واضحة للمستخدم
     * @param {Object} errorInfo - تحليل الخطأ
     * @returns {Object} رسالة المستخدم
     * @private
     */
    generateUserMessage(errorInfo) {
      const messages = {
        NETWORK: {
          message: '🌐 مشكلة في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
          actionable: 'تحقق من اتصال الإنترنت وأعد المحاولة',
          canRetry: true,
          helpLink: '#network-troubleshooting'
        },
        
        API: {
          message: '🔧 مشكلة في الاتصال بخدمة الذكاء الاصطناعي. قد تكون الخدمة مشغولة حالياً.',
          actionable: 'انتظر قليلاً وأعد المحاولة، أو تحقق من إعدادات API',
          canRetry: true,
          helpLink: '#api-troubleshooting'
        },
        
        PERMISSION: {
          message: '🔒 ليس لديك الصلاحية اللازمة لهذه العملية. يرجى التحقق من إعدادات الحساب.',
          actionable: 'تواصل مع المسؤول لمنحك الصلاحيات المطلوبة',
          canRetry: false,
          helpLink: '#permission-help'
        },
        
        QUOTA: {
          message: '📊 لقد وصلت إلى الحد الأقصى للاستخدام اليومي. يرجى المحاولة مرة أخرى غداً.',
          actionable: 'انتظر حتى إعادة تعيين الحصة أو قم بترقية خطتك',
          canRetry: true,
          helpLink: '#quota-management'
        },
        
        USER_INPUT: {
          message: '📝 هناك مشكلة في البيانات المدخلة. يرجى التحقق من صحة المعلومات.',
          actionable: 'راجع البيانات المدخلة وتأكد من اكتمالها وصحتها',
          canRetry: true,
          helpLink: '#input-validation'
        }
      };

      return messages[errorInfo.type] || {
        message: '⚠️ حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.',
        actionable: 'أعد المحاولة أو تواصل مع فريق الدعم',
        canRetry: true,
        helpLink: '#general-help'
      };
    },

    /**
     * تسجيل الخطأ تقنياً
     * @param {Error} error - الخطأ الأصلي
     * @param {Object} context - السياق
     * @param {Object} errorInfo - تحليل الخطأ
     * @private
     */
    logTechnicalError(error, context, errorInfo) {
      try {
        const errorRouter = injector.get('Utils.ErrorRouter');
        errorRouter.routeError(error, {
          ...context,
          severity: errorInfo.severity,
          userFacing: true,
          errorType: errorInfo.type,
          category: errorInfo.category
        });
      } catch (logError) {
        console.error('فشل في تسجيل الخطأ:', logError);
      }
    },

    /**
     * إنشاء رسالة خطأ مخصصة للسياق
     * @param {string} operation - العملية التي فشلت
     * @param {Error} error - الخطأ
     * @param {Object} context - السياق الإضافي
     * @returns {Object} رسالة خطأ مخصصة
     * @since 3.0.0
     */
    createContextualError(operation, error, context = {}) {
      const contextualMessages = {
        'document_processing': {
          message: '📄 فشل في معالجة المستند. تأكد من أن الملف صالح ويمكن قراءته.',
          actionable: 'جرب ملف آخر أو تحقق من تنسيق الملف'
        },
        
        'data_analysis': {
          message: '📊 فشل في تحليل البيانات. تأكد من وجود بيانات صالحة في النطاق المحدد.',
          actionable: 'تحقق من البيانات المحددة وتأكد من صحتها'
        },
        
        'agent_communication': {
          message: '🤖 فشل في التواصل مع الوكيل الذكي. قد تكون الخدمة مشغولة.',
          actionable: 'جرب وكيل آخر أو أعد المحاولة لاحقاً'
        },
        
        'file_upload': {
          message: '📁 فشل في رفع الملف. تأكد من حجم الملف وصيغته.',
          actionable: 'استخدم ملف أصغر أو صيغة مدعومة'
        }
      };

      const baseError = this.handleUserFacingError(error, context);
      const contextualInfo = contextualMessages[operation];

      if (contextualInfo) {
        return {
          ...baseError,
          userMessage: contextualInfo.message,
          actionable: contextualInfo.actionable
        };
      }

      return baseError;
    }
  };
});

/**
 * دالة عامة لمعالجة الأخطاء للمستخدمين
 * @param {Error} error - الخطأ
 * @param {Object} context - السياق
 * @returns {Object} رسالة خطأ محسنة
 * @since 3.0.0
 */
function handleUserError(error, context = {}) {
  try {
    const errorHandler = GAssistant.Utils.Injector.get('System.ErrorHandler.Enhanced');
    return errorHandler.handleUserFacingError(error, context);
  } catch (handlerError) {
    console.error('فشل في معالج الأخطاء:', handlerError);
    return {
      success: false,
      userMessage: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      actionable: 'أعد المحاولة أو تواصل مع الدعم',
      canRetry: true
    };
  }
}