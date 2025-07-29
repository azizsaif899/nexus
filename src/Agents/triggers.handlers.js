// Global trigger handlers
// هذه الدوال يجب أن تكون في النطاق العام (Global Scope) لكي يتمكن نظام المؤقتات من استدعائها

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