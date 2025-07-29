/**
 * @module System.AI.Memory
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('System.AI.Memory', ({ AI }) => {
  // === المحتوى الأصلي ===
  
  /**
   * @file 20_ai/1_ai_memory.gs
   * @module System.AI.Memory
   * @version 2.0.0
   * @author عبدالعزيز
   * @description
   * إدارة ذاكرة الجلسة القصيرة (Conversation History) متعددة الأنواع، وكاش الاستجابات المتدفقة.
   * توفر آليات أكثر ذكاءً لإدارة السياق وتكامل مع الذاكرة طويلة الأمد.
   * المراحل المعمارية المطبقة:
   * • 1   defineModule وربط التبعيات
   * • 3   Caching عبر CacheService (معزز لأنواع محتوى متعددة)
   * • 6   تحقق من صحة المدخلات
   * • 9   تسجيل الوثائق في DocsManager
   * • 10  حفظ استدعاءات الوظائف في LongTermMemory (معزز)
   * • 11  إرسال Telemetry لكل وظيفة (معزز)
   * • 17  تسجيل مقاييس التشغيل في ورقة AI_Memory_Metrics (معزز)
   * • 18  تضمين رقم الإصدار من Config
   * • **جديد: دعم أنواع محتوى رسائل متعددة (نصوص، صور، كائنات، استدعاءات أدوات) (مرحلة 30)**
   * • **جديد: إدارة أكثر ذكاءً لسجل المحادثة (تلخيص أو ضغط) (مرحلة 31)**
   * • **جديد: دمج تلقائي مع LongTermMemory للذاكرة المهمة (مرحلة 32)**
   * • **جديد: وظيفة جلب السياق المركب (combined context) (مرحلة 33)**
   */
  
  
  
  // تعريف الثوابت والإعدادات من Config
    const MODULE_VERSION = Config.get('AI_MEMORY_VERSION') || '2.0.0';
    const USER_CACHE = CacheService.getUserCache();
    const SCRIPT_CACHE = CacheService.getScriptCache(); // مناسب للبيانات المشتركة عبر الجلسات/المستخدمين
    const SESSION_KEY_PREFIX = 'g_assistant_session_';
    const STREAM_PREFIX = 'stream_';
    const CACHE_DURATION_SESSION = Config.get('MEMORY_SESSION_TTL') || 3600; // مدة صلاحية ذاكرة الجلسة بالثواني (افتراضي: ساعة)
    const CACHE_DURATION_STREAM = Config.get('MEMORY_STREAM_TTL') || 300; // مدة صلاحية كاش التدفق بالثواني (افتراضي: 5 دقائق)
    const METRICS_SHEET = 'AI_Memory_Metrics';
    const MAX_HISTORY_MESSAGES = Config.get('MAX_HISTORY_MESSAGES') || 20; // الحد الأقصى لعدد الرسائل في سجل الجلسة
    const MAX_HISTORY_TOKENS = Config.get('MAX_HISTORY_TOKENS') || 8000; // الحد الأقصى لعدد التوكنز في سجل الجلسة
  
    // مرحلة 30: تعريف أنواع الرسائل وأجزائها المدعومة
    const MESSAGE_ROLES = ['user', 'model', 'tool', 'system']; // الأدوار الصالحة للمرسل
    const MESSAGE_PART_TYPES = ['text', 'inlineData', 'functionCall', 'functionResponse', 'fileData']; // أنواع المحتوى المدعومة في جزء الرسالة
  
    // مرحلة 9: تسجيل الوثائق في DocsManager
    DocsManager.registerModuleDocs('System.AI.Memory', [
      {
        name: 'clearSessionContext',
        version: MODULE_VERSION,
        description: 'يمسح سجل المحادثة الحالي من ذاكرة المستخدم لجلسة محددة.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            sessionId: { type: 'STRING', description: 'معرف الجلسة للمسح (إذا لم يحدد، يستخدم المعرف الافتراضي).', optional: true },
      {
        name: 'addMessageToHistory',
        version: MODULE_VERSION,
        description: 'يضيف رسالة إلى سجل المحادثة لجلسة محددة. يدعم أنواع محتوى متعددة.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            sessionId: { type: 'STRING', description: 'معرف الجلسة.', required: true },
            message: {,
              type: 'OBJECT',
              description: 'كائن الرسالة بالصيغة المدعومة (role, parts).',
              properties: {,
                role: { type: 'STRING', enum: MESSAGE_ROLES, description: 'دور المرسل ("user", "model", "tool", "system").' },
                parts: { type: 'ARRAY', description: 'مصفوفة من أجزاء المحتوى (نص، صورة، أداة).' },
              required: ['role', 'parts'
            },
          required: ['sessionId', 'message'
        },
      {
        name: 'getSessionHistory',
        version: MODULE_VERSION,
        description: 'يعيد مصفوفة رسائل الجلسة الحالية لجلسة محددة، مع خيار لتحديد الحد الأقصى للتوكنز.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            sessionId: { type: 'STRING', description: 'معرف الجلسة.', required: true },
            maxTokens: { type: 'NUMBER', description: 'الحد الأقصى لعدد التوكنز للذاكرة المرجعة (لتقليل حجم السياق).', optional: true },
          required: ['sessionId'
        },
  
    returns: { type: 'ARRAY', description: 'مصفوفة رسائل المحادثة.' },
      {
        name: 'setStreamCache',
        version: MODULE_VERSION,
        description: 'يحفظ أجزاء الاستجابة المتدفقة (stream) في الكاش.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            streamId: { type: 'STRING', description: 'معرّف فريد للتدفق.' },
            chunks: { type: 'ARRAY', description: 'مصفوفة أجزاء التدفق.' },
          required: ['streamId', 'chunks']
        },
      {
        name: 'pullStreamCache',
        version: MODULE_VERSION,
        description: 'يستدعي أجزاء الاستجابة المتدفقة من الكاش ويمسحها بعد الجلب.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            streamId: { type: 'STRING', description: 'معرّف فريد للتدفق.' },
          required: ['streamId']
        },
  
    returns: { type: 'ARRAY', description: 'مصفوفة أجزاء التدفق أو null.' },
      {
        name: 'logMemoryItem',
        version: MODULE_VERSION,
        description: 'يسجل عنصر ذاكرة محدد (غير المحادثة الروتينية) في الذاكرة طويلة الأمد.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            category: { type: 'STRING', description: 'فئة الذاكرة (مثلاً: "UserPreference", "CriticalTask").' },
            data: { type: 'OBJECT', description: 'الكائن الذي يمثل الذاكرة.' },
          required: ['category', 'data']
        },
      {
        name: 'getCombinedContext',
        version: MODULE_VERSION,
        description: 'يجلب سياقاً مركباً يجمع بين ذاكرة الجلسة والذاكرة طويلة الأمد ذات الصلة.',
        parameters: {,
          type: 'OBJECT',
          properties: {,
            sessionId: { type: 'STRING', description: 'معرف الجلسة.', required: true },
            userQuery: { type: 'STRING', description: 'استعلام المستخدم الحالي لتقييم الصلة.', optional: true },
            maxTokens: { type: 'NUMBER', description: 'الحد الأقصى لعدد التوكنز للسياق الكلي.', optional: true },
          required: ['sessionId'],
  
    returns: { type: 'OBJECT', description: '{ sessionHistory: [], longTermContext: [] }' }
    ]);
  
    /**
     * يسجل استدعاء دالة في LTM، Telemetry، وورقة المقاييس.
     * @param {string} fnName - اسم الدالة التي تم استدعاؤها.
     * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
     */
    function _recordInvocation(fnName, meta = {}) {
      const ts = new Date().toISOString();
      // مرحلة 10: حفظ في LongTermMemory
      AI.LongTermMemory.save('MemoryInvocation', {
        module: 'AI.Memory',
        function: fnName,
        version: MODULE_VERSION,
        timestamp: ts,
        ...meta
  }

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});