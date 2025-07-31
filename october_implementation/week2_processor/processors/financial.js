// processors/financial.js - معالج مالي متكامل مع GAssistant
const { RedisCache } = require('../cache/redis');

class FinancialProcessor {
  constructor() {
    this.cache = new RedisCache('financial');
    this.startTime = Date.now();
  }

  async processInvoice(invoiceData) {
    const cacheKey = `invoice_${this.hashData(invoiceData)}`;
    
    // فحص الكاش أولاً
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    // معالجة جديدة
    const analysis = await this.analyzeInvoice(invoiceData);
    
    // حفظ في الكاش
    await this.cache.set(cacheKey, analysis, 3600);
    
    return { ...analysis, fromCache: false };
  }

  async analyzeInvoice(data) {
    const prompt = `تحليل فاتورة: ${JSON.stringify(data)}`;
    
    // محاكاة استدعاء GAssistant AI
    const analysis = {
      vatAmount: this.calculateVAT(data.amount),
      category: this.categorizeExpense(data.description),
      riskScore: this.assessRisk(data),
      processingTime: Date.now() - this.startTime
    };

    return analysis;
  }

  calculateVAT(amount) {
    return amount * 0.15; // 15% VAT
  }

  categorizeExpense(description) {
    if (description.includes('مكتب')) return 'office_supplies';
    if (description.includes('سفر')) return 'travel';
    return 'general';
  }

  assessRisk(data) {
    return data.amount > 10000 ? 'high' : 'low';
  }

  hashData(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16);
  }
}

module.exports = { FinancialProcessor };