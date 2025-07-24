// e:\azizsys5\tests\setup.js

// 1. Mock global Google Apps Script services
global.SpreadsheetApp = {
  getUi: () => ({
    createMenu: jest.fn().mockReturnThis(),
    addItem: jest.fn().mockReturnThis(),
    addSeparator: jest.fn().mockReturnThis(),
    addSubMenu: jest.fn().mockReturnThis(),
    addToUi: jest.fn(),
    showSidebar: jest.fn(),
    showModalDialog: jest.fn(),
    alert: jest.fn(),
  }),
  getActiveRange: jest.fn(() => ({
    getValue: jest.fn(() => 'mocked cell value'),
    setValue: jest.fn(),
    setFormula: jest.fn(),
    getA1Notation: jest.fn(() => 'A1'),
    getNumRows: jest.fn(() => 1),
    getNumColumns: jest.fn(() => 1),
  })),
};

global.CacheService = {
  getScriptCache: () => ({
    get: jest.fn(() => null),
    put: jest.fn(),
    remove: jest.fn(),
  }),
};

global.Logger = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

// Add other global mocks here (DocumentApp, Utilities, etc.)

// 2. Setup the GAssistant global namespace
global.GAssistant = {
  System: {},
  Utils: {},
  AI: {},
  Tools: {},
  UI: {},
  Agents: {},
};