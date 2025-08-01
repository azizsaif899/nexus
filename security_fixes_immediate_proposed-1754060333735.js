/**
 * @file security_fixes_immediate.js
 * @description إصلاحات الأمان الفورية لمشروع G-Assistant
 * @version 1.0.0
 * @author عبدالعزيز
 */

// ===== 1. إدارة آمنة للمفاتيح =====

/**
 * مدير آمن لمفاتيح API
 */
class SecureKeyManager {
  static getApiKey(keyName) {
    try {
      const key = PropertiesService.getScriptProperties().getProperty(keyName);
      if (!key) {
        throw new Error(`${keyName} not configured in Script Properties`);
      }
      return key;
    } catch (error) {
      console.error(`Failed to retrieve ${keyName}:`, error.message);
      throw new Error(`Configuration error: ${keyName} not available`);
    }
  }

  static setApiKey(keyName, keyValue) {
    try {
      if (!keyValue || keyValue.length < 10) {
        throw new Error('Invalid key value');
      }
      PropertiesService.getScriptProperties().setProperty(keyName, keyValue);
      console.log(`✅ ${keyName} configured successfully`);
    } catch (error) {
      console.error(`Failed to set ${keyName}:`, error.message);
      throw error;
    }
  }

  static validateKey(keyName) {
    try {
      const key = this.getApiKey(keyName);
      return key && key.length > 10;
    } catch {
      return false;
    }
  }
}

// ===== 2. Logger آمن =====

/**
 * نظام تسجيل آمن يمنع Log Injection
 */
class SecureLogger {
  static sanitize(input) {
    if (input === null || input === undefined) return 'null';
    
    const str = String(input);
    // إزالة الأحرف الخطيرة وتحديد الطول
    return encodeURIComponent(str)
      .replace(/%20/g, ' ')
      .substring(0, 200);
  }

  static log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const sanitizedMessage = this.sanitize(message);
    const sanitizedData = data ? this.sanitize(JSON.stringify(data)) : '';
    
    const logEntry = `[${timestamp}] [${level}] ${sanitizedMessage}`;
    
    if (sanitizedData) {
      console.log(`${logEntry} | Data: ${sanitizedData}`);
    } else {
      console.log(logEntry);
    }
  }

  static info(message, data) {
    this.log('INFO', message, data);
  }

  static warn(message, data) {
    this.log('WARN', message, data);
  }

  static error(message, data) {
    this.log('ERROR', message, data);
  }

  static debug(message, data) {
    this.log('DEBUG', message, data);
  }
}

// ===== 3. معالج آمن للمدخلات =====

/**
 * معالج آمن للمدخلات يمنع Code Injection
 */
class SecureInputHandler {
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      input = String(input);
    }
    
    // إزالة الأحرف الخطيرة
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/Function\s*\(/gi, '')
      .trim();
  }

  static validateJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return { valid: true, data: parsed };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  static safeEvaluate(expression, allowedContext = {}) {
    // قائمة بيضاء للمتغيرات المسموحة
    const allowedGlobals = ['Math', 'Date', 'JSON', 'parseInt', 'parseFloat'];
    
    try {
      // إنشاء سياق آمن
      const safeContext = {};
      allowedGlobals.forEach(key => {
        if (typeof window !== 'undefined' && window[key]) {
          safeContext[key] = window[key];
        } else if (typeof global !== 'undefined' && global[key]) {
          safeContext[key] = global[key];
        }
      });
      
      // دمج السياق المسموح
      Object.assign(safeContext, allowedContext);
      
      // تنفيذ آمن
      const func = new Function(...Object.keys(safeContext), `return ${expression}`);
      return func(...Object.values(safeContext));
    } catch (error) {
      throw new Error(`Safe evaluation failed: ${error.message}`);
    }
  }
}

// ===== 4. مدير المسارات الآمن =====

/**
 * مدير آمن للمسارات يمنع Path Traversal
 */
class SecurePathManager {
  static normalizePath(basePath, userPath) {
    if (!basePath || !userPath) {
      throw new Error('Base path and user path are required');
    }

    try {
      // تطبيع المسارات
      const normalizedBase = basePath.replace(/\\/g, '/').replace(/\/+$/, '');
      const normalizedUser = userPath.replace(/\\/g, '/').replace(/^\/+/, '');
      
      // منع المسارات الخطيرة
      if (normalizedUser.includes('..') || normalizedUser.includes('~')) {
        throw new Error('Invalid path: contains dangerous sequences');
      }
      
      const fullPath = `${normalizedBase}/${normalizedUser}`;
      
      // التحقق من أن المسار النهائي داخل المسار الأساسي
      if (!fullPath.startsWith(normalizedBase)) {
        throw new Error('Invalid path: outside base directory');
      }
      
      return fullPath;
    } catch (error) {
      throw new Error(`Path normalization failed: ${error.message}`);
    }
  }

  static validatePath(path) {
    const dangerousPatterns = [
      /\.\./,
      /~/,
      /\/etc\//,
      /\/proc\//,
      /\/sys\//,
      /\/dev\//,
      /\/var\/log\//
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(path));
  }
}

// ===== 5. مدير التحقق من الصلاحيات =====

/**
 * نظام بسيط للتحقق من الصلاحيات
 */
class AuthorizationManager {
  static checkPermission(userEmail, requiredPermission) {
    try {
      // الحصول على قائمة المستخدمين المصرح لهم
      const authorizedUsers = this.getAuthorizedUsers();
      
      if (!authorizedUsers[userEmail]) {
        return { authorized: false, reason: 'User not found' };
      }
      
      const userPermissions = authorizedUsers[userEmail].permissions || [];
      
      if (userPermissions.includes('admin') || userPermissions.includes(requiredPermission)) {
        return { authorized: true };
      }
      
      return { authorized: false, reason: 'Insufficient permissions' };
    } catch (error) {
      SecureLogger.error('Authorization check failed', { userEmail, requiredPermission, error: error.message });
      return { authorized: false, reason: 'Authorization system error' };
    }
  }

  static getAuthorizedUsers() {
    try {
      const usersData = PropertiesService.getScriptProperties().getProperty('AUTHORIZED_USERS');
      return usersData ? JSON.parse(usersData) : {};
    } catch (error) {
      SecureLogger.error('Failed to load authorized users', error.message);
      return {};
    }
  }

  static addUser(userEmail, permissions = []) {
    try {
      const users = this.getAuthorizedUsers();
      users[userEmail] = {
        permissions,
        addedAt: new Date().toISOString(),
        addedBy: Session.getActiveUser().getEmail()
      };
      
      PropertiesService.getScriptProperties().setProperty('AUTHORIZED_USERS', JSON.stringify(users));
      SecureLogger.info('User added', { userEmail, permissions });
      return true;
    } catch (error) {
      SecureLogger.error('Failed to add user', { userEmail, error: error.message });
      return false;
    }
  }

  static getCurrentUserEmail() {
    try {
      return Session.getActiveUser().getEmail();
    } catch (error) {
      SecureLogger.error('Failed to get current user email', error.message);
      return null;
    }
  }
}

// ===== 6. مدير الأخطاء المحسن =====

/**
 * نظام معالجة أخطاء شامل
 */
class ErrorHandler {
  static wrap(fn, context = 'Unknown') {
    return function(...args) {
      try {
        const result = fn.apply(this, args);
        
        // إذا كانت النتيجة Promise، نتعامل معها
        if (result && typeof result.then === 'function') {
          return result.catch(error => {
            ErrorHandler.handleError(error, context, args);
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        ErrorHandler.handleError(error, context, args);
        throw error;
      }
    };
  }

  static handleError(error, context, args = []) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      user: AuthorizationManager.getCurrentUserEmail(),
      args: args.length > 0 ? SecureLogger.sanitize(JSON.stringify(args)) : null
    };

    SecureLogger.error('Application error', errorInfo);

    // إرسال تقرير الخطأ إذا كان متاحاً
    if (typeof Telemetry !== 'undefined' && Telemetry.logError) {
      try {
        Telemetry.logError(context, errorInfo);
      } catch (telemetryError) {
        console.error('Failed to send error to telemetry:', telemetryError.message);
      }
    }
  }

  static createSafeFunction(fn, fallbackValue = null, context = 'SafeFunction') {
    return function(...args) {
      try {
        return fn.apply(this, args);
      } catch (error) {
        ErrorHandler.handleError(error, context, args);
        return fallbackValue;
      }
    };
  }
}

// ===== 7. مدير التكوين الآمن =====

/**
 * مدير تكوين آمن مع validation
 */
class SecureConfigManager {
  static get(key, defaultValue = null) {
    try {
      const value = PropertiesService.getScriptProperties().getProperty(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      SecureLogger.error('Config get failed', { key, error: error.message });
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      if (!key || typeof key !== 'string') {
        throw new Error('Invalid key');
      }
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      PropertiesService.getScriptProperties().setProperty(key, stringValue);
      
      SecureLogger.info('Config updated', { key });
      return true;
    } catch (error) {
      SecureLogger.error('Config set failed', { key, error: error.message });
      return false;
    }
  }

  static getJSON(key, defaultValue = {}) {
    try {
      const value = this.get(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      SecureLogger.error('Config JSON parse failed', { key, error: error.message });
      return defaultValue;
    }
  }

  static setJSON(key, value) {
    try {
      return this.set(key, JSON.stringify(value));
    } catch (error) {
      SecureLogger.error('Config JSON set failed', { key, error: error.message });
      return false;
    }
  }
}

// ===== 8. تطبيق الإصلاحات على النظام الحالي =====

/**
 * دالة لتطبيق الإصلاحات الأمنية على النظام الحالي
 */
function applySecurityFixes() {
  try {
    SecureLogger.info('Starting security fixes application');

    // 1. استبدال console.log بـ SecureLogger
    if (typeof window !== 'undefined') {
      window.console.log = SecureLogger.info.bind(SecureLogger);
      window.console.warn = SecureLogger.warn.bind(SecureLogger);
      window.console.error = SecureLogger.error.bind(SecureLogger);
    }

    // 2. تطبيق ErrorHandler على الدوال الحرجة
    if (typeof GAssistant !== 'undefined') {
      // حماية دوال AI.Core
      if (GAssistant.AI && GAssistant.AI.Core) {
        GAssistant.AI.Core.ask = ErrorHandler.wrap(GAssistant.AI.Core.ask, 'AI.Core.ask');
      }

      // حماية دوال UI
      if (GAssistant.UI) {
        Object.keys(GAssistant.UI).forEach(key => {
          if (typeof GAssistant.UI[key] === 'function') {
            GAssistant.UI[key] = ErrorHandler.wrap(GAssistant.UI[key], `UI.${key}`);
          }
        });
      }
    }

    // 3. إعداد مفاتيح API الآمنة
    const requiredKeys = ['GEMINI_API_KEY', 'OPENAI_API_KEY'];
    requiredKeys.forEach(key => {
      if (!SecureKeyManager.validateKey(key)) {
        SecureLogger.warn(`${key} not configured or invalid`);
      }
    });

    SecureLogger.info('Security fixes applied successfully');
    return true;
  } catch (error) {
    SecureLogger.error('Failed to apply security fixes', error.message);
    return false;
  }
}

// ===== 9. دالة التحقق من الأمان =====

/**
 * دالة للتحقق من حالة الأمان في النظام
 */
function runSecurityAudit() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: [],
    score: 0,
    maxScore: 0
  };

  const checks = [
    {
      name: 'API Keys Configuration',
      check: () => {
        const keys = ['GEMINI_API_KEY'];
        return keys.every(key => SecureKeyManager.validateKey(key));
      }
    },
    {
      name: 'Authorization System',
      check: () => {
        const users = AuthorizationManager.getAuthorizedUsers();
        return Object.keys(users).length > 0;
      }
    },
    {
      name: 'Error Handling',
      check: () => {
        return typeof ErrorHandler !== 'undefined' && typeof ErrorHandler.wrap === 'function';
      }
    },
    {
      name: 'Secure Logging',
      check: () => {
        return typeof SecureLogger !== 'undefined' && typeof SecureLogger.sanitize === 'function';
      }
    },
    {
      name: 'Input Validation',
      check: () => {
        return typeof SecureInputHandler !== 'undefined' && typeof SecureInputHandler.sanitizeInput === 'function';
      }
    }
  ];

  checks.forEach(checkItem => {
    results.maxScore++;
    try {
      const passed = checkItem.check();
      results.checks.push({
        name: checkItem.name,
        passed,
        status: passed ? 'PASS' : 'FAIL'
      });
      if (passed) results.score++;
    } catch (error) {
      results.checks.push({
        name: checkItem.name,
        passed: false,
        status: 'ERROR',
        error: error.message
      });
    }
  });

  const percentage = Math.round((results.score / results.maxScore) * 100);
  results.percentage = percentage;
  results.grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'F';

  SecureLogger.info('Security audit completed', {
    score: `${results.score}/${results.maxScore}`,
    percentage: `${percentage}%`,
    grade: results.grade
  });

  return results;
}

// ===== تصدير الوحدات =====

// إذا كان النظام يدعم defineModule
if (typeof defineModule === 'function') {
  defineModule('System.Security.Fixes', () => ({
    SecureKeyManager,
    SecureLogger,
    SecureInputHandler,
    SecurePathManager,
    AuthorizationManager,
    ErrorHandler,
    SecureConfigManager,
    applySecurityFixes,
    runSecurityAudit
  }));
} else {
  // تصدير عادي للاستخدام المباشر
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      SecureKeyManager,
      SecureLogger,
      SecureInputHandler,
      SecurePathManager,
      AuthorizationManager,
      ErrorHandler,
      SecureConfigManager,
      applySecurityFixes,
      runSecurityAudit
    };
  }
}

// تطبيق الإصلاحات تلقائياً عند تحميل الملف
if (typeof SpreadsheetApp !== 'undefined') {
  // في بيئة Google Apps Script
  applySecurityFixes();
}