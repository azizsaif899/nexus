// *************************************************************************************************
// --- START OF FILE: 99_Code.gs ---
// *************************************************************************************************

/**
 * @file 99_Code.gs
 * @module System.Code
 * @version 20
 * @author عبدالعزيز
 * @description
 * نقطة الدخول العامة لكل الطلبات:
 * - Web App (doGet, doPost)
 * - واجهة UI (google.script.run)
 * - أدوات AI و System و Testing
 * مرتبطة بـ: Config, UI, AI.Core, Tools.*, Tests, Dispatcher, Memory
 */

defineModule('System.Code', ({ Config, UI, AI, Tools, Tests, Utils, Dispatcher, Memory }) => {
  function doGet(e) {
    if (!Utils?.log) {
      console.error("❌ Utils module not available in doGet.");
      return HtmlService.createHtmlOutput("⚠️ النظام لم يُحمّل بعد.").setTitle("G-Assistant");
    }

    Utils.log('Web App: doGet', { params: e.parameter });

    if (!Config?.get) {
      return HtmlService.createHtmlOutput("⚠️ لم يتم تحميل إعدادات المشروع.").setTitle("G-Assistant");
    }

    return HtmlService
      .createHtmlOutputFromFile(Config.get('WEB_APP_FILE'))
      .setTitle('G-Assistant Dashboard')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  function doPost(e) {
    if (!Utils?.log || !Utils?.error || !Utils?.getFunctionByPath) {
      console.error("❌ Utils module not available in doPost.");
      return _createJsonResponse({ error: 'Utils module not loaded.' }, 500);
    }

    Utils.log('Web App: doPost', { length: e.postData?.contents?.length });

    const provided = e.parameter.apiKey;
    const expected = PropertiesService.getScriptProperties().getProperty('WEB_APP_API_KEY');
    if (!expected || provided !== expected) {
      return _createJsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
      const { action, params } = JSON.parse(e.postData.contents);
      const apiModule = typeof GAssistant.API?.Endpoints === 'function'
        ? GAssistant.API.Endpoints()
        : GAssistant.API?.Endpoints;

      const fn = apiModule?.[action];
      if (typeof fn === 'function') {
        return _createJsonResponse(fn(params), 200);
      }

      return _createJsonResponse({ error: `Action '${action}' not found.` }, 404);
    } catch (err) {
      Utils.error('doPost', err);
      return _createJsonResponse({ error: err.message }, 500);
    }
  }

  function _createJsonResponse(data, code) {
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(code);
  }

  function onOpen() {
    if (typeof SpreadsheetApp.getUi !== 'function') return;
    if (!UI?.onOpen) {
      SpreadsheetApp.getUi().alert("⚠️ واجهة المستخدم غير جاهزة بعد.");
      return;
    }
    UI.onOpen();
  }

  function runAllTests() {
    const results = Tests?.runAllTests?.() || [];
    const failed = results.filter(r => !r.success).length;
    SpreadsheetApp.getUi().alert(`✅ شُغّلت ${results.length} اختبار، فشل ${failed}.`);
    return results;
  }

  function verifySystemIntegrity() {
    const status = [];
    try {
      status.push(['UI', typeof UI?.onOpen === 'function' ? '✅ جاهزة' : '❌ مفقودة']);
      status.push(['Config', typeof Config?.get === 'function' ? '✅ جاهزة' : '❌ مفقودة']);
      status.push(['Utils', typeof Utils?.defineModule === 'function' ? '✅ جاهزة' : '❌ مفقودة']);
      status.push(['Tools.Catalog', typeof Tools?.Catalog?.getDeclarations === 'function' ? '✅ جاهزة' : '❌ مفقودة']);
      status.push(['Injector', typeof Utils?.Injector?.get === 'function' ? '✅ جاهز' : '❌ مفقود']);
      status.push(['Dispatcher', typeof Dispatcher?.dispatchPrompt === 'function' ? '✅ مفعل' : '❌ غير مفعل']);
    } catch (e) {
      status.push(['⚠️ خطأ عام', e.message]);
    }
    Logger.log(status);
  }

  return {
    doGet,
    doPost,
    onOpen,
    runAllTests,
    verifySystemIntegrity
  };
});

// *************************************************************************************************
// --- END OF FILE: 99_Code.gs ---
// *************************************************************************************************