import { GoogleGenerativeAI } from '@google/generative-ai';

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
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: config.model || 'gemini-pro',
      generationConfig: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxTokens || 1000,
      }
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
}