// monitor/metrics.js - جمع المؤشرات
class MetricsCollector {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      cacheHits: 0,
      totalProcessingTime: 0,
      errors: []
    };
  }

  recordProcessing(data) {
    this.metrics.totalRequests++;
    
    if (data.success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.errors.push({
        timestamp: new Date().toISOString(),
        error: data.error,
        type: data.type
      });
    }
    
    if (data.cached) {
      this.metrics.cacheHits++;
    }
    
    this.metrics.totalProcessingTime += data.duration;
  }

  async getStats() {
    const avgProcessingTime = this.metrics.totalRequests > 0 
      ? this.metrics.totalProcessingTime / this.metrics.totalRequests 
      : 0;
    
    const successRate = this.metrics.totalRequests > 0 
      ? (this.metrics.successfulRequests / this.metrics.totalRequests) * 100 
      : 0;
    
    const cacheHitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100 
      : 0;

    return {
      totalRequests: this.metrics.totalRequests,
      successRate: `${successRate.toFixed(1)}%`,
      cacheHitRate: `${cacheHitRate.toFixed(1)}%`,
      avgProcessingTime: `${avgProcessingTime.toFixed(0)}ms`,
      recentErrors: this.metrics.errors.slice(-5),
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      cacheHits: 0,
      totalProcessingTime: 0,
      errors: []
    };
  }
}

module.exports = { MetricsCollector };