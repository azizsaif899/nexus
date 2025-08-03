/**
 * ErrorLogger - نظام تسجيل الأخطاء المركزي
 * يتتبع ويحلل الأخطاء المتكررة لتحسين الأداء
 */
defineModule('System.ErrorLogger', function(injector) {
  const config = injector.get('System.Config');

  return {
    // تسجيل خطأ مع تفاصيل شاملة
    logError(error, context = {}) {
      const errorData = {
        timestamp: new Date().toISOString(),
        message: error.message || error,
        stack: error.stack,
        context: context,
        userId: Session.getActiveUser().getEmail(),
        sessionId: Utilities.getUuid(),
        severity: this.determineSeverity(error)
      };

      this.saveToSheet(errorData);
      this.analyzePattern(errorData);

      if (errorData.severity === 'CRITICAL') {
        this.sendAlert(errorData);
      }
    },

    // تحديد مستوى خطورة الخطأ
    determineSeverity(error) {
      const message = error.message || error.toString();

      if (message.includes('API') || message.includes('network')) return 'HIGH';
      if (message.includes('permission') || message.includes('auth')) return 'CRITICAL';
      if (message.includes('validation') || message.includes('input')) return 'MEDIUM';

      return 'LOW';
    },

    // حفظ في Google Sheets
    saveToSheet(errorData) {
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName('ErrorLog') ||
          SpreadsheetApp.getActiveSpreadsheet().insertSheet('ErrorLog');

        if (sheet.getLastRow() === 0) {
          sheet.getRange(1, 1, 1, 7).setValues([[
            'Timestamp', 'Severity', 'Message', 'Context', 'User', 'Session', 'Stack'
          ]]);
        }

        sheet.appendRow([
          errorData.timestamp,
          errorData.severity,
          errorData.message,
          JSON.stringify(errorData.context),
          errorData.userId,
          errorData.sessionId,
          errorData.stack
        ]);
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    },

    // تحليل الأنماط المتكررة
    analyzePattern(errorData) {
      const patterns = PropertiesService.getScriptProperties().getProperty('error_patterns');
      const patternData = patterns ? JSON.parse(patterns) : {};

      const key = errorData.message.substring(0, 50);
      patternData[key] = (patternData[key] || 0) + 1;

      PropertiesService.getScriptProperties().setProperty('error_patterns', JSON.stringify(patternData));

      // تنبيه عند تكرار الخطأ أكثر من 5 مرات
      if (patternData[key] >= 5) {
        this.flagRecurringError(key, patternData[key]);
      }
    },

    // إرسال تنبيه للأخطاء الحرجة
    sendAlert(errorData) {
      try {
        MailApp.sendEmail({
          to: config.get('ADMIN_EMAIL', 'admin@example.com'),
          subject: '🚨 G-Assistant Critical Error',
          body: `Critical error occurred:
          
Time: ${errorData.timestamp}
Message: ${errorData.message}
User: ${errorData.userId}
Context: ${JSON.stringify(errorData.context, null, 2)}

Please investigate immediately.`
        });
      } catch (e) {
        console.error('Failed to send alert:', e);
      }
    },

    // تحليل الأخطاء المتكررة
    flagRecurringError(pattern, count) {
      console.warn(`🔄 Recurring error detected: "${pattern}" (${count} times)`);

      // حفظ في سجل الأخطاء المتكررة
      const sheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('RecurringErrors') ||
        SpreadsheetApp.getActiveSpreadsheet().insertSheet('RecurringErrors');

      sheet.appendRow([new Date(), pattern, count, 'NEEDS_INVESTIGATION']);
    },

    // تقرير الأخطاء اليومي
    generateDailyReport() {
      const today = new Date();
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ErrorLog');

      if (!sheet) return null;

      const data = sheet.getDataRange().getValues();
      const todayErrors = data.filter(row => {
        const errorDate = new Date(row[0]);
        return errorDate.toDateString() === today.toDateString();
      });

      return {
        total: todayErrors.length,
        critical: todayErrors.filter(row => row[1] === 'CRITICAL').length,
        high: todayErrors.filter(row => row[1] === 'HIGH').length,
        patterns: this.getTopPatterns(todayErrors)
      };
    },

    // أهم الأنماط المتكررة
    getTopPatterns(errors) {
      const patterns = {};
      errors.forEach(error => {
        const key = error[2].substring(0, 50);
        patterns[key] = (patterns[key] || 0) + 1;
      });

      return Object.entries(patterns)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    }
  };
});
