/**
 * Embedding Preprocessor - معالجة مسبقة للبيانات وتوليد المتجهات
 * يحل مشكلة التكلفة والأداء عبر المعالجة المجمعة
 */

class EmbeddingPreprocessor {
  constructor() {
    this.embeddingService = Injector.get('Services.EmbeddingService');
    this.vectorStore = Injector.get('Services.VectorStore');
    this.BATCH_SIZE = 50; // معالجة 50 نص في المرة الواحدة
    this.MAX_TEXT_LENGTH = 8000; // حد أقصى لطول النص
  }

  /**
   * معالجة جميع التقارير المالية وتخزين متجهاتها
   */
  async processAllFinancialReports() {
    try {
      console.log('🚀 بدء معالجة التقارير المالية...');

      const reports = await this.getAllFinancialReports();
      console.log(`📊 تم العثور على ${reports.length} تقرير`);

      const batches = this.createBatches(reports, this.BATCH_SIZE);
      let processedCount = 0;

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`⚡ معالجة المجموعة ${i + 1}/${batches.length} (${batch.length} تقارير)`);

        await this.processBatch(batch);
        processedCount += batch.length;

        // استراحة قصيرة لتجنب تجاوز حدود API
        if (i < batches.length - 1) {
          await this.sleep(1000);
        }
      }

      console.log(`✅ تمت معالجة ${processedCount} تقرير بنجاح`);
      return { success: true, processed: processedCount };

    } catch (error) {
      console.error('❌ خطأ في معالجة التقارير:', error);
      throw error;
    }
  }

  /**
   * معالجة مجموعة من التقارير
   */
  async processBatch(reports) {
    // تحضير النصوص للمعالجة
    const textsToProcess = [];
    const reportsToStore = [];

    for (const report of reports) {
      const contentHash = this.generateContentHash(report.content);

      // تحقق من وجود embedding مخزن مسبقاً
      const existing = await this.vectorStore.getEmbedding(report.id);

      if (!existing || existing.contentHash !== contentHash) {
        // النص جديد أو تم تعديله
        const processedText = this.preprocessText(report.content);
        textsToProcess.push(processedText);
        reportsToStore.push({
          id: report.id,
          contentHash,
          originalIndex: textsToProcess.length - 1
        });
      }
    }

    if (textsToProcess.length === 0) {
      console.log('⏭️ جميع التقارير في هذه المجموعة محدثة مسبقاً');
      return;
    }

    // توليد المتجهات للنصوص الجديدة فقط
    console.log(`🔄 توليد ${textsToProcess.length} متجه جديد...`);
    const embeddings = await this.embeddingService.generateEmbeddingsBatch(textsToProcess);

    // تحضير البيانات للتخزين المجمع
    const itemsToStore = reportsToStore.map(report => ({
      id: report.id,
      contentHash: report.contentHash,
      embedding: embeddings[report.originalIndex]
    }));

    // تخزين مجمع - أسرع بكثير
    await this.vectorStore.storeBatchEmbeddings(itemsToStore);
    console.log(`💾 تم تخزين ${itemsToStore.length} متجه`);
  }

  /**
   * معالجة التقارير الجديدة فقط (للتشغيل الدوري)
   */
  async processNewReports() {
    try {
      console.log('🔍 البحث عن تقارير جديدة...');

      const newReports = await this.getNewFinancialReports();

      if (newReports.length === 0) {
        console.log('✅ لا توجد تقارير جديدة للمعالجة');
        return { success: true, processed: 0 };
      }

      console.log(`📝 تم العثور على ${newReports.length} تقرير جديد`);

      const batches = this.createBatches(newReports, this.BATCH_SIZE);
      let processedCount = 0;

      for (const batch of batches) {
        await this.processBatch(batch);
        processedCount += batch.length;
      }

      console.log(`✅ تمت معالجة ${processedCount} تقرير جديد`);
      return { success: true, processed: processedCount };

    } catch (error) {
      console.error('❌ خطأ في معالجة التقارير الجديدة:', error);
      throw error;
    }
  }

  /**
   * جلب جميع التقارير المالية
   */
  async getAllFinancialReports() {
    const sheets = Injector.get('Tools.Sheets');

    // جلب من صفحات مختلفة حسب نوع التقرير
    const sources = [
      { sheet: 'Financial_Reports', contentCol: 'C', idCol: 'A' },
      { sheet: 'Monthly_Analysis', contentCol: 'D', idCol: 'A' },
      { sheet: 'Budget_Reports', contentCol: 'B', idCol: 'A' }
    ];

    const allReports = [];

    for (const source of sources) {
      try {
        const data = await sheets.readRange(source.sheet, 'A:Z');

        if (data && data.length > 1) {
          for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const idColIndex = this.getColumnIndex(source.idCol);
            const contentColIndex = this.getColumnIndex(source.contentCol);

            if (row[idColIndex] && row[contentColIndex]) {
              allReports.push({
                id: `${source.sheet}_${row[idColIndex]}`,
                content: row[contentColIndex],
                source: source.sheet,
                originalId: row[idColIndex]
              });
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ تعذر قراءة ${source.sheet}:`, error.message);
      }
    }

    return allReports;
  }

  /**
   * جلب التقارير الجديدة فقط (غير المعالجة)
   */
  async getNewFinancialReports() {
    const allReports = await this.getAllFinancialReports();
    const newReports = [];

    for (const report of allReports) {
      const existing = await this.vectorStore.getEmbedding(report.id);

      if (!existing) {
        newReports.push(report);
      } else {
        // تحقق من تغيير المحتوى
        const currentHash = this.generateContentHash(report.content);
        if (existing.contentHash !== currentHash) {
          newReports.push(report);
        }
      }
    }

    return newReports;
  }

  /**
   * معالجة النص قبل توليد المتجه
   */
  preprocessText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // تنظيف النص
    const processed = text
      .trim()
      .replace(/\s+/g, ' ') // توحيد المسافات
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w\s\.,!?()-]/g, '') // إبقاء العربية والإنجليزية والأرقام
      .substring(0, this.MAX_TEXT_LENGTH); // قطع النص الطويل

    return processed;
  }

  /**
   * توليد hash للمحتوى للتحقق من التغييرات
   */
  generateContentHash(content) {
    // استخدام hash بسيط للمحتوى
    let hash = 0;
    const str = this.preprocessText(content);

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // تحويل إلى 32-bit integer
    }

    return hash.toString();
  }

  /**
   * تقسيم المصفوفة إلى مجموعات
   */
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * تحويل حرف العمود إلى فهرس
   */
  getColumnIndex(columnLetter) {
    return columnLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
  }

  /**
   * انتظار لفترة محددة
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * تشغيل المعالجة المجدولة (يومياً)
   */
  async runScheduledProcessing() {
    try {
      console.log('⏰ بدء المعالجة المجدولة...');

      const result = await this.processNewReports();

      // تنظيف السجلات القديمة
      const cleanedCount = await this.vectorStore.cleanupOldRecords(30);

      const stats = await this.vectorStore.getStats();

      console.log('📊 إحصائيات المعالجة:', {
        processed: result.processed,
        cleaned: cleanedCount,
        totalRecords: stats.totalRecords
      });

      return {
        success: true,
        processed: result.processed,
        cleaned: cleanedCount,
        stats
      };

    } catch (error) {
      console.error('❌ خطأ في المعالجة المجدولة:', error);
      throw error;
    }
  }
}

// تسجيل الخدمة في نظام DI
if (typeof Injector !== 'undefined') {
  Injector.register('Services.EmbeddingPreprocessor', () => new EmbeddingPreprocessor());
}

// دالة مساعدة للتشغيل اليدوي
function runEmbeddingPreprocessing() {
  const preprocessor = Injector.get('Services.EmbeddingPreprocessor');
  return preprocessor.processAllFinancialReports();
}

// دالة للمعالجة المجدولة
function runScheduledEmbeddingProcessing() {
  const preprocessor = Injector.get('Services.EmbeddingPreprocessor');
  return preprocessor.runScheduledProcessing();
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmbeddingPreprocessor;
}
