// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/agent_developer.gs ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/agent_developer.gs
 * @module System.AgentDeveloper
 * @version 21 // تم تحديث الإصدار ليعكس الدمج الجديد والتنفيذ الفعلي للوظائف
 * @author عبدالعزيز
 * @description
 * وكيل ذكاء اصطناعي متخصص في مهام المطورين. يمتلك مجموعة من القدرات
 * لمراجعة الكود، اقتراح التحسينات، وتحليل جودة المشروع بشكل دوري وتفاعلي.
 * يدعم الآن واجهة موحدة handleRequest للتوجيه من AgentDispatcher.
 * مرتبطة بـ: AI.Core, Config, Utils, AppsScript API
 */

'use strict';

defineModule('System.AgentDeveloper', ({ Utils, Config, AI }) => {

  /**
   * الواجهة الموحدة لاستقبال الطلبات من AgentDispatcher.
   * تقوم بتوجيه الطلبات بناءً على النية المكتشفة.
   * @param {{ sessionId: string, message: string, intent: object }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function handleRequest({ sessionId, message, intent }) {
    Utils.log(`AgentDeveloper.handleRequest received: Intent Type = ${intent.type}, Message = "${message}"`);

    switch (intent.type) {
      case 'tool_call':
        // تنفيذ أدوات المطور المحددة بناءً على intent.toolName
        const toolName = intent.toolName;
        const toolArgs = intent.args || {};

        if (toolName === 'Developer.runWeeklyCodeReview') {
          const result = runWeeklyCodeReview();
          return { type: result.type || 'info', text: result.text || 'تم تشغيل مراجعة الكود الأسبوعية.' };
        } else if (toolName === 'Developer.suggestRefactoring') {
          // يجب أن يكون fileName متاحًا في toolArgs
          if (toolArgs.fileName) {
            const result = suggestRefactoring(toolArgs.fileName);
            return { type: result.type || 'info', text: result.text || `تم اقتراح إعادة هيكلة لـ ${toolArgs.fileName}.` };
          } else {
            return { type: 'error', text: 'DeveloperAgent: يتطلب suggestRefactoring اسم ملف.' };
          }
        } else if (toolName === 'Developer.logCodeQualityMetrics') {
          const result = logCodeQualityMetrics();
          return { type: result.type || 'info', text: result.text || 'تم تسجيل مقاييس جودة الكود.' };
        }
        // يمكن إضافة المزيد من أدوات المطور هنا
        return { type: 'warning', text: `DeveloperAgent: أداة مطور غير معروفة: ${toolName || 'غير محددة'}` };

      case 'general_query':
        // توجيه الاستعلام العام إلى AI.Core للحصول على إجابة
        Utils.log(`AgentDeveloper: General query received, forwarding to AI.Core: "${message}"`);
        if (AI && AI.Core && typeof AI.Core.ask === 'function') {
          const aiResponse = AI.Core.ask(`كمطور خبير في Google Apps Script، كيف يمكنني المساعدة بخصوص: ${message}`);
          return { type: aiResponse.type, text: aiResponse.text, data: aiResponse.data };
        } else {
          Utils.error('AgentDeveloper: AI.Core.ask is not defined or callable.');
          return { type: 'error', text: 'فشل في معالجة الاستعلام: خدمة الذكاء الاصطناعي غير متوفرة.' };
        }

      case 'clarification_needed':
        return { type: 'warning', text: 'DeveloperAgent: هل يمكنك توضيح طلبك أكثر من فضلك؟' };

      default:
        return { type: 'info', text: `DeveloperAgent استقبل رسالة: "${message}" بنوع نية غير متوقع: "${intent.type}"` };
    }
  }

  /**
   * يقوم بمراجعة أسبوعية للكود ويقدم تقارير حول جودته.
   * يستدعي AI.Core لتحليل الكود ويسجل النتائج في Google Sheet.
   * @returns {{ type: string, text: string }} نتيجة العملية.
   */
  function runWeeklyCodeReview() {
    return Utils.executeSafely(() => {
      Utils.log('AgentDeveloper: Starting weekly code review.');
      const projectCode = _getProjectSourceCode();
      if (!projectCode) {
        Utils.warn('AgentDeveloper.runWeeklyCodeReview: No project source code found to review.');
        return { type: 'warning', text: 'لا يوجد كود مشروع للمراجعة.' };
      }

      const prompt = `أنت مهندس برمجيات خبير في Google Apps Script. راجع كود G-Assistant التالي وقدم 3 اقتراحات رئيسية لتحسين الأداء، الموثوقية، أو قابلية الصيانة. أجب باللغة العربية.\n\nالكود:\n\`\`\`javascript\n${projectCode}\n\`\`\``;
      
      // التأكد من أن AI.Core متاح وقابل للاستدعاء
      if (!AI || !AI.Core || typeof AI.Core.ask !== 'function') {
        Utils.error('AgentDeveloper.runWeeklyCodeReview: AI.Core.ask is not defined or callable.');
        return { type: 'error', text: 'فشل في مراجعة الكود: خدمة الذكاء الاصطناعي غير متوفرة.' };
      }

      const reviewResult = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest' });

      const logSheetName = Config.get('DEVELOPMENT_LOG_SHEET') || 'Development_Log';
      const logSheet = Utils.getSheet(logSheetName, ["تاريخ المراجعة", "اقتراحات التحسين"]);

      if (logSheet && (reviewResult.type === 'info' || reviewResult.type === 'text_response') && reviewResult.text) {
        logSheet.appendRow([new Date(), reviewResult.text]);
        Utils.log('AgentDeveloper: Weekly code review suggestions logged.', { sheet: logSheetName });
        return { type: 'success', text: 'تمت مراجعة الكود الأسبوعية وتسجيل الاقتراحات بنجاح.' };
      } else {
        Utils.error('AgentDeveloper: Failed to get valid review result or log sheet.', reviewResult);
        return { type: 'error', text: 'فشل في الحصول على نتائج المراجعة أو تسجيلها.' };
      }
    }, [], 'AgentDeveloper.runWeeklyCodeReview');
  }

  /**
   * يقترح تحسينات وإعادة هيكلة للكود في ملف معين.
   * يستدعي AI.Core لتحليل الكود وتقديم اقتراحات.
   * @param {string} fileName اسم الملف المراد إعادة هيكلته.
   * @returns {{ type: string, text: string, data?: any }} نتيجة العملية.
   */
  function suggestRefactoring(fileName) {
    return Utils.executeSafely(() => {
      const code = _getSingleFileContent(fileName);
      if (!code) {
        Utils.warn(`AgentDeveloper.suggestRefactoring: Could not read file: ${fileName}`);
        return { type: 'warning', text: `تعذر قراءة محتوى الملف: ${fileName}.` };
      }

      const prompt = `أنت مهندس برمجيات خبير. راجع كود الوحدة التالية (${fileName}) واقترح تحسينات محددة لتحسين النظافة والكفاءة والأداء. أجب باللغة العربية.\n\nالكود:\n\`\`\`javascript\n${code}\n\`\`\``;
      
      // التأكد من أن AI.Core متاح وقابل للاستدعاء
      if (!AI || !AI.Core || typeof AI.Core.ask !== 'function') {
        Utils.error('AgentDeveloper.suggestRefactoring: AI.Core.ask is not defined or callable.');
        return { type: 'error', text: 'فشل في اقتراح إعادة الهيكلة: خدمة الذكاء الاصطناعي غير متوفرة.' };
      }

      const refactorResult = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest' });

      if ((refactorResult.type === 'info' || refactorResult.type === 'text_response') && refactorResult.text) {
        Utils.log(`AgentDeveloper: Refactoring suggestions for ${fileName} generated.`, { result: refactorResult.text.substring(0, 100) });
        return { type: 'success', text: `تم اقتراح تحسينات لـ ${fileName}:\n${refactorResult.text}` };
      } else {
        Utils.error('AgentDeveloper: Failed to get valid refactoring suggestions.', refactorResult);
        return { type: 'error', text: `فشل في الحصول على اقتراحات إعادة الهيكلة لـ ${fileName}.` };
      }
    }, [], 'AgentDeveloper.suggestRefactoring');
  }

  /**
   * يسجل مقاييس جودة الكود للمشروع (مثل التعقيد السايكلوماتي وعدد الأسطر).
   * @returns {{ type: string, text: string }} نتيجة العملية.
   */
  function logCodeQualityMetrics() {
    return Utils.executeSafely(() => {
      const files = _getProjectFiles();
      if (!files || files.length === 0) {
        Utils.warn('AgentDeveloper.logCodeQualityMetrics: No project files found to analyze.');
        return { type: 'warning', text: 'لا توجد ملفات مشروع لتحليل مقاييس الجودة.' };
      }

      const metrics = files.map(file => {
        const complexity = _estimateCyclomaticComplexity(file.source);
        return { file: file.name, complexity: complexity, lines: file.source.split('\n').length };
      });

      const logSheetName = Config.get('CODE_QUALITY_METRICS_SHEET') || "Code_Quality_Metrics"; // يمكن تعريف اسم الشيت في Config
      const logSheet = Utils.getSheet(logSheetName, ["التاريخ", "الملف", "درجة التعقيد", "عدد الأسطر"]);

      if (logSheet) {
        metrics.forEach(m => logSheet.appendRow([new Date(), m.file, m.complexity, m.lines]));
        Utils.log("AgentDeveloper: Code quality metrics logged.", { count: metrics.length, sheet: logSheetName });
        return { type: 'success', text: `تم تسجيل مقاييس جودة الكود لـ ${metrics.length} ملفات بنجاح.` };
      } else {
        Utils.error(`AgentDeveloper: Failed to get sheet '${logSheetName}' for logging metrics.`);
        return { type: 'error', text: `فشل في تسجيل مقاييس جودة الكود: تعذر الوصول إلى الشيت.` };
      }
    }, [], 'AgentDeveloper.logCodeQualityMetrics');
  }

  /**
   * يقدر التعقيد السايكلوماتي لكود معين.
   * @param {string} code الكود المراد تقدير تعقيده.
   * @returns {number} التعقيد السايكلوماتي المقدر.
   * @private
   */
  function _estimateCyclomaticComplexity(code) {
    // تعقيد سايكلوماتي: عدد نقاط القرار + 1
    // الكلمات المفتاحية التي تزيد التعقيد: if, for, while, case, catch, &&, ||, ?
    const keywords = (code.match(/\b(if|for|while|case|catch|&&|\|\||\?)\b/g) || []).length;
    return 1 + keywords;
  }

  /**
   * يجلب قائمة بجميع ملفات المشروع من Apps Script API.
   * يتطلب تفعيل Apps Script API في Google Cloud Project.
   * @returns {GoogleAppsScript.Script.File[]|null} مصفوفة بكائنات الملفات، أو null في حال الفشل.
   * @private
   */
  function _getProjectFiles() {
    try {
      // التحقق من أن خدمة AppsScript متاحة.
      // ملاحظة: تتطلب هذه الوظيفة تفعيل Google Apps Script API في Google Cloud Project
      // المرتبط بمشروع Apps Script هذا.
      if (typeof AppsScript === 'undefined' || !AppsScript.Projects || !AppsScript.Projects.getContent) {
        Utils.error("AgentDeveloper: Apps Script API service (AppsScript.Projects) is not enabled or available.");
        return null;
      }
      const content = AppsScript.Projects.getContent(ScriptApp.getScriptId());
      // تصفية الملفات للحصول على ملفات الكود فقط (SERVER_JS)
      return content.files.filter(f => f.type === 'SERVER_JS');
    } catch (e) {
      Utils.error("AgentDeveloper: Failed to fetch project files via Apps Script API.", e);
      return null;
    }
  }

  /**
   * يجلب الكود المصدري الكامل للمشروع عن طريق دمج محتوى جميع ملفات الكود.
   * @returns {string|null} الكود المصدري المدمج للمشروع، أو null في حال الفشل.
   * @private
   */
  function _getProjectSourceCode() {
    const files = _getProjectFiles();
    if (!files) {
      Utils.warn('AgentDeveloper._getProjectSourceCode: No files retrieved to build source code.');
      return null;
    }
    // دمج محتوى الملفات مع إضافة تعليق يحدد اسم كل ملف
    return files.map(f => `//--- FILE: ${f.name} ---\n${f.source}`).join('\n\n');
  }

  /**
   * يجلب محتوى ملف واحد محدد من المشروع.
   * @param {string} fileName اسم الملف المراد جلب محتواه.
   * @returns {string|null} محتوى الملف، أو null إذا لم يتم العثور على الملف أو حدث خطأ.
   * @private
   */
  function _getSingleFileContent(fileName) {
    const files = _getProjectFiles();
    if (!files) {
      Utils.warn('AgentDeveloper._getSingleFileContent: No files retrieved to find content for:', fileName);
      return null;
    }
    const file = files.find(f => f.name === fileName);
    return file ? file.source : null;
  }

  return {
    handleRequest,
    runWeeklyCodeReview,
    suggestRefactoring,
    logCodeQualityMetrics
  };
});

// *************************************************************************************************
// --- END OF FILE: 25_ai_agents/agent_developer.gs ---
// *************************************************************************************************
