/**
 * SelfMonitoring - نظام المراقبة الذاتي
 * يراقب حالة النظام ويصدر تنبيهات تلقائية
 */
defineModule('System.SelfMonitoring', function(injector) {
  const errorLogger = injector.get('System.ErrorLogger');
  const performanceProfiler = injector.get('System.PerformanceProfiler');

  return {
    // بدء المراقبة التلقائية
    startMonitoring() {
      console.log('🔍 Starting self-monitoring system...');

      // فحص دوري كل 5 دقائق
      ScriptApp.newTrigger('performSystemCheck')
        .timeBased()
        .everyMinutes(5)
        .create();

      // فحص يومي شامل
      ScriptApp.newTrigger('performDailyHealthCheck')
        .timeBased()
        .everyDays(1)
        .atHour(9)
        .create();
    },

    // فحص النظام
    performSystemCheck() {
      const checks = [
        this.checkMemoryUsage(),
        this.checkAPIConnectivity(),
        this.checkDataIntegrity(),
        this.checkPerformanceMetrics()
      ];

      const results = checks.map(check => {
        try {
          return check();
        } catch (error) {
          errorLogger.logError(error, { operation: 'system_check' });
          return { status: 'ERROR', message: error.message };
        }
      });

      const criticalIssues = results.filter(r => r.status === 'CRITICAL');

      if (criticalIssues.length > 0) {
        this.sendCriticalAlert(criticalIssues);
      }

      return results;
    },

    // فحص استخدام الذاكرة
    checkMemoryUsage() {
      try {
        const used = DriveApp.getStorageUsed();
        const limit = DriveApp.getStorageLimit();
        const percentage = (used / limit) * 100;

        if (percentage > 90) {
          return { status: 'CRITICAL', message: `Storage ${percentage}% full` };
        } else if (percentage > 75) {
          return { status: 'WARNING', message: `Storage ${percentage}% full` };
        }

        return { status: 'OK', message: `Storage ${percentage}% used` };
      } catch (error) {
        return { status: 'ERROR', message: 'Cannot check storage' };
      }
    },

    // فحص اتصال API
    checkAPIConnectivity() {
      try {
        // محاكاة فحص Gemini API
        const testResponse = UrlFetchApp.fetch('https://www.google.com', {
          method: 'HEAD',
          muteHttpExceptions: true
        });

        if (testResponse.getResponseCode() === 200) {
          return { status: 'OK', message: 'API connectivity normal' };
        } else {
          return { status: 'WARNING', message: 'API connectivity issues' };
        }
      } catch (error) {
        return { status: 'CRITICAL', message: 'API unreachable' };
      }
    },

    // فحص سلامة البيانات
    checkDataIntegrity() {
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet();
        const sheets = sheet.getSheets();

        if (sheets.length === 0) {
          return { status: 'CRITICAL', message: 'No sheets found' };
        }

        // فحص الأوراق الأساسية
        const requiredSheets = ['ErrorLog', 'PerformanceLog', 'AccessLog'];
        const missingSheets = requiredSheets.filter(name =>
          !sheet.getSheetByName(name)
        );

        if (missingSheets.length > 0) {
          return {
            status: 'WARNING',
            message: `Missing sheets: ${missingSheets.join(', ')}`
          };
        }

        return { status: 'OK', message: 'Data integrity verified' };
      } catch (error) {
        return { status: 'ERROR', message: 'Cannot verify data integrity' };
      }
    },

    // فحص مقاييس الأداء
    checkPerformanceMetrics() {
      const analysis = performanceProfiler.analyzePerformance();

      if (!analysis) {
        return { status: 'OK', message: 'No performance data' };
      }

      if (analysis.averageDuration > 5000) {
        return {
          status: 'CRITICAL',
          message: `High avg response time: ${analysis.averageDuration}ms`
        };
      } else if (analysis.averageDuration > 2000) {
        return {
          status: 'WARNING',
          message: `Elevated response time: ${analysis.averageDuration}ms`
        };
      }

      return { status: 'OK', message: 'Performance within normal range' };
    },

    // إرسال تنبيه حرج
    sendCriticalAlert(issues) {
      const message = `🚨 G-Assistant Critical System Alert

The following critical issues were detected:

${issues.map(issue => `• ${issue.message}`).join('\n')}

Time: ${new Date().toISOString()}
System: G-Assistant v6.0.0

Please investigate immediately.`;

      try {
        // إرسال بريد إلكتروني
        const adminEmail = PropertiesService.getScriptProperties()
          .getProperty('ADMIN_EMAIL');

        if (adminEmail) {
          MailApp.sendEmail({
            to: adminEmail,
            subject: '🚨 G-Assistant Critical Alert',
            body: message
          });
        }

        // تسجيل في السجل
        console.error('🚨 CRITICAL SYSTEM ISSUES:', issues);

      } catch (error) {
        console.error('Failed to send critical alert:', error);
      }
    },

    // فحص صحي يومي شامل
    performDailyHealthCheck() {
      console.log('🏥 Performing daily health check...');

      const healthReport = {
        timestamp: new Date().toISOString(),
        systemChecks: this.performSystemCheck(),
        errorSummary: errorLogger.generateDailyReport(),
        performanceSummary: performanceProfiler.generateDailyPerformanceReport(),
        recommendations: []
      };

      // توليد توصيات
      healthReport.recommendations = this.generateHealthRecommendations(healthReport);

      // حفظ التقرير
      this.saveHealthReport(healthReport);

      // إرسال تقرير يومي
      this.sendDailyHealthReport(healthReport);

      return healthReport;
    },

    // توليد توصيات صحية
    generateHealthRecommendations(report) {
      const recommendations = [];

      // توصيات الأخطاء
      if (report.errorSummary && report.errorSummary.critical > 0) {
        recommendations.push({
          type: 'CRITICAL',
          message: 'Address critical errors immediately',
          action: 'Review ErrorLog sheet and fix underlying issues'
        });
      }

      // توصيات الأداء
      const perfReport = report.performanceSummary;
      if (typeof perfReport === 'string' && perfReport.includes('Slow Operations')) {
        recommendations.push({
          type: 'PERFORMANCE',
          message: 'Optimize slow operations',
          action: 'Review PerformanceLog and implement caching or optimization'
        });
      }

      // توصيات النظام
      const criticalChecks = report.systemChecks.filter(c => c.status === 'CRITICAL');
      if (criticalChecks.length > 0) {
        recommendations.push({
          type: 'SYSTEM',
          message: 'Fix critical system issues',
          action: 'Address storage, connectivity, or data integrity problems'
        });
      }

      return recommendations;
    },

    // حفظ تقرير الصحة
    saveHealthReport(report) {
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet()
          .getSheetByName('HealthReports') ||
          SpreadsheetApp.getActiveSpreadsheet().insertSheet('HealthReports');

        if (sheet.getLastRow() === 0) {
          sheet.getRange(1, 1, 1, 4).setValues([[
            'Date', 'System Status', 'Error Count', 'Recommendations'
          ]]);
        }

        const systemStatus = report.systemChecks.some(c => c.status === 'CRITICAL')
          ? 'CRITICAL'
          : report.systemChecks.some(c => c.status === 'WARNING')
            ? 'WARNING'
            : 'HEALTHY';

        const errorCount = report.errorSummary ? report.errorSummary.total : 0;
        const recommendationCount = report.recommendations.length;

        sheet.appendRow([
          report.timestamp,
          systemStatus,
          errorCount,
          recommendationCount
        ]);

      } catch (error) {
        console.error('Failed to save health report:', error);
      }
    },

    // إرسال تقرير صحي يومي
    sendDailyHealthReport(report) {
      const adminEmail = PropertiesService.getScriptProperties()
        .getProperty('ADMIN_EMAIL');

      if (!adminEmail) return;

      const systemStatus = report.systemChecks.some(c => c.status === 'CRITICAL')
        ? '🔴 CRITICAL'
        : report.systemChecks.some(c => c.status === 'WARNING')
          ? '🟡 WARNING'
          : '🟢 HEALTHY';

      const message = `📊 G-Assistant Daily Health Report

System Status: ${systemStatus}
Date: ${new Date().toLocaleDateString()}

📋 System Checks:
${report.systemChecks.map(check =>
    `• ${check.status}: ${check.message}`
  ).join('\n')}

📈 Performance Summary:
${report.performanceSummary || 'No performance data'}

💡 Recommendations (${report.recommendations.length}):
${report.recommendations.map(rec =>
    `• ${rec.type}: ${rec.message}`
  ).join('\n')}

---
G-Assistant Self-Monitoring System`;

      try {
        MailApp.sendEmail({
          to: adminEmail,
          subject: `📊 G-Assistant Health Report - ${systemStatus}`,
          body: message
        });
      } catch (error) {
        console.error('Failed to send daily health report:', error);
      }
    },

    // إيقاف المراقبة
    stopMonitoring() {
      const triggers = ScriptApp.getProjectTriggers();
      triggers.forEach(trigger => {
        if (trigger.getHandlerFunction() === 'performSystemCheck' ||
            trigger.getHandlerFunction() === 'performDailyHealthCheck') {
          ScriptApp.deleteTrigger(trigger);
        }
      });

      console.log('🛑 Self-monitoring system stopped');
    }
  };
});
