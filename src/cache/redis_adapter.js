// src/cache/redis_adapter.js - Redis adapter متكامل مع النظام الحالي
defineModule('System.Cache.Redis', ({ Utils, Config }) => {
  
  class RedisAdapter {
    constructor() {
      this.fallbackCache = CacheService.getScriptCache();
      this.redisUrl = Config.get('REDIS_URL') || null;
    }

    async get(key) {
      if (this.redisUrl) {
        try {
          const response = UrlFetchApp.fetch(`${this.redisUrl}/get/${key}`);
          if (response.getResponseCode() === 200) {
            return JSON.parse(response.getContentText());
          }
        } catch (error) {
          Utils.log('Redis get error', error);
        }
      }
      
      const cached = this.fallbackCache.get(key);
      return cached ? JSON.parse(cached) : null;
    }

    async set(key, value, ttl = 3600) {
      const serialized = JSON.stringify(value);
      
      if (this.redisUrl) {
        try {
          UrlFetchApp.fetch(`${this.redisUrl}/set`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            payload: JSON.stringify({ key, value: serialized, ttl })
          });
        } catch (error) {
          Utils.log('Redis set error', error);
        }
      }
      
      this.fallbackCache.put(key, serialized, Math.min(ttl, 21600));
    }
  }

  return new RedisAdapter();
});

function getCachedData(key) {
  const cache = GAssistant.Utils.Injector.get('System.Cache.Redis');
  return cache.get(key);
}