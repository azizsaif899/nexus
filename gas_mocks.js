/**
 * @file gas_mocks.js
 * @description
 * يوفر هذا الملف كائنات "محاكاة" (Mocks) للخدمات المدمجة في Google Apps Script.
 * هذا يسمح بتشغيل الكود الأساسي للمشروع في بيئة JavaScript عادية (مثل Node.js) للاختبار والتطوير.
 */

global.Logger = {
    log: (message) => console.log(`[Logger.log] ${message}`),
    warn: (message) => console.warn(`[Logger.warn] ${message}`),
    error: (message) => console.error(`[Logger.error] ${message}`),
};

global.CacheService = {
    getScriptCache: () => ({
        get: (key) => {
            console.log(`[MockCache] GET: ${key}`);
            return null; // Simulate cache miss
        },
        put: (key, value, ttl) => {
            console.log(`[MockCache] PUT: ${key} with TTL ${ttl}s`);
        },
        remove: (key) => {
            console.log(`[MockCache] REMOVE: ${key}`);
        },
    }),
};

global.PropertiesService = {
    getScriptProperties: () => ({
        getProperty: (key) => {
            console.log(`[MockProperties] GET: ${key}`);
            if (key === 'API_KEY') return 'mock_api_key_from_properties';
            return null;
        },
        getProperties: () => ({
            'GEMINI_DEFAULT_MODEL': 'gemini-1.5-pro-latest-mocked'
        }),
    }),
};

global.SpreadsheetApp = {
    // Add mock methods as needed by the modules
};

global.DocumentApp = {
    // Add mock methods as needed
};

console.log("✅ GAS Mocks Initialized.");