'use client';

import { useQuery } from '@tanstack/react-query';
import { CustomerInsights } from '../types/customer';

export function useCustomerInsights(customerId: string) {
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['customer-insights', customerId],
    queryFn: async (): Promise<CustomerInsights> => {
      // Mock data - replace with actual AI analysis
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        personality: {
          type: 'analytical',
          traits: ['دقيق', 'منهجي', 'يركز على التفاصيل', 'يحب البيانات'],
          communicationStyle: 'مباشر ومختصر، يفضل الحقائق والأرقام',
          decisionMaking: 'يتخذ قرارات مدروسة بناءً على التحليل'
        },
        personalityRecommendations: [
          'استخدم الأرقام والإحصائيات في عروضك',
          'قدم تفاصيل تقنية واضحة ومفصلة',
          'تجنب العبارات العاطفية والتركيز على الفوائد العملية',
          'اعرض دراسات حالة مع نتائج قابلة للقياس'
        ],
        engagementScore: 85,
        engagementTrend: 'up',
        engagementFactors: [
          'يفتح الرسائل بسرعة (متوسط 2 ساعة)',
          'يرد على 92% من الرسائل',
          'يحضر جميع الاجتماعات المجدولة',
          'يطرح أسئلة تقنية مفصلة'
        ],
        similarDeals: [
          {
            id: '1',
            customerName: 'شركة التقنية المتقدمة',
            similarity: 89,
            outcome: 'won',
            value: 180000,
            duration: 45
          },
          {
            id: '2',
            customerName: 'مؤسسة الحلول الذكية',
            similarity: 76,
            outcome: 'won',
            value: 120000,
            duration: 38
          }
        ],
        successProbability: 78,
        patternRecommendations: [
          'العملاء المشابهون استجابوا بشكل إيجابي لدراسة حالة القطاع التقني',
          'متوسط دورة المبيعات للعملاء المشابهين 42 يوم',
          'العرض التقديمي التفاعلي زاد معدل الإغلاق بنسبة 35%'
        ],
        aiAnalysis: 'العميل يظهر اهتماماً قوياً ومستمراً. نمط التفاعل يشير إلى احتمالية عالية للإغلاق. يُنصح بالتركيز على الجوانب التقنية والعائد على الاستثمار.',
        predictions: [
          {
            type: 'revenue',
            probability: 78,
            value: 150000,
            timeframe: '30-45 يوم',
            confidence: 85
          },
          {
            type: 'upsell',
            probability: 45,
            value: 50000,
            timeframe: '6 أشهر',
            confidence: 70
          }
        ]
      };
    },
    enabled: !!customerId,
  });

  return {
    insights,
    isLoading,
    error
  };
}