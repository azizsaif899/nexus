// *************************************************************************************************
// --- START OF FILE: 30_tools/tools_imageProcessor.gs ---
// *************************************************************************************************

/**
 * @file 30_tools/tools_imageProcessor.gs
 * @module System.ToolsImageProcessor
 * @version 20
 * @author عبدالعزيز
 * @description
 * وحدة لمعالجة الصور باستخدام الذكاء الاصطناعي لاستخراج البيانات وأرشفتها.
 * توفر:
 *   • analyzeInvoice: قراءة وتحليل صور الفواتير تفاعليًا (مرحلة 4)  
 *   • archiveInvoice: أرشفة بيانات الفواتير في الأدوات المحاسبية (مرحلة 4)  
 * المراحل المعمارية المطبقة:
 *   1. تحويل الوحدة إلى defineModule وربط التبعيات  
 *   4. أدوات ذكية تفاعلية مدعومة بالذكاء الاصطناعي  
 *   9. تسجيل الوثائق في DocsManager  
 *  10. حفظ الأحداث في الذاكرة طويلة الأمد  
 *  17. تسجيل مقاييس تشغيل الأداة في أوراق Google Sheets  
 */

defineModule('System.ToolsImageProcessor', ({ Utils, AI, Config, Tools, DocsManager }) => {
  // تسجيل الوثائق (مرحلة 9)
  DocsManager.registerModuleDocs('System.ToolsImageProcessor', [
    {
      name: 'analyzeInvoice',
      description: 'يحلل صورة فاتورة ويستخرج vendorName, invoiceDate, totalAmount, lineItems.'
    },
    {
      name: 'archiveInvoice',
      description: 'يؤرشف بيانات فاتورة مستخرجة في ورقة المصروفات عبر أداة المحاسبة.'
    }
  ]);

  /**
   * يحلل صورة فاتورة ويستخرج منها البيانات المهيكلة.
   * @param {{ imageBase64: string, mimeType: string }} args
   * @returns {UiResponse}
   */
  function analyzeInvoice({ imageBase64, mimeType }) {
    return Utils.executeSafely(() => {
      if (!imageBase64 || !mimeType) {
        throw new Error('بيانات الصورة أو نوع MIME مفقود.');
      }

      const prompt = `
حلل صورة الفاتورة المرفقة واستخرج البيانات التالية بصيغة JSON:
vendorName, invoiceDate (YYYY-MM-DD), totalAmount, lineItems (مصفوفة من {description, amount}).
لا تضف أي نص خارج كائن JSON.
`;

      const result = AI.Core.ask(prompt, {
        modelOverride: Config.get('GEMINI_PRO_MODEL'),
        structuredOutputRequested: true,
        extraParts: [{ inlineData: { mimeType, data: imageBase64 } }]
      });

      // المرحلة 10: حفظ الحدث في الذاكرة طويلة الأمد
      if (result.type === 'info') {
        AI.LongTermMemory.save('InvoiceAnalysis', {
          source: 'ToolsImageProcessor',
          timestamp: new Date().toISOString()
        });
        // المرحلة 17: تسجيل المقياس في ورقة Metrics
        const metrics = Utils.getSheet('ImageProcessor_Metrics', [
          'Timestamp','Action'
        ]);
        metrics.appendRow([ new Date(), 'analyzeInvoice' ]);
      }

      return result;
    }, [], 'ToolsImageProcessor.analyzeInvoice');
  }

  /**
   * يؤرشف بيانات فاتورة مستخرجة في ورقة المصروفات.
   * @param {{ vendorName: string, invoiceDate: string, totalAmount: number }} args
   * @returns {UiResponse}
   */
  function archiveInvoice({ vendorName, invoiceDate, totalAmount }) {
    return Utils.executeSafely(() => {
      const entry = {
        description: `فاتورة من ${vendorName || 'مورد غير معروف'}`,
        amount:      totalAmount || 0,
        category:    'فواتير'
      };

      // استدعاء أداة المحاسبة لتسجيل المصروف
      const response = Tools.Accounting.logEntry({ type: 'expense', data: entry });

      // المرحلة 10: حفظ الحدث في الذاكرة طويلة الأمد
      AI.LongTermMemory.save('InvoiceArchived', {
        source:      'ToolsImageProcessor',
        invoiceDate,
        totalAmount
      });

      // المرحلة 17: تسجيل المقياس في ورقة Metrics
      const metrics = Utils.getSheet('ImageProcessor_Metrics', [
        'Timestamp','Action'
      ]);
      metrics.appendRow([ new Date(), 'archiveInvoice' ]);

      return response;
    }, [], 'ToolsImageProcessor.archiveInvoice');
  }

  return {
    analyzeInvoice,
    archiveInvoice
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_imageProcessor.gs ---
// *************************************************************************************************
