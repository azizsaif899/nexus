// *************************************************************************************************
// --- START OF FILE: 20_ai/4_ai_core.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/4_ai_core.gs
 * @module System.AI.Core
 * @version 1.3.1 // ✅ تحديث الإصدار للإشارة إلى تحسينات التسجيل والتتبع
 * @author عبدالعزيز
 * @description
 * المحرك الرئيسي لطلبات AI: يتعامل مع بناء السياق الذكي، استدعاء نموذج Gemini (مع دعم الأدوات)،
 * معالجة الردود، وتكامل الذاكرة طويلة الأمد. يوفر مرونة عالية في تكوين الطلبات ومعالجة الأخطاء.
 * المراحل المعمارية المطبقة:
 * • 1   defineModule وربط التبعيات
 * • 6   تحقق من صحة المدخلات
 * • 9   تسجيل الوثائق في DocsManager
 * • 10  حفظ الاستدعاءات في LongTermMemory (معزز)
 * • 11  إرسال Telemetry لكل استدعاء (معزز)
 * • 12  مراقبة الأداء والأخطاء (معزز)
 * • 33  دمج كامل للذاكرة طويلة الأمد وقصيرة الأمد
 * • 34  دعم استدعاء الأدوات بواسطة النموذج (Tool Use/Function Calling)
 * • 35  معالجة أخطاء API وإعادة المحاولة بذكاء
 * • 36  مرونة في اختيار النموذج ومعلمات التوليد
 * • 37  التعامل مع تسلسل الأدوات (Tool Chaining - عبر إعادة استدعاء ask - ملاحظة في التنفيذ)
 * • **جديد: دمج askJSON و askForCodeAnalysis كوظائف أساسية هنا مع تسجيل مفصل**
 */

'use strict'; // توجيه 'use strict' يجب أن يكون في أعلى الملف لتجنب المشاكل مع destructuring

defineModule('System.AI.Core', [
  'GAssistant.Utils',
  'System.Dialogue',
  'System.Config',
  'System.AI',
  'System.Tools',
  'System.DocsManager',
  'System.Telemetry'
], ({ 
  Utils, 
  Dialogue, 
  Config, 
  AI, 
  Tools, 
  DocsManager, 
  Telemetry 
}) => {
  const MODULE_VERSION   = Config.get('AI_CORE_VERSION')    || '1.3.1';
  const MAX_RETRIES      = Config.get('API_MAX_RETRIES')    || 3;
  const RETRY_DELAY_MS   = Config.get('API_RETRY_DELAY_MS') || 1000;
  const MAX_PROMPT_LEN   = Config.get('GEMINI_MAX_PROMPT_LEN') || 8192; 
 


  // مرحلة 9: توثيق الوحدة
  DocsManager.registerModuleDocs('System.AI.Core', [
    {
      name: 'ask',
      version: MODULE_VERSION,
      description: 'يرسل طلب المستخدم إلى Gemini، يبني سياقًا ذكيًا (ذاكرة الجلسة والذاكرة طويلة الأمد)، يدعم استدعاء الأدوات بواسطة النموذج، ويعالج الردود والأخطاء بمرونة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          userPrompt: { type: 'STRING', description: 'نصّ الأمر أو السؤال من المستخدم.' },
          options: {
            type: 'OBJECT',
            description: 'خيارات إضافية للتحكم في سلوك النموذج أو السياق.',
            properties: {
              sessionId: { type: 'STRING', description: 'معرف الجلسة للمحادثة، يستخدم لـ AI.Memory.', optional: true },
              modelOverride: { type: 'STRING', description: 'اسم نموذج Gemini المطلوب استخدامه (مثلاً "gemini-pro-vision").', optional: true },
              structuredOutputRequested: { type: 'BOOLEAN', description: 'هل يفضل النموذج إخراجًا منظمًا؟ (قد يؤثر على generationConfig).', optional: true },
              toolsEnabled: { type: 'BOOLEAN', description: 'تفعيل أو تعطيل قدرة النموذج على استدعاء الأدوات.', optional: true, default: true },
              generationConfig: { type: 'OBJECT', description: 'تكوين التوليد المخصص لـ Gemini API (مثل temperature, maxOutputTokens).', optional: true },
              safetySettings: { type: 'ARRAY', description: 'إعدادات الأمان لمنع المحتوى غير المرغوب فيه.', optional: true },
              thinkingConfig: { type: 'OBJECT', description: 'إعدادات التفكير (streaming, maxThinkingSteps).', optional: true }
            }
          }
        },
        required: ['userPrompt']
      },
      returns: { type: 'OBJECT', description: 'كائن UiResponse موحد ({ type: string, text: string, data?: object }).' }
    },
    {
      name: 'askJSON',
      version: MODULE_VERSION,
      description: 'يطالب Gemini برد JSON منظم ويُحاول تحليله. يستخدم ask الأساسية مع إعدادات JSON.',
      parameters: {
        type: 'OBJECT',
        properties: {
          userPrompt: { type: 'STRING', description: 'النص المطلوب إرساله.' },
          sessionId: { type: 'STRING', description: 'معرف الجلسة للمحادثة (اختياري).', optional: true },
          options: { type: 'OBJECT', description: 'خيارات إضافية لنموذج Gemini (مثل modelOverride, generationConfig, safetySettings).' }
        },
        required: ['userPrompt']
      },
      returns: { type: 'OBJECT', description: 'كائن UiResponse يحتوي على البيانات المحللة كـ JSON أو خطأ.' }
    },
    {
      name: 'askForCodeAnalysis',
      version: MODULE_VERSION,
      description: 'يرسل طلب تحليل كود إلى Gemini مع سياق المشروع ويستقبل اقتراحات برمجية. يستخدم ask الأساسية مع prompt مخصص.',
      parameters: {
        type: 'OBJECT',
        properties: {
          userQuery: { type: 'STRING', description: 'استعلام المستخدم الأصلي.' },
          codeSnippet: { type: 'STRING', description: 'جزء الكود المراد تحليله (اختياري).' },
          projectContext: { type: 'OBJECT', description: 'بيانات سياقية عن المشروع (الوصف، الملفات، الدوال الموجودة).', required: true },
          sessionId: { type: 'STRING', description: 'معرف الجلسة لإدارة سياق التحليل (اختياري).', optional: true }
        },
        required: ['userQuery', 'projectContext']
      },
      returns: { type: 'OBJECT', description: 'كائن UiResponse يحتوي على تحليل الكود، اقتراحات الكود، أو الأخطاء.' }
    }
  ]);

  /**
   * مرحلة 6: تحقق من صحة المدخلات.
   * @param {string} prompt - النص الأساسي للطلب.
   * @param {object} options - خيارات الطلب.
   * @throws {Error} إذا كانت المدخلات غير صالحة أو تجاوزت الحد الأقصى للطول.
   */
  function _validatePromptAndOptions(prompt, options) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('AI.Core: Prompt must be a non-empty string.');
    }
    if (prompt.length > MAX_PROMPT_LEN) {
      Utils.error(`AI.Core: Prompt length (${prompt.length}) exceeds MAX_PROMPT_LEN (${MAX_PROMPT_LEN}).`);
      throw new Error(`Prompt too long (max ${MAX_PROMPT_LEN} characters).`);
    }
    if (typeof options !== 'object' || options === null) {
      throw new Error('AI.Core: Options must be an object (or omitted).');
    }
  }

  /**
   * يسجل استدعاءات AI.Core في LTM، Telemetry، وورقة المقاييس.
   * @param {string} action - نوع الإجراء ('ask', 'askJSON', 'askForCodeAnalysis').
   * @param {string} status - حالة العملية ('success_text', 'success_tool', 'error_api', 'exception', etc.).
   * @param {number} durationMs - مدة العملية بالمللي ثانية.
   * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
   * @private
   */
  function _recordInvocation(action, status, durationMs, meta = {}) {
    const ts = new Date().toISOString();
    const recordData = {
      module: 'AI.Core',
      function: action, // 'function' هنا تشير إلى اسم الدالة التي تم استدعاؤها داخل الوحدة
      version: MODULE_VERSION,
      timestamp: ts,
      status,
      durationMs,
      ...meta
    };

    AI.LongTermMemory.save('CoreInvocation', recordData);
    Telemetry.track('AI.Core.Invocation', recordData);

    const sheet = Utils.getSheet('AI_Core_Metrics', ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'Model', 'PromptLength', 'ResponseLength', 'Error']);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        action, // هذا هو العمود 'Action' في ورقة المقاييس
        status,
        durationMs,
        MODULE_VERSION,
        meta.model || 'N/A',
        meta.promptLength || 0,
        meta.responseLength || 0,
        meta.errorMessage || ''
      ]);
    } else {
      Utils.warn(`AI.Core._recordInvocation: Failed to get sheet 'AI_Core_Metrics'. Metrics not recorded.`);
    }
  }

  /**
   * دالة مساعدة لإنشاء استجابة UiResponse موحدة.
   * @param {string} type - نوع الاستجابة ('info', 'warning', 'error', 'tool_result', 'code_analysis_result').
   * @param {string} text - النص المراد عرضه للمستخدم.
   * @param {object} [data={}] - بيانات إضافية.
   * @returns {UiResponse}
   * @private
   */
  function _createUiResponse(type, text, data = {}) {
    Utils.validateString(type, 'UiResponse type');
    Utils.validateString(text, 'UiResponse text');
    return { type, text, data };
  }

  /**
   * المرحلة 35: آلية إعادة المحاولة (Retry Logic) للأخطاء العابرة.
   * @param {Function} apiCallFn - الدالة التي تقوم باستدعاء API (مثل AI.GeminiAdapter.callGeminiApi).
   * @param {Array} args - مصفوفة من الوسائط لتمريرها إلى apiCallFn.
   * @param {number} [retries=MAX_RETRIES] - عدد مرات إعادة المحاولة المتبقية.
   * @param {number} [backoffMs=INITIAL_BACKOFF_MS] - وقت التراجع الحالي بالمللي ثانية.
   * @returns {any} نتيجة استدعاء API.
   * @throws {Error} إذا فشلت جميع المحاولات.
   * @private
   */
  function _retryApiCall(apiCallFn, args, retries = MAX_RETRIES, backoffMs = INITIAL_BACKOFF_MS) {
    for (let i = 0; i < retries; i++) {
      try {
        return apiCallFn(...args);
      } catch (e) {
        Utils.warn(`AI.Core._retryApiCall: API call failed (attempt ${i + 1}/${MAX_RETRIES}): ${e.message}`);
        Telemetry.track('AI.Core.ApiRetry', { attempt: i + 1, error: e.message, function: apiCallFn.name || 'anonymous' });

        // إعادة محاولة فقط إذا لم تكن المحاولة الأخيرة
        if (i < retries - 1) {
          Utilities.sleep(backoffMs * Math.pow(2, i)); // تباطؤ أسي
        } else {
          throw e; // إعادة رمي الخطأ بعد تجاوز أقصى عدد للمحاولات
        }
      }
    }
    // هذا السطر لا يجب أن يتم الوصول إليه، ولكن كـ fallback
    throw new Error('AI.Core._retryApiCall: All retry attempts failed unexpectedly.');
  }

  /**
   * الدالة الأساسية للتفاعل مع نموذج Gemini.
   * @param {string} userPrompt - نصّ الأمر أو السؤال من المستخدم.
   * @param {object} [options={}] - خيارات إضافية للتحكم في سلوك النموذج.
   * @returns {UiResponse}
   */
  function ask(userPrompt, options = {}) {
    const start = Date.now();
    let currentStatus = 'initial';
    const sessionId = options.sessionId || 'default';
    let modelUsed = options.modelOverride || Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-pro';

    try {
      _validatePromptAndOptions(userPrompt, options);
      Utils.log(`AI.Core.ask: Starting for session '${sessionId}' with prompt: '${userPrompt.substring(0, 50)}...'`);

      // 1) بناء السياق الكامل للنموذج (سجل المحادثة والذاكرة طويلة الأمد)
      const combinedContext = AI.Memory.getCombinedContext({
        sessionId: sessionId,
        userQuery: userPrompt,
        maxTokens: Config.get('MAX_MODEL_CONTEXT_TOKENS') || 10000
      });
      const sessionHistory = combinedContext.sessionHistory;
      const longTermContext = combinedContext.longTermContext;

      // إضافة استعلام المستخدم الحالي إلى سجل المحادثة قبل إرساله إلى النموذج
      const userMessage = { role: 'user', parts: [{ text: userPrompt }] };

      // بناء تعليمات النظام (system instruction) ديناميكيًا
      const systemInstructionParts = [];
      const baseSystemInstruction = Config.get('BASE_SYSTEM_INSTRUCTION');
      if (baseSystemInstruction) {
        systemInstructionParts.push({ text: baseSystemInstruction });
      }
      if (longTermContext && longTermContext.length > 0) {
        systemInstructionParts.push({ text: "\nمعلومات إضافية ذات صلة من ذاكرتي:" });
        longTermContext.forEach(item => {
          const dataToLog = typeof item.data === 'object' && item.data !== null ? JSON.stringify(item.data) : String(item.data);
          systemInstructionParts.push({ text: `- ${item.category}: ${dataToLog}` });
        });
      }
      const systemInstruction = systemInstructionParts.length > 0 ? { parts: systemInstructionParts } : undefined;

      // 2) تكوين الحمولة (payload) لاستدعاء Gemini API
      const cfg = Config.getAll();
      const apiKey = cfg.API_KEY;
      if (!apiKey) {
        currentStatus = 'missing_api_key';
        throw new Error('API_KEY is not defined in Config.');
      }

      const generationConfig = {
        ...cfg.GENERATION_CONFIG,
        ...options.generationConfig
      };

      const toolsAvailable = options.toolsEnabled !== false ? Tools.Catalog.getAllTools() : [];
      const toolConfig = toolsAvailable.length > 0 ? { functionCallingConfig: { mode: 'AUTO' } } : undefined;

      const payload = {
        contents: [...sessionHistory, userMessage],
        systemInstruction: systemInstruction,
        tools: toolsAvailable.length > 0 ? [{ functionDeclarations: toolsAvailable }] : undefined,
        generationConfig: generationConfig,
        safetySettings: options.safetySettings || Config.get('SAFETY_SETTINGS'), // دمج إعدادات الأمان
        toolConfig: toolConfig,
        thinkingConfig: options.thinkingConfig // ✅ مضاف: تمرير thinkingConfig من الخيارات
      };

      Utils.log('AI.Core.ask: Sending request payload to GeminiAdapter.', { model: modelUsed, payloadSummary: { contentsCount: payload.contents.length, toolsCount: toolsAvailable.length } });
      currentStatus = 'api_call';

      // 3) استدعاء Gemini API عبر GeminiAdapter مع آلية إعادة المحاولة
      const apiResponse = _retryApiCall(AI.GeminiAdapter.callGeminiApi, [{ model: modelUsed, payload: payload }]);

      // 4) توجيه الرد عبر Dispatcher
      currentStatus = 'dispatching_response';
      let finalResponse = AI.Dispatcher.processApiResponse({ apiResponse: apiResponse });

      // 5) سجل الرسائل في الذاكرة (سواء كانت نصًا أو أداة)
      AI.Memory.addMessageToHistory({ sessionId: sessionId, message: userMessage }); // إضافة رسالة المستخدم

      let modelMsg;
      if (finalResponse.type === 'tool_execution_requested' && finalResponse.suggestedToolCalls) {
        // إذا كان الرد هو طلب تنفيذ أداة، نسجل الـ functionCall في الذاكرة
        modelMsg = { role: 'model', parts: finalResponse.suggestedToolCalls.map(call => ({ functionCall: call })) };
      } else if (finalResponse.type === 'tool_execution_result' && finalResponse.toolExecutionResults) {
        // إذا كان الرد هو نتيجة تنفيذ أداة، نسجل الـ functionResponse في الذاكرة
        modelMsg = { role: 'tool', parts: finalResponse.toolExecutionResults.map(res => ({ functionResponse: { name: res.functionCall.name, response: res.result } })) };
      }
      else {
        // رسالة نصية أو خطأ أو تحذير
        modelMsg = {
          role: 'model',
          parts: [{ text: finalResponse.text, type: finalResponse.type }]
        };
      }
      AI.Memory.addMessageToHistory({ sessionId, message: modelMsg });

      const duration = Date.now() - start;
      currentStatus = finalResponse.type;
      _recordInvocation('ask', currentStatus, duration, {
        model: modelUsed,
        promptLength: userPrompt.length,
        responseLength: finalResponse.text ? finalResponse.text.length : (finalResponse.data ? JSON.stringify(finalResponse.data).length : 0)
      });
      Utils.log(`AI.Core.ask: Finished for session '${sessionId}'. Type: ${finalResponse.type}, Duration: ${duration}ms.`);

      return finalResponse;

    } catch (e) {
      const duration = Date.now() - start;
      const errorMessage = e.message;
      Utils.error(`AI.Core.ask: Unexpected error for session '${sessionId}': ${errorMessage}`, e.stack);
      currentStatus = 'exception';
      _recordInvocation('ask', currentStatus, duration, { model: modelUsed, errorMessage: errorMessage, stack: e.stack, promptLength: userPrompt.length });
      return _createUiResponse('error', `💥 خطأ داخلي في نظام الذكاء الاصطناعي: ${errorMessage}`);
    }
  }

  /**
   * ✅ دالة جديدة: توليد JSON عبر Gemini.
   * @param {{ userPrompt: string, sessionId?: string, options?: object }} args
   * @returns {UiResponse} - كائن UiResponse يحتوي على البيانات المحللة كـ JSON أو خطأ.
   */
  function askJSON({ userPrompt, sessionId, options = {} }) {
    const start = Date.now();
    let currentStatus = 'initial';
    const modelUsed = options.modelOverride || Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-pro';

    try {
      const fullOptions = {
        ...options,
        structuredOutputRequested: true, // فرض طلب إخراج منظم
        generationConfig: {
          ...(options.generationConfig || {}),
          responseMimeType: 'application/json' // فرض نوع الرد JSON
        },
        toolsEnabled: false, // تعطيل الأدوات عند طلب JSON منظم
        thinkingConfig: options.thinkingConfig // ✅ مضاف: تمرير thinkingConfig
      };

      // نستخدم ask الأساسية، التي ستتعامل مع السياق وإعادة المحاولة والاتصال بـ Adapter
      const result = ask(userPrompt, { sessionId, ...fullOptions });

      // ✅ تسجيل النجاح هنا، قبل تحليل الـ JSON
      if (result.type === 'info' || result.type === 'success' || result.type === 'text_response') {
        currentStatus = 'success_api_call'; // تم استلام رد ناجح من API
      } else {
        currentStatus = 'api_response_error'; // رد API غير متوقع
        throw new Error(`Expected info/success/text_response from ask() for JSON parsing, but got: ${result.type}. Text: ${result.text || 'N/A'}`);
      }

      const jsonText = result.text || (result.data ? JSON.stringify(result.data) : ''); // قد يكون الرد نصًا أو بيانات مباشرة
      if (!jsonText) {
        currentStatus = 'empty_json_response';
        throw new Error('Gemini returned an empty response for JSON parsing.');
      }

      try {
        // إزالة أي أكواد Markdown محتملة قبل التحليل
        const cleanedJsonText = jsonText.replace(/```json\s*|\s*```/g, '').trim();
        const parsedJson = JSON.parse(cleanedJsonText);
        currentStatus = 'success_json_parse'; // تم تحليل JSON بنجاح
        const duration = Date.now() - start;
        _recordInvocation('askJSON', currentStatus, duration, {
          model: modelUsed,
          promptLength: userPrompt.length,
          responseLength: jsonText.length
        });
        return _createUiResponse('success', 'JSON response successfully parsed.', parsedJson);
      } catch (e) {
        currentStatus = 'json_parse_error';
        Utils.error(`AI.Core.askJSON: Failed to parse JSON response: ${e.message}. Raw: ${jsonText}`, e.stack);
        const duration = Date.now() - start;
        _recordInvocation('askJSON', currentStatus, duration, {
          model: modelUsed,
          promptLength: userPrompt.length,
          errorMessage: e.message,
          stack: e.stack,
          responseLength: jsonText.length
        });
        throw new Error(`Failed to parse JSON response: ${e.message}. Raw response: ${jsonText.substring(0, 200)}...`);
      }
    } catch (e) {
      const duration = Date.now() - start;
      const errorMessage = e.message;
      // إذا لم يتم تسجيلها بالفعل في try/catch الداخلي
      if (currentStatus === 'initial') currentStatus = 'exception';
      _recordInvocation('askJSON', currentStatus, duration, {
        model: modelUsed,
        promptLength: userPrompt.length,
        errorMessage: errorMessage,
        stack: e.stack
      });
      return _createUiResponse('error', `💥 خطأ في توليد JSON: ${errorMessage}`);
    }
  }

  /**
   * ✅ دالة جديدة: تحليل كود بواسطة Gemini.
   * @param {{ userQuery: string, codeSnippet?: string, projectContext: object, sessionId?: string }} args
   * @returns {UiResponse} - كائن UiResponse يحتوي على تحليل الكود، اقتراحات الكود، أو الأخطاء.
   */
  function askForCodeAnalysis({ userQuery, codeSnippet, projectContext, sessionId }) {
    const start = Date.now();
    let currentStatus = 'initial';
    const modelUsed = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-pro'; // يمكن استخدام نموذج متخصص للكود

    try {
      _validatePromptAndOptions(userQuery, {}); // التحقق الأولي

      // بناء الـ Prompt الشامل والمفصل لـ Gemini
      const fullPrompt = `أنت مساعد خبير في Google Apps Script وJavaScript؛ مهمتك دعم المبرمجين بشكل استباقي وذكي.
هذا سياق المشروع:
${projectContext.projectDescription ? `وصف المشروع: ${projectContext.projectDescription}\n` : ''}
ملفات المشروع الحالية: ${projectContext.existingFiles
  ? JSON.stringify(projectContext.existingFiles)
  : 'لا توجد ملفات محددة.'}
الدوال والمسارات الموجودة (GAssistant.*, System.*…): ${projectContext.existingFunctions
  ? JSON.stringify(projectContext.existingFunctions)
  : 'لا توجد دوال محددة.'}

طلب المبرمج: "${userQuery}"

${codeSnippet
  ? `الكود الذي يركّز عليه المبرمج:
\`\`\`javascript
${codeSnippet}
\`\`\``
  : ''}

استنادًا إلى هذا السياق وطلب المبرمج، يرجى:
1. تحليل وتصحيح: إذا كان الطلب يتعلق بتصحيح خطأ أو مراجعة كود، قم بتحليل الكود المقدم أو السياق، واشرح الخطأ بوضوح، وقدم الحل أو التصحيح المقترح.
2. اقتراح وتطوير دوال جديدة: إذا كان الطلب يقضي بإضافة ميزة أو وظيفة جديدة (مثل "أريد دالة لإنشاء تقرير شهري")، اقترح دالة كاملة أو مجموعة دوال مع كود جاهز للاستخدام.
   • تأكد من أن الكود المقترح يتبع أفضل ممارسات Google Apps Script وJavaScript.
   • ضع الكود داخل كتلة:
     \`\`\`javascript
     // الكود هنا
     \`\`\`
   • اقترح مكانًا منطقيًا لوضع الدالة (مثل \`GAssistant.Tools.Spreadsheet\` أو \`System.FinancialReports\`).
3. اقتراح وحدات أو دوال ناقصة بشكل استباقي: بناءً على السياق، هل هناك دوال أو وحدات أساسية ناقصة يحتاجها المشروع؟ (مثلاً: دالة لتنسيق التاريخ أو وحدة لإدارة الأذونات).
4. التحقق من التوافق وتجنّب التعارض: تأكد أن الكود المقترح لا يتعارض مع ما في \`projectContext\`. إذا وُجد تشابه، اقترح تعديل الدالة القائمة بدلاً من إنشاء دالة جديدة.
5. الشرح والتوضيح: اشرح أسباب اقتراحاتك، وكيفية استخدام الكود الجديد، وأي اعتبارات تتعلّق بالأداء أو الأمان.
6. تحديد النية الفرعية: يمكنك الإشارة إلى النية التي فهمتها (مثلاً: "فهمت أن نيتك هي: توليد كود").

تذكّر أن هدفك تمكين المبرمج من التركيز على المنطق العام، بينما توفر أنت اللبنات البرمجية اللازمة له.`;

      // استدعاء ask الأساسية مع prompt المخصص وخيارات محددة
      const result = ask(fullPrompt, {
        sessionId: sessionId,
        modelOverride: modelUsed,
        generationConfig: { temperature: 0.8, maxOutputTokens: 8192 }, // زيادة درجة الحرارة والرموز لمزيد من الإبداع والكود الطويل
        toolsEnabled: false, // عادة لا نحتاج أدوات في تحليل الكود إلا إذا كانت أدوات وهمية للبرمجة
        thinkingConfig: options.thinkingConfig // ✅ مضاف: تمرير thinkingConfig
      });

      if (result.type === 'info' || result.type === 'text_response') {
        // تحليل الاستجابة المعقدة من Gemini
        const codeBlocks = Utils.extractCodeBlocks(result.text, 'javascript'); // تفترض وجود دالة Utils.extractCodeBlocks
        const cleanedText = Utils.removeCodeBlocks(result.text, 'javascript'); // تفترض وجود دالة Utils.removeCodeBlocks

        currentStatus = 'success_code_analysis';
        const duration = Date.now() - start;
        _recordInvocation('askForCodeAnalysis', currentStatus, duration, {
          model: modelUsed,
          promptLength: userQuery.length,
          responseLength: result.text.length
        });
        return _createUiResponse('code_analysis_result', cleanedText.trim(), {
          originalQuery: userQuery,
          suggestedCode: codeBlocks.length > 0 ? codeBlocks : null,
          // يمكن إضافة تحليل إضافي هنا لاكتشاف "اقتراح دوال ناقصة" من النص نفسه
        });
      } else if (result.type === 'tool_call') {
        // إذا اقترح Gemini استدعاء أداة (غير متوقع عادة في هذا السيناريو ما لم تُعطَ له أدوات محددة للبرمجة)
        currentStatus = 'tool_call_suggestion';
        const duration = Date.now() - start;
        _recordInvocation('askForCodeAnalysis', currentStatus, duration, {
          model: modelUsed,
          promptLength: userQuery.length,
          responseLength: result.text ? result.text.length : (result.data ? JSON.stringify(result.data).length : 0)
        });
        return _createUiResponse('tool_call_suggestion', 'Gemini suggested a tool call during code analysis.', {
          originalQuery: userQuery,
          suggestedFunctionCall: result.data
        });
      } else {
        currentStatus = 'unexpected_response_type';
        const duration = Date.now() - start;
        _recordInvocation('askForCodeAnalysis', currentStatus, duration, {
          model: modelUsed,
          promptLength: userQuery.length,
          errorMessage: `Unexpected response type: ${result.type}`,
          responseLength: result.text ? result.text.length : (result.data ? JSON.stringify(result.data).length : 0)
        });
        throw new Error(`Received an unexpected response type from Gemini: ${result.type}. Text: ${result.text || 'N/A'}`);
      }
    } catch (e) {
      const duration = Date.now() - start;
      const errorMessage = e.message;
      // إذا لم يتم تسجيلها بالفعل في try/catch الداخلي
      if (currentStatus === 'initial') currentStatus = 'exception';
      _recordInvocation('askForCodeAnalysis', currentStatus, duration, {
        model: modelUsed,
        promptLength: userQuery.length,
        errorMessage: errorMessage,
        stack: e.stack
      });
      return _createUiResponse('error', `💥 خطأ في تحليل الكود: ${errorMessage}`);
    }
  }

  const exports = {
    ask,
    askJSON,
    askForCodeAnalysis,
    MODULE_VERSION // Expose version for parent module
  };

  // Register this submodule with the main System.AI module
  // This allows System.AI to act as a facade.
  if (AI && AI.registerSubModule) {
    AI.registerSubModule('Core', exports);
  }

  return exports;
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/4_ai_core.gs ---
// *************************************************************************************************
