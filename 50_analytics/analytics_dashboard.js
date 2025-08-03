/**
 * =============================================================================
 * @file analytics_dashboard.gs
 * @module System.Analytics.Dashboard
 * @description
 * وحدة لوحة التحكم التحليلية. مسؤولة عن جمع وعرض الإحصاءات والبيانات
 * من مختلف وحدات المشروع لتوفير رؤى مرئية للمستخدم.
 * @version 2.0.0 - Refactored to use defineModule
 * =============================================================================
 */
defineModule('System.Analytics.Dashboard', ({ Utils, Config, Tools }) => {
  // --- حقن التبعيات ---
  const { log, getSheet, executeSafely } = Utils;
  const { Accounting: AccountingTools, Catalog: ToolsCatalog } = Tools;

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
   * دالة داخلية لتجميع بيانات الملخص من ملف لوحة المراقبة المركزي.
   * @private
   */
  function _generateSummaryData() {
    try {
      // Read the central dashboard data file directly from the project files pushed by clasp
      const dashboardJsonContent = DriveApp.getFilesByName('dashboard_data.json').next().getBlob().getDataAsString();
      
      if (!dashboardJsonContent) {
        return [{ metric: 'حالة لوحة المراقبة', value: 'ملف البيانات (dashboard_data.json) غير موجود' }];
      }

      const dashboardData = JSON.parse(dashboardJsonContent);
      
      const metrics = [];

      // Add summary from the new strategic plan
      if (dashboardData.summary && dashboardData.summary.priority_alerts && dashboardData.summary.priority_alerts.length > 0) {
        metrics.push({ metric: '🚨 تنبيه', value: dashboardData.summary.priority_alerts[0] });
      }

      if (dashboardData.monthly_progress) {
        metrics.push({ metric: '🎯 التركيز الحالي', value: dashboardData.monthly_progress.current_focus || 'غير محدد' });
        metrics.push({ metric: '📈 نسبة الإنجاز', value: `${dashboardData.monthly_progress.completion_rate || 0}%` });
      }

      if (dashboardData.active_tasks && dashboardData.active_tasks.length > 0) {
        const task = dashboardData.active_tasks[0];
        metrics.push({ metric: '🚧 قيد التنفيذ', value: `${task.title} (${task.progress}%)` });
      } else {
        metrics.push({ metric: '🚧 المهام النشطة', value: 'لا يوجد' });
      }

      log('Analytics._generateSummaryData: Metrics collected from dashboard_data.json');
      return metrics;

    } catch (error) {
      log('Analytics._generateSummaryData: Error processing dashboard_data.json', { error: error.message, stack: error.stack });
      return [{ metric: 'خطأ في لوحة المراقبة', value: 'لا يمكن قراءة أو تحليل ملف البيانات. راجع السجلات.' }];
    }
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
});