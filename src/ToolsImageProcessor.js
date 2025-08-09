/**
 * @module System.ToolsImageProcessor
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.ToolsImageProcessor', ({ ToolsImageProcessor }) => {
  // === المحتوى الأصلي ===
  
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
     * @param {{ imageBase64: string, mimeType: string } args
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
          extraParts: [{ inlineData: { mimeType, data: imageBase64 }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});