import { useState, useEffect } from 'react';
import { CRMService } from '../services/crm.service';
import { Customer, Lead, Campaign, CRMStats } from '../types/crm.types';

const crmService = new CRMService();

export const useCRM = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await crmService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await crmService.getLeads();
      setLeads(data);
    } catch (err) {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await crmService.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await crmService.getCRMStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch stats');
    }
  };

  const createCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await crmService.createCustomer(customer);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError('Failed to create customer');
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await crmService.updateCustomer(id, updates);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      return updatedCustomer;
    } catch (err) {
      setError('Failed to update customer');
      throw err;
    }
  };

  const createLead = async (lead: Omit<Lead, 'id'>) => {
    try {
      const newLead = await crmService.createLead(lead);
      setLeads(prev => [...prev, newLead]);
      return newLead;
    } catch (err) {
      setError('Failed to create lead');
      throw err;
    }
  };

  const updateLeadStage = async (id: string, stage: Lead['stage']) => {
    try {
      const updatedLead = await crmService.updateLeadStage(id, stage);
      setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      return updatedLead;
    } catch (err) {
      setError('Failed to update lead stage');
      throw err;
    }
  };

  const syncWithMeta = async () => {
    try {
      setLoading(true);
      const result = await crmService.syncWithMeta();
      if (result.success) {
        setCampaigns(result.campaigns);
      }
      return result;
    } catch (err) {
      setError('Failed to sync with Meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    // Data
    customers,
    leads,
    campaigns,
    stats,
    loading,
    error,
    
    // Actions
    fetchCustomers,
    fetchLeads,
    fetchCampaigns,
    createCustomer,
    updateCustomer,
    createLead,
    updateLeadStage,
    syncWithMeta,
    
    // Utils
    clearError: () => setError(null)
  };
};

export const useCustomer360 = (customerId: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const customer360Data = await crmService.getCustomer360(customerId);
        setData(customer360Data);
      } catch (err) {
        setError('Failed to fetch customer 360 data');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchData();
    }
  }, [customerId]);

  return { data, loading, error };
};