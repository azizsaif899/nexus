/**
 * @module System.ToolsCodeReview
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.ToolsCodeReview', ({ ToolsCodeReview }) => {
  // === المحتوى الأصلي ===
  
  /**
   * @file 30_tools/tools_codeReview.gs
   * @module System.ToolsCodeReview
   * @version 20
   * @author عبدالعزيز
   * @description
   * أدوات متقدمة لمراجعة كود Google Apps Script باستخدام Gemini.
   * المراحل المعمارية:
   *   • 1: تحويل الوحدة إلى defineModule وربط التبعيات
   *   • 10: حفظ نتائج المراجعة في LongTermMemory
   *   • 17: تسجيل مقاييس جودة الكود في ورقة Code_Review_Metrics
   */
  
  
  
  const Dialogue = UI.Dialogue;
  
    /**
     * يراجع الكود البرمجي باستخدام Gemini.
     * @param {{ code: string, reviewType: string } args
     * @returns {object}
     */
    function reviewCode({ code, reviewType }) {
      return Utils.executeSafely(() => {
        const prompt = `
  أنت خبير في مراجعة كود Google Apps Script. قم بمراجعة الكود التالي.
  نوع المراجعة المطلوبة: "${reviewType}".
  
  قدم تقييمًا عامًا (overallScore من 0 إلى 100)، وملخصًا للمراجعة، وقائمة مفصلة بالملاحظات (feedbackItems).
  لكل ملاحظة، حدد: category, title, description, و codeSnippet (اختياري).
  إذا كانت هناك تحسينات واضحة، قم بتوليد اقتراح تعديل (patch) بصيغة Unified Diff.
  
  الرد يجب أن يكون بصيغة JSON حصرًا.
  
  الكود للمراجعة:
  \`\`\`javascript
  ${code}
  \`\`\`
  `;
  
        const aiOptions = {
          modelOverride: Config.get('CODE_REVIEW_MODEL'),
          structuredOutputRequested: true
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});