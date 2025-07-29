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

defineModule('System.ToolsProjectInsights', ({ Utils, UI, AI, Config, DocsManager }) => {
  // تسجيل الوثائق (مرحلة 9)
  DocsManager.registerModuleDocs('System.ToolsProjectInsights', [
    {
      name: 'analyzeProject',
      description: 'يحلل جميع ملفات المشروع بناءً على استعلام المستخدم ويرد بنتائج منظمة.'
    },
    {
      name: 'runScheduledInsights',
      description: 'تشغيل دوري لإنتاج رؤى استراتيجية عن صحة المشروع وتوثيقها.'
    }
  ]);

  /**
   * [مهمة تفاعلية] تحلل المشروع بالإجابة على استعلام المستخدم.
   * @param {{ userQuery: string }} args
   * @returns {UiResponse}
   */
  function analyzeProject({ userQuery }) {
    return Utils.executeSafely(() => {
      const projectCode = _getProjectSourceCode();
      if (!projectCode) {
        return UI.Dialogue.createError('فشل في جلب كود المشروع. تأكد من تمكين Apps Script API.');
      }

      const prompt = `
أنت مهندس برمجيات خبير. بناءً على الكود الكامل للمشروع، أجب على الاستعلام التالي: "${userQuery}".
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

        // المرحلة 10: حفظ الحدث في الذاكرة طويلة الأمد
        AI.LongTermMemory.save('ProjectQuery', {
          source:    'ToolsProjectInsights',
          query:     userQuery,
          timestamp: new Date().toISOString()
        });

        // المرحلة 17: تسجيل المقياس في ورقة Metrics
        const metrics = Utils.getSheet('ProjectInsights_Metrics', [
          'Timestamp', 'Query', 'ResultKeys'
        ]);
        metrics.appendRow([
          new Date(),
          userQuery,
          Object.keys(parsed).join(',')
        ]);

        return UI.Dialogue.createSuccess('تم تحليل المشروع بنجاح.', parsed);
      }

      return result;
    }, [], `ToolsProjectInsights.analyzeProject[${userQuery}]`);
  }

  /**
   * [دوري] مهمة مجدولة لإجراء فحص صحة شامل للمشروع.
   */
  function runScheduledInsights() {
    return Utils.executeSafely(() => {
      Utils.log('ToolsProjectInsights: Starting scheduled insights.');

      const projectCode = _getProjectSourceCode();
      if (!projectCode) return;

      const prompt = `
أنت محلل جودة كود خبير. قم بإجراء فحص صحة شامل لكود مشروع G-Assistant.
قدم أهم 3 ملاحظات في:
1. الديون التقنية
2. فرص التحسين الكبرى
3. المخاطر الأمنية المحتملة

لا تقدم تعديلات، فقط رؤى استراتيجية عالية المستوى.

الكود الكامل:
\`\`\`javascript
${projectCode}
\`\`\`
      `;

      const insightsResult = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_PRO_MODEL') });

      if (insightsResult.type === 'info') {
        // المرحلة 10: حفظ الحدث في الذاكرة طويلة الأمد
        AI.LongTermMemory.save('ScheduledInsights', {
          source:    'ToolsProjectInsights',
          timestamp: new Date().toISOString(),
          insights:  insightsResult.text
        });

        // المرحلة 17: تسجيل المقياس في ورقة Logs
        const logSheet = Utils.getSheet(Config.get('DEVELOPMENT_LOG_SHEET'), [
          'Date', 'ProjectInsights'
        ]);
        logSheet.appendRow([ new Date(), insightsResult.text ]);
        Utils.log('ToolsProjectInsights: Scheduled insights logged.');
      } else {
        Utils.error('ToolsProjectInsights: Failed to obtain insights.', insightsResult);
      }
    }, [], 'ToolsProjectInsights.runScheduledInsights');
  }

  /**
   * @private
   * يجلب كود المشروع بالكامل عبر Apps Script API.
   */
  function _getProjectSourceCode() {
    const { error } = GAssistant.Utils.Injector.get('Utils');
    try {
      if (typeof AppsScript === 'undefined') {
        throw new Error('Apps Script API غير مفعّل.');
      }
      const content = AppsScript.Projects.getContent(ScriptApp.getScriptId());
      return content.files
        .filter(f => f.type === 'SERVER_JS')
        .map(f => `//--- FILE: ${f.name} ---\n${f.source}`)
        .join('\n\n');
    } catch (e) {
      error('ToolsProjectInsights: Failed to fetch code via API.', e);
      return null;
    }
  }

  return {
    analyzeProject,
    runScheduledInsights
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_project_insights.gs ---
// *************************************************************************************************
