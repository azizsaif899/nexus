#!/usr/bin/env node

/**
 * Health Check النهائي لنظام G-Assistant
 * يتحقق من:
 * 1. وجود جميع الملفات الأساسية
 * 2. صحة module_manifest.json
 * 3. تطابق appsscript.json مع الملفات الموجودة
 * 4. التحقق من بنية defineModule في الملفات
 */

const fs = require('fs');
const path = require('path');

class HealthChecker {
  constructor() {
    this.results = {
      totalChecks: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(type, message, details = null) {
    this.results.totalChecks++;
    this.results.details.push({ type, message, details });

    const icons = { pass: '✅', fail: '❌', warn: '⚠️', info: 'ℹ️' };
    console.log(`${icons[type] || 'ℹ️'} ${message}`);

    if (details) console.log(`   ${details}`);

    if (type === 'pass') this.results.passed++;
    else if (type === 'fail') this.results.failed++;
    else if (type === 'warn') this.results.warnings++;
  }

  checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.log('pass', `${description} موجود`);
      return true;
    } else {
      this.log('fail', `${description} مفقود`, filePath);
      return false;
    }
  }

  checkCoreFiles() {
    console.log('\n🔍 فحص الملفات الأساسية...');

    const coreFiles = [
      { path: '00_utils.js', desc: 'نظام الوحدات الأساسي' },
      { path: '00_initializer.js', desc: 'مهيئ النظام' },
      { path: '01_config.js', desc: 'نظام الإعدادات' },
      { path: 'module_manifest.json', desc: 'دليل الوحدات' },
      { path: 'appsscript.json', desc: 'إعدادات Google Apps Script' }
    ];

    coreFiles.forEach(file => {
      this.checkFileExists(file.path, file.desc);
    });
  }

  checkModuleManifest() {
    console.log('\n📋 فحص دليل الوحدات...');

    try {
      const manifestPath = 'module_manifest.json';
      if (!fs.existsSync(manifestPath)) {
        this.log('fail', 'ملف module_manifest.json مفقود');
        return;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      if (!manifest.modules || !Array.isArray(manifest.modules)) {
        this.log('fail', 'بنية module_manifest.json غير صحيحة');
        return;
      }

      this.log('pass', `تم العثور على ${manifest.modules.length} وحدة في الدليل`);

      // التحقق من وجود الملفات المذكورة في الدليل
      let missingFiles = 0;
      manifest.modules.forEach(module => {
        if (module.file && !fs.existsSync(module.file)) {
          this.log('warn', `ملف الوحدة مفقود: ${module.name}`, module.file);
          missingFiles++;
        }
      });

      if (missingFiles === 0) {
        this.log('pass', 'جميع ملفات الوحدات موجودة');
      } else {
        this.log('warn', `${missingFiles} ملف وحدة مفقود`);
      }

    } catch (error) {
      this.log('fail', 'خطأ في قراءة module_manifest.json', error.message);
    }
  }

  checkAppsScriptConfig() {
    console.log('\n⚙️ فحص إعدادات Apps Script...');

    try {
      const configPath = 'appsscript.json';
      if (!fs.existsSync(configPath)) {
        this.log('fail', 'ملف appsscript.json مفقود');
        return;
      }

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      if (!config.dependencies || !config.dependencies.libraries) {
        this.log('warn', 'لا توجد مكتبات معرفة في appsscript.json');
      } else {
        this.log('pass', `تم العثور على ${config.dependencies.libraries.length} مكتبة`);
      }

      if (!config.webapp) {
        this.log('warn', 'إعدادات webapp غير معرفة');
      } else {
        this.log('pass', 'إعدادات webapp موجودة');
      }

    } catch (error) {
      this.log('fail', 'خطأ في قراءة appsscript.json', error.message);
    }
  }

  checkModuleStructure() {
    console.log('\n🏗️ فحص بنية الوحدات...');

    const jsFiles = this.findJSFiles('.');
    let validModules = 0;
    let invalidModules = 0;

    jsFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');

        // التحقق من وجود defineModule
        if (content.includes('defineModule(')) {
          validModules++;
        } else if (file.includes('00_utils.js') || file.includes('health_check.js')) {
          // ملفات مستثناة
        } else {
          invalidModules++;
          this.log('warn', 'الملف لا يحتوي على defineModule', file);
        }
      } catch (error) {
        this.log('warn', 'خطأ في قراءة الملف', `${file}: ${error.message}`);
      }
    });

    this.log('pass', `${validModules} وحدة صحيحة البنية`);
    if (invalidModules > 0) {
      this.log('warn', `${invalidModules} ملف بدون defineModule`);
    }
  }

  findJSFiles(dir, files = []) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && !['node_modules', 'backups', 'backup_old_project'].includes(item)) {
        this.findJSFiles(fullPath, files);
      } else if (stat.isFile() && item.endsWith('.js') && !item.includes('test') && !item.includes('backup')) {
        files.push(fullPath);
      }
    });

    return files;
  }

  generateReport() {
    console.log('\n📊 تقرير الصحة النهائي:');
    console.log('═'.repeat(50));

    const total = this.results.totalChecks;
    const passed = this.results.passed;
    const failed = this.results.failed;
    const warnings = this.results.warnings;

    const healthPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    console.log(`إجمالي الفحوصات: ${total}`);
    console.log(`نجح: ${passed} ✅`);
    console.log(`فشل: ${failed} ❌`);
    console.log(`تحذيرات: ${warnings} ⚠️`);
    console.log(`نسبة الصحة: ${healthPercentage}%`);

    let status = 'ممتاز';
    if (healthPercentage < 70) status = 'يحتاج إصلاح';
    else if (healthPercentage < 85) status = 'جيد';
    else if (healthPercentage < 95) status = 'جيد جداً';

    console.log(`حالة النظام: ${status}`);

    if (failed > 0) {
      console.log('\n❌ مشاكل حرجة تحتاج إصلاح فوري:');
      this.results.details
        .filter(d => d.type === 'fail')
        .forEach(d => console.log(`   • ${d.message}`));
    }

    if (warnings > 0) {
      console.log('\n⚠️ تحذيرات (مستحسن إصلاحها):');
      this.results.details
        .filter(d => d.type === 'warn')
        .slice(0, 5) // أول 5 تحذيرات فقط
        .forEach(d => console.log(`   • ${d.message}`));
    }

    console.log('\n' + '═'.repeat(50));

    return {
      healthPercentage,
      status,
      passed,
      failed,
      warnings,
      total
    };
  }

  run() {
    console.log('🚀 بدء فحص صحة نظام G-Assistant...\n');

    this.checkCoreFiles();
    this.checkModuleManifest();
    this.checkAppsScriptConfig();
    this.checkModuleStructure();

    return this.generateReport();
  }
}

// تشغيل الفحص
if (require.main === module) {
  const checker = new HealthChecker();
  const report = checker.run();

  // إنهاء العملية بكود الخطأ المناسب
  process.exit(report.failed > 0 ? 1 : 0);
}

module.exports = HealthChecker;
