// enhanced_processor.js - معالج محسن مع cache وerror handling
const { TextAnalyzer } = require('./text_analyzer');
const { RedisConnector } = require('../cache/redis_connector');

class EnhancedProcessor {
  constructor(config) {
    this.config = config;
    this.cache = new RedisConnector(config);
    this.analyzer = new TextAnalyzer(this.cache, this.getAICore(), config);
  }

  getAICore() {
    // محاكاة AI Core
    return {
      process: async (text) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { result: `معالج: ${text}`, timestamp: Date.now() };
      },
      advancedProcess: async (text, options) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
          result: `تحليل متقدم: ${text}`,
          options,
          confidence: 0.95,
          timestamp: Date.now()
        };
      }
    };
  }

  async processText(text) {
    try {
      return await this.analyzer.analyzeText(text);
    } catch (error) {
      console.error('خطأ في معالجة النص:', error);
      // fallback بدون cache
      return await this.getAICore().process(text);
    }
  }

  async advancedProcess(text, options = {}) {
    try {
      return await this.analyzer.advancedAnalyze(text, options);
    } catch (error) {
      console.error('خطأ في المعالجة المتقدمة:', error);
      throw error;
    }
  }

  async getStats() {
    return {
      cacheConnected: this.cache.isConnected,
      timestamp: Date.now(),
      status: 'active'
    };
  }

  disconnect() {
    this.cache.disconnect();
  }
}

module.exports = { EnhancedProcessor };
