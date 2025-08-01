/**
 * @file src/services/vectorStore/VectorStoreFactory.js
 * @description مصنع مخازن المتجهات مع حقن التبعيات
 */

defineModule('Services.VectorStore.Factory', ({ Config, Injector, Utils }) => {
  const MODULE_VERSION = '1.0.0';

  class VectorStoreFactory {
    constructor() {
      this.providers = new Map();
      this.currentProvider = null;
      this._registerProviders();
    }

    _registerProviders() {
      // تسجيل مقدمي الخدمة المختلفين
      this.providers.set('in-memory', () => {
        const { InMemoryVectorStore } = Injector.get('Services.VectorStore.InMemory');
        return new InMemoryVectorStore();
      });

      this.providers.set('pinecone', () => {
        const { PineconeVectorStore } = Injector.get('Services.VectorStore.Pinecone');
        return new PineconeVectorStore();
      });

      // يمكن إضافة مقدمين آخرين هنا
      this.providers.set('weaviate', () => {
        // const { WeaviateVectorStore } = Injector.get('Services.VectorStore.Weaviate');
        // return new WeaviateVectorStore();
        throw new Error('Weaviate provider not implemented yet');
      });
    }

    /**
     * إنشاء مخزن متجهات حسب النوع المحدد
     */
    async createVectorStore(providerType = null) {
      const provider = providerType || Config.get('VECTOR_STORE_PROVIDER') || 'in-memory';
      
      if (!this.providers.has(provider)) {
        throw new Error(`Unknown vector store provider: ${provider}`);
      }

      try {
        const vectorStore = this.providers.get(provider)();
        await vectorStore.initialize();
        
        this.currentProvider = provider;
        Utils.log(`VectorStoreFactory: Created ${provider} vector store`);
        
        return vectorStore;
      } catch (error) {
        Utils.error(`VectorStoreFactory: Failed to create ${provider} vector store`, error);
        
        // Fallback to in-memory if production provider fails
        if (provider !== 'in-memory') {
          Utils.log('VectorStoreFactory: Falling back to in-memory store');
          return this.createVectorStore('in-memory');
        }
        
        throw error;
      }
    }

    /**
     * الحصول على مخزن المتجهات الحالي
     */
    getCurrentProvider() {
      return this.currentProvider;
    }

    /**
     * الحصول على قائمة المقدمين المتاحين
     */
    getAvailableProviders() {
      return Array.from(this.providers.keys());
    }

    /**
     * تسجيل مقدم خدمة جديد
     */
    registerProvider(name, factory) {
      this.providers.set(name, factory);
      Utils.log(`VectorStoreFactory: Registered provider ${name}`);
    }

    /**
     * فحص صحة المقدم
     */
    async healthCheck(providerType = null) {
      const provider = providerType || this.currentProvider || 'in-memory';
      
      try {
        const vectorStore = await this.createVectorStore(provider);
        const health = await vectorStore.healthCheck();
        await vectorStore.cleanup();
        
        return {
          provider,
          status: 'healthy',
          details: health,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          provider,
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  }

  // إنشاء مثيل واحد من المصنع
  const factory = new VectorStoreFactory();

  // تسجيل المصنع في نظام حقن التبعيات
  Injector.register('Services.VectorStore.Factory', () => factory);

  // إنشاء مخزن المتجهات الافتراضي وتسجيله
  factory.createVectorStore().then(vectorStore => {
    Injector.register('Services.VectorStore', () => vectorStore);
  }).catch(error => {
    Utils.error('VectorStoreFactory: Failed to create default vector store', error);
  });

  return {
    VectorStoreFactory: factory,
    MODULE_VERSION
  };
});