/**
 * @file Services/EmbeddingService.js
 * @description خدمة البحث الدلالي والتضمين (Embeddings)
 * @version 1.0.0
 */

defineModule('System.Services.EmbeddingService', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';
  const CACHE_KEY_PREFIX = 'embedding_';
  const VECTOR_STORE_SHEET = 'VectorStore_Cache';

  let isInitialized = false;
  const embeddingCache = new Map();

  function initialize() {
    try {
      if (isInitialized) return true;

      Utils.log('🔧 تهيئة خدمة التضمين...');

      // التحقق من توفر API Key
      const apiKey = Config.get('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('مفتاح API مفقود');
      }

      // إنشاء ورقة التخزين إذا لم تكن موجودة
      createVectorStoreSheet();

      // تحميل التضمينات المحفوظة
      loadCachedEmbeddings();

      isInitialized = true;
      Utils.log('✅ تم تهيئة خدمة التضمين بنجاح');
      return true;

    } catch (error) {
      Utils.error('❌ فشل في تهيئة خدمة التضمين:', error.message);
      return false;
    }
  }

  function createVectorStoreSheet() {
    try {
      const sheet = Utils.getSheet(VECTOR_STORE_SHEET, [
        'ID', 'Text', 'Embedding', 'Metadata', 'Timestamp', 'Hash'
      ]);

      if (sheet.getLastRow() === 1) {
        // إضافة تنسيق للعناوين
        const headerRange = sheet.getRange(1, 1, 1, 6);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#4285f4');
        headerRange.setFontColor('white');
      }

      return sheet;
    } catch (error) {
      Utils.error('فشل في إنشاء ورقة التخزين:', error.message);
      throw error;
    }
  }

  function loadCachedEmbeddings() {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(VECTOR_STORE_SHEET);
      if (!sheet || sheet.getLastRow() <= 1) return;

      const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
      let loadedCount = 0;

      data.forEach(row => {
        const [id, text, embeddingStr, metadataStr, timestamp, hash] = row;
        if (id && text && embeddingStr) {
          try {
            const embedding = JSON.parse(embeddingStr);
            const metadata = metadataStr ? JSON.parse(metadataStr) : {};

            embeddingCache.set(hash || generateTextHash(text), {
              id,
              text,
              embedding,
              metadata,
              timestamp: new Date(timestamp)
            });
            loadedCount++;
          } catch (parseError) {
            Utils.warn(`فشل في تحليل التضمين للنص: ${text.substring(0, 50)}...`);
          }
        }
      });

      Utils.log(`📚 تم تحميل ${loadedCount} تضمين من التخزين المحلي`);
    } catch (error) {
      Utils.warn('فشل في تحميل التضمينات المحفوظة:', error.message);
    }
  }

  async function generateEmbedding(text, metadata = {}) {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('النص المدخل غير صالح');
      }

      // تنظيف النص
      const cleanText = text.trim().substring(0, Config.get('EMBEDDING_MAX_TEXT_LENGTH') || 8000);
      const textHash = generateTextHash(cleanText);

      // التحقق من التخزين المؤقت
      if (embeddingCache.has(textHash)) {
        Utils.log('📋 استخدام تضمين محفوظ');
        return embeddingCache.get(textHash);
      }

      // إنشاء تضمين جديد
      const embedding = await callGeminiEmbeddingAPI(cleanText);

      // حفظ في التخزين المؤقت والورقة
      const embeddingData = {
        id: Utilities.getUuid(),
        text: cleanText,
        embedding: embedding,
        metadata: metadata,
        timestamp: new Date(),
        hash: textHash
      };

      embeddingCache.set(textHash, embeddingData);
      saveEmbeddingToSheet(embeddingData);

      Utils.log('✅ تم إنشاء تضمين جديد');
      return embeddingData;

    } catch (error) {
      Utils.error('فشل في إنشاء التضمين:', error.message);
      throw error;
    }
  }

  async function callGeminiEmbeddingAPI(text) {
    try {
      const apiKey = Config.get('GEMINI_API_KEY');
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent';

      const payload = {
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: text }]
        }
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        payload: JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(url, options);
      const responseData = JSON.parse(response.getContentText());

      if (response.getResponseCode() !== 200) {
        throw new Error(`API Error: ${responseData.error?.message || 'Unknown error'}`);
      }

      return responseData.embedding.values;

    } catch (error) {
      Utils.error('فشل في استدعاء API التضمين:', error.message);
      throw error;
    }
  }

  function saveEmbeddingToSheet(embeddingData) {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(VECTOR_STORE_SHEET);
      if (!sheet) return;

      sheet.appendRow([
        embeddingData.id,
        embeddingData.text,
        JSON.stringify(embeddingData.embedding),
        JSON.stringify(embeddingData.metadata),
        embeddingData.timestamp,
        embeddingData.hash
      ]);

    } catch (error) {
      Utils.warn('فشل في حفظ التضمين في الورقة:', error.message);
    }
  }

  async function searchSimilar(queryText, limit = 10, threshold = 0.6) {
    try {
      if (!isInitialized) {
        throw new Error('خدمة التضمين غير مهيأة');
      }

      // إنشاء تضمين للاستعلام
      const queryEmbedding = await generateEmbedding(queryText);

      // حساب التشابه مع جميع التضمينات المحفوظة
      const similarities = [];

      embeddingCache.forEach((item, hash) => {
        if (item.embedding && item.embedding.length > 0) {
          const similarity = calculateCosineSimilarity(
            queryEmbedding.embedding,
            item.embedding
          );

          if (similarity >= threshold) {
            similarities.push({
              ...item,
              similarity: similarity
            });
          }
        }
      });

      // ترتيب النتائج حسب التشابه
      similarities.sort((a, b) => b.similarity - a.similarity);

      // إرجاع أفضل النتائج
      return similarities.slice(0, limit);

    } catch (error) {
      Utils.error('فشل في البحث الدلالي:', error.message);
      return [];
    }
  }

  function calculateCosineSimilarity(vectorA, vectorB) {
    if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  function generateTextHash(text) {
    // إنشاء hash بسيط للنص
    let hash = 0;
    if (text.length === 0) return hash.toString();

    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // تحويل إلى 32bit integer
    }

    return Math.abs(hash).toString();
  }

  async function addToVectorStore(documents) {
    try {
      if (!Array.isArray(documents)) {
        documents = [documents];
      }

      const results = [];

      for (const doc of documents) {
        if (typeof doc === 'string') {
          const result = await generateEmbedding(doc);
          results.push(result);
        } else if (doc.text) {
          const result = await generateEmbedding(doc.text, doc.metadata || {});
          results.push(result);
        }
      }

      Utils.log(`✅ تم إضافة ${results.length} مستند إلى مخزن المتجهات`);
      return results;

    } catch (error) {
      Utils.error('فشل في إضافة المستندات:', error.message);
      throw error;
    }
  }

  function getStats() {
    return {
      initialized: isInitialized,
      cacheSize: embeddingCache.size,
      version: MODULE_VERSION,
      lastUpdate: new Date()
    };
  }

  function clearCache() {
    embeddingCache.clear();
    Utils.log('🗑️ تم مسح ذاكرة التضمين المؤقتة');
  }

  return {
    initialize,
    generateEmbedding,
    searchSimilar,
    addToVectorStore,
    getStats,
    clearCache,
    isInitialized: () => isInitialized,
    MODULE_VERSION
  };
});

// تهيئة تلقائية عند التحميل
if (typeof SpreadsheetApp !== 'undefined') {
  // تأخير قصير للسماح بتحميل التبعيات
  Utilities.sleep(50);

  try {
    const embeddingService = GAssistant.Utils.Injector.get('Services', 'EmbeddingService');
    if (embeddingService) {
      embeddingService.initialize();
    }
  } catch (error) {
    console.warn('فشل في التهيئة التلقائية لخدمة التضمين:', error.message);
  }
}
