// *************************************************************************************************
// --- START OF FILE: 30_tools/tools_accounting.gs ---
// *************************************************************************************************

/**
 * @file 30_tools/tools_accounting.gs
 * @module System.ToolsAccounting
 * @version 20
 * @author عبدالعزيز
 * @description
 * أدوات المحاسبة والتحليل المالي لمساعد G-Assistant.
 * تشمل حساب الربح الإجمالي، إنشاء الملخص اليومي، وتسجيل الإدخالات المالية.
 * المراحل المعمارية:
 *   • 1: تحويل الوحدة إلى defineModule وربط التبعيات
 *   • 10: حفظ أحداث المحاسبة في LongTermMemory
 *   • 17: تسجيل مقاييس الأداء المالي في أوراق Google Sheets
 */

defineModule('System.ToolsAccounting', ({ Utils, UI, Config, AI, DocsManager }) => {
  // تسجيل وثائق الوحدة (المرحلة 9)
  DocsManager.registerModuleDocs('System.ToolsAccounting', [
    {
      name: 'calculateGrossProfit',
      description: 'يحسب الربح الإجمالي (الإيرادات - المصروفات) لفترة زمنية محددة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          startDate: { type: 'STRING', description: 'تاريخ البدء (YYYY-MM-DD)' },
          endDate:   { type: 'STRING', description: 'تاريخ الانتهاء (YYYY-MM-DD)' }
        },
        required: ['startDate','endDate']
      }
    },
    {
      name: 'generateDailySummary',
      description: 'ينشئ أو يحدث ملخصًا ماليًا لليوم المحدد أو اليوم الحالي.',
      parameters: {
        type: 'OBJECT',
        properties: {
          date: { type: 'STRING', description: 'التاريخ بصيغة YYYY-MM-DD. الافتراضي اليوم الحالي.' }
        },
        required: []
      }
    },
    {
      name: 'logEntry',
      description: 'يسجل إدخالاً مالياً (إيراد أو مصروف) ويرسله للذاكرة طويلة الأمد.',
      parameters: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING', enum: ['revenue','expense'], description: 'نوع الإدخال.' },
          data: { type: 'OBJECT', description: 'تفاصيل الإدخال.' }
        },
        required: ['type','data']
      }
    }
  ]);

  /**
   * يحسب الربح الإجمالي (الإيرادات - المصروفات) بين تاريخين.
   */
  function calculateGrossProfit({ startDate, endDate }) {
    return Utils.executeSafely(() => {
      const cfg = Config.getAll();
      const revenueSheet = Utils.getSheet(cfg.REVENUE_SHEET);
      const expensesSheet = Utils.getSheet(cfg.EXPENSES_SHEET);

      const totalRevenue  = _sumBetween(revenueSheet, 0, 5, startDate, endDate);
      const totalExpenses = _sumBetween(expensesSheet, 0, 2, startDate, endDate);
      const grossProfit   = totalRevenue - totalExpenses;
      const currency      = cfg.DEFAULT_CURRENCY;

      // حفظ الحدث في الذاكرة طويلة الأمد (المرحلة 10)
      AI.LongTermMemory.save('FinanceReport', {
        source: 'ToolsAccounting',
        action: 'calculateGrossProfit',
        period: `${startDate}–${endDate}`,
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: grossProfit
      });

      // تسجيل المقاييس في ورقة منفصلة (المرحلة 17)
      const metrics = Utils.getSheet('Accounting_Metrics', [
        'Timestamp','Action','Revenue','Expenses','GrossProfit'
      ]);
      metrics.appendRow([
        new Date(),
        'calculateGrossProfit',
        totalRevenue,
        totalExpenses,
        grossProfit
      ]);

      const headers = ['المقياس','القيمة'];
      const rows = [
        ['إجمالي الإيرادات',  `${totalRevenue.toFixed(2)} ${currency}`],
        ['إجمالي المصروفات',  `${totalExpenses.toFixed(2)} ${currency}`],
        ['صافي الربح الإجمالي',`${grossProfit.toFixed(2)} ${currency}`]
      ];
      return UI.Dialogue.createTable(
        `ملخص الربح من ${startDate} إلى ${endDate}`, 
        headers, 
        rows
      );
    }, [], `ToolsAccounting.calculateGrossProfit[${startDate}-${endDate}]`);
  }

  /**
   * يدعم الحساب على اليوم المحدد أو اليوم الحالي ويحدث ورقة الملخص اليومي.
   */
  function generateDailySummary({ date }) {
    const target = date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return Utils.executeSafely(() => {
      const tableResult = calculateGrossProfit({ startDate: target, endDate: target });
      if (tableResult.type !== 'table') {
        return UI.Dialogue.createError(`فشل إنشاء ملخص يوم ${target}.`);
      }

      // استخراج الأرقام من النتيجة
      const dataMap = Object.fromEntries(
        tableResult.data.rows.map(r => [r[0], parseFloat(r[1])||0])
      );
      const sheet = Utils.getSheet(
        Config.get('DAILY_SUMMARY_SHEET'),
        ['التاريخ','إيرادات','مصروفات','صافي الربح','العملة']
      );
      const newRow = [
        new Date(target),
        dataMap['إجمالي الإيرادات'],
        dataMap['إجمالي المصروفات'],
        dataMap['صافي الربح الإجمالي'],
        Config.get('DEFAULT_CURRENCY')
      ];

      // تحديث أو إضافة الصف
      const dates = sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues().flat();
      const idx = dates.findIndex(d => 
        Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'yyyy-MM-dd') === target
      );
      if (idx >= 0) {
        sheet.getRange(idx+2,1,1,newRow.length).setValues([newRow]);
      } else {
        sheet.appendRow(newRow);
      }

      // حفظ الحدث (المرحلة 10)
      AI.LongTermMemory.save('FinanceReport', {
        source: 'ToolsAccounting',
        action: 'generateDailySummary',
        date: target
      });

      // تسجيل المقاييس (المرحلة 17)
      const metrics = Utils.getSheet('DailySummary_Metrics', [
        'Timestamp','SummaryDate'
      ]);
      metrics.appendRow([ new Date(), target ]);

      return UI.Dialogue.createTable(`ملخص يوم ${target}`, tableResult.data.headers, tableResult.data.rows);
    }, [], `ToolsAccounting.generateDailySummary[${target}]`);
  }

  /**
   * يسجل إدخالاً مالياً جديداً: إيراد أو مصروف، ثم يخزن في الذاكرة.
   */
  function logEntry({ type, data }) {
    return Utils.executeSafely(() => {
      const cfg = Config.getAll();
      const now = new Date();
      let msg, entry;

      if (type === 'revenue') {
        const sheet = Utils.getSheet(cfg.REVENUE_SHEET, [
          'التاريخ','المنتج','الكمية','سعر الوحدة','الخصم','الإجمالي'
        ]);
        const total = (Number(data.quantity)||0) * (Number(data.unitPrice)||0);
        sheet.appendRow([now, data.product, data.quantity, data.unitPrice, 0, total]);
        entry = { type, ...data, total };
        msg = `✅ تم تسجيل إيراد "${data.product}" بقيمة ${total.toFixed(2)}.`;
      } else if (type === 'expense') {
        const sheet = Utils.getSheet(cfg.EXPENSES_SHEET, [
          'التاريخ','الوصف','المبلغ','الفئة'
        ]);
        sheet.appendRow([now, data.description, data.amount, data.category]);
        entry = { type, ...data };
        msg = `✅ تم تسجيل مصروف "${data.description}" بقيمة ${Number(data.amount).toFixed(2)}.`;
      } else {
        return UI.Dialogue.createError(`نوع الإدخال "${type}" غير معروف.`);
      }

      // حفظ الحدث (المرحلة 10)
      AI.LongTermMemory.save('FinancialEntry', {
        source: 'ToolsAccounting',
        entry
      });

      // تسجيل المقياس (المرحلة 17)
      const metrics = Utils.getSheet('Entry_Metrics', [
        'Timestamp','EntryType','Details'
      ]);
      metrics.appendRow([ now, type, JSON.stringify(entry) ]);

      return UI.Dialogue.createSuccess(msg);
    }, [], `ToolsAccounting.logEntry[${type}]`);
  }

  return {
    calculateGrossProfit,
    generateDailySummary,
    logEntry
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_accounting.gs ---
// *************************************************************************************************
