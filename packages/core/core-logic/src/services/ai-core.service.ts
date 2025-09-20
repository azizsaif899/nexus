import { Injectable, Logger } from '@nestjs/common';
import { GeminiClient, GeminiResponse } from '../clients/gemini-client';

export interface AiRequest {
  prompt: string;
  context?: string;
  userId?: string;
  sessionId?: string;
  tools?: string[];
  model?: string;
}

export interface AiResponse {
  success: boolean;
  response: string;
  confidence: number;
  processingTime: number;
  timestamp: string;
  sessionId?: string;
  toolsUsed?: string[];
  metadata?: any;
}

@Injectable()
export class AiCoreService {
  private readonly logger = new Logger(AiCoreService.name);

  constructor(private readonly geminiClient: GeminiClient) {}

  async processQuery(request: AiRequest): Promise<AiResponse> {
    const startTime = Date.now();
    const sessionId = request.sessionId || this.generateSessionId();

    this.logger.log(`Processing AI query for session: ${sessionId}`);

    try {
      // Build enhanced context
      const enhancedPrompt = this.buildContext(request);
      
      // Call Gemini API
      const geminiResponse = await this.geminiClient.query(enhancedPrompt, request.context);
      
      const processingTime = Date.now() - startTime;

      const response: AiResponse = {
        success: geminiResponse.success,
        response: geminiResponse.response,
        confidence: geminiResponse.confidence,
        processingTime,
        timestamp: new Date().toISOString(),
        sessionId,
        metadata: {
          model: geminiResponse.model,
          originalPrompt: request.prompt,
          enhancedPrompt
        }
      };

      this.logger.log(`AI query completed in ${processingTime}ms`);
      return response;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`AI query failed: ${error.message}`);

      return {
        success: false,
        response: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        confidence: 0,
        processingTime,
        timestamp: new Date().toISOString(),
        sessionId,
        metadata: { error: error.message }
      };
    }
  }

  async analyzeCode(code: string, language: string = 'javascript'): Promise<AiResponse> {
    const request: AiRequest = {
      prompt: `تحليل الكود التالي وتقديم تقييم شامل:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nيرجى تقديم:\n1. تقييم جودة الكود\n2. نقاط القوة والضعف\n3. اقتراحات للتحسين\n4. مشاكل الأمان المحتملة`,
      context: 'code_analysis',
      tools: ['code_analyzer']
    };

    return this.processQuery(request);
  }

  async generateJSON(prompt: string, schema?: any): Promise<AiResponse> {
    const enhancedPrompt = `${prompt}\n\nيرجى الرد بصيغة JSON صحيحة فقط. ${schema ? `اتبع هذا المخطط: ${JSON.stringify(schema)}` : ''}`;
    
    const request: AiRequest = {
      prompt: enhancedPrompt,
      context: 'json_generation',
      tools: ['json_formatter']
    };

    const response = await this.processQuery(request);
    
    if (response.success) {
      try {
        JSON.parse(response.response);
      } catch (error) {
        this.logger.warn('Generated response is not valid JSON');
        response.metadata = { ...response.metadata, jsonValid: false };
      }
    }

    return response;
  }

  private buildContext(request: AiRequest): string {
    let context = request.prompt;

    // Add system context
    if (request.context) {
      context = `السياق: ${request.context}\n\nالطلب: ${context}`;
    }

    // Add user context if available
    if (request.userId) {
      context = `معرف المستخدم: ${request.userId}\n${context}`;
    }

    // Add tools context
    if (request.tools && request.tools.length > 0) {
      context = `الأدوات المتاحة: ${request.tools.join(', ')}\n${context}`;
    }

    return context;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.geminiClient.healthCheck();
      return response;
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      return false;
    }
  }
}