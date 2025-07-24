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

defineModule('System.Code', ({ Config, Utils, UI, API, ModuleVerifier }) => { // Dependencies simplified
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

    // ✅ تطبيق البرمجة الدفاعية
    if (!ModuleVerifier?.checkReady('API', ['ask'])) {
      return _createJsonResponse({ error: "API module is not ready." }, 503);
    }

    Utils.log('Web App: doPost', { length: e.postData?.contents?.length });

    const provided = e.parameter.apiKey;
    const expected = PropertiesService.getScriptProperties().getProperty('WEB_APP_API_KEY');
    if (!expected || provided !== expected) {
      return _createJsonResponse({ error: 'Unauthorized' }, 401); // Keep this for API security
    }

    try {
      const { action, params } = JSON.parse(e.postData.contents);

      const fn = API?.[action]; // Directly use injected API module
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

  return {
    doGet,
    doPost
  };
});