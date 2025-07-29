#!/usr/bin/env node

/**
 * @file comprehensive_project_fixer.js
 * @description سكريبت شامل يدعم جميع مراحل الخطة الأربع
 * @author عبدالعزيز
 */

// ES6 import removed for Apps Script compatibility
// ES6 import removed for Apps Script compatibility
class ComprehensiveProjectFixer {
  constructor() {
    this.results = {
      phase1: { completed: [], errors: [] },
      phase2: { completed: [], errors: [] },
      phase3: { completed: [], errors: [] },
      phase4: { completed: [], errors: [] }
    };
  }

  async executeAllPhases() {
    console.log('🚀 بدء تنفيذ الخطة الشاملة للمشروع...\n');

    await this.phase1_Foundation();
    await this.phase2_Restructuring();
    await this.phase3_Documentation();
    await this.phase4_Testing();

    this.generateComprehensiveReport();
  }

  // المرحلة الأولى: التأسيس وضمان الجودة
  async phase1_Foundation() {
    console.log('📋 المرحلة الأولى: التأسيس وضمان الجودة');
    console.log('='.repeat(50));

    // 1. إنشاء DependencyGuardian
    await this.createDependencyGuardian();
    
    // 2. تفعيل STRICT_DEPENDENCY_MODE
    await this.enableStrictDependencyMode();
    
    // 3. إصلاح Security functions
    await this.fixSecurityFunctions();
  }

  async createDependencyGuardian() {
    const guardianContent = `
/**
 * @file DependencyGuardian.js
 * @description حارس التبعيات - يدير ترتيب تحميل الملفات
 */

class DependencyGuardian {
  constructor() {
    this.dependencies = new Map();
    this.loadOrder = [];
  }

  // فحص ترتيب التبعيات
  auditOrder() {
    console.log('🔍 فحص ترتيب التبعيات...');
    const issues = [];
    
    // قراءة module_manifest.json
    const manifest = this.loadManifest();
    
    for (const module of manifest) {
      for (const dep of module.dependencies || []) {
        if (!this.isLoadedBefore(dep, module.module, manifest)) {
          issues.push({
            module: module.module,
            dependency: dep,
            issue: 'تبعية غير محملة قبل الوحدة'
          });
        }
      }
    }
    
    return issues;
  }

  // توليد ترتيب موصى به
  generateRecommendedOrder() {
    console.log('📝 توليد ترتيب التحميل الموصى به...');
    const manifest = this.loadManifest();
    const sorted = this.topologicalSort(manifest);
    
    return sorted.map((module, index) => ({
      order: index + 1,
      module: module.module,
      file: module.file
    }));
  }

  loadManifest() {
    try {
      const manifestPath = path.join(process.cwd(), '90_System/module_manifest.json');
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (error) {
      console.error('❌ فشل تحميل module_manifest.json');
      return [];
    }
  }

  isLoadedBefore(dependency, module, manifest) {
    const depIndex = manifest.findIndex(m => m.module === dependency);
    const moduleIndex = manifest.findIndex(m => m.module === module);
    return depIndex < moduleIndex;
  }

  topologicalSort(modules) {
    const visited = new Set();
    const result = [];
    
    const visit = (module) => {
      if (visited.has(module.module)) return;
      visited.add(module.module);
      
      for (const dep of module.dependencies || []) {
        const depModule = modules.find(m => m.module === dep);
        if (depModule) visit(depModule);
      }
      
      result.push(module);
    };
    
    modules.forEach(visit);
    return result;
  }
}

export default DependencyGuardian;
`;

    try {
      await fs.writeFile('src/Dev/DependencyGuardian.js', guardianContent, 'utf8');
      this.results.phase1.completed.push('✅ DependencyGuardian تم إنشاؤه');
    } catch (error) {
      this.results.phase1.errors.push(`❌ DependencyGuardian: ${error.message}`);
    }
  }

  async enableStrictDependencyMode() {
    try {
      const configPath = 'src/Config.js';
      let content = await fs.readFile(configPath, 'utf8');
      
      // إضافة STRICT_DEPENDENCY_MODE
      if (!content.includes('STRICT_DEPENDENCY_MODE')) {
        content = content.replace(
          'const CONFIG_SHEET_NAME',
          'const STRICT_DEPENDENCY_MODE = true;\nconst CONFIG_SHEET_NAME'
        );
        
        await fs.writeFile(configPath, content, 'utf8');
        this.results.phase1.completed.push('✅ STRICT_DEPENDENCY_MODE تم تفعيله');
      }
    } catch (error) {
      this.results.phase1.errors.push(`❌ STRICT_DEPENDENCY_MODE: ${error.message}`);
    }
  }

  async fixSecurityFunctions() {
    const securityContent = `
/**
 * @file Security.js
 * @description وحدة الأمان المحسنة
 */

class Security {
  static encrypt(text, key = 'default_key') {
    if (!text || typeof text !== 'string') return '';
    
    // تشفير بسيط باستخدام XOR
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result); // Base64 encoding
  }

  static decrypt(encryptedText, key = 'default_key') {
    if (!encryptedText) return '';
    
    try {
      const decoded = atob(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    } catch (error) {
      console.error('فشل فك التشفير:', error);
      return '';
    }
  }

  static escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
  }

  static validateInput(input, type = 'string') {
    switch (type) {
      case 'email':
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input);
      case 'number':
        return !isNaN(input) && isFinite(input);
      case 'string':
        return typeof input === 'string' && input.trim().length > 0;
      default:
        return false;
    }
  }
}

export default Security;
`;

    try {
      await fs.writeFile('src/Security.js', securityContent, 'utf8');
      this.results.phase1.completed.push('✅ Security functions تم إصلاحها');
    } catch (error) {
      this.results.phase1.errors.push(`❌ Security: ${error.message}`);
    }
  }

  // المرحلة الثانية: إعادة الهيكلة
  async phase2_Restructuring() {
    console.log('\n🏗️ المرحلة الثانية: إعادة الهيكلة والتوحيد المعماري');
    console.log('='.repeat(50));

    await this.unifyModuleNames();
    await this.centralizeHelperFunctions();
    await this.createUIDialogue();
  }

  async unifyModuleNames() {
    // تحويل جميع الوحدات إلى نمط System.*
    const filesToRename = [
      { old: 'src/Utils.js', new: 'src/System/Utils.js' },
      { old: 'src/Config.js', new: 'src/System/Config.js' }
    ];

    for (const file of filesToRename) {
      try {
        await fs.mkdir(path.dirname(file.new), { recursive: true });
        await fs.copyFile(file.old, file.new);
        this.results.phase2.completed.push(`✅ ${file.old} → ${file.new}`);
      } catch (error) {
        this.results.phase2.errors.push(`❌ Rename ${file.old}: ${error.message}`);
      }
    }
  }

  async centralizeHelperFunctions() {
    // إنشاء System.UI.Dialogue
    const dialogueContent = `
/**
 * @file UI/Dialogue.js
 * @description مركز إنشاء واجهات المستخدم
 */

class UIDialogue {
  static createSuccess(message) {
    return {
      type: 'success',
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  static createError(message) {
    return {
      type: 'error', 
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  static createWarning(message) {
    return {
      type: 'warning',
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  static createInfo(message) {
    return {
      type: 'info',
      message: message,
      timestamp: new Date().toISOString()
    };
  }
}

export default UIDialogue;
`;

    try {
      await fs.mkdir('src/UI', { recursive: true });
      await fs.writeFile('src/UI/Dialogue.js', dialogueContent, 'utf8');
      this.results.phase2.completed.push('✅ System.UI.Dialogue تم إنشاؤه');
    } catch (error) {
      this.results.phase2.errors.push(`❌ UI.Dialogue: ${error.message}`);
    }
  }

  async createUIDialogue() {
    // تم تنفيذه في centralizeHelperFunctions
    this.results.phase2.completed.push('✅ مركزية الوظائف المساعدة مكتملة');
  }

  // المرحلة الثالثة: التوثيق والمقاييس
  async phase3_Documentation() {
    console.log('\n📚 المرحلة الثالثة: التوثيق والمقاييس المتقدمة');
    console.log('='.repeat(50));

    await this.createDocsValidator();
    await this.enhanceTelemetry();
  }

  async createDocsValidator() {
    const validatorContent = `
/**
 * @file DocsValidator.js
 * @description مدقق التوثيق - يقارن الوحدات الفعلية بالتوثيق
 */

class DocsValidator {
  constructor() {
    this.issues = [];
  }

  async validateAll() {
    console.log('📋 فحص التوثيق...');
    
    const actualModules = await this.scanActualModules();
    const documentedModules = await this.loadDocumentedModules();
    
    this.compareModules(actualModules, documentedModules);
    return this.generateReport();
  }

  async scanActualModules() {
    const modules = [];
    const srcDir = 'src';
    
    const scanDir = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.name.endsWith('.js')) {
          const content = await fs.readFile(fullPath, 'utf8');
          const moduleInfo = this.extractModuleInfo(content, fullPath);
          if (moduleInfo) modules.push(moduleInfo);
        }
      }
    };
    
    await scanDir(srcDir);
    return modules;
  }

  extractModuleInfo(content, filePath) {
    const moduleMatch = content.match(/@module\\s+([^\\s]+)/);
    const versionMatch = content.match(/@version\\s+([^\\s]+)/);
    
    if (moduleMatch) {
      return {
        name: moduleMatch[1],
        file: filePath,
        version: versionMatch ? versionMatch[1] : 'unknown',
        hasDocumentation: content.includes('@description')
      };
    }
    return null;
  }

  async loadDocumentedModules() {
    try {
      const docsPath = 'docs/module_docs.json';
      const content = await fs.readFile(docsPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('⚠️ لم يتم العثور على ملف التوثيق');
      return [];
    }
  }

  compareModules(actual, documented) {
    // البحث عن وحدات غير موثقة
    for (const module of actual) {
      const isDocumented = documented.some(doc => doc.name === module.name);
      if (!isDocumented) {
        this.issues.push({
          type: 'missing_documentation',
          module: module.name,
          file: module.file
        });
      }
    }

    // البحث عن توثيق لوحدات غير موجودة
    for (const doc of documented) {
      const exists = actual.some(module => module.name === doc.name);
      if (!exists) {
        this.issues.push({
          type: 'orphaned_documentation',
          module: doc.name
        });
      }
    }
  }

  generateReport() {
    return {
      totalIssues: this.issues.length,
      issues: this.issues,
      summary: {,
        missingDocs: this.issues.filter(i => i.type === 'missing_documentation').length,
        orphanedDocs: this.issues.filter(i => i.type === 'orphaned_documentation').length
      }
    };
  }
}

export default DocsValidator;
`;

    try {
      await fs.writeFile('src/Dev/DocsValidator.js', validatorContent, 'utf8');
      this.results.phase3.completed.push('✅ DocsValidator تم إنشاؤه');
    } catch (error) {
      this.results.phase3.errors.push(`❌ DocsValidator: ${error.message}`);
    }
  }

  async enhanceTelemetry() {
    const telemetryContent = `
/**
 * @file Telemetry.js
 * @description نظام مقاييس محسن مع سياق البيئة
 */

class Telemetry {
  constructor() {
    this.environmentContext = this.detectEnvironment();
    this.events = [];
  }

  detectEnvironment() {
    if (typeof SpreadsheetApp !== 'undefined') {
      return 'google_apps_script';
    } else if (typeof process !== 'undefined') {
      return 'nodejs';
    } else if (typeof window !== 'undefined') {
      return 'browser';
    }
    return 'unknown';
  }

  track(event, data = {}) {
    const eventData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      environment: this.environmentContext,
      sessionId: this.getSessionId()
    };

    this.events.push(eventData);
    this.persistEvent(eventData);
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return this.sessionId;
  }

  persistEvent(eventData) {
    try {
      if (this.environmentContext === 'google_apps_script') {
        // حفظ في PropertiesService
        const key = 'telemetry_' + Date.now();
        PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(eventData));
      } else {
        // حفظ في ملف محلي
        console.log('📊 Telemetry:', JSON.stringify(eventData, null, 2));
      }
    } catch (error) {
      console.error('فشل حفظ بيانات المقاييس:', error);
    }
  }

  getReport() {
    return {
      environment: this.environmentContext,
      totalEvents: this.events.length,
      events: this.events.slice(-10), // آخر 10 أحداث
      summary: this.generateSummary()
    };
  }

  generateSummary() {
    const eventTypes = {};
    this.events.forEach(event => {
      eventTypes[event.event] = (eventTypes[event.event] || 0) + 1;
    });
    return eventTypes;
  }
}

export default Telemetry;
`;

    try {
      await fs.writeFile('src/Telemetry.js', telemetryContent, 'utf8');
      this.results.phase3.completed.push('✅ Telemetry محسن مع environmentContext');
    } catch (error) {
      this.results.phase3.errors.push(`❌ Telemetry: ${error.message}`);
    }
  }

  // المرحلة الرابعة: الاختبارات
  async phase4_Testing() {
    console.log('\n🧪 المرحلة الرابعة: الاختبارات وضمان الموثوقية');
    console.log('='.repeat(50));

    await this.createAdvancedUnitTests();
    await this.createDependencyValidation();
  }

  async createAdvancedUnitTests() {
    const testFrameworkContent = `
/**
 * @file TestFramework.js
 * @description إطار اختبارات متقدم مع Mocking و Spying
 */

class TestFramework {
  constructor() {
    this.tests = [];
    this.mocks = new Map();
    this.spies = new Map();
  }

  // إنشاء Mock
  createMock(name, methods = {}) {
    const mock = {};
    
    Object.keys(methods).forEach(method => {
      mock[method] = (...args) => {
        this.recordCall(name, method, args);
        return methods[method](...args);
      };
    });

    this.mocks.set(name, mock);
    return mock;
  }

  // إنشاء Spy
  createSpy(obj, methodName) {
    const originalMethod = obj[methodName];
    const spy = {
      calls: [],
      callCount: 0,
      restore: () => { obj[methodName] = originalMethod; }
    };

    obj[methodName] = (...args) => {
      spy.calls.push(args);
      spy.callCount++;
      return originalMethod.apply(obj, args);
    };

    this.spies.set(\`\${obj.constructor.name}.\${methodName}\`, spy);
    return spy;
  }

  recordCall(mockName, method, args) {
    const key = \`\${mockName}.\${method}\`;
    if (!this.mocks.get(mockName).calls) {
      this.mocks.get(mockName).calls = {};
    }
    if (!this.mocks.get(mockName).calls[method]) {
      this.mocks.get(mockName).calls[method] = [];
    }
    this.mocks.get(mockName).calls[method].push(args);
  }

  // تشغيل اختبار
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async runAll() {
    console.log(\`🧪 تشغيل \${this.tests.length} اختبار...\`);
    
    const results = [];
    for (const test of this.tests) {
      try {
        await test.testFn();
        results.push({ name: test.name, status: 'passed' });
        console.log(\`✅ \${test.name}\`);
      } catch (error) {
        results.push({ name: test.name, status: 'failed', error: error.message });
        console.log(\`❌ \${test.name}: \${error.message}\`);
      }
    }

    return results;
  }

  // تنظيف
  cleanup() {
    this.spies.forEach(spy => spy.restore());
    this.mocks.clear();
    this.spies.clear();
  }
}

export default TestFramework;
`;

    try {
      await fs.mkdir('tests', { recursive: true });
      await fs.writeFile('tests/TestFramework.js', testFrameworkContent, 'utf8');
      this.results.phase4.completed.push('✅ TestFramework متقدم مع Mocking/Spying');
    } catch (error) {
      this.results.phase4.errors.push(`❌ TestFramework: ${error.message}`);
    }
  }

  async createDependencyValidation() {
    const validationContent = `
/**
 * @file DependencyValidation.js
 * @description فحص التبعيات في وقت التشغيل
 */

class DependencyValidation {
  constructor() {
    this.loadedModules = new Set();
    this.dependencies = new Map();
  }

  registerModule(name, deps = []) {
    this.loadedModules.add(name);
    this.dependencies.set(name, deps);
  }

  validateAll() {
    console.log('🔍 فحص التبعيات...');
    const issues = [];

    for (const [module, deps] of this.dependencies) {
      for (const dep of deps) {
        if (!this.loadedModules.has(dep)) {
          issues.push({
            module,
            missingDependency: dep,
            severity: 'critical'
          });
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      summary: {,
        totalModules: this.loadedModules.size,
        totalIssues: issues.length
      }
    };
  }

  generateReport() {
    const validation = this.validateAll();
    
    let report = '# تقرير فحص التبعيات\\n\\n';
    report += \`الوحدات المحملة: \${validation.summary.totalModules}\\n\`;
    report += \`المشاكل المكتشفة: \${validation.summary.totalIssues}\\n\\n\`;

    if (validation.issues.length > 0) {
      report += '## المشاكل:\\n';
      validation.issues.forEach(issue => {
        report += \`- \${issue.module} يحتاج \${issue.missingDependency}\\n\`;
      });
    } else {
      report += '✅ جميع التبعيات صحيحة\\n';
    }

    return report;
  }
}

export default DependencyValidation;
`;

    try {
      await fs.writeFile('tests/DependencyValidation.js', validationContent, 'utf8');
      this.results.phase4.completed.push('✅ DependencyValidation تم إنشاؤه');
    } catch (error) {
      this.results.phase4.errors.push(`❌ DependencyValidation: ${error.message}`);
    }
  }

  generateComprehensiveReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 تقرير شامل لتنفيذ الخطة الأربع مراحل');
    console.log('='.repeat(60));

    const phases = [
      { name: 'المرحلة الأولى: التأسيس', key: 'phase1' },
      { name: 'المرحلة الثانية: إعادة الهيكلة', key: 'phase2' },
      { name: 'المرحلة الثالثة: التوثيق', key: 'phase3' },
      { name: 'المرحلة الرابعة: الاختبارات', key: 'phase4' }
    ];

    let totalCompleted = 0;
    let totalErrors = 0;

    phases.forEach(phase => {
      const result = this.results[phase.key];
      console.log(`\\n${phase.name}:`);
      
      if (result.completed.length > 0) {
        result.completed.forEach(item => console.log(`  ${item}`));
      }
      
      if (result.errors.length > 0) {
        result.errors.forEach(item => console.log(`  ${item}`));
      }

      totalCompleted += result.completed.length;
      totalErrors += result.errors.length;
    });

    console.log(`\\n📈 الإحصائيات النهائية:`);
    console.log(`  - المهام المكتملة: ${totalCompleted}`);
    console.log(`  - الأخطاء: ${totalErrors}`);
    console.log(`  - نسبة النجاح: ${Math.round((totalCompleted / (totalCompleted + totalErrors)) * 100)}%`);
    
    console.log('\\n🎉 تم تنفيذ الخطة الشاملة!');
  }
}

// تشغيل السكريبت
async function main() {
  const fixer = new ComprehensiveProjectFixer();
  await fixer.executeAllPhases();
}

main().catch(console.error);