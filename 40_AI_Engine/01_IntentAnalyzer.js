// *************************************************************************************************
// --- START OF FILE: 20_ai/3_intentAnalyzer.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/3_intentAnalyzer.gs
 * @module System.AI.IntentAnalyzer
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * وحدة تحليل نية المستخدم. تتبنى نهجًا هجينًا:
 * 1.  **المسار السريع (Regex):** تستخدم تعبيرات نمطية للأوامر الواضحة والمباشرة لتوفير استجابة سريعة.
 * 2.  **المسار الذكي (AI):** عند فشل المسار السريع، تستدعي نموذج Gemini لتحليل اللغة الطبيعية المعقدة وتحديد النية والأداة المناسبة.
 */

'use strict';

defineModule('System.AI.IntentAnalyzer', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
  const MODULE_VERSION = Config.get('AI_INTENT_ANALYZER_VERSION') || '2.0.0';
  const METRICS_SHEET = 'AI_IntentAnalyzer_Metrics';

  // تعريف النوايا القائمة على القواعد (Regex)
  // هذه النوايا هي لـ "المعالجة السريعة" التي لا تتطلب استدعاء LLM
  const INTENTS_RULES = {
    // نوايا عامة للنظام
    CLEAR_MEMORY: /(مسح الذاكرة|إعادة تعيين الذاكرة|امسح ذاكرتي)/i,
    GET_VERSION: /(ما هو إصدارك|معلومات عنك|إصدارك|نسختك)/i,

    // نوايا خاصة بالمطور (توجيه لـ Tools.Developer)
    CODE_REVIEW: /(راجع الكود|مراجعة الكود|فحص الكود)/i,
    GENERATE_CODE: /(إنشاء كود|توليد كود|اكتب كود|اكتب لي دالة)/i,
    REFACTOR_CODE: /(إعادة هيكلة الكود|تحسين الكود|هيكل الكود)/i,
    ADD_COMMENTS: /(أضف تعليقات|تعليق على الكود)/i,
    EXPLAIN_CODE: /(اشرح الكود|شرح الكود|كيف يعمل هذا الكود)/i,
    LIST_FILES: /(عرض الملفات|قائمة الملفات|أظهر لي الملفات)/i,
    RUN_FUNCTION: /(تشغيل الدالة|نفذ الدالة|استدعي الدالة)\s+([a-zA-Z0-9_.]+)/i, // يتطلب استخراج اسم الدالة
    // يمكن إضافة المزيد من القواعد هنا
  };

  // مرحلة 9: تسجيل وثائق الوحدة
  DocsManager.registerModuleDocs('System.AI.IntentAnalyzer', [
    {
      name: 'detectIntent',
      version: MODULE_VERSION, // Updated version
      description: 'يحلل استعلام المستخدم لتحديد النية (مثل طلب أداة مباشرة أو استعلام عام).',
      parameters: {
        type: 'OBJECT',
        properties: {
          userPrompt: { type: 'STRING', description: 'نص استعلام المستخدم.', required: true }
        },
        required: ['userPrompt']
      },
      returns: {
        type: 'OBJECT',
        description: 'كائن يصف النية المكتشفة: { type: string, toolName?: string, args?: object, originalPrompt: string }.',
        properties: {
          type: { type: 'STRING', enum: ['tool_call', 'general_query', 'clarification_needed'], description: 'نوع النية المكتشفة.' },
          toolName: { type: 'STRING', description: 'اسم الأداة المقترحة (إذا كانت النية tool_call).', optional: true },
          args: { type: 'OBJECT', description: 'الوسائط المستخرجة للأداة.', optional: true },
          originalPrompt: { type: 'STRING', description: 'استعلام المستخدم الأصلي.' }
        }
      }
    }
  ]);

  /**
   * يسجل استدعاءات IntentAnalyzer في LTM، Telemetry، وورقة المقاييس.
   * @param {string} action - نوع الإجراء ('detectIntent').
   * @param {string} status - حالة العملية ('success', 'no_match', 'exception', 'tool_call').
   * @param {number} durationMs - مدة العملية بالمللي ثانية.
   * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
   * @private
   */
  function _recordInvocation(action, status, durationMs, meta = {}) {
    const ts = new Date().toISOString();
    const recordData = {
      module: 'AI.IntentAnalyzer',
      function: action,
      version: MODULE_VERSION,
      timestamp: ts,
      status,
      durationMs,
      ...meta
    };

    // مرحلة 10: حفظ في LongTermMemory
    AI.LongTermMemory.save('IntentAnalyzerInvocation', recordData);

    // مرحلة 11: إرسال Telemetry
    Telemetry.track('AI.IntentAnalyzer.Invocation', recordData);

    // مرحلة 17: تسجيل مقاييس التشغيل في ورقة AI_IntentAnalyzer_Metrics
    const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'PromptLength', 'DetectedIntentType', 'DetectedToolName']);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        action,
        status,
        durationMs,
        MODULE_VERSION,
        meta.promptLength || 0,
        meta.detectedIntentType || 'N/A',
        meta.detectedToolName || 'N/A'
      ]);
    } else {
      Utils.warn(`AI.IntentAnalyzer._recordInvocation: Failed to get sheet '${METRICS_SHEET}'. Metrics not recorded.`);
    }
  }

  /**
   * مرحلة 6: تحقق من صحة المدخلات.
   * @param {string} userPrompt - نص استعلام المستخدم.
   * @throws {Error} إذا كانت المدخلات غير صالحة.
   * @private
   */
  function _validateInputs(userPrompt) {
    if (typeof userPrompt !== 'string' || !userPrompt.trim()) {
      throw new Error('AI.IntentAnalyzer.detectIntent: userPrompt must be a non-empty string.');
    }
  }

  function _detectIntentWithRegex({ userPrompt }) {
    const lowerCasePrompt = userPrompt.toLowerCase();
    for (const [intentType, pattern] of Object.entries(INTENTS_RULES)) {
      const match = lowerCasePrompt.match(pattern);
      if (match) {
        let detectedIntent = { type: 'general_query', originalPrompt: userPrompt };
        switch (intentType) {
          case 'CLEAR_MEMORY': detectedIntent = { type: 'tool_call', toolName: 'AI.Memory.clearSessionContext', args: {}, originalPrompt: userPrompt }; break;
          case 'GET_VERSION': detectedIntent = { type: 'tool_call', toolName: 'System.Info.getVersion', args: {}, originalPrompt: userPrompt }; break;
          case 'CODE_REVIEW': detectedIntent = { type: 'tool_call', toolName: 'Developer.reviewCode', args: { originalQuery: userPrompt }, originalPrompt: userPrompt }; break;
          case 'GENERATE_CODE': detectedIntent = { type: 'tool_call', toolName: 'Developer.generateCode', args: { description: userPrompt }, originalPrompt: userPrompt }; break;
          case 'REFACTOR_CODE': detectedIntent = { type: 'tool_call', toolName: 'Developer.refactorCode', args: { request: userPrompt }, originalPrompt: userPrompt }; break;
          case 'ADD_COMMENTS': detectedIntent = { type: 'tool_call', toolName: 'Developer.addCommentsToCode', args: { request: userPrompt }, originalPrompt: userPrompt }; break;
          case 'EXPLAIN_CODE': detectedIntent = { type: 'tool_call', toolName: 'Developer.explainCode', args: { request: userPrompt }, originalPrompt: userPrompt }; break;
          case 'LIST_FILES': detectedIntent = { type: 'tool_call', toolName: 'Developer.listFiles', args: {}, originalPrompt: userPrompt }; break;
          case 'RUN_FUNCTION':
            const funcNameMatch = match[2]; let funcArgs = {};
            const argsMatch = userPrompt.match(/\(([^)]*)\)/);
            if (argsMatch && argsMatch[1]) {
              try { funcArgs = JSON.parse(`{${argsMatch[1]}}`); }
              catch (e) { Utils.warn(`AI.IntentAnalyzer: Failed to parse args for ${funcNameMatch}: ${argsMatch[1]}`, { errorObj: e }); return { intent: { type: 'clarification_needed', originalPrompt: userPrompt, errorMessage: `Failed to parse arguments for function '${funcNameMatch}'. Please provide arguments in valid JSON format.` }, status: 'clarification_needed' }; }
            }
            detectedIntent = { type: 'tool_call', toolName: `Developer.runFunction`, args: { functionName: funcNameMatch, ...funcArgs }, originalPrompt: userPrompt }; break;
        }
        if (detectedIntent.type !== 'general_query') {
          return { intent: detectedIntent, status: 'regex_match' };
        }
      }
    }
    return null;
  }

  function _detectIntentWithAI({ userPrompt, sessionId }) {
    const start = Date.now();
    let status = 'ai_invoked';
    try {
      const toolDeclarations = Tools.Catalog.getDeclarations();
      if (!toolDeclarations || toolDeclarations.length === 0) {
        Utils.warn('IntentAnalyzer (AI): No tools found in catalog. Skipping AI-based detection.');
        return { type: 'general_query', originalPrompt: userPrompt };
      }

      const prompt = `
أنت محلل نوايا خبير في نظام G-Assistant. مهمتك هي تحليل طلب المستخدم وتحديد ما إذا كان يتطابق مع إحدى الأدوات المتاحة.

الأدوات المتاحة (بصيغة JSON Schema):
${JSON.stringify(toolDeclarations, null, 2)}

طلب المستخدم:
"${userPrompt}"

بناءً على طلب المستخدم، حدد نيته.
أجب بكائن JSON فقط بأحد التنسيقات التالية:

1. إذا كان الطلب يتطابق مباشرة مع أداة:
   {
     "type": "tool_call",
     "toolName": "الاسم الكامل للأداة، مثال: Developer.reviewCode",
     "args": { /* كائن يحتوي على الوسائط المستخرجة من طلب المستخدم، متطابقة مع مخطط الأداة */ }
   }

2. إذا كان الطلب لا يتطابق بوضوح مع أي أداة ويبدو أنه سؤال عام أو محادثة:
   {
     "type": "general_query"
   }

3. إذا كان الطلب غامضًا وتحتاج إلى مزيد من المعلومات:
   {
     "type": "clarification_needed",
     "question": "السؤال الذي يجب طرحه على المستخدم للتوضيح."
   }

قدم كائن JSON فقط في ردك.`;

      const aiResponse = AI.Core.askJSON({ userPrompt: prompt, sessionId });

      if (aiResponse.type === 'success' && aiResponse.data) {
        const intentData = aiResponse.data;
        if (intentData.type && ['tool_call', 'general_query', 'clarification_needed'].includes(intentData.type)) {
          status = `ai_success_${intentData.type}`;
          Utils.log(`IntentAnalyzer (AI): Detected intent: ${intentData.type}`, { tool: intentData.toolName });
          return { ...intentData, originalPrompt: userPrompt };
        }
      }
      status = 'ai_failed_parse';
      Utils.warn('IntentAnalyzer (AI): Failed to get a valid structured intent from AI.', { response: aiResponse });
      return { type: 'general_query', originalPrompt: userPrompt };
    } catch (e) {
      status = 'ai_exception';
      Utils.error('IntentAnalyzer (AI): Exception during AI-based intent detection.', { errorObj: e });
      return { type: 'general_query', originalPrompt: userPrompt };
    } finally {
      _recordInvocation('detectIntentWithAI', status, Date.now() - start, { promptLength: userPrompt.length });
    }
  }

  function detectIntent({ userPrompt, sessionId }) {
    const start = Date.now();
    let status = 'initial';
    let detectedIntent = { type: 'general_query', originalPrompt: userPrompt };

    try {
      _validateInputs(userPrompt);
      Utils.log(`AI.IntentAnalyzer: Detecting intent for prompt: '${userPrompt.substring(0, 50)}...'`);

      // 1. المسار السريع (Regex)
      const regexResult = _detectIntentWithRegex({ userPrompt });
      if (regexResult) {
        Utils.log('IntentAnalyzer: Intent detected via Regex (Fast Path).');
        status = regexResult.status;
        detectedIntent = regexResult.intent;
        return detectedIntent;
      }

      // 2. المسار الذكي (AI) - إذا فشل المسار السريع
      Utils.log('IntentAnalyzer: No Regex match. Falling back to AI (Smart Path).');
      const aiResult = _detectIntentWithAI({ userPrompt, sessionId });
      status = aiResult.type; // e.g., 'tool_call', 'general_query'
      detectedIntent = aiResult;
      return detectedIntent;
    } catch (e) {
      status = 'exception';
      Utils.error(`AI.IntentAnalyzer.detectIntent: An error occurred: ${e.message}`, { errorObj: e });
      detectedIntent = { type: 'clarification_needed', originalPrompt: userPrompt, errorMessage: e.message };
      return detectedIntent;
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('detectIntent', status, duration, {
        promptLength: userPrompt.length,
        detectedIntentType: detectedIntent.type,
        detectedToolName: detectedIntent.toolName || 'N/A'
      });
    }
  }

  return {
    detectIntent
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/3_intentAnalyzer.gs ---
// *************************************************************************************************
