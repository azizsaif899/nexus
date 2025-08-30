// TASK-SEC-004: SecureLogger implementation
class SecureLogger {
  constructor() {
    this.logLevel = 'INFO';
    this.sanitizeInput = true;
  }
  
  sanitize(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential log injection patterns
    return input
      .replace(/[\r\n]/g, '')
      .replace(/\x00/g, '')
      .replace(/<script/gi, '&lt;script')
      .substring(0, 1000); // Limit length
  }
  
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const sanitizedMessage = this.sanitize(message);
    const sanitizedData = this.sanitizeObject(data);
    
    console.log(`[${timestamp}] ${level}: ${sanitizedMessage}`, sanitizedData);
  }
  
  sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = typeof value === 'string' ? this.sanitize(value) : value;
    }
    return sanitized;
  }
  
  info(message, data) { this.log('INFO', message, data); }
  warn(message, data) { this.log('WARN', message, data); }
  error(message, data) { this.log('ERROR', message, data); }
}

module.exports = SecureLogger;