// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/0_agent_triggers.gs ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/0_agent_triggers.gs
 * @module System.AgentTriggers
 * @version 1.0.0
 * @description
 * إدارة الـTime‐Driven Triggers لتشغيل وكلاء G-Assistant أسبوعياً وشهرياً.
 */

'use strict';

// افترض أن defineModule متاح في النطاق العام، أو قم بتعريفه إذا لم يكن موجودًا.
// في بيئة Google Apps Script، قد يكون هذا جزءًا من ملف تهيئة عام.
// مثال بسيط لـ defineModule إذا لم يكن موجودًا:
// function defineModule(name, factory) {
//   const parts = name.split('.');
//   let current = global;
//   for (let i = 0; i < parts.length - 1; i++) {
//     current[parts[i]] = current[parts[i]] || {};
//     current = current[parts[i]];
//   }
//   current[parts[parts.length - 1]] = factory({
//     Utils: global.GAssistant?.Utils?.Utils, // مثال على جلب التبعيات
//     Config: global.GAssistant?.System?.Config
//   });
// }


defineModule('System.AgentTriggers', ({ Utils, Config }) => {
  const HANDLERS = ['cfoMonthlyTrigger', 'devWeeklyTrigger'];

  /**
   * دالة مساعدة داخلية لحذف المؤقتات التي تديرها هذه الوحدة قبل إعادة إنشائها.
   * يتم تصفية المؤقتات بناءً على أسماء الدوال المعرفة في HANDLERS.
   * @private
   */
  function _removeExistingTriggers() {
    try {
      ScriptApp.getProjectTriggers()
        .filter(t => HANDLERS.includes(t.getHandlerFunction()))
        .forEach(t => {
          ScriptApp.deleteTrigger(t);
          // استخدام Utils.log للتسجيل، مع التأكد من توفره
          if (Utils && typeof Utils.log === 'function') {
            Utils.log(`AgentTriggers: removed trigger ${t.getHandlerFunction()}`);
          } else {
            Logger.log(`AgentTriggers: removed trigger ${t.getHandlerFunction()}`);
          }
        });
    } catch (e) {
      // استخدام Utils.error للتسجيل، مع توفير fallback لـ Logger
      if (Utils && typeof Utils.error === 'function') {
        Utils.error('AgentTriggers: Could not remove existing triggers, proceeding anyway.', e);
      } else {
        Logger.log(`AgentTriggers: Could not remove existing triggers: ${e.message}`);
      }
    }
  }

  /**
   * يقوم بإعداد أو إعادة إعداد جميع مؤقتات الوكلاء الأذكياء.
   * يحذف المؤقتات القديمة أولاً لضمان عدم وجود تكرار.
   */
  function setupAgentTriggers() {
    // التأكد من أن Utils متاح قبل استخدامه في executeSafely
    if (!Utils || typeof Utils.executeSafely !== 'function') {
      Logger.log('Error: Utils module or executeSafely function is not available.');
      return; // الخروج إذا كانت التبعيات الأساسية مفقودة
    }

    Utils.executeSafely(() => {
      _removeExistingTriggers();

      // إعداد مؤقت وكيل المدير المالي (يعمل في اليوم الأول من كل شهر)
      ScriptApp.newTrigger('cfoMonthlyTrigger')
        .timeBased()
        .onMonthDay(1)
        .atHour(2) // الساعة 2 صباحًا لتجنب أوقات الذروة
        .create();
      Utils.log('AgentTriggers: Created trigger cfoMonthlyTrigger');

      // إعداد مؤقت وكيل المطور (يعمل كل يوم اثنين)
      ScriptApp.newTrigger('devWeeklyTrigger')
        .timeBased()
        .everyWeeks(1)
        .onWeekDay(ScriptApp.WeekDay.MONDAY)
        .atHour(3) // الساعة 3 صباحًا
        .create();
      Utils.log('AgentTriggers: Created trigger devWeeklyTrigger');

      return true;
    }, [], 'System.AgentTriggers.setupAgentTriggers');
  }

  // الواجهة العامة للوحدة
  return { setupAgentTriggers };
});

// ============================================================================
// Global Trigger Handlers
// هذه الدوال يجب أن تكون في النطاق العام (Global Scope) لكي يتمكن نظام المؤقتات من استدعائها.
// تعمل هذه الدوال كوسيط بسيط يستدعي المنطق الفعلي داخل الوحدات المنظمة.
// ============================================================================

/**
 * Handler for the monthly CFO agent trigger.
 * يستدعي دالة runMonthlyPNL من وكيل المدير المالي.
 */
function cfoMonthlyTrigger() {
  // يجب التأكد من تهيئة System.AgentCFO قبل استدعاء هذه الدالة
  if (typeof System !== 'undefined' && System.AgentCFO && typeof System.AgentCFO.runMonthlyPNL === 'function') {
    System.AgentCFO.runMonthlyPNL();
  } else {
    Logger.log('Error: System.AgentCFO.runMonthlyPNL is not defined or callable.');
  }
}

/**
 * Handler for the weekly Developer agent trigger.
 * يستدعي دالة runWeeklyCodeReview من وكيل المطور.
 */
function devWeeklyTrigger() {
  // يجب التأكد من تهيئة System.AgentDeveloper قبل استدعاء هذه الدالة
  if (typeof System !== 'undefined' && System.AgentDeveloper && typeof System.AgentDeveloper.runWeeklyCodeReview === 'function') {
    System.AgentDeveloper.runWeeklyCodeReview();
  } else {
    Logger.log('Error: System.AgentDeveloper.runWeeklyCodeReview is not defined or callable.');
  }
}

/**
 * دالة onInstall هي دالة خاصة في Google Apps Script يتم تشغيلها
 * تلقائيًا عند تثبيت الوظيفة الإضافية أو نشر السكريبت لأول مرة.
 * تقوم بإعداد المؤقتات للوكلاء الأذكياء.
 * @param {GoogleAppsScript.Events.AddonOnInstall} e حدث التثبيت.
 */
function onInstall(e) {
  // يجب التأكد من تهيئة System.AgentTriggers قبل استدعاء هذه الدالة
  if (typeof System !== 'undefined' && System.AgentTriggers && typeof System.AgentTriggers.setupAgentTriggers === 'function') {
    System.AgentTriggers.setupAgentTriggers();
  } else {
    Logger.log('Error: System.AgentTriggers.setupAgentTriggers is not defined or callable on install.');
  }
}

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/0_agent_triggers.gs ---
// *************************************************************************************************
