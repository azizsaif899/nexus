/**
 * React Query Configuration - إعداد React Query
 * للـ data fetching, caching, and synchronization
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create QueryClient with optimal settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Caching
      staleTime: 5 * 60 * 1000, // 5 minutes - البيانات تُعتبر fresh لمدة 5 دقائق
      gcTime: 10 * 60 * 1000, // 10 minutes - Cache garbage collection (كان cacheTime)
      
      // Retry
      retry: 3, // إعادة المحاولة 3 مرات عند الفشل
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch
      refetchOnWindowFocus: true, // Refetch عند العودة للـ tab
      refetchOnMount: true, // Refetch عند mount
      refetchOnReconnect: true, // Refetch عند العودة للإنترنت
      
      // Network
      networkMode: 'online', // فقط online
    },
    mutations: {
      // Retry for mutations
      retry: 1, // إعادة محاولة واحدة للـ mutations
      networkMode: 'online',
    },
  },
});

// Query Keys - مفاتيح الاستعلامات
export const queryKeys = {
  // Odoo Customers
  customers: {
    all: ['customers'] as const,
    list: (filters?: any) => ['customers', 'list', filters] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
    search: (query: string) => ['customers', 'search', query] as const,
  },
  
  // Odoo Connection
  odoo: {
    connection: ['odoo', 'connection'] as const,
    status: ['odoo', 'status'] as const,
  },
  
  // CRM Data
  crm: {
    deals: {
      all: ['crm', 'deals'] as const,
      pipeline: ['crm', 'deals', 'pipeline'] as const,
      stage: (stageId: string) => ['crm', 'deals', 'stage', stageId] as const,
    },
    tasks: {
      all: ['crm', 'tasks'] as const,
      filter: (status: string) => ['crm', 'tasks', 'filter', status] as const,
    },
    reports: {
      all: ['crm', 'reports'] as const,
      monthly: ['crm', 'reports', 'monthly'] as const,
      analytics: ['crm', 'reports', 'analytics'] as const,
    },
  },
} as const;

// Utility functions
export const invalidateCustomers = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
};

export const invalidateCustomer = (id: string) => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(id) });
};

export const invalidateCRMDeals = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.crm.deals.all });
};

export const invalidateCRMTasks = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.crm.tasks.all });
};

// Prefetch utilities
export const prefetchCustomers = async () => {
  // Will be implemented with actual API call
  return queryClient.prefetchQuery({
    queryKey: queryKeys.customers.all,
    queryFn: async () => {
      // API call here
      return [];
    },
  });
};

// React Query Provider Component
export { QueryClientProvider, ReactQueryDevtools };

/**
 * Usage Example:
 * 
 * import { QueryClientProvider } from './lib/react-query';
 * import { queryClient } from './lib/react-query';
 * 
 * <QueryClientProvider client={queryClient}>
 *   <App />
 *   <ReactQueryDevtools initialIsOpen={false} />
 * </QueryClientProvider>
 */
