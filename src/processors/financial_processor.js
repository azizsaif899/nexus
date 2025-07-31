// src/processors/financial_processor.js - معالج مالي متكامل مع النظام الحالي
defineModule('System.Processors.Financial', ({ Utils, Config, AI }) => {
  
  class FinancialProcessor {
    constructor() {
      this.ai = Utils.Injector.get('AI.Core');
      this.cache = CacheService.getScriptCache();
    }

    async processInvoice(invoiceData) {
      const cacheKey = `financial_${Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(invoiceData))}`;
      
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return { ...JSON.parse(cached), fromCache: true };
      }

      const analysis = await this.analyzeWithAI(invoiceData);
      this.cache.put(cacheKey, JSON.stringify(analysis), 3600);
      
      return { ...analysis, fromCache: false };
    }

    async analyzeWithAI(data) {
      const prompt = `تحليل فاتورة: المبلغ ${data.amount} - ${data.description}`;
      const response = await this.ai.query(prompt, { temperature: 0.1 });

      return {
        vatAmount: data.amount * 0.15,
        category: this.categorizeExpense(data.description),
        riskScore: data.amount > 10000 ? 'high' : 'low',
        aiAnalysis: response.text
      };
    }

    categorizeExpense(description) {
      if (/مكتب|قرطاسية/.test(description)) return 'office_supplies';
      if (/سفر|طيران/.test(description)) return 'travel';
      return 'general';
    }
  }

  return new FinancialProcessor();
});

function processFinancialDocument(data) {
  const processor = GAssistant.Utils.Injector.get('System.Processors.Financial');
  return processor.processInvoice(data);
}