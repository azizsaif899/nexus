// *************************************************************************************************
// --- START OF FILE: 20_ai/2_ai_longTermMemory.gs ---
// *************************************************************************************************

/**
 * @file 20_ai/2_ai_longTermMemory.gs
 * @module System.AI.LongTermMemory
 * @version 1.0.1 // ✅ تحديث الإصدار بعد إضافة ميزة التجميع
 * @author عبدالعزيز
 * @description
 * وحدة لإدارة الذاكرة طويلة الأمد لنظام الذكاء الاصطناعي باستخدام Google Drive وCacheService.
 * تشمل وظائف حفظ واسترجاع الأحداث، البحث عن السياق، تجميع الأحداث حسب المصدر، وتخزين التوثيق السياقي للدوال.
 * المراحل المعمارية المطبقة:
 * • 1   defineModule وربط التبعيات (خاصة Config, Telemetry)
 * • 6   تحقق من صحة المدخلات
 * • 9   تسجيل الوثائق في DocsManager
 * • 10  حفظ سجلات الذاكرة في Google Drive
 * • 11  إرسال Telemetry لكل عملية ذاكرة
 * • 17  تسجيل مقاييس الذاكرة في ورقة AI_LongTermMemory_Metrics
 * • 18  تضمين رقم الإصدار من Config
 * • **جديد: دالة search للبحث في الذاكرة طويلة الأمد**
 * • **جديد: دالة getEventsGroupedBySource لتجميع الأحداث**
 */

// ✅ تم تغيير اسم الوحدة إلى System.AI.LongTermMemory
defineModule('System.AI.LongTermMemory', ({ Utils, Config, DocsManager, Telemetry }) => {
  const MODULE_VERSION = Config.get('AI_LONG_TERM_MEMORY_VERSION') || '1.0.1'; // ✅ مفتاح Config جديد
  const FOLDER_NAME = Config.get('LTM_FOLDER_NAME') || "G-Assistant_Memory";
  const FILE_NAME = Config.get('LTM_FILE_NAME') || "long_term_log.json"; // ✅ اسم ملف أكثر دلالة
  const CACHE_KEY_PREFIX = 'ltm_cache_'; // ✅ prefix للكاش
  const CACHE_DURATION_SECONDS = Config.get('LTM_CACHE_TTL') || 600; // 10 دقائق
  const FUNCTION_DOC_CACHE_TTL = Config.get('LTM_FUNCTION_DOC_TTL') || 21600; // 6 ساعات
  const METRICS_SHEET = 'AI_LongTermMemory_Metrics'; // ✅ اسم ورقة مقاييس موحد

  // مرحلة 9: تسجيل الوثائق
  DocsManager.registerModuleDocs('System.AI.LongTermMemory', [
    {
      name: 'save',
      version: MODULE_VERSION,
      description: 'يحفظ حدثًا أو قطعة من الذاكرة في سجل الذاكرة طويلة الأمد.',
      parameters: {
        type: 'OBJECT',
        properties: {
          eventType: { type: 'STRING', description: 'نوع الحدث (مثلاً "UserPreference", "CriticalInsight").', required: true },
          data: { type: 'OBJECT', description: 'البيانات المراد حفظها.', required: true }
        },
        required: ['eventType', 'data']
      }
    },
    {
      name: 'load',
      version: MODULE_VERSION,
      description: 'يحمل سجل الذاكرة طويلة الأمد (مع الكاش) ويعيد أحدث الأحداث.',
      parameters: {
        type: 'OBJECT',
        properties: {
          count: { type: 'NUMBER', description: 'الحد الأقصى لعدد الأحداث المراد تحميلها.', optional: true, default: 10 }
        },
        required: []
      },
      returns: { type: 'ARRAY', description: 'مصفوفة من كائنات الذاكرة.' }
    },
    {
      name: 'search',
      version: MODULE_VERSION,
      description: 'يبحث في الذاكرة طويلة الأمد عن عناصر ذات صلة باستعلام معين.',
      parameters: {
        type: 'OBJECT',
        properties: {
          query: { type: 'STRING', description: 'استعلام البحث.', required: true },
          limit: { type: 'NUMBER', description: 'الحد الأقصى لعدد النتائج.', optional: true, default: 5 },
          relevanceThreshold: { type: 'NUMBER', description: 'عتبة الصلة (0.0-1.0).', optional: true, default: 0.5 }
        },
        required: ['query']
      },
      returns: { type: 'ARRAY', description: 'مصفوفة من كائنات الذاكرة ذات الصلة.' }
    },
    {
      name: 'getEventsGroupedBySource', // ✅ دالة جديدة
      version: MODULE_VERSION,
      description: 'يجمع الأحداث من الذاكرة طويلة الأمد ويرتبها حسب المصدر.',
      parameters: {
        type: 'OBJECT',
        properties: {
          limit: { type: 'NUMBER', description: 'الحد الأقصى لعدد الأحداث التي سيتم تجميعها (افتراضي: 50).', optional: true, default: 50 }
        },
        required: []
      },
      returns: { type: 'OBJECT', description: 'كائن يمثل الأحداث مجمعة حسب المصدر (source → [events]).' }
    },
    {
      name: 'cacheFunctionDoc',
      version: MODULE_VERSION,
      description: 'يخزن توثيق دالة معينة في الكاش لسرعة الوصول.',
      parameters: {
        type: 'OBJECT',
        properties: {
          functionName: { type: 'STRING', description: 'اسم الدالة.', required: true },
          documentation: { type: 'STRING', description: 'نص التوثيق.', required: true }
        },
        required: ['functionName', 'documentation']
      }
    },
    {
      name: 'getCachedFunctionDoc',
      version: MODULE_VERSION,
      description: 'يسترجع توثيق دالة من الكاش.',
      parameters: {
        type: 'OBJECT',
        properties: {
          functionName: { type: 'STRING', description: 'اسم الدالة.', required: true }
        },
        required: ['functionName']
      },
      returns: { type: 'STRING', description: 'نص التوثيق المخزن مؤقتًا، أو null إذا لم يتم العثور عليه.' }
    }
  ]);

  /**
   * يسجل استدعاءات الذاكرة طويلة الأمد في LTM، Telemetry، وورقة المقاييس.
   * @param {string} action - نوع الإجراء (مثلاً 'save', 'load', 'search').
   * @param {string} status - حالة العملية ('success', 'error', 'cached').
   * @param {number} durationMs - مدة العملية بالمللي ثانية.
   * @param {object} [meta={}] - بيانات وصفية إضافية للتسجيل.
   * @private
   */
  function _recordInvocation(action, status, durationMs, meta = {}) {
    const ts = new Date().toISOString();
    const record = {
      module: 'AI.LongTermMemory', // ✅ اسم الوحدة الصحيح
      function: action,
      version: MODULE_VERSION,
      timestamp: ts,
      status,
      durationMs,
      ...meta
    };

    // لا نحفظ في LTM هنا لتجنب التكرار اللانهائي، لأن هذه الوحدة هي LTM نفسها
    Telemetry.track('AI.LongTermMemory.Invocation', record);

    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'EventCount', 'FunctionName', 'ErrorMessage'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(),
        action,
        status,
        durationMs,
        MODULE_VERSION,
        meta.eventCount || '',
        meta.functionName || '',
        meta.errorMessage || ''
      ]);
    } else {
      Utils.warn(`AI.LongTermMemory._recordInvocation: Missing sheet '${METRICS_SHEET}'.`);
    }
  }

  /**
   * يحصل على ملف السجل من Google Drive أو ينشئه إذا لم يكن موجودًا.
   * @returns {GoogleAppsScript.Drive.File} ملف السجل.
   * @private
   */
  function _getLogFile() {
    try {
      const folders = DriveApp.getFoldersByName(FOLDER_NAME);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
      const files = folder.getFilesByName(FILE_NAME);
      if (files.hasNext()) return files.next();
      Utils.log('AI.LongTermMemory: Creating new log file in Drive.');
      return folder.createFile(FILE_NAME, '[]', MimeType.PLAIN_TEXT);
    } catch (e) {
      Utils.error(`AI.LongTermMemory._getLogFile failed: ${e.message}`, e.stack);
      throw new Error(`Failed to access/create Drive log file: ${e.message}`);
    }
  }

  /**
   * يحفظ حدثًا أو قطعة من الذاكرة في سجل الذاكرة طويلة الأمد.
   * @param {string} eventType - نوع الحدث.
   * @param {object} data - البيانات المراد حفظها.
   * @returns {object} نتيجة العملية.
   */
  function save(eventType, data) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    try {
      Utils.validateString(eventType, 'eventType');
      if (typeof data !== 'object' || data === null) {
        throw new Error('Data to save must be a non-null object.');
      }

      const logFile = _getLogFile();
      const history = JSON.parse(logFile.getBlob().getDataAsString());
      history.push({ timestamp: new Date().toISOString(), type: eventType, content: data });
      logFile.setContent(JSON.stringify(history, null, 2));

      // إزالة الكاش لضمان تحميل أحدث البيانات في المرة القادمة
      CacheService.getScriptCache().remove(CACHE_KEY_PREFIX + FILE_NAME); // ✅ استخدام مفتاح كاش محدد للملف
      status = 'success';
      Utils.log('AI.LongTermMemory: Event saved and cache invalidated.', { eventType });
      return { type: 'success', text: 'Event saved.' };
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`AI.LongTermMemory.save failed: ${errorMessage}`, e.stack);
      return { type: 'error', text: `Failed to save event: ${errorMessage}` };
    } finally {
      _recordInvocation('save', status, Date.now() - start, { eventType, errorMessage });
    }
  }

  /**
   * يحمل سجل الذاكرة طويلة الأمد (مع الكاش) ويعيد أحدث الأحداث.
   * @param {number} [count=10] - الحد الأقصى لعدد الأحداث المراد تحميلها.
   * @returns {Array<object>} مصفوفة من كائنات الذاكرة.
   */
  function load(count = 10) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let events = [];
    try {
      const cache = CacheService.getScriptCache();
      const cached = cache.get(CACHE_KEY_PREFIX + FILE_NAME); // ✅ استخدام مفتاح كاش محدد للملف
      if (cached) {
        events = JSON.parse(cached);
        status = 'cached';
        Utils.log('AI.LongTermMemory: Cache hit. Loading from Cache.');
      } else {
        Utils.log('AI.LongTermMemory: Cache miss. Loading from Drive.');
        const history = JSON.parse(_getLogFile().getBlob().getDataAsString());
        cache.put(CACHE_KEY_PREFIX + FILE_NAME, JSON.stringify(history), CACHE_DURATION_SECONDS); // ✅ استخدام مفتاح كاش محدد للملف
        events = history;
        status = 'success';
      }
      return events.slice(-count);
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`AI.LongTermMemory.load failed: ${errorMessage}`, e.stack);
      return []; // إرجاع مصفوفة فارغة في حالة الفشل
    } finally {
      _recordInvocation('load', status, Date.now() - start, { count, eventCount: events.length, errorMessage });
    }
  }

  /**
   * تبحث في الذاكرة طويلة الأمد عن عناصر ذات صلة باستعلام معين.
   * هذا تنفيذ بسيط يعتمد على تطابق النص. يمكن توسيعه لاحقًا باستخدام نماذج تضمين (embeddings) للبحث الدلالي.
   * @param {{ query: string, limit?: number, relevanceThreshold?: number }} args
   * @returns {Array<object>} مصفوفة من كائنات الذاكرة ذات الصلة.
   */
  function search({ query, limit = 5, relevanceThreshold = 0.5 }) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let relevantItems = [];
    try {
      Utils.validateString(query, 'query');
      const allEvents = load(100); // تحميل عدد أكبر من الأحداث للبحث فيها
      const lowerCaseQuery = query.toLowerCase();

      for (const event of allEvents) {
        // تحويل محتوى الحدث إلى نص للبحث
        const eventText = JSON.stringify(event.content || event.type || '').toLowerCase();
        if (eventText.includes(lowerCaseQuery)) {
          // هذا بحث بسيط. يمكن تحسينه بإضافة نقاط صلة (relevance scores)
          relevantItems.push(event);
          if (relevantItems.length >= limit) break; // الوصول إلى الحد الأقصى
        }
      }
      status = 'success';
      return relevantItems;
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`AI.LongTermMemory.search failed: ${errorMessage}`, e.stack);
      return [];
    } finally {
      _recordInvocation('search', status, Date.now() - start, { query, limit, foundCount: relevantItems.length, errorMessage });
    }
  }

  /**
   * ✅ دالة جديدة: يجمع الأحداث من الذاكرة طويلة الأمد ويرتبها حسب المصدر.
   * @param {{ limit?: number }} args - الحد الأقصى لعدد الأحداث التي سيتم تجميعها (افتراضي: 50).
   * @returns {object} كائن يمثل الأحداث مجمعة حسب المصدر (source → [events]).
   */
  function getEventsGroupedBySource({ limit = 50 } = {}) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let grouped = {};
    try {
      Utils.validateNumber(limit, 'limit');
      const allEvents = load(limit); // استخدام دالة load الموجودة
      
      grouped = allEvents.reduce((acc, event) => {
        // التأكد من وجود المحتوى والمصدر، وإلا العودة إلى النوع أو 'unknown'
        const source = event.content?.source || event.type || "unknown"; 
        if (!acc[source]) {
          acc[source] = [];
        }
        acc[source].push(event);
        return acc;
      }, {});
      
      status = 'success';
      Utils.log(`AI.LongTermMemory: Events grouped by source. Found ${Object.keys(grouped).length} sources.`);
      return grouped;
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`AI.LongTermMemory.getEventsGroupedBySource failed: ${errorMessage}`, e.stack);
      return {}; // إرجاع كائن فارغ في حالة الخطأ
    } finally {
      _recordInvocation('getEventsGroupedBySource', status, Date.now() - start, {
        limit,
        sourceCount: Object.keys(grouped).length,
        errorMessage
      });
    }
  }

  /**
   * يخزن توثيق دالة معينة في الكاش لسرعة الوصول.
   * @param {string} functionName - اسم الدالة.
   * @param {string} documentation - نص التوثيق.
   */
  function cacheFunctionDoc(functionName, documentation) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    try {
      Utils.validateString(functionName, 'functionName');
      Utils.validateString(documentation, 'documentation');
      const cache = CacheService.getScriptCache();
      cache.put(CACHE_KEY_PREFIX + `doc_${functionName}`, documentation, FUNCTION_DOC_CACHE_TTL); // ✅ استخدام مفتاح كاش محدد
      status = 'success';
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`AI.LongTermMemory.cacheFunctionDoc failed: ${errorMessage}`, e.stack);
    } finally {
      _recordInvocation('cacheFunctionDoc', status, Date.now() - start, { functionName, errorMessage });
    }
  }

  /**
   * يسترجع توثيق دالة من الكاش.
   * @param {string} functionName - اسم الدالة.
   * @returns {string | null} نص التوثيق المخزن مؤقتًا، أو null إذا لم يتم العثور عليه.
   */
  function getCachedFunctionDoc(functionName) {
    const start = Date.now();
    let status = 'error';
    let errorMessage = '';
    let doc = null;
    try {
      Utils.validateString(functionName, 'functionName');
      const cache = CacheService.getScriptCache();
      doc = cache.get(CACHE_KEY_PREFIX + `doc_${functionName}`); // ✅ استخدام مفتاح كاش محدد
      status = doc ? 'cached' : 'not_found';
      return doc;
    } catch (e) {
      status = 'exception';
      errorMessage = e.message;
      Utils.error(`AI.LongTermMemory.getCachedFunctionDoc failed: ${errorMessage}`, e.stack);
      return null;
    } finally {
      _recordInvocation('getCachedFunctionDoc', status, Date.now() - start, { functionName, errorMessage, docFound: !!doc });
    }
  }

  return {
    save,
    load,
    search,
    getEventsGroupedBySource, // ✅ تصدير الدالة الجديدة
    cacheFunctionDoc,
    getCachedFunctionDoc
  };
});

// *************************************************************************************************
// --- END OF FILE: 20_ai/2_ai_longTermMemory.gs ---
// *************************************************************************************************
