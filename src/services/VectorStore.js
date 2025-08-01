/**
 * Vector Store Service - تخزين واسترجاع المتجهات بكفاءة
 * يحل مشكلة الأداء عبر التخزين المسبق للـ embeddings
 */

class VectorStore {
  constructor() {
    this.SHEET_NAME = 'VectorStore_Cache';
    this.BATCH_SIZE = 100;
    this.cache = new Map(); // ذاكرة تخزين مؤقت محلية
  }

  /**
   * تهيئة صفحة التخزين إذا لم تكن موجودة
   */
  initializeSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(this.SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(this.SHEET_NAME);
      sheet.getRange(1, 1, 1, 4).setValues([
        ['ID', 'Content_Hash', 'Embedding_JSON', 'Last_Updated']
      ]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }
    return sheet;
  }

  /**
   * تخزين embedding واحد
   */
  async storeEmbedding(id, contentHash, embedding) {
    const sheet = this.initializeSheet();
    const timestamp = new Date().toISOString();
    
    // تحقق من وجود السجل
    const existingRow = this.findExistingRow(sheet, id);
    
    if (existingRow > 0) {
      // تحديث السجل الموجود
      sheet.getRange(existingRow, 2, 1, 3).setValues([[
        contentHash, JSON.stringify(embedding), timestamp
      ]]);
    } else {
      // إضافة سجل جديد
      sheet.appendRow([id, contentHash, JSON.stringify(embedding), timestamp]);
    }
    
    // تحديث الذاكرة المؤقتة
    this.cache.set(id, { embedding, contentHash, timestamp });
  }

  /**
   * تخزين متجهات متعددة بشكل مجمع (أسرع)
   */
  async storeBatchEmbeddings(items) {
    const sheet = this.initializeSheet();
    const timestamp = new Date().toISOString();
    
    const rows = items.map(item => [
      item.id, 
      item.contentHash, 
      JSON.stringify(item.embedding), 
      timestamp
    ]);
    
    // تخزين مجمع - أسرع بكثير من التخزين الفردي
    if (rows.length > 0) {
      const range = sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 4);
      range.setValues(rows);
      
      // تحديث الذاكرة المؤقتة
      items.forEach(item => {
        this.cache.set(item.id, {
          embedding: item.embedding,
          contentHash: item.contentHash,
          timestamp
        });
      });
    }
  }

  /**
   * استرجاع embedding بواسطة ID
   */
  async getEmbedding(id) {
    // تحقق من الذاكرة المؤقتة أولاً
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    const sheet = this.initializeSheet();
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        const result = {
          embedding: JSON.parse(data[i][2]),
          contentHash: data[i][1],
          timestamp: data[i][3]
        };
        
        // حفظ في الذاكرة المؤقتة
        this.cache.set(id, result);
        return result;
      }
    }
    
    return null;
  }

  /**
   * استرجاع جميع المتجهات المخزنة
   */
  async getAllEmbeddings() {
    const sheet = this.initializeSheet();
    const data = sheet.getDataRange().getValues();
    const results = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2]) { // تأكد من وجود embedding
        results.push({
          id: data[i][0],
          embedding: JSON.parse(data[i][2]),
          contentHash: data[i][1],
          timestamp: data[i][3]
        });
      }
    }
    
    return results;
  }

  /**
   * البحث عن المتجهات المشابهة
   */
  async findSimilar(queryEmbedding, options = {}) {
    const { threshold = 0.5, topN = 10 } = options;
    const allEmbeddings = await this.getAllEmbeddings();
    const results = [];
    
    for (const item of allEmbeddings) {
      const similarity = this.calculateCosineSimilarity(queryEmbedding, item.embedding);
      
      if (similarity >= threshold) {
        results.push({
          id: item.id,
          similarity,
          contentHash: item.contentHash,
          timestamp: item.timestamp
        });
      }
    }
    
    // ترتيب حسب التشابه (الأعلى أولاً)
    results.sort((a, b) => b.similarity - a.similarity);
    
    return results.slice(0, topN);
  }

  /**
   * حساب التشابه الكوسيني بين متجهين
   */
  calculateCosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vector dimensions must match');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * البحث عن صف موجود بواسطة ID
   */
  findExistingRow(sheet, id) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) {
        return i + 1; // إرجاع رقم الصف (1-indexed)
      }
    }
    return 0;
  }

  /**
   * تنظيف السجلات القديمة
   */
  async cleanupOldRecords(daysOld = 30) {
    const sheet = this.initializeSheet();
    const data = sheet.getDataRange().getValues();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const rowsToDelete = [];
    
    for (let i = data.length - 1; i >= 1; i--) {
      const recordDate = new Date(data[i][3]);
      if (recordDate < cutoffDate) {
        rowsToDelete.push(i + 1);
      }
    }
    
    // حذف الصفوف القديمة
    rowsToDelete.forEach(rowIndex => {
      sheet.deleteRow(rowIndex);
    });
    
    return rowsToDelete.length;
  }

  /**
   * إحصائيات المخزن
   */
  async getStats() {
    const sheet = this.initializeSheet();
    const data = sheet.getDataRange().getValues();
    
    return {
      totalRecords: data.length - 1,
      cacheSize: this.cache.size,
      sheetName: this.SHEET_NAME,
      lastUpdated: data.length > 1 ? data[data.length - 1][3] : null
    };
  }
}

// تسجيل الخدمة في نظام DI
if (typeof Injector !== 'undefined') {
  Injector.register('Services.VectorStore', () => new VectorStore());
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VectorStore;
}