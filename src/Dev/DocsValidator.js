
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
    const moduleMatch = content.match(/@module\s+([^\s]+)/);
    const versionMatch = content.match(/@version\s+([^\s]+)/);
    
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
      summary: {
        missingDocs: this.issues.filter(i => i.type === 'missing_documentation').length,
        orphanedDocs: this.issues.filter(i => i.type === 'orphaned_documentation').length
      }
    };
  }
}

export default DocsValidator;
