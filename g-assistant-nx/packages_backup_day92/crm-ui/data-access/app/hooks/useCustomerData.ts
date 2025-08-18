'use client';

import { useQuery } from '@tanstack/react-query';
import { Customer } from '../types/customer';

export function useCustomerData(customerId: string) {
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async (): Promise<Customer> => {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: customerId,
        name: 'أحمد محمد العلي',
        company: 'شركة النور للتقنية',
        email: 'ahmed@alnoor-tech.com',
        phone: '+966501234567',
        region: 'الرياض',
        status: 'active',
        createdAt: '2024-01-15',
        engagementScore: 85,
        totalDeals: 3,
        totalValue: 450000,
        lastContactDays: 2,
        responseRate: 92,
        activeDeals: [
          {
            id: '1',
            title: 'نظام إدارة المخزون',
            value: 150000,
            stage: 'proposal'
          },
          {
            id: '2',
            title: 'تطبيق الجوال',
            value: 85000,
            stage: 'negotiation'
          }
        ]
      };
    },
    enabled: !!customerId,
  });

  return {
    customer,
    isLoading,
    error
  };
}