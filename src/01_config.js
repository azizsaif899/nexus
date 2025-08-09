// *************************************************************************************************
// --- START OF FILE: 01_config.gs ---
// *************************************************************************************************

/**
 * @file 01_config.js
 * @module System.Config
 * @version 21
 * @author عبدالعزيز
 * @description
 * وحدة إدارة إعدادات المشروع؛ تجمع Defaults مع Script Properties وتدعم Caching.
 * المراحل المعمارية المطبقة:
 *   • 1: defineModule وربط التبعيات
 *   • 3: Caching للأداء (CacheService)
 *   • 9: تسجيل DocsManager
 *  10: حفظ أحداث التحقق والتفريغ في LongTermMemory
 *  17: تسجيل مقاييس في Google Sheets
 */

defineModule('System.Config', ({ Utils }) => {
  const CACHE      = CacheService.getScriptCache();
  const CACHE_KEY  = 'g_assistant_config_v21';
  const CACHE_DURATION_SECONDS = 1800; // 30 دقيقة

  const DEFAULTS = {
    DEBUG_MODE:                   true,
    API_KEY:                      '',
    GEMINI_PRO_MODEL:             'gemini-1.5-pro-latest',
    API_ENDPOINT:                 'https://api.gemini.example.com',
    PRIMARY_HEADER_COLOR:         '#4a5568',
    // متغيرات جديدة
    API_MAX_RETRIES:              3,
    API_RETRY_DELAY_MS:           1000,
    MAX_MODEL_CONTEXT_TOKENS:     10000,
    BASE_SYSTEM_INSTRUCTION:      '',
    GENERATION_CONFIG:            { temperature: 0.7, maxOutputTokens: 2000 },
    SAFETY_SETTINGS:              [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }],
    TOOL_CONFIG:                  { functionCallingConfig: { mode: 'AUTO' }, thinkingConfig: { enableThinking: true } },
    GEMINI_SERVICE_VERSION:       '1.0.0',
    GEMINI_SERVICE_CACHE_TTL:     300,
    GEMINI_SERVICE_MAX_RETRIES:   3,
    GEMINI_SERVICE_INITIAL_BACKOFF_MS: 200,
    GEMINI_CONVERSATION_TTL:      1800,

    // Hybrid Service Configuration
    NODE_SERVICE_URL:             'http://localhost:54112',
    ENABLE_HYBRID_MODE:           true,
    HYBRID_FALLBACK_ENABLED:      true,

    // Week 2-3 Enhanced Embeddings Configuration
    VECTOR_STORE_SHEET:           'VectorStore_Cache',
    VECTOR_STORE_BATCH_SIZE:      100,
    VECTOR_STORE_CACHE_SIZE:      1000,
    EMBEDDING_BATCH_SIZE:         50,
    EMBEDDING_MAX_TEXT_LENGTH:    8000,
    SIMILARITY_THRESHOLD_DUP:     0.85,
    SIMILARITY_THRESHOLD_SEARCH:  0.6,
    SCHEDULER_INTERVAL_MINUTES:   60,
    API_CACHE_DURATION_MS:        300000
  };

  let activeConfig = null;

  function _loadConfig() {
    const props = PropertiesService.getScriptProperties().getProperties();
    const merged = { ...DEFAULTS };
    for (const key in props) {
      if (merged.hasOwnProperty(key)) {
        try { merged[key] = JSON.parse(props[key]); } catch { merged[key] = props[key]; }
      }
    }
    // دعم خاص لـ DEBUG_MODE و GEMINI_API_KEY
    merged.DEBUG_MODE = (String(props.DEBUG_MODE).toLowerCase() === 'true');
    merged.API_KEY    = props.GEMINI_API_KEY || merged.API_KEY;
    Utils.log('Config: Loaded from PropertiesService.');
    return merged;
  }

  function getAll(force = false) {
    if (activeConfig && !force) return activeConfig;
    const cached = CACHE.get(CACHE_KEY);
    if (cached && !force) {
      try { activeConfig = JSON.parse(cached); }
      catch { Utils.warn('Config: Failed to parse cache. Reloading.'); }
    }
    if (!activeConfig || force) {
      activeConfig = _loadConfig();
      CACHE.put(CACHE_KEY, JSON.stringify(activeConfig), CACHE_DURATION_SECONDS);
    }
    return activeConfig;
  }

  function get(key) {
    return getAll()[key];
  }

  function has(key) {
    return Object.prototype.hasOwnProperty.call(getAll(), key);
  }

  function validate() {
    const cfg = getAll(true);
    const required = ['API_KEY','API_ENDPOINT','GEMINI_PRO_MODEL'];
    for (const k of required) {
      if (!has(k) || (typeof cfg[k] === 'string' && !cfg[k].trim())) {
        Utils.error(`Config.validate: Missing required key "${k}".`);
        // TODO: إعادة تفعيل LongTermMemory بعد حل التبعية الدائرية
        return false;
      }
    }
    Utils.log('Config.validate: PASSED.');
    // TODO: إعادة تفعيل LongTermMemory و Telemetry بعد حل التبعية الدائرية
    const sheet = Utils.getSheet('Config_Metrics',['Timestamp','Status']);
    sheet.appendRow([ new Date(), 'passed' ]);
    return true;
  }

  function dump(sheetName = 'Config Dump') {
    return Utils.executeSafely(() => {
      const cfg   = getAll();
      const sheet = Utils.getSheet(sheetName, ['Key','Value','Type']);
      if (sheet.getLastRow() > 1) {
        sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).clearContent();
      }
      for (const key in cfg) {
        let val = cfg[key], type = typeof val;
        if (type === 'object') val = JSON.stringify(val, null, 2);
        sheet.appendRow([ key, val, type ]);
      }
      Utils.log(`Config.dump: Dumped to "${sheetName}".`);
      // TODO: إعادة تفعيل LongTermMemory و Telemetry بعد حل التبعية الدائرية
      const metrics = Utils.getSheet('Config_Metrics',['Timestamp','Action']);
      metrics.appendRow([ new Date(), 'dump' ]);
    }, [], `Config.dump[${sheetName}]`);
  }

  /**
   * تهيئة الوحدة - يتم استدعاؤها من Initializer
   */
  function init() {
    // تحميل الإعدادات والتحقق من صحتها
    const config = getAll(true); // إجبار إعادة التحميل
    const isValid = validate();

    Utils.log(`Config.init: Loaded ${Object.keys(config).length} settings, validation: ${isValid ? 'PASSED' : 'FAILED'}`);

    // تفعيل LongTermMemory و Telemetry بعد حل التبعية الدائرية
    if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.LongTermMemory) {
      GAssistant.AI.LongTermMemory.save('ConfigInitialization', {
        settingsCount: Object.keys(config).length,
        validation: isValid,
        timestamp: new Date()
      });
    }

    if (typeof GAssistant !== 'undefined' && GAssistant.System && GAssistant.System.Telemetry) {
      GAssistant.System.Telemetry.track('Config.Initialization', {
        status: isValid ? 'success' : 'validation_failed',
        settingsCount: Object.keys(config).length
      });
    }

    return isValid;
  }

  return { get, getAll, has, validate, dump, init };
});

// *************************************************************************************************
// --- END OF FILE: 01_config.gs ---
// *************************************************************************************************
