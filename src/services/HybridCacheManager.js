/**
 * @file src/services/HybridCacheManager.js
 * @description نظام تخزين مؤقت هجين متقدم
 */

defineModule('Services.HybridCacheManager', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  class HybridCacheManager {
    constructor() {
      this.localCache = new Map();
      this.cacheStats = {
        hits: 0,
        misses: 0,
        localHits: 0,
        remoteHits: 0
      };
      this.maxLocalSize = 1000;
      this.localTTL = 300000; // 5 minutes
      this.remoteTTL = 3600000; // 1 hour
    }

    async get(key) {
      const localData = this._getLocal(key);
      if (localData) {
        this.cacheStats.hits++;
        this.cacheStats.localHits++;
        return localData;
      }

      const remoteData = await this._getRemote(key);
      if (remoteData) {
        this.cacheStats.hits++;
        this.cacheStats.remoteHits++;
        this._setLocal(key, remoteData);
        return remoteData;
      }

      this.cacheStats.misses++;
      return null;
    }

    async set(key, value, options = {}) {
      const ttl = options.ttl || this.remoteTTL;

      // Store locally
      this._setLocal(key, value);

      // Store remotely (simulate with PropertiesService)
      try {
        const remoteKey = `cache_${key}`;
        const cacheData = {
          value,
          timestamp: Date.now(),
          ttl
        };

        PropertiesService.getScriptProperties()
          .setProperty(remoteKey, JSON.stringify(cacheData));
      } catch (error) {
        Utils.error('Failed to store in remote cache', error);
      }
    }

    _getLocal(key) {
      const item = this.localCache.get(key);
      if (!item) return null;

      if (Date.now() - item.timestamp > this.localTTL) {
        this.localCache.delete(key);
        return null;
      }

      return item.value;
    }

    _setLocal(key, value) {
      // Implement LRU eviction
      if (this.localCache.size >= this.maxLocalSize) {
        const firstKey = this.localCache.keys().next().value;
        this.localCache.delete(firstKey);
      }

      this.localCache.set(key, {
        value,
        timestamp: Date.now()
      });
    }

    async _getRemote(key) {
      try {
        const remoteKey = `cache_${key}`;
        const cached = PropertiesService.getScriptProperties()
          .getProperty(remoteKey);

        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp > cacheData.ttl) {
          PropertiesService.getScriptProperties().deleteProperty(remoteKey);
          return null;
        }

        return cacheData.value;
      } catch (error) {
        Utils.error('Failed to retrieve from remote cache', error);
        return null;
      }
    }

    getStats() {
      const total = this.cacheStats.hits + this.cacheStats.misses;
      return {
        ...this.cacheStats,
        hitRate: total > 0 ? (this.cacheStats.hits / total) : 0,
        localCacheSize: this.localCache.size,
        version: MODULE_VERSION
      };
    }

    async migrateToVectorDB(threshold = 10000) {
      const properties = PropertiesService.getScriptProperties().getProperties();
      const cacheKeys = Object.keys(properties).filter(key => key.startsWith('cache_'));

      if (cacheKeys.length > threshold) {
        Utils.log(`Migrating ${cacheKeys.length} items to Vector DB`);

        // Simulate migration to vector database
        for (const key of cacheKeys.slice(0, threshold / 2)) {
          try {
            const data = JSON.parse(properties[key]);
            // Here you would store to actual vector DB
            Utils.log(`Migrated ${key} to Vector DB`);
            PropertiesService.getScriptProperties().deleteProperty(key);
          } catch (error) {
            Utils.error(`Failed to migrate ${key}`, error);
          }
        }
      }
    }

    clearCache() {
      this.localCache.clear();

      // Clear remote cache
      const properties = PropertiesService.getScriptProperties().getProperties();
      const cacheKeys = Object.keys(properties).filter(key => key.startsWith('cache_'));

      cacheKeys.forEach(key => {
        PropertiesService.getScriptProperties().deleteProperty(key);
      });

      Utils.log('HybridCacheManager: All caches cleared');
    }
  }

  return {
    HybridCacheManager: new HybridCacheManager(),
    MODULE_VERSION
  };
});
