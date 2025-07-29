/**
 * Jest Test Setup
 * إعداد البيئة للاختبارات
 */

// Mock Google Apps Script APIs
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

global.Logger = {
  log: jest.fn(),
  warn: jest.fn()
};

global.SpreadsheetApp = {
  getActiveSpreadsheet: jest.fn(() => ({
    getSheetByName: jest.fn(),
    insertSheet: jest.fn()
  })),
  getUi: jest.fn(() => ({
    alert: jest.fn(),
    createMenu: jest.fn(() => ({
      addItem: jest.fn(() => ({ addToUi: jest.fn() }))
    }))
  }))
};

global.PropertiesService = {
  getScriptProperties: jest.fn(() => ({
    getProperty: jest.fn(),
    setProperty: jest.fn(),
    getProperties: jest.fn(() => ({})),
    deleteProperty: jest.fn()
  }))
};

global.CacheService = {
  getScriptCache: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn()
  }))
};

// Mock defineModule for testing
global.defineModule = jest.fn((name, factory) => {
  const mockDeps = {};
  return factory(mockDeps);
});

// Test utilities
global.testUtils = {
  createMockModule: (name, exports) => {
    return { name, exports };
  },
  
  resetAllMocks: () => {
    jest.clearAllMocks();
  }
};