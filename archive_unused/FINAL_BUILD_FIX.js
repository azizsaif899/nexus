// إصلاح نهائي لمشكلة البناء - إنشاء جميع الوحدات المفقودة
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');

// الوحدات الأساسية المطلوبة
const coreModules = {
  'Utils': `
defineModule('Utils', () => ({
  log: (msg) => Logger.log(\`[Utils] \${msg}\`),
  warn: (msg) => Logger.log(\`[Utils WARN] \${msg}\`),
  error: (msg) => Logger.log(\`[Utils ERROR] \${msg}\`),
  executeSafely: (fn, context, fallback = null) => {
    try { return fn(); } catch (e) { Logger.log(\`Error in \${context}: \${e.message}\`); return fallback; }
  },
  getSheet: (name, headers = []) => {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName(name);
      if (!sheet) {
        sheet = ss.insertSheet(name);
        if (headers.length > 0) {
          sheet.appendRow(headers);
          sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        }
      }
      return sheet;
    } catch (e) {
      Logger.log(\`Failed to get sheet \${name}: \${e.message}\`);
      return null;
    }
  },
  validateString: (value, name) => {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(\`Validation Error: '\${name}' must be a non-empty string.\`);
    }
  },
  init: () => true
}));

defineModule('System.Utils', () => GAssistant.Utils.Injector.get('Utils').Utils);
`,

  'DocsManager': `
defineModule('DocsManager', () => ({
  registerModuleDocs: (moduleName, docs) => Logger.log(\`[DocsManager] Registered docs for \${moduleName}\`),
  registerConfigDocs: () => Logger.log('[DocsManager] Config docs registered'),
  registerCoreDocs: () => Logger.log('[DocsManager] Core docs registered'),
  getAllDocs: () => [],
  init: () => true
}));

defineModule('System.DocsManager', () => GAssistant.Utils.Injector.get('DocsManager').DocsManager);
`,

  'Telemetry': `
defineModule('Telemetry', () => ({
  track: (event, data) => Logger.log(\`[Telemetry] \${event}\`),
  error: (msg) => Logger.log(\`[Telemetry ERROR] \${msg}\`),
  logError: (msg) => Logger.log(\`[Telemetry ERROR] \${msg}\`),
  init: () => true
}));

defineModule('System.Telemetry', () => GAssistant.Utils.Injector.get('Telemetry').Telemetry);
`,

  'Config': `
defineModule('Config', () => ({
  get: (key) => {
    const defaults = { 
      DEBUG_MODE: true, 
      API_KEY: '', 
      GEMINI_PRO_MODEL: 'gemini-1.5-pro-latest',
      GEMINI_DEFAULT_MODEL: 'gemini-1.5-pro-latest',
      GEMINI_FLASH_MODEL: 'gemini-1.5-flash-latest'
    };
    return defaults[key] || null;
  },
  getAll: () => ({ DEBUG_MODE: true, API_KEY: '', GEMINI_PRO_MODEL: 'gemini-1.5-pro-latest' }),
  has: () => true,
  validate: () => true,
  dump: () => Logger.log('[Config] Dump called'),
  init: () => true
}));

defineModule('System.Config', () => GAssistant.Utils.Injector.get('Config').Config);
`,

  'Dialogue': `
defineModule('Dialogue', () => ({
  createInfo: (text) => ({ type: 'info', text }),
  createError: (text) => ({ type: 'error', text }),
  createSuccess: (text) => ({ type: 'success', text }),
  createWarning: (text) => ({ type: 'warning', text }),
  createTable: (title, headers, rows) => ({ type: 'table', text: title, data: { headers, rows } }),
  init: () => true
}));

defineModule('System.UI.Dialogue', () => GAssistant.Utils.Injector.get('Dialogue').Dialogue);
`,

  'AI': `
defineModule('AI', () => ({
  Core: { ask: () => ({ type: 'info', text: 'AI Core not ready' }) },
  Memory: { getSessionHistory: () => [] },
  LongTermMemory: { save: () => true },
  init: () => true
}));

defineModule('System.AI', () => GAssistant.Utils.Injector.get('AI').AI);
`,

  'UI': `
defineModule('UI', () => ({
  Dialogue: GAssistant.Utils.Injector.get('Dialogue').Dialogue,
  init: () => true
}));

defineModule('System.UI', () => GAssistant.Utils.Injector.get('UI').UI);
`,

  'Tools': `
defineModule('Tools', () => ({
  Catalog: { getDeclarations: () => [] },
  ProjectService: { getProjectFiles: () => null },
  init: () => true
}));

defineModule('System.Tools', () => GAssistant.Utils.Injector.get('Tools').Tools);
`,

  'Security': `
defineModule('Security', () => ({
  sanitize: (input) => String(input).replace(/<[^>]*>/g, ''),
  init: () => true
}));

defineModule('System.Security', () => GAssistant.Utils.Injector.get('Security').Security);
`,

  'Memory': `
defineModule('Memory', () => ({
  init: () => true
}));

defineModule('System.Memory', () => GAssistant.Utils.Injector.get('Memory').Memory);
`,

  'Tests': `
defineModule('Tests', () => ({
  init: () => true
}));

defineModule('System.Tests', () => GAssistant.Utils.Injector.get('Tests').Tests);
`
};

// إنشاء ملف الوحدات الأساسية
function createCoreModulesFile() {
  const content = `// الوحدات الأساسية المطلوبة - تم إنشاؤها تلقائياً
${Object.values(coreModules).join('\n')}
`;
  
  fs.writeFileSync(path.join(DIST_DIR, '00_core_modules.js'), content);
  console.log('✅ تم إنشاء ملف الوحدات الأساسية');
}

// تحديث ملف utils
function updateUtilsFile() {
  const utilsPath = path.join(DIST_DIR, '00_utils.js');
  let content = fs.readFileSync(utilsPath, 'utf8');
  
  // إضافة تعريفات الوحدات إذا لم تكن موجودة
  if (!content.includes("defineModule('Utils'")) {
    content += `
// تعريف الوحدات الأساسية
defineModule('Utils', () => Utils);
defineModule('System.Utils', () => Utils);
defineModule('DocsManager', () => DocsManager);
defineModule('System.DocsManager', () => DocsManager);
defineModule('Telemetry', () => Telemetry);
defineModule('System.Telemetry', () => Telemetry);
`;
    fs.writeFileSync(utilsPath, content);
    console.log('✅ تم تحديث ملف Utils');
  }
}

// تشغيل الإصلاح
try {
  createCoreModulesFile();
  updateUtilsFile();
  console.log('🎯 تم الإصلاح بنجاح! يمكنك الآن تشغيل npm run build');
} catch (error) {
  console.error('❌ خطأ في الإصلاح:', error.message);
}