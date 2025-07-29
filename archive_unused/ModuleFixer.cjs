#!/usr/bin/env node

/**
 * 🪄 ModuleFixer.js - أداة تحويل تلقائي للوحدات
 * تحول الملفات العادية إلى وحدات defineModule أو ES6
 */

const fs = require('fs');
const path = require('path');

class ModuleFixer {
  constructor() {
    this.report = {
      scanned: 0,
      converted: 0,
      skipped: 0,
      errors: 0,
      files: []
    };
  }

  // تحديد نوع الوحدة المناسب حسب المسار
  getModuleType(filePath) {
    if (filePath.startsWith('src/')) {
      return 'es6';
    }
    return 'defineModule';
  }

  // استخراج اسم الوحدة من المسار
  extractModuleName(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    
    // إزالة امتداد .js
    const withoutExt = normalized.replace(/\.js$/, '');
    
    // تحويل مسارات src إلى أسماء وحدات
    if (withoutExt.startsWith('src/')) {
      return 'System.' + withoutExt.substring(4).replace(/\//g, '.');
    }
    
    // للملفات الأخرى، استخدم اسم الملف
    const fileName = path.basename(withoutExt);
    return `System.${fileName}`;
  }

  // تحليل التبعيات من محتوى الملف
  analyzeDependencies(content) {
    const deps = new Set();
    
    // البحث عن استدعاءات شائعة
    const patterns = [
      /GAssistant\.System\.(\w+)/g,
      /System\.(\w+)/g,
      /Utils\./g,
      /Config\./g,
      /AI\./g,
      /UI\./g,
      /Tools\./g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          deps.add(match[1]);
        }
      }
    });
    
    // إضافة تبعيات شائعة
    if (content.includes('SpreadsheetApp') || content.includes('getActiveSheet')) {
      deps.add('Utils');
    }
    if (content.includes('PropertiesService') || content.includes('getProperty')) {
      deps.add('Config');
    }
    
    return Array.from(deps).slice(0, 5); // أول 5 تبعيات
  }

  // توليد قالب defineModule
  generateDefineModuleTemplate(moduleName, dependencies, originalContent) {
    const depsStr = dependencies.length > 0 ? `{ ${dependencies.join(', ')} }` : '()';
    
    return `/**
 * @module ${moduleName}
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */
defineModule('${moduleName}', (${depsStr}) => {
  'use strict';

  // === المحتوى الأصلي ===
${originalContent.split('\n').map(line => '  ' + line).join('\n')}

  // === التصدير ===
  return {
    // أضف الدوال والمتغيرات التي تريد تصديرها هنا
  };
});`;
  }

  // توليد قالب ES6
  generateES6Template(moduleName, dependencies, originalContent) {
    const imports = dependencies.map(dep => `import { ${dep} } from './${dep}.js';`).join('\n');
    
    return `/**
 * @module ${moduleName}
 * @description تم تحويله تلقائياً بواسطة ModuleFixer
 */

${imports}

// === المحتوى الأصلي ===
${originalContent}

// === التصدير ===
// أضف exports حسب الحاجة
// export { functionName, variableName };`;
  }

  // معالجة ملف واحد
  processFile(filePath) {
    try {
      this.report.scanned++;
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // تخطي الملفات التي تحتوي بالفعل على defineModule أو ES6
      if (content.includes('defineModule(') || 
          content.match(/^(import|export)\s/m) ||
          content.includes('export ') || 
          content.includes('import ')) {
        this.report.skipped++;
        this.report.files.push({
          path: filePath,
          status: 'skipped',
          reason: 'Already a module'
        });
        return;
      }
      
      const moduleName = this.extractModuleName(filePath);
      const dependencies = this.analyzeDependencies(content);
      const moduleType = this.getModuleType(filePath);
      
      let newContent;
      if (moduleType === 'es6') {
        newContent = this.generateES6Template(moduleName, dependencies, content);
      } else {
        newContent = this.generateDefineModuleTemplate(moduleName, dependencies, content);
      }
      
      // إنشاء نسخة احتياطية
      const backupPath = filePath + '.backup';
      fs.writeFileSync(backupPath, content);
      
      // كتابة المحتوى الجديد
      fs.writeFileSync(filePath, newContent);
      
      this.report.converted++;
      this.report.files.push({
        path: filePath,
        status: 'converted',
        moduleName,
        moduleType,
        dependencies,
        backupPath
      });
      
      console.log(`✅ تم تحويل: ${filePath} → ${moduleName} (${moduleType})`);
      
    } catch (error) {
      this.report.errors++;
      this.report.files.push({
        path: filePath,
        status: 'error',
        error: error.message
      });
      console.error(`❌ خطأ في معالجة ${filePath}: ${error.message}`);
    }
  }

  // البحث عن الملفات التي تحتاج تحويل
  findFilesToConvert() {
    const files = [];
    
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && 
            !item.startsWith('.') && 
            !['node_modules', 'backups', 'docs', 'dist', 'tests'].includes(item)) {
          scanDir(fullPath);
        } else if (stat.isFile() && 
                   item.endsWith('.js') && 
                   !item.includes('test') && 
                   !item.includes('backup') &&
                   !item.includes('build') &&
                   !item.includes('ModuleFixer')) {
          files.push(fullPath);
        }
      });
    };
    
    // فحص مجلد src بشكل أساسي
    if (fs.existsSync('src')) {
      scanDir('src');
    }
    
    // فحص بعض الملفات الأخرى
    ['50_analytics', 'babel-plugin-es6-to-definemodule.js'].forEach(item => {
      if (fs.existsSync(item)) {
        if (fs.statSync(item).isDirectory()) {
          scanDir(item);
        } else {
          files.push(item);
        }
      }
    });
    
    return files;
  }

  // حفظ التقرير
  saveReport() {
    const reportPath = 'missing_modules_report.json';
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        scanned: this.report.scanned,
        converted: this.report.converted,
        skipped: this.report.skipped,
        errors: this.report.errors
      },
      files: this.report.files
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`📄 تم حفظ التقرير في: ${reportPath}`);
  }

  // تشغيل الأداة
  run(dryRun = false) {
    console.log('🪄 بدء تشغيل ModuleFixer...\n');
    
    const filesToConvert = this.findFilesToConvert();
    console.log(`📁 تم العثور على ${filesToConvert.length} ملف للفحص\n`);
    
    if (dryRun) {
      console.log('🔍 وضع المعاينة - لن يتم تعديل أي ملفات:\n');
      filesToConvert.forEach(file => {
        const moduleName = this.extractModuleName(file);
        const moduleType = this.getModuleType(file);
        console.log(`  ${file} → ${moduleName} (${moduleType})`);
      });
      return;
    }
    
    filesToConvert.forEach(file => this.processFile(file));
    
    console.log('\n📊 ملخص العملية:');
    console.log(`  📁 ملفات مفحوصة: ${this.report.scanned}`);
    console.log(`  ✅ ملفات محولة: ${this.report.converted}`);
    console.log(`  ⏭️ ملفات متخطاة: ${this.report.skipped}`);
    console.log(`  ❌ أخطاء: ${this.report.errors}`);
    
    this.saveReport();
    
    if (this.report.converted > 0) {
      console.log('\n💡 نصائح:');
      console.log('  • راجع الملفات المحولة وأضف exports المناسبة');
      console.log('  • شغل npm run health-check للتحقق من النتائج');
      console.log('  • النسخ الاحتياطية محفوظة بامتداد .backup');
    }
  }
}

// تشغيل الأداة
if (require.main === module) {
  const fixer = new ModuleFixer();
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  
  fixer.run(dryRun);
}

module.exports = ModuleFixer;