
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
