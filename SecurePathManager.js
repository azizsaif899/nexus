// TASK-SEC-003: SecurePathManager implementation
const path = require('path');

class SecurePathManager {
  constructor() {
    this.allowedPaths = ['/src', '/docs', '/apps'];
  }
  
  sanitizePath(inputPath) {
    // Prevent path traversal attacks
    const normalized = path.normalize(inputPath);
    
    if (normalized.includes('..')) {
      throw new Error('Path traversal detected');
    }
    
    return normalized;
  }
  
  isPathAllowed(filePath) {
    const sanitized = this.sanitizePath(filePath);
    return this.allowedPaths.some(allowed => sanitized.startsWith(allowed));
  }
  
  secureFileAccess(filePath) {
    try {
      const safePath = this.sanitizePath(filePath);
      console.log(`🔒 Secured path access: ${safePath}`);
      return safePath;
    } catch (error) {
      console.error(`❌ Path traversal blocked: ${filePath}`);
      return null;
    }
  }
}

module.exports = SecurePathManager;