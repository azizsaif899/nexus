/**
 * @file 01_config.js
 * @module System.Config
 * @version 2.0.0 // تحديث الإصدار ليعكس إضافة التحقق من الصحة
 * @author عبدالعزيز
 * @description
 * وحدة مركزية لإدارة إعدادات المشروع. تدمج بين الإعدادات الافتراضية،
 * الإعدادات المخزنة في PropertiesService، وتدعم التخزين المؤقت (Caching) للأداء.
 * تتضمن الآن آلية للتحقق من صحة الإعدادات عند بدء التشغيل.
 */
defineModule('System.Config', ({ Utils }) => {
  const _properties = PropertiesService.getScriptProperties();
  const _cache = CacheService.getScriptCache();
  const CACHE_KEY = 'config_cache_v2';
  const CACHE_TTL = 300; // 5 دقائق

  let _configCache = null;
  let _isReady = false;

  const _defaults = {
    'API_KEY': '',
    'GEMINI_DEFAULT_MODEL': 'gemini-1.5-pro-latest',
    'GEMINI_FLASH_MODEL': 'gemini-1.5-flash',
    'LTM_FOLDER_NAME': 'G-Assistant_Memory',
    'LTM_FILE_NAME': 'long_term_log.json',
    'LTM_CACHE_TTL': 600,
    'DEVELOPER_WORKSHOP_SHEET': 'Developer_Workshop',
    // ... يمكن إضافة إعدادات افتراضية أخرى هنا
  };

  // ✅ جديد: مخطط التحقق من صحة الإعدادات
  const _configSchema = {
    'API_KEY': { type: 'string', non_empty: true, help: 'مفتاح API الخاص بـ Google AI Studio. ضروري لعمل النظام.' },
    'GEMINI_DEFAULT_MODEL': { type: 'string', non_empty: true, help: 'النموذج الافتراضي للاستدعاءات العامة.' },
    'LTM_FOLDER_NAME': { type: 'string', non_empty: true, help: 'اسم المجلد في Google Drive لتخزين الذاكرة طويلة الأمد.' },
    'LTM_CACHE_TTL': { type: 'number', help: 'مدة صلاحية الكاش للذاكرة طويلة الأمد بالثواني.' },
  };

  function _loadConfig() {
    const cachedConfig = _cache.get(CACHE_KEY);
    if (cachedConfig) {
      _configCache = JSON.parse(cachedConfig);
      return;
    }
    const storedProps = _properties.getProperties();
    _configCache = { ..._defaults, ...storedProps };
    _cache.put(CACHE_KEY, JSON.stringify(_configCache), CACHE_TTL);
  }

  function get(key) {
    if (!_configCache) {
      _loadConfig();
    }
    return _configCache[key];
  }

  function getAll(forceRefresh = false) {
    if (forceRefresh) {
      _cache.remove(CACHE_KEY);
    }
    if (!_configCache || forceRefresh) {
      _loadConfig();
    }
    return { ..._configCache };
  }

  /**
   * ✅ جديد: يتحقق من صحة الإعدادات الأساسية بناءً على المخطط.
   * يرمي خطأً واضحًا إذا كان هناك إعداد مفقود أو غير صحيح.
   * يجب استدعاؤه عند بدء تشغيل التطبيق.
   */
  function validate() {
    if (_isReady) return; // لا تقم بالتحقق أكثر من مرة

    const config = getAll();
    const errors = [];

    for (const key in _configSchema) {
      const rule = _configSchema[key];
      const value = config[key];

      if (value === undefined || value === null) {
        errors.push(`- الإعداد المطلوب "${key}" مفقود. ${rule.help}`);
        continue;
      }

      if (rule.type && typeof value !== rule.type) {
        errors.push(`- الإعداد "${key}" يجب أن يكون من نوع "${rule.type}" ولكن تم العثور على "${typeof value}". ${rule.help}`);
        continue;
      }

      if (rule.non_empty && typeof value === 'string' && !value.trim()) {
        errors.push(`- الإعداد "${key}" لا يمكن أن يكون فارغًا. ${rule.help}`);
      }
    }

    if (errors.length > 0) {
      const errorMessage = `فشل التحقق من صحة الإعدادات:\n${errors.join('\n')}\n\nالرجاء مراجعة إعدادات المشروع (Script Properties) وتصحيحها.`;
      Utils.error('Config Validation Failed', { errors });
      throw new Error(errorMessage);
    }

    _isReady = true;
    Utils.log('✅ Config validation successful. System is ready.');
  }

  return {
    get,
    getAll,
    validate,
  };
});