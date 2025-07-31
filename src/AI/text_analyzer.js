// text_analyzer.js - تحسين معالجة النصوص
const crypto = require('crypto');

class TextAnalyzer {
  constructor(cache, aiCore, config) {
    this.cache = cache;
    this.AI = aiCore;
    this.config = config;
  }

  // تحسين معالجة النصوص مع cache
  async analyzeText(text) {
    // إضافة تحقق من وجود في الذاكرة المؤقتة أولاً
    const cacheKey = `text_${this.hash(text)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      console.log('📦 استرجاع من الكاش:', cacheKey);
      return cached;
    }
    
    // معالجة النص
    console.log('🧠 معالجة جديدة للنص');
    const result = await this.AI.process(text);
    
    // تخزين النتيجة في الذاكرة المؤقتة
    await this.cache.set(cacheKey, result, this.config.CACHE_TTL || 3600);
    return result;
  }

  // دالة hash مساعدة
  hash(text) {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  // تحليل متقدم مع معالجة أخطاء
  async advancedAnalyze(text, options = {}) {
    try {
      const cacheKey = `advanced_${this.hash(text + JSON.stringify(options))}`;
      const cached = await this.cache.get(cacheKey);
      
      if (cached && !options.forceRefresh) {
        return { ...cached, fromCache: true };
      }

      const result = await this.AI.advancedProcess(text, options);
      await this.cache.set(cacheKey, result, this.config.CACHE_TTL);
      
      return { ...result, fromCache: false };
    } catch (error) {
      console.error('خطأ في التحليل المتقدم:', error);
      throw error;
    }
  }
}

module.exports = { TextAnalyzer };