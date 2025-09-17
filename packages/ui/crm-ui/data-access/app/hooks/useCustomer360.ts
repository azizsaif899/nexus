'use client';

import { useState, useEffect } from 'react';
import { Customer360Data } from '../types/customer360';

export function useCustomer360(customerId: string) {
  const [data, setData] = useState<Customer360Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomer360 = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Mock API call - replace with actual service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: Customer360Data = {
          customer: {
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
            responseRate: 92
          },
          activeDeals: [
            {
              id: '1',
              title: 'نظام إدارة المخزون',
              value: 150000,
              stage: 'proposal'
            }
          ],
          interactions: [
            {
              id: '1',
              type: 'call',
              date: '2024-01-08',
              details: {
                call: {
                  duration: 30,
                  outcome: 'مهتم بالمنتج'
                }
              }
            }
          ]
        };
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer360();
  }, [customerId]);

  return { data, loading, error };
}