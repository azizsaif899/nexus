#!/usr/bin/env node

/**
 * وضع المراقبة المستمرة لمشروع G-Assistant NX
 * يراقب التغييرات ويشغل الإصلاحات تلقائياً
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NxWatchMode {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.isRunning = false;
    this.lastCheck = Date.now();
    this.checkInterval = 5 * 60 * 1000; // 5 دقائق
  }

  // مراقبة التغييرات
  watchForChanges() {
    console.log('👁️ بدء وضع المراقبة المستمرة...');
    console.log(`🔄 فحص كل ${this.checkInterval / 1000} ثانية`);
    
    this.isRunning = true;
    
    const checkLoop = () => {
      if (!this.isRunning) return;
      
      console.log(`\n⏰ ${new Date().toLocaleString()} - فحص دوري`);
      
      try {
        // تشغيل الفحص السريع
        execSync('node docs/6_fixing/scripts/nx_project_monitor.js', {
          cwd: this.projectRoot,
          stdio: 'inherit'
        });
        
        // فحص إذا كان هناك مشاكل
        const reportsDir = path.join(__dirname, '../reports');
        const today = new Date().toISOString().split('T')[0];
        const monitorFile = path.join(reportsDir, `nx_monitor_${today}.json`);
        
        if (fs.existsSync(monitorFile)) {
          const report = JSON.parse(fs.readFileSync(monitorFile, 'utf8'));
          
          if (report.summary.healthScore < 90) {
            console.log('⚠️ انخفاض في نقاط الصحة - تشغيل الإصلاح التلقائي...');
            execSync('node docs/6_fixing/scripts/nx_auto_fix.js', {
              cwd: this.projectRoot,
              stdio: 'inherit'
            });
          }
        }
        
      } catch (error) {
        console.log(`❌ خطأ في الفحص الدوري: ${error.message}`);
      }
      
      // جدولة الفحص التالي
      setTimeout(checkLoop, this.checkInterval);
    };
    
    // بدء الحلقة
    checkLoop();
  }

  // إيقاف المراقبة
  stop() {
    console.log('🛑 إيقاف وضع المراقبة...');
    this.isRunning = false;
  }

  // تشغيل وضع المراقبة
  start() {
    console.log('🚀 تشغيل وضع المراقبة المستمرة لـ G-Assistant NX');
    console.log('📊 للإيقاف اضغط Ctrl+C');
    
    // معالج إيقاف النظام
    process.on('SIGINT', () => {
      this.stop();
      process.exit(0);
    });
    
    this.watchForChanges();
  }
}

// تشغيل وضع المراقبة
if (require.main === module) {
  const watcher = new NxWatchMode();
  watcher.start();
}

module.exports = NxWatchMode;