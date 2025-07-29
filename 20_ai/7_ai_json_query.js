// *************************************************************************************************
// --- START OF FILE: 20_ai/7_ai_json_query.js ---
// *************************************************************************************************

/**
 * @file 20_ai/7_ai_json_query.js
 * @module System.AI.JsonQuery
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة متخصصة في طلب ومعالجة ردود JSON المنظمة من النموذج.
 * تم فصلها عن AI.Core لتطبيق مبدأ فصل الاهتمامات (Separation of Concerns).
 */

defineModule('System.AI.JsonQuery', ({ Utils, Config, AI, Telemetry, MetricsLogger, Dialogue }) => {
  const MODULE_VERSION = Config.get('JSON_QUERY_VERSION') || '1.0.0';

  /**
   * يطالب Gemini برد JSON منظم ويُحاول تحليله.
   * @param {{ userPrompt: string, sessionId?: string, options?: object }} args
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
      };

      // استدعاء AI.Core.ask لتنفيذ الطلب الفعلي
      const result = AI.Core.ask(userPrompt, { sessionId, ...fullOptions });

      if (result.type === 'info' || result.type === 'success' || result.type === 'text_response') {
        currentStatus = 'success_api_call';
      } else {
        currentStatus = 'api_response_error';
        throw new Error(`Expected text response for JSON parsing, but got: ${result.type}.`);
      }

      const jsonText = result.text || (result.data ? JSON.stringify(result.data) : '');
      if (!jsonText) {
        currentStatus = 'empty_json_response';
        throw new Error('Gemini returned an empty response for JSON parsing.');
      }

      try {
        const cleanedJsonText = jsonText.replace(/```json\s*|\s*```/g, '').trim();
        const parsedJson = JSON.parse(cleanedJsonText);
        currentStatus = 'success_json_parse';
        const duration = Date.now() - start;
        MetricsLogger.record({
            module: 'AI.JsonQuery', action: 'ask', version: MODULE_VERSION, status: currentStatus, durationMs: duration,
            meta: { model: modelUsed, promptLength: userPrompt.length, responseLength: jsonText.length }
        });
        return Dialogue.createSuccess('JSON response successfully parsed.', parsedJson);
      } catch (e) {
        currentStatus = 'json_parse_error';
        throw new Error(`Failed to parse JSON response: ${e.message}. Raw: ${jsonText.substring(0, 200)}...`);
      }
    } catch (e) {
      const duration = Date.now() - start;
      const errorMessage = e.message;
      if (currentStatus === 'initial') currentStatus = 'exception';
      MetricsLogger.record({
          module: 'AI.JsonQuery', action: 'ask', version: MODULE_VERSION, status: currentStatus, durationMs: duration,
          meta: { model: modelUsed, promptLength: userPrompt.length, errorMessage: errorMessage, stack: e.stack }
      });
      return Dialogue.createError(`💥 خطأ في توليد JSON: ${errorMessage}`);
    }
  }

  return {
    ask
  };
});