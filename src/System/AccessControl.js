/**
 * AccessControl - نظام التحكم في الوصول والأمان
 * يحمي البيانات المالية الحساسة ويتتبع العمليات
 */
defineModule('System.AccessControl', function(injector) {
  const errorLogger = injector.get('System.ErrorLogger');

  return {
    // مستويات الصلاحيات
    PERMISSION_LEVELS: {
      ADMIN: 'admin',
      FINANCIAL_MANAGER: 'financial_manager',
      ANALYST: 'analyst',
      VIEWER: 'viewer',
      GUEST: 'guest'
    },

    // التحقق من صلاحية المستخدم
    checkPermission(requiredLevel, operation = 'unknown') {
      const user = Session.getActiveUser();
      const userLevel = this.getUserPermissionLevel(user.getEmail());

      const hasPermission = this.comparePermissionLevels(userLevel, requiredLevel);

      // تسجيل محاولة الوصول
      this.logAccessAttempt(user.getEmail(), operation, requiredLevel, hasPermission);

      if (!hasPermission) {
        const error = new Error(`Access denied: ${operation} requires ${requiredLevel} permission`);
        errorLogger.logError(error, {
          user: user.getEmail(),
          operation: operation,
          requiredLevel: requiredLevel,
          userLevel: userLevel
        });
        throw error;
      }

      return true;
    },

    // الحصول على مستوى صلاحية المستخدم
    getUserPermissionLevel(email) {
      const permissions = this.getStoredPermissions();
      return permissions[email] || this.PERMISSION_LEVELS.GUEST;
    },

    // مقارنة مستويات الصلاحيات
    comparePermissionLevels(userLevel, requiredLevel) {
      const hierarchy = {
        [this.PERMISSION_LEVELS.ADMIN]: 5,
        [this.PERMISSION_LEVELS.FINANCIAL_MANAGER]: 4,
        [this.PERMISSION_LEVELS.ANALYST]: 3,
        [this.PERMISSION_LEVELS.VIEWER]: 2,
        [this.PERMISSION_LEVELS.GUEST]: 1
      };

      return hierarchy[userLevel] >= hierarchy[requiredLevel];
    },

    // تسجيل محاولات الوصول
    logAccessAttempt(email, operation, requiredLevel, success) {
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName('AccessLog') ||
          SpreadsheetApp.getActiveSpreadsheet().insertSheet('AccessLog');

        if (sheet.getLastRow() === 0) {
          sheet.getRange(1, 1, 1, 6).setValues([[
            'Timestamp', 'User', 'Operation', 'Required Level', 'Success', 'IP Address'
          ]]);
        }

        sheet.appendRow([
          new Date().toISOString(),
          email,
          operation,
          requiredLevel,
          success ? 'GRANTED' : 'DENIED',
          this.getUserIP()
        ]);

        // تنبيه عند محاولة وصول مرفوضة
        if (!success) {
          this.alertUnauthorizedAccess(email, operation);
        }

      } catch (e) {
        console.error('Failed to log access attempt:', e);
      }
    },

    // الحصول على عنوان IP المستخدم
    getUserIP() {
      try {
        // في Google Apps Script، هذا محدود
        return 'N/A';
      } catch (e) {
        return 'Unknown';
      }
    },

    // تنبيه محاولة وصول غير مصرح
    alertUnauthorizedAccess(email, operation) {
      console.warn(`🚨 Unauthorized access attempt: ${email} tried to ${operation}`);

      // إرسال تنبيه للمدير
      try {
        const adminEmail = this.getAdminEmail();
        if (adminEmail) {
          MailApp.sendEmail({
            to: adminEmail,
            subject: '🚨 G-Assistant Security Alert',
            body: `Unauthorized access attempt detected:
            
User: ${email}
Operation: ${operation}
Time: ${new Date().toISOString()}
            
Please review user permissions and investigate if necessary.`
          });
        }
      } catch (e) {
        console.error('Failed to send security alert:', e);
      }
    },

    // إدارة الصلاحيات
    setUserPermission(email, level) {
      this.checkPermission(this.PERMISSION_LEVELS.ADMIN, 'manage_permissions');

      const permissions = this.getStoredPermissions();
      permissions[email] = level;

      PropertiesService.getScriptProperties().setProperty(
        'user_permissions',
        JSON.stringify(permissions)
      );

      console.log(`✅ Permission updated: ${email} -> ${level}`);
    },

    // الحصول على الصلاحيات المحفوظة
    getStoredPermissions() {
      const stored = PropertiesService.getScriptProperties().getProperty('user_permissions');
      return stored ? JSON.parse(stored) : {};
    },

    // تشفير البيانات الحساسة
    encryptSensitiveData(data) {
      try {
        // تشفير بسيط باستخدام Base64 (يمكن تحسينه)
        const encoded = Utilities.base64Encode(JSON.stringify(data));
        return `encrypted:${encoded}`;
      } catch (e) {
        errorLogger.logError(e, { operation: 'encrypt_data' });
        return data; // fallback
      }
    },

    // فك تشفير البيانات
    decryptSensitiveData(encryptedData) {
      try {
        if (!encryptedData.startsWith('encrypted:')) {
          return encryptedData; // not encrypted
        }

        const encoded = encryptedData.replace('encrypted:', '');
        const decoded = Utilities.base64Decode(encoded);
        return JSON.parse(Utilities.newBlob(decoded).getDataAsString());
      } catch (e) {
        errorLogger.logError(e, { operation: 'decrypt_data' });
        return encryptedData; // fallback
      }
    },

    // تدقيق العمليات المالية
    auditFinancialOperation(operation, data, amount = null) {
      this.checkPermission(this.PERMISSION_LEVELS.FINANCIAL_MANAGER, operation);

      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName('FinancialAudit') ||
          SpreadsheetApp.getActiveSpreadsheet().insertSheet('FinancialAudit');

        if (sheet.getLastRow() === 0) {
          sheet.getRange(1, 1, 1, 6).setValues([[
            'Timestamp', 'User', 'Operation', 'Amount', 'Data Hash', 'Status'
          ]]);
        }

        const dataHash = this.generateDataHash(data);

        sheet.appendRow([
          new Date().toISOString(),
          Session.getActiveUser().getEmail(),
          operation,
          amount || 'N/A',
          dataHash,
          'COMPLETED'
        ]);

      } catch (e) {
        errorLogger.logError(e, { operation: 'audit_financial_operation' });
      }
    },

    // توليد hash للبيانات
    generateDataHash(data) {
      try {
        const dataString = JSON.stringify(data);
        return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, dataString)
          .map(byte => (byte + 256).toString(16).slice(-2))
          .join('');
      } catch (e) {
        return 'hash_error';
      }
    },

    // الحصول على بريد المدير
    getAdminEmail() {
      const permissions = this.getStoredPermissions();
      for (const [email, level] of Object.entries(permissions)) {
        if (level === this.PERMISSION_LEVELS.ADMIN) {
          return email;
        }
      }
      return null;
    },

    // تقرير الأمان اليومي
    generateSecurityReport() {
      const today = new Date().toDateString();

      try {
        const accessSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('AccessLog');
        const auditSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FinancialAudit');

        let accessAttempts = 0;
        let deniedAttempts = 0;
        let financialOperations = 0;

        if (accessSheet) {
          const accessData = accessSheet.getDataRange().getValues();
          const todayAccess = accessData.filter(row =>
            new Date(row[0]).toDateString() === today
          );

          accessAttempts = todayAccess.length;
          deniedAttempts = todayAccess.filter(row => row[4] === 'DENIED').length;
        }

        if (auditSheet) {
          const auditData = auditSheet.getDataRange().getValues();
          financialOperations = auditData.filter(row =>
            new Date(row[0]).toDateString() === today
          ).length;
        }

        return {
          date: today,
          accessAttempts: accessAttempts,
          deniedAttempts: deniedAttempts,
          financialOperations: financialOperations,
          securityScore: this.calculateSecurityScore(deniedAttempts, accessAttempts)
        };

      } catch (e) {
        errorLogger.logError(e, { operation: 'generate_security_report' });
        return null;
      }
    },

    // حساب نقاط الأمان
    calculateSecurityScore(denied, total) {
      if (total === 0) return 100;
      const deniedPercentage = (denied / total) * 100;
      return Math.max(0, 100 - (deniedPercentage * 2));
    }
  };
});
