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
  GAssistant.Tools.ProjectInsights.generateProjectHealthReport();
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

/**
 * ✅ إصلاح معماري: تسجيل جميع الوحدات في ModuleVerifier بعد اكتمال تحميلها.
 * هذا يحل مشكلة "سباق التحميل" بشكل نهائي.
 */
function _registerAllModulesWithVerifier() {
  const verifier = GAssistant.System?.Dev?.ModuleVerifier;
  const allFactories = GAssistant.Utils?.Injector?._moduleFactories;

  if (!verifier || !allFactories) {
    GAssistant.System.Utils.warn('Initializer: Cannot register modules, Verifier or Injector not ready.');
    return;
  }

  const moduleNames = Object.keys(allFactories);
  moduleNames.forEach(name => {
    verifier.register(name);
  });
  GAssistant.System.Utils.log(`Initializer: Successfully registered ${moduleNames.length} modules with ModuleVerifier.`);
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

    // ✅ Architectural Fix: Register core module docs here
    if (GAssistant.System?.DocsManager?.registerCoreDocs) {
      GAssistant.System.DocsManager.registerCoreDocs();
    } else {
      Utils.warn('Initializer: Could not register Core docs. DocsManager or its function is missing.');
    }

    // 2. تسجيل جميع الوحدات في Verifier (بعد أن تم تحميلها كلها)
    _registerAllModulesWithVerifier();

    // 3. جدولة المهام الدورية
    _setupScheduledTriggers();
    
    // 4. التحقق من سلامة النظام (المعيار السابع من خطة المراجعة)
    // يتم استدعاء دالة التحقق من سلامة النظام هنا لضمان أن كل الوحدات جاهزة.
    if (GAssistant.System?.Code?.verifySystemIntegrity) {
      GAssistant.System.Code.verifySystemIntegrity();
    } else {
      Utils.warn('Initializer: Could not run system integrity verification. System.Code.verifySystemIntegrity is missing.');
    }

    // 5. التحقق من الوحدات الأساسية باستخدام StructureVerifier
    const verifier = GAssistant.System?.Dev?.StructureVerifier;
    if (verifier) {
      Utils.log('Initializer: Running StructureVerifier...');
      verifier.verifyModule('AgentsCatalog', ['getAgent', 'registerAgent']);
      verifier.verifyModule('LongTermMemory', ['save', 'load']);
    }

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

    // استدعاء إعداد مؤقتات الوكلاء لضمان تشغيلها
    const agentTriggersModule = GAssistant.System?.AgentTriggers;
    if (agentTriggersModule?.setupAgentTriggers) {
      agentTriggersModule.setupAgentTriggers();
    } else {
      console.warn('Initializer.onOpen: AgentTriggers module or setupAgentTriggers function not found.');
    }
  } catch (e) {
    console.error('Initializer.onOpen: Fatal error', e);
    SpreadsheetApp.getUi().alert(`خطأ فادح أثناء التهيئة: ${e.message}`);
  }
}

// *************************************************************************************************
// --- END OF FILE: 00_initializer.gs ---
// *************************************************************************************************
