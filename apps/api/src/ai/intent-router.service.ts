import { Injectable } from '@nestjs/common';
import { GeminiClient } from '../mocks/core-logic.mock';

export interface QueryIntent {
  type: 'general' | 'technical' | 'financial' | 'research' | 'analysis' | 'translation';
  confidence: number;
  parameters?: Record<string, any>;
  suggestedAgent?: string;
  suggestedMode?: string;
}

export interface RoutingResult {
  intent: QueryIntent;
  route: {
    service: string;
    endpoint: string;
    agent?: string;
    mode?: string;
  };
  preprocessing?: {
    cleanedQuery: string;
    extractedEntities: any[];
  };
}

@Injectable()
export class IntentRouterService {
  private geminiClient: GeminiClient;

  constructor() {
    this.geminiClient = new GeminiClient({
      apiKey: process.env.GEMINI_API_KEY || '',
      temperature: 0.3
    });
  }

  async routeQuery(query: string, context?: string): Promise<RoutingResult> {
    const intent = await this.detectIntent(query);
    const route = this.determineRoute(intent);
    const preprocessing = await this.preprocessQuery(query);

    return {
      intent,
      route,
      preprocessing
    };
  }

  private async detectIntent(query: string): Promise<QueryIntent> {
    // Rule-based intent detection for common patterns
    const ruleBasedIntent = this.detectIntentByRules(query);
    if (ruleBasedIntent.confidence > 0.8) {
      return ruleBasedIntent;
    }

    // AI-powered intent detection for complex queries
    try {
      const prompt = `حدد نوع الاستعلام التالي واختر من الأنواع: general, technical, financial, research, analysis, translation

الاستعلام: "${query}"

أجب بصيغة JSON:
{
  "type": "نوع الاستعلام",
  "confidence": رقم من 0 إلى 1,
  "reasoning": "سبب الاختيار"
}`;

      const response = await this.geminiClient.generateResponse(prompt);
      const aiResult = JSON.parse(response.text);
      
      return {
        type: aiResult.type,
        confidence: aiResult.confidence,
        suggestedAgent: this.mapTypeToAgent(aiResult.type),
        suggestedMode: this.mapTypeToMode(aiResult.type)
      };
    } catch (error) {
      console.error('AI intent detection failed:', error);
      return ruleBasedIntent;
    }
  }

  private detectIntentByRules(query: string): QueryIntent {
    const patterns = {
      technical: [
        /برمجة|كود|تطوير|API|قاعدة بيانات|خطأ|bug/i,
        /تطبيق|موقع|سيرفر|استضافة/i
      ],
      financial: [
        /مالي|ميزانية|تكلفة|سعر|ربح|خسارة/i,
        /فاتورة|دفع|استثمار|عائد/i
      ],
      research: [
        /بحث|ابحث|معلومات|دراسة|تقرير/i,
        /مصادر|مراجع|أبحاث/i
      ],
      analysis: [
        /تحليل|احلل|إحصائيات|بيانات/i,
        /مقارنة|تقييم|دراسة/i
      ],
      translation: [
        /ترجم|ترجمة|translate|باللغة/i
      ]
    };

    for (const [type, regexes] of Object.entries(patterns)) {
      for (const regex of regexes) {
        if (regex.test(query)) {
          return {
            type: type as any,
            confidence: 0.9,
            suggestedAgent: this.mapTypeToAgent(type),
            suggestedMode: this.mapTypeToMode(type)
          };
        }
      }
    }

    return {
      type: 'general',
      confidence: 0.5,
      suggestedAgent: 'general',
      suggestedMode: 'smart'
    };
  }

  private determineRoute(intent: QueryIntent): RoutingResult['route'] {
    const routes = {
      general: {
        service: 'sidebar',
        endpoint: '/api/v2/sidebar/query',
        agent: intent.suggestedAgent || 'general',
        mode: intent.suggestedMode || 'smart'
      },
      technical: {
        service: 'sidebar',
        endpoint: '/api/v2/sidebar/query',
        agent: 'developer',
        mode: 'analysis'
      },
      financial: {
        service: 'sidebar',
        endpoint: '/api/v2/sidebar/query',
        agent: 'cfo',
        mode: 'analysis'
      },
      research: {
        service: 'research',
        endpoint: '/api/v2/research/start',
        agent: 'general',
        mode: 'smart'
      },
      analysis: {
        service: 'sidebar',
        endpoint: '/api/v2/sidebar/query',
        agent: 'operations',
        mode: 'analysis'
      },
      translation: {
        service: 'ai',
        endpoint: '/api/v2/ai/translate',
        agent: 'general',
        mode: 'smart'
      }
    };

    return routes[intent.type] || routes.general;
  }

  private async preprocessQuery(query: string): Promise<RoutingResult['preprocessing']> {
    // Clean query
    const cleanedQuery = query
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u0600-\u06FF]/g, '');

    // Extract entities (simplified)
    const entities = [];
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const urlRegex = /https?:\/\/[^\s]+/g;
    const numberRegex = /\d+/g;

    const emails = query.match(emailRegex) || [];
    const urls = query.match(urlRegex) || [];
    const numbers = query.match(numberRegex) || [];

    if (emails.length) entities.push({ type: 'email', values: emails });
    if (urls.length) entities.push({ type: 'url', values: urls });
    if (numbers.length) entities.push({ type: 'number', values: numbers });

    return {
      cleanedQuery,
      extractedEntities: entities
    };
  }

  private mapTypeToAgent(type: string): string {
    const mapping = {
      technical: 'developer',
      financial: 'cfo',
      research: 'general',
      analysis: 'operations',
      translation: 'general',
      general: 'general'
    };
    return mapping[type] || 'general';
  }

  private mapTypeToMode(type: string): string {
    const mapping = {
      technical: 'analysis',
      financial: 'analysis',
      research: 'smart',
      analysis: 'analysis',
      translation: 'smart',
      general: 'smart'
    };
    return mapping[type] || 'smart';
  }

  getStats(): any {
    return {
      totalQueries: 0, // Would be tracked in real implementation
      intentDistribution: {
        general: 45,
        technical: 25,
        financial: 15,
        research: 10,
        analysis: 3,
        translation: 2
      },
      averageConfidence: 0.85
    };
  }
}
