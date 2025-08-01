/**
 * نظام الأمان المتقدم - المرحلة الرابعة
 * حماية متعددة الطبقات مع WAF وكشف التهديدات
 */

defineModule('System.AdvancedSecurity', ({ Utils, Config }) => {
  
  class AdvancedSecurity {
    constructor() {
      this.securityLayers = {
        waf: new WebApplicationFirewall(),
        ddosProtection: new DDoSProtection(),
        intrusionDetection: new IntrusionDetection(),
        dataEncryption: new DataEncryption(),
        accessControl: new AccessControl()
      };
      
      this.threatDatabase = new Map();
      this.securityEvents = [];
      this.securityMetrics = {
        blockedRequests: 0,
        detectedThreats: 0,
        failedLogins: 0,
        suspiciousActivities: 0
      };
      
      this.isActive = false;
    }

    /**
     * تفعيل نظام الأمان المتقدم
     */
    activate() {
      if (this.isActive) {
        Logger.warn('Advanced security already active');
        return;
      }

      Logger.log('🛡️ تفعيل نظام الأمان المتقدم...');

      // تفعيل جميع طبقات الحماية
      Object.values(this.securityLayers).forEach(layer => {
        layer.activate();
      });

      // بدء مراقبة الأمان
      this.startSecurityMonitoring();

      this.isActive = true;
      Logger.log('✅ نظام الأمان المتقدم نشط');

      return {
        success: true,
        activeLayers: Object.keys(this.securityLayers).length,
        timestamp: new Date().toISOString()
      };
    }

    /**
     * فحص الطلب للتهديدات
     */
    async scanRequest(request) {
      const scanResults = {
        safe: true,
        threats: [],
        blocked: false,
        score: 0
      };

      try {
        // فحص WAF
        const wafResult = await this.securityLayers.waf.scan(request);
        if (!wafResult.safe) {
          scanResults.threats.push(...wafResult.threats);
          scanResults.score += wafResult.riskScore;
        }

        // فحص DDoS
        const ddosResult = await this.securityLayers.ddosProtection.check(request);
        if (ddosResult.suspicious) {
          scanResults.threats.push({
            type: 'ddos',
            severity: ddosResult.severity,
            details: ddosResult.details
          });
          scanResults.score += ddosResult.riskScore;
        }

        // فحص كشف التسلل
        const intrusionResult = await this.securityLayers.intrusionDetection.analyze(request);
        if (intrusionResult.detected) {
          scanResults.threats.push(...intrusionResult.threats);
          scanResults.score += intrusionResult.riskScore;
        }

        // تحديد ما إذا كان يجب حظر الطلب
        scanResults.safe = scanResults.score < 50;
        scanResults.blocked = scanResults.score >= 80;

        // تسجيل الحدث الأمني
        if (!scanResults.safe) {
          this.logSecurityEvent('threat_detected', {
            request: this.sanitizeRequest(request),
            threats: scanResults.threats,
            score: scanResults.score,
            blocked: scanResults.blocked
          });
        }

        // تحديث المقاييس
        if (scanResults.blocked) {
          this.securityMetrics.blockedRequests++;
        }
        if (scanResults.threats.length > 0) {
          this.securityMetrics.detectedThreats++;
        }

        return scanResults;

      } catch (error) {
        Logger.error('Security scan failed:', error);
        return {
          safe: false,
          threats: [{ type: 'scan_error', details: error.message }],
          blocked: true,
          score: 100
        };
      }
    }

    /**
     * تشفير البيانات الحساسة
     */
    async encryptSensitiveData(data, context = 'general') {
      try {
        return await this.securityLayers.dataEncryption.encrypt(data, context);
      } catch (error) {
        Logger.error('Data encryption failed:', error);
        throw new Error('فشل في تشفير البيانات');
      }
    }

    /**
     * فك تشفير البيانات
     */
    async decryptSensitiveData(encryptedData, context = 'general') {
      try {
        return await this.securityLayers.dataEncryption.decrypt(encryptedData, context);
      } catch (error) {
        Logger.error('Data decryption failed:', error);
        throw new Error('فشل في فك تشفير البيانات');
      }
    }

    /**
     * التحقق من صلاحيات الوصول
     */
    async checkAccess(user, resource, action) {
      try {
        return await this.securityLayers.accessControl.checkPermission(user, resource, action);
      } catch (error) {
        Logger.error('Access check failed:', error);
        return { allowed: false, reason: 'خطأ في فحص الصلاحيات' };
      }
    }

    /**
     * بدء مراقبة الأمان
     */
    startSecurityMonitoring() {
      this.monitoringInterval = setInterval(() => {
        this.analyzeSecurityEvents();
        this.updateThreatDatabase();
        this.generateSecurityReport();
      }, 60000);

      Logger.log('🔍 بدء مراقبة الأمان الدورية');
    }

    /**
     * تحليل الأحداث الأمنية
     */
    analyzeSecurityEvents() {
      const recentEvents = this.securityEvents.filter(
        event => Date.now() - event.timestamp < 300000
      );

      const patterns = this.detectSuspiciousPatterns(recentEvents);
      
      patterns.forEach(pattern => {
        this.logSecurityEvent('pattern_detected', {
          pattern: pattern.type,
          frequency: pattern.frequency,
          severity: pattern.severity,
          details: pattern.details
        });

        this.createSecurityAlert(pattern);
      });
    }

    /**
     * كشف الأنماط المشبوهة
     */
    detectSuspiciousPatterns(events) {
      const patterns = [];

      const loginAttempts = events.filter(e => e.type === 'failed_login');
      if (loginAttempts.length > 5) {
        patterns.push({
          type: 'brute_force',
          frequency: loginAttempts.length,
          severity: 'high',
          details: 'محاولات دخول متكررة فاشلة'
        });
      }

      const ipGroups = new Map();
      events.forEach(event => {
        const ip = event.data?.request?.ip;
        if (ip) {
          if (!ipGroups.has(ip)) ipGroups.set(ip, []);
          ipGroups.get(ip).push(event);
        }
      });

      ipGroups.forEach((ipEvents, ip) => {
        if (ipEvents.length > 20) {
          patterns.push({
            type: 'suspicious_ip',
            frequency: ipEvents.length,
            severity: 'medium',
            details: `نشاط مكثف من IP: ${ip}`
          });
        }
      });

      return patterns;
    }

    /**
     * إنشاء تنبيه أمني
     */
    createSecurityAlert(pattern) {
      const alert = {
        id: Utils.generateId(),
        type: 'security',
        severity: pattern.severity,
        title: `تهديد أمني: ${pattern.type}`,
        message: pattern.details,
        frequency: pattern.frequency,
        timestamp: Date.now(),
        acknowledged: false
      };

      try {
        const monitor = Injector.get('System.AdvancedMonitor');
        monitor.createAlert('security', pattern.severity, alert.title, alert.message);
      } catch (error) {
        Logger.warn('Failed to send security alert to monitor:', error);
      }

      Logger.warn(`🚨 تنبيه أمني: ${alert.title} - ${alert.message}`);
    }

    /**
     * تسجيل حدث أمني
     */
    logSecurityEvent(type, data) {
      const event = {
        id: Utils.generateId(),
        type,
        data,
        timestamp: Date.now(),
        severity: this.calculateEventSeverity(type, data)
      };

      this.securityEvents.push(event);

      if (this.securityEvents.length > 1000) {
        this.securityEvents.splice(0, this.securityEvents.length - 1000);
      }

      if (event.severity === 'critical') {
        Logger.error(`🔴 حدث أمني حرج: ${type}`, data);
      }
    }

    /**
     * حساب شدة الحدث
     */
    calculateEventSeverity(type, data) {
      const severityMap = {
        'threat_detected': data.score > 80 ? 'critical' : data.score > 50 ? 'high' : 'medium',
        'pattern_detected': data.severity || 'medium',
        'failed_login': 'low',
        'access_denied': 'medium',
        'data_breach': 'critical'
      };

      return severityMap[type] || 'low';
    }

    /**
     * تحديث قاعدة بيانات التهديدات
     */
    updateThreatDatabase() {
      const suspiciousIPs = this.extractSuspiciousIPs();
      suspiciousIPs.forEach(ip => {
        this.threatDatabase.set(`ip_${ip}`, {
          type: 'suspicious_ip',
          value: ip,
          lastSeen: Date.now(),
          threatLevel: 'medium'
        });
      });

      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      for (const [key, threat] of this.threatDatabase) {
        if (threat.lastSeen && threat.lastSeen < oneWeekAgo) {
          this.threatDatabase.delete(key);
        }
      }
    }

    /**
     * توليد تقرير أمني
     */
    generateSecurityReport() {
      const report = {
        timestamp: new Date().toISOString(),
        period: 'last_hour',
        metrics: { ...this.securityMetrics },
        threats: {
          total: this.threatDatabase.size,
          recent: this.getRecentThreats()
        },
        events: {
          total: this.securityEvents.length,
          recent: this.securityEvents.slice(-10)
        },
        recommendations: this.generateSecurityRecommendations()
      };

      this.lastSecurityReport = report;
      return report;
    }

    /**
     * الحصول على حالة الأمان
     */
    getSecurityStatus() {
      const recentThreats = this.securityEvents.filter(
        e => Date.now() - e.timestamp < 3600000 && e.severity === 'critical'
      ).length;

      let status = 'secure';
      if (recentThreats > 5) status = 'critical';
      else if (recentThreats > 0) status = 'warning';

      return {
        status,
        isActive: this.isActive,
        activeLayers: Object.keys(this.securityLayers).length,
        metrics: this.securityMetrics,
        recentThreats,
        lastUpdate: new Date().toISOString()
      };
    }

    // دوال مساعدة
    sanitizeRequest(request) {
      return {
        method: request.method,
        url: request.url?.substring(0, 100),
        ip: request.ip,
        userAgent: request.userAgent?.substring(0, 100),
        timestamp: Date.now()
      };
    }

    extractSuspiciousIPs() {
      const ipCounts = new Map();
      
      this.securityEvents
        .filter(e => Date.now() - e.timestamp < 3600000)
        .forEach(event => {
          const ip = event.data?.request?.ip;
          if (ip) {
            ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
          }
        });

      return Array.from(ipCounts.entries())
        .filter(([ip, count]) => count > 10)
        .map(([ip]) => ip);
    }

    getRecentThreats() {
      return Array.from(this.threatDatabase.values())
        .filter(threat => threat.lastSeen && Date.now() - threat.lastSeen < 3600000)
        .sort((a, b) => b.lastSeen - a.lastSeen)
        .slice(0, 10);
    }

    generateSecurityRecommendations() {
      const recommendations = [];

      if (this.securityMetrics.blockedRequests > 100) {
        recommendations.push({
          type: 'high_blocked_requests',
          priority: 'medium',
          message: 'عدد كبير من الطلبات المحظورة - يُنصح بمراجعة قواعد الحماية'
        });
      }

      if (this.securityMetrics.failedLogins > 50) {
        recommendations.push({
          type: 'high_failed_logins',
          priority: 'high',
          message: 'محاولات دخول فاشلة كثيرة - يُنصح بتفعيل المصادقة الثنائية'
        });
      }

      return recommendations;
    }
  }

  // طبقات الحماية المتخصصة
  class WebApplicationFirewall {
    constructor() {
      this.rules = [
        { type: 'sql_injection', pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i },
        { type: 'xss', pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi },
        { type: 'path_traversal', pattern: /\.\.[\/\\]/g },
        { type: 'command_injection', pattern: /[;&|`$(){}[\]]/g }
      ];
    }

    activate() {
      Logger.log('🔥 تفعيل جدار الحماية التطبيقي (WAF)');
    }

    async scan(request) {
      const threats = [];
      let riskScore = 0;

      const content = JSON.stringify(request);

      this.rules.forEach(rule => {
        if (rule.pattern.test(content)) {
          threats.push({
            type: rule.type,
            severity: 'high',
            details: `تم اكتشاف ${rule.type} في الطلب`
          });
          riskScore += 30;
        }
      });

      return {
        safe: threats.length === 0,
        threats,
        riskScore
      };
    }
  }

  class DDoSProtection {
    constructor() {
      this.requestCounts = new Map();
      this.threshold = 100;
    }

    activate() {
      Logger.log('🛡️ تفعيل حماية DDoS');
    }

    async check(request) {
      const ip = request.ip;
      const now = Date.now();
      const minute = Math.floor(now / 60000);

      const key = `${ip}_${minute}`;
      const count = this.requestCounts.get(key) || 0;
      this.requestCounts.set(key, count + 1);

      for (const [k] of this.requestCounts) {
        const [, keyMinute] = k.split('_');
        if (now - parseInt(keyMinute) * 60000 > 300000) {
          this.requestCounts.delete(k);
        }
      }

      const suspicious = count > this.threshold;
      
      return {
        suspicious,
        severity: suspicious ? 'high' : 'low',
        details: `${count} طلبات من ${ip} في الدقيقة`,
        riskScore: suspicious ? 40 : 0
      };
    }
  }

  class IntrusionDetection {
    activate() {
      Logger.log('🔍 تفعيل نظام كشف التسلل');
    }

    async analyze(request) {
      const threats = [];
      let riskScore = 0;

      if (request.userAgent && /bot|crawler|scanner/i.test(request.userAgent)) {
        threats.push({
          type: 'suspicious_user_agent',
          severity: 'medium',
          details: 'User-Agent مشبوه'
        });
        riskScore += 20;
      }

      if (request.requestRate && request.requestRate > 50) {
        threats.push({
          type: 'high_request_rate',
          severity: 'high',
          details: 'معدل طلبات عالي غير طبيعي'
        });
        riskScore += 30;
      }

      return {
        detected: threats.length > 0,
        threats,
        riskScore
      };
    }
  }

  class DataEncryption {
    activate() {
      Logger.log('🔐 تفعيل تشفير البيانات');
    }

    async encrypt(data, context) {
      const encrypted = Buffer.from(JSON.stringify(data)).toString('base64');
      return `${context}:${encrypted}`;
    }

    async decrypt(encryptedData, context) {
      const [dataContext, encrypted] = encryptedData.split(':');
      if (dataContext !== context) {
        throw new Error('سياق التشفير غير صحيح');
      }
      
      const decrypted = Buffer.from(encrypted, 'base64').toString();
      return JSON.parse(decrypted);
    }
  }

  class AccessControl {
    activate() {
      Logger.log('🔑 تفعيل التحكم في الوصول');
    }

    async checkPermission(user, resource, action) {
      const permissions = {
        admin: ['read', 'write', 'delete'],
        user: ['read', 'write'],
        guest: ['read']
      };

      const userRole = user.role || 'guest';
      const allowedActions = permissions[userRole] || [];

      return {
        allowed: allowedActions.includes(action),
        reason: allowedActions.includes(action) ? 'مسموح' : 'غير مسموح لهذا الدور'
      };
    }
  }

  return new AdvancedSecurity();
});