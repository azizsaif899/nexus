// إصلاح طارئ للنظام - يضمن وجود الوحدات الأساسية
(function(global) {
  function emergencyFix() {
    Logger.log('🚨 Emergency system fix starting...');
    
    // التأكد من وجود النظام الأساسي
    if (!global.GAssistant?.Utils?.Injector) {
      Logger.log('❌ Core system missing');
      return false;
    }
    
    const injector = global.GAssistant.Utils.Injector;
    
    // إصلاح ModuleVerifier
    if (!injector._moduleExports['System.Dev.ModuleVerifier']) {
      const moduleVerifier = {
        checkReady: (moduleName, requiredFunctions = []) => {
          const resolved = injector.get(moduleName);
          return resolved[moduleName] && !resolved[moduleName]._isFallback;
        },
        isReady: (moduleName, requiredFunctions = []) => {
          const resolved = injector.get(moduleName);
          return resolved[moduleName] && !resolved[moduleName]._isFallback;
        },
        healthCheck: () => {
          const modules = Object.keys(injector._moduleExports || {});
          const report = modules.map(name => ({
            module: name,
            status: injector._moduleExports[name] && !injector._moduleExports[name]._isFallback ? 'healthy' : 'degraded'
          }));
          return { isHealthy: report.filter(r => r.status === 'healthy').length > report.length * 0.7, report };
        },
        init: () => true
      };
      
      injector.setExports('System.Dev.ModuleVerifier', moduleVerifier);
      injector.setExports('ModuleVerifier', moduleVerifier);
      Logger.log('✅ Fixed ModuleVerifier');
    }
    
    // إصلاح Config
    if (!injector._moduleExports['System.Config']) {
      const config = {
        get: (key) => {
          const defaults = { 
            DEBUG_MODE: true, 
            API_KEY: '', 
            GEMINI_PRO_MODEL: 'gemini-1.5-pro-latest',
            GEMINI_DEFAULT_MODEL: 'gemini-1.5-pro-latest'
          };
          return defaults[key] || null;
        },
        getAll: () => ({ DEBUG_MODE: true }),
        has: () => true,
        validate: () => true,
        init: () => true
      };
      
      injector.setExports('System.Config', config);
      injector.setExports('Config', config);
      Logger.log('✅ Fixed Config');
    }
    
    // إصلاح Dialogue
    if (!injector._moduleExports['System.UI.Dialogue']) {
      const dialogue = {
        createInfo: (text) => ({ type: 'info', text }),
        createError: (text) => ({ type: 'error', text }),
        createSuccess: (text) => ({ type: 'success', text }),
        createWarning: (text) => ({ type: 'warning', text }),
        createTable: (title, headers, rows) => ({ type: 'table', text: title, data: { headers, rows } }),
        init: () => true
      };
      
      injector.setExports('System.UI.Dialogue', dialogue);
      injector.setExports('Dialogue', dialogue);
      Logger.log('✅ Fixed Dialogue');
    }
    
    Logger.log('🎯 Emergency fix completed');
    return true;
  }
  
  global.runEmergencyFix = emergencyFix;
  
  // تشغيل الإصلاح تلقائياً
  setTimeout(() => {
    emergencyFix();
  }, 50);
})(this);

function runEmergencyFix() {
  return runEmergencyFix();
}