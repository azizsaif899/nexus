/**
 * @file config.js
 * @description Configuration management for AzizSys.
 */
AzizSys.defineModule('System.Config', ({ Utils }) => {
    const _properties = PropertiesService.getScriptProperties(); // Uses mock
    const _cache = CacheService.getScriptCache(); // Uses mock

    let _configCache = null;

    const _defaults = {
        'API_KEY': 'default_api_key',
        'GEMINI_DEFAULT_MODEL': 'gemini-1.5-pro-latest-default',
    };

    function _loadConfig() {
        Utils.log("Loading configuration...");
        const storedProps = _properties.getProperties();
        _configCache = { ..._defaults, ...storedProps };
    }

    function get(key) {
        if (!_configCache) {
            _loadConfig();
        }
        return _configCache[key];
    }

    return {
        get,
    };
});