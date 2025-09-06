#!/usr/bin/env node

/**
 * بناء ذكي باستخدام nx affected
 * يبني فقط المشاريع المتأثرة بالتغييرات
 */

const { execSync } = require('child_process');

class NxAffectedBuilder {
  constructor() {
    this.base = process.env.NX_BASE || 'origin/main';
    this.head = process.env.NX_HEAD || 'HEAD';
  }

  // فحص المشاريع المتأثرة
  getAffectedProjects() {
    // Removed console.log
    
    try {
      const output = execSync(`nx show projects --affected --base=${this.base} --head=${this.head}`, {
        encoding: 'utf8'
      });
      
      const projects = output.trim().split('\n').filter(p => p.length > 0);
      // Removed console.log
      projects.forEach(p => // Removed console.log);
      
      return projects;
    } catch (error) {
      // Removed console.log
      return [];
    }
  }

  // بناء المشاريع المتأثرة
  buildAffected() {
    // Removed console.log
    
    try {
      execSync(`nx affected --target=build --base=${this.base} --head=${this.head}`, {
        stdio: 'inherit'
      });
      // Removed console.log
      return true;
    } catch (error) {
      // Removed console.log
      return false;
    }
  }

  // اختبار المشاريع المتأثرة
  testAffected() {
    // Removed console.log
    
    try {
      execSync(`nx affected --target=test --base=${this.base} --head=${this.head}`, {
        stdio: 'inherit'
      });
      // Removed console.log
      return true;
    } catch (error) {
      // Removed console.log
      return false;
    }
  }

  // فحص الكود للمشاريع المتأثرة
  lintAffected() {
    // Removed console.log
    
    try {
      execSync(`nx affected --target=lint --base=${this.base} --head=${this.head}`, {
        stdio: 'inherit'
      });
      // Removed console.log
      return true;
    } catch (error) {
      // Removed console.log
      return false;
    }
  }

  // تشغيل العملية الكاملة
  run() {
    // Removed console.log
    
    const affected = this.getAffectedProjects();
    
    if (affected.length === 0) {
      // Removed console.log
      return true;
    }

    const results = {
      lint: this.lintAffected(),
      build: this.buildAffected(),
      test: this.testAffected()
    };

    const success = Object.values(results).every(r => r);
    
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    
    if (success) {
      // Removed console.log
    } else {
      // Removed console.log
      process.exit(1);
    }

    return success;
  }
}

if (require.main === module) {
  const builder = new NxAffectedBuilder();
  builder.run();
}

module.exports = NxAffectedBuilder;