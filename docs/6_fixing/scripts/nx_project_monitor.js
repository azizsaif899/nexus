#!/usr/bin/env node

/**
 * مراقب مشروع G-Assistant NX
 * يراقب التغييرات ويولد التقارير
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NxProjectMonitor {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.reportsDir = path.join(__dirname, '../reports');
    this.timestamp = new Date().toISOString().split('T')[0];
  }

  // مراقبة حالة التطبيقات
  monitorApps() {
    console.log('📱 مراقبة التطبيقات...');
    
    const appsDir = path.join(this.projectRoot, 'apps');
    const apps = fs.readdirSync(appsDir);
    
    const appStatus = apps.map(app => {
      const appPath = path.join(appsDir, app);
      const projectJson = path.join(appPath, 'project.json');
      
      return {
        name: app,
        exists: fs.existsSync(projectJson),
        lastModified: fs.existsSync(appPath) ? 
          fs.statSync(appPath).mtime.toISOString() : null
      };
    });

    return appStatus;
  }

  // مراقبة حالة المكتبات
  monitorPackages() {
    console.log('📦 مراقبة المكتبات...');
    
    const packagesDir = path.join(this.projectRoot, 'packages');
    if (!fs.existsSync(packagesDir)) return [];
    
    const packages = fs.readdirSync(packagesDir).filter(p => p !== '.gitkeep');
    
    const packageStatus = packages.map(pkg => {
      const pkgPath = path.join(packagesDir, pkg);
      const projectJson = path.join(pkgPath, 'project.json');
      
      return {
        name: pkg,
        exists: fs.existsSync(projectJson),
        lastModified: fs.existsSync(pkgPath) ? 
          fs.statSync(pkgPath).mtime.toISOString() : null
      };
    });

    return packageStatus;
  }

  // فحص حالة Git
  checkGitStatus() {
    console.log('🔍 فحص حالة Git...');
    
    try {
      const status = execSync('git status --porcelain', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      });
      
      const changes = status.trim().split('\n').filter(line => line.length > 0);
      
      return {
        hasChanges: changes.length > 0,
        changedFiles: changes.length,
        lastCommit: execSync('git log -1 --format="%H %s"', {
          cwd: this.projectRoot,
          encoding: 'utf8'
        }).trim()
      };
    } catch (error) {
      return {
        hasChanges: false,
        changedFiles: 0,
        error: error.message
      };
    }
  }

  // توليد تقرير شامل
  generateReport() {
    console.log('📊 توليد التقرير...');
    
    const report = {
      timestamp: new Date().toISOString(),
      project: 'g-assistant-nx',
      apps: this.monitorApps(),
      packages: this.monitorPackages(),
      git: this.checkGitStatus(),
      summary: {
        totalApps: 0,
        totalPackages: 0,
        healthScore: 0
      }
    };

    // حساب الملخص
    report.summary.totalApps = report.apps.length;
    report.summary.totalPackages = report.packages.length;
    
    const healthyApps = report.apps.filter(app => app.exists).length;
    const healthyPackages = report.packages.filter(pkg => pkg.exists).length;
    const total = report.summary.totalApps + report.summary.totalPackages;
    const healthy = healthyApps + healthyPackages;
    
    report.summary.healthScore = total > 0 ? Math.round((healthy / total) * 100) : 100;

    // حفظ التقرير
    const reportFile = path.join(this.reportsDir, `nx_monitor_${this.timestamp}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`✅ تم حفظ التقرير: ${reportFile}`);
    console.log(`📊 نقاط الصحة: ${report.summary.healthScore}%`);
    
    return report;
  }

  // تشغيل المراقبة
  run() {
    console.log('🚀 بدء مراقبة مشروع G-Assistant NX...');
    
    // إنشاء مجلد التقارير إذا لم يكن موجوداً
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    
    const report = this.generateReport();
    
    // عرض ملخص سريع
    console.log('\n📋 ملخص المشروع:');
    console.log(`   التطبيقات: ${report.summary.totalApps}`);
    console.log(`   المكتبات: ${report.summary.totalPackages}`);
    console.log(`   نقاط الصحة: ${report.summary.healthScore}%`);
    console.log(`   تغييرات Git: ${report.git.changedFiles} ملف`);
    
    return report;
  }
}

// تشغيل المراقب
if (require.main === module) {
  const monitor = new NxProjectMonitor();
  monitor.run();
}

module.exports = NxProjectMonitor;