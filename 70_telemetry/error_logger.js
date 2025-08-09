const fs = require('fs');
const path = require('path');

class ErrorLogger {
  constructor() {
    this.logPath = path.join(__dirname, '../docs/6_fixing/reports/errors_log.json');
    this.ensureLogFile();
  }

  ensureLogFile() {
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, JSON.stringify({ errors: [] }, null, 2));
    }
  }

  logError(error, context = {}) {
    const errorEntry = {
      id: `ERR-${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context,
      severity: this.determineSeverity(error)
    };

    try {
      const logs = JSON.parse(fs.readFileSync(this.logPath, 'utf8'));
      logs.errors.unshift(errorEntry);
      
      // Keep only last 100 errors
      if (logs.errors.length > 100) {
        logs.errors = logs.errors.slice(0, 100);
      }
      
      fs.writeFileSync(this.logPath, JSON.stringify(logs, null, 2));
      
      // Send alert for critical errors
      if (errorEntry.severity === 'critical') {
        this.sendCriticalAlert(errorEntry);
      }
      
      return errorEntry.id;
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  determineSeverity(error) {
    const message = error.message || error.toString();
    if (message.includes('ENOENT') || message.includes('permission')) return 'low';
    if (message.includes('timeout') || message.includes('network')) return 'medium';
    if (message.includes('critical') || message.includes('fatal')) return 'critical';
    return 'medium';
  }

  sendCriticalAlert(errorEntry) {
    console.log(`🔥 خطأ حرج: ${errorEntry.message}`);
  }

  getRecentErrors(limit = 10) {
    try {
      const logs = JSON.parse(fs.readFileSync(this.logPath, 'utf8'));
      return logs.errors.slice(0, limit);
    } catch {
      return [];
    }
  }
}

module.exports = ErrorLogger;