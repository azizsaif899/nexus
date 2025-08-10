import { GoogleServices } from '../../packages/core-logic/src/lib/google-services';
import { AICoreService } from '../../packages/core-logic/src/services/ai-core.service';
import { DateHelper } from '../../packages/core-logic/src/utils/date-helper';

// Mock external dependencies
jest.mock('../../packages/core-logic/src/clients/gemini-client');
jest.mock('../../packages/core-logic/src/clients/bigquery-client');

describe('Core Logic Package', () => {
  describe('GoogleServices', () => {
    let googleServices: GoogleServices;

    beforeEach(() => {
      googleServices = new GoogleServices();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('initialization', () => {
      it('should initialize with default configuration', () => {
        expect(googleServices).toBeDefined();
        expect(googleServices).toBeInstanceOf(GoogleServices);
      });

      it('should have required methods', () => {
        expect(typeof googleServices.queryGemini).toBe('function');
        expect(typeof googleServices.queryBigQuery).toBe('function');
        expect(typeof googleServices.getSheetData).toBe('function');
      });
    });

    describe('queryGemini', () => {
      it('should handle successful Gemini query', async () => {
        const mockResponse = {
          success: true,
          response: 'Test response from Gemini',
          confidence: 0.95
        };

        // Mock the Gemini client response
        const mockGeminiClient = {
          query: jest.fn().mockResolvedValue(mockResponse)
        };
        
        (googleServices as any).geminiClient = mockGeminiClient;

        const result = await googleServices.queryGemini('test prompt');

        expect(result).toEqual(mockResponse);
        expect(mockGeminiClient.query).toHaveBeenCalledWith('test prompt');
        expect(mockGeminiClient.query).toHaveBeenCalledTimes(1);
      });

      it('should handle Gemini query errors', async () => {
        const mockError = new Error('Gemini API error');
        const mockGeminiClient = {
          query: jest.fn().mockRejectedValue(mockError)
        };
        
        (googleServices as any).geminiClient = mockGeminiClient;

        await expect(googleServices.queryGemini('test prompt')).rejects.toThrow('Gemini API error');
      });

      it('should validate input parameters', async () => {
        await expect(googleServices.queryGemini('')).rejects.toThrow('Prompt cannot be empty');
        await expect(googleServices.queryGemini(null as any)).rejects.toThrow('Prompt is required');
      });
    });

    describe('queryBigQuery', () => {
      it('should execute BigQuery successfully', async () => {
        const mockResults = [
          { id: 1, name: 'Test Record 1' },
          { id: 2, name: 'Test Record 2' }
        ];

        const mockBigQueryClient = {
          query: jest.fn().mockResolvedValue([mockResults])
        };
        
        (googleServices as any).bigQueryClient = mockBigQueryClient;

        const result = await googleServices.queryBigQuery('SELECT * FROM test_table');

        expect(result).toEqual(mockResults);
        expect(mockBigQueryClient.query).toHaveBeenCalledWith({
          query: 'SELECT * FROM test_table',
          location: 'US'
        });
      });

      it('should handle BigQuery errors', async () => {
        const mockError = new Error('BigQuery error');
        const mockBigQueryClient = {
          query: jest.fn().mockRejectedValue(mockError)
        };
        
        (googleServices as any).bigQueryClient = mockBigQueryClient;

        await expect(googleServices.queryBigQuery('INVALID SQL')).rejects.toThrow('BigQuery error');
      });

      it('should validate SQL queries', async () => {
        await expect(googleServices.queryBigQuery('')).rejects.toThrow('SQL query cannot be empty');
        await expect(googleServices.queryBigQuery('DROP TABLE users')).rejects.toThrow('Destructive queries not allowed');
      });
    });
  });

  describe('AICoreService', () => {
    let aiCoreService: AICoreService;

    beforeEach(() => {
      aiCoreService = new AICoreService();
    });

    describe('processQuery', () => {
      it('should process simple queries', async () => {
        const query = 'What is the weather today?';
        const result = await aiCoreService.processQuery(query);

        expect(result).toBeDefined();
        expect(result.response).toBeTruthy();
        expect(result.confidence).toBeGreaterThan(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });

      it('should handle complex queries', async () => {
        const complexQuery = 'Analyze the sales data from last quarter and provide insights on customer behavior patterns';
        const result = await aiCoreService.processQuery(complexQuery);

        expect(result).toBeDefined();
        expect(result.response).toBeTruthy();
        expect(typeof result.response).toBe('string');
        expect(result.response.length).toBeGreaterThan(10);
      });

      it('should handle Arabic queries', async () => {
        const arabicQuery = 'ما هي أفضل الممارسات في البرمجة؟';
        const result = await aiCoreService.processQuery(arabicQuery);

        expect(result).toBeDefined();
        expect(result.response).toBeTruthy();
        expect(result.language).toBe('ar');
      });

      it('should reject empty queries', async () => {
        await expect(aiCoreService.processQuery('')).rejects.toThrow('Query cannot be empty');
        await expect(aiCoreService.processQuery('   ')).rejects.toThrow('Query cannot be empty');
      });

      it('should handle very long queries', async () => {
        const longQuery = 'A'.repeat(10000);
        const result = await aiCoreService.processQuery(longQuery);

        expect(result).toBeDefined();
        expect(result.response).toBeTruthy();
      });
    });

    describe('analyzeContext', () => {
      it('should analyze context correctly', () => {
        const context = {
          user: 'test_user',
          session: 'session_123',
          previousQueries: ['Hello', 'How are you?']
        };

        const analysis = aiCoreService.analyzeContext(context);

        expect(analysis).toBeDefined();
        expect(analysis.userType).toBeTruthy();
        expect(analysis.sessionLength).toBe(2);
        expect(analysis.topics).toBeInstanceOf(Array);
      });

      it('should handle empty context', () => {
        const analysis = aiCoreService.analyzeContext({});

        expect(analysis).toBeDefined();
        expect(analysis.userType).toBe('anonymous');
        expect(analysis.sessionLength).toBe(0);
      });
    });
  });

  describe('DateHelper', () => {
    describe('formatDate', () => {
      it('should format dates correctly', () => {
        const date = new Date('2024-01-15T10:30:00Z');
        
        expect(DateHelper.formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
        expect(DateHelper.formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
        expect(DateHelper.formatDate(date, 'MM-DD-YYYY HH:mm')).toBe('01-15-2024 10:30');
      });

      it('should handle invalid dates', () => {
        const invalidDate = new Date('invalid');
        
        expect(() => DateHelper.formatDate(invalidDate, 'YYYY-MM-DD')).toThrow('Invalid date');
      });

      it('should use default format when not specified', () => {
        const date = new Date('2024-01-15T10:30:00Z');
        const formatted = DateHelper.formatDate(date);
        
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
      });
    });

    describe('parseDate', () => {
      it('should parse date strings correctly', () => {
        const dateString = '2024-01-15';
        const parsed = DateHelper.parseDate(dateString);
        
        expect(parsed).toBeInstanceOf(Date);
        expect(parsed.getFullYear()).toBe(2024);
        expect(parsed.getMonth()).toBe(0); // January is 0
        expect(parsed.getDate()).toBe(15);
      });

      it('should handle different date formats', () => {
        expect(DateHelper.parseDate('15/01/2024')).toBeInstanceOf(Date);
        expect(DateHelper.parseDate('Jan 15, 2024')).toBeInstanceOf(Date);
        expect(DateHelper.parseDate('2024-01-15T10:30:00Z')).toBeInstanceOf(Date);
      });

      it('should throw error for invalid date strings', () => {
        expect(() => DateHelper.parseDate('invalid-date')).toThrow('Invalid date string');
        expect(() => DateHelper.parseDate('')).toThrow('Date string cannot be empty');
      });
    });

    describe('addDays', () => {
      it('should add days correctly', () => {
        const date = new Date('2024-01-15');
        const newDate = DateHelper.addDays(date, 5);
        
        expect(newDate.getDate()).toBe(20);
        expect(newDate.getMonth()).toBe(0);
        expect(newDate.getFullYear()).toBe(2024);
      });

      it('should handle negative days', () => {
        const date = new Date('2024-01-15');
        const newDate = DateHelper.addDays(date, -5);
        
        expect(newDate.getDate()).toBe(10);
      });

      it('should handle month boundaries', () => {
        const date = new Date('2024-01-30');
        const newDate = DateHelper.addDays(date, 5);
        
        expect(newDate.getMonth()).toBe(1); // February
        expect(newDate.getDate()).toBe(4);
      });
    });

    describe('getDaysBetween', () => {
      it('should calculate days between dates correctly', () => {
        const date1 = new Date('2024-01-15');
        const date2 = new Date('2024-01-20');
        
        expect(DateHelper.getDaysBetween(date1, date2)).toBe(5);
        expect(DateHelper.getDaysBetween(date2, date1)).toBe(-5);
      });

      it('should handle same dates', () => {
        const date = new Date('2024-01-15');
        
        expect(DateHelper.getDaysBetween(date, date)).toBe(0);
      });
    });

    describe('isWeekend', () => {
      it('should identify weekends correctly', () => {
        const saturday = new Date('2024-01-13'); // Saturday
        const sunday = new Date('2024-01-14'); // Sunday
        const monday = new Date('2024-01-15'); // Monday
        
        expect(DateHelper.isWeekend(saturday)).toBe(true);
        expect(DateHelper.isWeekend(sunday)).toBe(true);
        expect(DateHelper.isWeekend(monday)).toBe(false);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should integrate GoogleServices with AICoreService', async () => {
      const googleServices = new GoogleServices();
      const aiCoreService = new AICoreService();
      
      // Mock successful responses
      const mockGeminiResponse = {
        success: true,
        response: 'Integrated response',
        confidence: 0.9
      };
      
      (googleServices as any).geminiClient = {
        query: jest.fn().mockResolvedValue(mockGeminiResponse)
      };

      const query = 'Test integration query';
      const context = { source: 'integration_test' };
      
      const result = await aiCoreService.processQueryWithContext(query, context);
      
      expect(result).toBeDefined();
      expect(result.response).toBeTruthy();
    });

    it('should handle service failures gracefully', async () => {
      const googleServices = new GoogleServices();
      const aiCoreService = new AICoreService();
      
      // Mock service failure
      (googleServices as any).geminiClient = {
        query: jest.fn().mockRejectedValue(new Error('Service unavailable'))
      };

      const query = 'Test failure handling';
      
      // Should not throw, but return error response
      const result = await aiCoreService.processQueryWithFallback(query);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Performance Tests', () => {
    it('should process queries within acceptable time limits', async () => {
      const aiCoreService = new AICoreService();
      const startTime = Date.now();
      
      await aiCoreService.processQuery('Performance test query');
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle concurrent queries', async () => {
      const aiCoreService = new AICoreService();
      const queries = Array.from({ length: 10 }, (_, i) => `Query ${i + 1}`);
      
      const startTime = Date.now();
      const promises = queries.map(query => aiCoreService.processQuery(query));
      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      expect(results).toHaveLength(10);
      expect(results.every(result => result.response)).toBe(true);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeouts', async () => {
      const googleServices = new GoogleServices();
      
      (googleServices as any).geminiClient = {
        query: jest.fn().mockImplementation(() => 
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
        )
      };

      await expect(googleServices.queryGemini('timeout test')).rejects.toThrow('Timeout');
    });

    it('should handle malformed responses', async () => {
      const googleServices = new GoogleServices();
      
      (googleServices as any).geminiClient = {
        query: jest.fn().mockResolvedValue(null)
      };

      await expect(googleServices.queryGemini('malformed test')).rejects.toThrow('Invalid response');
    });
  });
});