/**
 * @module System.UI.DevSidebarHandler
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.UI.DevSidebarHandler', ({ UI, Utils }) => {
  // === المحتوى الأصلي ===
  /**
   * @file 10_ui/4_ui_dev_sidebar_handler.js
   * @module System.UI.DevSidebarHandler
   * @version 1.0.0
   * @author عبدالعزيز
   * @description
   * وحدة الواجهة الخلفية (Backend) للشريط الجانبي للمطورين.
   * تحتوي على الدوال التي يتم استدعاؤها من واجهة HTML عبر google.script.run.
   */
  
  
  
  /**
       * يجلب الاقتراحات المسجلة من ورقة عمل "ورشة المطورين".
       * @returns {UiResponse} كائن يحتوي على قائمة بالعناصر أو خطأ.
       */
      function getWorkshopItems() {
          return Utils.executeSafely(() => {
              const workshopSheetName = Config.get('DEVELOPER_WORKSHOP_SHEET') || 'Developer_Workshop';
              const sheet = Utils.getSheet(workshopSheetName, ["تاريخ", "الفئة", "الملف المقترح", "ملخص المراجعة", "الكود المقترح", "الحالة"]);
  
              if (!sheet || sheet.getLastRow() < 2) {
                  return UI.Dialogue.createSuccess('لا توجد عناصر حاليًا في ورشة العمل.', []);
              }
  
              const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
              const items = data.map(row => ({
                  date: new Date(row[0]).toLocaleDateString('ar-SA'),
                  category: row[1],
                  file: row[2],
                  summary: row[3],
                  code: row[4],
                  status: row[5
              }));
  
  return UI.Dialogue.createSuccess('تم جلب عناصر ورشة العمل بنجاح.', items.reverse()); // عرض الأحدث أولاً
  }, 'DevSidebarHandler.getWorkshopItems', UI.Dialogue.createError('فشل جلب بيانات ورشة العمل.'));
  
      /**
       * يحلل ورقة العمل النشطة لتحديد سياقها.
       * @returns {UiResponse} كائن يحتوي على نوع السياق (e.g., 'DATA_SHEET', 'WORKSHOP_SHEET', 'GENERAL').
       */
      function getContextualInfo() {
          return Utils.executeSafely(() => {
              const sheet = SpreadsheetApp.getActiveSheet();
              const sheetName = sheet.getName();
              const lastRow = sheet.getLastRow();
              const lastCol = sheet.getLastColumn();
  
              let contextType = 'GENERAL'; // Default context
  
              const workshopSheetName = Config.get('DEVELOPER_WORKSHOP_SHEET') || 'Developer_Workshop';
              if (sheetName === workshopSheetName) {
                  contextType = 'WORKSHOP_SHEET';
              } else if (lastRow > 10 && lastCol > 3) {
                  // Heuristic: if it has a decent amount of data, it's a data sheet.
                  contextType = 'DATA_SHEET';
              }
  
              Utils.log('DevSidebarHandler: Context detected.', { sheetName, contextType
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});