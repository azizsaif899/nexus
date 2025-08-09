/**
 * @module G-Assistant Sheets Add-on
 * @version 1.0.0
 * @description نقاط الدخول الرئيسية لإضافة Google Sheets
 * @author AzizSys Team
 * @since 2025-01-27
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 G-Assistant')
    .addItem('فتح المساعد', 'openSidebar')
    .addItem('الإعدادات', 'openSettings')
    .addToUi();
}

function onInstall() {
  onOpen();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('client/sidebar')
    .setTitle('G-Assistant')
    .setWidth(400);
  
  SpreadsheetApp.getUi().showSidebar(html);
}

function openSettings() {
  // فتح نافذة الإعدادات
}

/**
 * @lastModified 2025-01-27
 * @nextReview 2025-03-27
 */