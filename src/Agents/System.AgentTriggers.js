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

  return { 
    setupAgentTriggers, 
    getTriggersStatus,
    MODULE_VERSION 
  };
});