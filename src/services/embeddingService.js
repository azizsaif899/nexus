/**
 * @file src/services/embeddingService.js
 * @description خدمة Gemini Embeddings محسنة مع تكامل كامل
 * @version 1.0.0
 * @author عبدالعزيز
 */

defineModule('Services.EmbeddingService', ({ Utils, Config, AI }) => {
  const MODULE_VERSION = '1.0.0';
  
  class EmbeddingService {
    constructor() {
      this.apiKey = Config.get('API_KEY');
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
      this.model = 'text-embedding-004';
      this.cache = new Map();
      this.cacheTTL = 3600000; // 1 hour
      this.batchSize = 100;
    }

    /**
     * توليد embeddings لنص واحد أو متعدد
     */
    async generateEmbeddings(texts, options = {}) {
      try {
        const textArray = Array.isArray(texts) ? texts : [texts];
        const results = [];
        
        // معالجة مجمعة للنصوص
        for (let i = 0; i < textArray.length; i += this.batchSize) {
          const batch = textArray.slice(i, i + this.batchSize);
          const batchResults = await this._processBatch(batch, options);
          results.push(...batchResults);
        }
        
        return Array.isArray(texts) ? results : results[0];
      } catch (error) {
        Utils.error('EmbeddingService: Failed to generate embeddings', error);
        throw new Error(`فشل في توليد Embeddings: ${error.message}`);
      }
    }

    /**
     * معالجة دفعة من النصوص
     */
    async _processBatch(texts, options) {
      const results = [];
      
      for (const text of texts) {
        // فحص التخزين المؤقت أولاً
        const cached = this._getCachedEmbedding(text);
        if (cached && !options.forceRefresh) {
          results.push(cached);
          continue;
        }

        // توليد embedding جديد
        const embedding = await this._generateSingleEmbedding(text, options);
        this._cacheEmbedding(text, embedding);
        results.push(embedding);
      }
      
      return results;
    }

    /**
     * توليد embedding لنص واحد
     */
    async _generateSingleEmbedding(text, options = {}) {
      const endpoint = `${this.baseUrl}/models/${this.model}:embedContent`;
      
      const payload = {
        model: `models/${this.model}`,
        content: {
          parts: [{ text: text.trim() }]
        },
        taskType: options.taskType || 'SEMANTIC_SIMILARITY',
        outputDimensionality: options.dimensions || 768
      };

      const response = UrlFetchApp.fetch(`${endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });

      if (response.getResponseCode() !== 200) {
        throw new Error(`API Error: ${response.getContentText()}`);
      }

      const result = JSON.parse(response.getContentText());
      return {
        text: text,
        embedding: result.embedding.values,
        dimensions: result.embedding.values.length,
        timestamp: new Date().toISOString()
      };
    }

    /**
     * حساب التشابه بين نصين
     */
    async calculateSimilarity(text1, text2, options = {}) {
      const [embedding1, embedding2] = await this.generateEmbeddings([text1, text2], options);
      return this._cosineSimilarity(embedding1.embedding, embedding2.embedding);
    }

    /**
     * البحث الدلالي في مجموعة نصوص
     */
    async semanticSearch(query, documents, options = {}) {
      const queryEmbedding = await this.generateEmbeddings(query, options);
      const docEmbeddings = await this.generateEmbeddings(documents, options);
      
      const similarities = docEmbeddings.map((docEmb, index) => ({
        document: documents[index],
        similarity: this._cosineSimilarity(queryEmbedding.embedding, docEmb.embedding),
        index
      }));

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, options.topK || 10);
    }

    /**
     * حساب التشابه الكوسيني
     */
    _cosineSimilarity(vecA, vecB) {
      if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have same dimensions');
      }
      
      const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
      const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
      const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
      
      return dotProduct / (magnitudeA * magnitudeB);
    }

    /**
     * التخزين المؤقت
     */
    _getCachedEmbedding(text) {
      const key = this._generateCacheKey(text);
      const cached = this.cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
      
      return null;
    }

    _cacheEmbedding(text, embedding) {
      const key = this._generateCacheKey(text);
      this.cache.set(key, {
        data: embedding,
        timestamp: Date.now()
      });
    }

    _generateCacheKey(text) {
      return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text)
        .map(byte => (byte + 256).toString(16).slice(1))
        .join('');
    }

    /**
     * إحصائيات الخدمة
     */
    getStats() {
      return {
        cacheSize: this.cache.size,
        model: this.model,
        version: MODULE_VERSION
      };
    }

    /**
     * مسح التخزين المؤقت
     */
    clearCache() {
      this.cache.clear();
      Utils.log('EmbeddingService: Cache cleared');
    }
  }

  return {
    EmbeddingService: new EmbeddingService(),
    MODULE_VERSION
  };
});