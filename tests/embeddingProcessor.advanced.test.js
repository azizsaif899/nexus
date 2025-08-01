/**
 * @file tests/embeddingProcessor.advanced.test.js
 * @description اختبارات متقدمة لمعالج المتجهات مع سيناريوهات معقدة
 */

import { expect } from 'chai';
import sinon from 'sinon';

// Mock Google Apps Script environment
global.UrlFetchApp = {
  fetch: jest.fn()
};

global.defineModule = jest.fn((name, factory) => {
  const mockDeps = {
    Utils: { log: jest.fn(), error: jest.fn() },
    Config: { get: jest.fn().mockReturnValue('test-api-key') }
  };
  return factory(mockDeps);
});

describe('Enhanced EmbeddingProcessor Tests - Advanced Scenarios', () => {
  let processor;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    
    // Mock successful API response
    const mockResponse = {
      getResponseCode: () => 200,
      getContentText: () => JSON.stringify({
        embedding: { values: Array(768).fill(0).map(() => Math.random()) }
      })
    };
    
    global.UrlFetchApp.fetch.mockReturnValue(mockResponse);
    
    // Initialize processor
    const module = require('../src/services/embeddingService.js');
    processor = module.EmbeddingService;
  });

  afterEach(() => sandbox.restore());

  describe('Performance and Load Testing', () => {
    test('should handle concurrent requests efficiently', async () => {
      const promises = Array(10).fill().map((_, i) => 
        processor.generateEmbeddings(`concurrent test ${i}`)
      );
      
      const startTime = Date.now();
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(10);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should maintain performance under high load', async () => {
      const batchSize = 50;
      const texts = Array(batchSize).fill().map((_, i) => `load test ${i}`);
      
      const startTime = Date.now();
      const results = await processor.generateEmbeddings(texts);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(batchSize);
      expect(duration / batchSize).toBeLessThan(100); // < 100ms per embedding
    });
  });

  describe('API Rate Limiting and Retry Logic', () => {
    test('should handle rate limits with exponential backoff', async () => {
      const rateLimitResponse = {
        getResponseCode: () => 429,
        getContentText: () => 'Rate limit exceeded'
      };
      
      const successResponse = {
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({
          embedding: { values: Array(768).fill(0.1) }
        })
      };

      global.UrlFetchApp.fetch
        .mockReturnValueOnce(rateLimitResponse)
        .mockReturnValueOnce(successResponse);

      const result = await processor.generateEmbeddings('retry test');
      expect(result.embedding).toHaveLength(768);
    });

    test('should fail gracefully after max retries', async () => {
      const rateLimitResponse = {
        getResponseCode: () => 429,
        getContentText: () => 'Rate limit exceeded'
      };

      global.UrlFetchApp.fetch.mockReturnValue(rateLimitResponse);

      await expect(processor.generateEmbeddings('max retry test'))
        .rejects.toThrow('API Error');
    });
  });

  describe('Financial Domain Semantic Analysis', () => {
    test('should detect high similarity for related financial terms', async () => {
      const embedding1 = await processor.generateEmbeddings('Q4 earnings report');
      const embedding2 = await processor.generateEmbeddings('quarterly financial results');
      
      const similarity = processor._cosineSimilarity(
        embedding1.embedding, 
        embedding2.embedding
      );
      
      expect(similarity).toBeGreaterThan(0.7); // High similarity expected
    });

    test('should distinguish between different financial concepts', async () => {
      const embedding1 = await processor.generateEmbeddings('revenue growth');
      const embedding2 = await processor.generateEmbeddings('debt restructuring');
      
      const similarity = processor._cosineSimilarity(
        embedding1.embedding, 
        embedding2.embedding
      );
      
      expect(similarity).toBeLessThan(0.5); // Low similarity expected
    });
  });

  describe('Cache Performance and Optimization', () => {
    test('should leverage cache for repeated requests', async () => {
      const spy = jest.spyOn(global.UrlFetchApp, 'fetch');
      
      await processor.generateEmbeddings('cache test');
      await processor.generateEmbeddings('cache test');
      
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should handle cache invalidation correctly', async () => {
      await processor.generateEmbeddings('invalidation test');
      processor.clearCache();
      
      const spy = jest.spyOn(global.UrlFetchApp, 'fetch');
      await processor.generateEmbeddings('invalidation test');
      
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling and Recovery', () => {
    test('should handle network timeouts gracefully', async () => {
      global.UrlFetchApp.fetch.mockImplementation(() => {
        throw new Error('Request timeout');
      });

      await expect(processor.generateEmbeddings('timeout test'))
        .rejects.toThrow('فشل في توليد Embeddings');
    });

    test('should handle malformed API responses', async () => {
      const malformedResponse = {
        getResponseCode: () => 200,
        getContentText: () => 'invalid json'
      };

      global.UrlFetchApp.fetch.mockReturnValue(malformedResponse);

      await expect(processor.generateEmbeddings('malformed test'))
        .rejects.toThrow();
    });
  });

  describe('Memory and Resource Management', () => {
    test('should not cause memory leaks with large batches', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Process large batch
      const largeTexts = Array(1000).fill().map((_, i) => `memory test ${i}`);
      await processor.generateEmbeddings(largeTexts);
      
      // Force garbage collection if available
      if (global.gc) global.gc();
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (< 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });
});