/**
 * @module System.AI.JsonQuery
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AI.JsonQuery', ({ AI }) => {
  // === المحتوى الأصلي ===
  
  
  /**
   * @file 20_ai/7_ai_json_query.js
   * @module System.AI.JsonQuery
   * @version 1.0.0
   * @author عبدالعزيز
   * @description
   * وحدة متخصصة في طلب ومعالجة ردود JSON المنظمة من النموذج.
   * تم فصلها عن AI.Core لتطبيق مبدأ فصل الاهتمامات (Separation of Concerns).
   */
  
  
  
  const MODULE_VERSION = Config.get('JSON_QUERY_VERSION') || '1.0.0';
  
    /**
     * يطالب Gemini برد JSON منظم ويُحاول تحليله.
     * @param {{ userPrompt: string, sessionId?: string, options?: object } args
     * @returns {UiResponse} - كائن UiResponse يحتوي على البيانات المحللة كـ JSON أو خطأ.
     */
    function ask({ userPrompt, sessionId, options = {} }) {
      const start = Date.now();
      let currentStatus = 'initial';
      const modelUsed = options.modelOverride || Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-pro';
  
      try {
        const fullOptions = {
          ...options,
          structuredOutputRequested: true,
          generationConfig: {
            ...(options.generationConfig || {}),
            responseMimeType: 'application/json'
          },
          toolsEnabled: false,
  }
  

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});