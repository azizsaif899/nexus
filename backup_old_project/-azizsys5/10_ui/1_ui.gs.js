// *************************************************************************************************
// --- START OF FILE: 10_ui/1_ui.gs ---
// *************************************************************************************************

/**
 * @file 10_ui/1_ui.gs
 * @module System.UI
 * @version 20
 * @author عبدالعزيز
 * @description
 * وحدة مسؤولة عن إنشاء وإدارة عناصر واجهة المستخدم.
 * تشمل: قائمة التخصيص، الأشرطة الجانبية، النوافذ المنبثقة، وعرض الألواح.
 * المراحل المعمارية المطبقة:
 *   • 1  تحويل الوحدة إلى defineModule وربط التبعيات
 *   • 4  واجهة تفاعلية – إنشاء القائمة والألواح
 *   • 9  تسجيل الوثائق في DocsManager
 *   • 10 حفظ استدعاءات الواجهة في LongTermMemory
 *   • 11 إرسال Telemetry عن كل تتفاعل
 *   • 17 تسجيل مقاييس التشغيل في ورقة UI_Metrics
 *   • 18 تضمين رقم الإصدار في البيانات الوصفية
 */

defineModule('System.UI', ({ Utils, Dialogue, Config, API, Tools, AI, Telemetry, DocsManager }) => {
  const MODULE_VERSION = Config.get('UI_VERSION') || '1.0.0';

  // مرحلة 9: تسجيل توثيق الدوال
  DocsManager.registerModuleDocs('System.UI', [
    { name: 'onOpen',                 version: MODULE_VERSION, description: 'تهيئة القائمة المخصصة عند فتح المستند.' },
    { name: 'showAssistantSidebar',   version: MODULE_VERSION, description: 'يفتح شريط مساعد G-Assistant الجانبي.' },
    { name: 'showDeveloperSidebar',   version: MODULE_VERSION, description: 'يفتح شريط أدوات المطور الجانبي.' },
    { name: 'showWebApp',             version: MODULE_VERSION, description: 'يفتح لوحة التحكم في نافذة منبثقة.' },
    { name: 'renderApiSchemaPanel',   version: MODULE_VERSION, description: 'يعرض توثيق واجهة API في لوحة.' },
    { name: 'renderWorkshopPanel',    version: MODULE_VERSION, description: 'يعرض محتويات ورشة عمل المطورين.' },
    { name: 'renderInsightsPanel',    version: MODULE_VERSION, description: 'يعرض رؤى المشروع في لوحة.' },
    { name: 'sendPromptFromSelection',version: MODULE_VERSION, description: 'يرسل محتوى الخلية المحددة كنصيحة للنموذج.' },
    { name: 'exportLastResponseToDoc',version: MODULE_VERSION, description: 'يصدر آخر استجابة من الجلسة إلى مستند Google Docs.' },
    { name: 'getCodeFromActiveCell',  version: MODULE_VERSION, description: 'يجلب نص الخلية النشطة إذا كان خلية واحدة.' },
    { name: 'updateActiveCellWithCode',version:MODULE_VERSION, description: 'يحدّث الخلية النشطة بالنص الجديد.' }
  ]);

  /**
   * يسجل استدعاء أي دالة UI في الذاكرة طويلة الأمد، Telemetry، وأوراق المقاييس.
   * @param {string} functionName
   */
  function _recordInvocation(functionName) {
    const timestamp = new Date().toISOString();

    // مرحلة 10: LongTermMemory
    AI.LongTermMemory.save('UIInvocation', {
      component: 'UI',
      functionName,
      version: MODULE_VERSION,
      timestamp
    });

    // مرحلة 11: Telemetry
    Telemetry.track('UI.Invocation', {
      component: 'UI',
      functionName,
      version: MODULE_VERSION,
      timestamp
    });

    // مرحلة 17: Google Sheets Metrics
    const sheet = Utils.getSheet('UI_Metrics', ['Timestamp','Function','Version']);
    sheet.appendRow([ new Date(), functionName, MODULE_VERSION ]);
  }

  function onOpen() {
    Utils.executeSafely(() => {
      const ui = SpreadsheetApp.getUi();
      ui.createMenu('✨ G-Assistant')
        .addItem('💬 فتح المساعد',        'showAssistantSidebar')
        .addItem('👨‍💻 أدوات المطور',     'showDeveloperSidebar')
        .addItem('🌐 لوحة التحكم',       'showWebApp')
        .addSeparator()
        .addItem('▶️ إرسال كأمر',       'sendPromptFromSelection')
        .addSeparator()
        .addSubMenu(ui.createMenu('⚙️ النظام')
          .addItem('تصدير توثيق الأدوات',     'exportToolsDocumentationToDoc')
          .addItem('تصدير آخر استجابة',       'exportLastResponseToDoc')
          .addItem('إعداد مؤقتات الوكلاء',     'setupAgentTriggersGlobally')
          .addItem('مسح ذاكرة الجلسة',         'clearSessionContext')
          .addItem('🧪 تشغيل الاختبارات',       'runAllTests')
        )
        .addToUi();
      Utils.log('UI.onOpen: Custom menu created.');
    }, [], `UI.onOpen[v${MODULE_VERSION}]`);

    _recordInvocation('onOpen');
  }

  function showAssistantSidebar() {
    return Utils.executeSafely(() => {
      const html = HtmlService.createHtmlOutputFromFile(
        Config.get('ASSISTANT_SIDEBAR_FILE')
      ).setTitle('✨ مساعد G-Assistant')
       .setWidth(350);
      SpreadsheetApp.getUi().showSidebar(html);
      return Dialogue.createInfo('تم فتح شريط المساعد.');
    }, [], `UI.showAssistantSidebar[v${MODULE_VERSION}]`)
    .tap(() => _recordInvocation('showAssistantSidebar'));
  }

  function showDeveloperSidebar() {
    return Utils.executeSafely(() => {
      const html = HtmlService.createHtmlOutputFromFile(
        Config.get('DEVELOPER_SIDEBAR_FILE')
      ).setTitle('👨‍💻 أدوات المطور')
       .setWidth(500);
      SpreadsheetApp.getUi().showSidebar(html);
      return Dialogue.createInfo('تم فتح شريط أدوات المطور.');
    }, [], `UI.showDeveloperSidebar[v${MODULE_VERSION}]`)
    .tap(() => _recordInvocation('showDeveloperSidebar'));
  }

  function showWebApp() {
    return Utils.executeSafely(() => {
      const html = HtmlService.createHtmlOutputFromFile(
        Config.get('WEB_APP_FILE')
      ).setWidth(900).setHeight(700);
      SpreadsheetApp.getUi().showModalDialog(html, 'لوحة تحكم G-Assistant');
      return Dialogue.createInfo('تم فتح لوحة التحكم.');
    }, [], `UI.showWebApp[v${MODULE_VERSION}]`)
    .tap(() => _recordInvocation('showWebApp'));
  }

  function renderApiSchemaPanel() {
    return Utils.executeSafely(() => {
      const schemaResp = API.getSchema 
        ? API.getSchema() 
        : Dialogue.createError('API.getSchema غير متوفرة.');
      _recordInvocation('renderApiSchemaPanel');
      return schemaResp;
    }, [], `UI.renderApiSchemaPanel[v${MODULE_VERSION}]`);
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
    }, [], `UI.renderWorkshopPanel[v${MODULE_VERSION}]`);
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
    }, [], `UI.renderInsightsPanel[v${MODULE_VERSION}]`);
  }

  function sendPromptFromSelection() {
    return Utils.executeSafely(() => {
      const code = getCodeFromActiveCell();
      if (!code) {
        SpreadsheetApp.getUi().alert('يرجى تحديد خلية تحتوي على أمر.');
        _recordInvocation('sendPromptFromSelection');
        return;
      }
      onOpen(); // عرض الشريط
      SpreadsheetApp.getUi().alert(`سيتم إرسال الأمر:\n"${code.substring(0,50)}..."`);
      _recordInvocation('sendPromptFromSelection');
    }, [], `UI.sendPromptFromSelection[v${MODULE_VERSION}]`);
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
    }, [], `UI.exportLastResponseToDoc[v${MODULE_VERSION}]`);
  }

  function getCodeFromActiveCell() {
    try {
      const r = SpreadsheetApp.getActiveRange();
      if (r.getNumRows()===1 && r.getNumColumns()===1) {
        return String(r.getValue());
      }
      return '';
    } catch (e) {
      Utils.error('UI.getCodeFromActiveCell failed', e);
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
    }, [], `UI.updateActiveCellWithCode[v${MODULE_VERSION}]`);
  }

  return {
    onOpen,
    showAssistantSidebar,
    showDeveloperSidebar,
    showWebApp,
    renderApiSchemaPanel,
    renderWorkshopPanel,
    renderInsightsPanel,
    sendPromptFromSelection,
    exportLastResponseToDoc,
    getCodeFromActiveCell,
    updateActiveCellWithCode
  };
});

// *************************************************************************************************
// --- END OF FILE: 10_ui/1_ui.gs ---
// *************************************************************************************************
