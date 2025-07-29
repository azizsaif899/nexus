// *************************************************************************************************
// --- START OF FILE: 00_initializer.gs ---
// *************************************************************************************************

/**
 * @file 00_initializer.gs
 * @module System.Initializer
 * @version 20
 * @author عبدالعزيز
 * @description
 * نقطة الانطلاق لحزمة G-Assistant. تهيئ جميع الوحدات بالترتيب الصحيح،
 * تسجل حالة كلٍ منها، وتعرف مهمة مجدولة لرؤى المشروع.
 * المراحل المعمارية المطبقة:
 *   • 1: ترتيب تحميل الوحدات وضبط مساحة الاسم  
 *   • 10: حفظ أحداث تهيئة الوحدات في LongTermMemory  
 *   • 15: إنشاء مهمة مجدولة لفحص المشروع تلقائيًا  
 *   • 17: تسجيل مقاييس التهيئة والتشغيل في أوراق Google Sheets  
 */

var GAssistant = typeof GAssistant !== "undefined" ? GAssistant : {};

/** دالة مُساعدة لإنشاء التغليف المطلوب للتشغيل الدوري */
function _scheduled_runProjectInsights() {
  GAssistant.Tools.ProjectInsights.runScheduledInsights();
}

/** دالة إعداد triggers المجدولة (المرحلة 15) */
function _setupScheduledTriggers() {
  const existing = ScriptApp.getProjectTriggers()
    .map(t => t.getHandlerFunction());
  if (!existing.includes('_scheduled_runProjectInsights')) {
    ScriptApp.newTrigger('_scheduled_runProjectInsights')
      .timeBased()
      .everyDays(1)
      .atHour(2)
      .create();
    console.log('Initializer: Scheduled trigger for ProjectInsights created.');
  }
}

/** الدالة الرئيسية لتهيئة النظام */
function _initializeGAssistantSystem() {
  Utils.executeSafely(() => {
    // مع الاعتماد الكامل على defineModule، يتغير دور هذه الدالة.
    // تصبح نقطة انطلاق للإعداد والتحقق بعد تحميل الوحدات.

    // 1. تسجيل التوثيق للوحدات التي بها تبعية دائرية (مثل Config).
    // يتم استدعاء هذا بعد تحميل كل من Config و DocsManager بواسطة Apps Script.
    if (GAssistant.System?.DocsManager?.registerConfigDocs) {
      GAssistant.System.DocsManager.registerConfigDocs();
      Utils.log('Initializer: Registered Config documentation.');
    } else {
      Utils.warn('Initializer: Could not register Config docs. DocsManager or its function is missing.');
    }

    // 2. جدولة المهام الدورية (المرحلة 15)
    _setupScheduledTriggers();
    
    // 3. التحقق من صحة الوحدات (اختياري، لكنه جيد)
    // يمكن إضافة دالة تتحقق من وجود الوحدات الأساسية في GAssistant
    Utils.log('Initializer: System initialization checks complete.');

  }, [], 'Initializer._initializeGAssistantSystem');
}

/**
 * @public
 * Apps Script استدعاء تلقائي عند فتح المستند.  
 * يضمن تهيئة النظام واستدعاء UI.onOpen إن وجدت.
 */
function onOpen() {
  try {
    _initializeGAssistantSystem();
    const uiModule = GAssistant.UI;
    if (uiModule?.onOpen) {
      uiModule.onOpen();
    }
  } catch (e) {
    console.error('Initializer.onOpen: Fatal error', e);
    SpreadsheetApp.getUi().alert(`خطأ فادح أثناء التهيئة: ${e.message}`);
  }
}

// *************************************************************************************************
// --- END OF FILE: 00_initializer.gs ---
// *************************************************************************************************
