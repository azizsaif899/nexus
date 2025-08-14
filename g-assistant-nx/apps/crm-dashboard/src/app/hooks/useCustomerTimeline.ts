'use client';

import { useQuery } from '@tanstack/react-query';
import { TimelineActivity } from '../types/customer';

export function useCustomerTimeline(customerId: string, filter: string = 'all') {
  const { data: timeline = [], isLoading, error } = useQuery({
    queryKey: ['customer-timeline', customerId, filter],
    queryFn: async (): Promise<TimelineActivity[]> => {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockTimeline: TimelineActivity[] = [
        {
          id: '1',
          type: 'email',
          title: 'إرسال عرض سعر مفصل',
          description: 'تم إرسال عرض سعر شامل لنظام إدارة المخزون مع جميع المواصفات والأسعار المطلوبة.',
          timestamp: '2024-01-10T10:30:00Z',
          userName: 'سارة أحمد',
          userId: 'user1',
          source: 'Gmail',
          metadata: {
            attachments: ['عرض_سعر_المخزون.pdf']
          }
        },
        {
          id: '2',
          type: 'call',
          title: 'مكالمة متابعة العرض',
          description: 'مناقشة تفاصيل العرض والإجابة على استفسارات العميل حول المواصفات التقنية.',
          timestamp: '2024-01-09T14:15:00Z',
          userName: 'خالد محمد',
          userId: 'user2',
          source: 'Phone System',
          metadata: {
            duration: '25 دقيقة',
            status: 'مكتملة'
          }
        },
        {
          id: '3',
          type: 'meeting',
          title: 'اجتماع عرض المنتج',
          description: 'عرض تقديمي شامل للمنتج مع فريق العميل لشرح الميزات والفوائد.',
          timestamp: '2024-01-08T11:00:00Z',
          userName: 'محمد علي',
          userId: 'user3',
          source: 'Google Meet',
          metadata: {
            duration: '1.5 ساعة',
            status: 'مكتملة'
          }
        },
        {
          id: '4',
          type: 'whatsapp',
          title: 'تأكيد موعد الاجتماع',
          description: 'تأكيد موعد اجتماع عرض المنتج وإرسال رابط الاجتماع.',
          timestamp: '2024-01-07T16:45:00Z',
          userName: 'سارة أحمد',
          userId: 'user1',
          source: 'WhatsApp Business'
        },
        {
          id: '5',
          type: 'deal',
          title: 'إنشاء فرصة بيع جديدة',
          description: 'تم إنشاء فرصة بيع جديدة لنظام إدارة المخزون بقيمة 150,000 ريال.',
          timestamp: '2024-01-05T09:20:00Z',
          userName: 'أحمد سالم',
          userId: 'user4',
          source: 'CRM System',
          metadata: {
            value: 150000,
            status: 'نشطة'
          }
        }
      ];

      // Filter timeline based on selected filter
      if (filter === 'all') {
        return mockTimeline;
      }
      
      return mockTimeline.filter(item => item.type === filter);
    },
    enabled: !!customerId,
  });

  return {
    timeline,
    isLoading,
    error
  };
}