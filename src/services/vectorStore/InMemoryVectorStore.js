/**
 * @file src/services/vectorStore/InMemoryVectorStore.js
 * @description مخزن متجهات في الذاكرة للاختبارات والتطوير
 */

defineModule('Services.VectorStore.InMemory', ({ Utils, Injector }) => {
  const { BaseVectorStore } = Injector.get('Services.VectorStore.Base');

  class InMemoryVectorStore extends BaseVectorStore {
    constructor(config = {}) {
      super(config);
      this.vectors = new Map();
      this.cache = new Map();
    }

    async initialize() {
      this.isInitialized = true;
      Utils.log('InMemoryVectorStore: Initialized');
      return true;
    }

    async addVectors(vectors) {
      const ids = [];
      for (const vector of vectors) {
        this._validateVector(vector);
        this.vectors.set(vector.id, vector);
        ids.push(vector.id);
        this._updateStats('add');
      }
      return ids;
    }

    async findSimilar(queryVector, options = {}) {
      const startTime = Date.now();
      const opts = this._validateSearchOptions(options);

      const results = [];
      for (const [id, vector] of this.vectors) {
        const similarity = this._cosineSimilarity(queryVector, vector.embedding);
        if (similarity >= opts.threshold) {
          results.push({
            id,
            similarity,
            metadata: opts.includeMetadata ? vector.metadata : undefined,
            values: opts.includeValues ? vector.embedding : undefined
          });
        }
      }

      const sorted = results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, opts.topK);

      this._updateStats('query', Date.now() - startTime);
      return sorted;
    }

    async deleteVectors(ids) {
      for (const id of ids) {
        this.vectors.delete(id);
      }
      return true;
    }

    _cosineSimilarity(vecA, vecB) {
      const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
      const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
      const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    }

    _validateSearchOptions(options) {
      return {
        topK: 10,
        threshold: 0.0,
        includeMetadata: true,
        includeValues: false,
        ...options
      };
    }
  }

  return { InMemoryVectorStore };
});
