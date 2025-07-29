#!/usr/bin/env node

/**
 * @file fix_project_issues.js
 * @description سكريبت متخصص لإصلاح مشاكل المشروع المحددة
 * @author عبدالعزيز
 */

// ES6 import removed for Apps Script compatibility
// ES6 import removed for Apps Script compatibility
class ProjectFixer {
  constructor() {
    this.fixedFiles = [];
    this.errors = [];
  }

  async fixAllIssues() {
    console.log('🔧 بدء إصلاح مشاكل المشروع...\n');

    // إصلاح مشاكل defineModule
    await this.fixDefineModuleIssues();
    
    // إصلاح مشاكل let
    await this.fixVarIssues();
    
    // إصلاح الفواصل المفقودة
    await this.fixMissingCommas();
    
    // إزالة استيرادات ES6 غير المتوافقة
    await this.fixES6Imports();

    this.printSummary();
  }

  async fixDefineModuleIssues() {
    console.log('📦 إصلاح مشاكل defineModule...');
    
    const filesToFix = [
      'src/AI/Constitution.js',
      'src/AI/Core.js', 
      'src/AI/LongTermMemory.js',
      'src/AI/Memory.js',
      'src/AI/ToolExecutor.js',
      'src/Analytics/Dashboard.js',
      'src/Dev/ModuleVerifier.js',
      'src/Intro.js',
      'src/ToolsCodeReview.js',
      'src/ToolsImageProcessor.js',
      'src/UI/DeveloperSidebar.js'
    ];

    for (const file of filesToFix) {
      await this.convertDefineModuleToGAS(file);
    }
  }

  async convertDefineModuleToGAS(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // تحويل defineModule إلى نمط Google Apps Script
      let newContent = content.replace(
        /defineModule\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*\(([^)]*)\)\s*=>\s*\{/g,
        (match, moduleName, params) => {
          const cleanParams = params.replace(/[{}]/g, '').trim();
          return `// Module: ${moduleName}\nfunction create${moduleName.split('.').pop()}(${cleanParams}) {`;
        }
      );

      // إضافة return statement في النهاية إذا لم يكن موجوداً
      if (!newContent.includes('return {') && newContent.includes('function create')) {
        newContent = newContent.replace(/\}\);?\s*$/, '  return { /* add exports here */ };\n}');
      }

      // إزالة استيرادات ES6
      newContent = newContent.replace(/import\s+.*?from\s+['"`].*?['"`];?\s*\n/g, '');

      if (newContent !== content) {
        await this.createBackup(fullPath);
        await fs.writeFile(fullPath, newContent, 'utf8');
        this.fixedFiles.push(`✅ ${filePath} - تم تحويل defineModule`);
      }
    } catch (error) {
      this.errors.push(`❌ ${filePath} - ${error.message}`);
    }
  }

  async fixVarIssues() {
    console.log('🔄 إصلاح مشاكل let...');
    
    const filesToFix = [
      'src/dev_tools/advanced_repair.js',
      'src/dev_tools/intelligent_review_manager.js',
      'src/Tools/advanced-repair.js'
    ];

    for (const file of filesToFix) {
      await this.replaceVarWithLet(file);
    }
  }

  async replaceVarWithLet(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // استبدال let بـ let
      const newContent = content.replace(/\bvar\b/g, 'let');

      if (newContent !== content) {
        await this.createBackup(fullPath);
        await fs.writeFile(fullPath, newContent, 'utf8');
        this.fixedFiles.push(`✅ ${filePath} - تم استبدال let بـ let`);
      }
    } catch (error) {
      this.errors.push(`❌ ${filePath} - ${error.message}`);
    }
  }

  async fixMissingCommas() {
    console.log('📝 إصلاح الفواصل المفقودة...');
    
    const filePath = 'src/dev_tools/advanced_repair.js';
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      const lines = content.split('\n');
      
      // إضافة فاصلة في السطر 176 (تقريباً)
      for (let i = 170; i < 180 && i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('fixable: false') && !line.endsWith(',')) {
          lines[i] = lines[i] + ',';
          break;
        }
      }

      const newContent = lines.join('\n');
      if (newContent !== content) {
        await this.createBackup(fullPath);
        await fs.writeFile(fullPath, newContent, 'utf8');
        this.fixedFiles.push(`✅ ${filePath} - تم إضافة فاصلة مفقودة`);
      }
    } catch (error) {
      this.errors.push(`❌ ${filePath} - ${error.message}`);
    }
  }

  async fixES6Imports() {
    console.log('🚫 إزالة استيرادات ES6 غير المتوافقة...');
    
    const filesToFix = [
      'src/AgentTriggers.js',
      'src/Config.js', 
      'src/Tools/Catalog.js',
      'src/Tools/Sheets.js'
    ];

    for (const file of filesToFix) {
      await this.removeES6Imports(file);
    }
  }

  async removeES6Imports(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // إزالة جميع استيرادات ES6
      let newContent = content.replace(/import\s+.*?from\s+['"`].*?['"`];?\s*\n/g, '');
      
      // إضافة تعليق توضيحي
      if (newContent !== content) {
        newContent = '// ES6 imports removed for Google Apps Script compatibility\n' + newContent;
        
        await this.createBackup(fullPath);
        await fs.writeFile(fullPath, newContent, 'utf8');
        this.fixedFiles.push(`✅ ${filePath} - تم إزالة استيرادات ES6`);
      }
    } catch (error) {
      this.errors.push(`❌ ${filePath} - ${error.message}`);
    }
  }

  async createBackup(filePath) {
    const backupPath = `${filePath}.backup-${Date.now()}`;
    await fs.copyFile(filePath, backupPath);
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 ملخص الإصلاحات:');
    console.log('='.repeat(50));
    
    if (this.fixedFiles.length > 0) {
      console.log('\n✅ الملفات المُصلحة:');
      this.fixedFiles.forEach(fix => console.log(`  ${fix}`));
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ الأخطاء:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    console.log(`\n📈 الإحصائيات:`);
    console.log(`  - تم إصلاح: ${this.fixedFiles.length} ملف`);
    console.log(`  - أخطاء: ${this.errors.length} ملف`);
    console.log(`  - نسبة النجاح: ${Math.round((this.fixedFiles.length / (this.fixedFiles.length + this.errors.length)) * 100)}%`);
    
    console.log('\n🎉 انتهى الإصلاح!');
    console.log('💡 تحقق من النسخ الاحتياطية (.backup-*) في حالة الحاجة للاستعادة');
  }
}

// تشغيل السكريبت
async function main() {
  const fixer = new ProjectFixer();
  await fixer.fixAllIssues();
}

main().catch(console.error);