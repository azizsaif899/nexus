defineModule('System.Config.Enhanced', ({ Utils }) => {
  const MODULE_VERSION = '1.0.0';
  
  const CONFIG_KEYS = {
    // Gemini API
    GEMINI_API_KEY: 'GEMINI_API_KEY',
    GEMINI_MODEL: 'GEMINI_MODEL',
    
    // Vertex AI
    VERTEX_PROJECT_ID: 'VERTEX_PROJECT_ID',
    VERTEX_SERVICE_ACCOUNT_KEY: 'VERTEX_SERVICE_ACCOUNT_KEY',
    VERTEX_LOCATION: 'VERTEX_LOCATION',
    
    // Document AI
    DOCUMENT_AI_PROJECT_ID: 'DOCUMENT_AI_PROJECT_ID',
    DOCUMENT_AI_FORM_PARSER_ID: 'DOCUMENT_AI_FORM_PARSER_ID',
    DOCUMENT_AI_OCR_ID: 'DOCUMENT_AI_OCR_ID',
    
    // Application Settings
    DEFAULT_TEMPERATURE: 'DEFAULT_TEMPERATURE',
    MAX_TOKENS: 'MAX_TOKENS',
    TIMEOUT_MS: 'TIMEOUT_MS'
  };

  const DEFAULTS = {
    GEMINI_MODEL: 'gemini-2.0-flash-exp',
    DEFAULT_TEMPERATURE: '0.3',
    MAX_TOKENS: '2000',
    TIMEOUT_MS: '30000',
    VERTEX_LOCATION: 'us-central1'
  };

  function get(key) {
    try {
      // محاولة الحصول من PropertiesService أولاً
      let value = PropertiesService.getScriptProperties().getProperty(key);
      
      // إذا لم توجد، استخدم القيمة الافتراضية
      if (!value && DEFAULTS[key]) {
        value = DEFAULTS[key];
      }
      
      return value;
    } catch (e) {
      Utils.error(`Failed to get config: ${key}`, e);
      return DEFAULTS[key] || null;
    }
  }

  function set(key, value) {
    try {
      PropertiesService.getScriptProperties().setProperty(key, value);
      return true;
    } catch (e) {
      Utils.error(`Failed to set config: ${key}`, e);
      return false;
    }
  }

  function setMultiple(configs) {
    try {
      PropertiesService.getScriptProperties().setProperties(configs);
      return true;
    } catch (e) {
      Utils.error('Failed to set multiple configs', e);
      return false;
    }
  }

  function validateConfig() {
    const required = [
      CONFIG_KEYS.GEMINI_API_KEY,
      CONFIG_KEYS.VERTEX_PROJECT_ID
    ];
    
    const missing = required.filter(key => !get(key));
    
    if (missing.length > 0) {
      Utils.warn(`Missing required config: ${missing.join(', ')}`);
      return { valid: false, missing };
    }
    
    return { valid: true, missing: [] };
  }

  function getEndpoints() {
    const projectId = get(CONFIG_KEYS.VERTEX_PROJECT_ID);
    const location = get(CONFIG_KEYS.VERTEX_LOCATION);
    
    return {
      gemini: `https://generativelanguage.googleapis.com/v1beta/models`,
      vertexAI: `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}`,
      documentAI: `https://${location}-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}`
    };
  }

  return {
    CONFIG_KEYS,
    get,
    set,
    setMultiple,
    validateConfig,
    getEndpoints,
    MODULE_VERSION
  };
});