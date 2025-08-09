/**
 * @file src/connectors/VectorDBConnector.js
 * @description موصل متقدم لقواعد بيانات المتجهات
 */

defineModule('Connectors.VectorDB', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  class VectorDBConnector {
    constructor() {
      this.provider = Config.get('VECTOR_DB_PROVIDER') || 'pinecone';
      this.apiKey = Config.get('VECTOR_DB_API_KEY');
      this.indexName = Config.get('VECTOR_DB_INDEX') || 'azizsys-embeddings';
      this.dimension = 768;
      this.batchSize = 100;
    }

    async storeEmbedding(id, embedding, metadata = {}) {
      if (!Array.isArray(embedding) || embedding.length !== this.dimension) {
        throw new Error(`Invalid embedding dimension. Expected ${this.dimension}`);
      }

      const vector = {
        id: this._sanitizeId(id),
        values: embedding,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          source: 'azizsys'
        }
      };

      return await this._upsertVector(vector);
    }

    async semanticSearch(embedding, options = {}) {
      const {
        topK = 10,
        threshold = 0.5,
        filter = {},
        includeMetadata = true
      } = options;

      try {
        const searchResult = await this._queryVectors({
          vector: embedding,
          topK,
          filter,
          includeMetadata
        });

        return searchResult.matches
          .filter(match => match.score >= threshold)
          .map(match => ({
            id: match.id,
            similarity: match.score,
            metadata: match.metadata || {}
          }));
      } catch (error) {
        Utils.error('Semantic search failed', error);
        throw error;
      }
    }

    async _upsertVector(vector) {
      return await this._makeRequest('POST', '/vectors/upsert', {
        vectors: [vector]
      });
    }

    async _queryVectors(queryParams) {
      return await this._makeRequest('POST', '/query', queryParams);
    }

    async _makeRequest(method, endpoint, data = null) {
      const url = `https://${this.indexName}-${this.provider}.svc.cluster.local${endpoint}`;

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
        throw new Error(`API Error ${responseCode}: ${responseText}`);
      }

      return JSON.parse(responseText);
    }

    _sanitizeId(id) {
      return id.replace(/[^a-zA-Z0-9-_]/g, '_');
    }
  }

  return {
    VectorDBConnector: new VectorDBConnector(),
    MODULE_VERSION
  };
});
