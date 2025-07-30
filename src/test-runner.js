/**
 * Integration Test Runner
 * يشغل اختبارات التكامل للنظام بأكمله
 */

import fs from 'fs/promises';
import path from 'path';

const ROOT_DIR = process.cwd();

class IntegrationTestRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🧪 بدء اختبارات التكامل...\n');

    await this.testBuildProcess();
    await this.testModuleStructure();
    await this.testDependencyResolution();
    await this.testES6Pipeline();

    this.printResults();
    
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }

  async testBuildProcess() {
    await this.runTest('Build Process', async () => {
      // اختبار عملية البناء
      const { execSync } = await import('child_process');
      
      try {
        execSync('node build.js', { stdio: 'pipe' });
        
        // التحقق من وجود dist/
        const distExists = await fs.access(path.join(ROOT_DIR, 'dist')).then(() => true).catch(() => false);
        if (!distExists) throw new Error('dist/ directory not created');
        
        // التحقق من وجود appsscript.json
        const manifestExists = await fs.access(path.join(ROOT_DIR, 'dist', 'appsscript.json')).then(() => true).catch(() => false);
        if (!manifestExists) throw new Error('appsscript.json not created');
        
        return 'Build process completed successfully';
      } catch (error) {
        throw new Error(`Build failed: ${error.message}`);
      }
    });
  }

  async testModuleStructure() {
    await this.runTest('Module Structure', async () => {
      // التحقق من بنية الوحدات
      const coreFiles = [
        '00_utils.js',
        '01_config.js',
        '02_intro.js',
        '99_Code.js',
        '00_Initializer.js'
      ];

      for (const file of coreFiles) {
        const filePath = path.join(ROOT_DIR, file);
        const exists = await fs.access(filePath).then(() => true).catch(() => false);
        if (!exists) {
          throw new Error(`Core file missing: ${file}`);
        }

        const content = await fs.readFile(filePath, 'utf-8');
        if (!content.includes('defineModule')) {
          throw new Error(`File ${file} doesn't contain defineModule`);
        }
      }

      return 'All core modules have correct structure';
    });
  }

  async testDependencyResolution() {
    await this.runTest('Dependency Resolution', async () => {
      // اختبار حل التبعيات
      const buildJs = path.join(ROOT_DIR, 'build.js');
      const content = await fs.readFile(buildJs, 'utf-8');
      
      if (!content.includes('parseDependencies')) {
        throw new Error('parseDependencies function not found in build.js');
      }

      if (!content.includes('topologicalSort')) {
        throw new Error('topologicalSort function not found');
      }

      return 'Dependency resolution system is intact';
    });
  }

  async testES6Pipeline() {
    await this.runTest('ES6 Pipeline', async () => {
      // اختبار ES6 pipeline
      const es6BuildExists = await fs.access(path.join(ROOT_DIR, 'build-es6.js')).then(() => true).catch(() => false);
      if (!es6BuildExists) throw new Error('build-es6.js not found');

      const babelConfigExists = await fs.access(path.join(ROOT_DIR, 'babel.config.js')).then(() => true).catch(() => false);
      if (!babelConfigExists) throw new Error('babel.config.js not found');

      const srcUtilsExists = await fs.access(path.join(ROOT_DIR, 'src', 'core', 'utils.js')).then(() => true).catch(() => false);
      if (!srcUtilsExists) throw new Error('ES6 utils module not found');

      return 'ES6 development pipeline is ready';
    });
  }

  async runTest(name, testFn) {
    this.results.total++;
    
    try {
      const result = await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS', message: result });
      console.log(`✅ ${name}: PASS`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', message: error.message });
      console.log(`❌ ${name}: FAIL - ${error.message}`);
    }
  }

  printResults() {
    console.log('\n📊 نتائج اختبارات التكامل:');
    console.log('================================');
    console.log(`إجمالي الاختبارات: ${this.results.total}`);
    console.log(`نجح: ${this.results.passed}`);
    console.log(`فشل: ${this.results.failed}`);
    console.log(`معدل النجاح: ${Math.round((this.results.passed / this.results.total) * 100)}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 جميع اختبارات التكامل نجحت! النظام جاهز للنشر.');
    } else {
      console.log('\n⚠️ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه.');
    }
  }
}

// تشغيل الاختبارات
const runner = new IntegrationTestRunner();
runner.runAllTests().catch(console.error);