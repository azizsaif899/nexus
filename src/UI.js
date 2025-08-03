/**
 * @module System.UI
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.UI', ({ UI, Utils }) => {
  // === المحتوى الأصلي ===
  /**
   * @file 10_ui/1_ui.gs.js
   * @module System.UI
   * @version 1.1.0
   * @author عبدالعزيز
   * @description
   * The main UI module responsible for creating menus and managing the overall user interface.
   */



  /**
       * Creates the main 'G-Assistant' menu in the Google Sheets UI.
       * This function is called from the global onOpen trigger.
       */
  function onOpen() {
    Utils.executeSafely(() => {
      SpreadsheetApp.getUi()
        .createMenu('G-Assistant')
        .addItem('Developer Tools', 'showDeveloperSidebar') // Calls the new global function
        .addToUi();
      Utils.log('System.UI: G-Assistant menu created successfully.');
    }, 'UI.onOpen');
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});
