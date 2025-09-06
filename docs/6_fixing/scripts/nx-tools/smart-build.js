#!/usr/bin/env node

/**
 * بناء ذكي مع تحليل التبعيات
 * مستوحى من اقتراح "البناء الذكي"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SmartBuilder {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.affectedProjects = [];
  }

  // تحليل المشاريع المتأثرة (من الاقتراح)
  analyzeAffectedProjects() {
    // Removed console.log
    
    try {
      // استخدام nx affected لتحديد المشاريع المتأثرة فقط
      const output = execSync('nx show projects --affected', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      
      this.affectedProjects = output.trim().split('\n').filter(p => p.length > 0);
      
      // Removed console.log
      this.affectedProjects.forEach(p => // Removed console.log);
      
      return this.affectedProjects;
    } catch (error) {
      // Removed console.log
      return [];
    }
  }

  // بناء ذكي للمشاريع المتأثرة فقط
  smartBuild() {
    // Removed console.log
    
    if (this.affectedProjects.length === 0) {
      // Removed console.log
      return true;
    }

    try {
      // بناء المشاريع المتأثرة فقط (توفير وقت هائل)
      execSync('nx affected --target=build', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      // Removed console.log
      return true;
    } catch (error) {
      console.error('❌ فشل البناء الذكي');
      return false;
    }
  }

  // اختبار ذكي للمشاريع المتأثرة فقط
  smartTest() {
    // Removed console.log
    
    if (this.affectedProjects.length === 0) {
      // Removed console.log
      return true;
    }

    try {
      // اختبار المشاريع المتأثرة فقط
      execSync('nx affected --target=test', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      // Removed console.log
      return true;
    } catch (error) {
      console.error('❌ فشل الاختبار الذكي');
      return false;
    }
  }

  // تشغيل العملية الكاملة
  run() {
    // Removed console.log
    
    // 1. تحليل المشاريع المتأثرة
    this.analyzeAffectedProjects();
    
    // 2. بناء ذكي
    const buildSuccess = this.smartBuild();
    
    // 3. اختبار ذكي (إذا نجح البناء)
    const testSuccess = buildSuccess ? this.smartTest() : false;
    
    // 4. النتيجة
    if (buildSuccess && testSuccess) {
      // Removed console.log
      // Removed console.log
    } else {
      // Removed console.log
    }
    
    return buildSuccess && testSuccess;
  }
}

if (require.main === module) {
  const builder = new SmartBuilder();
  builder.run();
}

module.exports = SmartBuilder;