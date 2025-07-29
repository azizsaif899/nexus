/**
 * @file 70_telemetry/error_logger.js
 * @module System.ErrorLogger
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة بسيطة لتسجيل الأخطاء في الذاكرة أثناء تنفيذ عملية واحدة،
 * وتصديرها كملف JavaScript يمكن مراقبته خارجيًا.
 */

defineModule('System.ErrorLogger', () => {
  const _log = [];

  /**
   * يسجل رسالة خطأ جديدة في الذاكرة.
   * @param {string} message - نص رسالة الخطأ.
   * @param {string} [source='Unknown'] - مصدر الخطأ (e.g., 'Agents.Catalog').
   */
  function record(message, source = 'Unknown') {
    _log.push({
      time: new Date().toISOString(),
      source,
      message
    });
  }

  /**
   * يصدر سجل الأخطاء المجمعة كنص JavaScript.
   * @returns {string} - السجل بصيغة `const AzizSys_ErrorLog = [...];`.
   */
  function exportAsJS() {
    const json = JSON.stringify(_log, null, 2);
    return `const AzizSys_ErrorLog = ${json};`;
  }

  return { record, exportAsJS };
});