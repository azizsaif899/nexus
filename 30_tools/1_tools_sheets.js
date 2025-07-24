// *************************************************************************************************
// --- START OF FILE: 30_tools/tools_sheets.gs ---
// *************************************************************************************************

/**
 * @file 30_tools/tools_sheets.gs
 * @module System.ToolsSheets
 * @version 20
 * @author عبدالعزيز
 * @description
 * أدوات متقدمة للتعامل مع Google Sheets، معززة بالذكاء الاصطناعي لتوليد
 * الرؤى، اقتراح الصيغ، وإنشاء أوراق عمل ديناميكيًا.
 * مرتبطة بـ: AI.Core, AI.Context, AI.LongTermMemory, UI.Dialogue, Utils
 * نقاط تنفيذ قابلة للتفعيل مستقبلًا (المرحلة 15): summarizeActiveSheetWithGemini, suggestFormulaWithGemini
 */

defineModule('System.ToolsSheets', ({ Utils, AI, UI }) => {
  function summarizeActiveSheetWithGemini() {
    return Utils.executeSafely(() => {
      const tempState = {};
      AI.Context.build(tempState);
      const sheetContext = tempState.systemInstruction;

      const prompt = `بناءً على سياق ورقة العمل التالي، قدم ملخصًا موجزًا وشاملاً للبيانات، الغرض المحتمل منها، وأي رؤى أولية يمكنك استنتاجها. استخدم تنسيق Markdown:\n\n${sheetContext}\n\nملخص الورقة:`;

      AI.LongTermMemory.save('SheetSummary', { source: 'ToolsSheets', context: sheetContext });

      const result = AI.Core.ask(prompt, { modelOverride: AI.Config.get('GEMINI_FLASH_MODEL') });
      Utils.log('ToolsSheets: AI summary received.');
      return result;
    }, [], 'ToolsSheets.summarizeActiveSheetWithGemini');
  }

  function suggestFormulaWithGemini({ description, includeExplanation = false }) {
    return Utils.executeSafely(() => {
      const tempState = {};
      AI.Context.build(tempState);
      const sheetContext = tempState.systemInstruction;

      const prompt = `
بناءً على سياق ورقة Google Sheets التالية:
${sheetContext}

قم بتوليد صيغة Google Sheets دقيقة تحقق الوصف التالي: "${description}".
أعد الرد ككائن JSON بالهيكل التالي: { "formula": "...", "explanation": "..." }.
يجب أن تبدأ الصيغة بعلامة =. اجعل الشرح واضحًا للمستخدم العادي.
`;

      const result = AI.Core.ask(prompt, {
        modelOverride: AI.Config.get('GEMINI_FLASH_MODEL'),
        structuredOutputRequested: true
      });

      AI.LongTermMemory.save('FormulaSuggestion', {
        source: 'ToolsSheets',
        request: description,
        response: result
      });

      if (result.type === 'info') {
        try {
          const data = JSON.parse(result.text);
          if (data.formula?.trim().startsWith('=')) {
            let responseText = `✅ الصيغة المقترحة:\n\`\`\`\n${data.formula.trim()}\n\`\`\``;
            if (includeExplanation && data.explanation) {
              responseText += `\n\n**الشرح:** ${data.explanation}`;
            }
            return UI.Dialogue.createSuccess(responseText);
          }
        } catch (e) { /* تجاهل */ }
      }

      Utils.warn('ToolsSheets.suggestFormulaWithGemini: Invalid AI response', { response: result.text });
      return UI.Dialogue.createWarning(`لم يتمكن المساعد من توليد صيغة صالحة. الرد كان: ${result.text}`);
    }, [], `ToolsSheets.suggestFormulaWithGemini[${description}]`);
  }

  function createSheetFromTemplate({ templateName, newSheetName }) {
    return Utils.executeSafely(() => {
      const userTemplates = JSON.parse(PropertiesService.getUserProperties().getProperty('CUSTOM_SHEET_TEMPLATES') || '{}');

      const defaultTemplates = {
        "المالية الشهرية": ["التاريخ", "الوصف", "الإيراد", "المصروف", "الرصيد"],
        "قائمة المهام": ["المهمة", "الحالة", "الأولوية", "تاريخ الاستحقاق", "المسؤول"],
        "إدارة المخزون": ["معرف المنتج", "اسم المنتج", "الكمية الحالية", "نقطة إعادة الطلب", "المورد"]
      };

      const allTemplates = { ...defaultTemplates, ...userTemplates };
      const headers = allTemplates[templateName];

      if (!headers) {
        return UI.Dialogue.createError(`قالب "${templateName}" غير موجود. المتاح: ${Object.keys(allTemplates).join(', ')}`);
      }

      const sheet = Utils.getSheet(newSheetName, headers);
      if (sheet) {
        Utils.log('ToolsSheets.createSheetFromTemplate: Success', { newSheetName, templateName });
        return UI.Dialogue.createSuccess(`✅ تم إنشاء ورقة "${newSheetName}" بنجاح باستخدام قالب "${templateName}".`);
      } else {
        return UI.Dialogue.createError(`❌ فشل إنشاء ورقة "${newSheetName}".`);
      }
    }, [], `ToolsSheets.createSheetFromTemplate[${templateName}]`);
  }

  return {
    summarizeActiveSheetWithGemini,
    suggestFormulaWithGemini,
    createSheetFromTemplate
  };
});

// *************************************************************************************************
// --- END OF FILE: 30_tools/tools_sheets.gs ---
// *************************************************************************************************