/**
 * @OnlyCurrentDoc
 * @file 90_dev_runners.js
 * @description
 * هذا الملف يحتوي على دوال عامة يمكن تشغيلها يدويًا من محرر Apps Script
 * لأغراض التطوير والصيانة.
 */

/**
 * يقوم بتشغيل تدقيق التوثيق للتحقق من الوحدات والدوال غير الموثقة.
 * يتم طباعة التقرير في سجلات Apps Script (Logs).
 */
function runDocumentationAudit() {
  const { DocsAuditor } = GAssistant.Utils.Injector.get('System.Dev.DocsAuditor');
  if (DocsAuditor && typeof DocsAuditor.runAudit === 'function') {
    Logger.log('Starting documentation audit via manual runner...');
    DocsAuditor.runAudit();
    Logger.log('Audit complete. Check the logs above for the full report.');
  } else {
    Logger.log('ERROR: Could not load the DocsAuditor module. Please check the logs for dependency errors.');
  }
}

/**
 * ينشئ أو يحدّث ملف سجل الأخطاء الحي على Google Drive.
 * يمكن استدعاء هذه الدالة بعد عمليات حساسة لتصدير الأخطاء المسجلة.
 */
function createLiveErrorFile() {
  const { ErrorLogger, Utils } = GAssistant.Utils.Injector.get('System.ErrorLogger', 'System.Utils');

  if (!ErrorLogger || !Utils) {
    Logger.log('ERROR: Could not load ErrorLogger or Utils modules.');
    return;
  }

  Utils.executeSafely(() => {
    const jsText = ErrorLogger.exportAsJS();
    const fileName = 'AzizSys_ErrorLog.js';

    const files = DriveApp.getFilesByName(fileName);
    const file = files.hasNext() ? files.next() : DriveApp.createFile(fileName, jsText, MimeType.JAVASCRIPT);
    file.setContent(jsText);

    Logger.log(`✅ سجل الأخطاء تم تحديثه: ${fileName}`);
  }, 'createLiveErrorFile');
}