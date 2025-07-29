// *************************************************************************************************
// --- START OF FILE: 20_ai/3_intentAnalyzer.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/3_intentAnalyzer.gs
 * @module System.AI.IntentAnalyzer
 * @version 1.1.0 // ✅ تحديث الإصدار للدلالة على الدمج والتحسينات
 * @author عبدالعزيز
 * @description
 * وحدة تحليل نية المستخدم: تقوم بمعالجة استعلام المستخدم لتحديد النية الكامنة
 * وتوجيهها إلى الإجراءات المناسبة (مثل استدعاء أداة مباشرة أو توجيه لـ AI.Core).
 * تركز على النوايا الواضحة والمباشرة لتجنب المعالجة الزائدة بواسطة النموذج الرئيسي.
 * المراحل المعمارية المطبقة:
 * • 1   defineModule وربط التبعيات
 * • 6   تحقق من صحة المدخلات
 * • 9   تسجيل الوثائق في DocsManager
 * • 10  حفظ الاستدعاءات في LongTermMemory
 * • 11  إرسال Telemetry لكل استدعاء
 * • 17  تسجيل مقاييس التشغيل في ورقة AI_IntentAnalyzer_Metrics
 * • 18  تضمين رقم الإصدار من Config
 */

'use strict';

defineModule('System.AI.IntentAnalyzer', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
  const MODULE_VERSION = Config.get('AI_INTENT_ANALYZER_VERSION') || '1.1.0';
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
      version: MODULE_VERSION,
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

  /**
   * يحلل استعلام المستخدم لتحديد النية الكامنة.
   * يستخدم قواعد بسيطة (كلمات مفتاحية وتعابير منتظمة) لتحديد النوايا المباشرة.
   * إذا لم يتم العثور على نية مباشرة، يتم إرجاع 'general_query'.
   * @param {{ userPrompt: string }} args - كائن يحتوي على استعلام المستخدم.
   * @returns {{ type: string, toolName?: string, args?: object, originalPrompt: string }} - كائن يصف النية المكتشفة.
   */
  function detectIntent({ userPrompt }) {
    const start = Date.now();
    let status = 'no_match';
    let detectedIntent = { type: 'general_query', originalPrompt: userPrompt }; // الافتراضي: استعلام عام
    const lowerCasePrompt = userPrompt.toLowerCase();

    try {
      _validateInputs(userPrompt);
      Utils.log(`AI.IntentAnalyzer: Detecting intent for prompt: '${userPrompt.substring(0, 50)}...'`);

      // 1. تطبيق قواعد النوايا المحددة
      for (const [intentType, pattern] of Object.entries(INTENTS_RULES)) {
        const match = lowerCasePrompt.match(pattern);
        if (match) {
          status = 'tool_call'; // تم اكتشاف نية أداة مباشرة
          switch (intentType) {
            case 'CLEAR_MEMORY':
              detectedIntent = { type: 'tool_call', toolName: 'AI.Memory.clearSessionContext', args: {}, originalPrompt: userPrompt };
              break;
            case 'GET_VERSION':
              detectedIntent = { type: 'tool_call', toolName: 'System.Info.getVersion', args: {}, originalPrompt: userPrompt };
              break;
            case 'CODE_REVIEW':
              detectedIntent = { type: 'tool_call', toolName: 'Developer.reviewCode', args: { originalQuery: userPrompt }, originalPrompt: userPrompt };
              break;
            case 'GENERATE_CODE':
              detectedIntent = { type: 'tool_call', toolName: 'Developer.generateCode', args: { description: userPrompt }, originalPrompt: userPrompt };
              break;
            case 'REFACTOR_CODE':
              detectedIntent = { type: 'tool_call', toolName: 'Developer.refactorCode', args: { request: userPrompt }, originalPrompt: userPrompt };
              break;
            case 'ADD_COMMENTS':
              detectedIntent = { type: 'tool_call', toolName: 'Developer.addCommentsToCode', args: { request: userPrompt }, originalPrompt: userPrompt };
              break;
            case 'EXPLAIN_CODE':
              detectedIntent = { type: 'tool_call', toolName: 'Developer.explainCode', args: { request: userPrompt }, originalPrompt: userPrompt };
              break;
            case 'LIST_FILES':
              detectedIntent = { type: 'tool_call', toolName: 'Developer.listFiles', args: {}, originalPrompt: userPrompt };
              break;
            case 'RUN_FUNCTION':
              const funcNameMatch = match[2]; // الجزء الثاني من الـ regex هو اسم الدالة
              let funcArgs = {};
              // محاولة استخراج الوسائط إذا كانت موجودة (مثلاً: "تشغيل الدالة myFunc(arg1: 'value')")
              const argsMatch = userPrompt.match(/\(([^)]*)\)/);
              if (argsMatch && argsMatch[1]) {
                try {
                  // محاولة تحليل الوسائط كـ JSON (يتطلب تنسيقًا دقيقًا مثل "key: 'value'")
                  // قد تحتاج إلى معالجة أكثر تعقيدًا هنا أو استخدام LLM لتحليل الوسائط المعقدة
                  funcArgs = JSON.parse(`{${argsMatch[1]}}`);
                } catch (e) {
                  Utils.warn(`AI.IntentAnalyzer: Failed to parse args for function '${funcNameMatch}': ${argsMatch[1]}`, e);
                  // إذا فشل تحليل الوسائط، يمكننا إرجاع نية 'clarification_needed'
                  detectedIntent = { type: 'clarification_needed', originalPrompt: userPrompt, errorMessage: `Failed to parse arguments for function '${funcNameMatch}'. Please provide arguments in valid JSON format.` };
                  status = 'clarification_needed';
                  break; // الخروج من الـ switch والانتقال إلى finally
                }
              }
              detectedIntent = { type: 'tool_call', toolName: `Developer.runFunction`, args: { functionName: funcNameMatch, ...funcArgs }, originalPrompt: userPrompt };
              break;
            default:
              // إذا تم اكتشاف نمط ولكن لم يتم التعامل معه في الـ switch
              status = 'unhandled_tool_intent';
              detectedIntent = { type: 'general_query', originalPrompt: userPrompt }; // العودة إلى استعلام عام
              break;
          }
          // بمجرد العثور على نية، نخرج من الحلقة
          if (detectedIntent.type !== 'general_query' && detectedIntent.type !== 'clarification_needed') {
            break;
          }
        }
      }

      // ملاحظة: التحقق من وجود الأداة في Tools.Catalog يجب أن يتم في AI.Core
      // لأن AI.Core هو المسؤول عن تنفيذ الأدوات ولديه الوصول الكامل إلى Tools.Catalog.
      // IntentAnalyzer هنا يركز فقط على "الكشف" الأولي.

    } catch (e) {
      status = 'exception';
      Utils.error(`AI.IntentAnalyzer.detectIntent: An error occurred: ${e.message}`, e.stack);
      detectedIntent = { type: 'clarification_needed', originalPrompt: userPrompt, errorMessage: e.message };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('detectIntent', status, duration, {
        promptLength: userPrompt.length,
        detectedIntentType: detectedIntent.type,
        detectedToolName: detectedIntent.toolName || 'N/A'
      });
    }

    return detectedIntent;
  }

  return {
    detectIntent
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/3_intentAnalyzer.gs ---
// *************************************************************************************************
