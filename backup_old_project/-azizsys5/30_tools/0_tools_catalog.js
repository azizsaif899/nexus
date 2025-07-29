// *************************************************************************************************
// --- START OF FILE: 30_tools/tools_catalog.gs ---
// *************************************************************************************************

/**
 * @file 30_tools/tools_catalog.gs
 * @module System.Tools.Catalog
 * @version 21
 * @author عبدالعزيز
 * @description
 * كتالوج مركزي للأدوات ("مهارات") التي يمكن للمساعد استدعاؤها.
 * المراحل المعمارية:
 *   • 5: نظام التصنيف المركزي للأدوات
 *   • 9: تسجيل الوثائق في DocsManager
 */

defineModule('System.Tools.Catalog', ({ Utils, DocsManager }) => {
  /** @type {Array<{ name: string; description: string; parameters: object; functionPath: string }>} */
  const ALL_TOOL_DEFINITIONS = [
    {
      name: "summarizeActiveSheetWithGemini",
      description: "ينشئ ملخصًا ذكيًا و مفصلاً للبيانات في الورقة النشطة.",
      parameters: { type: "OBJECT", properties: {}, required: [] },
      functionPath: "GAssistant.Tools.Sheets.summarizeActiveSheetWithGemini"
    },
    {
      name: "suggestFormulaWithGemini",
      description: "يقترح صيغة بناءً على وصف نصي للنتيجة المطلوبة.",
      parameters: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING", description: "وصف الصيغة المطلوبة." }
        },
        required: ["description"]
      },
      functionPath: "GAssistant.Tools.Sheets.suggestFormulaWithGemini"
    },
    {
      name: "calculateGrossProfit",
      description: "يحسب الربح الإجمالي لفترة زمنية محددة.",
      parameters: {
        type: "OBJECT",
        properties: {
          startDate: { type: "STRING", description: "YYYY-MM-DD" },
          endDate:   { type: "STRING", description: "YYYY-MM-DD" }
        },
        required: ["startDate","endDate"]
      },
      functionPath: "GAssistant.Tools.Accounting.calculateGrossProfit"
    },
    {
      name: "generateDailySummary",
      description: "يولد ملخصًا ماليًا لليوم المحدد أو الحالي.",
      parameters: {
        type: "OBJECT",
        properties: {
          date: { type: "STRING", description: "YYYY-MM-DD" }
        },
        required: []
      },
      functionPath: "GAssistant.Tools.Accounting.generateDailySummary"
    },
    {
      name: "reviewCode",
      description: "مراجعة كود Apps Script لأخطاء وتحسينات وأفضل ممارسات.",
      parameters: {
        type: "OBJECT",
        properties: {
          code:       { type: "STRING", description: "الكود المراد مراجعته." },
          reviewType: { type: "STRING", enum:["general","performance","security","readability"], description:"نوع المراجعة." }
        },
        required: ["code","reviewType"]
      },
      functionPath: "GAssistant.Tools.Developer.reviewCode"
    },
    {
      name: "getBuiltinFunctionDoc",
      description: "يجلب توثيق دالة Apps Script مدمجة.",
      parameters: {
        type: "OBJECT",
        properties: {
          functionName: { type: "STRING", description: "مثال: 'SpreadsheetApp.getActiveSpreadsheet'" }
        },
        required: ["functionName"]
      },
      functionPath: "GAssistant.Tools.Developer.getBuiltinFunctionDoc"
    }
  ];

  /**
   * تُرجع تعريفات الأدوات للاستخدام في payload.
   */
  function getDeclarations() {
    return ALL_TOOL_DEFINITIONS.map(({ functionPath, ...rest }) => rest);
  }

  /**
   * تُرجع جميع الأدوات (لتضمينها في Core).
   */
  function getAllTools() {
    return getDeclarations();
  }

  /**
   * تجلب الدالة الفعلية لاستدعاء الأداة.
   */
  function getFunction(toolName) {
    const tool = ALL_TOOL_DEFINITIONS.find(t => t.name === toolName);
    if (!tool) {
      Utils.error(`Tools.Catalog.getFunction: Tool '${toolName}' not found.`);
      return null;
    }
    const fn = Utils.getFunctionByPath(tool.functionPath);
    if (typeof fn !== 'function') {
      Utils.error(`Tools.Catalog.getFunction: Invalid path '${tool.functionPath}'.`);
      return null;
    }
    return fn;
  }

  // تسجيل الوثائق (مرحلة 9)
  DocsManager.registerModuleDocs('System.Tools.Catalog', [
    { name: 'getDeclarations', description: 'تعريف الأدوات للاستخدام في payload.' },
    { name: 'getAllTools',     description: 'إرجاع قائمة بكل أدوات الكتالوج.' },
    { name: 'getFunction',     description: 'جلب دالة الأداة حسب الاسم.' }
  ]);

  return {
    getDeclarations,
    getAllTools,
    getFunction
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_catalog.gs ---
// *************************************************************************************************
