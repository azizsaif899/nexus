// cache/redis.js - Redis cache manager
const redis = require('redis');

class RedisCache {
  constructor(namespace = 'azizsys') {
    this.namespace = namespace;
    this.client = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;
    
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      
      await this.client.connect();
      this.connected = true;
      console.log('✅ Redis connected');
    } catch (error) {
      console.warn('⚠️ Redis unavailable, using memory cache');
      this.client = new Map(); // fallback
    }
  }

  async get(key) {
    await this.connect();
    const fullKey = `${this.namespace}:${key}`;
    
    try {
      if (this.client instanceof Map) {
        return this.client.get(fullKey);
      }
      
      const result = await this.client.get(fullKey);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    await this.connect();
    const fullKey = `${this.namespace}:${key}`;
    
    try {
      if (this.client instanceof Map) {
        this.client.set(fullKey, value);
        setTimeout(() => this.client.delete(fullKey), ttl * 1000);
        return;
      }
      
      await this.client.setEx(fullKey, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async getStats() {
    if (!this.connected || this.client instanceof Map) {
      return { hits: 0, misses: 0, size: this.client?.size || 0 };
    }
    
    try {
      const info = await this.client.info('stats');
      return { info };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = { RedisCache };