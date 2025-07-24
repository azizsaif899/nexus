// *************************************************************************************************
// --- START OF FILE: 30_tools/6_tools_project_service.js ---
// *************************************************************************************************

/**
 * @file 30_tools/6_tools_project_service.js
 * @module System.Tools.ProjectService
 * @version 1.0
 * @author عبدالعزيز
 * @description
 * خدمة مركزية لتوفير معلومات حول مشروع Google Apps Script الحالي.
 * توحد منطق الوصول إلى ملفات المشروع ومحتواها لتجنب التكرار.
 * تتطلب تفعيل Apps Script API في Google Cloud Project.
 */

'use strict';

defineModule('System.Tools.ProjectService', ({ Utils, DocsManager, ContentParser }) => {

  DocsManager.registerModuleDocs('System.Tools.ProjectService', [
    { name: 'getProjectFiles', description: 'يجلب قائمة بجميع ملفات الكود في المشروع.' },
    { name: 'getProjectSourceCode', description: 'يجلب الكود المصدري الكامل للمشروع كنص واحد.' },
    { name: 'getSingleFileContent', description: 'يجلب محتوى ملف واحد محدد بالاسم.' }
  ]);

  /**
   * يجلب قائمة بجميع ملفات المشروع من Apps Script API.
   * @returns {GoogleAppsScript.Script.File[]|null} مصفوفة بكائنات الملفات، أو null في حال الفشل.
   */
  function getProjectFiles() {
    try {
      if (typeof AppsScript === 'undefined' || !AppsScript.Projects || !AppsScript.Projects.getContent) {
        Utils.error("ProjectService: Apps Script API (AppsScript.Projects) is not enabled or available.");
        return null;
      }
      const content = AppsScript.Projects.getContent(ScriptApp.getScriptId());
      return content.files.filter(f => f.type === 'SERVER_JS');
    } catch (e) {
      Utils.error("ProjectService: Failed to fetch project files via Apps Script API.", e);
      return null;
    }
  }

  /**
   * يجلب الكود المصدري الكامل للمشروع عن طريق دمج محتوى جميع ملفات الكود.
   * @returns {string|null} الكود المصدري المدمج للمشروع، أو null في حال الفشل.
   */
  function getProjectSourceCode() {
    const files = getProjectFiles();
    if (!files) return null;
    return ContentParser.combineSourceFiles(files);
  }

  /**
   * يجلب محتوى ملف واحد محدد من المشروع.
   * @param {string} fileName اسم الملف المراد جلب محتواه.
   * @returns {string|null} محتوى الملف، أو null إذا لم يتم العثور على الملف أو حدث خطأ.
   */
  function getSingleFileContent(fileName) {
    const files = getProjectFiles();
    if (!files) return null;
    const file = files.find(f => f.name === fileName);
    return file ? file.source : null;
  }

  return { getProjectFiles, getProjectSourceCode, getSingleFileContent };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/6_tools_project_service.js ---
// *************************************************************************************************