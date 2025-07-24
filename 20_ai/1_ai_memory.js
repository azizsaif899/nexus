// *************************************************************************************************
// --- START OF FILE: 20_ai/1_ai_memory.gs ---
// *************************************************************************************************

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

'use strict'; // توجيه 'use strict' يجب أن يكون في أعلى الملف لتجنب المشاكل مع destructuring في defineModule

defineModule('System.AI.Memory', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
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
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة للمسح (إذا لم يحدد، يستخدم المعرف الافتراضي).', optional: true }
        }
      }
    },
    {
      name: 'addMessageToHistory',
      version: MODULE_VERSION,
      description: 'يضيف رسالة إلى سجل المحادثة لجلسة محددة. يدعم أنواع محتوى متعددة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة.', required: true },
          message: {
            type: 'OBJECT',
            description: 'كائن الرسالة بالصيغة المدعومة (role, parts).',
            properties: {
              role: { type: 'STRING', enum: MESSAGE_ROLES, description: 'دور المرسل ("user", "model", "tool", "system").' },
              parts: { type: 'ARRAY', description: 'مصفوفة من أجزاء المحتوى (نص، صورة، أداة).' }
            },
            required: ['role', 'parts']
          }
        },
        required: ['sessionId', 'message']
      }
    },
    {
      name: 'getSessionHistory',
      version: MODULE_VERSION,
      description: 'يعيد مصفوفة رسائل الجلسة الحالية لجلسة محددة، مع خيار لتحديد الحد الأقصى للتوكنز.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة.', required: true },
          maxTokens: { type: 'NUMBER', description: 'الحد الأقصى لعدد التوكنز للذاكرة المرجعة (لتقليل حجم السياق).', optional: true }
        },
        required: ['sessionId']
      },
      returns: { type: 'ARRAY', description: 'مصفوفة رسائل المحادثة.' }
    },
    {
      name: 'setStreamCache',
      version: MODULE_VERSION,
      description: 'يحفظ أجزاء الاستجابة المتدفقة (stream) في الكاش.',
      parameters: {
        type: 'OBJECT',
        properties: {
          streamId: { type: 'STRING', description: 'معرّف فريد للتدفق.' },
          chunks: { type: 'ARRAY', description: 'مصفوفة أجزاء التدفق.' }
        },
        required: ['streamId', 'chunks']
      }
    },
    {
      name: 'pullStreamCache',
      version: MODULE_VERSION,
      description: 'يستدعي أجزاء الاستجابة المتدفقة من الكاش ويمسحها بعد الجلب.',
      parameters: {
        type: 'OBJECT',
        properties: {
          streamId: { type: 'STRING', description: 'معرّف فريد للتدفق.' }
        },
        required: ['streamId']
      },
      returns: { type: 'ARRAY', description: 'مصفوفة أجزاء التدفق أو null.' }
    },
    {
      name: 'logMemoryItem',
      version: MODULE_VERSION,
      description: 'يسجل عنصر ذاكرة محدد (غير المحادثة الروتينية) في الذاكرة طويلة الأمد.',
      parameters: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING', description: 'فئة الذاكرة (مثلاً: "UserPreference", "CriticalTask").' },
          data: { type: 'OBJECT', description: 'الكائن الذي يمثل الذاكرة.' }
        },
        required: ['category', 'data']
      }
    },
    {
      name: 'getCombinedContext',
      version: MODULE_VERSION,
      description: 'يجلب سياقاً مركباً يجمع بين ذاكرة الجلسة والذاكرة طويلة الأمد ذات الصلة.',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', description: 'معرف الجلسة.', required: true },
          userQuery: { type: 'STRING', description: 'استعلام المستخدم الحالي لتقييم الصلة.', optional: true },
          maxTokens: { type: 'NUMBER', description: 'الحد الأقصى لعدد التوكنز للسياق الكلي.', optional: true }
        },
        required: ['sessionId'],
        returns: { type: 'OBJECT', description: '{ sessionHistory: [], longTermContext: [] }' }
      }
    }
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
    });
    // مرحلة 11: إرسال Telemetry
    Telemetry.track('AI.Memory.Invocation', {
      function: fnName,
      version: MODULE_VERSION,
      timestamp: ts, // يمكن استخدام ts أو new Date()
      ...meta
    });
    // مرحلة 17: تسجيل مقاييس التشغيل في ورقة AI_Memory_Metrics
    const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Function', 'Version', 'Meta']);
    if (sheet) { // تحقق للتأكد من أن الورقة تم جلبها بنجاح
      sheet.appendRow([new Date(), fnName, MODULE_VERSION, JSON.stringify(meta)]);
    } else {
      Utils.warn(`AI.Memory._recordInvocation: Failed to get sheet '${METRICS_SHEET}'. Metrics not recorded.`);
    }
  }

  /**
   * مرحلة 31: دالة مساعدة لتحويل الرسالة إلى نص (تقدير التوكنز).
   * هذا التقدير تقريبي ويعتمد على عدد الأحرف، ويمكن استبداله بـ Tokenizer API أدق إذا توفر.
   * @param {object} message - كائن الرسالة بالصيغة المدعومة.
   * @returns {string} - النص التمثيلي للرسالة.
   */
  function _messageToText(message) {
    if (!message || !Array.isArray(message.parts)) return '';
    return message.parts.map(part => {
      if (part.text) return part.text;
      if (part.inlineData) return `[${part.inlineData.mimeType} image]`; // وصف أفضل للصور
      if (part.functionCall) return `[Function Call: ${part.functionCall.name}]`;
      if (part.functionResponse) return `[Function Response: ${part.functionResponse.name}]`;
      return '';
    }).join(' ');
  }

  /**
   * مرحلة 31: وظيفة لتقدير عدد التوكنز للرسائل.
   * @param {Array<object>} messages - مصفوفة رسائل المحادثة.
   * @returns {number} - العدد التقريبي للتوكنز.
   */
  function _estimateTokens(messages) {
    return messages.reduce((acc, msg) => acc + (_messageToText(msg).length / 4), 0); // تقدير 4 أحرف لكل توكن (متوسط)
  }

  /**
   * مرحلة 31: دالة لضغط سجل المحادثة إذا تجاوز الحد الأقصى لعدد الرسائل أو التوكنز.
   * يتم ذلك عن طريق اقتطاع أقدم الرسائل.
   * @param {Array<object>} history - سجل المحادثة الحالي.
   * @returns {Array<object>} - السجل المضغوط.
   */
  function _compressHistory(history) {
    // التحقق المسبق لتجنب المعالجة غير الضرورية
    if (history.length <= MAX_HISTORY_MESSAGES && _estimateTokens(history) <= MAX_HISTORY_TOKENS) {
      return history; // لا حاجة للضغط إذا كانت ضمن الحدود
    }

    Utils.log(`AI.Memory[v${MODULE_VERSION}]: Initiating history compression. Initial length: ${history.length}, tokens: ${_estimateTokens(history)}`);
    Telemetry.track('Memory.HistoryCompression', {
      initialLength: history.length,
      initialTokens: _estimateTokens(history)
    });

    let compressedHistory = [...history]; // العمل على نسخة لتجنب تعديل الأصل مباشرة

    // 1. الاقتطاع حسب عدد الرسائل (إذا تجاوز MAX_HISTORY_MESSAGES)
    if (compressedHistory.length > MAX_HISTORY_MESSAGES) {
      compressedHistory = compressedHistory.slice(-MAX_HISTORY_MESSAGES); // الاحتفاظ بالرسائل الأحدث فقط
      Utils.log(`AI.Memory: Trimmed history by message count to ${compressedHistory.length} messages.`);
    }

    // 2. الاقتطاع حسب التوكنز (أكثر تعقيدًا): إزالة أقدم الرسائل حتى يظل ضمن الحد الأقصى للتوكنز
    // نترك رسالتين على الأقل لضمان وجود سياق أساسي
    while (_estimateTokens(compressedHistory) > MAX_HISTORY_TOKENS && compressedHistory.length > 2) {
      compressedHistory.shift(); // إزالة أقدم رسالة
      Utils.log(`AI.Memory: Removing oldest message to fit token limit. Current length: ${compressedHistory.length}, tokens: ${_estimateTokens(compressedHistory)}`);
    }

    Telemetry.track('Memory.HistoryCompressionResult', {
      finalLength: compressedHistory.length,
      finalTokens: _estimateTokens(compressedHistory)
    });
    Utils.log(`AI.Memory: History compression complete. Final length: ${compressedHistory.length}, tokens: ${_estimateTokens(compressedHistory)}.`);

    return compressedHistory;
  }

  /**
   * جلب سياق الجلسة من الكاش أو إرجاع هيكل افتراضي جديد إذا لم يتم العثور عليه أو فشل التحليل.
   * @param {string} sessionId - معرف الجلسة الفريد.
   * @returns {{history: Array<object>}} - كائن يحتوي على سجل المحادثة.
   * @private
   */
  function _loadSessionContext(sessionId) {
    const sessionKey = SESSION_KEY_PREFIX + sessionId;
    try {
      const raw = USER_CACHE.get(sessionKey);
      return raw ? JSON.parse(raw) : { history: [] };
    } catch (e) {
      // تسجيل الخطأ مع sessionId لتسهيل التتبع
      Utils.error(`AI.Memory._loadSessionContext for session '${sessionId}' failed to parse cached data.`, e);
      return { history: [] }; // إعادة هيكل فارغ للسماح باستمرار العملية
    }
  }

  /**
   * حفظ سياق الجلسة الكامل في الكاش.
   * @param {string} sessionId - معرف الجلسة الفريد.
   * @param {{history: Array<object>}} ctx - كائن سياق الجلسة للحفظ.
   * @private
   */
  function _saveSessionContext(sessionId, ctx) {
    const sessionKey = SESSION_KEY_PREFIX + sessionId;
    try {
      // استخدام CacheService.put مع مدة الصلاحية لضمان تنظيف الكاش تلقائيًا
      USER_CACHE.put(sessionKey, JSON.stringify(ctx), CACHE_DURATION_SESSION);
    } catch (e) {
      Utils.error(`AI.Memory._saveSessionContext for session '${sessionId}' failed to save data.`, e);
    }
  }

  /**
   * يمسح سجل المحادثة الحالي لجلسة محددة من ذاكرة المستخدم.
   * @param {{ sessionId?: string }} args - كائن يحتوي على معرف الجلسة (اختياري، الافتراضي هو 'default').
   */
  function clearSessionContext({ sessionId = 'default' } = {}) {
    Utils.validateString(sessionId, 'sessionId');
    const sessionKey = SESSION_KEY_PREFIX + sessionId;
    USER_CACHE.remove(sessionKey);
    Utils.log(`AI.Memory.clearSessionContext: Session '${sessionId}' has been cleared from cache.`);
    _recordInvocation('clearSessionContext', { sessionId });
  }

  /**
   * يضيف رسالة جديدة إلى سجل المحادثة لجلسة محددة.
   * @param {{ sessionId: string, message: { role: string, parts: Array<object> } }} args - كائن يحتوي على معرف الجلسة والرسالة.
   * @throws {Error} إذا كانت الرسالة أو أجزاؤها غير صالحة.
   */
  function addMessageToHistory({ sessionId, message }) {
    Utils.validateString(sessionId, 'sessionId');
    // مرحلة 6: تحقق صارم من صحة الرسالة
    if (!message || !MESSAGE_ROLES.includes(message.role) || !Array.isArray(message.parts) || message.parts.length === 0) {
      throw new Error(`AI.Memory.addMessageToHistory: Invalid message format. Must have a valid 'role' and non-empty 'parts' array. Received: ${JSON.stringify(message)}`);
    }
    message.parts.forEach(part => {
      // التحقق من أن كل جزء يحتوي على نوع محتوى معروف
      if (!MESSAGE_PART_TYPES.some(type => part[type] !== undefined)) {
        throw new Error(`AI.Memory.addMessageToHistory: Invalid message part type found. Each part must contain one of: ${MESSAGE_PART_TYPES.join(', ')}. Received part: ${JSON.stringify(part)}`);
      }
    });

    const ctx = _loadSessionContext(sessionId);
    ctx.history.push(message);

    // مرحلة 31: ضغط سجل المحادثة بعد إضافة الرسالة للحفاظ على حدود الحجم والتوكنز
    ctx.history = _compressHistory(ctx.history);

    _saveSessionContext(sessionId, ctx);
    _recordInvocation('addMessageToHistory', { sessionId, role: message.role, partsCount: message.parts.length });

    // مرحلة 32: دمج تلقائي مع LongTermMemory للذاكرة المهمة
    _triggerLongTermMemorySave(sessionId, message);
  }

  /**
   * مرحلة 32: آلية ذكية لتقرير ما إذا كانت الرسالة مهمة بما يكفي لحفظها في الذاكرة طويلة الأمد.
   * يمكن توسيع هذه الدالة لتشمل تحليلًا أكثر تعقيدًا باستخدام نماذج AI أو قواعد بيانات المعرفة.
   * @param {string} sessionId - معرف الجلسة التي تنتمي إليها الرسالة.
   * @param {object} message - كائن الرسالة لتقييم أهميته.
   * @private
   */
  function _triggerLongTermMemorySave(sessionId, message) {
    // في هذا الإصدار، نعتمد على بحث بسيط عن الكلمات المفتاحية
    // ويمكن تطويرها لاحقًا لاستخدام نموذج AI لتقييم الأهمية (مثلاً: AI.GeminiService.evaluateImportance)
    const messageText = _messageToText(message);
    const keywordsForLTM = Config.get('LTM_KEYWORDS') || [
      'critical decision', 'key insight', 'project goal',
      'financial report', 'budget approval', 'strategic plan',
      'new policy', 'bug fix', 'security alert', 'important finding'
    ];

    // نبحث عن الكلمات المفتاحية في رسالة النموذج (فقط استجابات النموذج عادة ما تحتوي على رؤى)
    const isImportant = message.role === 'model' &&
                        keywordsForLTM.some(keyword => messageText.toLowerCase().includes(keyword.toLowerCase()));

    if (isImportant) {
      AI.LongTermMemory.save('ConversationInsight', {
        sessionId: sessionId,
        message: message, // يمكن حفظ الرسالة بأكملها أو تلخيصها
        timestamp: new Date().toISOString(),
        importance: 'high' // مستوى الأهمية
      });
      Telemetry.track('Memory.LongTermMemorySaved', { sessionId, reason: 'keyword match for LTM' });
      Utils.log(`AI.Memory: Saved important insight to LTM for session '${sessionId}'.`);
    }
  }

  /**
   * يسترجع سجل المحادثة الحالي لجلسة محددة، مع إمكانية تقليص حجمه إلى عدد محدد من التوكنز.
   * @param {{ sessionId: string, maxTokens?: number }} args - كائن يحتوي على معرف الجلسة والحد الأقصى للتوكنز.
   * @returns {Array<object>} - مصفوفة رسائل المحادثة المقتطعة إذا لزم الأمر.
   */
  function getSessionHistory({ sessionId, maxTokens }) {
    Utils.validateString(sessionId, 'sessionId');
    const ctx = _loadSessionContext(sessionId);
    let history = [...ctx.history]; // العمل على نسخة لتجنب تعديل الكاش مباشرة

    // إذا تم تحديد maxTokens، قلص الذاكرة لتناسب هذا الحد
    if (maxTokens && _estimateTokens(history) > maxTokens) {
      Utils.log(`AI.Memory.getSessionHistory: Trimming history for session '${sessionId}' to fit ${maxTokens} tokens.`);
      while (_estimateTokens(history) > maxTokens && history.length > 0) {
        history.shift(); // إزالة أقدم رسالة
      }
      // إذا أصبحت فارغة بعد الإزالة وكان لا يزال الحد الأقصى للتوكنز متحققاً، يمكننا إضافة رسالة افتتاحية
      // لا يتم تطبيقها هنا للحفاظ على البساطة، ولكنها فكرة لتحسين تجربة المستخدم
    }

    _recordInvocation('getSessionHistory', {
      sessionId,
      returnedLength: history.length,
      returnedTokens: _estimateTokens(history)
    });
    return history;
  }

  /**
   * يحفظ أجزاء الاستجابة المتدفقة (stream) في CacheService.
   * يستخدم SCRIPT_CACHE لأن بيانات التدفق قد تكون مؤقتة ومشتركة أو ليست خاصة بمستخدم واحد فقط.
   * @param {{ streamId: string, chunks: Array<object> }} args - كائن يحتوي على معرف التدفق ومصفوفة الأجزاء.
   * @throws {Error} إذا كانت 'chunks' ليست مصفوفة.
   */
  function setStreamCache({ streamId, chunks }) {
    Utils.validateString(streamId, 'streamId');
    if (!Array.isArray(chunks)) {
      // ✅ تم التصحيح هنا: استخدام علامات اقتباس مزدوجة للسلسلة الخارجية
      throw new Error("AI.Memory.setStreamCache: 'chunks' must be an array of objects.");
    }
    try {
      SCRIPT_CACHE.put(STREAM_PREFIX + streamId, JSON.stringify(chunks), CACHE_DURATION_STREAM);
      Utils.log(`AI.Memory.setStreamCache: Stream '${streamId}' saved with ${chunks.length} chunks.`);
    } catch (e) {
      Utils.error(`AI.Memory.setStreamCache for stream '${streamId}' failed to save data.`, e);
    }
    _recordInvocation('setStreamCache', { streamId, chunksCount: chunks.length });
  }

  /**
   * يستدعي أجزاء الاستجابة المتدفقة من الكاش ويمسحها بعد الجلب لضمان معالجتها لمرة واحدة.
   * @param {{ streamId: string }} args - كائن يحتوي على معرف التدفق.
   * @returns {Array<object> | null} - مصفوفة أجزاء التدفق أو `null` إذا لم يتم العثور عليها أو فشل التحليل.
   */
  function pullStreamCache({ streamId }) {
    Utils.validateString(streamId, 'streamId');
    let chunks = null;
    try {
      const raw = SCRIPT_CACHE.get(STREAM_PREFIX + streamId);
      if (raw) {
        chunks = JSON.parse(raw);
        SCRIPT_CACHE.remove(STREAM_PREFIX + streamId); // مسح الكاش بعد الجلب لمرة واحدة
        Utils.log(`AI.Memory.pullStreamCache: Stream '${streamId}' pulled and cleared.`);
      }
    } catch (e) {
      Utils.error(`AI.Memory.pullStreamCache for stream '${streamId}' failed to retrieve or parse.`, e);
    }
    _recordInvocation('pullStreamCache', { streamId, retrievedChunks: chunks ? chunks.length : 0 });
    return chunks;
  }

/**
   * يسجل عنصر ذاكرة محدد (غير جزء من المحادثة الروتينية) في الذاكرة طويلة الأمد.
   * هذا مفيد لحفظ تفضيلات المستخدم، المهام المكتملة، أو معلومات النظام الهامة.
   * @param {{ category: string, data: object }} args - فئة الذاكرة والبيانات المراد حفظها.
   * @throws {Error} إذا كانت 'category' ليست نصًا أو 'data' ليست كائنًا.
   */
  function logMemoryItem({ category, data }) {
    Utils.validateString(category, 'category');
    if (typeof data !== 'object' || data === null) {
      // ✅ تم التصحيح هنا: استخدام علامات اقتباس مزدوجة للسلسلة الخارجية
      throw new Error("AI.Memory.logMemoryItem: 'data' must be a non-null object.");
    }
    AI.LongTermMemory.save(category, data); // يفترض أن AI.LongTermMemory لديها دالة 'save'
    _recordInvocation('logMemoryItem', { category, dataKeys: Object.keys(data).join(',') });
    Utils.log(`AI.Memory.logMemoryItem: Saved item to LTM under category '${category}'.`);
  }
  /**
   * مرحلة 33: يجلب سياقاً مركباً يجمع بين ذاكرة الجلسة القصيرة والذاكرة طويلة الأمد ذات الصلة.
   * هذه الدالة هي نقطة قوة كبيرة للـ AI، حيث تدمج بين الذاكرة قصيرة الأمد والطويلة الأمد
   * لتوفير سياق غني للنماذج.
   * @param {{ sessionId: string, userQuery?: string, maxTokens?: number }} args - معرف الجلسة، استعلام المستخدم (للبحث في LTM)، والحد الأقصى للتوكنز الكلي.
   * @returns {{ sessionHistory: Array<object>, longTermContext: Array<object> }} - كائن يحتوي على سجل الجلسة والذاكرة طويلة الأمد ذات الصلة.
   */
  function getCombinedContext({ sessionId, userQuery, maxTokens = MAX_HISTORY_TOKENS * 1.5 }) { // زيادة الحد الأقصى للتوكنز قليلاً للسياق المركب
    Utils.validateString(sessionId, 'sessionId');

    // 1. جلب ذاكرة الجلسة وتقليصها لتناسب جزءًا من إجمالي التوكنز
    // نخصص حوالي 60% من maxTokens لذاكرة الجلسة للحفاظ على تفاعلات الحديثة
    let sessionHistory = getSessionHistory({ sessionId, maxTokens: Math.floor(maxTokens * 0.6) });

    // 2. البحث في الذاكرة طويلة الأمد (LongTermMemory) بناءً على استعلام المستخدم
    let longTermContext = [];
    if (userQuery) {
      try {
        // يفترض أن AI.LongTermMemory لديها دالة 'search' تستقبل استعلام وترجع عناصر ذات صلة
        longTermContext = AI.LongTermMemory.search({
          query: userQuery,
          limit: 5, // جلب 5 عناصر كحد أقصى من LTM
          relevanceThreshold: 0.7 // يمكن استخدام هذا الحد إذا كانت LTM تدعم تقييم الصلة
        });
        Utils.log(`AI.Memory.getCombinedContext: Found ${longTermContext.length} relevant LTM items for query.`);
      } catch (e) {
        // تسجيل تحذير بدلاً من رمي خطأ لإتاحة استمرار العملية حتى لو فشلت LTM
        Utils.warn(`AI.Memory.getCombinedContext: Failed to search LongTermMemory for session '${sessionId}': ${e.message}.`);
        Telemetry.track('Memory.LTM_Search_Error', { error: e.message, sessionId, userQuery });
      }
    }

    // 3. تصفية الذاكرة طويلة الأمد لتناسب الحد الأقصى المتبقي للتوكنز
    let combinedTokens = _estimateTokens(sessionHistory) + _estimateTokens(longTermContext.map(item => ({ parts: [{ text: JSON.stringify(item.data) }] }))); // تقدير توكنز LTM

    // إزالة العناصر الأقل صلة (أو الأكبر حجماً) من LTM إذا تجاوز إجمالي التوكنز الحد الأقصى
    // نضمن عدم إزالة كل عناصر LTM إذا كانت هي السبب الوحيد لتجاوز الحد
    while (combinedTokens > maxTokens && longTermContext.length > 0) {
      longTermContext.pop(); // إزالة أحدث عنصر (افتراضياً الأقل صلة إذا لم يتم فرز LTM)
      combinedTokens = _estimateTokens(sessionHistory) + _estimateTokens(longTermContext.map(item => ({ parts: [{ text: JSON.stringify(item.data) }] })));
    }

    _recordInvocation('getCombinedContext', {
      sessionId,
      userQueryLength: userQuery ? userQuery.length : 0,
      sessionHistoryLength: sessionHistory.length,
      longTermContextLength: longTermContext.length,
      totalEstimatedTokens: combinedTokens
    });

    return { sessionHistory, longTermContext };
  }

  return {
    clearSessionContext,
    addMessageToHistory,
    getSessionHistory,
    setStreamCache,
    pullStreamCache,
    logMemoryItem,
    getCombinedContext
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/1_ai_memory.gs ---
// *************************************************************************************************