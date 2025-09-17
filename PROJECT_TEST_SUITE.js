#!/usr/bin/env node

/**
 * 🧪 مجموعة اختبارات شاملة للمشروع
 * تحليل وفحص جميع مكونات النظام
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectTestSuite {
  constructor() {
    this.results = {
      structure: { passed: 0, failed: 0, tests: [] },
      dependencies: { passed: 0, failed: 0, tests: [] },
      configuration: { passed: 0, failed: 0, tests: [] },
      applications: { passed: 0, failed: 0, tests: [] },
      packages: { passed: 0, failed: 0, tests: [] }
    };
  }

  // اختبار بنية المشروع
  testProjectStructure() {
    console.log('🏗️  Testing Project Structure...');
    
    const requiredDirs = [
      'apps',
      'packages', 
      'docs',
      'scripts',
      'config'
    ];

    const requiredFiles = [
      'package.json',
      'nx.json',
      'tsconfig.base.json',
      '.gitignore',
      'README.md'
    ];

    // فحص المجلدات المطلوبة
    requiredDirs.forEach(dir => {
      const exists = fs.existsSync(dir);
      this.results.structure.tests.push({
        name: `Directory: ${dir}`,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? 'Directory exists' : 'Directory missing'
      });
      exists ? this.results.structure.passed++ : this.results.structure.failed++;
    });

    // فحص الملفات المطلوبة
    requiredFiles.forEach(file => {
      const exists = fs.existsSync(file);
      this.results.structure.tests.push({
        name: `File: ${file}`,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? 'File exists' : 'File missing'
      });
      exists ? this.results.structure.passed++ : this.results.structure.failed++;
    });
  }

  // اختبار التبعيات
  testDependencies() {
    console.log('📦 Testing Dependencies...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // فحص التبعيات الأساسية
      const criticalDeps = [
        '@nx/react',
        '@nx/node', 
        'react',
        '@nestjs/core',
        'firebase',
        'typescript'
      ];

      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      criticalDeps.forEach(dep => {
        const exists = allDeps[dep];
        this.results.dependencies.tests.push({
          name: `Dependency: ${dep}`,
          status: exists ? 'PASS' : 'FAIL',
          message: exists ? `Version: ${exists}` : 'Missing dependency'
        });
        exists ? this.results.dependencies.passed++ : this.results.dependencies.failed++;
      });

      // فحص Scripts
      const requiredScripts = ['build', 'test', 'dev'];
      requiredScripts.forEach(script => {
        const exists = packageJson.scripts && packageJson.scripts[script];
        this.results.dependencies.tests.push({
          name: `Script: ${script}`,
          status: exists ? 'PASS' : 'FAIL',
          message: exists ? 'Script defined' : 'Script missing'
        });
        exists ? this.results.dependencies.passed++ : this.results.dependencies.failed++;
      });

    } catch (error) {
      this.results.dependencies.failed++;
      this.results.dependencies.tests.push({
        name: 'Package.json parsing',
        status: 'FAIL',
        message: error.message
      });
    }
  }

  // اختبار التطبيقات
  testApplications() {
    console.log('🎯 Testing Applications...');
    
    const expectedApps = [
      'admin-dashboard',
      'web-chatbot', 
      'api',
      'crm-system'
    ];

    expectedApps.forEach(app => {
      const appPath = path.join('apps', app);
      const exists = fs.existsSync(appPath);
      
      if (exists) {
        // فحص ملفات التطبيق الأساسية
        const projectJson = path.join(appPath, 'project.json');
        const srcDir = path.join(appPath, 'src');
        
        const hasProjectJson = fs.existsSync(projectJson);
        const hasSrc = fs.existsSync(srcDir);
        
        this.results.applications.tests.push({
          name: `App: ${app}`,
          status: (hasProjectJson && hasSrc) ? 'PASS' : 'FAIL',
          message: `project.json: ${hasProjectJson}, src: ${hasSrc}`
        });
        
        (hasProjectJson && hasSrc) ? 
          this.results.applications.passed++ : 
          this.results.applications.failed++;
      } else {
        this.results.applications.tests.push({
          name: `App: ${app}`,
          status: 'FAIL',
          message: 'Application directory missing'
        });
        this.results.applications.failed++;
      }
    });
  }

  // اختبار المكتبات
  testPackages() {
    console.log('📚 Testing Packages...');
    
    const corePackages = [
      'ai-engine',
      'security-core',
      'monitoring-core',
      'crm-core'
    ];

    corePackages.forEach(pkg => {
      const pkgPath = path.join('packages', pkg);
      const exists = fs.existsSync(pkgPath);
      
      if (exists) {
        const srcDir = path.join(pkgPath, 'src');
        const packageJson = path.join(pkgPath, 'package.json');
        
        const hasSrc = fs.existsSync(srcDir);
        const hasPackageJson = fs.existsSync(packageJson);
        
        this.results.packages.tests.push({
          name: `Package: ${pkg}`,
          status: (hasSrc || hasPackageJson) ? 'PASS' : 'FAIL',
          message: `src: ${hasSrc}, package.json: ${hasPackageJson}`
        });
        
        (hasSrc || hasPackageJson) ? 
          this.results.packages.passed++ : 
          this.results.packages.failed++;
      } else {
        this.results.packages.tests.push({
          name: `Package: ${pkg}`,
          status: 'FAIL',
          message: 'Package directory missing'
        });
        this.results.packages.failed++;
      }
    });
  }

  // اختبار التكوين
  testConfiguration() {
    console.log('⚙️  Testing Configuration...');
    
    // فحص ملفات التكوين
    const configFiles = [
      { file: '.nvmrc', desc: 'Node version' },
      { file: '.env.example', desc: 'Environment template' },
      { file: 'firebase.json', desc: 'Firebase config' },
      { file: 'nx.json', desc: 'NX configuration' }
    ];

    configFiles.forEach(({ file, desc }) => {
      const exists = fs.existsSync(file);
      this.results.configuration.tests.push({
        name: `Config: ${desc}`,
        status: exists ? 'PASS' : 'FAIL',
        message: exists ? `${file} exists` : `${file} missing`
      });
      exists ? this.results.configuration.passed++ : this.results.configuration.failed++;
    });

    // فحص NX workspace
    try {
      const nxJson = JSON.parse(fs.readFileSync('nx.json', 'utf8'));
      const hasTargetDefaults = nxJson.targetDefaults;
      
      this.results.configuration.tests.push({
        name: 'NX Target Defaults',
        status: hasTargetDefaults ? 'PASS' : 'FAIL',
        message: hasTargetDefaults ? 'Target defaults configured' : 'No target defaults'
      });
      hasTargetDefaults ? this.results.configuration.passed++ : this.results.configuration.failed++;
      
    } catch (error) {
      this.results.configuration.failed++;
      this.results.configuration.tests.push({
        name: 'NX Configuration',
        status: 'FAIL',
        message: 'Cannot parse nx.json'
      });
    }
  }

  // تشغيل جميع الاختبارات
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Project Test Suite\n');
    console.log('='.repeat(50));
    
    this.testProjectStructure();
    this.testDependencies();
    this.testConfiguration();
    this.testApplications();
    this.testPackages();
    
    this.generateReport();
  }

  // إنتاج التقرير
  generateReport() {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    const categories = Object.keys(this.results);
    let totalPassed = 0;
    let totalFailed = 0;
    
    categories.forEach(category => {
      const { passed, failed } = this.results[category];
      totalPassed += passed;
      totalFailed += failed;
      
      const status = failed === 0 ? '✅' : '⚠️';
      console.log(`${status} ${category.toUpperCase()}: ${passed} passed, ${failed} failed`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎯 OVERALL: ${totalPassed} passed, ${totalFailed} failed`);
    
    const successRate = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (totalFailed === 0) {
      console.log('🎉 All tests passed! Project is in good shape.');
    } else {
      console.log('⚠️  Some issues found. Check detailed results below.');
      this.printFailedTests();
    }
    
    // حفظ التقرير
    this.saveReport();
  }

  // طباعة الاختبارات الفاشلة
  printFailedTests() {
    console.log('\n🔍 FAILED TESTS DETAILS:');
    console.log('-'.repeat(30));
    
    Object.keys(this.results).forEach(category => {
      const failedTests = this.results[category].tests.filter(test => test.status === 'FAIL');
      
      if (failedTests.length > 0) {
        console.log(`\n❌ ${category.toUpperCase()}:`);
        failedTests.forEach(test => {
          console.log(`  • ${test.name}: ${test.message}`);
        });
      }
    });
  }

  // حفظ التقرير
  saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_passed: Object.values(this.results).reduce((sum, cat) => sum + cat.passed, 0),
        total_failed: Object.values(this.results).reduce((sum, cat) => sum + cat.failed, 0)
      },
      details: this.results
    };
    
    const reportPath = `test-reports/project-analysis-${Date.now()}.json`;
    
    // إنشاء مجلد التقارير إذا لم يكن موجوداً
    if (!fs.existsSync('test-reports')) {
      fs.mkdirSync('test-reports', { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
  }
}

// تشغيل الاختبارات
if (require.main === module) {
  const testSuite = new ProjectTestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = ProjectTestSuite;