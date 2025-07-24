// *************************************************************************************************
// --- START OF FILE: 30_tools/tools_developer.gs ---
// *************************************************************************************************

/**
 * @file 30_tools/tools_developer.gs
 * @module System.ToolsDeveloper
 * @version 20
 * @author عبدالعزيز
 * @description
 * أدوات مخصصة لمساعدة المطورين، تدعم سير عمل متكامل للمراجعة،
 * التصنيف، التجهيز، والتوثيق الذكي.
 * المراحل المعمارية:
 *   • 1: تحويل الوحدة إلى defineModule وربط التبعيات
 *   • 8: تكامل مع AgentDeveloper لسير العمل التلقائي
 *   • 10: حفظ الأحداث في الذاكرة طويلة الأمد
 *   • 17: تسجيل مقاييس الاستخدام في أوراق Google Sheets
 */

defineModule('System.ToolsDeveloper', ({ Utils, Tools, Config, UI, AI, DocsManager, CodeAssistance, ModuleVerifier }) => {
  // ✅ تطبيق البرمجة الدفاعية (المرحلة 8، الخطوة 2)
  if (!ModuleVerifier?.checkReady('CodeAssistance', ['reviewCode', 'generateCode', 'refactorCode'])) {
    Utils.warn("System.ToolsDeveloper: Dependency 'CodeAssistance' is not ready. Developer tools will be disabled.");
    // إرجاع واجهة آمنة وغير وظيفية
    const safeReturn = {
      reviewCode: () => UI.Dialogue.createError('Code Assistance module is not ready.'),
      generateCode: () => UI.Dialogue.createError('Code Assistance module is not ready.'),
      refactorCode: () => UI.Dialogue.createError('Code Assistance module is not ready.')
    };
    return safeReturn;
  }

  // تسجيل الوثائق (مرحلة 9 لدعم DocsManager)
  DocsManager.registerModuleDocs('System.ToolsDeveloper', [
    {
      name: 'reviewCode',
      description: 'يطلب من AI.Core تحليل ومراجعة كود عبر CodeAssistance.',
      parameters: {
        type: 'OBJECT',
        properties: {
          code: { type: 'STRING', description: 'الكود المراد مراجعته.' },
          originalQuery: { type: 'STRING', description: 'الاستعلام الأصلي للمستخدم (اختياري).' }
        },
        required: ['code']
      }
    },
    {
      name: 'generateCode',
      description: 'يطلب من AI.Core توليد دالة بناءً على وصف عبر CodeAssistance.',
      parameters: {
        type: 'OBJECT',
        properties: {
          description: { type: 'STRING', description: 'وصف للدالة المطلوبة.' }
        },
        required: ['description']
      }
    },
    {
      name: 'refactorCode',
      description: 'يطلب من AI.Core إعادة هيكلة الكود عبر CodeAssistance.',
      parameters: {
        type: 'OBJECT',
        properties: {
          code: { type: 'STRING', description: 'الكود المراد إعادة هيكلته.' },
          request: { type: 'STRING', description: 'وصف لمتطلبات إعادة الهيكلة.' }
        },
        required: ['code', 'request']
      }
    },
    {
      name: 'applyFormulaToCell',
      description: 'يطبق صيغة على الخلية النشطة أو خلية محددة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          formula: { type: 'STRING', description: 'الصيغة المراد تطبيقها.' },
          cellA1Notation: { type: 'STRING', description: 'مرجع الخلية (اختياري).' }
        },
        required: ['formula']
      }
    },
    {
      name: 'getBuiltinFunctionDoc',
      description: 'يجلب توثيق دالة مدمجة في Apps Script، مع استخدام الكاش أولاً.',
      parameters: {
        type: 'OBJECT',
        properties: {
          functionName: { type: 'STRING', description: 'اسم الدالة الكامل، مثال: SpreadsheetApp.getActiveSpreadsheet' }
        },
        required: ['functionName']
      }
    },
    {
      name: 'exportToolsDocumentationToDoc',
      description: 'يصدر توثيق جميع الأدوات إلى مستند Google Docs.',
      parameters: { type: 'OBJECT', properties: {}, required: [] }
    },
    {
      name: 'addCommentsToCode',
      description: 'يطلب من AI.Core إضافة تعليقات برمجية تفسيرية إلى الكود المقدم.',
      parameters: {
        type: 'OBJECT',
        properties: {
          code: { type: 'STRING', description: 'الكود المراد إضافة تعليقات إليه.' },
          request: { type: 'STRING', description: 'طلب إضافي لتوجيه نوعية التعليقات (اختياري).' }
        },
        required: ['code']
      }
    },
    {
      name: 'explainCode',
      description: 'يطلب من AI.Core شرح منطق الكود المقدم بلغة بشرية واضحة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          code: { type: 'STRING', description: 'الكود المراد شرحه.' }
        },
        required: ['code']
      }
    }
  ]);

  // --- DELEGATION TO CodeAssistance MODULE ---
  // The core logic for code-related tasks is now delegated to the specialized
  // System.AI.CodeAssistance module, making this Tools.Developer module a clean facade.

  function reviewCode(args) {
    return CodeAssistance.reviewCode(args);
  }

  function generateCode(args) {
    return CodeAssistance.generateCode(args);
  }

  function refactorCode(args) {
    return CodeAssistance.refactorCode(args);
  }

  function addCommentsToCode(args) {
    // Assuming addCommentsToCode exists in CodeAssistance
    return CodeAssistance.addCommentsToCode ? CodeAssistance.addCommentsToCode(args) : UI.Dialogue.createError('Function addCommentsToCode not implemented.');
  }

  function explainCode(args) {
    // Assuming explainCode exists in CodeAssistance
    return CodeAssistance.explainCode ? CodeAssistance.explainCode(args) : UI.Dialogue.createError('Function explainCode not implemented.');
  }

  // --- ORIGINAL MODULE FUNCTIONS ---

  /**
   * يطبق صيغة على الخلية النشطة أو خلية محددة.
   * @param {{ formula: string, cellA1Notation?: string }} args
   */
  function applyFormulaToCell({ formula, cellA1Notation }) {
    return Utils.executeSafely(() => {
      const range = cellA1Notation ? SpreadsheetApp.getActive().getRange(cellA1Notation) : SpreadsheetApp.getActiveRange();
      range.setFormula(formula);
      return UI.Dialogue.createInfo(`✅ تم تطبيق الصيغة بنجاح على الخلية ${range.getA1Notation()}.`);
    }, [], 'ToolsDeveloper.applyFormulaToCell');
  }

  /**
   * يجلب توثيق دالة Apps Script مدمجة، مع استخدام الكاش أولاً.
   */
  function getBuiltinFunctionDoc({ functionName }) {
    return Utils.executeSafely(() => {
      const cached = AI.LongTermMemory.getCachedFunctionDoc(functionName);
      if (cached) {
        Utils.log('ToolsDeveloper.getBuiltinFunctionDoc: Retrieved from cache.', { functionName });
        return AI.Core.ask(`أعد صياغة هذا التوثيق بصيغة Markdown:\n${cached}`);
      }

      const prompt = `قدم توثيقًا شاملاً لدالة Google Apps Script التالية: \`${functionName}\`. أعد الرد بصيغة Markdown.`;
      const result = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_FLASH_MODEL') });

      if (result.type === 'info') {
        AI.LongTermMemory.cacheFunctionDoc(functionName, result.text);

        // المرحلة 10: حفظ حدث جلب التوثيق
        AI.LongTermMemory.save('GetBuiltinDoc', {
          source:       'ToolsDeveloper',
          functionName
        });

        // المرحلة 17: تسجيل مقياس جلب التوثيق
        const docMetrics = Utils.getSheet('DeveloperDoc_Metrics', ['Timestamp', 'FunctionName']);
        docMetrics.appendRow([new Date(), functionName]);
      }

      Utils.log('ToolsDeveloper.getBuiltinFunctionDoc: Fetched from API.', { functionName });
      return result;
    }, [], `ToolsDeveloper.getBuiltinFunctionDoc[${functionName}]`);
  }

  /**
   * يصدر توثيق الأدوات إلى مستند Google Docs.
   */
  function exportToolsDocumentationToDoc() {
    return Utils.executeSafely(() => {
      const doc  = DocumentApp.create(`توثيق أدوات G-Assistant - ${new Date().toLocaleDateString()}`);
      const body = doc.getBody();
      body.appendParagraph('توثيق أدوات G-Assistant').setHeading(DocumentApp.ParagraphHeading.TITLE);

      Tools.Catalog.getDeclarations().forEach(tool => {
        body.appendParagraph(tool.name).setHeading(DocumentApp.ParagraphHeading.HEADING1);
        body.appendParagraph(tool.description).setItalic(true);

        const params = tool.parameters.properties || {};
        if (Object.keys(params).length) {
          body.appendParagraph('المعاملات:').setHeading(DocumentApp.ParagraphHeading.HEADING2);
          const table = body.appendTable([['المعامل', 'النوع', 'الوصف', 'مطلوب؟']]);
          table.getRow(0).setAttributes({
            [DocumentApp.Attribute.BOLD]: true,
            [DocumentApp.Attribute.BACKGROUND_COLOR]: '#f3f3f3'
          });
          tool.parameters.required.forEach(name => {
            const p = params[name];
            table.appendTableRow([name, `\`${p.type}\``, p.description, 'نعم']);
          });
          tool.parameters.required.filter(n => !params[n]).forEach(name => {
            // in case of additional or optional props
            table.appendTableRow([name, '—', '—', 'لا']);
          });
        }
        body.appendHorizontalRule();
      });

      // المرحلة 10: حفظ حدث تصدير التوثيق
      AI.LongTermMemory.save('ExportToolsDoc', {
        source: 'ToolsDeveloper',
        docUrl: doc.getUrl()
      });

      // المرحلة 17: تسجيل مقياس تصدير التوثيق
      const expMetrics = Utils.getSheet('DeveloperExport_Metrics', ['Timestamp', 'DocUrl']);
      expMetrics.appendRow([new Date(), doc.getUrl()]);

      Utils.log('ToolsDeveloper.exportToolsDocumentationToDoc: Success', { url: doc.getUrl() });
      SpreadsheetApp.getUi().alert(`✅ تم تصدير التوثيق. الرابط:\n${doc.getUrl()}`);
    }, [], 'ToolsDeveloper.exportToolsDocumentationToDoc');
  }

  return {
    reviewCode,
    generateCode,
    refactorCode,
    addCommentsToCode,
    explainCode,
    applyFormulaToCell,
    getBuiltinFunctionDoc,
    exportToolsDocumentationToDoc
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_developer.gs ---
// *************************************************************************************************
