'use client';

import { useQuery } from '@tanstack/react-query';
import { AISuggestion } from '../types/kanban';

export function useAISuggestions(dealId: string) {
  const { data: suggestions = [], isLoading, error } = useQuery({
    queryKey: ['ai-suggestions', dealId],
    queryFn: async (): Promise<AISuggestion[]> => {
      // Mock AI suggestions - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          dealId,
          type: 'next_action',
          title: 'إرسال دراسة حالة',
          description: 'هذا العميل يشبه "شركة النجاح" التي أغلقناها الشهر الماضي. أرسل دراسة الحالة الخاصة بالقطاع المالي.',
          confidence: 0.85,
          actionable: true,
          actions: [
            {
              id: 'send-case-study',
              label: 'إرسال دراسة الحالة',
              type: 'email',
              data: { template: 'financial-case-study' }
            }
          ]
        },
        {
          id: '2',
          dealId,
          type: 'risk_alert',
          title: 'تنبيه: عدم تفاعل',
          description: 'لم يتم التواصل مع هذا العميل منذ 5 أيام. قد تكون الصفقة في خطر.',
          confidence: 0.72,
          actionable: true,
          actions: [
            {
              id: 'schedule-call',
              label: 'جدولة مكالمة',
              type: 'call',
              data: { priority: 'high' }
            },
            {
              id: 'send-followup',
              label: 'إرسال متابعة',
              type: 'email',
              data: { template: 'follow-up' }
            }
          ]
        }
      ];
      
      return mockSuggestions;
    },
    enabled: !!dealId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    suggestions,
    isLoading,
    error
  };
}