#!/usr/bin/env node

/**
 * 🔒 Security Scanner - فحص أمان سريع
 * يفحص المشاكل الأمنية الأساسية في المشروع
 */

const fs = require('fs');
const path = require('path');

class SecurityScanner {
  constructor() {
    this.issues = [];
    this.warnings = [];
  }

  // فحص الملفات الحساسة
  checkSensitiveFiles() {
    const sensitivePatterns = [
      '.env',
      'service-account.json',
      '*.key',
      '*.pem',
      'secrets.json'
    ];

    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    
    sensitivePatterns.forEach(pattern => {
      if (!gitignoreContent.includes(pattern.replace('*', ''))) {
        this.warnings.push(`⚠️  Pattern '${pattern}' not in .gitignore`);
      }
    });
  }

  // فحص أذونات الملفات
  checkFilePermissions() {
    const criticalDirs = ['config/security', 'scripts'];
    
    criticalDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        try {
          const stats = fs.statSync(dir);
          // فحص بسيط للأذونات
          if (stats.mode & 0o002) {
            this.issues.push(`🚨 Directory '${dir}' is world-writable`);
          }
        } catch (err) {
          this.warnings.push(`⚠️  Cannot check permissions for '${dir}'`);
        }
      }
    });
  }

  // فحص متغيرات البيئة
  checkEnvironmentSetup() {
    if (!fs.existsSync('.env')) {
      this.warnings.push('⚠️  .env file missing - copy from .env.example');
    }

    if (!fs.existsSync('.env.example')) {
      this.issues.push('🚨 .env.example file missing');
    }
  }

  // تشغيل الفحص
  async scan() {
    console.log('🔍 Starting security scan...\n');

    this.checkSensitiveFiles();
    this.checkFilePermissions();
    this.checkEnvironmentSetup();

    // النتائج
    console.log('📊 Security Scan Results:');
    console.log('========================\n');

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ No security issues found!');
      return;
    }

    if (this.issues.length > 0) {
      console.log('🚨 Critical Issues:');
      this.issues.forEach(issue => console.log(`  ${issue}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
      console.log();
    }

    console.log(`📈 Summary: ${this.issues.length} issues, ${this.warnings.length} warnings`);
    
    if (this.issues.length > 0) {
      process.exit(1);
    }
  }
}

// تشغيل الفحص
if (require.main === module) {
  const scanner = new SecurityScanner();
  scanner.scan().catch(console.error);
}

module.exports = SecurityScanner;