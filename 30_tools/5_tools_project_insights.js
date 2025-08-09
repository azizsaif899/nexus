// *************************************************************************************************
// --- START OF FILE: 30_tools/tools_project_insights.gs ---
// *************************************************************************************************

/**
 * @file 30_tools/tools_project_insights.gs
 * @module System.ToolsProjectInsights
 * @version 20
 * @author عبدالعزيز
 * @description
 * أداة متخصصة لتحليل مشروع Google Apps Script بالكامل وتقديم رؤى واقتراحات.
 * تشمل:
 *   • analyzeProject: مهمة تفاعلية بالإجابة على استعلام المستخدم (مرحلة 4)
 *   • runScheduledInsights: مهمة مجدولة لفحص الصحة تلقائيًا (مرحلة 15)
 * المراحل المعمارية المطبقة:
 *   1. تحويل الوحدة إلى defineModule وربط التبعيات
 *   4. أدوات ذكية تفاعلية مدعومة بالذكاء الاصطناعي
 *   9. تسجيل الوثائق في DocsManager
 *  10. حفظ الأحداث في الذاكرة طويلة الأمد (LongTermMemory)
 *  15. تعريف المهمة المجدولة لاشتغال الأداة تلقائيًا
 *  17. تسجيل مقاييس تشغيل الأداة في جداول خاصة
 */

defineModule('System.ToolsProjectInsights', ({ Utils, UI, AI, Config, DocsManager, Tools, Security }) => {
  // تسجيل الوثائق (مرحلة 9)
  DocsManager.registerModuleDocs('System.ToolsProjectInsights', [
    {
      name: 'analyzeProject',
      description: 'يحلل جميع ملفات المشروع بناءً على استعلام المستخدم ويرد بنتائج منظمة.',
    },
    {
      name: 'generateProjectHealthReport',
      description: 'تشغيل دوري لإنتاج تقرير صحة شامل للمشروع على شكل مستند Google Docs.',
    }
  ]);

  /**
   * [مهمة تفاعلية] تحلل المشروع بالإجابة على استعلام المستخدم.
   * @param {{ userQuery: string }} args
   * @returns {UiResponse}
   */
  function analyzeProject({ userQuery }) {
    const context = `ToolsProjectInsights.analyzeProject[${userQuery.substring(0, 20)}...]`;
    console.time(context);
    try {
      return Utils.executeSafely(() => {
        const sanitizedQuery = Security.sanitize(userQuery);
        const projectCode = Tools.ProjectService.getProjectSourceCode();
        if (!projectCode) {
          return UI.Dialogue.createError('فشل في جلب كود المشروع. تأكد من تمكين Apps Script API.');
        }
  
        const prompt = `
أنت مهندس برمجيات خبير. بناءً على الكود الكامل للمشروع، أجب على الاستعلام التالي: "${sanitizedQuery}".
أعد الرد بصيغة JSON منظمة.

الكود الكامل:
\`\`\`javascript
${projectCode}
\`\`\`
        `;
  
        const result = AI.Core.ask(prompt, {
          modelOverride: Config.get('GEMINI_PRO_MODEL'),
          structuredOutputRequested: true
        });
  
        if (result.type === 'info') {
          let parsed;
          try {
            parsed = JSON.parse(result.text);
          } catch (e) {
            return UI.Dialogue.createError('فشل تحليل استجابة النموذج.');
          }
  
          AI.LongTermMemory.save('ProjectQuery', { source: 'ToolsProjectInsights', query: sanitizedQuery, timestamp: new Date().toISOString() });
          const metrics = Utils.getSheet('ProjectInsights_Metrics', ['Timestamp', 'Query', 'ResultKeys']);
          metrics.appendRow([new Date(), sanitizedQuery, Object.keys(parsed).join(',')]);
          return UI.Dialogue.createSuccess('تم تحليل المشروع بنجاح.', parsed);
        }
  
        return result;
      }, context);
    } finally {
      console.timeEnd(context);
    }
  }

  /**
   * [Helper] Runs the core AI analysis for scheduled insights.
   * @private
   * @returns {string|null} The AI-generated insights text, or null on failure.
   */
  function _getScheduledInsightsText() {
    return Utils.executeSafely(() => {
      Utils.log('ToolsProjectInsights: Getting scheduled insights text.');

      const projectCode = Tools.ProjectService.getProjectSourceCode();
      if (!projectCode) {
        Utils.warn('ToolsProjectInsights: No project code found for insights.');
        return null;
      }

      const prompt = `
أنت محلل جودة كود خبير. قم بإجراء فحص صحة شامل لكود مشروع G-Assistant.
قدم أهم 3 ملاحظات في:
1. الديون التقنية (Technical Debt)
2. فرص التحسين الكبرى (Major Refactoring Opportunities)
3. المخاطر الأمنية المحتملة (Potential Security Risks)

لا تقدم تعديلات على الكود، فقط رؤى استراتيجية عالية المستوى وموجزة.

الكود الكامل:
\`\`\`javascript
${projectCode}
\`\`\`
      `;

      const insightsResult = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_PRO_MODEL') });

      if (insightsResult.type === 'info' || insightsResult.type === 'text_response') {
        return insightsResult.text;
      } else {
        Utils.error('ToolsProjectInsights: Failed to obtain insights from AI.', insightsResult);
        return null;
      }
    }, 'ToolsProjectInsights._getScheduledInsightsText', null);
  }

  /**
   * [دوري] مهمة مجدولة لإنشاء تقرير صحة شامل للمشروع على شكل Google Doc.
   */
  function generateProjectHealthReport() {
    const context = 'ToolsProjectInsights.generateProjectHealthReport';
    console.time(context);
    try {
      return Utils.executeSafely(() => {
        Utils.log('ToolsProjectInsights: Starting scheduled health report generation.');
  
        const insightsText = _getScheduledInsightsText();
        if (!insightsText) {
          Utils.error('ToolsProjectInsights: Could not generate insights text. Aborting report generation.');
          return UI.Dialogue.createError('فشل في توليد محتوى التقرير.');
        }
  
        const reportDate = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
        const doc = DocumentApp.create(`تقرير صحة مشروع G-Assistant - ${reportDate}`);
        const body = doc.getBody();
        const docUrl = doc.getUrl();
  
        body.appendParagraph('تقرير صحة المشروع').setHeading(DocumentApp.ParagraphHeading.TITLE);
        body.appendParagraph(`تاريخ التقرير: ${reportDate}`).setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
        body.appendHorizontalRule();
        body.appendParagraph('ملخص الرؤى الاستراتيجية').setHeading(DocumentApp.ParagraphHeading.HEADING1);
        body.appendParagraph(insightsText);
  
        doc.saveAndClose();
        Utils.log('ToolsProjectInsights: Health report generated successfully.', { docUrl });
  
        AI.LongTermMemory.save('ScheduledInsightsReport', {
          source: 'ToolsProjectInsights',
          timestamp: new Date().toISOString(),
          insights: insightsText.substring(0, 500) + '...',
          reportUrl: docUrl
        });
  
        const logSheet = Utils.getSheet(Config.get('DEVELOPMENT_LOG_SHEET') || 'Development_Log', ['Date', 'Log Entry', 'Details']);
        logSheet.appendRow([new Date(), 'تم إنشاء تقرير صحة المشروع', docUrl]);
  
        return UI.Dialogue.createSuccess('تم إنشاء تقرير صحة المشروع بنجاح.', { url: docUrl });
  
      }, context);
    } finally {
      console.timeEnd(context);
    }
  }

  return {
    analyzeProject,
    generateProjectHealthReport
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_project_insights.gs ---
// *************************************************************************************************
