/**
 * ملف تشخيص وإصلاح أخطاء النظام
 * يحل مشكلة NOT_FOUND وأخطاء التخزين الأخرى
 */

// دالة تشخيص شاملة
function runSystemDiagnostics() {
  console.log('🔍 بدء التشخيص الشامل للنظام...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    tests: [],
    errors: [],
    warnings: []
  };
  
  // 1. فحص البيئة الأساسية
  try {
    diagnostics.tests.push({
      name: 'فحص البيئة الأساسية',
      status: 'success',
      details: {
        hasSpreadsheetApp: typeof SpreadsheetApp !== 'undefined',
        hasUtilities: typeof Utilities !== 'undefined',
        hasHtmlService: typeof HtmlService !== 'undefined',
        hasSession: typeof Session !== 'undefined'
      }
    });
  } catch (error) {
    diagnostics.errors.push({ test: 'البيئة الأساسية', error: error.message });
  }
  
  // 2. فحص الملف النشط
  try {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSpreadsheet) {
      diagnostics.tests.push({
        name: 'الملف النشط',
        status: 'success',
        details: {
          id: activeSpreadsheet.getId(),
          name: activeSpreadsheet.getName(),
          url: activeSpreadsheet.getUrl()
        }
      });
    } else {
      diagnostics.warnings.push('لا يوجد ملف Google Sheets نشط');
    }
  } catch (error) {
    diagnostics.errors.push({ test: 'الملف النشط', error: error.message });
  }
  
  // 3. فحص نظام الوحدات
  try {
    const moduleSystemStatus = {
      hasGAssistant: typeof GAssistant !== 'undefined',
      hasDefineModule: typeof defineModule !== 'undefined',
      hasInjector: typeof GAssistant !== 'undefined' && 
                   typeof GAssistant.Utils !== 'undefined' && 
                   typeof GAssistant.Utils.Injector !== 'undefined'
    };
    
    diagnostics.tests.push({
      name: 'نظام الوحدات',
      status: moduleSystemStatus.hasGAssistant ? 'success' : 'failed',
      details: moduleSystemStatus
    });
  } catch (error) {
    diagnostics.errors.push({ test: 'نظام الوحدات', error: error.message });
  }
  
  // 4. إنشاء الأوراق المطلوبة إذا لم تكن موجودة
  try {
    createRequiredSheets();
    diagnostics.tests.push({
      name: 'إنشاء الأوراق المطلوبة',
      status: 'success'
    });
  } catch (error) {
    diagnostics.errors.push({ test: 'إنشاء الأوراق', error: error.message });
  }
  
  // طباعة النتائج
  console.log('📊 نتائج التشخيص:', JSON.stringify(diagnostics, null, 2));
  
  return diagnostics;
}

// دالة إنشاء الأوراق المطلوبة
function createRequiredSheets() {
  console.log('📋 إنشاء الأوراق المطلوبة...');
  
  const requiredSheets = [
    'OPERATION_LOG_SHEET',
    'AI_Memory_Metrics', 
    'AI_Core_Metrics',
    'System_Health_Log',
    'Error_Log'
  ];
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('لا يوجد ملف Google Sheets نشط. يرجى فتح ملف أولاً.');
    }
    
    requiredSheets.forEach(sheetName => {
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        
        // إضافة headers أساسية
        const headers = getHeadersForSheet(sheetName);
        if (headers.length > 0) {
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
          sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        }
        
        console.log(`✅ تم إنشاء ورقة: ${sheetName}`);
      } else {
        console.log(`ℹ️ ورقة موجودة: ${sheetName}`);
      }
    });
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء الأوراق:', error.message);
    throw error;
  }
}

// دالة للحصول على headers لكل ورقة
function getHeadersForSheet(sheetName) {
  const headerMap = {
    'OPERATION_LOG_SHEET': ['Timestamp', 'Operation', 'User', 'Status', 'Details'],
    'AI_Memory_Metrics': ['Timestamp', 'Function', 'Version', 'Meta'],
    'AI_Core_Metrics': ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'Model', 'PromptLength', 'ResponseLength', 'Error'],
    'System_Health_Log': ['Timestamp', 'SystemStatus', 'HealthPercentage', 'Details'],
    'Error_Log': ['Timestamp', 'Module', 'Function', 'Error', 'Stack']
  };
  
  return headerMap[sheetName] || ['Timestamp', 'Data'];
}

// دالة اختبار سريع
function quickSystemTest() {
  console.log('⚡ اختبار سريع للنظام...');
  
  try {
    // 1. اختبار الوصول للملف
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('✅ الوصول للملف:', spreadsheet ? 'نجح' : 'فشل');
    
    // 2. اختبار نظام الوحدات
    console.log('✅ نظام الوحدات:', typeof GAssistant !== 'undefined' ? 'موجود' : 'مفقود');
    
    // 3. اختبار إنشاء ورقة بسيطة
    let testSheet = spreadsheet.getSheetByName('SystemTest');
    if (!testSheet) {
      testSheet = spreadsheet.insertSheet('SystemTest');
      testSheet.getRange('A1').setValue('System Test - ' + new Date());
    }
    console.log('✅ إنشاء ورقة اختبار: نجح');
    
    // 4. اختبار الكتابة والقراءة
    const testValue = 'Test-' + Date.now();
    testSheet.getRange('B1').setValue(testValue);
    const readValue = testSheet.getRange('B1').getValue();
    console.log('✅ اختبار الكتابة/القراءة:', readValue === testValue ? 'نجح' : 'فشل');
    
    return true;
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار السريع:', error.message);
    return false;
  }
}

// دالة إصلاح المشاكل الشائعة
function fixCommonIssues() {
  console.log('🔧 إصلاح المشاكل الشائعة...');
  
  const fixes = [];
  
  try {
    // 1. إنشاء الأوراق المطلوبة
    createRequiredSheets();
    fixes.push('تم إنشاء الأوراق المطلوبة');
    
    // 2. تهيئة النظام إذا لم يكن مهيأ
    if (typeof initializeGAssistantSystem === 'function') {
      initializeGAssistantSystem();
      fixes.push('تم تشغيل تهيئة النظام');
    }
    
    // 3. تنظيف الكاش
    if (typeof CacheService !== 'undefined') {
      CacheService.getUserCache().removeAll();
      CacheService.getScriptCache().removeAll();
      fixes.push('تم تنظيف الكاش');
    }
    
    console.log('✅ الإصلاحات المطبقة:', fixes);
    return fixes;
    
  } catch (error) {
    console.error('❌ خطأ في الإصلاح:', error.message);
    return [];
  }
}