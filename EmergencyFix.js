/**
 * إصلاح طارئ لمشاكل التبعيات
 * يجب تشغيله قبل أي شيء آخر
 */

// دالة إصلاح طارئ - شغلها أولاً
function emergencySystemFix() {
  console.log('🚨 بدء الإصلاح الطارئ للنظام...');
  
  try {
    // 1. التحقق من وجود نظام الوحدات الأساسي
    if (typeof defineModule === 'undefined') {
      console.error('❌ نظام الوحدات غير موجود - يجب إعادة رفع الملفات');
      return false;
    }
    
    // 2. التحقق من وجود GAssistant
    if (typeof GAssistant === 'undefined') {
      console.error('❌ GAssistant غير معرف - مشكلة في ترتيب التحميل');
      return false;
    }
    
    // 3. التحقق من Utils
    if (!GAssistant.Utils || !GAssistant.Utils.Utils) {
      console.error('❌ System.Utils غير متاح');
      return false;
    }
    
    // 4. إنشاء الأوراق الأساسية بدون تبعيات
    createBasicSheets();
    
    // 5. تهيئة النظام يدوياً
    if (typeof initializeGAssistantSystem === 'function') {
      try {
        initializeGAssistantSystem();
        console.log('✅ تم تشغيل التهيئة');
      } catch (initError) {
        console.warn('⚠️ فشل في التهيئة:', initError.message);
      }
    }
    
    console.log('✅ اكتمل الإصلاح الطارئ');
    return true;
    
  } catch (error) {
    console.error('❌ فشل الإصلاح الطارئ:', error.message);
    return false;
  }
}

// إنشاء الأوراق الأساسية بدون تبعيات
function createBasicSheets() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      console.warn('⚠️ لا يوجد ملف نشط');
      return;
    }
    
    const requiredSheets = [
      'OPERATION_LOG_SHEET',
      'AI_Memory_Metrics', 
      'AI_Core_Metrics',
      'System_Health_Log'
    ];
    
    requiredSheets.forEach(sheetName => {
      if (!spreadsheet.getSheetByName(sheetName)) {
        const sheet = spreadsheet.insertSheet(sheetName);
        sheet.getRange('A1').setValue('Timestamp');
        sheet.getRange('B1').setValue('Data');
        console.log(`✅ تم إنشاء: ${sheetName}`);
      }
    });
    
  } catch (error) {
    console.warn('⚠️ خطأ في إنشاء الأوراق:', error.message);
  }
}

// اختبار سريع للنظام
function quickCheck() {
  console.log('🔍 فحص سريع للنظام...');
  
  const checks = [
    { name: 'defineModule', test: () => typeof defineModule !== 'undefined' },
    { name: 'GAssistant', test: () => typeof GAssistant !== 'undefined' },
    { name: 'Utils', test: () => GAssistant?.Utils?.Utils },
    { name: 'Config', test: () => GAssistant?.System?.Config },
    { name: 'SpreadsheetApp', test: () => typeof SpreadsheetApp !== 'undefined' }
  ];
  
  checks.forEach(check => {
    const result = check.test();
    console.log(`${result ? '✅' : '❌'} ${check.name}: ${result ? 'متاح' : 'غير متاح'}`);
  });
}

// تشغيل تلقائي للإصلاح
(function() {
  // انتظار قصير للتأكد من تحميل الملفات
  Utilities.sleep(1000);
  emergencySystemFix();
})();