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

defineModule('System.AI.Core', ({ 
  Utils, 
  Dialogue, 
  Config, 
  AI, 
  Tools, 
  DocsManager, 
  Telemetry,
  MetricsLogger,
  ModuleVerifier,
  Orchestrator,
  JsonQuery
}) => {
  // ✅ تفعيل فحص مسبق: التحقق من جاهزية الوحدات الأساسية قبل المتابعة
  if (!ModuleVerifier?.checkReady('Config', ['get', 'getAll'])) {
    Telemetry?.logError("❌ AI.Core: وحدة 'Config' غير جاهزة. تم إيقاف التهيئة.");
    return { ask: () => Dialogue.createError('فشل تهيئة AI.Core: وحدة الإعدادات مفقودة.') };
  }
  if (!ModuleVerifier?.checkReady('AI', ['Memory', 'Dispatcher', 'GeminiAdapter', 'ToolExecutor'])) {
    Telemetry?.logError("❌ AI.Core: الوحدات الفرعية لـ 'AI' غير جاهزة. تم إيقاف التهيئة.");
    return { ask: () => Dialogue.createError('فشل تهيئة AI.Core: وحدات AI الفرعية مفقودة.') };
  }
  if (!ModuleVerifier?.checkReady('Tools', ['Catalog'])) {
    Telemetry?.logError("❌ AI.Core: وحدة 'Tools.Catalog' غير جاهزة. تم إيقاف التهيئة.");
    return { ask: () => Dialogue.createError('فشل تهيئة AI.Core: كتالوج الأدوات مفقود.') };
  }
  if (!ModuleVerifier?.checkReady('Orchestrator', ['execute'])) {
    Telemetry?.logError("❌ AI.Core: وحدة 'Orchestrator' غير جاهزة. تم إيقاف التهيئة.");
    return { ask: () => Dialogue.createError('فشل تهيئة AI.Core: محرك التنفيذ مفقود.') };
  }
  if (!ModuleVerifier?.checkReady('JsonQuery', ['ask'])) {
    Telemetry?.logError("❌ AI.Core: وحدة 'JsonQuery' غير جاهزة. تم إيقاف التهيئة.");
    // لا نوقف النظام بالكامل، ولكن وظيفة askJSON لن تعمل
  }

  const MODULE_VERSION   = Config.get('AI_CORE_VERSION')    || '1.3.1';
  // تم نقل الثوابت المتعلقة بالتنفيذ إلى Orchestrator



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

  /**
   * يسجل استدعاءات AI.Core في LTM، Telemetry، وورقة المقاييس.
   * @param {string} action - نوع الإجراء ('ask', 'askJSON', 'askForCodeAnalysis').
   * @param {string} status - حالة العملية ('success_text', 'success_tool', 'error_api', 'exception', etc.).
   * @param {number} durationMs - مدة العملية بالمللي ثانية.
   * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
   * @private
   */
  function _recordInvocation(action, status, durationMs, meta = {}) {
    MetricsLogger.record({
      module: 'AI.Core',
      action: action,
      version: MODULE_VERSION,
      status: status,
      durationMs: durationMs,
      sheetName: 'AI_Core_Metrics',
      sheetHeaders: ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'Model', 'PromptLength', 'ResponseLength', 'Error'],
      sheetRow: [
        new Date(),
        action,
        status,
        durationMs,
        MODULE_VERSION,
        meta.model || 'N/A',
        meta.promptLength || 0,
        meta.responseLength || 0,
        meta.errorMessage || ''
      ],
      meta: meta
    });
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
   * الدالة الأساسية للتفاعل مع نموذج Gemini.
   * @param {string} userPrompt - نصّ الأمر أو السؤال من المستخدم.
   * @param {object} [options={}] - خيارات إضافية للتحكم في سلوك النموذج.
   * @returns {UiResponse}
   */
  function ask(userPrompt, options = {}) {
    const start = Date.now();
    // تفويض التنفيذ الفعلي إلى Orchestrator
    const result = Orchestrator.execute(userPrompt, options);
    const duration = Date.now() - start;
    // التسجيل هنا يركز على استدعاء الواجهة، بينما يسجل Orchestrator تفاصيل التنفيذ
    _recordInvocation('ask', result.type, duration, { promptLength: userPrompt.length });
    return result;
  }

  /**
   * ✅ دالة جديدة: توليد JSON عبر Gemini.
   * @param {{ userPrompt: string, sessionId?: string, options?: object }} args
   * @returns {UiResponse} - كائن UiResponse يحتوي على البيانات المحللة كـ JSON أو خطأ.
   */
  function askJSON({ userPrompt, sessionId, options = {} }) {
    // تفويض التنفيذ الفعلي إلى وحدة JsonQuery المتخصصة
    return JsonQuery.ask({ userPrompt, sessionId, options });
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
