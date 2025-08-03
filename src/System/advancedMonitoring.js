/**
 * نظام المراقبة المتقدم - المرحلة الخامسة
 * مراقبة شاملة مع Prometheus metrics وتنبيهات ذكية
 */

defineModule('System.AdvancedMonitoring', ({ Utils, Config }) => {

  class AdvancedMonitoring {
    constructor() {
      this.metrics = new Map();
      this.alerts = [];
      this.dashboards = new Map();
      this.isActive = false;

      // Performance counters
      this.counters = {
        httpRequests: new Map(),
        apiCosts: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: new Map()
      };

      // Thresholds for alerting
      this.thresholds = {
        responseTime: { warning: 200, critical: 500 },
        errorRate: { warning: 0.01, critical: 0.05 },
        apiCost: { warning: 50, critical: 100 },
        cacheHitRate: { warning: 0.8, critical: 0.7 },
        memoryUsage: { warning: 70, critical: 85 }
      };

      this.initializeMetrics();
    }

    initializeMetrics() {
      // HTTP request duration histogram
      this.metrics.set('http_request_duration_ms', {
        type: 'histogram',
        help: 'Duration of HTTP requests in milliseconds',
        labels: ['method', 'route', 'status_code'],
        buckets: [50, 100, 200, 500, 1000, 2000, 5000],
        values: new Map()
      });

      // Cache hit rate gauge
      this.metrics.set('cache_hit_rate', {
        type: 'gauge',
        help: 'Cache hit rate percentage',
        value: 0
      });

      // API cost counter
      this.metrics.set('embedding_api_cost', {
        type: 'counter',
        help: 'Total cost of Gemini API usage in USD',
        value: 0
      });

      // Error rate gauge
      this.metrics.set('error_rate', {
        type: 'gauge',
        help: 'Error rate percentage',
        value: 0
      });

      // Memory usage gauge
      this.metrics.set('memory_usage_percent', {
        type: 'gauge',
        help: 'Memory usage percentage',
        value: 0
      });

      // Vector DB operations
      this.metrics.set('vector_db_operations', {
        type: 'counter',
        help: 'Vector database operations count',
        labels: ['operation', 'provider'],
        values: new Map()
      });
    }

    startMonitoring() {
      if (this.isActive) {
        Logger.warn('Advanced monitoring already active');
        return;
      }

      this.isActive = true;
      Logger.log('🚀 Starting advanced monitoring system...');

      // Collect metrics every 30 seconds
      this.metricsInterval = setInterval(() => {
        this.collectSystemMetrics();
        this.updateDashboards();
        this.checkAlerts();
      }, 30000);

      // Generate reports every 5 minutes
      this.reportInterval = setInterval(() => {
        this.generatePerformanceReport();
      }, 300000);

      Logger.log('✅ Advanced monitoring system active');
    }

    stopMonitoring() {
      if (!this.isActive) return;

      this.isActive = false;

      if (this.metricsInterval) clearInterval(this.metricsInterval);
      if (this.reportInterval) clearInterval(this.reportInterval);

      Logger.log('⏹️ Advanced monitoring system stopped');
    }

    // Middleware for Express.js to track HTTP requests
    createHttpMiddleware() {
      return (req, res, next) => {
        const startTime = Date.now();

        res.on('finish', () => {
          const duration = Date.now() - startTime;
          const labels = {
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode.toString()
          };

          this.recordHttpRequest(labels, duration);

          // Alert on slow requests
          if (duration > this.thresholds.responseTime.warning) {
            this.createAlert('slow_request', 'warning',
              `Slow request: ${req.method} ${req.path} took ${duration}ms`);
          }
        });

        next();
      };
    }

    recordHttpRequest(labels, duration) {
      const key = `${labels.method}_${labels.route}_${labels.status_code}`;

      if (!this.counters.httpRequests.has(key)) {
        this.counters.httpRequests.set(key, {
          count: 0,
          totalDuration: 0,
          maxDuration: 0,
          minDuration: Infinity
        });
      }

      const stats = this.counters.httpRequests.get(key);
      stats.count++;
      stats.totalDuration += duration;
      stats.maxDuration = Math.max(stats.maxDuration, duration);
      stats.minDuration = Math.min(stats.minDuration, duration);

      // Update histogram metric
      const histogram = this.metrics.get('http_request_duration_ms');
      const bucketKey = `${labels.method}:${labels.route}:${labels.status_code}`;

      if (!histogram.values.has(bucketKey)) {
        histogram.values.set(bucketKey, { count: 0, sum: 0 });
      }

      const bucket = histogram.values.get(bucketKey);
      bucket.count++;
      bucket.sum += duration;
    }

    trackAPICost(tokens, model = 'text-embedding-004') {
      const costPerToken = model === 'text-embedding-004' ? 0.0001 : 0.0002;
      const cost = tokens * costPerToken;

      this.counters.apiCosts += cost;

      // Update counter metric
      const costMetric = this.metrics.get('embedding_api_cost');
      costMetric.value += cost;

      // Alert on high costs
      if (this.counters.apiCosts > this.thresholds.apiCost.warning) {
        this.createAlert('high_api_cost', 'warning',
          `API costs reached $${this.counters.apiCosts.toFixed(2)}`);
      }
    }

    trackCacheOperation(hit) {
      if (hit) {
        this.counters.cacheHits++;
      } else {
        this.counters.cacheMisses++;
      }

      // Update cache hit rate
      const total = this.counters.cacheHits + this.counters.cacheMisses;
      const hitRate = total > 0 ? this.counters.cacheHits / total : 0;

      const cacheMetric = this.metrics.get('cache_hit_rate');
      cacheMetric.value = hitRate;

      // Alert on low cache hit rate
      if (hitRate < this.thresholds.cacheHitRate.warning) {
        this.createAlert('low_cache_hit_rate', 'warning',
          `Cache hit rate is ${(hitRate * 100).toFixed(1)}%`);
      }
    }

    trackVectorDBOperation(operation, provider, success = true) {
      const vectorMetric = this.metrics.get('vector_db_operations');
      const key = `${operation}:${provider}`;

      if (!vectorMetric.values.has(key)) {
        vectorMetric.values.set(key, { success: 0, failure: 0 });
      }

      const stats = vectorMetric.values.get(key);
      if (success) {
        stats.success++;
      } else {
        stats.failure++;
      }
    }

    collectSystemMetrics() {
      try {
        // Memory usage
        const memoryUsage = this.getMemoryUsage();
        const memoryMetric = this.metrics.get('memory_usage_percent');
        memoryMetric.value = memoryUsage;

        // Error rate
        const errorRate = this.calculateErrorRate();
        const errorMetric = this.metrics.get('error_rate');
        errorMetric.value = errorRate;

        // Update cache hit rate
        this.updateCacheHitRate();

        Logger.log(`📊 Metrics collected - Memory: ${memoryUsage}%, Error Rate: ${(errorRate * 100).toFixed(2)}%`);

      } catch (error) {
        Logger.error('Failed to collect system metrics:', error);
      }
    }

    getMemoryUsage() {
      // Mock memory usage calculation
      const used = Math.random() * 80 + 10; // 10-90%

      if (used > this.thresholds.memoryUsage.critical) {
        this.createAlert('high_memory_usage', 'critical',
          `Memory usage is ${used.toFixed(1)}%`);
      }

      return Math.round(used);
    }

    calculateErrorRate() {
      let totalRequests = 0;
      let errorRequests = 0;

      for (const [key, stats] of this.counters.httpRequests) {
        totalRequests += stats.count;
        if (key.includes('_5') || key.includes('_4')) { // 4xx, 5xx errors
          errorRequests += stats.count;
        }
      }

      return totalRequests > 0 ? errorRequests / totalRequests : 0;
    }

    updateCacheHitRate() {
      const total = this.counters.cacheHits + this.counters.cacheMisses;
      const hitRate = total > 0 ? this.counters.cacheHits / total : 0;

      const cacheMetric = this.metrics.get('cache_hit_rate');
      cacheMetric.value = hitRate;
    }

    createAlert(type, severity, message, details = '') {
      const alert = {
        id: Utils.generateId(),
        type,
        severity,
        message,
        details,
        timestamp: Date.now(),
        acknowledged: false,
        resolved: false
      };

      this.alerts.push(alert);

      // Keep only last 100 alerts
      if (this.alerts.length > 100) {
        this.alerts = this.alerts.slice(-100);
      }

      // Log based on severity
      const logLevel = severity === 'critical' ? 'error' : 'warn';
      Logger[logLevel](`🚨 Alert [${severity}]: ${message}`);

      // Send to external alerting systems
      this.sendExternalAlert(alert);

      return alert;
    }

    sendExternalAlert(alert) {
      // Mock external alerting (Slack, email, etc.)
      if (alert.severity === 'critical') {
        Logger.log(`📧 Sending critical alert to external systems: ${alert.message}`);
      }
    }

    checkAlerts() {
      const activeAlerts = this.alerts.filter(a => !a.resolved);

      if (activeAlerts.length > 10) {
        this.createAlert('too_many_alerts', 'warning',
          `${activeAlerts.length} active alerts detected`);
      }
    }

    updateDashboards() {
      // Main performance dashboard
      this.dashboards.set('performance', {
        timestamp: Date.now(),
        metrics: {
          responseTime: this.getAverageResponseTime(),
          errorRate: this.calculateErrorRate(),
          cacheHitRate: this.metrics.get('cache_hit_rate').value,
          memoryUsage: this.metrics.get('memory_usage_percent').value,
          apiCosts: this.counters.apiCosts
        },
        alerts: this.getActiveAlerts().length,
        status: this.getSystemStatus()
      });

      // Cost optimization dashboard
      this.dashboards.set('costs', {
        timestamp: Date.now(),
        totalApiCosts: this.counters.apiCosts,
        costPerRequest: this.calculateCostPerRequest(),
        projectedMonthlyCost: this.projectMonthlyCost(),
        recommendations: this.getCostOptimizationRecommendations()
      });
    }

    getAverageResponseTime() {
      let totalDuration = 0;
      let totalRequests = 0;

      for (const stats of this.counters.httpRequests.values()) {
        totalDuration += stats.totalDuration;
        totalRequests += stats.count;
      }

      return totalRequests > 0 ? Math.round(totalDuration / totalRequests) : 0;
    }

    calculateCostPerRequest() {
      let totalRequests = 0;
      for (const stats of this.counters.httpRequests.values()) {
        totalRequests += stats.count;
      }

      return totalRequests > 0 ? (this.counters.apiCosts / totalRequests).toFixed(4) : 0;
    }

    projectMonthlyCost() {
      const dailyCost = this.counters.apiCosts;
      return (dailyCost * 30).toFixed(2);
    }

    getCostOptimizationRecommendations() {
      const recommendations = [];

      const cacheHitRate = this.metrics.get('cache_hit_rate').value;
      if (cacheHitRate < 0.8) {
        recommendations.push({
          type: 'cache_optimization',
          message: `Improve cache hit rate from ${(cacheHitRate * 100).toFixed(1)}% to reduce API costs`,
          potentialSavings: `$${(this.counters.apiCosts * (0.8 - cacheHitRate)).toFixed(2)}`
        });
      }

      if (this.counters.apiCosts > 20) {
        recommendations.push({
          type: 'batch_processing',
          message: 'Consider batch processing to reduce API call frequency',
          potentialSavings: '$5-15 per day'
        });
      }

      return recommendations;
    }

    generatePerformanceReport() {
      const report = {
        timestamp: new Date().toISOString(),
        period: 'last_5_minutes',
        summary: {
          totalRequests: Array.from(this.counters.httpRequests.values())
            .reduce((sum, stats) => sum + stats.count, 0),
          averageResponseTime: this.getAverageResponseTime(),
          errorRate: (this.calculateErrorRate() * 100).toFixed(2) + '%',
          cacheHitRate: (this.metrics.get('cache_hit_rate').value * 100).toFixed(1) + '%',
          apiCosts: '$' + this.counters.apiCosts.toFixed(2)
        },
        alerts: {
          active: this.getActiveAlerts().length,
          critical: this.getActiveAlerts().filter(a => a.severity === 'critical').length
        },
        recommendations: this.getPerformanceRecommendations()
      };

      Logger.log('📊 Performance Report Generated');
      return report;
    }

    getPerformanceRecommendations() {
      const recommendations = [];
      const avgResponseTime = this.getAverageResponseTime();

      if (avgResponseTime > 200) {
        recommendations.push('Consider optimizing slow endpoints or adding caching');
      }

      const errorRate = this.calculateErrorRate();
      if (errorRate > 0.01) {
        recommendations.push('Investigate and fix sources of errors');
      }

      const memoryUsage = this.metrics.get('memory_usage_percent').value;
      if (memoryUsage > 70) {
        recommendations.push('Monitor memory usage and consider optimization');
      }

      return recommendations;
    }

    getActiveAlerts() {
      return this.alerts.filter(alert => !alert.resolved);
    }

    getSystemStatus() {
      const criticalAlerts = this.getActiveAlerts().filter(a => a.severity === 'critical').length;
      const warningAlerts = this.getActiveAlerts().filter(a => a.severity === 'warning').length;

      if (criticalAlerts > 0) return 'critical';
      if (warningAlerts > 3) return 'warning';
      return 'healthy';
    }

    getDashboard(name = 'performance') {
      return this.dashboards.get(name) || { error: 'Dashboard not found' };
    }

    getMetrics() {
      const result = {};

      for (const [name, metric] of this.metrics) {
        if (metric.type === 'histogram') {
          result[name] = {
            type: metric.type,
            help: metric.help,
            values: Object.fromEntries(metric.values)
          };
        } else {
          result[name] = {
            type: metric.type,
            help: metric.help,
            value: metric.value
          };
        }
      }

      return result;
    }

    getHealthStatus() {
      return {
        status: this.getSystemStatus(),
        isActive: this.isActive,
        uptime: Date.now() - (this.startTime || Date.now()),
        metrics: {
          totalRequests: Array.from(this.counters.httpRequests.values())
            .reduce((sum, stats) => sum + stats.count, 0),
          activeAlerts: this.getActiveAlerts().length,
          apiCosts: this.counters.apiCosts
        },
        lastUpdate: new Date().toISOString()
      };
    }
  }

  return new AdvancedMonitoring();
});
