// Global smart trigger handlers
// معالجات المؤقتات الذكية العامة

function onSmartEdit(e) {
  try {
    if (GAssistant?.AI?.SmartTriggers?.processSmartEdit) {
      GAssistant.AI.SmartTriggers.processSmartEdit(e);
    } else {
      Logger.log('SmartTriggers module not available');
    }
  } catch (error) {
    Logger.log('onSmartEdit error: ' + error.message);
  }
}

function onInstallSmartTriggers(e) {
  try {
    if (GAssistant?.AI?.SmartTriggers?.setupSmartTriggers) {
      GAssistant.AI.SmartTriggers.setupSmartTriggers();
    } else {
      Logger.log('SmartTriggers setup not available');
    }
  } catch (error) {
    Logger.log('onInstallSmartTriggers error: ' + error.message);
  }
}

function onOpenSmartTriggers(e) {
  try {
    // إعداد تلقائي للمؤقتات عند فتح الملف
    if (GAssistant?.AI?.SmartTriggers?.setupSmartTriggers) {
      GAssistant.AI.SmartTriggers.setupSmartTriggers();
    }

    // إضافة قائمة مخصصة
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('G-Assistant')
      .addItem('عرض الشريط الجانبي', 'showEnhancedSidebar')
      .addItem('إعداد المؤقتات الذكية', 'setupSmartTriggers')
      .addItem('تشغيل الاختبارات', 'runSystemTests')
      .addSeparator()
      .addSubMenu(ui.createMenu('الوكلاء')
        .addItem('وكيل المدير المالي', 'activateCFOAgent')
        .addItem('وكيل المطور', 'activateDeveloperAgent')
        .addItem('مدير قاعدة البيانات', 'activateDatabaseAgent'))
      .addToUi();

  } catch (error) {
    Logger.log('onOpenSmartTriggers error: ' + error.message);
  }
}

// دوال القائمة المخصصة
function showEnhancedSidebar() {
  try {
    if (GAssistant?.UI?.Enhanced?.showEnhancedSidebar) {
      GAssistant.UI.Enhanced.showEnhancedSidebar();
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('خطأ في عرض الشريط الجانبي: ' + e.message);
  }
}

function setupSmartTriggers() {
  try {
    if (GAssistant?.AI?.SmartTriggers?.setupSmartTriggers) {
      const result = GAssistant.AI.SmartTriggers.setupSmartTriggers();
      SpreadsheetApp.getUi().alert(result.text);
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('خطأ في إعداد المؤقتات: ' + e.message);
  }
}

function runSystemTests() {
  try {
    if (GAssistant?.System?.Testing?.getTestReport) {
      const report = GAssistant.System.Testing.getTestReport();
      const message = `نتائج الاختبارات:\n✅ نجح: ${report.summary.passed}\n❌ فشل: ${report.summary.failed}\n📊 المجموع: ${report.summary.total}`;
      SpreadsheetApp.getUi().alert(message);
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('خطأ في تشغيل الاختبارات: ' + e.message);
  }
}

function activateCFOAgent() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt('وكيل المدير المالي', 'أدخل طلبك المالي:', ui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() === ui.Button.OK) {
      const message = response.getResponseText();
      if (GAssistant?.AI?.Agents?.CFO?.handleRequest) {
        const result = GAssistant.AI.Agents.CFO.handleRequest({
          sessionId: `menu_${Date.now()}`,
          message: message,
          intent: { type: 'general_query' }
        });
        ui.alert('استجابة الوكيل المالي', result.text, ui.ButtonSet.OK);
      }
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('خطأ في وكيل المدير المالي: ' + e.message);
  }
}

function activateDeveloperAgent() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt('وكيل المطور', 'أدخل طلبك التقني:', ui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() === ui.Button.OK) {
      const message = response.getResponseText();
      if (GAssistant?.AI?.Agents?.Developer?.handleRequest) {
        const result = GAssistant.AI.Agents.Developer.handleRequest({
          sessionId: `menu_${Date.now()}`,
          message: message,
          intent: { type: 'general_query' }
        });
        ui.alert('استجابة وكيل المطور', result.text, ui.ButtonSet.OK);
      }
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('خطأ في وكيل المطور: ' + e.message);
  }
}

function activateDatabaseAgent() {
  try {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt('مدير قاعدة البيانات', 'أدخل طلبك لإدارة البيانات:', ui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() === ui.Button.OK) {
      const message = response.getResponseText();
      if (GAssistant?.AI?.Agents?.DatabaseManager?.handleRequest) {
        const result = GAssistant.AI.Agents.DatabaseManager.handleRequest({
          sessionId: `menu_${Date.now()}`,
          message: message,
          intent: { type: 'general_query' }
        });
        ui.alert('استجابة مدير قاعدة البيانات', result.text, ui.ButtonSet.OK);
      }
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('خطأ في مدير قاعدة البيانات: ' + e.message);
  }
}
