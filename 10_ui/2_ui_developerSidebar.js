// *************************************************************************************************
// --- START OF FILE: 10_ui/2_ui_developerSidebar.gs ---
// *************************************************************************************************

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

defineModule('System.UI.DeveloperSidebar', ({ Utils, Config, DocsManager, Telemetry, Dialogue }) => {
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
      });

      // إرسال Telemetry
      Telemetry.track('UI.DeveloperSidebar.Open', {
        version: MODULE_VERSION,
        timestamp: new Date().toISOString()
      });

      // تسجيل المقياس في ورقة UI_Metrics
      const sheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action']);
      if (sheet) {
        sheet.appendRow([new Date(), 'DeveloperSidebar', MODULE_VERSION, 'open']);
      }
      status = 'success';
      return Dialogue.createInfo('تم فتح شريط أدوات المطور.');
    } catch (e) {
      status = 'exception';
      Utils.error(`System.UI.DeveloperSidebar.showDeveloperSidebar failed: ${e.message}`, e.stack);
      return Dialogue.createError(`فشل فتح شريط أدوات المطور: ${e.message}`);
    } finally {
      // يمكن إضافة تسجيل _recordInvocation هنا إذا أردت مقاييس مفصلة لفتح الشريط
    }
  }

  return {
    showDeveloperSidebar
  };
});

// *************************************************************************************************
// --- END OF FILE: 10_ui/2_ui_developerSidebar.gs ---
// *************************************************************************************************
