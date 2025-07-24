/**
 * @file 70_telemetry/error_logger.js
 * @module System.ErrorLogger
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * وحدة متخصصة لتسجيل الأخطاء بشكل مستمر في ملف JSON مخصص في Google Drive.
 * تعالج المشكلة الجذرية لـ "Bad control character" عن طريق ضمان استخدام JSON.stringify
 * بشكل صحيح على كامل مجموعة البيانات قبل الكتابة.
 */

'use strict';

defineModule('System.ErrorLogger', ({ Utils, Config }) => {
  // Buffer to hold errors during a single script execution.
  let _errorBuffer = [];
  const LOG_FILE_NAME = Config.get('ERROR_LOG_FILENAME') || 'GAssistant_ErrorLog.json';

  /**
   * يسجل كائن خطأ منظم في الذاكرة المؤقتة (buffer).
   * يتم استدعاء هذه الدالة من Utils.error.
   * @param {object} errorData - كائن الخطأ المنظم.
   *   { message: string, context: string, stack?: string, errorMessage?: string }
   */
  function record(errorData) {
    // إضافة طابع زمني لكل خطأ لتسهيل التتبع
    errorData.timestamp = new Date().toISOString();
    _errorBuffer.push(errorData);
    Utils.log('ErrorLogger: An error was buffered.', { count: _errorBuffer.length });
  }

  /**
   * يكتب الأخطاء المخزنة في الـ buffer إلى ملف سجل JSON في Google Drive.
   * هذا هو جوهر الإصلاح. يقرأ السجل الحالي، يضيف الأخطاء الجديدة،
   * ثم يقوم بعمل stringify للبنية بأكملها، مما يضمن تهيئة (escape) جميع
   * رموز التحكم (مثل \n في stack traces) بشكل صحيح.
   */
  function flushBufferToFile() {
    if (_errorBuffer.length === 0) {
      Utils.log('ErrorLogger: No new errors to flush.');
      return; // لا يوجد شيء لفعله
    }

    Utils.executeSafely(() => {
      const rootFolder = DriveApp.getRootFolder();
      const files = rootFolder.getFilesByName(LOG_FILE_NAME);
      let logFile;
      let logData = {
        lastUpdated: '',
        errors: []
      };

      // 1. قراءة ملف السجل الحالي إذا كان موجودًا
      if (files.hasNext()) {
        logFile = files.next();
        const content = logFile.getBlob().getDataAsString();
        if (content) {
          // استخدام safeParse لتجنب فشل العملية بأكملها إذا كان الملف تالفًا
          const parsedContent = Utils.safeParse(content, { errors: [] });
          logData.errors = Array.isArray(parsedContent.errors) ? parsedContent.errors : [];
        }
      } else {
        // 2. إنشاء ملف جديد إذا لم يكن موجودًا
        logFile = rootFolder.createFile(LOG_FILE_NAME, '', MimeType.JSON);
        Utils.log(`ErrorLogger: Created new log file: ${LOG_FILE_NAME}`);
      }

      // 3. إضافة الأخطاء الجديدة من الـ buffer
      logData.errors.push(..._errorBuffer);
      logData.lastUpdated = new Date().toISOString();

      // 4. ✅ الخطوة الحاسمة: تحويل الكائن بأكمله إلى سلسلة JSON صالحة
      // هذا يضمن أن أي رموز خاصة مثل `\n` في `error.stack` يتم تهيئتها بشكل صحيح إلى `\\n`.
      const jsonContent = JSON.stringify(logData, null, 2);

      // 5. كتابة المحتوى المحدث إلى الملف
      logFile.setContent(jsonContent);

      Utils.log(`ErrorLogger: Flushed ${_errorBuffer.length} new errors to ${LOG_FILE_NAME}. Total errors: ${logData.errors.length}`);

      // 6. مسح الـ buffer بعد الكتابة الناجحة
      _errorBuffer = [];

    }, 'ErrorLogger.flushBufferToFile');
  }

  // ربط دالة flush تلقائيًا بنهاية تنفيذ السكربت لضمان حفظ الأخطاء
  if (typeof ScriptApp !== 'undefined') {
     ScriptApp.getProjectTriggers().forEach(trigger => {
        if (trigger.getEventType() === ScriptApp.EventType.ON_OPEN || trigger.getHandlerFunction() === 'onOpen') {
            // This is a conceptual link. In a real scenario, you'd call flushBufferToFile()
            // at the end of major execution paths, like in a `finally` block of a main function.
            // For now, we rely on the `finally` block in `Utils.executeSafely`.
        }
     });
  }

  return { record, flushBufferToFile };
});