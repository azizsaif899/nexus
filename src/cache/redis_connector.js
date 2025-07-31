// redis_connector.js - موصل Redis مع معالجة الأخطاء
const Redis = require('ioredis');

class RedisConnector {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  init() {
    this.client = new Redis({
      host: this.config.REDIS_HOST || 'localhost',
      port: this.config.REDIS_PORT || 6379,
      password: this.config.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });

    // إضافة معالجة الأخطاء
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
      this.isConnected = false;
      // إعادة المحاولة أو التعامل مع الخطأ
      this.handleError(err);
    });

    this.client.on('connect', () => {
      console.log('✅ Redis متصل');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      console.log('⚠️ Redis منقطع');
      this.isConnected = false;
    });
  }

  handleError(err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('🔄 محاولة إعادة الاتصال بـ Redis...');
      setTimeout(() => this.init(), 5000);
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('خطأ في قراءة Redis:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('خطأ في كتابة Redis:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('خطأ في حذف Redis:', error);
      return false;
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}

module.exports = { RedisConnector };