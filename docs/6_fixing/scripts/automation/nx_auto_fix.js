#!/usr/bin/env node

/**
 * نظام الإصلاح التلقائي لمشروع G-Assistant NX
 * يراقب ويصلح المشاكل تلقائياً في بيئة Nx
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NxAutoFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.reportsDir = path.join(__dirname, '../reports');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  // فحص صحة مشروع Nx
  checkNxHealth() {
    // Removed console.log
    
    try {
      // فحص nx.json
      const nxConfig = path.join(this.projectRoot, 'nx.json');
      if (!fs.existsSync(nxConfig)) {
        this.logIssue('CRITICAL', 'nx.json مفقود');
        return false;
      }

      // فحص package.json
      const packageJson = path.join(this.projectRoot, 'package.json');
      if (!fs.existsSync(packageJson)) {
        this.logIssue('CRITICAL', 'package.json مفقود');
        return false;
      }

      // فحص التطبيقات
      const appsDir = path.join(this.projectRoot, 'apps');
      if (!fs.existsSync(appsDir)) {
        this.logIssue('HIGH', 'مجلد apps مفقود');
        return false;
      }

      // Removed console.log
      return true;
    } catch (error) {
      this.logIssue('CRITICAL', `خطأ في فحص Nx: ${error.message}`);
      return false;
    }
  }

  // فحص التبعيات
  checkDependencies() {
    // Removed console.log
    
    try {
      execSync('pnpm list', { cwd: this.projectRoot, stdio: 'pipe' });
      // Removed console.log
      return true;
    } catch (error) {
      this.logIssue('HIGH', 'مشاكل في التبعيات');
      this.autoFixDependencies();
      return false;
    }
  }

  // إصلاح التبعيات تلقائياً
  autoFixDependencies() {
    // Removed console.log
    
    try {
      execSync('pnpm install', { cwd: this.projectRoot, stdio: 'inherit' });
      // Removed console.log
      this.logFix('DEPENDENCY_FIX', 'تم إعادة تثبيت التبعيات');
    } catch (error) {
      this.logIssue('CRITICAL', `فشل إصلاح التبعيات: ${error.message}`);
    }
  }

  // فحص بناء المشروع
  checkBuild() {
    // Removed console.log
    
    try {
      execSync('nx run-many --target=build --all', { 
        cwd: this.projectRoot, 
        stdio: 'pipe' 
      });
      // Removed console.log
      return true;
    } catch (error) {
      this.logIssue('HIGH', 'فشل في البناء');
      return false;
    }
  }

  // تسجيل المشاكل
  logIssue(severity, message) {
    const issue = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      project: 'g-assistant-nx'
    };

    const reportFile = path.join(this.reportsDir, `auto_fix_${this.timestamp}.json`);
    
    let report = { issues: [], fixes: [] };
    if (fs.existsSync(reportFile)) {
      report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    }
    
    report.issues.push(issue);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // Removed console.log
  }

  // تسجيل الإصلاحات
  logFix(type, message) {
    const fix = {
      timestamp: new Date().toISOString(),
      type,
      message,
      project: 'g-assistant-nx'
    };

    const reportFile = path.join(this.reportsDir, `auto_fix_${this.timestamp}.json`);
    
    let report = { issues: [], fixes: [] };
    if (fs.existsSync(reportFile)) {
      report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    }
    
    report.fixes.push(fix);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // Removed console.log
  }

  // تشغيل الفحص الشامل
  async runFullCheck() {
    // Removed console.log
    
    const checks = [
      this.checkNxHealth(),
      this.checkDependencies(),
      this.checkBuild()
    ];

    const results = await Promise.all(checks);
    const passed = results.filter(r => r).length;
    
    // Removed console.log
    
    if (passed === results.length) {
      // Removed console.log
      this.logFix('HEALTH_CHECK', 'جميع الفحوصات نجحت');
    } else {
      // Removed console.log
    }
  }
}

// تشغيل النظام
if (require.main === module) {
  const fixer = new NxAutoFixer();
  fixer.runFullCheck();
}

module.exports = NxAutoFixer;