// *************************************************************************************************
// --- START OF FILE: 20_ai/3_ai_context.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/3_ai_context.gs
 * @module System.AI.Context
 * @version 2.0.0 // ✅ تحديث الإصدار للإشارة إلى التغييرات الجوهرية
 * @description
 * تجمع السياق الكامل (System Instruction) للنموذج وتدير حجمه بذكاء:
 * • دمج الدستور، الذاكرة قصيرة وطويلة المدى (مع دعم جلب الأكثر صلة)
 * • توحيد تعريفات الأدوات وسياق الورقة (بشكل أكثر تفصيلاً وديناميكية)
 * • إدارة ذكية لحجم السياق الكلي ليتناسب مع حدود النموذج (maxTokens).
 * المراحل المعمارية المطبقة:
 * • 1  defineModule وربط التبعيات
 * • 3  لا Caching لأن السياق ديناميكي (ولكن الآن مع إدارة حجم ديناميكية)
 * • 6  تتحقق من وجود الاعتمادات المدخلة
 * • 9  تسجيل الوثائق في DocsManager
 * • 10 حفظ استدعاء build في LongTermMemory (مع بيانات أكثر تفصيلاً)
 * • 11 إرسال Telemetry عند البناء (مع بيانات أكثر تفصيلاً)
 * • 17 تسجيل مقاييس الاستدعاء في ورقة AI_Context_Metrics (مع بيانات أكثر تفصيلاً)
 * • 18 تضمين رقم الإصدار من Config
 * • **جديد: دعم معلمات ديناميكية لـ build للتحكم في السياق (مرحلة 34)**
 * • **جديد: إدارة حجم السياق الكلي (maxTokens) وتقليصه بذكاء (مرحلة 35)**
 * • **جديد: تحسين جلب سياق الورقة ببيانات أكثر تفصيلاً (مرحلة 36)**
 * • **جديد: تحسين جلب ملخص الذاكرة طويلة المدى بناءً على الصلة (مرحلة 37)**
 */

defineModule('System.AI.Context', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
  const MODULE_VERSION = Config.get('AI_CONTEXT_VERSION') || '2.0.0'; // ✅ تحديث الإصدار الافتراضي
  const METRICS_SHEET = 'AI_Context_Metrics';
  const DEFAULT_MAX_CONTEXT_TOKENS = Config.get('DEFAULT_MAX_CONTEXT_TOKENS') || 28000; // ✅ حد افتراضي لتوكنز السياق (يمكن أن يكون 32k - ألفين لرسالة المستخدم)

  // مرحلة 9: تسجيل الوثائق (تحديثات وتفاصيل أكثر)
  DocsManager.registerModuleDocs('System.AI.Context', [
    {
      name: 'build',
      version: MODULE_VERSION,
      description: 'يبني systemInstruction كاملة للنموذج، ويدير حجمها بذكاء.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة لجلب ذاكرة المحادثة.', required: true },
          userQuery: { type: 'STRING', description: 'استعلام المستخدم الحالي لتحسين سياق الذاكرة طويلة المدى.', optional: true },
          maxTokens: { type: 'NUMBER', description: 'الحد الأقصى لعدد التوكنز في systemInstruction (بما في ذلك الدستور وسياق الورقة والذاكرة).', optional: true },
          includeConstitution: { type: 'BOOLEAN', description: 'تضمين دستور G-Assistant.', optional: true, default: true },
          includeTools: { type: 'BOOLEAN', description: 'تضمين تعريفات الأدوات المتاحة.', optional: true, default: true },
          includeSheetContext: { type: 'BOOLEAN', description: 'تضمين سياق ورقة Google Sheets النشطة.', optional: true, default: true },
          includeLongTermMemory: { type: 'BOOLEAN', description: 'تضمين ملخص الذاكرة طويلة المدى ذات الصلة.', optional: true, default: true }
        },
        required: ['sessionId'],
        returns: {
          type: 'OBJECT',
          description: 'كائن يحتوي على السياق الجاهز للنموذج.',
          properties: {
            systemInstruction: { type: 'STRING', description: 'نص تعليمات النظام الموحد.' },
            history: { type: 'ARRAY', description: 'سجل المحادثة الجاهز.' },
            tools: { type: 'ARRAY', description: 'تعريفات الأدوات.' },
            debugInfo: { type: 'OBJECT', description: 'معلومات التصحيح حول عملية البناء.' }
          }
        }
      }
    }
  ]);

  /**
   * يسجل استدعاء build في LongTermMemory, Telemetry, وورقة المقاييس.
   * @param {number} duration_ms
   * @param {object} buildStats - إحصائيات البناء
   */
  function _recordBuild(duration_ms, buildStats) {
    const ts = new Date().toISOString();
    AI.LongTermMemory.save('ContextBuild', {
      module: 'AI.Context',
      version: MODULE_VERSION,
      timestamp: ts,
      ...buildStats // ✅ تسجيل إحصائيات أكثر تفصيلاً
    });
    Telemetry.track('AI.Context.build', {
      version: MODULE_VERSION,
      timestamp: ts,
      duration_ms,
      ...buildStats
    });
    const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'DurationMs', 'Version', 'ConstitutionLen', 'SheetCtxLen', 'LTM_Len', 'TotalSystemInstructionLen', 'HistoryLen', 'ToolsCount']); // ✅ أعمدة إضافية
    sheet.appendRow([new Date(), duration_ms, MODULE_VERSION,
    buildStats.constitutionLength, buildStats.sheetContextLength, buildStats.longTermMemoryLength,
    buildStats.totalSystemInstructionLength, buildStats.historyLength, buildStats.toolsCount
    ]);
  }

  /**
   * ✅ دالة لتقدير عدد التوكنز للنص (تقدير تقريبي).
   * @param {string} text
   * @returns {number}
   */
  function _estimateTextTokens(text) {
    return Math.ceil(text.length / 4); // تقدير تقريبي: 4 أحرف لكل توكن
  }

  /**
   * ✅ دالة لتقدير التوكنز لكائن الأدوات.
   * @param {object[]} toolsDeclarations
   * @returns {number}
   */
  function _estimateToolsTokens(toolsDeclarations) {
    if (!toolsDeclarations || toolsDeclarations.length === 0) return 0;
    // تقدير تقريبي لتمثيل JSON للأدوات
    return Math.ceil(JSON.stringify(toolsDeclarations).length / 4);
  }

  /**
   * يبني السياق الكامل للنموذج.
   * @param {{ sessionId: string, userQuery?: string, maxTokens?: number, includeConstitution?: boolean, includeTools?: boolean, includeSheetContext?: boolean, includeLongTermMemory?: boolean }} options
   * @returns {{ systemInstruction: string, history: any[], tools: any[], debugInfo: object }}
   */
  function build({
    sessionId,
    userQuery = '',
    maxTokens = DEFAULT_MAX_CONTEXT_TOKENS,
    includeConstitution = true,
    includeTools = true,
    includeSheetContext = true,
    includeLongTermMemory = true
  }) {
    const start = Date.now();
    // ✅ مرحلة 6: التحقق من توفر الوحدات
    if (!Utils || !AI.Memory || !Tools || !AI.Constitution || !AI.LongTermMemory) {
      throw new Error('Core dependencies missing in AI.Context. Please check module definitions.');
    }
    Utils.validateString(sessionId, 'sessionId');
    Utils.log(`AI.Context.build: بدأ بناء السياق للجلسة ${sessionId}.`);

    const contextParts = [];
    let currentSystemInstructionLength = 0;
    const debugInfo = {
      constitutionLength: 0,
      toolsLength: 0,
      sheetContextLength: 0,
      longTermMemoryLength: 0,
      historyLength: 0,
      totalSystemInstructionLength: 0,
      toolsCount: 0,
      actualMaxTokens: maxTokens // لتسجيل الحد الفعلي المستخدم
    };

    // 1. الدستور (عنصر ثابت عادةً)
    let constitutionPrompt = '';
    if (includeConstitution) {
      constitutionPrompt = AI.Constitution.getPrompt();
      contextParts.push(`## 📜 دستور G-Assistant:\n${constitutionPrompt}`);
      debugInfo.constitutionLength = _estimateTextTokens(constitutionPrompt);
    }
    currentSystemInstructionLength += debugInfo.constitutionLength;

    // 2. دور المستخدم (ثابت نسبياً)
    const role = Config.get('USER_ROLE') || 'مساعد استراتيجي؛ مبرمج محترف؛ مدير تنفيذي'; // ✅ دور أكثر تفصيلاً
    contextParts.push(`## 🧑‍💼 دورك الحالي:\nأنت ${role} مسؤول عن تقديم الدعم المتخصص في جوجل شيتس (Google Sheets) وجوجل اب سكريبت (Google Apps Script) ونظم جوجل وورك ستيشن (Google Workspace). هدفك هو حل المشكلات، تحسين العمليات المالية والتشغيلية، وتقديم نصائح برمجية دقيقة وفعّالة. اجعل ردودك مختصرة ومباشرة قدر الإمكان مع الحفاظ على الفعالية.`);
    currentSystemInstructionLength += _estimateTextTokens(contextParts[contextParts.length - 1]);

    // 3. سياق الورقة (ديناميكي)
    let sheetCtx = '';
    if (includeSheetContext) {
      sheetCtx = _getSheetContext(); // ✅ دالة معدلة لتوفير تفاصيل أكثر
      contextParts.push(`## 📝 سياق ورقة العمل النشطة:\n${sheetCtx}`);
      debugInfo.sheetContextLength = _estimateTextTokens(sheetCtx);
    }
    currentSystemInstructionLength += debugInfo.sheetContextLength;


    // 4. الذاكرة طويلة المدى (معدلة لجلب الأكثر صلة)
    let ltSummary = '';
    if (includeLongTermMemory && userQuery) { // ✅ جلب LTM فقط إذا كان هناك استعلام مستخدم
      ltSummary = _getLongTermMemorySummary({ userQuery }); // ✅ تمرير استعلام المستخدم
      if (ltSummary) {
        contextParts.push(`## 🧠 ملخص الذاكرة طويلة المدى ذات الصلة:\n${ltSummary}`);
        debugInfo.longTermMemoryLength = _estimateTextTokens(ltSummary);
      }
    }
    currentSystemInstructionLength += debugInfo.longTermMemoryLength;

    // 5. تعريفات الأدوات (ديناميكية)
    let toolsDeclarations = [];
    if (includeTools) {
      toolsDeclarations = Tools.Catalog.getDeclarations();
      debugInfo.toolsCount = toolsDeclarations.length;
      debugInfo.toolsLength = _estimateToolsTokens(toolsDeclarations);
    }
    // ملاحظة: الأدوات لا تُضاف مباشرة إلى systemInstruction كـ text، بل ككائن منفصل لنموذج Gemini.
    // لكننا نأخذ حجمها في الاعتبار لتقدير total context tokens.

    debugInfo.totalSystemInstructionLength = currentSystemInstructionLength; // السياق الثابت قبل الذاكرة

    // 6. الذاكرة قصيرة المدى (سجل المحادثة)
    // ✅ مرحلة 35: إدارة حجم السياق الكلي
    // نحدد الحد الأقصى للتوكنز لذاكرة الجلسة بناءً على ما تبقى بعد السياق الثابت والأدوات
    const availableTokensForHistory = maxTokens - currentSystemInstructionLength - debugInfo.toolsLength - _estimateTextTokens(userQuery); // خصم استعلام المستخدم
    Utils.log(`AI.Context.build: التوكنز المتاحة للذاكرة قصيرة المدى: ${availableTokensForHistory}`);
    const { sessionHistory, longTermContext: relevantLTM } = AI.Memory.getCombinedContext({
      sessionId,
      userQuery,
      maxTokens: availableTokensForHistory // استخدام maxTokens من getCombinedContext
    });
    // ✅ ملاحظة: getCombinedContext يقوم بالفعل بالتعامل مع maxTokens.
    //  يمكننا هنا فقط التأكد من أننا نستخدم الناتج.

    // يمكننا إضافة relevantLTM كنص إلى systemInstruction هنا إذا كانت مهمة بشكل حاسم،
    // أو نعتمد على LTM_SUMMARY الذي تم إنشاؤه مسبقًا.
    // لأغراض الوضوح، سنبقيها منفصلة في الـ history أو كـ LTM_SUMMARY.

    debugInfo.historyLength = AI.Memory._estimateTokens(sessionHistory); // استخدام دالة الذاكرة لتقدير التوكنز

    // تجميع systemInstruction النهائية
    const systemInstruction = contextParts.join('\n\n---\n\n').trim();

    const finalState = {
      systemInstruction: systemInstruction,
      history: sessionHistory, // هذا يجب أن يمر كـ messages في استدعاء Gemini API
      tools: toolsDeclarations.length > 0 ? [{ functionDeclarations: toolsDeclarations }] : [],
      debugInfo: debugInfo
    };

    const duration_ms = Date.now() - start;
    _recordBuild(duration_ms, debugInfo);
    Utils.log(`AI.Context.build: اكتمل بناء السياق في ${duration_ms}ms. إجمالي توكنز السياق المقدر: ${debugInfo.totalSystemInstructionLength + debugInfo.historyLength + debugInfo.toolsLength + _estimateTextTokens(userQuery)}`);

    return finalState;
  }

  /**
   * ✅ مرحلة 37: يجلب ملخصًا من الذاكرة طويلة المدى بناءً على الصلة بالاستعلام.
   * @param {{ userQuery: string }} args
   * @returns {string|null}
   */
  function _getLongTermMemorySummary({ userQuery }) {
    try {
      // ✅ هنا يتم استخدام AI.LongTermMemory.search بدلاً من load
      // يفترض أن LTM تدعم البحث الدلالي أو البحث عن الكلمات المفتاحية
      const relevantItems = AI.LongTermMemory.search({
        query: userQuery,
        limit: 3, // جلب أهم 3 عناصر
        relevanceThreshold: 0.5 // عتبة الصلة (يمكن تعديلها)
      });

      if (!relevantItems?.length) return null;

      // تلخيص كل عنصر
      return relevantItems.map(item => {
        const time = new Date(item.timestamp).toLocaleString('ar-SA', {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        // ✅ محاولة استخلاص ملخص أفضل أو محتوى ذي صلة من عنصر LTM
        const contentSummary = item.data?.summary || item.data?.text || item.data?.description || JSON.stringify(item.data).slice(0, 100) + '...';
        return `- [${time}] ${item.category || 'معلومة'}: ${contentSummary}`;
      }).join('\n');

    } catch (e) {
      Utils.error('AI.Context._getLongTermMemorySummary failed. Ensure AI.LongTermMemory.search is implemented.', e);
      return null;
    }
  }

  /**
   * ✅ مرحلة 36: يولد سياق الورقة الحالي بتفاصيل أكثر.
   * @returns {string}
   */
  function _getSheetContext() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getActiveSheet();
      if (!sheet) return 'لا توجد ورقة نشطة حاليًا.';

      const sheetName = sheet.getName();
      const totalRows = sheet.getMaxRows();
      const totalColumns = sheet.getMaxColumns();
      const lastRow = sheet.getLastRow();
      const lastColumn = sheet.getLastColumn();

      let contextDetails = [
        `- الورقة النشطة: "${sheetName}"`,
        `- إجمالي الصفوف: ${totalRows}, إجمالي الأعمدة: ${totalColumns}`,
        `- آخر صف مستخدم: ${lastRow}, آخر عمود مستخدم: ${lastColumn}`
      ];

      // معلومات النطاق المحدد/النشط
      const activeRange = ss.getActiveRange();
      if (activeRange) {
        const a1Notation = activeRange.getA1Notation();
        const numRows = activeRange.getNumRows();
        const numCols = activeRange.getNumColumns();
        const displayValue = activeRange.getDisplayValue(); // قيمة الخلية الواحدة
        contextDetails.push(`- النطاق المحدد: ${a1Notation} (${numRows} صفوف، ${numCols} أعمدة). القيمة في الخلية العلوية اليسرى: "${displayValue}"`);

        // جلب قيم الرؤوس إذا كان النطاق المحدد في الصف الأول
        if (activeRange.getRow() === 1 && numRows > 0) {
          const headerValues = activeRange.getValues()[0].filter(h => h).join(', ');
          if (headerValues) {
            contextDetails.push(`- رؤوس النطاق المحدد: [${headerValues}]`);
          }
        }
        // ✅ يمكن إضافة قراءة جزء صغير من البيانات هنا إذا كان الحجم يسمح، أو استخدام أداة Sheet.readRange.
      } else {
        contextDetails.push('- لا يوجد نطاق محدد حاليًا.');
      }

      // معلومات النطاقات المسماة (Named Ranges)
      const namedRanges = ss.getNamedRanges();
      if (namedRanges && namedRanges.length > 0) {
        contextDetails.push('- النطاقات المسماة المهمة:');
        namedRanges.slice(0, 5).forEach(nr => { // عرض أول 5 نطاقات مسماة
          contextDetails.push(`  - ${nr.getName()}: ${nr.getRange().getA1Notation()}`);
        });
      }

      // يمكن إضافة المزيد هنا مثل:
      // - المخططات (Charts) الموجودة في الورقة.
      // - التحقق من صحة البيانات (Data Validations) الهامة.
      // - المعادلات المخصصة (Custom Functions) الموجودة في المشروع.

      return contextDetails.join('\n');
    } catch (e) {
      Utils.error('AI.Context._getSheetContext failed to retrieve detailed sheet context.', e);
      return 'خطأ في جلب سياق ورقة العمل المفصل.';
    }
  }

  return { build };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/3_ai_context.gs ---
// *************************************************************************************************