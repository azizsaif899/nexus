// *************************************************************************************************
// --- START OF FILE: 20_ai/8_ai_code_assistance.js ---
// *************************************************************************************************

/**
 * @file 20_ai/8_ai_code_assistance.js
 * @module System.AI.CodeAssistance
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة متخصصة في مهام المساعدة البرمجية. تم فصلها عن System.Tools.Developer
 * لتكون مسؤولة حصريًا عن بناء الطلبات الهندسية المعقدة وإرسالها إلى AI.Core.
 */

'use strict';

defineModule('System.AI.CodeAssistance', ({ Utils, Config, DocsManager, AI, Telemetry, MetricsLogger, Dialogue }) => {
  const MODULE_VERSION = Config.get('CODE_ASSISTANCE_VERSION') || '1.0.0';
  const METRICS_SHEET = 'AI_CodeAssistance_Metrics';

  DocsManager.registerModuleDocs('System.AI.CodeAssistance', [
    { name: 'reviewCode', version: MODULE_VERSION, description: 'يطلب من AI.Core تحليل ومراجعة كود.' },
    { name: 'generateCode', version: MODULE_VERSION, description: 'يطلب من AI.Core توليد دالة.' },
    { name: 'refactorCode', version: MODULE_VERSION, description: 'يطلب من AI.Core إعادة هيكلة الكود.' },
    { name: 'addCommentsToCode', version: MODULE_VERSION, description: 'يطلب من AI.Core إضافة تعليقات.' },
    { name: 'explainCode', version: MODULE_VERSION, description: 'يطلب من AI.Core شرح الكود.' }
  ]);

  function _recordInvocation(action, status, durationMs, meta = {}) {
    MetricsLogger.record({
      module: 'AI.CodeAssistance',
      action: action,
      version: MODULE_VERSION,
      status: status,
      durationMs: durationMs,
      sheetName: METRICS_SHEET,
      sheetHeaders: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'CodeLength', 'DescriptionLength', 'Error'],
      sheetRow: [new Date(), action, status, durationMs, MODULE_VERSION, meta.codeLength || 0, meta.descriptionLength || 0, meta.errorMessage || ''],
      meta: meta
    });
  }

  function _collectProjectContext() {
    // This can be expanded to fetch real context from other modules like DocsManager if needed
    return {
      projectDescription: "هذا مشروع Google Apps Script لمساعد ذكاء اصطناعي.",
      existingFiles: ['00_utils.js', '01_config.js', '99_Code.js'], // Example files
      existingFunctions: Object.keys(GAssistant || {}).map(k => `GAssistant.${k}`)
    };
  }

  /**
   * الدالة الخاصة التي تنفذ منطق تحليل الكود.
   * @param {{ userQuery: string, codeSnippet?: string, sessionId?: string }} args
   * @returns {UiResponse}
   * @private
   */
  function _performCodeAnalysis({ userQuery, codeSnippet, sessionId }) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    const modelUsed = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-pro';

    try {
      Utils.validateString(userQuery, 'userQuery');
      const projectContext = _collectProjectContext();

      const fullPrompt = `أنت مساعد خبير في Google Apps Script وJavaScript؛ مهمتك دعم المبرمجين بشكل استباقي وذكي.
هذا سياق المشروع:
${projectContext.projectDescription ? `وصف المشروع: ${projectContext.projectDescription}\n` : ''}
ملفات المشروع الحالية: ${projectContext.existingFiles ? JSON.stringify(projectContext.existingFiles) : 'لا توجد ملفات محددة.'}

طلب المبرمج: "${userQuery}"

${codeSnippet ? `الكود الذي يركّز عليه المبرمج:\n\`\`\`javascript\n${codeSnippet}\n\`\`\`` : ''}

استنادًا إلى هذا السياق وطلب المبرمج، يرجى تقديم تحليل واضح، أو كود مقترح، أو شرح مفصل. ضع أي كود داخل كتلة \`\`\`javascript.`;

      const result = AI.Core.ask(fullPrompt, {
        sessionId: sessionId,
        modelOverride: modelUsed,
        generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
        toolsEnabled: false,
      });

      if (result.type === 'info' || result.type === 'text_response') {
        status = 'success_code_analysis';
        return Dialogue.createSuccess('تم تحليل الكود بنجاح.', {
          originalQuery: userQuery,
          analysisText: result.text
        });
      } else {
        status = 'failed_ai_response';
        throw new Error(`Received an unexpected response type from AI.Core: ${result.type}.`);
      }
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`System.AI.CodeAssistance._performCodeAnalysis failed: ${errorMessage}`, e.stack);
      return Dialogue.createError(`💥 خطأ في تحليل الكود: ${errorMessage}`);
    } finally {
      _recordInvocation('performCodeAnalysis', status, Date.now() - start, { codeLength: codeSnippet?.length || 0, queryLength: userQuery.length, errorMessage: errorMessage });
    }
  }

  function reviewCode({ code, originalQuery = '' } = {}) {
    return _performCodeAnalysis({
      userQuery: originalQuery || 'راجع الكود المرفق',
      codeSnippet: code
    });
  }

  function generateCode({ description } = {}) {
    return _performCodeAnalysis({
      userQuery: `اكتب دالة لـ ${description}`
    });
  }

  function refactorCode({ code, request } = {}) {
    return _performCodeAnalysis({
      userQuery: `أعد هيكلة هذا الكود بناءً على: ${request}`,
      codeSnippet: code
    });
  }

  function addCommentsToCode({ code, request = '' } = {}) {
    const userQuery = request ? `أضف تعليقات توضيحية لهذا الكود بناءً على: ${request}` : `أضف تعليقات توضيحية لهذا الكود.`;
    return _performCodeAnalysis({ userQuery, codeSnippet: code });
  }

  function explainCode({ code } = {}) {
    return _performCodeAnalysis({
      userQuery: `اشرح هذا الكود بلغة طبيعية:`,
      codeSnippet: code
    });
  }

  return {
    reviewCode,
    generateCode,
    refactorCode,
    addCommentsToCode,
    explainCode
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/8_ai_code_assistance.js ---
// *************************************************************************************************