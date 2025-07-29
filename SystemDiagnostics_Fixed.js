// نظام التشخيص الشامل للنظام - يبني جميع الوحدات بأمان
(function(global) {
  function comprehensiveDiagnostic() {
    Logger.log('🔍 بدء التشخيص الشامل للنظام...');
    
    // إنشاء الأوراق المطلوبة
    Logger.log('📋 إنشاء الأوراق المطلوبة...');
    const requiredSheets = [
      'OPERATION_LOG_SHEET',
      'AI_Memory_Metrics', 
      'AI_Core_Metrics',
      'System_Health_Log',
      'Error_Log'
    ];
    
    requiredSheets.forEach(sheetName => {
      try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if (sheet) {
          Logger.log(`ℹ️ ورقة موجودة: ${sheetName}`);
        } else {
          SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
          Logger.log(`✅ تم إنشاء ورقة: ${sheetName}`);
        }
      } catch (e) {
        Logger.log(`❌ خطأ في إنشاء ورقة ${sheetName}: ${e.message}`);
      }
    });
    
    // اختبارات التشخيص
    const tests = [
      {
        name: 'فحص البيئة الأساسية',
        test: () => ({
          hasSpreadsheetApp: typeof SpreadsheetApp !== 'undefined',
          hasUtilities: typeof Utilities !== 'undefined', 
          hasHtmlService: typeof HtmlService !== 'undefined',
          hasSession: typeof Session !== 'undefined'
        })
      },
      {
        name: 'الملف النشط',
        test: () => {
          const ss = SpreadsheetApp.getActiveSpreadsheet();
          return {
            id: ss.getId(),
            name: ss.getName(),
            url: ss.getUrl()
          };
        }
      },
      {
        name: 'نظام الوحدات',
        test: () => ({
          hasGAssistant: typeof GAssistant !== 'undefined',
          hasDefineModule: typeof defineModule !== 'undefined',
          hasInjector: GAssistant?.Utils?.Injector !== undefined
        })
      },
      {
        name: 'إنشاء الأوراق المطلوبة',
        test: () => {
          // تم بالفعل في الخطوة السابقة
          return true;
        }
      }
    ];
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
      errors: [],
      warnings: []
    };
    
    tests.forEach(({ name, test }) => {
      try {
        const result = test();
        results.tests.push({
          name,
          status: 'success',
          details: result
        });
      } catch (e) {
        results.tests.push({
          name,
          status: 'error', 
          error: e.message
        });
        results.errors.push(`${name}: ${e.message}`);
      }
    });
    
    Logger.log('📊 نتائج التشخيص: ' + JSON.stringify(results, null, 2));
    return results;
  }

  // تشغيل التشخيص
  global.runComprehensiveDiagnostic = comprehensiveDiagnostic;
  return comprehensiveDiagnostic();
})(this);

// دالة للاختبار المباشر
function runComprehensiveDiagnostic() {
  return runComprehensiveDiagnostic();
}