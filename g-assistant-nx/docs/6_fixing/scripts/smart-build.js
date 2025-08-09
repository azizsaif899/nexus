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
    console.log('🔍 تحليل المشاريع المتأثرة...');
    
    try {
      // استخدام nx affected لتحديد المشاريع المتأثرة فقط
      const output = execSync('nx show projects --affected', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });
      
      this.affectedProjects = output.trim().split('\n').filter(p => p.length > 0);
      
      console.log(`📊 المشاريع المتأثرة: ${this.affectedProjects.length}`);
      this.affectedProjects.forEach(p => console.log(`   - ${p}`));
      
      return this.affectedProjects;
    } catch (error) {
      console.log('⚠️ لا توجد مشاريع متأثرة');
      return [];
    }
  }

  // بناء ذكي للمشاريع المتأثرة فقط
  smartBuild() {
    console.log('🏗️ بناء ذكي...');
    
    if (this.affectedProjects.length === 0) {
      console.log('✅ لا توجد مشاريع تحتاج بناء');
      return true;
    }

    try {
      // بناء المشاريع المتأثرة فقط (توفير وقت هائل)
      execSync('nx affected --target=build', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      console.log('✅ تم البناء الذكي بنجاح');
      return true;
    } catch (error) {
      console.error('❌ فشل البناء الذكي');
      return false;
    }
  }

  // اختبار ذكي للمشاريع المتأثرة فقط
  smartTest() {
    console.log('🧪 اختبار ذكي...');
    
    if (this.affectedProjects.length === 0) {
      console.log('✅ لا توجد مشاريع تحتاج اختبار');
      return true;
    }

    try {
      // اختبار المشاريع المتأثرة فقط
      execSync('nx affected --target=test', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      
      console.log('✅ تم الاختبار الذكي بنجاح');
      return true;
    } catch (error) {
      console.error('❌ فشل الاختبار الذكي');
      return false;
    }
  }

  // تشغيل العملية الكاملة
  run() {
    console.log('🚀 بدء البناء الذكي...');
    
    // 1. تحليل المشاريع المتأثرة
    this.analyzeAffectedProjects();
    
    // 2. بناء ذكي
    const buildSuccess = this.smartBuild();
    
    // 3. اختبار ذكي (إذا نجح البناء)
    const testSuccess = buildSuccess ? this.smartTest() : false;
    
    // 4. النتيجة
    if (buildSuccess && testSuccess) {
      console.log('🎉 البناء الذكي مكتمل بنجاح!');
      console.log('💡 تم توفير وقت هائل بالتركيز على المشاريع المتأثرة فقط');
    } else {
      console.log('⚠️ البناء الذكي يحتاج مراجعة');
    }
    
    return buildSuccess && testSuccess;
  }
}

if (require.main === module) {
  const builder = new SmartBuilder();
  builder.run();
}

module.exports = SmartBuilder;