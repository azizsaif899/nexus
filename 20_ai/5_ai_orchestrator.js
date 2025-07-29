// *************************************************************************************************
// --- START OF FILE: 20_ai/5_ai_orchestrator.js ---
// *************************************************************************************************

/**
 * @file 20_ai/5_ai_orchestrator.js
 * @module System.AI.Orchestrator
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة تنسيق وتنفيذ طلبات الذكاء الاصطناعي. هذه الوحدة هي المحرك الفعلي الذي يتعامل
 * مع بناء السياق، استدعاء Gemini API عبر الـ Adapter، معالجة الردود، وتحديث الذاكرة.
 * تم فصلها عن AI.Core لتقليل التبعيات وتحسين البنية المعمارية.
 */

defineModule('System.AI.Orchestrator', ({
  Utils,
  Config,
  AI,
  Tools,
  MetricsLogger,
  Telemetry,
  Dialogue,
  DocsManager
}) => {

  const MODULE_VERSION = Config.get('AI_ORCHESTRATOR_VERSION') || '1.0.0';
  const MAX_RETRIES = Config.get('API_MAX_RETRIES') || 3;
  const INITIAL_BACKOFF_MS = Config.get('API_RETRY_DELAY_MS') || 1000;

  DocsManager.registerModuleDocs('System.AI.Orchestrator', [{
    name: 'execute',
    version: MODULE_VERSION,
    description: 'الدالة التنفيذية الأساسية التي تتلقى طلبًا، تبني السياق، تستدعي النموذج، وتعالج الرد.',
    parameters: { /* ... */ },
    returns: { type: 'UiResponse' }
  }]);

  function _validatePromptAndOptions(prompt, options) {
    const MAX_PROMPT_LEN = Config.get('GEMINI_MAX_PROMPT_LEN') || 8192;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('Orchestrator: Prompt must be a non-empty string.');
    }
    if (prompt.length > MAX_PROMPT_LEN) {
      throw new Error(`Prompt too long (max ${MAX_PROMPT_LEN} characters).`);
    }
    if (typeof options !== 'object' || options === null) {
      throw new Error('Orchestrator: Options must be an object.');
    }
  }

  function _recordInvocation(action, status, durationMs, meta = {}) {
    MetricsLogger.record({
      module: 'AI.Orchestrator',
      action: action,
      status: status,
      durationMs: durationMs,
      sheetName: 'AI_Orchestrator_Metrics',
      sheetHeaders: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Model', 'PromptLength', 'Error'],
      sheetRow: [new Date(), action, status, durationMs, meta.model || 'N/A', meta.promptLength || 0, meta.errorMessage || ''],
      meta: meta
    });
  }

  /**
   * يعالج الاستجابة الأولية من Gemini API.
   * @param {{apiResponse: object}} args
   * @returns {UiResponse}
   * @private
   */
  function _processApiResponse({ apiResponse }) {
    const candidate = apiResponse?.candidates?.[0];
    if (!candidate || candidate.finishReason === 'SAFETY') {
      const safetyMessage = candidate?.safetyRatings?.[0]?.category ? `Blocked by safety setting: ${candidate.safetyRatings[0].category}` : 'No valid response from AI model due to safety settings or other issues.';
      return Dialogue.createError(safetyMessage);
    }

    const part = candidate.content?.parts?.[0];
    if (!part) {
      return Dialogue.createError('Response part is missing from AI model.');
    }

    // Check for tool call
    if (part.functionCall) {
      const { name, args } = part.functionCall;
      Utils.log(`Orchestrator: AI requested tool call: ${name}`, args);
      // Delegate execution to ToolExecutor
      const toolResult = AI.ToolExecutor.executeFunctionCall(name, args);
      return toolResult; // ToolExecutor is expected to return a UiResponse-like object
    }

    // Check for text response
    if (part.text) {
      return Dialogue.createInfo(part.text);
    }

    return Dialogue.createWarning('AI response was empty or in an unknown format.');
  }

  function _retryApiCall(apiCallFn, args, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
      try {
        return apiCallFn(...args);
      } catch (e) {
        Utils.warn(`Orchestrator._retryApiCall: API call failed (attempt ${i + 1}/${retries}): ${e.message}`);
        Telemetry.track('AI.Orchestrator.ApiRetry', { attempt: i + 1, error: e.message });
        if (i < retries - 1) {
          Utilities.sleep(INITIAL_BACKOFF_MS * Math.pow(2, i));
        } else {
          throw e;
        }
      }
    }
  }

  /**
   * الدالة التنفيذية الأساسية للتفاعل مع نموذج Gemini.
   * @param {string} userPrompt - نصّ الأمر أو السؤال من المستخدم.
   * @param {object} [options={}] - خيارات إضافية للتحكم في سلوك النموذج.
   * @returns {UiResponse}
   */
  function execute(userPrompt, options = {}) {
    const start = Date.now();
    let currentStatus = 'initial';
    const sessionId = options.sessionId || 'default';
    let modelUsed = options.modelOverride || Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-pro';

    try {
      _validatePromptAndOptions(userPrompt, options);
      Utils.log(`Orchestrator.execute: Starting for session '${sessionId}'`);

      // 1. بناء السياق
      const context = AI.Context.build({
        sessionId: sessionId,
        includeSheetContext: options.includeSheetContext !== false,
        includeUserActions: options.includeUserActions !== false
      });
      const userMessage = { role: 'user', parts: [{ text: userPrompt }] };

      // 2. بناء الحمولة (Payload)
      const generationConfig = { ...Config.get('GENERATION_CONFIG'), ...options.generationConfig };
      const toolsAvailable = options.toolsEnabled !== false ? Tools.Catalog.getAllTools() : [];
      const systemInstruction = context.systemInstruction || "You are a helpful assistant.";
      const payload = {
        contents: [...context.history, userMessage],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        tools: toolsAvailable.length > 0 ? [{ functionDeclarations: toolsAvailable }] : undefined,
        generationConfig: generationConfig,
        safetySettings: options.safetySettings || Config.get('SAFETY_SETTINGS'),
      };

      // 3. استدعاء API
      const apiResponse = _retryApiCall(AI.GeminiAdapter.callGeminiApi, [{ model: modelUsed, payload: payload }]);

      // 4. معالجة الرد
      let finalResponse = _processApiResponse({ apiResponse: apiResponse });

      // 5. تحديث الذاكرة
      AI.Memory.addMessageToHistory({ sessionId: sessionId, message: userMessage });
      // For tool calls, the response might be complex. We log the text part for simplicity.
      const responseTextForMemory = finalResponse.type === 'tool_result'
        ? `[Tool Call Executed: ${finalResponse.data?.call?.name || 'unknown'}]`
        : finalResponse.text;
      const modelMsg = { role: 'model', parts: [{ text: responseTextForMemory }] };
      AI.Memory.addMessageToHistory({ sessionId, message: modelMsg });

      const duration = Date.now() - start;
      currentStatus = finalResponse.type;
      _recordInvocation('execute', currentStatus, duration, {
        model: modelUsed,
        promptLength: userPrompt.length,
      });

      return finalResponse;

    } catch (e) {
      const duration = Date.now() - start;
      const errorMessage = e.message;
      Utils.error(`Orchestrator.execute: Error for session '${sessionId}': ${errorMessage}`, e.stack);
      currentStatus = 'exception';
      _recordInvocation('execute', currentStatus, duration, { model: modelUsed, errorMessage: errorMessage });
      return Dialogue.createError(`💥 خطأ داخلي في نظام الذكاء الاصطناعي: ${errorMessage}`);
    }
  }

  return {
    execute
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/5_ai_orchestrator.js ---
// *************************************************************************************************