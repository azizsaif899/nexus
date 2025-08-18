import { Injectable } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { AiCoreService } from '@azizsys/core/core-logic';

@Injectable()
export class QueryService {
  constructor(private readonly aiCoreService: AiCoreService) {}

  async processQuery(queryDto: QueryDto) {
    const { prompt, context, language } = queryDto;
    
    const aiResponse = await this.aiCoreService.processQuery({
      prompt,
      context: context || 'general',
      sessionId: `api_${Date.now()}`
    });
    
    return {
      success: aiResponse.success,
      query: prompt,
      response: aiResponse.response,
      timestamp: aiResponse.timestamp,
      processingTime: aiResponse.processingTime,
      confidence: aiResponse.confidence,
      context: context || 'general',
      sessionId: aiResponse.sessionId
    };
  }

  async analyzeData(data: any) {
    // Mock data analysis
    return {
      success: true,
      analysis: {
        dataPoints: Array.isArray(data) ? data.length : Object.keys(data).length,
        summary: 'تم تحليل البيانات بنجاح وتم استخراج الأنماط الرئيسية',
        insights: [
          'تم اكتشاف اتجاه إيجابي في البيانات',
          'هناك علاقة قوية بين المتغيرات الأساسية',
          'النتائج تشير إلى فرص تحسين واضحة'
        ],
        recommendations: [
          'ينصح بمراجعة البيانات الشاذة',
          'يمكن تحسين الأداء بنسبة 15-20%',
          'النظر في تطبيق نماذج تنبؤية متقدمة'
        ]
      },
      timestamp: new Date().toISOString()
    };
  }
}
