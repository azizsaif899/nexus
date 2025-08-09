/**
 * Embedding Scheduler - مجدول المعالجة التلقائية للمتجهات
 * يدير التحديث الدوري للـ Vector Store
 */

class EmbeddingScheduler {
  constructor() {
    this.preprocessor = Injector.get('Services.EmbeddingPreprocessor');
    this.vectorStore = Injector.get('Services.VectorStore');
    this.logger = Injector.get('Utils.SystemLogger');

    this.SCHEDULE_INTERVAL = 60 * 60 * 1000; // كل ساعة
    this.isRunning = false;
    this.lastRun = null;
    this.stats = {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      lastError: null
    };
  }

  /**
   * بدء التشغيل المجدول
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ المجدول يعمل بالفعل');
      return;
    }

    console.log('🚀 بدء مجدول المعالجة التلقائية');
    this.isRunning = true;

    // تشغيل فوري أول مرة
    this.runScheduledTask();

    // تشغيل دوري
    this.intervalId = setInterval(() => {
      this.runScheduledTask();
    }, this.SCHEDULE_INTERVAL);
  }

  /**
   * إيقاف التشغيل المجدول
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ المجدول متوقف بالفعل');
      return;
    }

    console.log('🛑 إيقاف مجدول المعالجة التلقائية');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * تنفيذ المهمة المجدولة
   */
  async runScheduledTask() {
    if (!this.isRunning) return;

    try {
      console.log('⏰ بدء المهمة المجدولة...');
      this.stats.totalRuns++;

      const startTime = Date.now();

      // معالجة التقارير الجديدة
      const result = await this.preprocessor.runScheduledProcessing();

      const duration = Date.now() - startTime;
      this.lastRun = new Date().toISOString();
      this.stats.successfulRuns++;

      console.log(`✅ اكتملت المهمة المجدولة في ${duration}ms`);
      console.log(`📊 معالج: ${result.processed}, منظف: ${result.cleaned}`);

    } catch (error) {
      this.stats.failedRuns++;
      this.stats.lastError = error.message;

      console.error('❌ فشل في المهمة المجدولة:', error);
    }
  }

  /**
   * الحصول على إحصائيات المجدول
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.isRunning ?
        new Date(Date.now() + this.SCHEDULE_INTERVAL).toISOString() :
        null
    };
  }
}

// تسجيل الخدمة في نظام DI
if (typeof Injector !== 'undefined') {
  Injector.register('Services.EmbeddingScheduler', () => new EmbeddingScheduler());
}

// دوال للتحكم اليدوي
function startEmbeddingScheduler() {
  const scheduler = Injector.get('Services.EmbeddingScheduler');
  scheduler.start();
  return scheduler.getStats();
}

function stopEmbeddingScheduler() {
  const scheduler = Injector.get('Services.EmbeddingScheduler');
  scheduler.stop();
  return scheduler.getStats();
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmbeddingScheduler;
}
