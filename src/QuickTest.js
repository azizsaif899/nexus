/**
 * دليل الاختبار السريع لنظام G-Assistant
 * نسخة مبسطة للاختبار الفوري
 */

// 🚀 الاختبار الرئيسي - ابدأ من هنا
function quickSystemTest() {
  console.log('🚀 بدء الاختبار السريع...');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // 1. اختبار البيئة الأساسية
  testBasicEnvironment(results);

  // 2. اختبار نظام الوحدات
  testModuleSystem(results);

  // 3. اختبار الوصول للملف
  testSpreadsheetAccess(results);

  // 4. اختبار إنشاء الأوراق
  testSheetCreation(results);

  // 5. اختبار لوحة التحكم
  testDashboard(results);

  // النتيجة النهائية
  console.log('\n📊 نتائج الاختبار:');
  console.log(`✅ نجح: ${results.passed}`);
  console.log(`❌ فشل: ${results.failed}`);
  console.log(`📈 معدل النجاح: ${Math.round((results.passed/(results.passed + results.failed)) * 100)}%`);

  return results;
}

function testBasicEnvironment(results) {
  try {
    const hasSpreadsheetApp = typeof SpreadsheetApp !== 'undefined';
    const hasUtilities = typeof Utilities !== 'undefined';
    const hasHtmlService = typeof HtmlService !== 'undefined';

    if (hasSpreadsheetApp && hasUtilities && hasHtmlService) {
      console.log('✅ البيئة الأساسية: متاحة');
      results.passed++;
    } else {
      console.log('❌ البيئة الأساسية: ناقصة');
      results.failed++;
    }
  } catch (error) {
    console.log('❌ البيئة الأساسية: خطأ -', error.message);
    results.failed++;
  }
}

function testModuleSystem(results) {
  try {
    const hasGAssistant = typeof GAssistant !== 'undefined';
    const hasDefineModule = typeof defineModule !== 'undefined';

    if (hasGAssistant && hasDefineModule) {
      console.log('✅ نظام الوحدات: يعمل');
      console.log('📦 الوحدات المتاحة:', Object.keys(GAssistant));
      results.passed++;
    } else {
      console.log('❌ نظام الوحدات: غير متاح');
      results.failed++;
    }
  } catch (error) {
    console.log('❌ نظام الوحدات: خطأ -', error.message);
    results.failed++;
  }
}

function testSpreadsheetAccess(results) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (spreadsheet) {
      console.log('✅ الوصول للملف: نجح');
      console.log('📄 اسم الملف:', spreadsheet.getName());
      results.passed++;
    } else {
      console.log('❌ الوصول للملف: لا يوجد ملف نشط');
      results.failed++;
    }
  } catch (error) {
    console.log('❌ الوصول للملف: خطأ -', error.message);
    results.failed++;
  }
}

function testSheetCreation(results) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      console.log('⚠️ إنشاء الأوراق: تخطي - لا يوجد ملف نشط');
      return;
    }

    // إنشاء ورقة اختبار
    let testSheet = spreadsheet.getSheetByName('SystemTest');
    if (!testSheet) {
      testSheet = spreadsheet.insertSheet('SystemTest');
    }

    // اختبار الكتابة والقراءة
    const testValue = 'Test-' + Date.now();
    testSheet.getRange('A1').setValue(testValue);
    const readValue = testSheet.getRange('A1').getValue();

    if (readValue === testValue) {
      console.log('✅ إنشاء الأوراق: يعمل');
      results.passed++;
    } else {
      console.log('❌ إنشاء الأوراق: فشل في القراءة/الكتابة');
      results.failed++;
    }
  } catch (error) {
    console.log('❌ إنشاء الأوراق: خطأ -', error.message);
    results.failed++;
  }
}

function testDashboard(results) {
  try {
    if (GAssistant && GAssistant.System && GAssistant.System.Analytics) {
      // اختبار وجود الدالة
      if (typeof GAssistant.System.Analytics.Dashboard.showDashboard === 'function') {
        console.log('✅ لوحة التحكم: متاحة');
        results.passed++;

        // محاولة عرض اللوحة (اختياري)
        try {
          GAssistant.System.Analytics.Dashboard.showDashboard();
          console.log('📊 تم عرض لوحة التحكم بنجاح');
        } catch (dashError) {
          console.log('⚠️ لوحة التحكم: متاحة لكن فشل العرض -', dashError.message);
        }
      } else {
        console.log('❌ لوحة التحكم: الدالة غير موجودة');
        results.failed++;
      }
    } else {
      console.log('❌ لوحة التحكم: الوحدة غير موجودة');
      results.failed++;
    }
  } catch (error) {
    console.log('❌ لوحة التحكم: خطأ -', error.message);
    results.failed++;
  }
}

// 🔧 إصلاح سريع للمشاكل الشائعة
function quickFix() {
  console.log('🔧 تشغيل الإصلاح السريع...');

  try {
    // 1. تهيئة النظام
    if (typeof initializeGAssistantSystem === 'function') {
      initializeGAssistantSystem();
      console.log('✅ تم تشغيل تهيئة النظام');
    }

    // 2. إنشاء الأوراق الأساسية
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (spreadsheet) {
      const requiredSheets = ['OPERATION_LOG_SHEET', 'AI_Memory_Metrics', 'System_Health_Log'];

      requiredSheets.forEach(sheetName => {
        if (!spreadsheet.getSheetByName(sheetName)) {
          const sheet = spreadsheet.insertSheet(sheetName);
          sheet.getRange('A1').setValue('Timestamp');
          sheet.getRange('B1').setValue('Data');
          console.log(`✅ تم إنشاء ورقة: ${sheetName}`);
        }
      });
    }

    // 3. تنظيف الكاش
    if (typeof CacheService !== 'undefined') {
      CacheService.getUserCache().removeAll();
      console.log('✅ تم تنظيف الكاش');
    }

    console.log('🎉 اكتمل الإصلاح السريع');

  } catch (error) {
    console.log('❌ خطأ في الإصلاح:', error.message);
  }
}

// 📊 اختبار لوحة التحكم فقط
function testDashboardOnly() {
  console.log('📊 اختبار لوحة التحكم...');

  try {
    if (GAssistant?.System?.Analytics?.Dashboard?.showDashboard) {
      GAssistant.System.Analytics.Dashboard.showDashboard();
      console.log('✅ تم عرض لوحة التحكم بنجاح');
      return true;
    } else {
      console.log('❌ لوحة التحكم غير متاحة');
      return false;
    }
  } catch (error) {
    console.log('❌ خطأ في لوحة التحكم:', error.message);
    return false;
  }
}
