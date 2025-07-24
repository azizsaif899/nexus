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

defineModule('System.AgentDeveloper', ({ Utils, Config, AI, Context, Tools, ModuleVerifier, Security }) => {

  /**
   * الواجهة الموحدة لاستقبال الطلبات من AgentDispatcher.
   * تقوم بتوجيه الطلبات بناءً على النية المكتشفة.
   * @param {{ sessionId: string, message: string, intent: object }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function handleRequest({ sessionId, message, intent }) {
    // ✅ تطبيق البرمجة الدفاعية (المرحلة 8، الخطوة 4)
    if (!ModuleVerifier?.checkReady('AI', ['Core', 'Context'])) {
      return { type: 'error', text: 'AgentDeveloper: Core AI dependencies are not ready.' };
    }
    if (!ModuleVerifier?.checkReady('Tools', ['ProjectService'])) {
      return { type: 'error', text: 'AgentDeveloper: ProjectService tool is not ready.' };
    }

    Utils.log(`AgentDeveloper.handleRequest received: Intent Type = ${intent.type}, Message = "${message}"`);

    switch (intent.type) {
      case 'tool_call':
        // تنفيذ أدوات المطور المحددة بناءً على intent.toolName
        const toolName = intent.toolName;
        const toolArgs = intent.args || {};

        if (toolName === 'Developer.runWeeklyCodeReview') {
          const result = runWeeklyCodeReview();
          return { type: result.type || 'info', text: result.text || 'تم تشغيل مراجعة الكود الأسبوعية.' };
        } else if (toolName === 'Developer.generateCodeFromPrompt') {
          const result = generateCodeFromPrompt({ description: toolArgs.description });
          return result; // The function already returns a UiResponse
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
   * يولد كودًا أو صيغة بناءً على وصف المستخدم وسياق ورقة العمل.
   * @param {{ description: string }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function generateCodeFromPrompt({ description }) {
    return Utils.executeSafely(() => {
      const sanitizedDescription = Security.sanitize(description);
      Utils.log(`AgentDeveloper: Generating code for description: "${sanitizedDescription}"`);

      // 1. بناء السياق من الورقة النشطة
      const sheetContext = AI.Context.build({ sessionId: 'code-gen-session', includeSheetContext: true, includeTools: false, includeLongTermMemory: false });
      const contextText = sheetContext.systemInstruction;

      // 2. بناء Prompt هندسي دقيق
      const engineeredPrompt = `
أنت خبير برمجة Google Apps Script وصيغ Google Sheets. مهمتك هي تحويل وصف المستخدم إلى كود أو صيغة قابلة للتنفيذ.

**سياق ورقة العمل الحالية:**
${contextText}

**وصف المستخدم:**
"${sanitizedDescription}"

**المطلوب:**
1.  **حدد النية:** هل الطلب هو (أ) صيغة (Formula) لخلية واحدة، (ب) كود برمجي (Apps Script) لتنفيذ مهمة.
2.  **ولّد الناتج:**
    - إذا كانت **صيغة**، أرجع الصيغة فقط، بدون أي نص إضافي. مثال: \`=VLOOKUP(A2, 'Data'!A:B, 2, FALSE)\`.
    - إذا كان **كود برمجي**، أرجع الكود داخل كتلة \`\`\`javascript. تأكد أن الكود كامل وفعّال.
3.  **أضف شرحًا:** في فقرة منفصلة، اشرح بإيجاز ماذا يفعل الكود أو الصيغة.
`;

      // 3. استدعاء AI.Core
      const aiResponse = AI.Core.ask(engineeredPrompt, {
        modelOverride: Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest',
        generationConfig: { temperature: 0.2 } // درجة حرارة منخفضة للحصول على كود دقيق
      });

      if (aiResponse.type === 'info' || aiResponse.type === 'text_response') {
        const responseText = aiResponse.text;
        const codeBlock = Utils.extractCodeBlocks(responseText, 'javascript')[0] || '';
        const explanation = Utils.removeCodeBlocks(responseText, 'javascript').trim();

        const isFormula = codeBlock.startsWith('=');

        return {
          type: 'success',
          text: 'تم توليد الكود بنجاح.',
          data: {
            code: codeBlock,
            explanation: explanation,
            isFormula: isFormula
          }
        };
      } else {
        Utils.error('AgentDeveloper.generateCodeFromPrompt: Failed to get a valid response from AI.Core', aiResponse);
        return { type: 'error', text: `فشل توليد الكود: ${aiResponse.text}` };
      }

    }, [], 'AgentDeveloper.generateCodeFromPrompt');
  }

  /**
   * يقوم بمراجعة أسبوعية للكود ويقدم تقارير حول جودته.
   * يستدعي AI.Core لتحليل الكود ويسجل النتائج في Google Sheet.
   * @returns {{ type: string, text: string }} نتيجة العملية.
   */
  function runWeeklyCodeReview() {
    return Utils.executeSafely(() => {
      Utils.log('AgentDeveloper: Starting weekly code review.');
      const projectCode = Tools.ProjectService.getProjectSourceCode();
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

      // ✅ تحديث: تجهيز النتائج في ورشة العمل بدلاً من السجل العام
      const workshopSheetName = Config.get('DEVELOPER_WORKSHOP_SHEET') || 'Developer_Workshop';
      const workshopSheet = Utils.getSheet(workshopSheetName, ["تاريخ", "الفئة", "الملف المقترح", "ملخص المراجعة", "الكود المقترح", "الحالة"]);

      if (workshopSheet && (reviewResult.type === 'info' || reviewResult.type === 'text_response') && reviewResult.text) {
        workshopSheet.appendRow([
            new Date(),
            'مراجعة أسبوعية',
            'المشروع بأكمله',
            reviewResult.text,
            '', // لا يوجد كود مقترح محدد في هذه المراجعة العامة
            'للمراجعة'
        ]);
        Utils.log('AgentDeveloper: Weekly code review suggestions staged in workshop.', { sheet: workshopSheetName });
        return { type: 'success', text: 'تمت مراجعة الكود الأسبوعية وتسجيل الاقتراحات بنجاح.' };
      } else {
        Utils.error('AgentDeveloper: Failed to get valid review result or workshop sheet.', reviewResult);
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
      const code = Tools.ProjectService.getSingleFileContent(fileName);
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
      const files = Tools.ProjectService.getProjectFiles();
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

  return {
    handleRequest,
    generateCodeFromPrompt,
    runWeeklyCodeReview,
    suggestRefactoring,
    logCodeQualityMetrics
  };
});
