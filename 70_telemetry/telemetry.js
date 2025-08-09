const fs = require('fs');
const path = require('path');
const ErrorLogger = require('./error_logger');

class TelemetrySystem {
  constructor() {
    this.errorLogger = new ErrorLogger();
    this.metricsPath = path.join(__dirname, '../docs/6_fixing/reports/system_metrics.json');
    this.startTime = Date.now();
  }

  collectMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      }
    };

    this.saveMetrics(metrics);
    return metrics;
  }

  saveMetrics(metrics) {
    try {
      let allMetrics = { metrics: [] };
      if (fs.existsSync(this.metricsPath)) {
        allMetrics = JSON.parse(fs.readFileSync(this.metricsPath, 'utf8'));
      }
      
      allMetrics.metrics.unshift(metrics);
      
      // Keep only last 50 metric entries
      if (allMetrics.metrics.length > 50) {
        allMetrics.metrics = allMetrics.metrics.slice(0, 50);
      }
      
      fs.writeFileSync(this.metricsPath, JSON.stringify(allMetrics, null, 2));
    } catch (error) {
      this.errorLogger.logError(error, { context: 'saveMetrics' });
    }
  }

  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data
    };
    
    console.log(`📊 Event: ${eventName}`, data);
    return event;
  }

  startMonitoring(intervalMs = 60000) {
    setInterval(() => {
      this.collectMetrics();
    }, intervalMs);
    
    console.log('🔍 نظام المراقبة نشط');
  }
}

module.exports = TelemetrySystem;