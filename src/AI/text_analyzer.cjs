// text_analyzer.cjs - تحسين معالجة النصوص
const crypto = require('crypto');

class TextAnalyzer {
  constructor(cache, aiCore, config) {
    this.cache = cache;
    this.AI = aiCore;
    this.config = config;
  }

  async analyzeText(text) {
    const cacheKey = `text_${this.hash(text)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      console.log('📦 من الكاش');
      return JSON.parse(cached);
    }
    
    console.log('🧠 معالجة جديدة');
    const result = await this.AI.process(text);
    await this.cache.set(cacheKey, result, this.config.CACHE_TTL || 3600);
    return result;
  }

  hash(text) {
    return crypto.createHash('md5').update(text).digest('hex');
  }
}

module.exports = { TextAnalyzer };