// ES6 imports removed for Google Apps Script compatibility
/**
 * @file 25_ai_agents/0_agent_triggers.gs
 * @module System.AgentTriggers
 * @version 1.0.0
 * @description
 * إدارة الـTime‐Driven Triggers لتشغيل وكلاء G-Assistant أسبوعياً وشهرياً.
 */
// ScriptApp and Logger are global in GAS environment, no import needed.

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