/**
 * =============================================================================
 * @file analytics_dashboard.gs
 * @module GAssistant.Analytics
 * @description
 * وحدة لوحة التحكم التحليلية. مسؤولة عن جمع وعرض الإحصاءات والبيانات
 * من مختلف وحدات المشروع لتوفير رؤى مرئية للمستخدم.
 * =============================================================================
 */
var GAssistant = GAssistant || {};
GAssistant.Analytics = GAssistant.Analytics || {};

GAssistant.Analytics = (() => {
  'use strict';
  // --- حقن التبعيات ---
  const { log, error, getSheet, executeSafely } = GAssistant.Utils;
  const Dialogue = GAssistant.UI.Dialogue;
  const Config = GAssistant.Config;
  const AccountingTools = GAssistant.Tools.Accounting;

  /**
   * تعرض الشريط الجانبي للوحة التحكم التحليلية مع بيانات محدثة.
   */
  function showDashboard() {
    executeSafely(() => {
      const summaryData = _generateSummaryData();
      const html = _buildDashboardHtml(summaryData);
      const ui = HtmlService.createHtmlOutput(html)
        .setTitle('📊 لوحة التحكم التحليلية')
        .setWidth(450);
      SpreadsheetApp.getUi().showSidebar(ui);
      log('Analytics.showDashboard: Dashboard sidebar displayed.');
    });
  }

  /**
   * دالة داخلية لتجميع بيانات الملخص من مختلف الوحدات.
   * @private
   */
  function _generateSummaryData() {
    const metrics = [];
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

    // 1. مقاييس من وحدة المحاسبة
    const profitResponse = AccountingTools.calculateGrossProfit({ startDate: today, endDate: today });
    if (profitResponse.type === 'table') {
      profitResponse.data.rows.forEach(row => {
        metrics.push({ metric: `${row[0]} (اليوم)`, value: row[1] });
      });
    } else {
        metrics.push({ metric: 'أرباح اليوم', value: 'فشل الحساب' });
    }

    // 2. مقاييس من سجل العمليات
    const logSheet = getSheet(Config.get('OPERATION_LOG_SHEET'));
    if (logSheet) {
      metrics.push({ metric: 'إجمالي العمليات المسجلة', value: Math.max(0, logSheet.getLastRow() - 1) });
    }

    // 3. مقاييس من كتالوج الأدوات
    const toolDeclarations = GAssistant.Tools.Catalog.getDeclarations();
    metrics.push({ metric: 'عدد الأدوات المتاحة للـ AI', value: toolDeclarations.length });
    
    // يمكنك إضافة المزيد من المقاييس هنا بسهولة

    log('Analytics._generateSummaryData: Metrics collected', { count: metrics.length });
    return metrics;
  }

  /**
   * دالة داخلية لبناء HTML للوحة التحكم.
   * @private
   */
  function _buildDashboardHtml(data) {
    let tableRows = data.map(item => `
      <tr>
        <td class="key">${item.metric}</td>
        <td class="value">${item.value}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <base target="_top">
        <style>
          :root {
            --bg-primary: #f9fafb; --bg-secondary: #f3f4f6;
            --text-primary: #1f2937; --text-secondary: #4b5563;
            --border-color: #e5e7eb; --accent-color: #3b82f6;
          }
          body { font-family: system-ui, sans-serif; background-color: var(--bg-primary); color: var(--text-primary); margin: 0; padding: 1.5rem; }
          h2 { color: var(--accent-color); text-align: center; margin-top: 0; }
          .dashboard-card { background-color: white; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--border-color); }
          tr:last-child td { border-bottom: none; }
          td.key { font-weight: 500; color: var(--text-secondary); }
          td.value { font-weight: 600; text-align: left; color: var(--text-primary); }
        </style>
      </head>
      <body>
        <div class="dashboard-card">
          <h2>📊 لوحة التحكم</h2>
          <table>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  }

  return {
    showDashboard
  };
})();