/**
 * @file advanced_security_system.js
 * @description نظام أمان متقدم شامل لمشروع G-Assistant
 * @version 2.0.0
 * @date ${new Date().toISOString()}
 */

// ===== نظام إدارة المفاتيح المتقدم =====
class AdvancedSecureKeyManager {
  static keyCache = new Map();
  static keyPatterns = {
    'GEMINI_API_KEY': /^AIzaSy[A-Za-z0-9_-]{33}$/,
    'OPENAI_API_KEY': /^sk-[A-Za-z0-9]{48}$/,
    'CLAUDE_API_KEY': /^sk-ant-[A-Za-z0-9_-]+$/,
    'VERTEX_AI_KEY': /^[A-Za-z0-9_-]{40,}$/,
    'FIREBASE_KEY': /^[A-Za-z0-9_-]{39}$/
  };
  
  /**
   * الحصول على مفتاح API بشكل آمن
   * @param {string} keyName - اسم المفتاح
   * @param {boolean} useCache - استخدام التخزين المؤقت
   * @returns {string} المفتاح المطلوب
   */
  static getApiKey(keyName, useCache = true) {
    try {
      // التحقق من التخزين المؤقت
      if (useCache && this.keyCache.has(keyName)) {
        const cachedKey = this.keyCache.get(keyName);
        if (this.isKeyValid(cachedKey)) {
          return cachedKey.value;
        } else {
          this.keyCache.delete(keyName);
        }
      }
      
      // الحصول على المفتاح من Script Properties
      const key = PropertiesService.getScriptProperties().getProperty(keyName);
      if (!key) {
        EnhancedSecureLogger.error(`Missing API key: ${keyName}`, null, {
          function: 'getApiKey',
          keyName: keyName
        });
        throw new Error(`${keyName} not configured in Script Properties`);
      }
      
      // التحقق من صحة تنسيق المفتاح
      this.validateKeyFormat(keyName, key);
      
      // حفظ في التخزين المؤقت
      if (useCache) {
        this.keyCache.set(keyName, {
          value: key,
          timestamp: Date.now(),
          expiresAt: Date.now() + (60 * 60 * 1000) // ساعة واحدة
        });
      }
      
      EnhancedSecureLogger.info(`API key retrieved successfully`, null, {
        keyName: keyName,
        cached: useCache
      });
      
      return key;
      
    } catch (error) {
      EnhancedSecureLogger.error(`Failed to retrieve API key`, error.message, {
        keyName: keyName,
        function: 'getApiKey'
      });
      throw error;
    }
  }
  
  /**
   * التحقق من صحة تنسيق المفتاح
   * @param {string} keyName - اسم المفتاح
   * @param {string} key - قيمة المفتاح
   * @returns {boolean} صحة التنسيق
   */
  static validateKeyFormat(keyName, key) {
    const pattern = this.keyPatterns[keyName];
    if (pattern && !pattern.test(key)) {
      throw new Error(`Invalid format for ${keyName}. Please check the key format.`);
    }
    return true;
  }
  
  /**
   * التحقق من صلاحية المفتاح المخزن مؤقتاً
   * @param {Object} cachedKey - المفتاح المخزن
   * @returns {boolean} صلاحية المفتاح
   */
  static isKeyValid(cachedKey) {
    return cachedKey && cachedKey.expiresAt > Date.now();
  }
  
  /**
   * تنظيف التخزين المؤقت من المفاتيح المنتهية الصلاحية
   */
  static cleanupExpiredKeys() {
    const now = Date.now();
    for (const [keyName, cachedKey] of this.keyCache.entries()) {
      if (cachedKey.expiresAt <= now) {
        this.keyCache.delete(keyName);
        EnhancedSecureLogger.info(`Expired key removed from cache`, null, {
          keyName: keyName
        });
      }
    }
  }
  
  /**
   * إعداد مفتاح جديد (للاستخدام في التطوير فقط)
   * @param {string} keyName - اسم المفتاح
   * @param {string} keyValue - قيمة المفتاح
   */
  static setApiKey(keyName, keyValue) {
    if (typeof PropertiesService === 'undefined') {
      throw new Error('PropertiesService not available. This method is for Google Apps Script only.');
    }
    
    this.validateKeyFormat(keyName, keyValue);
    PropertiesService.getScriptProperties().setProperty(keyName, keyValue);
    
    // إزالة من التخزين المؤقت لإجبار إعادة التحميل
    this.keyCache.delete(keyName);
    
    EnhancedSecureLogger.info(`API key updated successfully`, null, {
      keyName: keyName
    });
  }
}

// ===== نظام التسجيل الآمن المحسن =====
class EnhancedSecureLogger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };
  
  static currentLevel = 2; // INFO level by default
  static maxLength = 500;
  static logBuffer = [];
  static maxBufferSize = 100;
  
  /**
   * تنظيف المدخلات من المحتوى الضار
   * @param {any} input - المدخل المراد تنظيفه
   * @returns {string} المدخل المنظف
   */
  static sanitizeInput(input) {
    if (input === null || input === undefined) {
      return 'null';
    }
    
    if (typeof input === 'object') {
      try {
        // إزالة المفاتيح الحساسة قبل التحويل
        const sanitized = this.removeSensitiveData(input);
        input = JSON.stringify(sanitized);
      } catch (e) {
        input = '[Object - JSON stringify failed]';
      }
    }
    
    return encodeURIComponent(String(input))
      .replace(/%20/g, ' ')
      .replace(/%2C/g, ',')
      .replace(/%3A/g, ':')
      .substring(0, this.maxLength);
  }
  
  /**
   * إزالة البيانات الحساسة من الكائن
   * @param {Object} obj - الكائن المراد تنظيفه
   * @returns {Object} الكائن المنظف
   */
  static removeSensitiveData(obj) {
    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth',
      'api_key', 'apikey', 'authorization', 'credential'
    ];
    
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        cleaned[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        cleaned[key] = this.removeSensitiveData(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  
  /**
   * تسجيل رسالة مع مستوى محدد
   * @param {string} level - مستوى التسجيل
   * @param {string} message - الرسالة
   * @param {any} data - البيانات الإضافية
   * @param {Object} context - السياق
   */
  static log(level, message, data = null, context = {}) {
    const levelNum = this.levels[level] || this.levels.INFO;
    if (levelNum > this.currentLevel) {
      return; // تجاهل الرسائل أقل من المستوى المحدد
    }
    
    const timestamp = new Date().toISOString();
    const sanitizedMessage = this.sanitizeInput(message);
    const sanitizedData = data ? this.sanitizeInput(data) : null;
    const sanitizedContext = Object.keys(context).length > 0 ? 
      this.sanitizeInput(context) : null;
    
    const logEntry = {
      timestamp,
      level,
      message: sanitizedMessage,
      ...(sanitizedData && { data: sanitizedData }),
      ...(sanitizedContext && { context: sanitizedContext }),
      source: 'G-Assistant'
    };
    
    // إضافة للمخزن المؤقت
    this.addToBuffer(logEntry);
    
    // التسجيل في وحدة التحكم
    console.log(JSON.stringify(logEntry));
    
    // إرسال للمراقبة المتقدمة إذا كان متاحاً
    this.sendToAdvancedMonitoring(logEntry);
  }
  
  /**
   * إضافة إدخال للمخزن المؤقت
   * @param {Object} logEntry - إدخال السجل
   */
  static addToBuffer(logEntry) {
    this.logBuffer.push(logEntry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift(); // إزالة الأقدم
    }
  }
  
  /**
   * إرسال للمراقبة المتقدمة
   * @param {Object} logEntry - إدخال السجل
   */
  static sendToAdvancedMonitoring(logEntry) {
    try {
      // محاولة إرسال لـ Cloud Logging إذا كان متاحاً
      if (typeof console.cloud !== 'undefined') {
        console.cloud.log(logEntry);
      }
      
      // محاولة إرسال لنظام المراقبة المخصص
      if (typeof SystemMonitoring !== 'undefined') {
        SystemMonitoring.logEvent(logEntry);
      }
    } catch (error) {
      // تجاهل أخطاء المراقبة المتقدمة
      console.warn('Advanced monitoring failed:', error.message);
    }
  }
  
  /**
   * الحصول على السجلات الأخيرة
   * @param {number} count - عدد السجلات المطلوبة
   * @returns {Array} السجلات الأخيرة
   */
  static getRecentLogs(count = 10) {
    return this.logBuffer.slice(-count);
  }
  
  // دوال مساعدة للمستويات المختلفة
  static error(message, data, context) {
    this.log('ERROR', message, data, context);
  }
  
  static warn(message, data, context) {
    this.log('WARN', message, data, context);
  }
  
  static info(message, data, context) {
    this.log('INFO', message, data, context);
  }
  
  static debug(message, data, context) {
    this.log('DEBUG', message, data, context);
  }
  
  /**
   * تعيين مستوى التسجيل
   * @param {string} level - المستوى الجديد
   */
  static setLevel(level) {
    if (this.levels.hasOwnProperty(level)) {
      this.currentLevel = this.levels[level];
      this.info(`Log level set to ${level}`);
    } else {
      this.warn(`Invalid log level: ${level}`);
    }
  }
}

// ===== نظام إدارة الصلاحيات الشامل =====
class ComprehensiveAuthManager {
  static authorizedUsers = new Map();
  static sessionTokens = new Map();
  static roleHierarchy = {
    'admin': ['admin', 'developer', 'user'],
    'developer': ['developer', 'user'],
    'user': ['user']
  };
  
  /**
   * التحقق من صحة المستخدم
   * @param {string} userId - معرف المستخدم
   * @param {string} requiredRole - الدور المطلوب
   * @returns {Object} معلومات المستخدم
   */
  static validateUser(userId, requiredRole = 'user') {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // الحصول على معلومات المستخدم
      const userInfo = this.getUserInfo(userId);
      if (!userInfo) {
        EnhancedSecureLogger.warn(`User not found`, null, {
          userId: userId,
          function: 'validateUser'
        });
        throw new Error('User not found or not authorized');
      }
      
      // التحقق من الصلاحيات
      if (!this.hasRole(userInfo, requiredRole)) {
        EnhancedSecureLogger.warn(`Insufficient permissions`, null, {
          userId: userId,
          userRole: userInfo.role,
          requiredRole: requiredRole
        });
        throw new Error(`Insufficient permissions. Required: ${requiredRole}`);
      }
      
      EnhancedSecureLogger.info(`User validated successfully`, null, {
        userId: userId,
        role: userInfo.role
      });
      
      return userInfo;
      
    } catch (error) {
      EnhancedSecureLogger.error(`User validation failed`, error.message, {
        userId: userId,
        requiredRole: requiredRole
      });
      throw error;
    }
  }
  
  /**
   * الحصول على معلومات المستخدم
   * @param {string} userId - معرف المستخدم
   * @returns {Object|null} معلومات المستخدم
   */
  static getUserInfo(userId) {
    // في بيئة الإنتاج، هذا سيكون استعلام قاعدة بيانات
    // هنا نستخدم نظام بسيط للتطوير
    
    if (this.authorizedUsers.has(userId)) {
      return this.authorizedUsers.get(userId);
    }
    
    // محاولة الحصول من Script Properties
    try {
      const userDataStr = PropertiesService.getScriptProperties()
        .getProperty(`user_${userId}`);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        this.authorizedUsers.set(userId, userData);
        return userData;
      }
    } catch (error) {
      EnhancedSecureLogger.debug(`Failed to load user from properties`, error.message);
    }
    
    return null;
  }
  
  /**
   * التحقق من وجود دور معين للمستخدم
   * @param {Object} userInfo - معلومات المستخدم
   * @param {string} requiredRole - الدور المطلوب
   * @returns {boolean} وجود الصلاحية
   */
  static hasRole(userInfo, requiredRole) {
    if (!userInfo || !userInfo.role) {
      return false;
    }
    
    const userRoles = this.roleHierarchy[userInfo.role] || [userInfo.role];
    return userRoles.includes(requiredRole);
  }
  
  /**
   * إنشاء رمز جلسة آمن
   * @param {string} userId - معرف المستخدم
   * @returns {string} رمز الجلسة
   */
  static generateSessionToken(userId) {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة
    
    this.sessionTokens.set(token, {
      userId,
      expiresAt,
      createdAt: new Date(),
      lastUsed: new Date()
    });
    
    EnhancedSecureLogger.info(`Session token generated`, null, {
      userId: userId,
      tokenPrefix: token.substring(0, 8) + '...'
    });
    
    return token;
  }
  
  /**
   * التحقق من صحة رمز الجلسة
   * @param {string} token - رمز الجلسة
   * @returns {Object} معلومات الجلسة
   */
  static validateSessionToken(token) {
    const session = this.sessionTokens.get(token);
    if (!session) {
      throw new Error('Invalid session token');
    }
    
    if (new Date() > session.expiresAt) {
      this.sessionTokens.delete(token);
      throw new Error('Session token expired');
    }
    
    // تحديث وقت آخر استخدام
    session.lastUsed = new Date();
    
    return session;
  }
  
  /**
   * إنشاء رمز آمن
   * @returns {string} الرمز المُنشأ
   */
  static generateSecureToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'tok_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '_' + Date.now().toString(36);
  }
  
  /**
   * تنظيف الجلسات المنتهية الصلاحية
   */
  static cleanupExpiredSessions() {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [token, session] of this.sessionTokens.entries()) {
      if (session.expiresAt <= now) {
        this.sessionTokens.delete(token);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      EnhancedSecureLogger.info(`Cleaned up expired sessions`, null, {
        count: cleanedCount
      });
    }
  }
}

// ===== نظام إدارة المسارات الآمن =====
class SecurePathManager {
  static allowedDirectories = [
    'src/',
    'updated_docs/',
    'config/',
    'tests/',
    '10_ui/',
    '20_ai/',
    '25_ai_agents/',
    '30_tools/',
    'october_implementation/'
  ];
  
  static writeProtectedPaths = [
    'config/production.json',
    'src/security/',
    '.env',
    'appsscript.json',
    'package.json'
  ];
  
  /**
   * تنظيف المسار من المحارف الخطيرة
   * @param {string} inputPath - المسار المدخل
   * @returns {string} المسار المنظف
   */
  static sanitizePath(inputPath) {
    if (!inputPath || typeof inputPath !== 'string') {
      throw new Error('Invalid path input');
    }
    
    // إزالة المحارف الخطيرة
    let cleanPath = inputPath
      .replace(/\\.\\./g, '')  // إزالة ..
      .replace(/[<>:"|?*]/g, '')  // إزالة محارف خطيرة
      .replace(/\\+/g, '/')  // توحيد الفواصل
      .replace(/\/+/g, '/')  // إزالة الفواصل المتكررة
      .replace(/^\/+/, '')  // إزالة الفواصل من البداية
      .replace(/\/+$/, '');  // إزالة الفواصل من النهاية
    
    // التأكد من أن المسار في المجلدات المسموحة
    const isAllowed = this.allowedDirectories.some(dir => 
      cleanPath.startsWith(dir) || cleanPath === dir.replace('/', '')
    );
    
    if (!isAllowed) {
      EnhancedSecureLogger.warn(`Path access denied`, null, {
        requestedPath: inputPath,
        cleanedPath: cleanPath
      });
      throw new Error(`Path not allowed: ${cleanPath}`);
    }
    
    return cleanPath;
  }
  
  /**
   * التحقق من صلاحيات الوصول للملف
   * @param {string} filePath - مسار الملف
   * @param {string} operation - نوع العملية
   * @returns {string} المسار المنظف
   */
  static validateFileAccess(filePath, operation = 'read') {
    const cleanPath = this.sanitizePath(filePath);
    
    // التحقق من صلاحيات الكتابة
    if (operation === 'write' || operation === 'delete') {
      const isProtected = this.writeProtectedPaths.some(path => 
        cleanPath.includes(path) || cleanPath === path
      );
      
      if (isProtected) {
        EnhancedSecureLogger.warn(`Write operation denied on protected path`, null, {
          path: cleanPath,
          operation: operation
        });
        throw new Error(`${operation} operation not allowed on: ${cleanPath}`);
      }
    }
    
    EnhancedSecureLogger.debug(`File access validated`, null, {
      path: cleanPath,
      operation: operation
    });
    
    return cleanPath;
  }
  
  /**
   * التحقق من امتداد الملف المسموح
   * @param {string} filePath - مسار الملف
   * @param {Array} allowedExtensions - الامتدادات المسموحة
   * @returns {boolean} صحة الامتداد
   */
  static validateFileExtension(filePath, allowedExtensions = ['.js', '.json', '.md', '.html', '.css']) {
    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(extension)) {
      throw new Error(`File extension not allowed: ${extension}`);
    }
    
    return true;
  }
}

// ===== تصدير الوحدات =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdvancedSecureKeyManager,
    EnhancedSecureLogger,
    ComprehensiveAuthManager,
    SecurePathManager
  };
}

// ===== تسجيل الوحدات في نظام G-Assistant =====
if (typeof defineModule === 'function') {
  defineModule('System.Security.Advanced', () => ({
    AdvancedSecureKeyManager,
    EnhancedSecureLogger,
    ComprehensiveAuthManager,
    SecurePathManager
  }));
}

// تسجيل نجاح التحميل
if (typeof EnhancedSecureLogger !== 'undefined') {
  EnhancedSecureLogger.info('Advanced Security System loaded successfully', null, {
    version: '2.0.0',
    modules: ['KeyManager', 'Logger', 'AuthManager', 'PathManager']
  });
}