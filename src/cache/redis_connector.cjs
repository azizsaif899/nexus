// redis_connector.cjs - موصل Redis مع معالجة الأخطاء
class RedisConnector {
  constructor(config) {
    this.config = config;
    this.isConnected = false;
    this.mockCache = new Map(); // محاكاة Redis
    this.init();
  }

  init() {
    // محاكاة Redis connection
    console.log('🔄 محاولة الاتصال بـ Redis...');
    
    setTimeout(() => {
      this.isConnected = true;
      console.log('✅ Redis متصل (محاكاة)');
    }, 100);

    // محاكاة معالجة الأخطاء
    this.client = {
      on: (event, callback) => {
        if (event === 'error') {
          this.errorHandler = callback;
        }
      }
    };
  }

  handleError(err) {
    console.error('Redis error:', err);
    if (err.code === 'ECONNREFUSED') {
      console.log('🔄 محاولة إعادة الاتصال...');
      setTimeout(() => this.init(), 5000);
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    return this.mockCache.get(key) || null;
  }

  async set(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    this.mockCache.set(key, JSON.stringify(value));
    
    // محاكاة TTL
    setTimeout(() => {
      this.mockCache.delete(key);
    }, ttl * 1000);
    
    return true;
  }

  disconnect() {
    this.isConnected = false;
    this.mockCache.clear();
    console.log('⚠️ Redis منقطع');
  }
}

module.exports = { RedisConnector };