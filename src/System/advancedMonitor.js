/**
 * نظام المراقبة المتقدم - المرحلة الرابعة
 * مراقبة شاملة مع تنبيهات ذكية
 */

defineModule('System.AdvancedMonitor', ({ Utils, Config }) => {

  class AdvancedMonitor {
    constructor() {
      this.metrics = new Map();
      this.alerts = [];
      this.thresholds = {
        responseTime: { warning: 100, critical: 200 },
        memoryUsage: { warning: 200, critical: 300 },
        searchAccuracy: { warning: 0.85, critical: 0.80 },
        cacheHitRate: { warning: 0.80, critical: 0.70 },
        errorRate: { warning: 0.05, critical: 0.10 }
      };
      this.dashboard = {
        realTimeData: new Map(),
        historicalData: [],
        systemHealth: 'healthy'
      };
      this.alertHandlers = new Map();
      this.isMonitoring = false;
    }

    /**
     * بدء المراقبة المتقدمة
     */
    startMonitoring() {
      if (this.isMonitoring) {
        Logger.warn('Advanced monitoring already running');
        return;
      }

      this.isMonitoring = true;
      Logger.log('🚀 بدء نظام المراقبة المتقدم...');

      // مراقبة دورية كل 30 ثانية
      this.monitoringInterval = setInterval(() => {
        this.collectSystemMetrics();
        this.analyzeMetrics();
        this.updateDashboard();
        this.checkAlerts();
      }, 30000);

      // مراقبة فورية للأحداث الحرجة
      this.setupRealTimeMonitoring();

      Logger.log('✅ نظام المراقبة المتقدم نشط');
    }

    /**
     * إيقاف المراقبة
     */
    stopMonitoring() {
      if (!this.isMonitoring) return;

      this.isMonitoring = false;
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
      }

      Logger.log('⏹️ تم إيقاف نظام المراقبة المتقدم');
    }

    /**
     * تحديث مقياس معين
     */
    updateMetric(metricName, value, timestamp = Date.now()) {
      if (!this.metrics.has(metricName)) {
        this.metrics.set(metricName, []);
      }

      const metricData = {
        value,
        timestamp,
        trend: this.calculateTrend(metricName, value)
      };

      this.metrics.get(metricName).push(metricData);
      this.dashboard.realTimeData.set(metricName, metricData);

      // الاحتفاظ بآخر 1000 قراءة فقط
      const metricHistory = this.metrics.get(metricName);
      if (metricHistory.length > 1000) {
        metricHistory.splice(0, metricHistory.length - 1000);
      }

      // فحص التنبيهات فوراً للمقاييس الحرجة
      this.checkMetricAlert(metricName, value);
    }

    /**
     * جمع مقاييس النظام
     */
    collectSystemMetrics() {
      try {
        // مقاييس الأداء
        const performanceOptimizer = Injector.get('Services.PerformanceOptimizer');
        const performanceReport = performanceOptimizer.getPerformanceReport();

        Object.entries(performanceReport.currentMetrics).forEach(([metric, value]) => {
          this.updateMetric(metric, value);
        });

        // مقاييس النظام
        this.updateMetric('systemUptime', this.getSystemUptime());
        this.updateMetric('activeUsers', this.getActiveUsers());
        this.updateMetric('apiCalls', this.getApiCallsCount());
        this.updateMetric('errorCount', this.getErrorCount());

        // مقاييس الذاكرة والمعالج
        this.updateMetric('cpuUsage', this.getCpuUsage());
        this.updateMetric('memoryUsage', this.getMemoryUsage());

      } catch (error) {
        Logger.error('Failed to collect system metrics:', error);
        this.createAlert('system', 'critical', 'فشل في جمع مقاييس النظام', error.message);
      }
    }

    /**
     * تحليل المقاييس والاتجاهات
     */
    analyzeMetrics() {
      const analysis = {
        trends: new Map(),
        anomalies: [],
        predictions: new Map(),
        recommendations: []
      };

      this.metrics.forEach((history, metricName) => {
        if (history.length < 5) return; // نحتاج بيانات كافية للتحليل

        // تحليل الاتجاه
        const trend = this.analyzeTrend(history);
        analysis.trends.set(metricName, trend);

        // كشف الشذوذ
        const anomalies = this.detectAnomalies(history);
        if (anomalies.length > 0) {
          analysis.anomalies.push({ metric: metricName, anomalies });
        }

        // التنبؤ بالقيم المستقبلية
        const prediction = this.predictFutureValue(history);
        analysis.predictions.set(metricName, prediction);

        // اقتراحات التحسين
        const recommendations = this.generateRecommendations(metricName, history, trend);
        if (recommendations.length > 0) {
          analysis.recommendations.push(...recommendations);
        }
      });

      this.dashboard.analysis = analysis;
      return analysis;
    }

    /**
     * تحديث لوحة التحكم
     */
    updateDashboard() {
      const dashboard = {
        timestamp: new Date().toISOString(),
        systemHealth: this.calculateSystemHealth(),
        metrics: {
          current: Object.fromEntries(this.dashboard.realTimeData),
          trends: this.getTrendsSummary(),
          alerts: this.getActiveAlerts()
        },
        performance: {
          responseTime: this.getAverageResponseTime(),
          throughput: this.getThroughput(),
          errorRate: this.getErrorRate(),
          availability: this.getAvailability()
        },
        resources: {
          cpu: this.getCpuUsage(),
          memory: this.getMemoryUsage(),
          storage: this.getStorageUsage(),
          network: this.getNetworkUsage()
        }
      };

      this.dashboard = { ...this.dashboard, ...dashboard };

      // حفظ البيانات التاريخية
      this.dashboard.historicalData.push({
        timestamp: dashboard.timestamp,
        snapshot: { ...dashboard }
      });

      // الاحتفاظ بآخر 24 ساعة من البيانات
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      this.dashboard.historicalData = this.dashboard.historicalData.filter(
        entry => new Date(entry.timestamp).getTime() > oneDayAgo
      );
    }

    /**
     * فحص التنبيهات
     */
    checkAlerts() {
      this.metrics.forEach((history, metricName) => {
        if (history.length === 0) return;

        const latestValue = history[history.length - 1].value;
        this.checkMetricAlert(metricName, latestValue);
      });

      // تنظيف التنبيهات القديمة
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      this.alerts = this.alerts.filter(alert => alert.timestamp > oneHourAgo);
    }

    /**
     * فحص تنبيه مقياس معين
     */
    checkMetricAlert(metricName, value) {
      const threshold = this.thresholds[metricName];
      if (!threshold) return;

      let alertLevel = null;
      let message = '';

      if (metricName === 'searchAccuracy' || metricName === 'cacheHitRate') {
        // للمقاييس التي يجب أن تكون عالية
        if (value < threshold.critical) {
          alertLevel = 'critical';
          message = `${metricName} منخفض جداً: ${value}`;
        } else if (value < threshold.warning) {
          alertLevel = 'warning';
          message = `${metricName} منخفض: ${value}`;
        }
      } else {
        // للمقاييس التي يجب أن تكون منخفضة
        if (value > threshold.critical) {
          alertLevel = 'critical';
          message = `${metricName} مرتفع جداً: ${value}`;
        } else if (value > threshold.warning) {
          alertLevel = 'warning';
          message = `${metricName} مرتفع: ${value}`;
        }
      }

      if (alertLevel) {
        this.createAlert(metricName, alertLevel, message, `القيمة الحالية: ${value}`);
      }
    }

    /**
     * إنشاء تنبيه
     */
    createAlert(source, level, message, details = '') {
      const alert = {
        id: Utils.generateId(),
        source,
        level,
        message,
        details,
        timestamp: Date.now(),
        acknowledged: false,
        resolved: false
      };

      this.alerts.push(alert);

      // إرسال التنبيه للمعالجات المسجلة
      this.notifyAlertHandlers(alert);

      // تسجيل التنبيه
      const logLevel = level === 'critical' ? 'error' : level === 'warning' ? 'warn' : 'info';
      Logger[logLevel](`🚨 تنبيه ${level}: ${message}`, details);

      return alert;
    }

    /**
     * إشعار معالجات التنبيهات
     */
    notifyAlertHandlers(alert) {
      this.alertHandlers.forEach((handler, name) => {
        try {
          handler(alert);
        } catch (error) {
          Logger.error(`Alert handler ${name} failed:`, error);
        }
      });
    }

    /**
     * تسجيل معالج تنبيهات
     */
    registerAlertHandler(name, handler) {
      this.alertHandlers.set(name, handler);
      Logger.log(`📋 تم تسجيل معالج التنبيهات: ${name}`);
    }

    /**
     * الحصول على لوحة التحكم
     */
    getDashboard() {
      return {
        ...this.dashboard,
        isMonitoring: this.isMonitoring,
        metricsCount: this.metrics.size,
        alertsCount: this.alerts.length,
        lastUpdate: new Date().toISOString()
      };
    }

    /**
     * الحصول على التنبيهات النشطة
     */
    getActiveAlerts() {
      return this.alerts
        .filter(alert => !alert.resolved)
        .sort((a, b) => {
          const levelPriority = { critical: 3, warning: 2, info: 1 };
          return levelPriority[b.level] - levelPriority[a.level] || b.timestamp - a.timestamp;
        });
    }

    /**
     * تأكيد تنبيه
     */
    acknowledgeAlert(alertId) {
      const alert = this.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.acknowledged = true;
        alert.acknowledgedAt = Date.now();
        Logger.log(`✅ تم تأكيد التنبيه: ${alert.message}`);
        return true;
      }
      return false;
    }

    /**
     * حل تنبيه
     */
    resolveAlert(alertId, resolution = '') {
      const alert = this.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.resolved = true;
        alert.resolvedAt = Date.now();
        alert.resolution = resolution;
        Logger.log(`✅ تم حل التنبيه: ${alert.message}`);
        return true;
      }
      return false;
    }

    // دوال مساعدة لجمع المقاييس
    getSystemUptime() {
      return Date.now() - (global.systemStartTime || Date.now());
    }

    getActiveUsers() {
      // محاكاة عدد المستخدمين النشطين
      return Math.floor(Math.random() * 50) + 10;
    }

    getApiCallsCount() {
      // محاكاة عدد استدعاءات API
      return Math.floor(Math.random() * 1000) + 500;
    }

    getErrorCount() {
      // محاكاة عدد الأخطاء
      return Math.floor(Math.random() * 10);
    }

    getCpuUsage() {
      // محاكاة استخدام المعالج
      return Math.random() * 100;
    }

    getMemoryUsage() {
      // محاكاة استخدام الذاكرة
      return Math.floor(Math.random() * 200) + 100;
    }

    getStorageUsage() {
      return Math.random() * 100;
    }

    getNetworkUsage() {
      return Math.random() * 100;
    }

    calculateSystemHealth() {
      const criticalAlerts = this.alerts.filter(a => a.level === 'critical' && !a.resolved).length;
      const warningAlerts = this.alerts.filter(a => a.level === 'warning' && !a.resolved).length;

      if (criticalAlerts > 0) return 'critical';
      if (warningAlerts > 3) return 'warning';
      return 'healthy';
    }

    calculateTrend(metricName, currentValue) {
      const history = this.metrics.get(metricName);
      if (!history || history.length < 2) return 'stable';

      const previousValue = history[history.length - 1]?.value || currentValue;
      const change = ((currentValue - previousValue) / previousValue) * 100;

      if (Math.abs(change) < 5) return 'stable';
      return change > 0 ? 'increasing' : 'decreasing';
    }

    analyzeTrend(history) {
      if (history.length < 5) return { direction: 'unknown', confidence: 0 };

      const values = history.slice(-10).map(h => h.value);
      const n = values.length;

      // حساب الانحدار الخطي البسيط
      const sumX = values.reduce((sum, _, i) => sum + i, 0);
      const sumY = values.reduce((sum, val) => sum + val, 0);
      const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
      const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const confidence = Math.abs(slope) > 0.1 ? Math.min(Math.abs(slope) * 10, 1) : 0;

      return {
        direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable',
        slope,
        confidence
      };
    }

    detectAnomalies(history) {
      if (history.length < 10) return [];

      const values = history.slice(-20).map(h => h.value);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      );

      const threshold = 2 * stdDev; // 2 standard deviations
      const anomalies = [];

      values.forEach((value, index) => {
        if (Math.abs(value - mean) > threshold) {
          anomalies.push({
            index: history.length - values.length + index,
            value,
            deviation: Math.abs(value - mean),
            timestamp: history[history.length - values.length + index].timestamp
          });
        }
      });

      return anomalies;
    }

    predictFutureValue(history) {
      if (history.length < 5) return null;

      const trend = this.analyzeTrend(history);
      const lastValue = history[history.length - 1].value;

      // تنبؤ بسيط بناءً على الاتجاه
      const prediction = lastValue + (trend.slope * trend.confidence);

      return {
        value: prediction,
        confidence: trend.confidence,
        timeframe: '30 minutes'
      };
    }

    generateRecommendations(metricName, history, trend) {
      const recommendations = [];
      const lastValue = history[history.length - 1].value;

      if (metricName === 'responseTime' && trend.direction === 'increasing') {
        recommendations.push({
          type: 'performance',
          priority: 'high',
          message: 'زمن الاستجابة يتزايد - يُنصح بتحسين الأداء',
          action: 'optimize_performance'
        });
      }

      if (metricName === 'memoryUsage' && lastValue > 250) {
        recommendations.push({
          type: 'resource',
          priority: 'medium',
          message: 'استخدام الذاكرة مرتفع - يُنصح بتنظيف الذاكرة',
          action: 'cleanup_memory'
        });
      }

      if (metricName === 'searchAccuracy' && trend.direction === 'decreasing') {
        recommendations.push({
          type: 'quality',
          priority: 'high',
          message: 'دقة البحث تتراجع - يُنصح بإعادة تدريب النموذج',
          action: 'retrain_model'
        });
      }

      return recommendations;
    }

    getTrendsSummary() {
      const summary = {};
      this.metrics.forEach((history, metricName) => {
        if (history.length > 0) {
          const trend = this.analyzeTrend(history);
          summary[metricName] = {
            direction: trend.direction,
            confidence: Math.round(trend.confidence * 100)
          };
        }
      });
      return summary;
    }

    getAverageResponseTime() {
      const responseTimeHistory = this.metrics.get('responseTime');
      if (!responseTimeHistory || responseTimeHistory.length === 0) return 0;

      const recent = responseTimeHistory.slice(-10);
      return recent.reduce((sum, h) => sum + h.value, 0) / recent.length;
    }

    getThroughput() {
      const apiCallsHistory = this.metrics.get('apiCalls');
      if (!apiCallsHistory || apiCallsHistory.length < 2) return 0;

      const recent = apiCallsHistory.slice(-2);
      const timeDiff = (recent[1].timestamp - recent[0].timestamp) / 1000; // seconds
      const callsDiff = recent[1].value - recent[0].value;

      return callsDiff / timeDiff; // calls per second
    }

    getErrorRate() {
      const errorHistory = this.metrics.get('errorCount');
      const apiHistory = this.metrics.get('apiCalls');

      if (!errorHistory || !apiHistory || errorHistory.length === 0 || apiHistory.length === 0) {
        return 0;
      }

      const latestErrors = errorHistory[errorHistory.length - 1].value;
      const latestCalls = apiHistory[apiHistory.length - 1].value;

      return latestCalls > 0 ? latestErrors / latestCalls : 0;
    }

    getAvailability() {
      const uptime = this.getSystemUptime();
      const totalTime = uptime + (this.getErrorCount() * 1000); // assume 1 second downtime per error

      return uptime / totalTime;
    }

    setupRealTimeMonitoring() {
      // مراقبة الأحداث الحرجة في الوقت الفعلي
      Logger.log('🔄 إعداد المراقبة الفورية...');

      // يمكن إضافة WebSocket أو EventSource هنا للمراقبة الفورية
    }
  }

  return new AdvancedMonitor();
});
