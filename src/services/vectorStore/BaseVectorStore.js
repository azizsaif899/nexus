/**
 * @file src/services/vectorStore/BaseVectorStore.js
 * @description واجهة أساسية لمخازن المتجهات مع تصميم مرن
 * @version 1.0.0
 */

defineModule('Services.VectorStore.Base', ({ Utils }) => {
  const MODULE_VERSION = '1.0.0';

  class BaseVectorStore {
    constructor(config = {}) {
      this.config = config;
      this.isInitialized = false;
      this.stats = {
        totalVectors: 0,
        totalQueries: 0,
        averageQueryTime: 0,
        cacheHits: 0
      };
    }

    async initialize() {
      throw new Error('initialize() method must be implemented by subclass');
    }

    async addVectors(vectors) {
      throw new Error('addVectors() method must be implemented by subclass');
    }

    async findSimilar(queryVector, options = {}) {
      throw new Error('findSimilar() method must be implemented by subclass');
    }

    async deleteVectors(ids) {
      throw new Error('deleteVectors() method must be implemented by subclass');
    }

    getStats() {
      return {
        ...this.stats,
        isInitialized: this.isInitialized,
        version: MODULE_VERSION
      };
    }

    _validateVector(vector) {
      if (!Array.isArray(vector.embedding)) {
        throw new Error('Vector embedding must be an array');
      }
      if (!vector.id) {
        throw new Error('Vector must have an id');
      }
      return true;
    }
  }

  return { BaseVectorStore, MODULE_VERSION };
});