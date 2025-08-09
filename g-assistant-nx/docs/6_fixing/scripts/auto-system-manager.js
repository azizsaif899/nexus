#!/usr/bin/env node

/**
 * مدير النظام التلقائي - يشغل جميع العمليات كل 5 دقائق
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoSystemManager {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../');
    this.interval = 5 * 60 * 1000; // 5 دقائق
    this.isRunning = false;
    this.cycleCount = 0;
  }

  // تشغيل دورة كاملة
  async runCycle() {
    this.cycleCount++;
    const timestamp = new Date().toLocaleString('ar-SA');
    
    console.log(`\n🔄 الدورة ${this.cycleCount} - ${timestamp}`);
    console.log('='.repeat(50));

    try {
      // 1. مراقبة المشروع
      console.log('📊 1. مراقبة المشروع...');
      execSync('node docs/6_fixing/scripts/nx_project_monitor.js', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      // 2. فحص الأخطاء والإصلاح
      console.log('\n🔍 2. فحص وإصلاح الأخطاء...');
      execSync('npm run repair:run', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      // 3. تحديث اللوحة المركزية
      console.log('\n📊 3. تحديث اللوحة المركزية...');
      execSync('node docs/6_fixing/scripts/nx_task_orchestrator.js', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      // 4. تسجيل النجاح
      this.logSuccess();
      
      console.log(`\n✅ تمت الدورة ${this.cycleCount} بنجاح`);
      console.log(`⏰ الدورة التالية خلال 5 دقائق...`);

    } catch (error) {
      console.error(`❌ خطأ في الدورة ${this.cycleCount}:`, error.message);
      this.logError(error);
    }
  }

  // بدء النظام التلقائي
  start() {
    console.log('🚀 بدء مدير النظام التلقائي');
    console.log('📊 سيتم تشغيل دورة كاملة كل 5 دقائق');
    console.log('🛑 للإيقاف: Ctrl+C');
    console.log('🌐 لوحة التحكم: http://localhost:3000');
    
    this.isRunning = true;

    // تشغيل الدورة الأولى فوراً
    this.runCycle();

    // جدولة الدورات التالية
    const intervalId = setInterval(() => {
      if (this.isRunning) {
        this.runCycle();
      }
    }, this.interval);

    // معالج الإيقاف
    process.on('SIGINT', () => {
      console.log('\n🛑 إيقاف النظام...');
      this.isRunning = false;
      clearInterval(intervalId);
      this.logShutdown();
      process.exit(0);
    });
  }

  // تسجيل النجاح
  logSuccess() {
    const logEntry = {
      timestamp: new Date().toISOString(),
      cycle: this.cycleCount,
      status: 'SUCCESS',
      message: 'دورة مكتملة بنجاح'
    };
    
    this.appendToLog(logEntry);
  }

  // تسجيل الخطأ
  logError(error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      cycle: this.cycleCount,
      status: 'ERROR',
      message: error.message
    };
    
    this.appendToLog(logEntry);
  }

  // تسجيل الإغلاق
  logShutdown() {
    const logEntry = {
      timestamp: new Date().toISOString(),
      cycle: this.cycleCount,
      status: 'SHUTDOWN',
      message: `تم إيقاف النظام بعد ${this.cycleCount} دورة`
    };
    
    this.appendToLog(logEntry);
    console.log(`📊 تم تشغيل ${this.cycleCount} دورة بنجاح`);
  }

  // إضافة للسجل
  appendToLog(entry) {
    const logFile = path.join(this.projectRoot, 'docs/6_fixing/reports/auto_system_log.json');
    
    let logs = [];
    if (fs.existsSync(logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      } catch (error) {
        logs = [];
      }
    }
    
    logs.push(entry);
    
    // الاحتفاظ بآخر 100 سجل فقط
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }
    
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }

  // حالة النظام
  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      uptime: process.uptime(),
      nextCycle: this.isRunning ? '5 دقائق' : 'متوقف'
    };
  }
}

// تشغيل المدير
if (require.main === module) {
  const manager = new AutoSystemManager();
  manager.start();
}

module.exports = AutoSystemManager;