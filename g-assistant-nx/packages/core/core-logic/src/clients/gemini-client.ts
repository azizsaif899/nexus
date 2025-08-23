import { getGenerativeModel } from '@firebase/ai';
import { getFirebaseApp } from '../config/firebase-config';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MediaInput {
  data: string; // base64 encoded
  mimeType: string;
  type: 'image' | 'audio' | 'video';
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class GeminiClient {
  private app = getFirebaseApp();
  private model: any;

  constructor(private config: GeminiConfig) {
    this.model = getGenerativeModel(this.app, {
      model: config.model || 'gemini-1.5-flash'
    });
  }

  async generateResponse(prompt: string, context?: string, media?: MediaInput[]): Promise<GeminiResponse> {
    try {
      let input: any;
      
      if (media && media.length > 0) {
        // Multimodal input
        input = [
          context ? `${context}\n\nUser: ${prompt}` : prompt,
          ...media.map(m => ({
            inlineData: {
              data: m.data,
              mimeType: m.mimeType
            }
          }))
        ];
      } else {
        // Text-only input
        input = context ? `${context}\n\nUser: ${prompt}` : prompt;
      }
      
      const result = await this.model.generateContent(input);
      const response = await result.response;
      
      return {
        text: response.text(),
        usage: {
          promptTokens: result.response?.usageMetadata?.promptTokenCount || 0,
          completionTokens: result.response?.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: result.response?.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`فشل في الحصول على استجابة من Gemini: ${error.message}`);
    }
  }

  async analyzeDocument(text: string, analysisType: 'summary' | 'sentiment' | 'keywords'): Promise<string> {
    const prompts = {
      summary: `لخص النص التالي باللغة العربية:\n\n${text}`,
      sentiment: `حلل المشاعر في النص التالي وأعط النتيجة (إيجابي/سلبي/محايد):\n\n${text}`,
      keywords: `استخرج الكلمات المفتاحية الأهم من النص التالي:\n\n${text}`
    };

    const response = await this.generateResponse(prompts[analysisType]);
    return response.text;
  }

  async translateText(text: string, targetLanguage: 'ar' | 'en'): Promise<string> {
    const prompt = targetLanguage === 'ar' 
      ? `ترجم النص التالي إلى العربية:\n\n${text}`
      : `Translate the following text to English:\n\n${text}`;
    
    const response = await this.generateResponse(prompt);
    return response.text;
  }

  // Missing methods for API
  async query(prompt: string): Promise<string> {
    const response = await this.generateResponse(prompt);
    return response.text;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.generateResponse('Hello');
      return true;
    } catch {
      return false;
    }
  }
}