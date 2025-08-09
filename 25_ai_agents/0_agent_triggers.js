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


defineModule('System.AgentTriggers', ({ Utils, Config, DocsManager, Telemetry }) => {
  const MODULE_VERSION = '2.0.0';
  const HANDLERS = ['cfoMonthlyTrigger', 'devWeeklyTrigger', 'generalMaintenanceTrigger'];

  DocsManager.registerModuleDocs('System.AgentTriggers', [
    {
      name: 'setupAgentTriggers',
      version: MODULE_VERSION,
      description: 'إعداد جميع مؤقتات الوكلاء الذكيين مع مراقبة متقدمة',
      returns: { type: 'BOOLEAN', description: 'true إذا تم الإعداد بنجاح' }
    },
    {
      name: 'getTriggersStatus',
      version: MODULE_VERSION,
      description: 'الحصول على حالة جميع المؤقتات المفعلة',
      returns: { type: 'ARRAY', description: 'قائمة بحالة المؤقتات' }
    }
  ]);

  /**
   * دالة مساعدة داخلية لحذف المؤقتات التي تديرها هذه الوحدة قبل إعادة إنشائها.
   * يتم تصفية المؤقتات بناءً على أسماء الدوال المعرفة في HANDLERS.
   * @private
   */
  function _removeExistingTriggers() {
    try {
      const removed = [];
      ScriptApp.getProjectTriggers()
        .filter(t => HANDLERS.includes(t.getHandlerFunction()))
        .forEach(t => {
          const handlerName = t.getHandlerFunction();
          ScriptApp.deleteTrigger(t);
          removed.push(handlerName);
          Utils.log(`AgentTriggers: removed trigger ${handlerName}`);
        });
      
      if (removed.length > 0) {
        Telemetry.track('AgentTriggers.TriggersRemoved', { count: removed.length, handlers: removed });
      }
      
      return removed;
    } catch (e) {
      Utils.error('AgentTriggers: Could not remove existing triggers', e);
      return [];
    }
  }

  /**
   * يقوم بإعداد أو إعادة إعداد جميع مؤقتات الوكلاء الأذكياء.
   * يحذف المؤقتات القديمة أولاً لضمان عدم وجود تكرار.
   */
  function setupAgentTriggers() {
    return Utils.executeSafely(() => {
      const removed = _removeExistingTriggers();
      const created = [];

      // مؤقت وكيل المدير المالي (شهري)
      try {
        ScriptApp.newTrigger('cfoMonthlyTrigger')
          .timeBased()
          .onMonthDay(1)
          .atHour(2)
          .create();
        created.push('cfoMonthlyTrigger');
        Utils.log('AgentTriggers: Created cfoMonthlyTrigger');
      } catch (e) {
        Utils.error('Failed to create cfoMonthlyTrigger', e);
      }

      // مؤقت وكيل المطور (أسبوعي)
      try {
        ScriptApp.newTrigger('devWeeklyTrigger')
          .timeBased()
          .everyWeeks(1)
          .onWeekDay(ScriptApp.WeekDay.MONDAY)
          .atHour(3)
          .create();
        created.push('devWeeklyTrigger');
        Utils.log('AgentTriggers: Created devWeeklyTrigger');
      } catch (e) {
        Utils.error('Failed to create devWeeklyTrigger', e);
      }

      // مؤقت صيانة عام (يومي)
      try {
        ScriptApp.newTrigger('generalMaintenanceTrigger')
          .timeBased()
          .everyDays(1)
          .atHour(1)
          .create();
        created.push('generalMaintenanceTrigger');
        Utils.log('AgentTriggers: Created generalMaintenanceTrigger');
      } catch (e) {
        Utils.error('Failed to create generalMaintenanceTrigger', e);
      }

      // تسجيل الإحصائيات
      Telemetry.track('AgentTriggers.Setup', {
        removed: removed.length,
        created: created.length,
        success: created.length > 0
      });

      // حفظ في ورقة المقاييس
      const sheet = Utils.getSheet('AgentTriggers_Metrics', [
        'Timestamp', 'Action', 'TriggersRemoved', 'TriggersCreated', 'Status'
      ]);
      if (sheet) {
        sheet.appendRow([
          new Date(),
          'setupAgentTriggers',
          removed.length,
          created.length,
          created.length > 0 ? 'success' : 'partial_failure'
        ]);
      }

      return created.length > 0;
    }, [], 'System.AgentTriggers.setupAgentTriggers');
  }

  function getTriggersStatus() {
    try {
      const triggers = ScriptApp.getProjectTriggers()
        .filter(t => HANDLERS.includes(t.getHandlerFunction()))
        .map(t => ({
          handler: t.getHandlerFunction(),
          eventType: t.getEventType().toString(),
          source: t.getTriggerSource().toString(),
          uid: t.getUniqueId()
        }));
      
      return triggers;
    } catch (e) {
      Utils.error('Failed to get triggers status', e);
      return [];
    }
  }

  const exports = { 
    setupAgentTriggers, 
    getTriggersStatus,
    MODULE_VERSION 
  };

  // Register with main AI.Agents module
  if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.Agents) {
    GAssistant.AI.Agents.registerSubModule('Triggers', exports);
  }

  return exports;
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
  try {
    if (GAssistant?.AI?.Agents?.CFO?.runMonthlyPNL) {
      GAssistant.AI.Agents.CFO.runMonthlyPNL();
    } else {
      Logger.log('Error: CFO agent not available');
    }
  } catch (e) {
    Logger.log('cfoMonthlyTrigger error: ' + e.message);
  }
}

/**
 * Handler for the weekly Developer agent trigger.
 * يستدعي دالة runWeeklyCodeReview من وكيل المطور.
 */
function devWeeklyTrigger() {
  try {
    if (GAssistant?.AI?.Agents?.Developer?.runWeeklyCodeReview) {
      GAssistant.AI.Agents.Developer.runWeeklyCodeReview();
    } else {
      Logger.log('Error: Developer agent not available');
    }
  } catch (e) {
    Logger.log('devWeeklyTrigger error: ' + e.message);
  }
}

function generalMaintenanceTrigger() {
  try {
    if (GAssistant?.AI?.Agents?.General?.performMaintenance) {
      GAssistant.AI.Agents.General.performMaintenance();
    } else {
      Logger.log('General maintenance not available');
    }
  } catch (e) {
    Logger.log('generalMaintenanceTrigger error: ' + e.message);
  }
}

function onInstall(e) {
  try {
    if (GAssistant?.AI?.Agents?.Triggers?.setupAgentTriggers) {
      GAssistant.AI.Agents.Triggers.setupAgentTriggers();
    } else {
      Logger.log('Error: AgentTriggers not available on install');
    }
  } catch (e) {
    Logger.log('onInstall error: ' + e.message);
  }
}

function onOpen(e) {
  try {
    if (GAssistant?.AI?.Agents?.Triggers?.setupAgentTriggers) {
      GAssistant.AI.Agents.Triggers.setupAgentTriggers();
    } else {
      Logger.log('Error: AgentTriggers not available on open');
    }
  } catch (e) {
    Logger.log('onOpen error: ' + e.message);
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
