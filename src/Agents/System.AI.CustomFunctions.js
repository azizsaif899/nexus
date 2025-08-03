defineModule('System.AI.CustomFunctions', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';

  // نماذج Gemini المدعومة
  const GEMINI_MODELS = {
    'FLASH': 'gemini-2.0-flash-exp',
    'PRO': 'gemini-1.5-pro-latest',
    'FLASH_8B': 'gemini-1.5-flash-8b-latest'
  };

  function GEMINI(prompt, model = 'FLASH', temperature = 0.3) {
    try {
      if (!prompt) return 'خطأ: المطالبة مطلوبة';

      const modelName = GEMINI_MODELS[model] || GEMINI_MODELS.FLASH;

      const response = AI.Core.ask(prompt, {
        modelOverride: modelName,
        generationConfig: {
          temperature: parseFloat(temperature),
          maxOutputTokens: 1000
        }
      });

      return response.type === 'info' ? response.text : 'خطأ في الاستجابة';
    } catch (e) {
      return `خطأ: ${e.message}`;
    }
  }

  function GEMINI_ANALYZE(range, analysisType = 'summary') {
    try {
      if (!range) return 'خطأ: النطاق مطلوب';

      const data = Array.isArray(range) ? range : [[range]];
      const dataText = data.map(row => row.join('\t')).join('\n');

      const prompts = {
        'summary': `لخص البيانات التالية:\n${dataText}`,
        'trends': `حلل الاتجاهات في البيانات:\n${dataText}`,
        'insights': `استخرج رؤى مهمة من البيانات:\n${dataText}`
      };

      return GEMINI(prompts[analysisType] || prompts.summary);
    } catch (e) {
      return `خطأ: ${e.message}`;
    }
  }

  function GEMINI_CODE(description, language = 'javascript') {
    try {
      const prompt = `اكتب كود ${language} لـ: ${description}. أرجع الكود فقط بدون شرح.`;
      return GEMINI(prompt, 'PRO', 0.1);
    } catch (e) {
      return `خطأ: ${e.message}`;
    }
  }

  function GEMINI_FORMULA(description) {
    try {
      const prompt = `أنشئ صيغة Google Sheets لـ: ${description}. أرجع الصيغة فقط بدون شرح.`;
      return GEMINI(prompt, 'FLASH', 0.1);
    } catch (e) {
      return `خطأ: ${e.message}`;
    }
  }

  // تسجيل الوظائف كـ Global Functions
  if (typeof globalThis !== 'undefined') {
    globalThis.GEMINI = GEMINI;
    globalThis.GEMINI_ANALYZE = GEMINI_ANALYZE;
    globalThis.GEMINI_CODE = GEMINI_CODE;
    globalThis.GEMINI_FORMULA = GEMINI_FORMULA;
  }

  return {
    GEMINI,
    GEMINI_ANALYZE,
    GEMINI_CODE,
    GEMINI_FORMULA,
    GEMINI_MODELS,
    MODULE_VERSION
  };
});
