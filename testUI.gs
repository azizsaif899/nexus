/**
 * @file testUI.gs
 * @description اختبار واجهة المستخدم
 */

function testUI() {
  try {
    const htmlOutput = HtmlService.createHtmlOutputFromFile('ui/AssistantSidebar');
    console.log("UI loaded successfully");
    return htmlOutput;
  } catch (e) {
    console.error("UI loading failed:", e.message);
    return HtmlService.createHtmlOutput("❌ فشل تحميل الواجهة")
                     .setTitle("خطأ");
  }
}