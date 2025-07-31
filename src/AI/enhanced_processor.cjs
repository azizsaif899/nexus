// enhanced_processor.cjs - معالج محسن
const { TextAnalyzer } = require('./text_analyzer.cjs');
const { RedisConnector } = require('../cache/redis_connector.cjs');

class EnhancedProcessor {
  constructor(config) {
    this.config = config;
    this.cache = new RedisConnector(config);
    this.analyzer = new TextAnalyzer(this.cache, this.getAICore(), config);
  }

  getAICore() {
    return {
      process: async (text) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return { result: `معالج: ${text}`, timestamp: Date.now() };
      }
    };
  }

  async processText(text) {
    try {
      return await this.analyzer.analyzeText(text);
    } catch (error) {
      console.error('خطأ:', error.message);
      return await this.getAICore().process(text);
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