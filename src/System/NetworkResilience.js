/**
 * NetworkResilience - مدير الاتصالات الموثوق مع Exponential Backoff
 * يضمن استقرار الاتصال مع جميع APIs الخارجية
 *
 * @module System.NetworkResilience
 * @requires System.ErrorLogger
 * @requires System.PerformanceProfiler
 * @since 6.1.0
 * @author G-Assistant Team
 */
defineModule('System.NetworkResilience', function(injector) {
  const errorLogger = injector.get('System.ErrorLogger');
  const performanceProfiler = injector.get('System.PerformanceProfiler');

  const DEFAULT_CONFIG = {
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitterRange: 0.1
  };

  return {
    /**
     * استدعاء API موثوق مع إعادة المحاولة الذكية
     * @param {string} url - رابط API
     * @param {Object} options - خيارات الطلب
     * @param {Object} config - إعدادات إعادة المحاولة
     * @returns {HTTPResponse} استجابة API
     * @throws {Error} عند فشل جميع المحاولات
     */
    resilientFetch(url, options = {}, config = {}) {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };
      const timerId = performanceProfiler.startTimer('resilient_fetch');

      let lastError;

      for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
        try {
          const response = this._makeRequest(url, options);

          if (this._isSuccessResponse(response)) {
            performanceProfiler.endTimer(timerId);
            return response;
          }

          if (this._isRateLimited(response)) {
            const retryAfter = this._getRetryAfter(response);
            Utilities.sleep(retryAfter || this._calculateDelay(attempt, finalConfig));
            continue;
          }

          throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);

        } catch (error) {
          lastError = error;

          if (attempt === finalConfig.maxRetries) {
            break;
          }

          const delay = this._calculateDelay(attempt, finalConfig);
          Utilities.sleep(delay);
        }
      }

      performanceProfiler.endTimer(timerId);
      errorLogger.logError(lastError, {
        operation: 'resilient_fetch',
        url,
        attempts: finalConfig.maxRetries + 1
      });

      throw new Error(`NetworkError: Failed after ${finalConfig.maxRetries + 1} attempts: ${lastError.message}`);
    },

    /**
     * تنفيذ الطلب الفعلي
     * @private
     * @param {string} url - الرابط
     * @param {Object} options - الخيارات
     * @returns {HTTPResponse} الاستجابة
     */
    _makeRequest(url, options) {
      const requestOptions = {
        method: 'GET',
        muteHttpExceptions: true,
        ...options
      };

      return UrlFetchApp.fetch(url, requestOptions);
    },

    /**
     * فحص نجاح الاستجابة
     * @private
     * @param {HTTPResponse} response - الاستجابة
     * @returns {boolean} نجح أم لا
     */
    _isSuccessResponse(response) {
      const code = response.getResponseCode();
      return code >= 200 && code < 300;
    },

    /**
     * فحص Rate Limiting
     * @private
     * @param {HTTPResponse} response - الاستجابة
     * @returns {boolean} محدود أم لا
     */
    _isRateLimited(response) {
      const code = response.getResponseCode();
      return code === 429 || code === 503;
    },

    /**
     * استخراج Retry-After header
     * @private
     * @param {HTTPResponse} response - الاستجابة
     * @returns {number|null} وقت الانتظار بالميلي ثانية
     */
    _getRetryAfter(response) {
      const retryAfter = response.getHeaders()['Retry-After'];
      return retryAfter ? parseInt(retryAfter) * 1000 : null;
    },

    /**
     * حساب تأخير Exponential Backoff مع Jitter
     * @private
     * @param {number} attempt - رقم المحاولة
     * @param {Object} config - الإعدادات
     * @returns {number} وقت التأخير بالميلي ثانية
     */
    _calculateDelay(attempt, config) {
      const exponentialDelay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
        config.maxDelay
      );

      const jitter = exponentialDelay * config.jitterRange * Math.random();
      return exponentialDelay + jitter;
    }
  };
});
