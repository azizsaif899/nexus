import { GeminiClient, GeminiConfig } from '../clients/gemini-client';

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'مرحبا، هذا رد تجريبي من Gemini',
          usageMetadata: {
            promptTokenCount: 10,
            candidatesTokenCount: 15,
            totalTokenCount: 25
          }
        }
      })
    })
  }))
}));

describe('GeminiClient', () => {
  let geminiClient: GeminiClient;
  let mockConfig: GeminiConfig;

  beforeEach(() => {
    mockConfig = {
      apiKey: 'test-api-key',
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 1000
    };
    geminiClient = new GeminiClient(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateResponse', () => {
    it('should generate response successfully', async () => {
      const prompt = 'مرحبا';
      const response = await geminiClient.generateResponse(prompt);

      expect(response).toEqual({
        text: 'مرحبا، هذا رد تجريبي من Gemini',
        usage: {
          promptTokens: 10,
          completionTokens: 15,
          totalTokens: 25
        }
      });
    });

    it('should handle context in prompt', async () => {
      const prompt = 'ما هو اسمك؟';
      const context = 'أنت مساعد ذكي';
      
      const response = await geminiClient.generateResponse(prompt, context);
      
      expect(response.text).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });

    it('should handle errors gracefully', async () => {
      const mockError = new Error('API Error');
      const mockModel = {
        generateContent: jest.fn().mockRejectedValue(mockError)
      };
      
      (geminiClient as any).model = mockModel;

      await expect(geminiClient.generateResponse('test'))
        .rejects.toThrow('فشل في الحصول على استجابة من Gemini: API Error');
    });
  });

  describe('analyzeDocument', () => {
    it('should analyze document for summary', async () => {
      const text = 'هذا نص تجريبي للتلخيص';
      const result = await geminiClient.analyzeDocument(text, 'summary');
      
      expect(result).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });

    it('should analyze document for sentiment', async () => {
      const text = 'أنا سعيد جداً اليوم';
      const result = await geminiClient.analyzeDocument(text, 'sentiment');
      
      expect(result).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });

    it('should extract keywords', async () => {
      const text = 'الذكاء الاصطناعي والتعلم الآلي';
      const result = await geminiClient.analyzeDocument(text, 'keywords');
      
      expect(result).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });
  });

  describe('translateText', () => {
    it('should translate to Arabic', async () => {
      const text = 'Hello World';
      const result = await geminiClient.translateText(text, 'ar');
      
      expect(result).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });

    it('should translate to English', async () => {
      const text = 'مرحبا بالعالم';
      const result = await geminiClient.translateText(text, 'en');
      
      expect(result).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });
  });

  describe('query', () => {
    it('should handle simple query', async () => {
      const prompt = 'ما هو الطقس اليوم؟';
      const result = await geminiClient.query(prompt);
      
      expect(result).toBe('مرحبا، هذا رد تجريبي من Gemini');
    });
  });

  describe('healthCheck', () => {
    it('should return true when API is healthy', async () => {
      const isHealthy = await geminiClient.healthCheck();
      
      expect(isHealthy).toBe(true);
    });

    it('should return false when API fails', async () => {
      const mockModel = {
        generateContent: jest.fn().mockRejectedValue(new Error('API Down'))
      };
      
      (geminiClient as any).model = mockModel;
      
      const isHealthy = await geminiClient.healthCheck();
      
      expect(isHealthy).toBe(false);
    });
  });
});