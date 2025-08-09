// ES6 imports removed for Google Apps Script compatibility
/**
 * @file src/Config.js
 * @module System.Config
 * @version 22 (Refactored for explicit initialization)
 * @author عبدالعزيز
 * @description
 * وحدة مركزية لإدارة إعدادات المشروع.
 * يجب تهيئة هذه الوحدة بشكل صريح عند بدء التشغيل عبر دالة `initialize()`.
 * (Converted to standard ES6 module with explicit initialization)
 */

// These imports assume other modules will be converted and placed in a similar structure.
// تم إزالة استيراد Telemetry لكسر التبعية الدائرية المحتملة.
// يجب أن تكون وحدة Config وحدة منخفضة المستوى. سيتم معالجة الإبلاغ عن الأخطاء بواسطة المستدعي.

// --- Private Module State ---
let _configCache = null;
let _isInitialized = false;

// --- Constants ---
const STRICT_DEPENDENCY_MODE = true;
const CONFIG_SHEET_NAME = 'G-Assistant_Config';
const CACHE_KEY = 'config_cache';
const CACHE_DURATION_SECONDS = 300; // 5 minutes

/**
 * تجلب الإعدادات من المصدر (Google Sheet).
 * @private
 * @returns {object} The configuration object.
 */
function _fetchFromSource() {
    Utils.log('Config: Fetching fresh configuration from source sheet...');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_SHEET_NAME);
    if (!sheet) {
        // Throw an error to be caught by the initializer, as this is a critical failure.
        throw new Error(`Config sheet "${CONFIG_SHEET_NAME}" not found.`);
    }

    const data = sheet.getDataRange().getValues();
    const config = {};
    data.slice(1).forEach(row => {
        if (row[0] && row[1] !== undefined) {
            let value = row[1];
            // محاولة تحليل JSON للقيم من نوع مصفوفة/كائن
            if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                try {
                    value = JSON.parse(value);
                } catch {
                    Utils.warn(`Config: Could not parse JSON for key "${row[0]}". Using as string.`);
                }
            config[row[0]] = value;
        });
return config;
}

/**
 * تهيئة نظام الإعدادات.
 * يجب استدعاء هذه الدالة عند بدء التشغيل قبل أن تحاول أي وحدة أخرى قراءة قيم الإعدادات.
 * تحاول التحميل من ذاكرة التخزين المؤقت للسكريبت أولاً، ثم تعود إلى ورقة المصدر.
 * @param {boolean} [forceRefresh=false] - إذا كانت true، تتجاوز جميع ذاكرات التخزين المؤقت وتجلب من المصدر.
 */
export function initialize(forceRefresh = false) {
    if (_isInitialized && !forceRefresh) {
        Utils.warn('Config.initialize called more than once. Ignoring subsequent calls unless forceRefresh is true.');

  return;
}

    const cache = CacheService.getScriptCache();
    const cachedString = cache.get(CACHE_KEY);

    if (!forceRefresh && cachedString) {
        const parsedCache = JSON.parse(cachedString);
        const isCacheExpired = (Date.now() - parsedCache.timestamp) > (CACHE_DURATION_SECONDS * 1000);
        if (!isCacheExpired) {
            _configCache = parsedCache.data;
            _isInitialized = true;
            Utils.log('Config: Initialized successfully from ScriptCache.');

  return;
}
        Utils.log('Config: ScriptCache is expired. Fetching from source.');
    } else {
        Utils.log('Config: No valid cache. Fetching from source.');
    }

    // جلب من المصدر (Sheet) وتحديث ذاكرة التخزين المؤقت
    _configCache = _fetchFromSource();
    cache.put(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: _configCache }), CACHE_DURATION_SECONDS);
    _isInitialized = true;
    Utils.log('Config: Initialized successfully from source.', { count: Object.keys(_configCache).length });
}

/**
 * Checks if the configuration has been initialized.
 * @private
 */
function _ensureInitialized() {
    if (!_isInitialized) {
        throw new Error('Config module has not been initialized. Please call Config.initialize() at startup.');
    }

/**
 * Retrieves all configuration key-value pairs.
 * @returns {object} The entire configuration object.
 */
export function getAll() {
    _ensureInitialized();
return _configCache || {};
}

/**
 * Retrieves a single configuration value by its key.
 * @param {string} key - The configuration key.
 * @param {*} [defaultValue=null] - The value to return if the key is not found.
 * @returns {*} The configuration value or the default value.
 */
export function get(key, defaultValue = null) {
    _ensureInitialized();
return Object.hasOwn(_configCache, key) ? _configCache[key] : defaultValue;
}

/**
 * Validates that a set of required keys exist in the configuration.
 * @param {string[]} requiredKeys - An array of keys that must be present.
 * @returns {boolean} True if all keys exist, otherwise false.
 */
export function validate(requiredKeys) {
    _ensureInitialized();
    const missingKeys = requiredKeys.filter(key => !Object.hasOwn(_configCache, key));

    if (missingKeys.length > 0) {
        const errorMessage = `Config Validation Failed: Missing required keys: ${missingKeys.join(', ')}`;
        // The caller is now responsible for logging this error, as Telemetry is no longer imported.
        Utils.error(errorMessage, { missingKeys });
return false;
    }
return true;
}
