/**
 * مدقق بدء التشغيل - كشف الأعطال المبكرة
 * @fileoverview Early failure detection and environment validation
 * @version 1.0.0
 * @since 3.0.0
 */
defineModule('Utils.StartupValidator', function(injector) {
  
  return {
    /**
     * فحص جاهزية البيئة عند بدء التشغيل
     * @returns {Object} تقرير حالة النظام
     * @throws {Error} إذا فشل في الفحوصات الحرجة
     * @example
     * const status = validator.validateEnvironment();
     * if (!status.isReady) throw new Error('النظام غير جاهز');
     * @since 3.0.0
     */
    validateEnvironment() {
      const validationReport = {
        timestamp: new Date().toISOString(),
        isReady: false,
        checks: {},
        criticalIssues: [],
        warnings: []
      };

      // فحص الصلاحيات
      validationReport.checks.permissions = this.checkPermissions();
      
      // فحص الإعدادات الأساسية
      validationReport.checks.configuration = this.checkConfiguration();
      
      // فحص الوحدات الأساسية
      validationReport.checks.coreModules = this.checkCoreModules();
      
      // فحص الاتصال بالخدمات الخارجية
      validationReport.checks.externalServices = this.checkExternalServices();

      // تحديد الحالة العامة
      validationReport.isReady = this.determineReadiness(validationReport.checks);
      
      // جمع المشاكل الحرجة والتحذيرات
      this.collectIssues(validationReport);

      return validationReport;
    },

    /**
     * فحص الصلاحيات المطلوبة
     * @returns {Object} نتيجة فحص الصلاحيات
     * @private
     */
    checkPermissions() {
      const permissionCheck = {
        status: 'PASS',
        details: {},
        issues: []
      };

      try {
        // فحص صلاحية الوصول للخصائص
        PropertiesService.getScriptProperties().getProperty('test');
        permissionCheck.details.properties = 'OK';
        
        // فحص صلاحية الوصول للجداول
        SpreadsheetApp.getActiveSpreadsheet();
        permissionCheck.details.spreadsheet = 'OK';
        
        // فحص صلاحية الوصول للدرايف
        DriveApp.getRootFolder();
        permissionCheck.details.drive = 'OK';

      } catch (error) {
        permissionCheck.status = 'FAIL';
        permissionCheck.issues.push(`فشل في فحص الصلاحيات: ${error.message}`);
      }

      return permissionCheck;
    },

    /**
     * فحص الإعدادات الأساسية
     * @returns {Object} نتيجة فحص الإعدادات
     * @private
     */
    checkConfiguration() {
      const configCheck = {
        status: 'PASS',
        details: {},
        issues: []
      };

      const requiredSettings = [
        'GCP_PROJECT_ID',
        'SERVICE_ACCOUNT_EMAIL'
      ];

      const properties = PropertiesService.getScriptProperties();
      
      requiredSettings.forEach(setting => {
        const value = properties.getProperty(setting);
        if (!value) {
          configCheck.status = 'FAIL';
          configCheck.issues.push(`إعداد مفقود: ${setting}`);
        } else {
          configCheck.details[setting] = 'SET';
        }
      });

      return configCheck;
    },

    /**
     * فحص الوحدات الأساسية
     * @returns {Object} نتيجة فحص الوحدات
     * @private
     */
    checkCoreModules() {
      const moduleCheck = {
        status: 'PASS',
        details: {},
        issues: []
      };

      const coreModules = [
        'System.ToolExecutor',
        'System.IntentAnalyzer',
        'System.DataValidator'
      ];

      coreModules.forEach(moduleName => {
        try {
          const module = injector.get(moduleName);
          if (module) {
            moduleCheck.details[moduleName] = 'LOADED';
          } else {
            moduleCheck.status = 'FAIL';
            moduleCheck.issues.push(`فشل في تحميل الوحدة: ${moduleName}`);
          }
        } catch (error) {
          moduleCheck.status = 'FAIL';
          moduleCheck.issues.push(`خطأ في الوحدة ${moduleName}: ${error.message}`);
        }
      });

      return moduleCheck;
    },

    /**
     * فحص الاتصال بالخدمات الخارجية
     * @returns {Object} نتيجة فحص الخدمات
     * @private
     */
    checkExternalServices() {
      const serviceCheck = {
        status: 'PASS',
        details: {},
        issues: []
      };

      try {
        // فحص الاتصال بـ Google Cloud (محاكاة)
        const projectId = PropertiesService.getScriptProperties().getProperty('GCP_PROJECT_ID');
        if (projectId) {
          serviceCheck.details.googleCloud = 'CONFIGURED';
        } else {
          serviceCheck.status = 'WARN';
          serviceCheck.issues.push('Google Cloud غير مكون');
        }

        // فحص الاتصال بـ BigQuery (محاكاة)
        serviceCheck.details.bigQuery = 'AVAILABLE';

      } catch (error) {
        serviceCheck.status = 'FAIL';
        serviceCheck.issues.push(`فشل في فحص الخدمات الخارجية: ${error.message}`);
      }

      return serviceCheck;
    },

    /**
     * تحديد جاهزية النظام
     * @param {Object} checks - نتائج الفحوصات
     * @returns {boolean} حالة الجاهزية
     * @private
     */
    determineReadiness(checks) {
      const criticalChecks = ['permissions', 'configuration', 'coreModules'];
      
      return criticalChecks.every(checkName => 
        checks[checkName] && checks[checkName].status !== 'FAIL'
      );
    },

    /**
     * جمع المشاكل الحرجة والتحذيرات
     * @param {Object} report - تقرير التحقق
     * @private
     */
    collectIssues(report) {
      Object.values(report.checks).forEach(check => {
        if (check.status === 'FAIL') {
          report.criticalIssues.push(...check.issues);
        } else if (check.status === 'WARN') {
          report.warnings.push(...check.issues);
        }
      });
    },

    /**
     * تشغيل اختبارات Smoke
     * @returns {Object} نتائج اختبارات Smoke
     * @example
     * const smokeResults = validator.runSmokeTests();
     * @since 3.0.0
     */
    runSmokeTests() {
      const smokeResults = {
        timestamp: new Date().toISOString(),
        passed: 0,
        failed: 0,
        tests: []
      };

      const smokeTests = [
        {
          name: 'Basic Module Loading',
          test: () => {
            const module = injector.get('System.DataValidator');
            return !!module;
          }
        },
        {
          name: 'Properties Access',
          test: () => {
            PropertiesService.getScriptProperties().setProperty('smoke_test', 'ok');
            const value = PropertiesService.getScriptProperties().getProperty('smoke_test');
            return value === 'ok';
          }
        },
        {
          name: 'Spreadsheet Access',
          test: () => {
            const sheet = SpreadsheetApp.getActiveSpreadsheet();
            return !!sheet;
          }
        }
      ];

      smokeTests.forEach(smokeTest => {
        try {
          const result = smokeTest.test();
          if (result) {
            smokeResults.passed++;
            smokeResults.tests.push({
              name: smokeTest.name,
              status: 'PASS'
            });
          } else {
            smokeResults.failed++;
            smokeResults.tests.push({
              name: smokeTest.name,
              status: 'FAIL',
              error: 'Test returned false'
            });
          }
        } catch (error) {
          smokeResults.failed++;
          smokeResults.tests.push({
            name: smokeTest.name,
            status: 'ERROR',
            error: error.message
          });
        }
      });

      return smokeResults;
    }
  };
});

/**
 * دالة عامة للتحقق من جاهزية النظام
 * @returns {Object} تقرير حالة النظام
 * @throws {Error} إذا فشل النظام في الفحوصات الحرجة
 * @example
 * validateSystemStartup();
 * @since 3.0.0
 */
function validateSystemStartup() {
  try {
    const validator = GAssistant.Utils.Injector.get('Utils.StartupValidator');
    const report = validator.validateEnvironment();
    
    if (!report.isReady) {
      const issues = report.criticalIssues.join('; ');
      throw new Error(`النظام غير جاهز للتشغيل: ${issues}`);
    }
    
    return report;
  } catch (error) {
    console.error('فشل في التحقق من بدء التشغيل:', error);
    throw error;
  }
}