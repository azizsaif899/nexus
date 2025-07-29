
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
      summary: {
        totalModules: this.loadedModules.size,
        totalIssues: issues.length
      }
    };
  }

  generateReport() {
    const validation = this.validateAll();
    
    let report = '# تقرير فحص التبعيات\n\n';
    report += `الوحدات المحملة: ${validation.summary.totalModules}\n`;
    report += `المشاكل المكتشفة: ${validation.summary.totalIssues}\n\n`;

    if (validation.issues.length > 0) {
      report += '## المشاكل:\n';
      validation.issues.forEach(issue => {
        report += `- ${issue.module} يحتاج ${issue.missingDependency}\n`;
      });
    } else {
      report += '✅ جميع التبعيات صحيحة\n';
    }

    return report;
  }
}

export default DependencyValidation;
