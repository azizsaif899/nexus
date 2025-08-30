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
    console.log('🔍 فحص المشاريع المتأثرة...');
    
    try {
      const output = execSync(`nx show projects --affected --base=${this.base} --head=${this.head}`, {
        encoding: 'utf8'
      });
      
      const projects = output.trim().split('\n').filter(p => p.length > 0);
      console.log(`📊 المشاريع المتأثرة: ${projects.length}`);
      projects.forEach(p => console.log(`   - ${p}`));
      
      return projects;
    } catch (error) {
      console.log('⚠️ لا توجد مشاريع متأثرة أو خطأ في Git');
      return [];
    }
  }

  // بناء المشاريع المتأثرة
  buildAffected() {
    console.log('🏗️ بناء المشاريع المتأثرة...');
    
    try {
      execSync(`nx affected --target=build --base=${this.base} --head=${this.head}`, {
        stdio: 'inherit'
      });
      console.log('✅ تم بناء المشاريع المتأثرة بنجاح');
      return true;
    } catch (error) {
      console.log('❌ فشل في بناء المشاريع المتأثرة');
      return false;
    }
  }

  // اختبار المشاريع المتأثرة
  testAffected() {
    console.log('🧪 اختبار المشاريع المتأثرة...');
    
    try {
      execSync(`nx affected --target=test --base=${this.base} --head=${this.head}`, {
        stdio: 'inherit'
      });
      console.log('✅ نجحت جميع الاختبارات');
      return true;
    } catch (error) {
      console.log('❌ فشلت بعض الاختبارات');
      return false;
    }
  }

  // فحص الكود للمشاريع المتأثرة
  lintAffected() {
    console.log('🔧 فحص كود المشاريع المتأثرة...');
    
    try {
      execSync(`nx affected --target=lint --base=${this.base} --head=${this.head}`, {
        stdio: 'inherit'
      });
      console.log('✅ الكود يتبع المعايير');
      return true;
    } catch (error) {
      console.log('❌ يوجد مشاكل في معايير الكود');
      return false;
    }
  }

  // تشغيل العملية الكاملة
  run() {
    console.log('🚀 بدء البناء الذكي باستخدام nx affected...');
    
    const affected = this.getAffectedProjects();
    
    if (affected.length === 0) {
      console.log('✨ لا توجد تغييرات تتطلب بناء');
      return true;
    }

    const results = {
      lint: this.lintAffected(),
      build: this.buildAffected(),
      test: this.testAffected()
    };

    const success = Object.values(results).every(r => r);
    
    console.log('\n📊 ملخص النتائج:');
    console.log(`   فحص الكود: ${results.lint ? '✅' : '❌'}`);
    console.log(`   البناء: ${results.build ? '✅' : '❌'}`);
    console.log(`   الاختبارات: ${results.test ? '✅' : '❌'}`);
    
    if (success) {
      console.log('🎉 تم إكمال جميع العمليات بنجاح!');
    } else {
      console.log('⚠️ بعض العمليات فشلت - راجع الأخطاء أعلاه');
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