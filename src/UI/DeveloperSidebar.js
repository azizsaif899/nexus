/**
 * @module System.UI.DeveloperSidebar
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.UI.DeveloperSidebar', ({ UI, Utils }) => {
  // === المحتوى الأصلي ===
  
  /**
   * @file 10_ui/2_ui_developerSidebar.gs
   * @module System.UI.DeveloperSidebar
   * @version 1.1.1 // ✅ تحديث الإصدار للدلالة على التغييرات في معالجة الطلبات
   * @author عبدالعزيز
   * @description
   * وحدة عرض شريط أدوات المطورين Sidebar داخل Google Sheets،
   * وتعامل مع طلبات المستخدم من الواجهة إلى النظام.
   * المراحل المعمارية المطبقة:
   * • 1 defineModule وربط التبعيات
   * • 4 واجهة تفاعلية – إظهار Sidebar
   * • 6 معالجة طلبات المستخدم (Client→Server)
   * • 9 تسجيل الوثائق في DocsManager
   * • 10 حفظ استدعاءات Sidebar وطلبات المستخدم في LongTermMemory
   * • 11 إرسال Telemetry عند الفتح وعند الطلب
   * • 17 تسجيل مقاييس العرض والطلبات في أوراق Google Sheets
   * • 18 تضمين رقم الإصدار في البيانات الوصفية
   */
  
  
  
  const MODULE_VERSION = Config.get('DEVELOPER_SIDEBAR_VERSION') || '1.1.1';
    const UI_METRICS_SHEET = 'UI_Metrics'; // اسم ورقة المقاييس لواجهة المستخدم
  
    // مرحلة 9: تسجيل وثائق الوظائف
    DocsManager.registerModuleDocs('System.UI.DeveloperSidebar', [
      {
        name: 'showDeveloperSidebar',
        version: MODULE_VERSION,
        description: 'يفتح شريط أدوات المطور في واجهة Google Sheets.'
      }
    ]);
  
    /**
     * يفتح شريط أدوات المطورين في واجهة Google Sheets.
     * @returns {object} UiResponse
     */
    function showDeveloperSidebar() {
      const start = Date.now();
      let status = 'error';
      try {
        const html = HtmlService.createTemplateFromFile('DeveloperSidebar')
          .evaluate()
          .setTitle('🛠️ ورشة عمل المطورين');
  
        SpreadsheetApp.getUi().showSidebar(html);
  
        // حفظ الحدث في LongTermMemory
        AI.LongTermMemory.save('DeveloperSidebarOpened', {
          module: 'UI.DeveloperSidebar',
          version: MODULE_VERSION,
          timestamp: new Date().toISOString()
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});