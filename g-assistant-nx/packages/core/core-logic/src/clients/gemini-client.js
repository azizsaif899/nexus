"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiClient = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiClient {
    constructor(config) {
        this.config = config;
        this.genAI = new generative_ai_1.GoogleGenerativeAI(config.apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: config.model || 'gemini-pro',
            generationConfig: {
                temperature: config.temperature || 0.7,
                maxOutputTokens: config.maxTokens || 1000,
            }
        });
    }
    async generateResponse(prompt, context, media) {
        try {
            let input;
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
            }
            else {
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
        }
        catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`فشل في الحصول على استجابة من Gemini: ${error.message}`);
        }
    }
    async analyzeDocument(text, analysisType) {
        const prompts = {
            summary: `لخص النص التالي باللغة العربية:\n\n${text}`,
            sentiment: `حلل المشاعر في النص التالي وأعط النتيجة (إيجابي/سلبي/محايد):\n\n${text}`,
            keywords: `استخرج الكلمات المفتاحية الأهم من النص التالي:\n\n${text}`
        };
        const response = await this.generateResponse(prompts[analysisType]);
        return response.text;
    }
    async translateText(text, targetLanguage) {
        const prompt = targetLanguage === 'ar'
            ? `ترجم النص التالي إلى العربية:\n\n${text}`
            : `Translate the following text to English:\n\n${text}`;
        const response = await this.generateResponse(prompt);
        return response.text;
    }
}
exports.GeminiClient = GeminiClient;
//# sourceMappingURL=gemini-client.js.map