/**
 * @file src/services/advancedMonitoring.js
 * @description نظام مراقبة متقدم مع تسجيل منظم وإنذارات ذكية
 * @version 1.0.0
 */

defineModule('Services.AdvancedMonitoring', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  class AdvancedMonitoring {
    constructor() {
      this.metrics = new Map();
      this.alerts = new Map();
      this.thresholds = {
        errorRate: 0.01, // 1%
        responseTime: 200, // 200ms
        cacheHitRate: 0.8, // 80%
        memoryUsage: 0.85 // 85%
      };
      this.alertChannels = [];
    }

    /**
     * تسجيل منظم للأحداث
     */
    logStructured(level, message, metadata = {}) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: level.toUpperCase(),
        message,
        metadata: {
          ...metadata,
          service: 'AzizSys',
          version: MODULE_VERSION,
          environment: Config.get('ENVIRONMENT') || 'development'
        }
      };

      // إرسال إلى Google Cloud Logging
      this._sendToCloudLogging(logEntry);
      
      // فحص الإنذارات
      this._checkAlerts(logEntry);
      
      return logEntry;
    }

    /**
     * تسجيل مقاييس الأداء
     */
    recordMetric(name, value, tags = {}) {
      const metric = {
        name,
        value,
        timestamp: Date.now(),
        tags: {
          ...tags,
          service: 'AzizSys'
        }
      };

      this.metrics.set(`${name}_${Date.now()}`, metric);
      
      // فحص العتبات
      this._checkThresholds(name, value);
      
      return metric;
    }

    /**
     * مراقبة طلب HTTP
     */
    monitorRequest(req, res, next) {
      const startTime = Date.now();
      const requestId = this._generateRequestId();
      
      // تسجيل بداية الطلب
      this.logStructured('info', 'Request started', {
        requestId,
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });

      // مراقبة الاستجابة
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        
        // تسجيل انتهاء الطلب
        this.logStructured(statusCode >= 400 ? 'error' : 'info', 'Request completed', {
          requestId,
          duration,
          statusCode,
          contentLength: res.get('Content-Length')
        });

        // تسجيل المقاييس
        this.recordMetric('http_request_duration_ms', duration, {
          method: req.method,
          status: statusCode,
          route: req.route?.path || req.url
        });

        this.recordMetric('http_requests_total', 1, {
          method: req.method,
          status: statusCode
        });
      });

      next();
    }

    /**
     * مراقبة استخدام الذاكرة
     */
    monitorMemoryUsage() {
      const usage = process.memoryUsage();
      const totalMemory = require('os').totalmem();
      
      const memoryMetrics = {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        rss: usage.rss,
        usagePercentage: usage.rss / totalMemory
      };

      Object.entries(memoryMetrics).forEach(([key, value]) => {
        this.recordMetric(`memory_${key}`, value);
      });

      return memoryMetrics;
    }

    /**
     * مراقبة أداء EmbeddingService
     */
    monitorEmbeddingService(embeddingService) {
      const stats = embeddingService.getStats();
      
      this.recordMetric('embedding_cache_size', stats.cacheSize);
      this.recordMetric('embedding_cache_hit_rate', this._calculateCacheHitRate());
      
      return stats;
    }

    /**
     * إعداد إنذار
     */
    setupAlert(name, condition, action) {
      this.alerts.set(name, {
        condition,
        action,
        lastTriggered: null,
        cooldown: 300000 // 5 minutes
      });
    }

    /**
     * إضافة قناة إنذار
     */
    addAlertChannel(channel) {
      this.alertChannels.push(channel);
    }

    /**
     * الحصول على لوحة المعلومات
     */
    getDashboardData() {
      const now = Date.now();
      const oneHourAgo = now - 3600000;
      
      const recentMetrics = Array.from(this.metrics.entries())
        .filter(([key, metric]) => metric.timestamp > oneHourAgo)
        .map(([key, metric]) => metric);

      return {
        totalRequests: recentMetrics.filter(m => m.name === 'http_requests_total').length,
        averageResponseTime: this._calculateAverage(
          recentMetrics.filter(m => m.name === 'http_request_duration_ms')
        ),
        errorRate: this._calculateErrorRate(recentMetrics),
        cacheHitRate: this._calculateCacheHitRate(),
        memoryUsage: this._getLatestMetric('memory_usagePercentage'),
        uptime: process.uptime(),
        timestamp: now
      };
    }

    /**
     * فحص العتبات
     */
    _checkThresholds(metricName, value) {
      const thresholdKey = this._getThresholdKey(metricName);
      if (!thresholdKey || !this.thresholds[thresholdKey]) return;

      const threshold = this.thresholds[thresholdKey];
      const exceeded = this._isThresholdExceeded(metricName, value, threshold);

      if (exceeded) {
        this._triggerAlert(`${metricName}_threshold_exceeded`, {
          metric: metricName,
          value,
          threshold,
          timestamp: Date.now()
        });
      }
    }

    /**
     * فحص الإنذارات
     */
    _checkAlerts(logEntry) {
      this.alerts.forEach((alert, name) => {
        if (this._shouldTriggerAlert(alert, logEntry)) {
          this._triggerAlert(name, logEntry);
        }
      });
    }

    /**
     * تشغيل إنذار
     */
    _triggerAlert(alertName, data) {
      const alert = this.alerts.get(alertName);
      const now = Date.now();

      // فحص فترة التهدئة
      if (alert && alert.lastTriggered && (now - alert.lastTriggered) < alert.cooldown) {
        return;
      }

      // تحديث وقت آخر تشغيل
      if (alert) {
        alert.lastTriggered = now;
      }

      // إرسال الإنذار
      this.alertChannels.forEach(channel => {
        try {
          channel.send(alertName, data);
        } catch (error) {
          Utils.error('Failed to send alert', error);
        }
      });

      // تسجيل الإنذار
      this.logStructured('warn', `Alert triggered: ${alertName}`, data);
    }

    /**
     * إرسال إلى Google Cloud Logging
     */
    _sendToCloudLogging(logEntry) {
      try {
        // في بيئة Google Apps Script
        if (typeof console !== 'undefined') {
          console.log(JSON.stringify(logEntry));
        }
        
        // في بيئة Node.js - يمكن إرسال إلى خدمة خارجية
        if (typeof process !== 'undefined') {
          process.stdout.write(JSON.stringify(logEntry) + '\n');
        }
      } catch (error) {
        // Fallback logging
        Utils.error('Failed to send to cloud logging', error);
      }
    }

    /**
     * حساب معدل الأخطاء
     */
    _calculateErrorRate(metrics) {
      const requests = metrics.filter(m => m.name === 'http_requests_total');
      const errors = requests.filter(m => m.tags.status >= 400);
      
      return requests.length > 0 ? errors.length / requests.length : 0;
    }

    /**
     * حساب معدل نجاح التخزين المؤقت
     */
    _calculateCacheHitRate() {
      // يمكن تحسين هذا بناءً على إحصائيات فعلية من EmbeddingService
      return 0.85; // قيمة افتراضية
    }

    /**
     * حساب المتوسط
     */
    _calculateAverage(metrics) {
      if (metrics.length === 0) return 0;
      const sum = metrics.reduce((acc, m) => acc + m.value, 0);
      return sum / metrics.length;
    }

    /**
     * الحصول على آخر قيمة لمقياس
     */
    _getLatestMetric(metricName) {
      const metrics = Array.from(this.metrics.values())
        .filter(m => m.name === metricName)
        .sort((a, b) => b.timestamp - a.timestamp);
      
      return metrics.length > 0 ? metrics[0].value : null;
    }

    /**
     * توليد معرف طلب فريد
     */
    _generateRequestId() {
      return Math.random().toString(36).substr(2, 9);
    }

    /**
     * تحديد مفتاح العتبة
     */
    _getThresholdKey(metricName) {
      if (metricName.includes('duration')) return 'responseTime';
      if (metricName.includes('error')) return 'errorRate';
      if (metricName.includes('cache')) return 'cacheHitRate';
      if (metricName.includes('memory')) return 'memoryUsage';
      return null;
    }

    /**
     * فحص تجاوز العتبة
     */
    _isThresholdExceeded(metricName, value, threshold) {
      if (metricName.includes('rate') || metricName.includes('percentage')) {
        return value > threshold;
      }
      return value > threshold;
    }

    /**
     * فحص ما إذا كان يجب تشغيل الإنذار
     */
    _shouldTriggerAlert(alert, logEntry) {
      try {
        return alert.condition(logEntry);
      } catch (error) {
        Utils.error('Error evaluating alert condition', error);
        return false;
      }
    }
  }

  // إعداد الإنذارات الافتراضية
  const monitoring = new AdvancedMonitoring();
  
  // إنذار معدل الأخطاء العالي
  monitoring.setupAlert('high_error_rate', 
    (logEntry) => logEntry.level === 'ERROR',
    (data) => console.log('🚨 High error rate detected:', data)
  );

  // إنذار بطء الاستجابة
  monitoring.setupAlert('slow_response',
    (logEntry) => logEntry.metadata.duration > 1000,
    (data) => console.log('⏰ Slow response detected:', data)
  );

  return {
    AdvancedMonitoring: monitoring,
    MODULE_VERSION
  };
});