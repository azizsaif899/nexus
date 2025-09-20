import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AiCoreService } from './ai-core.service';
import { GeminiClient } from '../clients/gemini-client';

describe('AiCoreService', () => {
  let service: AiCoreService;
  let geminiClient: jest.Mocked<GeminiClient>;

  beforeEach(async () => {
    const mockGeminiClient = {
      query: jest.fn(),
      healthCheck: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiCoreService,
        {
          provide: GeminiClient,
          useValue: mockGeminiClient,
        },
      ],
    }).compile();

    service = module.get<AiCoreService>(AiCoreService);
    geminiClient = module.get(GeminiClient);
  });

  describe('processQuery', () => {
    it('should process query successfully', async () => {
      const mockGeminiResponse = {
        success: true,
        response: 'Test response',
        confidence: 85,
        processingTime: 1000,
        timestamp: '2025-01-09T12:00:00.000Z',
        model: 'gemini-pro'
      };

      geminiClient.query.mockResolvedValue(mockGeminiResponse);

      const request = {
        prompt: 'Test prompt',
        context: 'test',
        userId: 'user123'
      };

      const result = await service.processQuery(request);

      expect(result.success).toBe(true);
      expect(result.response).toBe('Test response');
      expect(result.confidence).toBe(85);
      expect(result.sessionId).toBeDefined();
      expect(result.metadata.originalPrompt).toBe('Test prompt');
    });

    it('should handle errors gracefully', async () => {
      geminiClient.query.mockRejectedValue(new Error('API Error'));

      const request = {
        prompt: 'Test prompt'
      };

      const result = await service.processQuery(request);

      expect(result.success).toBe(false);
      expect(result.response).toContain('عذراً، حدث خطأ');
      expect(result.confidence).toBe(0);
      expect(result.metadata.error).toBe('API Error');
    });

    it('should build context correctly', async () => {
      const mockGeminiResponse = {
        success: true,
        response: 'Test response',
        confidence: 85,
        processingTime: 1000,
        timestamp: '2025-01-09T12:00:00.000Z',
        model: 'gemini-pro'
      };

      geminiClient.query.mockResolvedValue(mockGeminiResponse);

      const request = {
        prompt: 'Test prompt',
        context: 'development',
        userId: 'user123',
        tools: ['analyzer', 'formatter']
      };

      await service.processQuery(request);

      expect(geminiClient.query).toHaveBeenCalledWith(
        expect.stringContaining('السياق: development'),
        'development'
      );
      expect(geminiClient.query).toHaveBeenCalledWith(
        expect.stringContaining('معرف المستخدم: user123'),
        'development'
      );
      expect(geminiClient.query).toHaveBeenCalledWith(
        expect.stringContaining('الأدوات المتاحة: analyzer, formatter'),
        'development'
      );
    });
  });

  describe('analyzeCode', () => {
    it('should analyze code successfully', async () => {
      const mockGeminiResponse = {
        success: true,
        response: 'Code analysis result',
        confidence: 90,
        processingTime: 1500,
        timestamp: '2025-01-09T12:00:00.000Z',
        model: 'gemini-pro'
      };

      geminiClient.query.mockResolvedValue(mockGeminiResponse);

      const result = await service.analyzeCode('// Removed console.log', 'javascript');

      expect(result.success).toBe(true);
      expect(result.response).toBe('Code analysis result');
      expect(geminiClient.query).toHaveBeenCalledWith(
        expect.stringContaining('```javascript'),
        'code_analysis'
      );
    });
  });

  describe('generateJSON', () => {
    it('should generate JSON successfully', async () => {
      const mockGeminiResponse = {
        success: true,
        response: '{"test": "value"}',
        confidence: 95,
        processingTime: 800,
        timestamp: '2025-01-09T12:00:00.000Z',
        model: 'gemini-pro'
      };

      geminiClient.query.mockResolvedValue(mockGeminiResponse);

      const result = await service.generateJSON('Generate test JSON');

      expect(result.success).toBe(true);
      expect(result.response).toBe('{"test": "value"}');
      expect(geminiClient.query).toHaveBeenCalledWith(
        expect.stringContaining('بصيغة JSON صحيحة'),
        'json_generation'
      );
    });

    it('should handle invalid JSON response', async () => {
      const mockGeminiResponse = {
        success: true,
        response: 'invalid json',
        confidence: 95,
        processingTime: 800,
        timestamp: '2025-01-09T12:00:00.000Z',
        model: 'gemini-pro'
      };

      geminiClient.query.mockResolvedValue(mockGeminiResponse);

      const result = await service.generateJSON('Generate test JSON');

      expect(result.success).toBe(true);
      expect(result.metadata.jsonValid).toBe(false);
    });
  });

  describe('healthCheck', () => {
    it('should return true when healthy', async () => {
      geminiClient.healthCheck.mockResolvedValue(true);

      const result = await service.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false when unhealthy', async () => {
      geminiClient.healthCheck.mockRejectedValue(new Error('Health check failed'));

      const result = await service.healthCheck();

      expect(result).toBe(false);
    });
  });

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const service1 = new AiCoreService(geminiClient);
      const service2 = new AiCoreService(geminiClient);

      const id1 = (service1 as any).generateSessionId();
      const id2 = (service2 as any).generateSessionId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^session_\d+_[a-z0-9]+$/);
    });
  });
});