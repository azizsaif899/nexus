// 🩺 مشخص ومصحح المشروع الشامل
const fs = require('fs');
const path = require('path');

class ProjectDoctor {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.distDir = path.join(projectRoot, 'dist');
    this.issues = [];
    this.fixes = [];
    this.modules = new Map();
    this.dependencies = new Map();
  }

  // 🔍 فحص شامل للمشروع
  async diagnose() {
    console.log('🩺 بدء التشخيص الشامل للمشروع...');
    
    await this.checkProjectStructure();
    await this.analyzeModules();
    await this.checkInjectorSystem();
    await this.validateDefineModule();
    await this.checkModuleReadiness();
    await this.analyzeDependencyOrder();
    
    this.generateReport();
    return this.issues;
  }

  // 🏗️ فحص هيكل المشروع
  async checkProjectStructure() {
    console.log('📁 فحص هيكل المشروع...');
    
    const requiredFiles = [
      '00_utils.js',
      '99_Initializer.js',
      'appsscript.json'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.distDir, file);
      if (!fs.existsSync(filePath)) {
        this.issues.push({
          type: 'MISSING_FILE',
          severity: 'HIGH',
          file: file,
          message: `ملف أساسي مفقود: ${file}`
        });
      }
    }
  }

  // 📦 تحليل الوحدات
  async analyzeModules() {
    console.log('📦 تحليل الوحدات...');
    
    const jsFiles = this.getJSFiles(this.distDir);
    
    for (const file of jsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const modules = this.extractModules(content, file);
      
      modules.forEach(module => {
        this.modules.set(module.name, module);
        this.dependencies.set(module.name, module.deps);
      });
    }
    
    console.log(`✅ تم العثور على ${this.modules.size} وحدة`);
  }

  // 🔧 فحص نظام الحقن
  async checkInjectorSystem() {
    console.log('🔧 فحص نظام الحقن...');
    
    const utilsPath = path.join(this.distDir, '00_utils.js');
    if (!fs.existsSync(utilsPath)) {
      this.issues.push({
        type: 'MISSING_INJECTOR',
        severity: 'CRITICAL',
        message: 'نظام الحقن مفقود في 00_utils.js'
      });
      return;
    }
    
    const content = fs.readFileSync(utilsPath, 'utf8');
    
    // فحص وجود المكونات الأساسية
    const requiredComponents = [
      'GAssistant.Utils.Injector',
      'defineModule',
      'buildAllModules',
      '_moduleFactories',
      '_moduleExports'
    ];
    
    requiredComponents.forEach(component => {
      if (!content.includes(component)) {
        this.issues.push({
          type: 'MISSING_INJECTOR_COMPONENT',
          severity: 'HIGH',
          component: component,
          message: `مكون الحقن مفقود: ${component}`
        });
      }
    });
  }

  // 📝 فحص تعريف الوحدات
  async validateDefineModule() {
    console.log('📝 فحص تعريفات الوحدات...');
    
    for (const [name, module] of this.modules) {
      // فحص صيغة defineModule
      if (!module.hasValidSyntax) {
        this.issues.push({
          type: 'INVALID_DEFINE_SYNTAX',
          severity: 'MEDIUM',
          module: name,
          file: module.file,
          message: `صيغة defineModule غير صحيحة في ${name}`
        });
      }
      
      // فحص التبعيات
      if (module.deps.length > 0) {
        module.deps.forEach(dep => {
          if (!this.modules.has(dep) && !this.isBuiltinDependency(dep)) {
            this.issues.push({
              type: 'MISSING_DEPENDENCY',
              severity: 'HIGH',
              module: name,
              dependency: dep,
              message: `تبعية مفقودة: ${dep} مطلوبة بواسطة ${name}`
            });
          }
        });
      }
    }
  }

  // ✅ فحص جاهزية الوحدات
  async checkModuleReadiness() {
    console.log('✅ فحص جاهزية الوحدات...');
    
    const criticalModules = [
      'System.Utils',
      'System.Config', 
      'System.DocsManager',
      'System.Telemetry',
      'System.Dev.ModuleVerifier'
    ];
    
    criticalModules.forEach(moduleName => {
      if (!this.modules.has(moduleName)) {
        this.issues.push({
          type: 'MISSING_CRITICAL_MODULE',
          severity: 'CRITICAL',
          module: moduleName,
          message: `وحدة حرجة مفقودة: ${moduleName}`
        });
      }
    });
  }

  // 🔄 تحليل ترتيب التبعيات
  async analyzeDependencyOrder() {
    console.log('🔄 تحليل ترتيب التبعيات...');
    
    try {
      const sorted = this.topologicalSort();
      console.log(`✅ ترتيب صحيح لـ ${sorted.length} وحدة`);
    } catch (error) {
      this.issues.push({
        type: 'CIRCULAR_DEPENDENCY',
        severity: 'HIGH',
        message: `تبعية دائرية مكتشفة: ${error.message}`
      });
    }
  }

  // 🛠️ إصلاح تلقائي للمشاكل
  async autoFix() {
    console.log('🛠️ بدء الإصلاح التلقائي...');
    
    for (const issue of this.issues) {
      switch (issue.type) {
        case 'MISSING_INJECTOR':
          await this.fixMissingInjector();
          break;
        case 'MISSING_CRITICAL_MODULE':
          await this.fixMissingCriticalModule(issue.module);
          break;
        case 'INVALID_DEFINE_SYNTAX':
          await this.fixDefineModuleSyntax(issue.module, issue.file);
          break;
      }
    }
    
    console.log(`✅ تم إصلاح ${this.fixes.length} مشكلة`);
  }

  // 🔧 إصلاح نظام الحقن المفقود
  async fixMissingInjector() {
    const injectorCode = `
// نظام الحقن الأساسي
if (typeof Logger === 'undefined') {
  var Logger = {
    log: function() { try { console.log.apply(console, arguments); } catch(e) {} }
  };
}

var GAssistant = GAssistant || { System: {}, Utils: {} };

GAssistant.Utils.Injector = {
  _moduleFactories: {},
  _moduleExports: {},
  
  registerFactory: function(name, factory) {
    this._moduleFactories[name] = factory;
  },
  
  setExports: function(name, exports) {
    this._moduleExports[name] = exports;
  },
  
  get: function(...deps) {
    const resolved = {};
    deps.forEach(name => {
      resolved[name] = this._moduleExports[name] || this._createFallback(name);
    });
    return resolved;
  },
  
  _createFallback: function(name) {
    return { _isFallback: true, init: () => true };
  },
  
  buildAllModules: function() {
    Object.keys(this._moduleFactories).forEach(name => {
      try {
        const factory = this._moduleFactories[name];
        const exports = factory(this.get());
        this.setExports(name, exports);
        Logger.log(\`✅ Built: \${name}\`);
      } catch (e) {
        Logger.log(\`❌ Failed: \${name} - \${e.message}\`);
        this.setExports(name, this._createFallback(name));
      }
    });
  }
};

this.defineModule = function(name, factory) {
  GAssistant.Utils.Injector.registerFactory(name, factory);
};
`;
    
    const utilsPath = path.join(this.distDir, '00_utils.js');
    fs.writeFileSync(utilsPath, injectorCode);
    this.fixes.push('إصلاح نظام الحقن');
  }

  // 📊 تقرير شامل
  generateReport() {
    console.log('\n📊 تقرير التشخيص الشامل:');
    console.log('='.repeat(50));
    
    const severityCount = {
      CRITICAL: this.issues.filter(i => i.severity === 'CRITICAL').length,
      HIGH: this.issues.filter(i => i.severity === 'HIGH').length,
      MEDIUM: this.issues.filter(i => i.severity === 'MEDIUM').length
    };
    
    console.log(`🔴 مشاكل حرجة: ${severityCount.CRITICAL}`);
    console.log(`🟡 مشاكل عالية: ${severityCount.HIGH}`);
    console.log(`🟢 مشاكل متوسطة: ${severityCount.MEDIUM}`);
    console.log(`📦 وحدات مكتشفة: ${this.modules.size}`);
    
    if (this.issues.length === 0) {
      console.log('✅ المشروع سليم!');
    } else {
      console.log('\n🔍 تفاصيل المشاكل:');
      this.issues.forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.severity}] ${issue.message}`);
      });
    }
  }

  // مساعدات
  getJSFiles(dir) {
    const files = [];
    const scan = (currentDir) => {
      fs.readdirSync(currentDir).forEach(item => {
        const fullPath = path.join(currentDir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          scan(fullPath);
        } else if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      });
    };
    scan(dir);
    return files;
  }

  extractModules(content, filePath) {
    const modules = [];
    const defineRegex = /defineModule\s*\(\s*['"]([^'"]+)['"]\s*,\s*(?:\(([^)]*)\)|function\s*\([^)]*\))/g;
    
    let match;
    while ((match = defineRegex.exec(content)) !== null) {
      const name = match[1];
      const depsStr = match[2] || '';
      const deps = this.parseDependencies(depsStr);
      
      modules.push({
        name,
        deps,
        file: path.relative(this.projectRoot, filePath),
        hasValidSyntax: true
      });
    }
    
    return modules;
  }

  parseDependencies(depsStr) {
    if (!depsStr) return [];
    const cleaned = depsStr.replace(/[{}]/g, '').trim();
    return cleaned.split(',').map(d => d.trim()).filter(Boolean);
  }

  isBuiltinDependency(dep) {
    const builtins = ['Utils', 'Config', 'DocsManager', 'Telemetry', 'Logger'];
    return builtins.includes(dep);
  }

  topologicalSort() {
    const visited = new Set();
    const visiting = new Set();
    const sorted = [];

    const visit = (name) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        throw new Error(`Circular dependency: ${name}`);
      }
      
      visiting.add(name);
      const deps = this.dependencies.get(name) || [];
      deps.forEach(dep => {
        if (this.modules.has(dep)) visit(dep);
      });
      visiting.delete(name);
      visited.add(name);
      sorted.push(name);
    };

    Array.from(this.modules.keys()).forEach(visit);
    return sorted;
  }
}

// تشغيل المشخص
async function main() {
  const doctor = new ProjectDoctor();
  await doctor.diagnose();
  
  if (doctor.issues.length > 0) {
    console.log('\n🛠️ هل تريد الإصلاح التلقائي؟ (y/n)');
    // في بيئة حقيقية، يمكن إضافة readline هنا
    await doctor.autoFix();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProjectDoctor;