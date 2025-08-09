// تشغيل الواجهة المحسنة
function showEnhancedSidebar() {
  const html = GAssistant.UI.EnhancedSidebar.createEnhancedSidebar();
  const htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(400)
    .setTitle('AzizSys Enhanced');
  
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 AzizSys Enhanced')
    .addItem('📱 الواجهة المحسنة', 'showEnhancedSidebar')
    .addItem('🔧 اختبار الوضع الهجين', 'testHybridConnection')
    .addToUi();
}