/**
 * @file tests/embeddingService.test.js
 * @description اختبارات شاملة لخدمة EmbeddingService
 * @version 1.0.0
 */

// Mock Google Apps Script services
global.UrlFetchApp = {
  fetch: jest.fn()
};

global.Utilities = {
  computeDigest: jest.fn(),
  DigestAlgorithm: { SHA_256: 'SHA_256' }
};

// Mock defineModule
global.defineModule = jest.fn((name, factory) => {
  const mockDeps = {
    Utils: {
      log: jest.fn(),
      error: jest.fn()
    },
    Config: {
      get: jest.fn().mockReturnValue('test-api-key')
    },
    AI: {}
  };
  return factory(mockDeps);
});

describe('EmbeddingService - اختبارات شاملة', () => {
  let embeddingService;
  let mockResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API response
    mockResponse = {
      getResponseCode: jest.fn().mockReturnValue(200),
      getContentText: jest.fn().mockReturnValue(JSON.stringify({
        embedding: {
          values: new Array(768).fill(0).map(() => Math.random())
        }
      }))
    };
    
    global.UrlFetchApp.fetch.mockReturnValue(mockResponse);
    global.Utilities.computeDigest.mockReturnValue([1, 2, 3, 4]);
    
    // Initialize service
    // Require the module, which will call the mocked defineModule
    require('../src/services/embeddingService.js');
    
    // Get the last returned value from the defineModule mock
    // This assumes defineModule is called only once for this module in the test setup
    embeddingService = global.defineModule.mock.results[global.defineModule.mock.results.length - 1].value;
  });

  describe('الاختبارات الإيجابية (Happy Path)', () => {
    test('يجب أن يُرجع embedding صحيح للنص الواحد', async () => {
      const text = 'مرحبا بالعالم';
      const result = await embeddingService.generateEmbeddings(text);
      
      expect(result).toBeDefined();
      expect(result.text).toBe(text);
      expect(result.embedding).toHaveLength(768);
      expect(result.dimensions).toBe(768);
      expect(result.timestamp).toBeDefined();
    });

    test('يجب أن يعمل التخزين المؤقت بشكل صحيح', async () => {
      const text = 'نص للاختبار';
      
      // First call
      await embeddingService.generateEmbeddings(text);
      expect(global.UrlFetchApp.fetch).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      await embeddingService.generateEmbeddings(text);
      expect(global.UrlFetchApp.fetch).toHaveBeenCalledTimes(1);
    });

    test('يجب أن يحسب التشابه بين نصين متشابهين', async () => {
      const text1 = 'مرحبا';
      const text2 = 'أهلا';
      
      const similarity = await embeddingService.calculateSimilarity(text1, text2);
      
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('اختبارات الحالات الطرفية (Edge Cases)', () => {
    test('يجب أن يتعامل مع النص الفارغ', async () => {
      await expect(embeddingService.generateEmbeddings('')).rejects.toThrow();
    });

    test('يجب أن يتعامل مع null', async () => {
      await expect(embeddingService.generateEmbeddings(null)).rejects.toThrow();
    });

    test('يجب أن يتعامل مع النص الطويل جداً', async () => {
      const longText = 'أ'.repeat(10000);
      const result = await embeddingService.generateEmbeddings(longText);
      
      expect(result).toBeDefined();
      expect(result.embedding).toHaveLength(768);
    });

    test('يجب أن يرمي خطأ عند مقارنة متجهين بأطوال مختلفة', () => {
      const vecA = [1, 2, 3];
      const vecB = [1, 2];
      
      expect(() => {
        embeddingService._cosineSimilarity(vecA, vecB);
      }).toThrow('Vectors must have same dimensions');
    });
  });

  describe('اختبارات معالجة الأخطاء (Failure Scenarios)', () => {
    test('يجب أن يتعامل مع فشل الشبكة', async () => {
      global.UrlFetchApp.fetch.mockImplementation(() => {
        throw new Error('Network error');
      });

      await expect(embeddingService.generateEmbeddings('test')).rejects.toThrow();
    });

    test('يجب أن يتعامل مع خطأ 401 Unauthorized', async () => {
      mockResponse.getResponseCode.mockReturnValue(401);
      mockResponse.getContentText.mockReturnValue('Unauthorized');

      await expect(embeddingService.generateEmbeddings('test')).rejects.toThrow('API Error');
    });

    test('يجب أن يتعامل مع خطأ 429 Too Many Requests', async () => {
      mockResponse.getResponseCode.mockReturnValue(429);
      mockResponse.getContentText.mockReturnValue('Too Many Requests');

      await expect(embeddingService.generateEmbeddings('test')).rejects.toThrow('API Error');
    });

    test('يجب أن يتعامل مع استجابة JSON غير صحيحة', async () => {
      mockResponse.getContentText.mockReturnValue('invalid json');

      await expect(embeddingService.generateEmbeddings('test')).rejects.toThrow();
    });
  });

  describe('اختبارات الأداء والتحسين', () => {
    test('يجب أن يعالج المصفوفات الكبيرة بكفاءة', async () => {
      const texts = Array(150).fill().map((_, i) => `نص رقم ${i}`);
      
      const startTime = Date.now();
      const results = await embeddingService.generateEmbeddings(texts);
      const endTime = Date.now();
      
      expect(results).toHaveLength(150);
      expect(endTime - startTime).toBeLessThan(5000); // Less than 5 seconds
    });

    test('يجب أن يحافظ على إحصائيات صحيحة', () => {
      const stats = embeddingService.getStats();
      
      expect(stats).toHaveProperty('cacheSize');
      expect(stats).toHaveProperty('model');
      expect(stats).toHaveProperty('version');
    });

    test('يجب أن يمسح التخزين المؤقت بنجاح', () => {
      embeddingService.clearCache();
      const stats = embeddingService.getStats();
      
      expect(stats.cacheSize).toBe(0);
    });
  });

  describe('اختبارات البحث الدلالي', () => {
    test('يجب أن يُرجع أفضل النتائج المطابقة', async () => {
      const query = 'تقنية الذكاء الاصطناعي';
      const documents = [
        'الذكاء الاصطناعي تقنية متقدمة',
        'الطبخ فن جميل',
        'تعلم الآلة جزء من الذكاء الاصطناعي'
      ];
      
      const results = await embeddingService.semanticSearch(query, documents, { topK: 2 });
      
      expect(results).toHaveLength(2);
      expect(results[0].similarity).toBeGreaterThan(results[1].similarity);
      expect(results[0]).toHaveProperty('document');
      expect(results[0]).toHaveProperty('similarity');
      expect(results[0]).toHaveProperty('index');
    });
  });
});