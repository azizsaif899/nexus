import { Injectable } from '@nestjs/common';
import { GeminiService } from '../ai/gemini.service';

@Injectable()
export class StreamingService {
  constructor(private readonly geminiService: GeminiService) {}

  async *streamMessage(message: string, sessionId: string, userId: string) {
    try {
      // Get conversation context
      const context = await this.getConversationContext(sessionId);
      
      // Generate streaming response from Gemini
      const stream = await this.geminiService.generateStreamResponse(message, context);
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        
        yield {
          type: 'chunk',
          data: chunkText,
          sessionId,
          timestamp: new Date().toISOString()
        };
      }
      
      // Send completion signal
      yield {
        type: 'complete',
        data: fullResponse,
        sessionId,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      yield {
        type: 'error',
        data: error.message,
        sessionId,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async getConversationContext(sessionId: string): Promise<string[]> {
    // TODO: Implement context retrieval from database
    return [];
  }
}