/**
 * @file monitoring/dashboard.js
 * @description نظام مراقبة متكامل مع مقاييس الأداء
 */

defineModule('Monitoring.Dashboard', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  class PerformanceMonitor {
    constructor() {
      this.metrics = {
        httpRequests: new Map(),
        cacheHitRate: 0,
        embeddingCost: 0,
        responseTime: [],
        errorCount: 0,
        activeUsers: new Set()
      };
      
      this.thresholds = {
        maxResponseTime: 200,
        minCacheHitRate: 0.8,
        maxDailyCost: 50,
        maxErrorRate: 0.01
      };
    }

    recordRequest(req, res, startTime) {
      const duration = Date.now() - startTime;
      const route = req.route?.path || req.url;
      const method = req.method;
      const statusCode = res.statusCode;

      // Record response time
      this.metrics.responseTime.push(duration);
      if (this.metrics.responseTime.length > 1000) {
        this.metrics.responseTime = this.metrics.responseTime.slice(-1000);
      }

      // Record HTTP metrics
      const key = `${method}_${route}_${statusCode}`;
      const current = this.metrics.httpRequests.get(key) || 0;
      this.metrics.httpRequests.set(key, current + 1);

      // Track active users
      const userId = req.headers['user-id'] || 'anonymous';
      this.metrics.activeUsers.add(userId);

      // Check thresholds and alert
      this._checkThresholds(duration, statusCode);

      Utils.log(`Request: ${method} ${route} - ${duration}ms - ${statusCode}`);
    }

    recordCacheHit(hit) {
      const totalRequests = this.metrics.responseTime.length;
      if (totalRequests > 0) {
        this.metrics.cacheHitRate = hit ? 
          (this.metrics.cacheHitRate * (totalRequests - 1) + 1) / totalRequests :
          (this.metrics.cacheHitRate * (totalRequests - 1)) / totalRequests;
      }
    }

    recordEmbeddingCost(tokens, model = 'text-embedding-004') {
      const costPerToken = model === 'text-embedding-004' ? 0.0001 : 0.0002;
      const cost = tokens * costPerToken;
      this.metrics.embeddingCost += cost;

      if (cost > 10) {
        this._alertHighCost(cost);
      }
    }

    getMetrics() {
      const responseTime = this.metrics.responseTime;
      const p95 = this._calculatePercentile(responseTime, 0.95);
      const p99 = this._calculatePercentile(responseTime, 0.99);
      const avgResponseTime = responseTime.length > 0 ? 
        responseTime.reduce((a, b) => a + b, 0) / responseTime.length : 0;

      return {
        performance: {
          avgResponseTime: Math.round(avgResponseTime),
          p95ResponseTime: Math.round(p95),
          p99ResponseTime: Math.round(p99),
          totalRequests: responseTime.length,
          errorRate: this.metrics.errorCount / Math.max(responseTime.length, 1)
        },
        cache: {
          hitRate: Math.round(this.metrics.cacheHitRate * 100) / 100,
          status: this.metrics.cacheHitRate >= this.thresholds.minCacheHitRate ? 'healthy' : 'warning'
        },
        cost: {
          dailyEmbeddingCost: Math.round(this.metrics.embeddingCost * 100) / 100,
          status: this.metrics.embeddingCost <= this.thresholds.maxDailyCost ? 'healthy' : 'warning'
        },
        users: {
          activeUsers: this.metrics.activeUsers.size,
          timestamp: new Date().toISOString()
        },
        health: this._getOverallHealth()
      };
    }

    generateReport() {
      const metrics = this.getMetrics();
      
      return {
        summary: `
📊 AzizSys Performance Report
============================
⚡ Avg Response Time: ${metrics.performance.avgResponseTime}ms
📈 95th Percentile: ${metrics.performance.p95ResponseTime}ms
🎯 Cache Hit Rate: ${(metrics.cache.hitRate * 100).toFixed(1)}%
💰 Daily Cost: $${metrics.cost.dailyEmbeddingCost}
👥 Active Users: ${metrics.users.activeUsers}
🔍 Total Requests: ${metrics.performance.totalRequests}
❌ Error Rate: ${(metrics.performance.errorRate * 100).toFixed(2)}%

Overall Health: ${metrics.health.status.toUpperCase()}
        `,
        metrics,
        recommendations: this._generateRecommendations(metrics)
      };
    }

    _checkThresholds(duration, statusCode) {
      if (duration > this.thresholds.maxResponseTime) {
        this._alertSlowResponse(duration);
      }

      if (statusCode >= 400) {
        this.metrics.errorCount++;
        this._alertError(statusCode);
      }
    }

    _alertSlowResponse(duration) {
      Utils.log(`⚠️ Slow response detected: ${duration}ms (threshold: ${this.thresholds.maxResponseTime}ms)`);
    }

    _alertHighCost(cost) {
      Utils.log(`💰 High embedding cost: $${cost.toFixed(4)} for single request`);
    }

    _alertError(statusCode) {
      Utils.log(`❌ Error response: ${statusCode}`);
    }

    _calculatePercentile(arr, percentile) {
      if (arr.length === 0) return 0;
      
      const sorted = [...arr].sort((a, b) => a - b);
      const index = Math.ceil(sorted.length * percentile) - 1;
      return sorted[Math.max(0, index)];
    }

    _getOverallHealth() {
      const metrics = this.getMetrics();
      
      let score = 100;
      let issues = [];

      if (metrics.performance.p95ResponseTime > this.thresholds.maxResponseTime) {
        score -= 20;
        issues.push('High response time');
      }

      if (metrics.cache.hitRate < this.thresholds.minCacheHitRate) {
        score -= 15;
        issues.push('Low cache hit rate');
      }

      if (metrics.cost.dailyEmbeddingCost > this.thresholds.maxDailyCost) {
        score -= 10;
        issues.push('High daily cost');
      }

      if (metrics.performance.errorRate > this.thresholds.maxErrorRate) {
        score -= 25;
        issues.push('High error rate');
      }

      return {
        score,
        status: score >= 90 ? 'healthy' : score >= 70 ? 'warning' : 'critical',
        issues
      };
    }

    _generateRecommendations(metrics) {
      const recommendations = [];

      if (metrics.performance.p95ResponseTime > this.thresholds.maxResponseTime) {
        recommendations.push({
          type: 'performance',
          priority: 'high',
          message: 'Consider optimizing slow queries or increasing cache TTL'
        });
      }

      if (metrics.cache.hitRate < this.thresholds.minCacheHitRate) {
        recommendations.push({
          type: 'cache',
          priority: 'medium',
          message: 'Increase cache size or adjust cache strategy'
        });
      }

      if (metrics.cost.dailyEmbeddingCost > this.thresholds.maxDailyCost * 0.8) {
        recommendations.push({
          type: 'cost',
          priority: 'medium',
          message: 'Monitor embedding usage - approaching daily budget limit'
        });
      }

      return recommendations;
    }

    resetDailyMetrics() {
      this.metrics.embeddingCost = 0;
      this.metrics.activeUsers.clear();
      Utils.log('Daily metrics reset');
    }
  }

  // Create singleton instance
  const monitor = new PerformanceMonitor();

  // Auto-reset daily metrics at midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  setTimeout(() => {
    monitor.resetDailyMetrics();
    setInterval(() => monitor.resetDailyMetrics(), 24 * 60 * 60 * 1000);
  }, msUntilMidnight);

  return {
    PerformanceMonitor: monitor,
    MODULE_VERSION
  };
});