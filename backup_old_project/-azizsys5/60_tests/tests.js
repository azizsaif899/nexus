// *************************************************************************************************
// --- START OF FILE: 60_tests/tests.gs ---
// *************************************************************************************************

/**
 * @file 60_tests/tests.gs
 * @module System.Tests
 * @version 24 // ✅ تحديث الإصدار بعد تصحيح أخطاء التهيئة والترتيب
 * @author عبدالعزيز
 * @description
 * وحدة الاختبار الشاملة للمشروع (اختبارات التكامل). تستخدم بنية قائمة على البيانات لتسهيل
 * إضافة الاختبارات، وتقيس أداء كل اختبار، وتُرجع نتائج مهيكلة.
 * تختبر تفاعل الوحدات الرئيسية مع بعضها البعض.
 */

'use strict';

// 1) تعريف دالة Jest-like mock
global.jest = {
  fn: function(implementation) {
    const mockFn = function(...args) {
      mockFn.mock.calls.push(args);
      mockFn.mock.results.push({ value: implementation ? implementation(...args) : undefined });
      return implementation ? implementation(...args) : undefined;
    };
    mockFn.mock = { calls: [], results: [] };
    mockFn.mockClear = () => {
      mockFn.mock.calls = [];
      mockFn.mock.results = [];
    };
    return mockFn;
  }
};
global.CacheService = {
  getScriptCache: jest.fn(() => ({
    get: jest.fn(() => null),
    put: jest.fn((key, value, ttl) => Logger.log(`[MockCache.put] ${key} cached.`)),
    remove: jest.fn((key) => Logger.log(`[MockCache.remove] ${key} removed.`))
  }))
};
global.UrlFetchApp = {
  fetch: jest.fn((url, options) => {
    Logger.log(`[MockUrlFetchApp.fetch] URL: ${url}, Options: ${JSON.stringify(options)}`);
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{ text: 'mocked Gemini response' }]
        },
        finishReason: 'STOP',
        safetyRatings: []
      }]
    };
    return {
      getResponseCode: () => 200,
      getContentText: () => JSON.stringify(mockResponse)
    };
  })
};
global.SpreadsheetApp = {
  getUi: jest.fn(() => ({
    showSidebar: jest.fn(),
    alert: jest.fn()
  }))
};
global.DocumentApp = {
  create: jest.fn(() => ({
    getBody: jest.fn(() => ({
      appendParagraph: jest.fn(() => ({ setHeading: jest.fn(), setItalic: jest.fn() })),
      appendTable: jest.fn(() => ({ getRow: jest.fn(() => ({ setAttributes: jest.fn() })), appendTableRow: jest.fn() })),
      appendHorizontalRule: jest.fn()
    })),
    getUrl: jest.fn(() => 'https://mock.docs.google.com/document/d/mockid')
  }))
};
global.HtmlService = {
  createTemplateFromFile: jest.fn((fileName) => ({
    evaluate: jest.fn(() => ({
      setTitle: jest.fn(() => ({
        // Simplified mock for chaining
      }))
    }))
  }))
};
global.MimeType = { PLAIN_TEXT: 'text/plain' };
// تم إزالة تعريف global.Logger هنا للسماح باستخدام خدمة Logger المدمجة في Apps Script.

// 3) تعريف Mocks للوحدات الأساسية التي سيتم حقنها
const mockUtils = {
  log: (msg, data) => Logger.log(`[MockUtils.log] ${msg} ${JSON.stringify(data || {})}`),
  warn: (msg, data) => Logger.warn(`[MockUtils.warn] ${msg} ${JSON.stringify(data || {})}`),
  error: (msg, data) => Logger.error(`[MockUtils.error] ${msg} ${JSON.stringify(data || {})}`),
  validateString: (val, name) => {
    if (typeof val !== 'string' || !val.trim()) {
      throw new Error(`${name} must be a non-empty string.`);
    }
  },
  validateNumber: (val, name) => {
    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error(`${name} must be a number.`);
    }
  },
  getSheet: jest.fn((sheetName, headers) => {
    Logger.log(`[MockUtils.getSheet] Called for ${sheetName}`);
    return {
      appendRow: jest.fn(row => Logger.log(`[MockSheet.appendRow] ${sheetName}: ${JSON.stringify(row)}`))
    };
  })
};

const mockConfig = {
  get: jest.fn((key) => {
    switch (key) {
      case 'API_KEY': return 'AIza_mock_api_key';
      case 'GEMINI_DEFAULT_MODEL': return 'gemini-1.5-pro-latest';
      case 'GEMINI_FLASH_MODEL': return 'gemini-1.5-flash';
      case 'AI_DISPATCHER_METRICS_SHEET': return 'AI_Dispatcher_Metrics_Test';
      case 'AI_GEMINI_METRICS_SHEET': return 'AI_Gemini_Metrics_Test';
      case 'AI_LONG_TERM_MEMORY_VERSION': return '1.0.1';
      case 'LTM_FOLDER_NAME': return 'G-Assistant_Memory_Test';
      case 'LTM_FILE_NAME': return 'long_term_log_test.json';
      case 'LTM_CACHE_TTL': return 600;
      case 'LTM_FUNCTION_DOC_TTL': return 21600;
      case 'AGENT_DISPATCHER_VERSION': return '1.0.2';
      case 'AGENT_DISPATCHER_METRICS_SHEET': return 'AgentDispatcher_Metrics_Test';
      case 'DEVELOPER_SIDEBAR_VERSION': return '1.1.1';
      case 'DEVELOPER_WORKSHOP_SHEET': return 'Developer_Workshop_Test';
      case 'TOOL_FILE_SUGGESTION_PATTERNS': return [
        { file: 'utils.gs', keywords: ['util', 'helper'], weight: 1 },
        { file: 'spreadsheet.gs', keywords: ['sheet', 'range'], weight: 2 }
      ];
      case 'AI_CORE_VERSION': return '1.0.0';
      case 'AI_INTENT_ANALYZER_VERSION': return '1.1.1';
      case 'AI_TOOL_EXECUTOR_VERSION': return '1.1.0';
      case 'DEVELOPER_TOOLS_VERSION': return '1.1.1';
      case 'AI_MEMORY_VERSION': return '1.0.0';
      default: return undefined;
    }
  })
};

const mockDocsManager = { registerModuleDocs: jest.fn() };
const mockTelemetry = { track: jest.fn(), logEvent: jest.fn() };
const mockUIDialogue = {
  createSuccess: jest.fn((text, data) => ({ type: 'success', text, data })),
  createError: jest.fn((text, data) => ({ type: 'error', text, data })),
  createWarning: jest.fn((text, data) => ({ type: 'warning', text, data })),
  createInfo: jest.fn((text, data) => ({ type: 'info', text, data })),
  createTable: jest.fn((title, headers, rows) => ({ type: 'table', title, headers, rows }))
};

const mockSecurity = { // Mock for Security.sanitize
  sanitize: jest.fn((text) => text)
};

// 4) تعريف GAssistant والكائنات الوهمية للوكلاء والأدوات
global.GAssistant = {
  Utils: {},
  AI: {},
  UI: {},
  Tools: {
    Catalog: {
      getFunction: jest.fn((name) => {
        Logger.log(`[GAssistant.Tools.Catalog.getFunction] Request for function: ${name}`);
        // Define mock implementations for functions that Tools.Developer might call
        if (name === 'Developer.reviewCode') return (args) => ({ type: 'code_analysis_result', analysis: 'Mocked reviewCode result', suggestedCode: ['// Mocked refactored code'], data: args });
        if (name === 'Developer.generateCode') return (args) => ({ type: 'code_analysis_result', analysis: 'Mocked generateCode result', suggestedCode: ['// Mocked generated code'], data: args });
        if (name === 'Developer.refactorCode') return (args) => ({ type: 'code_analysis_result', analysis: 'Mocked refactorCode result', suggestedCode: ['// Mocked refactored code'], data: args });
        if (name === 'Developer.addCommentsToCode') return (args) => ({ type: 'code_analysis_result', analysis: 'Mocked addCommentsToCode result', suggestedCode: ['// Mocked commented code'], data: args });
        if (name === 'Developer.explainCode') return (args) => ({ type: 'code_analysis_result', analysis: 'Mocked explainCode result', data: args });
        if (name === 'Developer.listFiles') return (args) => ({ type: 'success', text: 'Mocked listFiles result', data: args });
        if (name === 'Developer.runFunction') return (args) => ({ type: 'success', text: 'Mocked runFunction result', data: args });
        if (name === 'System.Info.getVersion') return (args) => ({ type: 'success', text: 'Mocked getVersion result', data: args });
        if (name === 'AI.Memory.clearSessionContext') return (args) => ({ type: 'success', text: 'Mocked clearSessionContext result', data: args });
        return null; // Important: return null if function not found
      }),
      getDeclarations: jest.fn(() => [ // Mock for exportToolsDocumentationToDoc
        { name: 'Developer.reviewCode', description: 'Reviews code.', parameters: { properties: { code: { type: 'STRING' } }, required: ['code'] } },
        { name: 'System.Info.getVersion', description: 'Gets version.', parameters: { properties: {}, required: [] } }
      ])
    },
    Accounting: { // Mock for Tools.Accounting.calculateGrossProfit
      calculateGrossProfit: jest.fn((args) => ({ type: 'table', text: 'Mocked gross profit table', data: args }))
    }
  },
  Agents: {
    Catalog: {
      registerAgent: jest.fn(),
      getAgent: jest.fn((name) => {
        if (name === 'developer') return mockDeveloperAgent;
        if (name === 'cfo') return mockCFOAgent;
        return null;
      })
    }
  },
  System: {}
};

// Mocks for Agent Handlers (used by AgentDispatcher)
const mockDeveloperAgent = {
  handleRequest: jest.fn(({ sessionId, message, intent }) => {
    Logger.log(`[MockDeveloperAgent.handleRequest] Received: ${message}, Intent: ${JSON.stringify(intent)}`);
    if (intent.type === 'tool_call' && intent.toolName.startsWith('Developer.')) {
      // Simulate calling the actual tool via GAssistant.Tools.Developer
      const toolFunctionName = intent.toolName.split('.')[1];
      const toolFunction = GAssistant.Tools.Developer[toolFunctionName];
      if (typeof toolFunction === 'function') {
        return toolFunction(intent.args); // Execute the actual mocked tool
      }
    }
    return { type: 'success', text: `Developer task completed.` }; // Generic success
  })
};

const mockCFOAgent = {
  handleRequest: jest.fn(({ sessionId, message, intent }) => {
    Logger.log(`[MockCFOAgent.handleRequest] Received: ${message}, Intent: ${JSON.stringify(intent)}`);
    return { type: 'success', text: 'CFO analysis done.' };
  })
};


// 5) Injector Mock: يجب أن يعكس الكائنات المعرفة في GAssistant
GAssistant.Utils.Injector = {
  get: jest.fn((...moduleNames) => {
    const resolved = {};
    moduleNames.forEach(name => {
      // Basic resolution: assume System.Utils.Injector.get('Utils') maps to GAssistant.Utils.Utils
      // and System.AI.Core maps to GAssistant.AI.Core etc.
      const parts = name.split('.');
      let current = GAssistant;
      for (let i = 0; i < parts.length; i++) {
        if (!current[parts[i]]) {
          Logger.warn(`Injector: Module part ${parts[i]} not found for ${name}. Returning empty object.`);
          current[parts[i]] = {}; // Create an empty object to avoid errors
        }
        current = current[parts[i]];
      }
      resolved[parts[parts.length - 1]] = current;
    });
    return resolved;
  })
};


// 6) تعريف الوحدات بترتيب التبعيات
// 02_utils.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = { Config: mockConfig, DocsManager: mockDocsManager, Telemetry: mockTelemetry };
    const moduleExports = factory(dependencies);
    GAssistant.Utils.Utils = moduleExports;
  };
  defineModule('System.Utils', ({ Config, DocsManager, Telemetry }) => {
    return mockUtils; // Use the mockUtils for System.Utils
  });
})();

// 01_config.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {}; // Config has no dependencies in this mock setup
    const moduleExports = factory(dependencies);
    GAssistant.System.Config = moduleExports; // Store in System.Config
  };
  defineModule('System.Config', () => mockConfig);
})();


// 20_ai/2_ai_longTermMemory.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      Telemetry: mockTelemetry
    };
    const moduleExports = factory(dependencies);
    GAssistant.AI.LongTermMemory = moduleExports;
  };
  /**
   * @file 20_ai/2_ai_longTermMemory.gs
   * @module System.AI.LongTermMemory
   * @version 1.0.1
   * @author عبدالعزيز
   * @description
   * وحدة لإدارة الذاكرة طويلة الأمد لنظام الذكاء الاصطناعي باستخدام Google Drive وCacheService.
   */
  'use strict';
  defineModule('System.AI.LongTermMemory', ({ Utils, Config, DocsManager, Telemetry }) => {
    const MODULE_VERSION = Config.get('AI_LONG_TERM_MEMORY_VERSION') || '1.0.1';
    const FOLDER_NAME = Config.get('LTM_FOLDER_NAME') || "G-Assistant_Memory";
    const FILE_NAME = Config.get('LTM_FILE_NAME') || "long_term_log.json";
    const CACHE_KEY_PREFIX = 'ltm_cache_';
    const CACHE_DURATION_SECONDS = Config.get('LTM_CACHE_TTL') || 600;
    const FUNCTION_DOC_CACHE_TTL = Config.get('LTM_FUNCTION_DOC_TTL') || 21600;
    const METRICS_SHEET = 'AI_LongTermMemory_Metrics';

    DocsManager.registerModuleDocs('System.AI.LongTermMemory', [
      { name: 'save', version: MODULE_VERSION, description: 'يحفظ حدثًا أو قطعة من الذاكرة.' },
      { name: 'load', version: MODULE_VERSION, description: 'يحمل سجل الذاكرة طويلة الأمد.' },
      { name: 'search', version: MODULE_VERSION, description: 'يبحث في الذاكرة طويلة الأمد.' },
      { name: 'getEventsGroupedBySource', version: MODULE_VERSION, description: 'يجمع الأحداث من الذاكرة طويلة الأمد.' },
      { name: 'cacheFunctionDoc', version: MODULE_VERSION, description: 'يخزن توثيق دالة معينة في الكاش.' },
      { name: 'getCachedFunctionDoc', version: MODULE_VERSION, description: 'يسترجع توثيق دالة من الكاش.' }
    ]);

    function _recordInvocation(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const record = { module: 'AI.LongTermMemory', function: action, version: MODULE_VERSION, timestamp: ts, status, durationMs, ...meta };
      Telemetry.track('AI.LongTermMemory.Invocation', record);
      const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'EventCount', 'FunctionName', 'ErrorMessage']);
      if (sheet) sheet.appendRow([new Date(), action, status, durationMs, MODULE_VERSION, meta.eventCount || '', meta.functionName || '', meta.errorMessage || '']);
      else Utils.warn(`AI.LongTermMemory._recordInvocation: Missing sheet '${METRICS_SHEET}'.`);
    }

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

    function save(eventType, data) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try {
        Utils.validateString(eventType, 'eventType');
        if (typeof data !== 'object' || data === null) throw new Error('Data to save must be a non-null object.');
        const logFile = _getLogFile();
        const history = JSON.parse(logFile.getBlob().getDataAsString());
        history.push({ timestamp: new Date().toISOString(), type: eventType, content: data });
        logFile.setContent(JSON.stringify(history, null, 2));
        CacheService.getScriptCache().remove(CACHE_KEY_PREFIX + FILE_NAME);
        status = 'success'; Utils.log('AI.LongTermMemory: Event saved and cache invalidated.', { eventType }); return { type: 'success', text: 'Event saved.' };
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`AI.LongTermMemory.save failed: ${errorMessage}`, e.stack); return { type: 'error', text: `Failed to save event: ${errorMessage}` }; } finally { _recordInvocation('save', status, Date.now() - start, { eventType, errorMessage }); }
    }

    function load(count = 10) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let events = [];
      try {
        const cache = CacheService.getScriptCache();
        const cached = cache.get(CACHE_KEY_PREFIX + FILE_NAME);
        if (cached) { events = JSON.parse(cached); status = 'cached'; Utils.log('AI.LongTermMemory: Cache hit. Loading from Cache.'); }
        else { Utils.log('AI.LongTermMemory: Cache miss. Loading from Drive.'); const history = JSON.parse(_getLogFile().getBlob().getDataAsString()); cache.put(CACHE_KEY_PREFIX + FILE_NAME, JSON.stringify(history), CACHE_DURATION_SECONDS); events = history; status = 'success'; }
        return events.slice(-count);
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`AI.LongTermMemory.load failed: ${errorMessage}`, e.stack); return []; } finally { _recordInvocation('load', status, Date.now() - start, { count, eventCount: events.length, errorMessage }); }
    }

    function search({ query, limit = 5, relevanceThreshold = 0.5 }) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let relevantItems = [];
      try {
        Utils.validateString(query, 'query'); const allEvents = load(100); const lowerCaseQuery = query.toLowerCase();
        for (const event of allEvents) {
          const eventText = JSON.stringify(event.content || event.type || '').toLowerCase();
          if (eventText.includes(lowerCaseQuery)) { relevantItems.push(event); if (relevantItems.length >= limit) break; }
        }
        status = 'success'; return relevantItems;
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`AI.LongTermMemory.search failed: ${errorMessage}`, e.stack); return []; } finally { _recordInvocation('search', status, Date.now() - start, { query, limit, foundCount: relevantItems.length, errorMessage }); }
    }

    function getEventsGroupedBySource({ limit = 50 } = {}) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let grouped = {};
      try {
        Utils.validateNumber(limit, 'limit'); const allEvents = load(limit);
        grouped = allEvents.reduce((acc, event) => { const source = event.content?.source || event.type || "unknown"; if (!acc[source]) { acc[source] = []; } acc[source].push(event); return acc; }, {});
        status = 'success'; Utils.log(`AI.LongTermMemory: Events grouped by source. Found ${Object.keys(grouped).length} sources.`); return grouped;
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`AI.LongTermMemory.getEventsGroupedBySource failed: ${errorMessage}`, e.stack); return {}; } finally { _recordInvocation('getEventsGroupedBySource', status, Date.now() - start, { limit, sourceCount: Object.keys(grouped).length, errorMessage }); }
    }

    function cacheFunctionDoc(functionName, documentation) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try {
        Utils.validateString(functionName, 'functionName'); Utils.validateString(documentation, 'documentation');
        const cache = CacheService.getScriptCache(); cache.put(CACHE_KEY_PREFIX + `doc_${functionName}`, documentation, FUNCTION_DOC_CACHE_TTL); status = 'success';
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`AI.LongTermMemory.cacheFunctionDoc failed: ${errorMessage}`, e.stack); } finally { _recordInvocation('cacheFunctionDoc', status, Date.now() - start, { functionName, errorMessage }); }
    }

    function getCachedFunctionDoc(functionName) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let doc = null;
      try {
        Utils.validateString(functionName, 'functionName'); const cache = CacheService.getScriptCache();
        doc = cache.get(CACHE_KEY_PREFIX + `doc_${functionName}`); status = doc ? 'cached' : 'not_found'; return doc;
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`AI.LongTermMemory.getCachedFunctionDoc failed: ${errorMessage}`, e.stack); return null; } finally { _recordInvocation('getCachedFunctionDoc', status, Date.now() - start, { functionName, errorMessage, docFound: !!doc }); }
    }

    return { save, load, search, getEventsGroupedBySource, cacheFunctionDoc, getCachedFunctionDoc };
  });
})();


// 20_ai/6_ai_geminiAdapter.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      AI: { LongTermMemory: GAssistant.AI.LongTermMemory, Telemetry: mockTelemetry }
    };
    const moduleExports = factory(dependencies);
    GAssistant.AI.GeminiAdapter = moduleExports;
  };
  /**
   * @file 20_ai/6_ai_geminiAdapter.gs
   * @module System.AI.GeminiAdapter
   * @version 2.0.1
   * @author عبدالعزيز
   * @description
   * وحدة وسيط موحدة لاستدعاء نموذج Gemini API مباشرة.
   */
  'use strict';
  defineModule('System.AI.GeminiAdapter', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
    const MODULE_VERSION = Config.get('GEMINI_ADAPTER_VERSION') || '2.0.1';
    const DEFAULT_MODEL = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-1.5-pro-latest';
    const METRICS_SHEET = Config.get('AI_GEMINI_METRICS_SHEET') || 'AI_Gemini_Metrics';
    const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

    DocsManager.registerModuleDocs('System.AI.GeminiAdapter', [
      { name: 'callGeminiApi', version: MODULE_VERSION, description: 'يرسل حمولة إلى Gemini API.' },
      { name: 'healthCheck', version: MODULE_VERSION, description: 'يجري فحصًا بسيطًا.' }
    ]);

    function _record(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const rec = { module: 'System.AI.GeminiAdapter', action, version: MODULE_VERSION, timestamp: ts, status, durationMs, ...meta };
      AI.LongTermMemory.save('GeminiAdapterInvocation', rec);
      Telemetry.track('AI.GeminiAdapter.Invocation', rec);
      const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Model', 'DurationMs', 'Status', 'Version', 'PromptLength', 'ResponseLength', 'ErrorMessage']);
      if (sheet) sheet.appendRow([new Date(), action, meta.model || DEFAULT_MODEL, durationMs, status, MODULE_VERSION, meta.promptLength || 0, meta.responseLength || 0, meta.errorMessage || '']);
      else Utils.warn(`System.AI.GeminiAdapter._record: Missing sheet '${METRICS_SHEET}'.`);
    }

    function callGeminiApi({ model, payload }) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let rawText = '';
      try {
        if (!model || typeof model !== 'string') throw new Error('Model name is required.');
        if (!payload || typeof payload !== 'object') throw new Error('Payload object is required.');
        const endpoint = `${API_BASE_URL}/models/${model}:generateContent?key=${Config.get('API_KEY')}`;
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true };
        Utils.log(`GeminiAdapter: calling API at ${endpoint}`);
        const response = UrlFetchApp.fetch(endpoint, options);
        rawText = response.getContentText(); const code = response.getResponseCode();
        if (code >= 200 && code < 300) { status = 'success'; return JSON.parse(rawText); }
        else { status = 'api_error'; errorMessage = `HTTP ${code}: ${rawText}`; throw new Error(errorMessage); }
      } catch (e) { status = status === 'api_error' ? 'api_error' : 'exception'; errorMessage = e.message; Utils.error(`GeminiAdapter: ${errorMessage}`, e.stack); throw e; } finally { const duration = Date.now() - start; _record('callGeminiApi', status, duration, { model, promptLength: JSON.stringify(payload).length, responseLength: rawText.length, errorMessage }); }
    }

    function healthCheck() {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let responseLength = 0;
      const testPromptPayload = { contents: [{ role: 'user', parts: [{ text: 'ping' }] }] };
      try {
        const result = callGeminiApi({ model: DEFAULT_MODEL, payload: testPromptPayload });
        const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textPart) { status = 'success'; responseLength = JSON.stringify(result).length; return { type: 'success', text: 'Gemini API is reachable.' }; }
        else { status = 'invalid_response'; errorMessage = 'API reachable but returned invalid content for health check.'; responseLength = JSON.stringify(result).length; return { type: 'error', text: errorMessage }; }
      } catch (e) { status = 'exception'; errorMessage = e.message; return { type: 'error', text: `Health check failed: ${errorMessage}` }; } finally { const duration = Date.now() - start; _record('healthCheck', status, duration, { model: DEFAULT_MODEL, promptLength: JSON.stringify(testPromptPayload).length, responseLength: responseLength, errorMessage: errorMessage }); }
    }
    return { callGeminiApi, healthCheck };
  });
})();


// 20_ai/5_ai_toolExecutor.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      AI: { LongTermMemory: GAssistant.AI.LongTermMemory, Telemetry: mockTelemetry },
      Tools: GAssistant.Tools // Access to GAssistant.Tools.Catalog
    };
    const moduleExports = factory(dependencies);
    GAssistant.AI.ToolExecutor = moduleExports;
  };
  /**
   * @file 20_ai/5_ai_toolExecutor.gs
   * @module System.AI.ToolExecutor
   * @version 1.1.0
   * @description
   * وحدة تنفيذ الأدوات (Tool Executor): مسؤولة عن تلقي استدعاءات الدوال المقترحة من نموذج AI.
   */
  'use strict';
  defineModule('System.AI.ToolExecutor', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
    const MODULE_VERSION = Config.get('AI_TOOL_EXECUTOR_VERSION') || '1.1.0';
    const METRICS_SHEET = 'AI_ToolExecutor_Metrics';

    DocsManager.registerModuleDocs('System.AI.ToolExecutor', [
      { name: 'executeFunctionCall', version: MODULE_VERSION, description: 'ينفذ دالة محددة من كتالوج الأدوات.' }
    ]);

    function _validateInputs(functionName, args) {
      if (typeof functionName !== 'string' || !functionName.trim()) throw new Error('AI.ToolExecutor: functionName must be a non-empty string.');
      if (args !== undefined && (typeof args !== 'object' || args === null)) throw new Error('AI.ToolExecutor: args must be an object if provided.');
    }

    function _recordInvocation(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const record = { module: 'AI.ToolExecutor', function: action, version: MODULE_VERSION, timestamp: ts, status, durationMs, ...meta };
      AI.LongTermMemory.save('ToolExecutorInvocation', record);
      Telemetry.track('AI.ToolExecutor.Execute', record);
      const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'FunctionName', 'ErrorMessage']);
      if (sheet) sheet.appendRow([new Date(), action, status, durationMs, MODULE_VERSION, meta.functionName || '', meta.errorMessage || '']);
      else Utils.warn(`AI.ToolExecutor._recordInvocation: Missing sheet '${METRICS_SHEET}'.`);
    }

    function executeFunctionCall(functionName, args = {}) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let result = null;
      try {
        _validateInputs(functionName, args);
        Utils.log(`AI.ToolExecutor: Attempting to execute tool: '${functionName}' with args: ${JSON.stringify(args)}`);
        const callableFunction = Tools.Catalog.getFunction(functionName);
        if (typeof callableFunction !== 'function') { status = 'tool_not_found'; errorMessage = `Function '${functionName}' not found or is not callable in Tools.Catalog.`; Utils.warn(`AI.ToolExecutor: ${errorMessage}`); return { type: 'error', text: errorMessage }; }
        result = callableFunction(args);
        status = 'success'; Utils.log(`AI.ToolExecutor: Successfully executed tool: '${functionName}'.`); return { type: 'tool_result', data: result };
      } catch (e) { status = 'execution_error'; errorMessage = e.message; Utils.error(`AI.ToolExecutor: ${errorMessage}`, e.stack); return { type: 'error', text: errorMessage }; } finally { const duration = Date.now() - start; _recordInvocation('executeFunctionCall', status, duration, { functionName, errorMessage }); }
    }
    return { executeFunctionCall };
  });
})();


// 20_ai/3_intentAnalyzer.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      AI: { LongTermMemory: GAssistant.AI.LongTermMemory, Telemetry: mockTelemetry },
      Tools: GAssistant.Tools // For Tools.Catalog if needed
    };
    const moduleExports = factory(dependencies);
    GAssistant.AI.IntentAnalyzer = moduleExports;
  };
  /**
   * @file 20_ai/3_intentAnalyzer.gs
   * @module System.AI.IntentAnalyzer
   * @version 1.1.1
   * @description
   * وحدة تحليل نية المستخدم: تقوم بمعالجة استعلام المستخدم لتحديد النية الكامنة.
   */
  'use strict';
  defineModule('System.AI.IntentAnalyzer', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
    const MODULE_VERSION = Config.get('AI_INTENT_ANALYZER_VERSION') || '1.1.1';
    const METRICS_SHEET = 'AI_IntentAnalyzer_Metrics';
    const INTENTS_RULES = {
      CLEAR_MEMORY: /(مسح الذاكرة|إعادة تعيين الذاكرة|امسح ذاكرتي)/i,
      GET_VERSION: /(ما هو إصدارك|معلومات عنك|إصدارك|نسختك)/i,
      CODE_REVIEW: /(راجع الكود|مراجعة الكود|فحص الكود)/i,
      GENERATE_CODE: /(إنشاء كود|توليد كود|اكتب كود|اكتب لي دالة)/i,
      REFACTOR_CODE: /(إعادة هيكلة الكود|تحسين الكود|هيكل الكود)/i,
      ADD_COMMENTS: /(أضف تعليقات|تعليق على الكود)/i,
      EXPLAIN_CODE: /(اشرح الكود|شرح الكود|كيف يعمل هذا الكود)/i,
      LIST_FILES: /(عرض الملفات|قائمة الملفات|أظهر لي الملفات)/i,
      RUN_FUNCTION: /(تشغيل الدالة|نفذ الدالة|استدعي الدالة)\s+([a-zA-Z0-9_.]+)/i,
    };

    DocsManager.registerModuleDocs('System.AI.IntentAnalyzer', [
      { name: 'detectIntent', version: MODULE_VERSION, description: 'يحلل استعلام المستخدم لتحديد النية.' }
    ]);

    function _recordInvocation(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const recordData = { module: 'AI.IntentAnalyzer', function: action, version: MODULE_VERSION, timestamp: ts, status, durationMs, ...meta };
      AI.LongTermMemory.save('IntentAnalyzerInvocation', recordData);
      Telemetry.track('AI.IntentAnalyzer.Invocation', recordData);
      const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'PromptLength', 'DetectedIntentType', 'DetectedToolName']);
      if (sheet) sheet.appendRow([new Date(), action, status, durationMs, MODULE_VERSION, meta.promptLength || 0, meta.detectedIntentType || 'N/A', meta.detectedToolName || 'N/A']);
      else Utils.warn(`AI.IntentAnalyzer._recordInvocation: Failed to get sheet '${METRICS_SHEET}'.`);
    }

    function _validateInputs(userPrompt) {
      if (typeof userPrompt !== 'string' || !userPrompt.trim()) throw new Error('AI.IntentAnalyzer.detectIntent: userPrompt must be a non-empty string.');
    }

    function detectIntent({ userPrompt }) {
      const start = Date.now(); let status = 'no_match'; let detectedIntent = { type: 'general_query', originalPrompt: userPrompt };
      const lowerCasePrompt = userPrompt.toLowerCase();
      try {
        _validateInputs(userPrompt);
        Utils.log(`AI.IntentAnalyzer: Detecting intent for prompt: '${userPrompt.substring(0, 50)}...'`);
        for (const [intentType, pattern] of Object.entries(INTENTS_RULES)) {
          const match = lowerCasePrompt.match(pattern);
          if (match) {
            status = 'tool_call';
            switch (intentType) {
              case 'CLEAR_MEMORY': detectedIntent = { type: 'tool_call', toolName: 'AI.Memory.clearSessionContext', args: {}, originalPrompt: userPrompt }; break;
              case 'GET_VERSION': detectedIntent = { type: 'tool_call', toolName: 'System.Info.getVersion', args: {}, originalPrompt: userPrompt }; break;
              case 'CODE_REVIEW': detectedIntent = { type: 'tool_call', toolName: 'Developer.reviewCode', args: { originalQuery: userPrompt }, originalPrompt: userPrompt }; break;
              case 'GENERATE_CODE': detectedIntent = { type: 'tool_call', toolName: 'Developer.generateCode', args: { description: userPrompt }, originalPrompt: userPrompt }; break;
              case 'REFACTOR_CODE': detectedIntent = { type: 'tool_call', toolName: 'Developer.refactorCode', args: { request: userPrompt }, originalPrompt: userPrompt }; break;
              case 'ADD_COMMENTS': detectedIntent = { type: 'tool_call', toolName: 'Developer.addCommentsToCode', args: { request: userPrompt }, originalPrompt: userPrompt }; break;
              case 'EXPLAIN_CODE': detectedIntent = { type: 'tool_call', toolName: 'Developer.explainCode', args: { request: userPrompt }, originalPrompt: userPrompt }; break;
              case 'LIST_FILES': detectedIntent = { type: 'tool_call', toolName: 'Developer.listFiles', args: {}, originalPrompt: userPrompt }; break;
              case 'RUN_FUNCTION':
                const funcNameMatch = match[2]; let funcArgs = {};
                const argsMatch = userPrompt.match(/\(([^)]*)\)/);
                if (argsMatch && argsMatch[1]) {
                  try { funcArgs = JSON.parse(`{${argsMatch[1]}}`); }
                  catch (e) { Utils.warn(`AI.IntentAnalyzer: Failed to parse args for ${funcNameMatch}: ${argsMatch[1]}`, e); detectedIntent = { type: 'clarification_needed', originalPrompt: userPrompt, errorMessage: `Failed to parse arguments for function '${funcNameMatch}'. Please provide arguments in valid JSON format.` }; status = 'clarification_needed'; break; }
                }
                detectedIntent = { type: 'tool_call', toolName: `Developer.runFunction`, args: { functionName: funcNameMatch, ...funcArgs }, originalPrompt: userPrompt }; break;
              default: status = 'unhandled_tool_intent'; detectedIntent = { type: 'general_query', originalPrompt: userPrompt }; break;
            }
            if (detectedIntent.type !== 'general_query' && detectedIntent.type !== 'clarification_needed') break;
          }
        }
      } catch (e) { status = 'exception'; Utils.error(`AI.IntentAnalyzer.detectIntent: An error occurred: ${e.message}`, e.stack); detectedIntent = { type: 'clarification_needed', originalPrompt: userPrompt, errorMessage: e.message }; } finally { const duration = Date.now() - start; _recordInvocation('detectIntent', status, duration, { promptLength: userPrompt.length, detectedIntentType: detectedIntent.type, detectedToolName: detectedIntent.toolName || 'N/A' }); }
      return detectedIntent;
    }
    return { detectIntent };
  });
})();


// 25_ai_agents/agent_dispatcher.gs (New module definition)
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      AI: {
        LongTermMemory: GAssistant.AI.LongTermMemory,
        Telemetry: mockTelemetry,
        IntentAnalyzer: GAssistant.AI.IntentAnalyzer,
        Core: null // Will be set later, handled by GAssistant.AI.Core
      },
      Agents: GAssistant.Agents, // For Agents.Catalog and specific agents
      UI: mockUIDialogue
    };
    const moduleExports = factory(dependencies);
    GAssistant.Agents.Dispatcher = moduleExports;
  };
  /**
   * @file 25_ai_agents/agent_dispatcher.gs
   * @module System.Agents.Dispatcher
   * @version 1.0.2
   * @description
   * وحدة موزع الوكلاء (Agent Dispatcher): مسؤولة عن تحليل نية المستخدم وتوجيه الطلب.
   */
  'use strict';

  defineModule('System.Agents.Dispatcher', ({ Utils, Config, DocsManager, AI, Agents, UI }) => {
    const MODULE_VERSION = Config.get('AGENT_DISPATCHER_VERSION') || '1.0.2';
    const METRICS_SHEET = Config.get('AGENT_DISPATCHER_METRICS_SHEET') || 'AgentDispatcher_Metrics';

    DocsManager.registerModuleDocs('System.Agents.Dispatcher', [
      { name: 'dispatch', version: MODULE_VERSION, description: 'يحلل رسالة المستخدم ويوزعها.' }
    ]);

    function _recordInvocation(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const rec = { module: 'System.Agents.Dispatcher', action, version: MODULE_VERSION, timestamp: ts, status, durationMs, ...meta };
      AI.LongTermMemory.save('AgentDispatcherInvocation', rec);
      Telemetry.track('AgentDispatcher.Invocation', rec);
      const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'SessionId', 'AgentDispatched', 'IntentType', 'ToolName', 'ErrorMessage']);
      if (sheet) sheet.appendRow([new Date(), action, status, durationMs, MODULE_VERSION, meta.sessionId || '', meta.agentDispatched || '', meta.intentType || '', meta.toolName || '', meta.errorMessage || '']);
      else Utils.warn(`System.Agents.Dispatcher._recordInvocation: Missing sheet '${METRICS_SHEET}'.`);
    }

    function dispatch({ sessionId, message }) {
      const start = Date.now(); let status = 'error'; let errorMessage = ''; let agentDispatched = ''; let intentType = ''; let toolName = '';
      let response = UI.createError('حدث خطأ غير متوقع في الموزع.');
      try {
        Utils.validateString(sessionId, 'sessionId'); Utils.validateString(message, 'message');
        const intent = AI.IntentAnalyzer.detectIntent({ userPrompt: message });
        intentType = intent.type; toolName = intent.toolName || '';
        Utils.log(`AgentDispatcher: Detected intent: ${JSON.stringify(intent)}`);

        if (intent.type === 'tool_call' && intent.toolName) {
          const agentMap = {
            'Developer.': 'developer',
            'System.Info.': 'developer',
            'AI.Memory.': 'developer',
          };
          for (const prefix in agentMap) { if (intent.toolName.startsWith(prefix)) { agentDispatched = agentMap[prefix]; break; } }
          if (agentDispatched) {
            const agent = Agents.Catalog.getAgent(agentDispatched);
            if (agent && typeof agent.handleRequest === 'function') { response = agent.handleRequest({ sessionId, message, intent }); status = response.type === 'error' ? 'agent_error' : 'success'; }
            else { Utils.warn(`AgentDispatcher: Agent '${agentDispatched}' not found or cannot handle request. Falling back to AI.Core.`); response = AI.Core.ask(message, { sessionId }); status = 'fallback_to_core'; }
          } else {
            Utils.warn(`AgentDispatcher: No specific agent for tool '${intent.toolName}'. Falling back to AI.Core.`); response = AI.Core.ask(message, { sessionId }); status = 'fallback_to_core';
          }
        } else if (intent.type === 'general_query') {
          agentDispatched = 'cfo';
          const agent = Agents.Catalog.getAgent(agentDispatched);
          if (agent && typeof agent.handleRequest === 'function') { response = agent.handleRequest({ sessionId, message, intent }); status = response.type === 'error' ? 'agent_error' : 'success'; }
          else { Utils.warn(`AgentDispatcher: Default agent '${agentDispatched}' not found. Falling back to AI.Core.`); response = AI.Core.ask(message, { sessionId }); status = 'fallback_to_core'; }
        } else if (intent.type === 'clarification_needed') {
          response = UI.createWarning(intent.errorMessage || 'الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.'); status = 'clarification_needed';
        } else {
          Utils.error(`AgentDispatcher: Unexpected intent type: ${intent.type}`); response = UI.createError('حدث خطأ غير متوقع في تحليل النية.'); status = 'unexpected_intent_type';
        }
        return response;
      } catch (e) { errorMessage = e.message; Utils.error(`AgentDispatcher.dispatch failed: ${errorMessage}`, e.stack); status = 'exception'; return UI.createError(`💥 خطأ في توزيع الطلب: ${errorMessage}`); } finally { const duration = Date.now() - start; _recordInvocation('dispatch', status, duration, { sessionId, agentDispatched, intentType, toolName, errorMessage }); }
    }
    return { dispatch };
  });
})();


// 20_ai/ai_core.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      AI: {
        LongTermMemory: GAssistant.AI.LongTermMemory,
        Telemetry: mockTelemetry,
        GeminiAdapter: GAssistant.AI.GeminiAdapter,
        Dispatcher: GAssistant.AI.Dispatcher, // Now correctly defined
        ToolExecutor: GAssistant.AI.ToolExecutor
      },
      Tools: GAssistant.Tools
    };
    const moduleExports = factory(dependencies);
    GAssistant.AI.Core = moduleExports;
  };
  /**
   * @file 20_ai/ai_core.gs
   * @module System.AI.Core
   * @version 1.0.0
   * @description
   * الوحدة الأساسية للذكاء الاصطناعي، تتعامل مع التفاعل العام للنموذج.
   */
  'use strict';
  defineModule('System.AI.Core', ({ Utils, Config, DocsManager, AI, Telemetry, Tools }) => {
    const MODULE_VERSION = Config.get('AI_CORE_VERSION') || '1.0.0';
    const DEFAULT_MODEL = Config.get('GEMINI_DEFAULT_MODEL') || 'gemini-1.5-pro-latest';

    function askForCodeAnalysis({ userQuery, codeSnippet, projectContext }) {
      Utils.log(`[MockAI.Core.askForCodeAnalysis] User query: ${userQuery}`);
      return {
        type: 'code_analysis_result',
        analysis: `Mock analysis for: "${userQuery}". Code snippet length: ${codeSnippet ? codeSnippet.length : 0}`,
        suggestedCode: codeSnippet ? [`// Refactored mock code\n${codeSnippet}`] : null
      };
    }

    function ask(prompt, options = {}) {
      Utils.log(`[MockAI.Core.ask] Prompt: ${prompt}, Options: ${JSON.stringify(options)}`);
      const model = options.modelOverride || DEFAULT_MODEL;
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], ...options.generationConfig };
      
      try {
        const rawApiResponse = AI.GeminiAdapter.callGeminiApi({ model, payload });
        const processedResponse = AI.Dispatcher.processApiResponse({ apiResponse: rawApiResponse });
        return processedResponse;
      } catch (e) {
        Utils.error(`[MockAI.Core.ask] Error calling adapter or dispatcher: ${e.message}`);
        return { type: 'error', text: `AI.Core error: ${e.message}` };
      }
    }
    return { ask, askForCodeAnalysis };
  });
})();


// 25_ai_agents/agents_catalog.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      DocsManager: mockDocsManager
    };
    const moduleExports = factory(dependencies);
    GAssistant.Agents.Catalog = moduleExports;
  };
  /**
   * @file 25_ai_agents/agents_catalog.gs
   * @module System.Agents.Catalog
   * @description
   * كتالوج لتسجيل وإدارة الوكلاء (Agents) المتاحين في النظام.
   */
  'use strict';
  defineModule('System.Agents.Catalog', ({ Utils, DocsManager }) => {
    const registeredAgents = {};

    DocsManager.registerModuleDocs('System.Agents.Catalog', [
      { name: 'registerAgent', description: 'يسجل وكيلًا جديدًا.' },
      { name: 'getAgent', description: 'يجلب وكيلًا مسجلًا بالاسم.' }
    ]);

    function registerAgent(name, agentInstance) {
      Utils.validateString(name, 'Agent name');
      if (typeof agentInstance !== 'object' || agentInstance === null) throw new Error('Agent instance must be an object.');
      registeredAgents[name] = agentInstance;
      Utils.log(`Agents.Catalog: Agent '${name}' registered.`);
    }

    function getAgent(name) {
      Utils.validateString(name, 'Agent name');
      return registeredAgents[name];
    }
    return { registerAgent, getAgent };
  });
})();


// 25_ai_agents/agent_cfo.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      AI: { Core: GAssistant.AI.Core },
      UI: mockUIDialogue
    };
    const moduleExports = factory(dependencies);
    GAssistant.Agents.CFO = moduleExports;
    GAssistant.Agents.Catalog.registerAgent('cfo', GAssistant.Agents.CFO);
  };
  /**
   * @file 25_ai_agents/agent_cfo.gs
   * @module System.Agent.CFO
   * @description
   * وكيل المدير المالي (CFO Agent): يتعامل مع الاستعلامات المتعلقة بالبيانات المالية.
   */
  'use strict';
  defineModule('System.Agent.CFO', ({ Utils, AI, UI }) => {
    function handleRequest({ sessionId, message, intent }) {
      Utils.log(`[MockCFOAgent.handleRequest] CFO Agent received: ${message}`);
      // Simulate CFO agent logic using AI.Core
      const aiResponse = AI.Core.ask(`كم الربح هذا الشهر؟ ${message}`);
      return { type: 'success', text: `CFO analysis done.` }; // Simplified mock response
    }
    return { handleRequest };
  });
})();

// 25_ai_agents/agent_developer.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      AI: { Core: GAssistant.AI.Core, Tools: GAssistant.Tools },
      UI: mockUIDialogue
    };
    const moduleExports = factory(dependencies);
    GAssistant.Agents.Developer = moduleExports;
    GAssistant.Agents.Catalog.registerAgent('developer', GAssistant.Agents.Developer);
  };
  /**
   * @file 25_ai_agents/agent_developer.gs
   * @module System.Agent.Developer
   * @description
   * وكيل المطور (Developer Agent): يتعامل مع المهام المتعلقة بتطوير الكود.
   */
  'use strict';
  defineModule('System.Agent.Developer', ({ Utils, AI, UI }) => {
    function handleRequest({ sessionId, message, intent }) {
      Utils.log(`[MockDeveloperAgent.handleRequest] Developer Agent received: ${message}, Intent: ${JSON.stringify(intent)}`);
      if (intent.type === 'tool_call' && intent.toolName.startsWith('Developer.')) {
        const toolFunctionName = intent.toolName.split('.')[1];
        const toolFunction = GAssistant.Tools.Developer[toolFunctionName];
        if (typeof toolFunction === 'function') {
          return toolFunction(intent.args);
        } else {
          return UI.createError(`Developer Agent: Tool ${intent.toolName} not found.`);
        }
      }
      const aiResponse = AI.Core.ask(`كمطور، كيف يمكنني المساعدة بخصوص: ${message}`);
      return { type: 'success', text: `Developer task completed.` }; // Simplified mock response
    }
    return { handleRequest };
  });
})();


// 20_ai/4_tools_developer.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      AI: {
        Core: GAssistant.AI.Core, // Now correctly defined
        LongTermMemory: GAssistant.AI.LongTermMemory,
        Telemetry: mockTelemetry
      },
      Utils: GAssistant.Utils.Utils,
      DocsManager: mockDocsManager,
      Telemetry: mockTelemetry,
      Config: GAssistant.System.Config,
      Tools: GAssistant.Tools, // Access to GAssistant.Tools.Catalog
      UI: mockUIDialogue,
      Security: mockSecurity
    };
    const moduleExports = factory(dependencies);
    GAssistant.Tools.Developer = moduleExports;
  };
  /**
   * @file 20_ai/4_tools_developer.gs
   * @module System.Tools.Developer
   * @version 1.1.1
   * @description
   * مجموعة شاملة من الأدوات المخصصة لمساعدة المطورين.
   */
  'use strict';
  defineModule('System.Tools.Developer', ({ AI, Utils, DocsManager, Telemetry, Config, Tools, UI, Security }) => {
    const MODULE_VERSION = Config.get('DEVELOPER_TOOLS_VERSION') || '1.1.1';
    const METRICS_SHEET = 'DeveloperTools_Metrics';
    const DEVELOPER_WORKSHOP_SHEET = Config.get('DEVELOPER_WORKSHOP_SHEET') || 'Developer_Workshop';

    DocsManager.registerModuleDocs('System.Tools.Developer', [
      { name: 'reviewCode', version: MODULE_VERSION, description: 'يطلب من AI.Core تحليل ومراجعة كود.' },
      { name: 'generateCode', version: MODULE_VERSION, description: 'يطلب من AI.Core توليد دالة.' },
      { name: 'refactorCode', version: MODULE_VERSION, description: 'يطلب من AI.Core إعادة هيكلة الكود.' },
      { name: 'addCommentsToCode', version: MODULE_VERSION, description: 'يطلب من AI.Core إضافة تعليقات.' },
      { name: 'explainCode', version: MODULE_VERSION, description: 'يطلب من AI.Core شرح الكود.' },
      { name: 'reviewAndStageCode', version: MODULE_VERSION, description: 'تراجع الكود، تقترح ملفًا، ثم تجهز.' },
      { name: 'getBuiltinFunctionDoc', version: MODULE_VERSION, description: 'يجلب توثيق دالة مدمجة.' },
      { name: 'exportToolsDocumentationToDoc', version: MODULE_VERSION, description: 'يصدر توثيق الأدوات.' }
    ]);

    function _recordInvocation(action, status, durationMs, meta = {}) {
      const ts = new Date().toISOString();
      const recordData = { module: 'System.Tools.Developer', function: action, version: MODULE_VERSION, timestamp: ts, status, durationMs, ...meta };
      AI.LongTermMemory.save('DeveloperToolInvocation', recordData);
      Telemetry.track('DeveloperTool.Invocation', recordData);
      const sheet = Utils.getSheet(METRICS_SHEET, ['Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'CodeLength', 'DescriptionLength', 'Error']);
      if (sheet) sheet.appendRow([new Date(), action, status, durationMs, MODULE_VERSION, meta.codeLength || 0, meta.descriptionLength || 0, meta.errorMessage || '']);
      else Utils.warn(`System.Tools.Developer._recordInvocation: Failed to get sheet '${METRICS_SHEET}'.`);
    }

    function _collectProjectContext() {
      return { projectDescription: "هذا مشروع Google Apps Script لمساعد ذكاء اصطناعي.", existingFiles: ['01_main.gs', '02_utils.gs'], existingFunctions: Object.keys(GAssistant || {}).map(k => `GAssistant.${k}`) };
    }

    function reviewCode({ code, originalQuery = '' }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try { Utils.validateString(code, 'code'); const result = AI.Core.askForCodeAnalysis({ userQuery: originalQuery || 'راجع الكود المرفق', codeSnippet: code, projectContext: _collectProjectContext() }); status = result.type === 'code_analysis_result' ? 'success' : 'failed_ai_response'; return result; }
      catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.reviewCode failed: ${errorMessage}`, e.stack); return { type: 'error', text: `فشل مراجعة الكود: ${errorMessage}` }; } finally { _recordInvocation('reviewCode', status, Date.now() - start, { codeLength: code.length, originalQuery: originalQuery, errorMessage: errorMessage }); }
    }

    function generateCode({ description }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try { Utils.validateString(description, 'description'); const result = AI.Core.askForCodeAnalysis({ userQuery: `اكتب دالة لـ ${description}`, projectContext: _collectProjectContext() }); status = result.type === 'code_analysis_result' ? 'success' : 'failed_ai_response'; return result; }
      catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.generateCode failed: ${errorMessage}`, e.stack); return { type: 'error', text: `فشل توليد الكود: ${errorMessage}` }; } finally { _recordInvocation('generateCode', status, Date.now() - start, { descriptionLength: description.length, errorMessage: errorMessage }); }
    }

    function refactorCode({ code, request }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try { Utils.validateString(code, 'code'); Utils.validateString(request, 'request'); const result = AI.Core.askForCodeAnalysis({ userQuery: `أعد هيكلة هذا الكود بناءً على: ${request}`, codeSnippet: code, projectContext: _collectProjectContext() }); status = result.type === 'code_analysis_result' ? 'success' : 'failed_ai_response'; return result; }
      catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.refactorCode failed: ${errorMessage}`, e.stack); return { type: 'error', text: `فشل إعادة هيكلة الكود: ${errorMessage}` }; } finally { _recordInvocation('refactorCode', status, Date.now() - start, { codeLength: code.length, descriptionLength: request.length, errorMessage: errorMessage }); }
    }

    function addCommentsToCode({ code, request = '' }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try { Utils.validateString(code, 'code'); const userQuery = request ? `أضف تعليقات توضيحية لهذا الكود بناءً على: ${request}` : `أضف تعليقات توضيحية لهذا الكود.`; const result = AI.Core.askForCodeAnalysis({ userQuery: userQuery, codeSnippet: code, projectContext: _collectProjectContext() }); status = result.type === 'code_analysis_result' ? 'success' : 'failed_ai_response'; return result; }
      catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.addCommentsToCode failed: ${errorMessage}`, e.stack); return { type: 'error', text: `فشل إضافة التعليقات: ${errorMessage}` }; } finally { _recordInvocation('addCommentsToCode', status, Date.now() - start, { codeLength: code.length, descriptionLength: request.length, errorMessage: errorMessage }); }
    }

    function explainCode({ code }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try { Utils.validateString(code, 'code'); const result = AI.Core.askForCodeAnalysis({ userQuery: `اشرح هذا الكود بلغة طبيعية:`, codeSnippet: code, projectContext: _collectProjectContext() }); status = result.type === 'code_analysis_result' ? 'success' : 'failed_ai_response'; return result; }
      catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.explainCode failed: ${errorMessage}`, e.stack); return { type: 'error', text: `فشل شرح الكود: ${errorMessage}` }; } finally { _recordInvocation('explainCode', status, Date.now() - start, { codeLength: code.length, errorMessage: errorMessage }); }
    }

    function reviewAndStageCode({ functionCode, category }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try {
        Utils.validateString(functionCode, 'functionCode');
        const cleanFunctionCode = Security && typeof Security.sanitize === 'function' ? Security.sanitize(functionCode) : functionCode;
        Utils.log('System.Tools.Developer.reviewAndStageCode: Starting...', { codeLength: cleanFunctionCode.length });
        const reviewResult = AI.Core.askForCodeAnalysis({ userQuery: 'قم بمراجعة هذا الكود وقدم تقييمًا شاملاً له.', codeSnippet: cleanFunctionCode, projectContext: _collectProjectContext() });
        let reviewSummary = 'فشلت عملية المراجعة التلقائية.';
        if (reviewResult.type === 'code_analysis_result' && reviewResult.analysis) { reviewSummary = `ملخص المراجعة: ${reviewResult.analysis.substring(0, 200)}...`; if (reviewResult.suggestedCode) reviewSummary += `\nتم اقتراح كود جديد/معدل.`; status = 'success_review'; }
        else if (reviewResult.type === 'error') { reviewSummary = `خطأ في مراجعة الكود: ${reviewResult.text}`; status = 'error_review'; }
        else { reviewSummary = `استجابة غير متوقعة من مراجعة الكود: ${reviewResult.type}`; status = 'unexpected_review_response'; }
        const suggestedFile = _suggestTargetFile(cleanFunctionCode);
        const inferredCategory = category || _categorizeCode(cleanFunctionCode);
        const uiResponse = _stageCodeInWorkshop(cleanFunctionCode, suggestedFile, reviewSummary, inferredCategory);
        if (uiResponse.type === 'success') status = 'success_staged'; else status = 'error_staging';
        AI.LongTermMemory.save('ReviewAndStage', { source: 'ToolsDeveloper', category: inferredCategory, suggestedFile, codeLength: cleanFunctionCode.length, reviewSummary: reviewSummary.substring(0, 500), status: status });
        return uiResponse;
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.reviewAndStageCode failed: ${errorMessage}`, e.stack); return UI.createError(`فشل عملية المراجعة والتجهيز: ${errorMessage}`); } finally { _recordInvocation('reviewAndStageCode', status, Date.now() - start, { codeLength: functionCode.length, category: category, errorMessage: errorMessage }); }
    }

    function _stageCodeInWorkshop(code, file, summary, category) {
      const sheetName = DEVELOPER_WORKSHOP_SHEET; const headers = ['التاريخ', 'الفئة', 'الملف المقترح', 'ملخص المراجعة', 'الكود', 'الحالة'];
      const sheet = Utils.getSheet(sheetName, headers);
      if (!sheet) return UI.createError('فشل الوصول إلى ورشة عمل المطور.');
      sheet.appendRow([new Date(), category, file, summary, code, 'للمراجعة']);
      return UI.createInfo(`✅ تم تجهيز الكود في ورشة العمل: "${sheetName}".`);
    }

    function _suggestTargetFile(functionCode) {
      const text = (functionCode || '').toLowerCase(); const patterns = Config.get('TOOL_FILE_SUGGESTION_PATTERNS') || [];
      let bestMatch = { file: 'utils.gs', score: 0 }; const scores = {};
      patterns.forEach(p => { scores[p.file] = scores[p.file] || 0; p.keywords.forEach(kw => { if (text.includes(kw.toLowerCase())) scores[p.file] += p.weight; }); if (scores[p.file] > bestMatch.score) { bestMatch = { file: p.file, score: scores[p.file] }; } });
      return bestMatch.file;
    }

    function _categorizeCode(code) {
      const lc = (code || '').toLowerCase();
      if (lc.includes('accounting') || lc.includes('profit') || lc.includes('finance')) return 'أدوات مالية';
      if (lc.includes('sheet') || lc.includes('range') || lc.includes('spreadsheet')) return 'أدوات Sheets';
      if (lc.includes('sidebar') || lc.includes('menu') || lc.includes('ui')) return 'واجهة مستخدم';
      if (lc.includes('gemini') || lc.includes('prompt') || lc.includes('ai')) return 'ذكاء اصطناعي';
      if (lc.includes('auth') || lc.includes('permission')) return 'أمان وأذونات';
      return 'وظائف عامة';
    }

    function getBuiltinFunctionDoc({ functionName }) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try {
        Utils.validateString(functionName, 'functionName');
        const cached = AI.LongTermMemory.getCachedFunctionDoc(functionName);
        if (cached) { Utils.log('System.Tools.Developer.getBuiltinFunctionDoc: Retrieved from cache.', { functionName }); status = 'cached'; return { type: 'success', text: cached }; }
        const prompt = `قدم توثيقًا شاملاً لدالة Google Apps Script التالية: \`${functionName}\`. أعد الرد بصيغة Markdown.`;
        const result = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_FLASH_MODEL') || 'gemini-1.5-flash' });
        if (result.type === 'info' || result.type === 'text_response') {
          AI.LongTermMemory.cacheFunctionDoc(functionName, result.text);
          AI.LongTermMemory.save('GetBuiltinDoc', { source: 'ToolsDeveloper', functionName, status: 'fetched_from_api' });
          const docMetrics = Utils.getSheet('DeveloperDoc_Metrics', ['Timestamp', 'FunctionName', 'Status']);
          if (docMetrics) docMetrics.appendRow([new Date(), functionName, 'success']);
          status = 'success_fetched'; Utils.log('System.Tools.Developer.getBuiltinFunctionDoc: Fetched from API.', { functionName }); return result;
        } else { status = 'failed_ai_response'; throw new Error(`Failed to get doc from AI. Response type: ${result.type}, text: ${result.text || 'N/A'}`); }
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.getBuiltinFunctionDoc failed for '${functionName}': ${errorMessage}`, e.stack); return { type: 'error', text: `فشل جلب توثيق الدالة: ${errorMessage}` }; } finally { _recordInvocation('getBuiltinFunctionDoc', status, Date.now() - start, { functionName, errorMessage }); }
    }

    function exportToolsDocumentationToDoc() {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      try {
        const doc = DocumentApp.create(`توثيق أدوات G-Assistant - ${new Date().toLocaleDateString()}`); const body = doc.getBody();
        body.appendParagraph('توثيق أدوات G-Assistant').setHeading(DocumentApp.ParagraphHeading.TITLE);
        const allTools = Tools.Catalog.getDeclarations();
        if (!allTools || allTools.length === 0) throw new Error('لا توجد أدوات مسجلة لتصديرها.');
        allTools.forEach(tool => {
          body.appendParagraph(tool.name).setHeading(DocumentApp.ParagraphHeading.HEADING1); body.appendParagraph(tool.description).setItalic(true);
          const params = tool.parameters?.properties || {};
          if (Object.keys(params).length) {
            body.appendParagraph('المعاملات:').setHeading(DocumentApp.ParagraphHeading.HEADING2);
            const table = body.appendTable([['المعامل', 'النوع', 'الوصف', 'مطلوب؟']]);
            table.getRow(0).setAttributes({ [DocumentApp.Attribute.BOLD]: true, [DocumentApp.Attribute.BACKGROUND_COLOR]: '#f3f3f3' });
            (tool.parameters.required || []).forEach(name => { const p = params[name]; table.appendTableRow([name, `\`${p?.type || 'unknown'}\``, p?.description || 'N/A', 'نعم']); });
            for (const name in params) { if (!tool.parameters.required || !tool.parameters.required.includes(name)) { const p = params[name]; table.appendTableRow([name, `\`${p?.type || 'unknown'}\``, p?.description || 'N/A', 'لا']); } }
          }
          body.appendHorizontalRule();
        });
        AI.LongTermMemory.save('ExportToolsDoc', { source: 'ToolsDeveloper', docUrl: doc.getUrl(), exportedToolCount: allTools.length, status: 'success' });
        const expMetrics = Utils.getSheet('DeveloperExport_Metrics', ['Timestamp', 'DocUrl', 'ToolCount', 'Status']);
        if (expMetrics) expMetrics.appendRow([new Date(), doc.getUrl(), allTools.length, 'success']);
        status = 'success'; Utils.log('System.Tools.Developer.exportToolsDocumentationToDoc: Success', { url: doc.getUrl() }); return UI.createInfo(`✅ تم تصدير التوثيق. الرابط:\n${doc.getUrl()}`);
      } catch (e) { status = 'exception'; errorMessage = e.message; Utils.error(`System.Tools.Developer.exportToolsDocumentationToDoc failed: ${errorMessage}`, e.stack); return UI.createError(`فشل تصدير التوثيق: ${errorMessage}`); } finally { _recordInvocation('exportToolsDocumentationToDoc', status, Date.now() - start, { errorMessage: errorMessage }); }
    }
    return { reviewCode, generateCode, refactorCode, addCommentsToCode, explainCode, reviewAndStageCode, getBuiltinFunctionDoc, exportToolsDocumentationToDoc };
  });
})();


// 10_ui/2_ui_developerSidebar.gs
(function() {
  const defineModule = (name, factory) => {
    const dependencies = {
      Utils: GAssistant.Utils.Utils,
      Config: GAssistant.System.Config,
      DocsManager: mockDocsManager,
      AI: {
        LongTermMemory: GAssistant.AI.LongTermMemory,
        Telemetry: mockTelemetry,
        IntentAnalyzer: GAssistant.AI.IntentAnalyzer,
        Core: GAssistant.AI.Core // Now correctly defined
      },
      UI: mockUIDialogue
    };
    const moduleExports = factory(dependencies);
    GAssistant.UI.DeveloperSidebar = moduleExports;
  };
  /**
   * @file 10_ui/2_ui_developerSidebar.gs
   * @module System.UI.DeveloperSidebar
   * @version 1.1.1
   * @description
   * وحدة عرض شريط أدوات المطورين Sidebar داخل Google Sheets.
   */
  'use strict';
  defineModule('System.UI.DeveloperSidebar', ({ Utils, Config, DocsManager, AI, Telemetry, UI }) => {
    const MODULE_VERSION = Config.get('DEVELOPER_SIDEBAR_VERSION') || '1.1.1';
    const UI_METRICS_SHEET = 'UI_Metrics';

    DocsManager.registerModuleDocs('System.UI.DeveloperSidebar', [
      { name: 'showDeveloperSidebar', version: MODULE_VERSION, description: 'يفتح شريط أدوات المطور.' },
      { name: 'handleDeveloperRequest', version: MODULE_VERSION, description: 'يتلقى طلبات المستخدم ويعالجها.' }
    ]);

    function showDeveloperSidebar() {
      const start = Date.now(); let status = 'error';
      try {
        const html = HtmlService.createTemplateFromFile('DeveloperSidebar').evaluate().setTitle('🛠️ ورشة عمل المطورين');
        SpreadsheetApp.getUi().showSidebar(html);
        AI.LongTermMemory.save('DeveloperSidebarOpened', { module: 'UI.DeveloperSidebar', version: MODULE_VERSION, timestamp: new Date().toISOString() });
        Telemetry.track('UI.DeveloperSidebar.Open', { version: MODULE_VERSION, timestamp: new Date().toISOString() });
        const sheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action']);
        if (sheet) sheet.appendRow([new Date(), 'DeveloperSidebar', MODULE_VERSION, 'open']);
        status = 'success'; return UI.createInfo('تم فتح شريط أدوات المطور.');
      } catch (e) { status = 'exception'; Utils.error(`System.UI.DeveloperSidebar.showDeveloperSidebar failed: ${e.message}`, e.stack); return UI.createError(`فشل فتح شريط أدوات المطور: ${e.message}`); }
    }

    function handleDeveloperRequest(request) {
      const start = Date.now(); let status = 'error'; let errorMessage = '';
      let finalResponse = UI.createError('حدث خطأ غير متوقع في معالجة الطلب.');
      let intentType = ''; let toolName = '';
      try {
        Utils.validateString(request.action, 'action'); const sessionId = request.sessionId || 'default';
        AI.LongTermMemory.save('DeveloperSidebarRequest', { module: 'UI.DeveloperSidebar', version: MODULE_VERSION, request, timestamp: new Date().toISOString() });
        Telemetry.track('UI.DeveloperSidebar.Request', { version: MODULE_VERSION, action: request.action });
        const sheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action', 'RequestType']);
        if (sheet) sheet.appendRow([new Date(), 'DeveloperSidebar', MODULE_VERSION, 'request', 'user_prompt']);
        const intentResult = AI.IntentAnalyzer.detectIntent({ userPrompt: request.action });
        intentType = intentResult.type; toolName = intentResult.toolName || '';
        Utils.log(`UI.DeveloperSidebar: Intent detected: ${JSON.stringify(intentResult)}`);

        if (intentResult.type === 'tool_call' && intentResult.toolName) {
          Utils.log(`UI.DeveloperSidebar: Detected direct tool call: ${intentResult.toolName}`);
          Telemetry.track('UI.DeveloperSidebar.DirectToolCall', { toolName: intentResult.toolName, prompt: request.action });
          const [modulePrefix, toolFunctionName] = intentResult.toolName.split('.');
          if (GAssistant.Tools && GAssistant.Tools.Developer && typeof GAssistant.Tools.Developer[toolFunctionName] === 'function') {
            const toolFunction = GAssistant.Tools.Developer[toolFunctionName];
            const toolArgs = intentResult.args || {};
            if (request.code) toolArgs.code = request.code;
            if (request.description) toolArgs.description = request.description;
            if (request.action) toolArgs.originalQuery = request.action;
            finalResponse = toolFunction(toolArgs); status = finalResponse.type === 'error' ? 'tool_execution_error' : 'tool_executed';
          } else {
            Utils.warn(`UI.DeveloperSidebar: Detected tool '${intentResult.toolName}' not found or callable. Falling back to AI.Core.ask.`);
            finalResponse = AI.Core.ask(request.action, { sessionId: sessionId }); status = 'fallback_to_core';
          }
        } else if (intentResult.type === 'general_query') {
          Utils.log('UI.DeveloperSidebar: No direct tool detected. Passing to AI.Core.ask.');
          Telemetry.track('UI.DeveloperSidebar.GeneralQuery', { prompt: request.action });
          finalResponse = AI.Core.ask(request.action, { sessionId: sessionId }); status = 'general_query_to_core';
        } else if (intentResult.type === 'clarification_needed') {
          Utils.log('UI.DeveloperSidebar: Intent Analyzer needs clarification.');
          Telemetry.track('UI.DeveloperSidebar.ClarificationNeeded', { prompt: request.action, errorMessage: intentResult.errorMessage });
          finalResponse = UI.createWarning(intent.errorMessage || 'الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.'); status = 'clarification_needed';
        } else {
          Utils.error(`UI.DeveloperSidebar: Unexpected intent type from IntentAnalyzer: ${intentResult.type}`);
          finalResponse = UI.createError('حدث خطأ غير متوقع في تحليل النية.'); status = 'unexpected_intent_type';
        }
        return finalResponse;
      } catch (e) { errorMessage = e.message; Utils.error(`System.UI.DeveloperSidebar.handleDeveloperRequest failed: ${errorMessage}`, e.stack); status = 'exception'; return UI.createError(`💥 خطأ في معالجة طلب المطور: ${errorMessage}`); } finally {
        const duration = Date.now() - start;
        const metricsSheet = Utils.getSheet(UI_METRICS_SHEET, ['Timestamp', 'Component', 'Version', 'Action', 'Status', 'DurationMs', 'IntentType', 'ToolName', 'ErrorMessage']);
        if (metricsSheet) metricsSheet.appendRow([new Date(), 'DeveloperSidebar', MODULE_VERSION, 'handleRequest', status, duration, intentType, toolName, errorMessage]);
      }
    }
    return { showDeveloperSidebar, handleDeveloperRequest };
  });
})();


// 7) 60_tests/tests.gs (The main test module)
defineModule('System.Tests', ({ Utils, Telemetry }) => {
  /** @typedef {import('../03_types.gs').TestResult} TestResult */

  function _runSingleTest(testCase) {
    const startTime = Date.now();
    try {
      // Clear mocks before each test to ensure isolation
      mockUtils.getSheet.mockClear();
      mockUtils.getSheet('AI_Dispatcher_Metrics_Test').appendRow.mockClear();
      mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mockClear();
      mockUtils.getSheet('UI_Metrics').appendRow.mockClear();
      GAssistant.AI.IntentAnalyzer.detectIntent.mockClear();
      GAssistant.Agents.Catalog.getAgent.mockClear();
      mockDeveloperAgent.handleRequest.mockClear();
      mockCFOAgent.handleRequest.mockClear();
      mockUIDialogue.createWarning.mockClear();
      mockUIDialogue.createError.mockClear();
      mockUIDialogue.createInfo.mockClear();
      mockUIDialogue.createSuccess.mockClear();
      mockSpreadsheetApp.getUi().showSidebar.mockClear();
      mockHtmlService.createTemplateFromFile.mockClear();
      GAssistant.AI.GeminiAdapter.callGeminiApi.mockClear();
      GAssistant.Tools.Catalog.getFunction.mockClear(); // Clear this mock too

      const resultMessage = testCase.run();
      const duration = Date.now() - startTime;
      Utils.log(`Test PASSED: ${testCase.name}`, { duration });
      Telemetry?.logEvent({
        type: 'TEST_PASS',
        source: 'System.Tests',
        payload: { name: testCase.name, duration }
      });
      return { name: testCase.name, success: true, message: resultMessage || "نجح", duration };
    } catch (e) {
      const duration = Date.now() - startTime;
      Utils.error(`Test FAILED: ${testCase.name}`, e);
      Telemetry?.logEvent({
        type: 'TEST_FAIL',
        source: 'System.Tests',
        payload: { name: testCase.name, error: e.message, duration }
      });
      return { name: testCase.name, success: false, message: e.message, duration };
    }
  }

  const TEST_CASES = [
    {
      name: "Config: تحميل الإعدادات الأساسية",
      description: "يتأكد من أن وحدة Config قادرة على تحميل مفتاح API بنجاح.",
      run: () => {
        const { Config } = GAssistant.Utils.Injector.get('Config');
        const apiKey = Config.get('API_KEY');
        expect(typeof apiKey).toBe('string');
        expect(apiKey.startsWith("AIza")).toBe(true);
        return "تم جلب مفتاح API ويبدو صحيحًا.";
      }
    },
    {
      name: "Injector: حقن التبعيات الأساسية",
      description: "يتحقق من أن نظام Injector يمكنه جلب الوحدات الأساسية دون أخطاء.",
      run: () => {
        const { Utils, AI, UI } = GAssistant.Utils.Injector.get('Utils', 'AI', 'UI');
        expect(Utils).toBeDefined();
        expect(AI).toBeDefined();
        expect(UI).toBeDefined();
        return "تم حقن الوحدات الأساسية بنجاح.";
      }
    },
    {
      name: "Tools.Accounting: حساب الربح الإجمالي (Mocked)",
      description: "يختبر قدرة أداة المحاسبة على حساب الأرباح (باستخدام Mock).",
      run: () => {
        const { Tools } = GAssistant.Utils.Injector.get('Tools');
        const result = Tools.Accounting.calculateGrossProfit({ startDate: '2024-01-01', endDate: '2024-12-31' });
        expect(result.type).toBe('table');
        expect(result.text).toBe('Mocked gross profit table');
        return "تم حساب الربح بنجاح وأعيد كجدول (Mocked).";
      }
    },
    {
      name: "AI.Core: إرسال طلب بسيط للتحقق من الاتصال (Mocked Gemini)",
      description: "يجري استدعاء API حقيقي للتأكد من أن الاتصال بـ Gemini يعمل (عبر Mock Adapter).",
      run: () => {
        const { AI } = GAssistant.Utils.Injector.get('AI');
        const result = AI.Core.ask("مرحبا، أجب بكلمة 'ok' فقط.");
        expect(result.type).toBe('text_response');
        expect(result.text).toBe('mocked Gemini response');
        return "استجاب المساعد بنجاح. الاتصال بـ API سليم (عبر Mock Adapter).";
      }
    },
    {
      name: "Dev Agent: جلب كود المشروع عبر API (Mocked)",
      description: "يختبر قدرة وكيل المطور على استخدام Apps Script API لجلب كود المشروع (باستخدام Mock).",
      run: () => {
        const { Tools } = GAssistant.Utils.Injector.get('Tools');
        const result = Tools.Developer.listFiles();
        expect(result.type).toBe('success');
        expect(result.text).toBe('Mocked listFiles result');
        return "تم جلب كود المشروع بنجاح ويحتوي على الكود المتوقع (عبر Mock).";
      }
    },
    // === UI.Dialogue Tests ===
    {
      name: "UI.Dialogue: createSuccess_basic",
      description: "يتحقق من createSuccess بإدخال نص وبيانات.",
      run: () => {
        const resp = GAssistant.UI.Dialogue.createSuccess('تم بنجاح', { foo: 'bar' });
        expect(resp.type).toBe('success');
        expect(resp.text).toBe('تم بنجاح');
        expect(resp.data.foo).toBe('bar');
        return "createSuccess يعمل بشكل صحيح.";
      }
    },
    {
      name: "UI.Dialogue: createError_basic",
      description: "يتحقق من createError بإدخال نص الخطأ.",
      run: () => {
        const resp = GAssistant.UI.Dialogue.createError('خطأ ما');
        expect(resp.type).toBe('error');
        expect(resp.text).toBe('خطأ ما');
        return "createError يعمل بشكل صحيح.";
      }
    },
    {
      name: "UI.Dialogue: createWarning_basic",
      description: "يتحقق من createWarning بإدخال نص التحذير.",
      run: () => {
        const resp = GAssistant.UI.Dialogue.createWarning('تحذير');
        expect(resp.type).toBe('warning');
        expect(resp.text).toBe('تحذير');
        return "createWarning يعمل بشكل صحيح.";
      }
    },
    {
      name: "UI.Dialogue: createInfo_basic",
      description: "يتحقق من createInfo بإدخال نص المعلومة.",
      run: () => {
        const resp = GAssistant.UI.Dialogue.createInfo('معلومة');
        expect(resp.type).toBe('info');
        expect(resp.text).toBe('معلومة');
        return "createInfo يعمل بشكل صحيح.";
      }
    },
    {
      name: "UI.Dialogue: createTable_basic",
      description: "يتحقق من createTable بإدخال عنوان ورؤوس وصفوف.",
      run: () => {
        const headers = ['A', 'B'];
        const rows = [['1', '2'], ['3', '4']];
        const resp = GAssistant.UI.Dialogue.createTable('جدول', headers, rows);
        expect(resp.type).toBe('table');
        expect(resp.title).toBe('جدول');
        expect(Array.isArray(resp.headers)).toBe(true);
        expect(resp.headers.length).toBe(2);
        expect(Array.isArray(resp.rows)).toBe(true);
        expect(resp.rows.length).toBe(2);
        return "createTable يعمل بشكل صحيح.";
      }
    },
    // === AgentDispatcher Integration Tests ===
    {
      name: "AgentDispatcher: توجيه لـ Developer Agent (tool_call)",
      description: "يختبر توجيه رسالة المستخدم إلى وكيل المطور عند اكتشاف نية أداة.",
      run: () => {
        GAssistant.AI.IntentAnalyzer.detectIntent.mockReturnValueOnce({
          type: 'tool_call',
          toolName: 'Developer.reviewCode',
          args: { code: 'some code' },
          originalPrompt: 'راجع الكود'
        });

        const sessionId = 'testSessionDev';
        const message = 'راجع الكود التالي: function test() {}';
        const response = GAssistant.Agents.Dispatcher.dispatch({ sessionId, message });

        expect(response.type).toBe('code_analysis_result'); // Changed to match mockDeveloperAgent's behavior
        expect(response.analysis).toBe('Mocked reviewCode result'); // Changed to match mockDeveloperAgent's behavior
        expect(GAssistant.AI.IntentAnalyzer.detectIntent).toHaveBeenCalledWith({ userPrompt: message });
        expect(GAssistant.Agents.Catalog.getAgent).toHaveBeenCalledWith('developer');
        expect(mockDeveloperAgent.handleRequest).toHaveBeenCalledWith({
          sessionId: sessionId,
          message: message,
          intent: { type: 'tool_call', toolName: 'Developer.reviewCode', args: { code: 'some code' }, originalPrompt: 'راجع الكود' }
        });
        return "توجيه وكيل المطور يعمل بشكل صحيح.";
      }
    },
    {
      name: "AgentDispatcher: توجيه لـ CFO Agent (general_query)",
      description: "يختبر توجيه رسالة المستخدم إلى وكيل CFO عند اكتشاف نية استعلام عام.",
      run: () => {
        GAssistant.AI.IntentAnalyzer.detectIntent.mockReturnValueOnce({
          type: 'general_query',
          originalPrompt: 'كم الربح'
        });

        const sessionId = 'testSessionCFO';
        const message = 'كم الربح لهذا الربع؟';
        const response = GAssistant.Agents.Dispatcher.dispatch({ sessionId, message });

        expect(response.type).toBe('success');
        expect(response.text).toBe('CFO analysis done.');
        expect(GAssistant.AI.IntentAnalyzer.detectIntent).toHaveBeenCalledWith({ userPrompt: message });
        expect(GAssistant.Agents.Catalog.getAgent).toHaveBeenCalledWith('cfo');
        expect(mockCFOAgent.handleRequest).toHaveBeenCalledWith({
          sessionId: sessionId,
          message: message,
          intent: { type: 'general_query', originalPrompt: 'كم الربح' }
        });
        return "توجيه وكيل CFO يعمل بشكل صحيح.";
      }
    },
    {
      name: "AgentDispatcher: توجيه لـ Clarification Needed",
      description: "يختبر استجابة AgentDispatcher برسالة تحذير عند اكتشاف نية تتطلب توضيحًا.",
      run: () => {
        GAssistant.AI.IntentAnalyzer.detectIntent.mockReturnValueOnce({
          type: 'clarification_needed',
          errorMessage: 'الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.',
          originalPrompt: 'ماذا تقصد؟'
        });

        const sessionId = 'testSessionClarify';
        const message = 'ماذا تقصد؟';
        const response = GAssistant.Agents.Dispatcher.dispatch({ sessionId, message });

        expect(response.type).toBe('warning');
        expect(response.text).toBe('الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.');
        expect(mockUIDialogue.createWarning).toHaveBeenCalledWith('الرجاء توضيح طلبك. لم أتمكن من فهم النية بوضوح.');
        expect(GAssistant.AI.IntentAnalyzer.detectIntent).toHaveBeenCalledWith({ userPrompt: message });
        expect(GAssistant.Agents.Catalog.getAgent).not.toHaveBeenCalled();
        return "توجيه التوضيح يعمل بشكل صحيح.";
      }
    },
    {
      name: "AgentDispatcher: تسجيل المقاييس لـ tool_call",
      description: "يتحقق من تسجيل المقاييس الصحيحة عند توجيه أداة.",
      run: () => {
        mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mockClear();
        GAssistant.AI.IntentAnalyzer.detectIntent.mockReturnValueOnce({
          type: 'tool_call',
          toolName: 'Developer.generateCode',
          args: { description: 'دالة جديدة' },
          originalPrompt: 'اكتب لي كود'
        });

        const sessionId = 'metricsTestSessionTool';
        const message = 'اكتب لي كود لإنشاء تقرير';
        GAssistant.Agents.Dispatcher.dispatch({ sessionId, message });

        expect(mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow).toHaveBeenCalled();
        const lastCall = mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mock.calls[mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mock.calls.length - 1][0];
        expect(lastCall[1]).toBe('dispatch');
        expect(lastCall[2]).toBe('success');
        expect(lastCall[5]).toBe(sessionId);
        expect(lastCall[6]).toBe('developer');
        expect(lastCall[7]).toBe('tool_call');
        expect(lastCall[8]).toBe('Developer.generateCode');
        expect(lastCall[9]).toBe('');
        return "تسجيل مقاييس أداة التوجيه يعمل بشكل صحيح.";
      }
    },
    {
      name: "AgentDispatcher: تسجيل المقاييس لـ clarification_needed",
      description: "يتحقق من تسجيل المقاييس الصحيحة عند طلب توضيح.",
      run: () => {
        mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mockClear();
        GAssistant.AI.IntentAnalyzer.detectIntent.mockReturnValueOnce({
          type: 'clarification_needed',
          errorMessage: 'الرجاء توضيح سؤالك أكثر.',
          originalPrompt: 'أنا لا أفهم'
        });

        const sessionId = 'metricsTestSessionClarify';
        const message = 'أنا لا أفهم ما تقوله';
        GAssistant.Agents.Dispatcher.dispatch({ sessionId, message });

        expect(mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow).toHaveBeenCalled();
        const lastCall = mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mock.calls[mockUtils.getSheet('AgentDispatcher_Metrics_Test').appendRow.mock.calls.length - 1][0];
        expect(lastCall[1]).toBe('dispatch');
        expect(lastCall[2]).toBe('clarification_needed');
        expect(lastCall[5]).toBe(sessionId);
        expect(lastCall[6]).toBe('');
        expect(lastCall[7]).toBe('clarification_needed');
        expect(lastCall[8]).toBe('');
        expect(lastCall[9]).toBe('الرجاء توضيح سؤالك أكثر.');
        return "تسجيل مقاييس التوضيح يعمل بشكل صحيح.";
      }
    },
    // === AI.Memory Tests ===
    {
      name: "Memory: add/get/clear session",
      description: "يختبر إضافة، جلب، ومسح سياق الجلسة في وحدة الذاكرة.",
      run: () => {
        const sid = 'testSessionMemory';
        GAssistant.AI.Memory.clearSessionContext({ sessionId: sid });
        expect(GAssistant.AI.Memory.clearSessionContext).toHaveBeenCalledWith({ sessionId: sid });

        GAssistant.AI.Memory.addMessageToHistory({ sessionId: sid, message: { role: 'user', parts: [{ text: 'foo' }] } });
        expect(GAssistant.AI.Memory.addMessageToHistory).toHaveBeenCalledWith({ sessionId: sid, message: { role: 'user', parts: [{ text: 'foo' }] } });

        let hist = GAssistant.AI.Memory.getSessionHistory({ sessionId: sid });
        expect(hist.length).toBe(1);
        expect(hist[0].parts[0].text).toBe('foo');

        GAssistant.AI.Memory.clearSessionContext({ sessionId: sid });
        hist = GAssistant.AI.Memory.getSessionHistory({ sessionId: sid });
        expect(hist.length).toBe(0);
        return "وحدة الذاكرة تعمل بشكل صحيح.";
      }
    },
    {
      name: "Dispatcher: text vs tool_call (Integration)",
      description: "يختبر معالجة ردود API من نوع نص واستدعاء أداة بواسطة Dispatcher.",
      run: () => {
        const textRes = { candidates: [{ content: { parts: [{ text: 'hi' }] } }] };
        const processedText = GAssistant.AI.Dispatcher.processApiResponse({ apiResponse: textRes });
        expect(processedText.type).toBe('text_response');
        expect(processedText.text).toBe('hi');

        const toolRes = { candidates: [{ content: { parts: [{ functionCall: { name: 'Developer.reviewCode', args: {} } }] } }] };
        const processedTool = GAssistant.AI.Dispatcher.processApiResponse({ apiResponse: toolRes });
        expect(processedTool.type).toBe('tool_execution_result');
        expect(processedTool.data.results[0].call.name).toBe('Developer.reviewCode');
        return "وحدة Dispatcher تعالج نصوص واستدعاءات الأدوات بشكل صحيح.";
      }
    },
    {
      name: "Context: combined context (Integration)",
      description: "يتحقق من دمج سياق الجلسة والذاكرة طويلة الأمد.",
      run: () => {
        const sid = 'ctx1';
        GAssistant.AI.Memory.clearSessionContext({ sessionId: sid });
        GAssistant.AI.Memory.addMessageToHistory({ sessionId: sid, message: { role: 'user', parts: [{ text: 'a' }] } });
        const ctx = GAssistant.AI.Memory.getCombinedContext({ sessionId: sid, userQuery: 'x' });
        expect(Array.isArray(ctx.sessionHistory)).toBe(true);
        expect(ctx.sessionHistory.length).toBe(1);
        expect(Array.isArray(ctx.longTermContext)).toBe(true);
        return "السياق المجمع يعمل بشكل صحيح.";
      }
    },
    {
      name: "Adapter: callGeminiApi mock",
      description: "يتحقق من أن محاكاة GeminiAdapter.callGeminiApi تعمل كما هو متوقع.",
      run: () => {
        const r = GAssistant.AI.GeminiAdapter.callGeminiApi({ model: 'm', payload: {} });
        expect(r.candidates[0].content.parts[0].text).toBe('mocked Gemini response');
        return "محاكاة GeminiAdapter تعمل.";
      }
    },
    {
      name: "Core: ask builds payload and returns UiResponse (Integration)",
      description: "يتحقق من أن AI.Core.ask يبني الحمولة ويعيد UiResponse.",
      run: () => {
        const resp = GAssistant.AI.Core.ask('hello', {});
        expect(resp.type).toBe('text_response');
        expect(resp.text).toBe('mocked Gemini response');
        return "AI.Core.ask يعمل بشكل صحيح.";
      }
    },
    {
      name: "IntentAnalyzer: detectIntent maps action to tool (Integration)",
      description: "يتحقق من أن IntentAnalyzer يكتشف النية الصحيحة ويحدد الأداة.",
      run: () => {
        const out = GAssistant.AI.IntentAnalyzer.detectIntent({ userPrompt: 'راجع الكود' });
        expect(out.type).toBe('tool_call');
        expect(out.toolName).toBe('Developer.reviewCode');
        expect(out.args.originalQuery).toBe('راجع الكود');

        const out2 = GAssistant.AI.IntentAnalyzer.detectIntent({ userPrompt: 'ما هو إصدارك' });
        expect(out2.type).toBe('tool_call');
        expect(out2.toolName).toBe('System.Info.getVersion');
        return "IntentAnalyzer يكتشف النوايا والأدوات بشكل صحيح.";
      }
    },
    {
      name: "ToolExecutor: execute known function (Integration)",
      description: "يتحقق من أن ToolExecutor ينفذ دالة معروفة من الكتالوج.",
      run: () => {
        const r = GAssistant.AI.ToolExecutor.executeFunctionCall('Developer.reviewCode', { x: 1 });
        expect(r.type).toBe('tool_result');
        expect(r.data.type).toBe('code_analysis_result'); // Changed to match mock
        expect(r.data.analysis).toBe('Mocked reviewCode result'); // Changed to match mock
        return "ToolExecutor ينفذ الدوال المعروفة.";
      }
    },
    {
      name: "UI Sidebar: handleDeveloperRequest routes to IntentAnalyzer (Integration)",
      description: "يتحقق من أن handleDeveloperRequest يوجه الطلبات إلى IntentAnalyzer.",
      run: () => {
        GAssistant.AI.IntentAnalyzer.detectIntent.mockReturnValueOnce({
          type: 'general_query',
          originalPrompt: 'اختبار'
        });
        const out = GAssistant.UI.DeveloperSidebar.handleDeveloperRequest({ action: 'اختبار' });
        expect(out.type).toBe('text_response'); // Assuming AI.Core.ask returns text_response
        expect(out.text).toBe('mocked Gemini response'); // From AI.Core.ask mock
        expect(GAssistant.AI.IntentAnalyzer.detectIntent).toHaveBeenCalledWith({ userPrompt: 'اختبار' });
        return "handleDeveloperRequest يوجه الطلبات بشكل صحيح.";
      }
    },
    {
      name: "UI Sidebar: showDeveloperSidebar opens sidebar",
      description: "يتحقق من أن showDeveloperSidebar يستدعي Apps Script UI لفتح الشريط الجانبي.",
      run: () => {
        const response = GAssistant.UI.DeveloperSidebar.showDeveloperSidebar();

        expect(response.type).toBe('info');
        expect(response.text).toBe('تم فتح شريط أدوات المطور.');
        expect(mockHtmlService.createTemplateFromFile).toHaveBeenCalledWith('DeveloperSidebar');
        expect(mockHtmlService.createTemplateFromFile().evaluate).toHaveBeenCalled();
        expect(mockHtmlService.createTemplateFromFile().evaluate().setTitle).toHaveBeenCalledWith('🛠️ ورشة عمل المطورين');
        expect(mockSpreadsheetApp.getUi().showSidebar).toHaveBeenCalled();
        return "شريط الأدوات الجانبي يفتح بشكل صحيح.";
      }
    }
  ];

  function runAllTests() {
    Utils.log('System.Tests.runAllTests: Starting all integration tests...', { count: TEST_CASES.length });
    const results = TEST_CASES.map(testCase => _runSingleTest(testCase));
    const failedCount = results.filter(r => !r.success).length;
    Utils.log('System.Tests.runAllTests: All integration tests completed.', { total: results.length, failed: failedCount });
    return results;
  }

  return {
    runAllTests
  };
});

// *************************************************************************************************
// --- END OF FILE: 60_tests/tests.gs ---
// *************************************************************************************************
