// إصلاح حرج للمشاكل الأساسية في النظام
(function(global) {
  function criticalSystemFix() {
    Logger.log('🔧 بدء الإصلاح الحرج للنظام...');
    
    const injector = global.GAssistant?.Utils?.Injector;
    if (!injector) {
      Logger.log('❌ Injector غير متوفر');
      return false;
    }
    
    // إصلاح 1: إضافة دوال مفقودة لـ ModuleVerifier
    try {
      const moduleVerifier = injector.get('System.Dev.ModuleVerifier')['System.Dev.ModuleVerifier'];
      if (moduleVerifier && !moduleVerifier.isReady) {
        moduleVerifier.isReady = moduleVerifier.checkReady;
        Logger.log('✅ تم إصلاح ModuleVerifier.isReady');
      }
      if (moduleVerifier && !moduleVerifier.healthCheck) {
        moduleVerifier.healthCheck = () => {
          const modules = Object.keys(injector._moduleExports || {});
          const report = modules.map(name => ({
            module: name,
            status: injector._moduleExports[name] && !injector._moduleExports[name]._isPlaceholder ? 'healthy' : 'degraded',
            reason: 'Auto-generated status'
          }));
          const healthyCount = report.filter(r => r.status === 'healthy').length;
          return {
            isHealthy: healthyCount > (report.length * 0.7),
            report
          };
        };
        Logger.log('✅ تم إصلاح ModuleVerifier.healthCheck');
      }
    } catch (e) {
      Logger.log(`⚠️ فشل إصلاح ModuleVerifier: ${e.message}`);
    }
    
    // إصلاح 2: إنشاء fallbacks آمنة للوحدات المفقودة
    const criticalModules = [
      'System.AI.Core',
      'System.UI.ActionHandler', 
      'System.ToolsDeveloper',
      'System.Agents.Catalog',
      'System.Tools.ProjectService'
    ];
    
    criticalModules.forEach(moduleName => {
      try {
        const moduleExports = injector._moduleExports[moduleName];
        if (!moduleExports || moduleExports._isPlaceholder) {
          // إنشاء fallback آمن
          const safeFallback = {
            _isPlaceholder: true,
            init: () => true,
            handleRequest: ({ sessionId, message, intent }) => ({
              type: 'error',
              text: `الوحدة ${moduleName} غير متوفرة حالياً`
            }),
            ask: (prompt, options) => ({
              type: 'error', 
              text: `الوحدة ${moduleName} غير متوفرة حالياً`
            }),
            getAgent: (name) => ({ sessionId, message, intent }) => ({
              type: 'error',
              text: `الوكيل ${name} غير متوفر حالياً`
            }),
            checkReady: () => false,
            isReady: () => false
          };
          
          injector.setExports(moduleName, safeFallback);
          Logger.log(`✅ تم إنشاء fallback آمن لـ ${moduleName}`);
        }
      } catch (e) {
        Logger.log(`⚠️ فشل إنشاء fallback لـ ${moduleName}: ${e.message}`);
      }
    });
    
    // إصلاح 3: التحقق من الوحدات الأساسية وإعادة بنائها
    const coreModules = ['System.Config', 'System.Utils', 'System.AI', 'System.Tools'];
    let rebuiltCount = 0;
    
    coreModules.forEach(moduleName => {
      try {
        const moduleExports = injector._moduleExports[moduleName];
        if (moduleExports && typeof moduleExports.init === 'function') {
          moduleExports.init();
          rebuiltCount++;
          Logger.log(`✅ تم إعادة تهيئة ${moduleName}`);
        }
      } catch (e) {
        Logger.log(`⚠️ فشل إعادة تهيئة ${moduleName}: ${e.message}`);
      }
    });
    
    Logger.log(`🎯 تم الإصلاح الحرج: ${rebuiltCount} وحدة أساسية تم إعادة تهيئتها`);
    
    // تشغيل فحص الصحة
    try {
      if (global.GAssistant.System?.HealthCheck?.runHealthCheckAndSave) {
        const healthReport = global.GAssistant.System.HealthCheck.runHealthCheckAndSave();
        Logger.log(`📊 حالة النظام بعد الإصلاح: ${healthReport.systemStatus}`);
      }
    } catch (e) {
      Logger.log(`⚠️ فشل فحص الصحة: ${e.message}`);
    }
    
    return true;
  }
  
  global.runCriticalSystemFix = criticalSystemFix;
  
  // تشغيل الإصلاح تلقائياً
  if (global.GAssistant?.Utils?.Injector) {
    criticalSystemFix();
  }
})(this);

function runCriticalSystemFix() {
  return runCriticalSystemFix();
}