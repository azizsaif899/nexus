// *************************************************************************************************
// --- START OF FILE: 20_ai/0_ai_constitution.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/0_ai_constitution.gs
 * @module System.AI.Constitution
 * @version 2.0.0 // ✅ تحديث الإصدار للإشارة إلى التغييرات الجوهرية في المرونة
 * @description
 * دستور G-Assistant المنظم في فصول؛ مرجع SystemInstruction ومرتكز الأخلاقي والتشغيلي.
 * يعتمد الآن على مصدر ديناميكي للمحتوى (مثل Google Sheet أو Properties Service) لسهولة التحديث.
 * المراحل المعمارية المطبقة:
 * • 1  defineModule وربط التبعيات
 * • 3  Caching للنص المولد (CacheService) مع دعم تحديث الكاش
 * • 6  لا توجد مدخلات ديناميكية تحتاج تحقق (محتوى الدستور يُفترض أنه آمن)
 * • 9  تسجيل الوثائق في DocsManager
 * • 10 حفظ كل استدعاء في LongTermMemory
 * • 11 إرسال Telemetry لكل دالة
 * • 17 تسجيل مقاييس التشغيل في ورقة AI_Constitution_Metrics
 * • 18 تضمين رقم الإصدار من Config
 * • **جديد: دعم محتوى الدستور الديناميكي من مصدر خارجي (مرحلة 27)**
 * • **جديد: آلية لتحديث الكاش يدوياً (مرحلة 28)**
 * • **جديد: دالة لتقييم مبدأ معين (مرحلة 29)**
 */

defineModule('System.AI.Constitution', ({ Config, DocsManager, LongTermMemory, Telemetry, Utils, MetricsLogger }) => {
  const MODULE_VERSION = Config.get('AI_CONSTITUTION_VERSION') || '2.0.0'; // ✅ تحديث الإصدار الافتراضي
  const CACHE_KEY = `AI_Constitution_Prompt_v${MODULE_VERSION}`;
  const CACHE_TTL = 24 * 3600; // 24 ساعة
  const METRICS_SHEET = 'AI_Constitution_Metrics';
  const CACHE = CacheService.getScriptCache();

  // ✅ مرحلة 27: مصدر محتوى الدستور. يمكن أن يكون "Config" أو "Spreadsheet" أو "Properties"
  // في هذه الحالة، سنستخدم PropertiesService لسهولة الإدارة.
  // المفتاح في PropertiesService سيكون 'CONSTITUTION_CONTENT_JSON'
  const CONSTITUTION_SOURCE_TYPE = Config.get('CONSTITUTION_SOURCE_TYPE') || 'Properties'; // 'Properties' | 'Spreadsheet' | 'Hardcoded'
  const CONSTITUTION_PROPERTIES_KEY = Config.get('CONSTITUTION_PROPERTIES_KEY') || 'G_ASSISTANT_CONSTITUTION_CONTENT';
  const CONSTITUTION_SPREADSHEET_ID = Config.get('CONSTITUTION_SPREADSHEET_ID'); // إذا كان المصدر جدول بيانات
  const CONSTITUTION_SHEET_NAME = Config.get('CONSTITUTION_SHEET_NAME') || 'AI Constitution'; // إذا كان المصدر جدول بيانات

  // الفصل البنيوي للأوامر (كـ fallback أو كبداية صلبة)
  const HARDCODED_STRUCTURED_PRINCIPLES = {
    "الفصل الأول: الهوية والمهمة": [
      "أنت G-Assistant، مساعد استراتيجي داخل Google Sheets في التشغيل والمالية والبرمجة.",
      "هدفك دعم المستخدم في اتخاذ قرارات دقيقة، تسريع العمل، وتقديم تحسينات ذكية."
    ],
    "الفصل الثاني: أدوات التنفيذ والحدود": [
      "لا تنفذ كودًا إلا عبر AVAILABLE_TOOLS.",
      "قبل أي إجراء حساس استخدم askUserConfirmation.",
      "استخدم getPageSummary قبل التعديل لضمان وضوح السياق."
    ],
    "الفصل الثالث: الذكاء والسياق المعرفي": [
      "خزن الحالات باستخدام getContext وsetContext.",
      "استعن بـ LongTermMemory.load() لفهم التاريخ.",
      "دع المستخدم يتحكم في thinkingConfig لضبط جودة الاستنتاج."
    ],
    "الفصل الرابع: السلوك الاحترافي": [
      "كن مباشرًا، ذكيًا، محترمًا، وركز على تحسين العمل.",
      "بعد كل عملية ناجحة اقترح nextActions().",
      "اشرح الأكواد بتوثيق واضح عبر getBuiltinFunctionDoc()."
    ],
    "الفصل الخامس: إدارة الأخطاء": [
      "فسر الأخطاء بلغة بسيطة واقترح بدائل.",
      "لا تعرض استثناءات تقنية بلا توضيح.",
      "سجل كل خطأ عبر Utils.error أو Telemetry.track."
    ],
    "الفصل السادس: دعم الوسائط والأنماط التفاعلية": [
      "عند رفع صورة استخدم imageProcessor لتحليلها.",
      "تكيّف مع شخصية المطور أو المحاسب أو المسوّق حسب الطلب.",
      "عند الردود الطويلة استخدم streamGenerateContent تدريجيًا."
    ],
    "الفصل السابع: المبادئ الأخلاقية": [
      "البيانات سرية. لا تشارك أي معلومات خارج المهمة.",
      "اعترف بحدود معرفتك واطلب توضيحًا عند الحاجة.",
      "شجع المستخدم على التحقق من النتائج قبل اتخاذ قرارات حاسمة."
    ],
    "الفصل الثامن: البيئة المرجعية": [
      "`DEFAULT_CURRENCY = \"SAR\"`",
      "`PRIMARY_HEADER_COLOR = \"#e0e0e0\"`",
      "اللغة الافتراضية `ar` ويمكن تغييرها حسب إعدادات المستخدم."
    ]
  };

  /**
   * ✅ مرحلة 27: دالة لجلب محتوى الدستور من المصدر المحدد.
   * @returns {{[chapter: string]: string[]}}
   */
  function _loadConstitutionContent() {
    if (CONSTITUTION_SOURCE_TYPE === 'Properties') {
      const contentJson = PropertiesService.getScriptProperties().getProperty(CONSTITUTION_PROPERTIES_KEY);
      if (contentJson) {
        try {
          return JSON.parse(contentJson);
        } catch (e) {
          Utils.error(`Constitution[v${MODULE_VERSION}]: Failed to parse constitution JSON from PropertiesService: ${e.message}`);
        }
      }
    } else if (CONSTITUTION_SOURCE_TYPE === 'Spreadsheet') {
      try {
        const spreadsheet = SpreadsheetApp.openById(CONSTITUTION_SPREADSHEET_ID);
        const sheet = spreadsheet.getSheetByName(CONSTITUTION_SHEET_NAME);
        if (sheet) {
          const data = sheet.getDataRange().getValues();
          const loadedPrinciples = {};
          let currentChapter = '';
          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (row[0] && row[0].startsWith('الفصل')) { // افتراض أن الفصل في العمود A
              currentChapter = row[0].trim();
              loadedPrinciples[currentChapter] = [];
            } else if (currentChapter && row[1]) { // افتراض أن المبادئ في العمود B
              loadedPrinciples[currentChapter].push(row[1].trim());
            }
          }
          if (Object.keys(loadedPrinciples).length > 0) {
            return loadedPrinciples;
          }
        } else {
          Utils.warn(`Constitution[v${MODULE_VERSION}]: Spreadsheet "${CONSTITUTION_SHEET_NAME}" not found in ID: ${CONSTITUTION_SPREADSHEET_ID}`);
        }
      } catch (e) {
        Utils.error(`Constitution[v${MODULE_VERSION}]: Failed to load constitution from Spreadsheet: ${e.message}`);
      }
    }
    // Fallback to hardcoded if dynamic load fails or type is Hardcoded
    Utils.warn(`Constitution[v${MODULE_VERSION}]: Using hardcoded constitution content.`);
    return HARDCODED_STRUCTURED_PRINCIPLES;
  }

  // تحميل المحتوى عند تهيئة الوحدة
  let _currentConstitution = _loadConstitutionContent();

  // تسجيل الوثائق (مرحلة 9) - تحديثات لتشمل الدوال الجديدة
  DocsManager.registerModuleDocs('System.AI.Constitution', [
    {
      name: 'getPrompt',
      version: MODULE_VERSION,
      description: 'يُرجع نص الدستور بصيغة Markdown، مع الكاش.',
      returns: { type: 'STRING', description: 'نص الدستور.' }
    },
    {
      name: 'getStructuredObject',
      version: MODULE_VERSION,
      description: 'يُرجع الدستور ككائن JSON منظم حسب الفصول.',
      returns: { type: 'OBJECT', description: 'كائن يمثل الدستور.' }
    },
    {
      name: 'refreshConstitutionCache', // ✅ مرحلة 28: دالة لتحديث الكاش يدوياً
      version: MODULE_VERSION,
      description: 'يجبر على إعادة تحميل الدستور من المصدر المحدد وتحديث الكاش.',
      parameters: {
        type: 'OBJECT',
        properties: {
          forceReload: { type: 'BOOLEAN', description: 'إذا كان صحيحاً، سيعيد التحميل حتى لو كان الكاش موجوداً.', optional: true }
        }
      }
    },
    {
      name: 'evaluatePrinciple', // ✅ مرحلة 29: دالة لتقييم مبدأ معين
      version: MODULE_VERSION,
      description: 'يسمح بتقييم مبدأ معين أو مجموعة مبادئ لمعرفة مدى تطبيقها أو أهميتها في سياق معين.',
      parameters: {
        type: 'OBJECT',
        properties: {
          principleQuery: { type: 'STRING', description: 'النص أو المبدأ المراد تقييمه (يمكن أن يكون جزءًا من مبدأ).' },
          context: { type: 'OBJECT', description: 'سياق إضافي للتقييم (اختياري).', optional: true }
        },
        required: ['principleQuery'],
        returns: { type: 'OBJECT', description: 'نتائج التقييم.' }
      }
    }
  ]);

  /**
   * يسجّل الاستدعاء في الذاكرة طويلة الأمد، Telemetry، وGoogle Sheets (مراحل 10، 11، 17)
   * @param {string} fnName
   * @param {object} meta
   */
  function _recordInvocation(fnName, meta = {}) {
    MetricsLogger.record({
      module: 'AI.Constitution',
      action: fnName,
      version: MODULE_VERSION,
      status: 'invoked', // لا يوجد تتبع حالة هنا، لذا نستخدم حالة عامة
      durationMs: 0, // لا يوجد تتبع للمدة هنا
      sheetName: METRICS_SHEET,
      sheetHeaders: ['Timestamp', 'Function', 'Version', 'Meta'],
      sheetRow: [
        new Date(),
        fnName,
        MODULE_VERSION,
        JSON.stringify(meta)
      ],
      meta: meta
    });
  }

  /**
   * إرجاع نص الدستور بصيغة Markdown، مع Caching (مرحلة 3 - معززة)
   * @returns {string}
   */
  function getPrompt() {
    _recordInvocation('getPrompt'); // التسجيل قبل الكاش لتوثيق محاولة الجلب
    const cached = CACHE.get(CACHE_KEY);
    if (cached) {
      _recordInvocation('getPrompt (cached hit)'); // سجل ضربة الكاش
      return cached;
    }

    // إذا لم يكن في الكاش، قم ببنائه من المحتوى الحالي
    let md = '## 📜 دستور G-Assistant:\n\n';
    for (const chapter in _currentConstitution) {
      md += `### ${chapter}\n`;
      md += _currentConstitution[chapter].map(line => `- ${line}`).join('\n');
      md += '\n\n';
    }
    md = md.trim();

    CACHE.put(CACHE_KEY, md, CACHE_TTL);
    _recordInvocation('getPrompt (cache miss)'); // سجل عدم وجود الكاش
    return md;
  }

  /**
   * إرجاع الدستور ككائن JSON منظم (لا يستخدَم Caching هنا لأنه يتم تحميله عند بدء الوحدة)
   * @returns {{[chapter: string]: string[]}}
   */
  function getStructuredObject() {
    _recordInvocation('getStructuredObject');
    // إرجاع نسخة منعاً للتعديل الخارجي
    return JSON.parse(JSON.stringify(_currentConstitution));
  }

  /**
   * ✅ مرحلة 28: يجبر على إعادة تحميل الدستور من المصدر المحدد وتحديث الكاش.
   * مفيد لتحديث الدستور دون إعادة نشر الكود.
   * @param {object} [args] - كائن يحتوي على خيارات.
   * @param {boolean} [args.forceReload=false] - إذا كان صحيحاً، سيعيد التحميل حتى لو كان الكاش موجوداً.
   * @returns {object} - حالة العملية.
   */
  function refreshConstitutionCache({ forceReload = false } = {}) {
    return Utils.executeSafely(() => {
      if (!forceReload && CACHE.get(CACHE_KEY)) {
        _recordInvocation('refreshConstitutionCache (skipped - cache exists)');
        return { status: 'skipped', message: 'Cache already exists, use forceReload to refresh.' };
      }

      const oldVersion = JSON.stringify(_currentConstitution);
      _currentConstitution = _loadConstitutionContent(); // إعادة تحميل المحتوى
      const newVersion = JSON.stringify(_currentConstitution);

      CACHE.remove(CACHE_KEY); // إزالة الكاش القديم
      getPrompt(); // إعادة توليد وحفظ الكاش الجديد

      const changed = oldVersion !== newVersion;
      _recordInvocation('refreshConstitutionCache', { forceReload, changed, newVersionHash: Utils.hashCode(newVersion) }); // تسجيل التغيير
      
      return { 
        status: 'success', 
        message: 'Constitution reloaded and cache refreshed.', 
        contentChanged: changed 
      };
    }, [], `Constitution.refreshConstitutionCache[v${MODULE_VERSION}]`);
  }

  /**
   * ✅ مرحلة 29: دالة لتقييم مبدأ معين.
   * هذه الدالة يمكن استخدامها داخليًا بواسطة الـ AI نفسه (عبر Tool Calling)
   * أو من قبل المطور لتقييم مدى التزام الـ AI.
   * لا تقوم هذه الدالة بالتقييم الفعلي بحد ذاته (فهذا يتطلب محرك AI)،
   * ولكنها توفر الواجهة لتقوم بذلك لاحقاً.
   * @param {{ principleQuery: string, context?: object }} args
   * @returns {{ status: string, message: string, relevance?: number, relatedPrinciples?: string[], evaluationResult?: string }}
   */
  function evaluatePrinciple({ principleQuery, context = {} }) {
    _recordInvocation('evaluatePrinciple', { principleQuery, contextKeys: Object.keys(context) });

    // هنا يجب أن تتكامل هذه الدالة مع قدرات AI.GeminiService أو AI.Core
    // لتتمكن من "فهم" المبدأ وتقييمه في سياق معين.
    // كمثال، سنقوم بالبحث عن المبدأ وإرجاع ما يتطابق
    
    const allPrinciples = Object.values(_currentConstitution).flat();
    const matchingPrinciples = allPrinciples.filter(p => p.includes(principleQuery));

    if (matchingPrinciples.length > 0) {
        return {
            status: 'found',
            message: `Principle "${principleQuery}" matched ${matchingPrinciples.length} principles.`,
            relevance: 1.0, // افتراضي، يمكن أن يكون تقييم AI هنا
            relatedPrinciples: matchingPrinciples,
            evaluationResult: `المبدأ "${principleQuery}" يتعلق بـ: ${matchingPrinciples.join('؛ ')}.`,
            // ✅ يمكن هنا استدعاء AI.GeminiService.generateText لتقييم أعمق:
            // evaluationResult: AI.GeminiService.generateText({ prompt: `قيم المبدأ التالي: "${principleQuery}" في سياق: ${JSON.stringify(context)}. هل هو متوافق مع دستور G-Assistant؟` }).text
        };
    } else {
        return {
            status: 'not_found',
            message: `Principle "${principleQuery}" not found in the constitution.`,
            relevance: 0.0,
            relatedPrinciples: [],
            evaluationResult: 'لم يتم العثور على مبدأ مباشر يطابق الاستعلام.'
        };
    }
  }

  return {
    getPrompt,
    getStructuredObject,
    refreshConstitutionCache, // ✅ تصدير الدالة الجديدة
    evaluatePrinciple // ✅ تصدير الدالة الجديدة
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/0_ai_constitution.gs ---
// *************************************************************************************************