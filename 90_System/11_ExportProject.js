// *************************************************************************************************
// --- START OF FILE: 99_export_project.gs ---
// *************************************************************************************************

/**
 * @file 99_export_project.gs
 * @module System.ProjectExport
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة لتصدير الكود المصدري لمشروع Google Apps Script الحالي إلى Google Drive.
 * هذه الوحدة مفيدة لإنشاء نسخ احتياطية من المشروع.
 */

'use strict';

defineModule('System.ProjectExport', ({ Utils, DocsManager, UI, Config, Tools, ModuleVerifier, Telemetry }) => {
  const MODULE_VERSION = '1.0.0';

  // ✅ تفعيل فحص مسبق: التحقق من جاهزية الوحدات الأساسية قبل المتابعة
  // تم تعديل الشرط ليكون أكثر أمانًا في حال عدم تحميل ModuleVerifier نفسه
  if (typeof ModuleVerifier?.checkReady !== 'function' || !ModuleVerifier.checkReady('Config', ['get'])) {
    Telemetry?.logError("❌ وحدة 'Config' غير جاهزة. تم إيقاف تهيئة 'System.ProjectExport' لمنع الانهيار.");
    // إرجاع واجهة آمنة لمنع الانهيار الكامل للنظام
    return { exportCurrentProjectSource: () => UI?.Dialogue?.createError("فشل تصدير المشروع: وحدة الإعدادات الأساسية غير جاهزة.") };
  }

  // اسم المجلد الذي سيتم تصدير المشاريع إليه في Google Drive.
  const EXPORT_FOLDER_NAME = Config.get('PROJECT_EXPORT_FOLDER_NAME') || 'G-Assistant Project Exports';

  // تسجيل توثيق الوحدة في DocsManager.
  DocsManager.registerModuleDocs('System.ProjectExport', [
    {
      name: 'exportCurrentProjectSource',
      version: MODULE_VERSION,
      description: 'يصدر الكود المصدري لمشروع Google Apps Script الحالي إلى ملف نصي في Google Drive.',
      parameters: { type: 'OBJECT', properties: {}, required: [] },
      returns: { type: 'OBJECT', description: 'كائن UiResponse يشير إلى نجاح أو فشل العملية ورابط الملف المصدر.' }
    }
  ]);

  /**
   * يصدر الكود المصدري لمشروع Google Apps Script الحالي إلى ملف نصي في Google Drive.
   * يقوم بإنشاء مجلد محدد إذا لم يكن موجودًا، ثم يحفظ محتوى السكريبت الحالي فيه.
   *
   * @returns {object} UiResponse يشير إلى نجاح أو فشل العملية ورابط الملف المصدر.
   */
  function exportCurrentProjectSource() {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let exportFileUrl = '';

    try {
      // 1. الحصول على المجلد الوجهة في Google Drive.
      // يبحث عن مجلد بالاسم المحدد، وإذا لم يجده، ينشئ مجلدًا جديدًا.
      let exportFolder = DriveApp.getFoldersByName(EXPORT_FOLDER_NAME);
      if (exportFolder.hasNext()) {
        exportFolder = exportFolder.next();
      } else {
        exportFolder = DriveApp.createFolder(EXPORT_FOLDER_NAME);
        Utils.log(`ProjectExport: Created new export folder: ${EXPORT_FOLDER_NAME}`);
      }

      // 2. الحصول على معرف السكريبت الحالي.
      // هذا المعرف فريد لكل مشروع Apps Script.
      const scriptId = ScriptApp.getScriptId();
      if (!scriptId) {
        throw new Error('Could not get current script ID. Is the Apps Script API enabled?');
      }

      // 3. الحصول على الكود المصدري الكامل للمشروع باستخدام الخدمة الموحدة.
      const scriptContent = Tools.ProjectService.getProjectSourceCode();
      if (!scriptContent) throw new Error('Failed to get project source code via ProjectService.');

      // 4. إنشاء اسم فريد للملف المصدر.
      // يتضمن اسم المشروع الأصلي وتاريخ التصدير لتجنب التكرار.
      const fileName = `${scriptFile.getName()}_Export_${new Date().toISOString().replace(/:/g, '-')}.gs`;
      
      // 5. إنشاء الملف الجديد في المجلد المصدر.
      // يتم حفظ المحتوى الكودي كملف نصي عادي.
      const exportedFile = exportFolder.createFile(fileName, scriptContent, MimeType.PLAIN_TEXT);
      exportFileUrl = exportedFile.getUrl(); // الحصول على رابط الملف المصدر.

      status = 'success';
      Utils.log(`ProjectExport: Successfully exported project source to Drive. URL: ${exportFileUrl}`);
      // إرجاع استجابة نجاح لواجهة المستخدم.
      return UI.Dialogue.createInfo(`✅ تم تصدير الكود المصدري للمشروع بنجاح. الرابط: ${exportFileUrl}`);

    } catch (e) {
      errorMessage = e.message;
      Utils.error(`System.ProjectExport.exportCurrentProjectSource failed: ${errorMessage}`, e.stack);
      status = 'exception';
      // إرجاع استجابة خطأ لواجهة المستخدم.
      return UI.Dialogue.createError(`💥 فشل تصدير المشروع: ${errorMessage}. الرجاء التأكد من تفعيل Google Apps Script API و Google Drive API في مشروعك على Google Cloud.`);
    } finally {
      const duration = Date.now() - start;
      // هنا يمكن إضافة تسجيل مقاييس إضافية لعملية التصدير إذا لزم الأمر.
      // على سبيل المثال: Telemetry.track('ProjectExport', { status, duration, errorMessage });
    }
  }

  return {
    exportCurrentProjectSource
  };
});

// *************************************************************************************************
// --- END OF FILE: 99_export_project.gs ---
// *************************************************************************************************
