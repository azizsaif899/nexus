// *************************************************************************************************
// --- START OF FILE: 10_ui/3_ui_action_handler.js ---
// *************************************************************************************************

/**
 * @file 10_ui/3_ui_action_handler.js
 * @module System.UI.ActionHandler
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة معالجة الإجراءات (Controller) لواجهة المستخدم. تم فصلها عن System.UI
 * لتكون مسؤولة فقط عن تنفيذ المنطق الوظيفي الذي يتم استدعاؤه من الواجهة.
 */

defineModule('System.UI.ActionHandler', ({ Utils, Dialogue, Config, API, Tools, AI, Telemetry, DocsManager, ModuleVerifier }) => {
  // ✅ تطبيق البرمجة الدفاعية (المرحلة الخامسة من خطة الاستقرار)
  // التحقق من جاهزية الوحدات الأساسية قبل تفعيل أي وظيفة في واجهة المستخدم.
  const areDependenciesReady =
    ModuleVerifier?.isReady('AI.Core') &&
    ModuleVerifier?.isReady('Dispatcher') &&
    ModuleVerifier?.isReady('AgentsCatalog');

  if (!areDependenciesReady) {
    Utils.warn("System.UI.ActionHandler: Core backend dependencies (AI.Core, Dispatcher, AgentsCatalog) are not ready. Action handler will be disabled.");
    // إرجاع واجهة آمنة وغير وظيفية
    const safeReturn = {
      renderApiSchemaPanel: () => Dialogue.createError('API module is not ready.'),
      renderWorkshopPanel: () => Dialogue.createError('Workshop dependencies are not ready.'),
      renderInsightsPanel: () => Dialogue.createError('Project Insights module is not ready.'),
      sendPromptFromSelection: () => Dialogue.createError('Action handler dependencies are not ready.'),
      exportLastResponseToDoc: () => Dialogue.createError('AI Memory module is not ready.'),
      getCodeFromActiveCell: () => '',
      updateActiveCellWithCode: () => Dialogue.createError('Action handler dependencies are not ready.')
    };
    return safeReturn;
  }

  const MODULE_VERSION = Config.get('UI_ACTION_HANDLER_VERSION') || '1.0.0';

  DocsManager.registerModuleDocs('System.UI.ActionHandler', [
    { name: 'renderApiSchemaPanel',   version: MODULE_VERSION, description: 'يعرض توثيق واجهة API في لوحة.' },
    { name: 'renderWorkshopPanel',    version: MODULE_VERSION, description: 'يعرض محتويات ورشة عمل المطورين.' },
    { name: 'renderInsightsPanel',    version: MODULE_VERSION, description: 'يعرض رؤى المشروع في لوحة.' },
    { name: 'sendPromptFromSelection',version: MODULE_VERSION, description: 'يرسل محتوى الخلية المحددة كنصيحة للنموذج.' },
    { name: 'exportLastResponseToDoc',version: MODULE_VERSION, description: 'يصدر آخر استجابة من الجلسة إلى مستند Google Docs.' },
    { name: 'getCodeFromActiveCell',  version: MODULE_VERSION, description: 'يجلب نص الخلية النشطة إذا كان خلية واحدة.' },
    { name: 'updateActiveCellWithCode',version:MODULE_VERSION, description: 'يحدّث الخلية النشطة بالنص الجديد.' },
    { name: 'runSystemHealthCheck',   version: MODULE_VERSION, description: 'يشغل فحص سلامة النظام ويعرض تقريرًا.' }
  ]);

  function _recordInvocation(functionName) {
    Telemetry.track('UI.ActionHandler.Invocation', {
      component: 'ActionHandler',
      functionName,
      version: MODULE_VERSION,
    });
  }

  function renderApiSchemaPanel() {
    return Utils.executeSafely(() => {
      const schemaResp = API.getSchema 
        ? API.getSchema() 
        : Dialogue.createError('API.getSchema غير متوفرة.');
      _recordInvocation('renderApiSchemaPanel');
      return schemaResp;
    }, [], `UI.ActionHandler.renderApiSchemaPanel[v${MODULE_VERSION}]`);
  }

  function renderWorkshopPanel() {
    return Utils.executeSafely(() => {
      const sheet = Utils.getSheet(Config.get('DEVELOPER_WORKSHOP_SHEET'));
      if (!sheet || sheet.getLastRow() < 2) {
        _recordInvocation('renderWorkshopPanel');
        return Dialogue.createInfo('ورشة العمل فارغة أو غير موجودة.');
      }
      const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      const data    = sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();
      _recordInvocation('renderWorkshopPanel');
      return Dialogue.createTable(`ورشة العمل (${data.length} عنصر)`, headers, data);
    }, [], `UI.ActionHandler.renderWorkshopPanel[v${MODULE_VERSION}]`);
  }

  function renderInsightsPanel() {
    return Utils.executeSafely(() => {
      const result = Tools.ProjectInsights.analyzeProject({
        userQuery: 'تحليل عام للبنية والتحسينات المحتملة'
      });
      _recordInvocation('renderInsightsPanel');
      return result.type === 'success' 
        ? result 
        : Dialogue.createError('فشل تحليل المشروع.');
    }, [], `UI.ActionHandler.renderInsightsPanel[v${MODULE_VERSION}]`);
  }

  function sendPromptFromSelection() {
    return Utils.executeSafely(() => {
      const code = getCodeFromActiveCell();
      if (!code) {
        SpreadsheetApp.getUi().alert('يرجى تحديد خلية تحتوي على أمر.');
        _recordInvocation('sendPromptFromSelection');
        return;
      }
      // Note: This function now only handles the logic, not showing the UI.
      // The main UI module should handle showing the sidebar.
      SpreadsheetApp.getUi().alert(`سيتم إرسال الأمر:\n"${code.substring(0,50)}..."`);
      _recordInvocation('sendPromptFromSelection');
    }, [], `UI.ActionHandler.sendPromptFromSelection[v${MODULE_VERSION}]`);
  }

  function exportLastResponseToDoc() {
    return Utils.executeSafely(() => {
      const history = AI.Memory.getSessionHistory();
      const last    = history.filter(m => m.role==='model').pop();
      if (!last?.parts?.[0]?.text) {
        SpreadsheetApp.getUi().alert('لا توجد استجابة سابقة.');
        _recordInvocation('exportLastResponseToDoc');
        return;
      }
      const doc = DocumentApp.create(`استجابة G-Assistant - ${new Date().toLocaleString()}`);
      doc.getBody().appendParagraph(last.parts[0].text);
      SpreadsheetApp.getUi().alert(`✅ تم التصدير. الرابط: ${doc.getUrl()}`);
      _recordInvocation('exportLastResponseToDoc');
    }, [], `UI.ActionHandler.exportLastResponseToDoc[v${MODULE_VERSION}]`);
  }

  function getCodeFromActiveCell() {
    try {
      const r = SpreadsheetApp.getActiveRange();
      if (r.getNumRows()===1 && r.getNumColumns()===1) {
        return String(r.getValue());
      }
      return '';
    } catch (e) {
      Utils.error('UI.ActionHandler.getCodeFromActiveCell failed', e);
      return '';
    }
  }

  function updateActiveCellWithCode(newCode) {
    return Utils.executeSafely(() => {
      const r = SpreadsheetApp.getActiveRange();
      if (r.getNumRows()===1 && r.getNumColumns()===1) {
        r.setValue(newCode);
        _recordInvocation('updateActiveCellWithCode');
        return Dialogue.createSuccess('تم تحديث الخلية.');
      }
      return Dialogue.createError('لا توجد خلية نشطة.');
    }, [], `UI.ActionHandler.updateActiveCellWithCode[v${MODULE_VERSION}]`);
  }

  /**
   * يشغل فحص سلامة النظام ويعرض تقريرًا.
   * @returns {UiResponse}
   */
  function runSystemHealthCheck() {
    return Utils.executeSafely(() => {
      if (!ModuleVerifier?.healthCheck) {
        return Dialogue.createError('نظام فحص السلامة غير متوفر.');
      }
      const { isHealthy, report } = ModuleVerifier.healthCheck();
      const title = isHealthy ? '✅ فحص سلامة النظام: كل شيء على ما يرام' : '⚠️ فحص سلامة النظام: تم العثور على مشاكل';
      const headers = ['الوحدة', 'الحالة', 'التفاصيل'];
      const rows = report.map(item => [item.module, item.status, item.reason]);

      _recordInvocation('runSystemHealthCheck');
      return Dialogue.createTable(title, headers, rows);
    }, [], `UI.ActionHandler.runSystemHealthCheck[v${MODULE_VERSION}]`);
  }

  return {
    renderApiSchemaPanel, renderWorkshopPanel, renderInsightsPanel,
    sendPromptFromSelection, exportLastResponseToDoc, getCodeFromActiveCell,
    updateActiveCellWithCode,
    runSystemHealthCheck
  };
});

// *************************************************************************************************
// --- END OF FILE: 10_ui/3_ui_action_handler.js ---
// *************************************************************************************************