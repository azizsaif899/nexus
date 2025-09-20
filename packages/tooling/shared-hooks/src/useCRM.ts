import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JsonRpcClient } from '@azizsys/json-rpc-client';
import { CacheClient } from '@azizsys/cache-client';
import { CreateLeadRequest } from '@azizsys/shared-types';

const rpcClient = new JsonRpcClient({
  baseUrl: 'http://localhost:8070',
  database: 'azizsys_crm',
  username: 'admin',
  password: 'AzizSys2025!'
});

const cache = new CacheClient();

// CRM Data Hooks with caching
export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      return cache.cacheOdooCall(
        'leads:all',
        () => rpcClient.getLeads(),
        300 // 5 minutes cache
      );
    },
    refetchInterval: 30000,
  });
};

export const useActivities = (leadId?: number) => {
  return useQuery({
    queryKey: ['activities', leadId],
    queryFn: async () => {
      // Mock activities for now
      return { success: true, data: [] };
    },
    enabled: !!leadId,
    refetchInterval: 15000,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadData: CreateLeadRequest) => {
      const result = await rpcClient.createLead(leadData);
      // Clear cache on successful creation
      if (result.success) {
        await cache.del('leads:all');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      try {
        await rpcClient.authenticate();
        const cacheHealthy = await cache.exists('health:check');
        await cache.set('health:check', 'ok', 60);
        return {
          odoo: true,
          redis: true,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          odoo: false,
          redis: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },
    refetchInterval: 60000, // Check every minute
  });
};