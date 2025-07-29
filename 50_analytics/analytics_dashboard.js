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
   * دالة داخلية لتجميع بيانات الملخص من مختلف الوحدات.
   * @private
   */
  function _generateSummaryData() {
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

    const metricProviders = [
      {
        label: 'أرباح اليوم',
        provider: () => {
          if (!AccountingTools?.calculateGrossProfit) return 'وحدة المحاسبة غير متاحة';
          const profitResponse = AccountingTools.calculateGrossProfit({ startDate: today, endDate: today });
          if (profitResponse?.type === 'table' && profitResponse.data?.rows?.length > 0) {
            // Assuming the first row/col is the value
            return profitResponse.data.rows[0][1];
          }
          return 'لا توجد بيانات';
        },
        fallback: 'خطأ في الحساب'
      },
      {
        label: 'إجمالي العمليات المسجلة',
        provider: () => {
          if (!Config?.get) return 'وحدة الإعدادات غير متاحة';
          // ✅ إصلاح: التحقق من وجود اسم الورقة أولاً
          const sheetName = Config.get('OPERATION_LOG_SHEET');
          if (!sheetName) {
            return 'اسم ورقة السجل غير مهيأ';
          }
          const logSheet = getSheet(sheetName);
          // التحقق من أن getSheet لم تُرجع null
          if (!logSheet) return `تعذر العثور على ورقة السجل: ${sheetName}`;
          return Math.max(0, logSheet.getLastRow() - 1); // getLastRow موجودة طالما الورقة موجودة
        },
        fallback: 'خطأ في الوصول'
      },
      {
        label: 'عدد الأدوات المتاحة للـ AI',
        provider: () => {
          if (!ToolsCatalog?.getDeclarations) return 'كتالوج الأدوات غير متاح';
          const toolDeclarations = ToolsCatalog.getDeclarations() || [];
          return toolDeclarations.length;
        },
        fallback: 'خطأ في الوصول'
      }
    ];

    const metrics = metricProviders.map(({ label, provider, fallback }) => {
      let value;
      try {
        value = provider();
      } catch (error) {
        log(`Analytics._generateSummaryData: Error in metric provider for "${label}"`, error);
        value = fallback;
      }
      return { metric: label, value };
    });
    
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
});