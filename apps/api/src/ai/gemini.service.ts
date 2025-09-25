import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async generateResponse(message: string, context?: string[]): Promise<string> {
    try {
      const prompt = context 
        ? `Context: ${context.join('\n')}\nUser: ${message}`
        : message;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateStreamResponse(message: string, context?: string[]) {
    try {
      const prompt = context 
        ? `Context: ${context.join('\n')}\nUser: ${message}`
        : message;

      const result = await this.model.generateContentStream(prompt);
      return result.stream;
    } catch (error) {
      console.error('Gemini AI Stream Error:', error);
      throw new Error('Failed to generate AI stream response');
    }
  }
}