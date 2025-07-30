// Mock Google Apps Script Services for Node.js testing
global.CacheService = {
  getScriptCache: () => ({
    get: (key) => null,
    put: (key, value, ttl) => true,
    remove: (key) => true
  }),
  getUserCache: () => ({
    get: (key) => null,
    put: (key, value, ttl) => true,
    remove: (key) => true
  })
};

global.SpreadsheetApp = {
  getActiveSpreadsheet: () => ({
    getSheetByName: (name) => null,
    insertSheet: (name) => ({
      appendRow: (data) => true,
      getRange: (row, col, numRows, numCols) => ({
        setFontWeight: (weight) => true
      })
    })
  })
};

global.PropertiesService = {
  getScriptProperties: () => ({
    getProperty: (key) => null,
    setProperty: (key, value) => true,
    getProperties: () => ({}),
    setProperties: (props) => true
  })
};

// Add Telemetry mock
global.defineModule = global.defineModule || function() {};
if (typeof global.registerTelemetry === 'undefined') {
  global.registerTelemetry = function() {
    if (typeof global.defineModule === 'function') {
      global.defineModule('System.Telemetry', () => ({
        logError: (error, context) => console.log(`[Telemetry] Error in ${context}: ${error}`),
        log: (message) => console.log(`[Telemetry] ${message}`),
        init: () => true
      }));
      console.log('✅ Telemetry registered');
    }
  };
}

console.log('✅ Mock GAS services loaded');

// Export function to register DocsManager after defineModule is available
global.registerDocsManager = function() {
  if (typeof global.defineModule === 'function') {
    global.defineModule('System.DocsManager', () => ({
      registerModuleDocs: (name, docs) => {
        console.log(`📚 Docs registered for: ${name}`);
        return true;
      },
      getDocs: (name) => null,
      init: () => true
    }));
    console.log('✅ DocsManager registered');
  }
};