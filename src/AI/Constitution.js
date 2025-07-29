/**
 * @module System.AI.Constitution
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AI.Constitution', ({ AI, Config }) => {
  // === المحتوى الأصلي ===
  
  
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
      
  }
  

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});