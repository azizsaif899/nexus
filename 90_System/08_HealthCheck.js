// *************************************************************************************************
// --- START OF FILE: 90_System/08_HealthCheck.js ---
// *************************************************************************************************

/**
 * @file 90_System/08_HealthCheck.js
 * @module System.HealthCheck
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * نظام فحص صحة الوحدات والتشخيص. يتحقق من جهوزية جميع الوحدات الأساسية
 * ويقدم تقريراً مفصلاً عن حالة النظام.
 * المراحل المعمارية المطبقة:
 *   • 1: defineModule مع تبعية Utils
 *   • 2: فحص جهوزية الوحدات
 *   • 3: تقرير مفصل عن الحالة
 *   • 4: تسجيل النتائج في Sheets
 */

defineModule('System.HealthCheck', ({ Utils }) => {
  
  /**
   * يفحص جهوزية وحدة معينة
   * @param {string} moduleName - اسم الوحدة
   * @param {string} modulePath - مسار الوحدة في GAssistant
   * @returns {Object} تقرير حالة الوحدة
   */
  function checkModule(moduleName, modulePath) {
    try {
      const parts = modulePath.split('.');
      let current = GAssistant;
      
      for (const part of parts) {
        if (current && current[part] !== undefined) {
          current = current[part];
        } else {
          return {
            name: moduleName,
            status: 'missing',
            message: `Module path ${modulePath} not found`,
            timestamp: new Date()
          };
        }
      }
      
      // فحص إضافي للوحدات التي تحتوي على دالة isReady
      if (typeof current.isReady === 'function') {
        const readyStatus = current.isReady();
        return {
          name: moduleName,
          status: readyStatus.status || 'ready',
          message: readyStatus.message || 'Module is ready',
          dependencies: readyStatus.dependencies || [],
          timestamp: new Date()
        };
      }
      
      return {
        name: moduleName,
        status: 'ready',
        message: 'Module loaded successfully',
        timestamp: new Date()
      };
      
    } catch (error) {
      return {
        name: moduleName,
        status: 'error',
        message: error.message,
        timestamp: new Date()
      };
    }
  }
  
  /**
   * يفحص جميع الوحدات الأساسية
   * @returns {Array} مصفوفة تقارير حالة الوحدات
   */
  function runFullHealthCheck() {
    const coreModules = [
      { name: 'System.Utils', path: 'System.Utils' },
      { name: 'System.Config', path: 'System.Config' },
      { name: 'System.DocsManager', path: 'System.DocsManager' },
      { name: 'System.Telemetry', path: 'System.Telemetry' },
      { name: 'System.AI', path: 'AI' },
      { name: 'System.Tools', path: 'Tools' },
      { name: 'System.UI', path: 'UI' },
      { name: 'System.Agents', path: 'Agents' },
      { name: 'System.Security', path: 'System.Security' }
    ];
    
    const results = [];
    
    for (const module of coreModules) {
      const result = checkModule(module.name, module.path);
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * يولد تقريراً مفصلاً عن حالة النظام
   * @returns {Object} تقرير شامل عن حالة النظام
   */
  function generateSystemReport() {
    const healthResults = runFullHealthCheck();
    const readyModules = healthResults.filter(r => r.status === 'ready').length;
    const totalModules = healthResults.length;
    
    const report = {
      timestamp: new Date(),
      systemStatus: readyModules === totalModules ? 'healthy' : 'degraded',
      readyModules,
      totalModules,
      healthPercentage: Math.round((readyModules / totalModules) * 100),
      modules: healthResults,
      recommendations: []
    };
    
    // إضافة توصيات بناءً على النتائج
    const failedModules = healthResults.filter(r => r.status !== 'ready');
    if (failedModules.length > 0) {
      report.recommendations.push(`إصلاح ${failedModules.length} وحدة غير جاهزة`);
      report.recommendations.push('فحص التبعيات والتأكد من ترتيب التحميل');
    }
    
    return report;
  }
  
  /**
   * يحفظ تقرير الصحة في Google Sheets
   * @param {Object} report - تقرير الصحة
   */
  function saveHealthReport(report) {
    return Utils.executeSafely(() => {
      const sheet = Utils.getSheet('System_Health_Reports', [
        'Timestamp', 'System Status', 'Ready Modules', 'Total Modules', 
        'Health %', 'Failed Modules', 'Recommendations'
      ]);
      
      const failedModules = report.modules
        .filter(m => m.status !== 'ready')
        .map(m => m.name)
        .join(', ');
      
      sheet.appendRow([
        report.timestamp,
        report.systemStatus,
        report.readyModules,
        report.totalModules,
        report.healthPercentage,
        failedModules || 'None',
        report.recommendations.join('; ')
      ]);
      
      Utils.log(`HealthCheck: Report saved to System_Health_Reports sheet`);
      
    }, [], 'HealthCheck.saveHealthReport');
  }
  
  /**
   * يشغل فحص صحة كامل ويحفظ النتائج
   * @returns {Object} تقرير الصحة الكامل
   */
  function runHealthCheckAndSave() {
    const report = generateSystemReport();
    saveHealthReport(report);
    
    Utils.log(`HealthCheck: System health is ${report.systemStatus} (${report.healthPercentage}%)`);
    
    return report;
  }
  
  return {
    checkModule,
    runFullHealthCheck,
    generateSystemReport,
    saveHealthReport,
    runHealthCheckAndSave
  };
});

// *************************************************************************************************
// --- END OF FILE: 90_System/08_HealthCheck.js ---
// *************************************************************************************************