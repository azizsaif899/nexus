/**
 * @module G-Assistant Sidebar
 * @version 1.0.0
 * @description نقطة الدخول الرئيسية للشريط الجانبي
 * @author AzizSys Team
 * @since 2025-01-27
 */

// نقطة الدخول الرئيسية للـ Sidebar
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 G-Assistant')
    .addItem('فتح المساعد', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('G-Assistant')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

// تصدير الدوال للاستخدام العام
declare global {
  function onOpen(): void;
  function openSidebar(): void;
}

/**
 * @lastModified 2025-01-27
 * @nextReview 2025-03-27
 * @see docs/sidebar-architecture.md
 */