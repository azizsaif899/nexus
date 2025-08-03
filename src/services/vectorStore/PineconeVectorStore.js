/**
 * @file src/services/vectorStore/PineconeVectorStore.js
 * @description مخزن متجهات Pinecone للإنتاج
 */

defineModule('Services.VectorStore.Pinecone', ({ Utils, Config, Injector }) => {
  const { BaseVectorStore } = Injector.get('Services.VectorStore.Base');

  class PineconeVectorStore extends BaseVectorStore {
    constructor(config = {}) {
      super(config);
      this.apiKey = Config.get('PINECONE_API_KEY');
      this.environment = Config.get('PINECONE_ENVIRONMENT');
      this.indexName = config.indexName || 'azizsys-embeddings';
      this.baseUrl = `https://${this.indexName}-${this.environment}.svc.pinecone.io`;
    }

    async initialize() {
      try {
        await this._createIndexIfNotExists();
        this.isInitialized = true;
        Utils.log('PineconeVectorStore: Initialized');
        return true;
      } catch (error) {
        Utils.error('PineconeVectorStore: Initialization failed', error);
        throw error;
      }
    }

    async addVectors(vectors) {
      const startTime = Date.now();
      const upsertData = vectors.map(vector => {
        this._validateVector(vector);
        return {
          id: vector.id,
          values: vector.embedding,
          metadata: vector.metadata || {}
        };
      });

      const response = await this._makeRequest('POST', '/vectors/upsert', {
        vectors: upsertData
      });

      this._updateStats('add');
      Utils.log(`PineconeVectorStore: Added ${vectors.length} vectors in ${Date.now() - startTime}ms`);
      return vectors.map(v => v.id);
    }

    async findSimilar(queryVector, options = {}) {
      const startTime = Date.now();
      const opts = this._validateSearchOptions(options);

      const response = await this._makeRequest('POST', '/query', {
        vector: queryVector,
        topK: opts.topK,
        includeMetadata: opts.includeMetadata,
        includeValues: opts.includeValues,
        filter: opts.filter || {}
      });

      const results = response.matches.map(match => ({
        id: match.id,
        similarity: match.score,
        metadata: match.metadata,
        values: match.values
      }));

      this._updateStats('query', Date.now() - startTime);
      return results;
    }

    async deleteVectors(ids) {
      await this._makeRequest('POST', '/vectors/delete', {
        ids: ids
      });
      return true;
    }

    async _createIndexIfNotExists() {
      try {
        await this._makeRequest('GET', '/describe_index_stats');
      } catch (error) {
        if (error.message.includes('404')) {
          Utils.log('PineconeVectorStore: Creating new index');
          // Index creation logic would go here
        } else {
          throw error;
        }
      }
    }

    async _makeRequest(method, endpoint, data = null) {
      const url = `${this.baseUrl}${endpoint}`;
      const options = {
        method,
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        muteHttpExceptions: true
      };

      if (data) {
        options.payload = JSON.stringify(data);
      }

      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();

      if (responseCode >= 400) {
        throw new Error(`Pinecone API Error ${responseCode}: ${responseText}`);
      }

      return JSON.parse(responseText);
    }
  }

  return { PineconeVectorStore };
});
