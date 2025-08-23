import { Customer, Lead } from '../types/crm.types';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return '#10B981';
    case 'pending': return '#F59E0B';
    case 'inactive': return '#EF4444';
    default: return '#6B7280';
  }
};

export const getStageColor = (stage: string): string => {
  switch (stage) {
    case 'new': return '#3B82F6';
    case 'qualified': return '#10B981';
    case 'proposal': return '#F59E0B';
    case 'negotiation': return '#8B5CF6';
    case 'closed': return '#059669';
    default: return '#6B7280';
  }
};

export const getTemperatureColor = (temp: string): string => {
  switch (temp) {
    case 'Hot': return '#ff4444';
    case 'Warm': return '#ff9800';
    case 'Cold': return '#2196f3';
    default: return '#666';
  }
};

export const calculateLeadScore = (lead: Lead): number => {
  let score = 0;
  
  // Source scoring
  const sourceScores = {
    'Website': 20,
    'LinkedIn': 25,
    'Referral': 30,
    'Cold Call': 10,
    'Email': 15
  };
  
  score += sourceScores[lead.source as keyof typeof sourceScores] || 0;
  
  // Stage scoring
  const stageScores = {
    'new': 10,
    'qualified': 30,
    'proposal': 50,
    'negotiation': 70,
    'closed': 100
  };
  
  score += stageScores[lead.stage];
  
  // Expected value scoring
  if (lead.expectedValue) {
    if (lead.expectedValue > 50000) score += 20;
    else if (lead.expectedValue > 20000) score += 15;
    else if (lead.expectedValue > 10000) score += 10;
    else score += 5;
  }
  
  return Math.min(score, 100);
};

export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency === 'SAR' ? 'SAR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const calculateConversionRate = (leads: number, customers: number): number => {
  if (leads === 0) return 0;
  return Math.round((customers / leads) * 100);
};

export const getLeadPriority = (lead: Lead): 'high' | 'medium' | 'low' => {
  const score = calculateLeadScore(lead);
  
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export const filterCustomersByStatus = (customers: Customer[], status: Customer['status']): Customer[] => {
  return customers.filter(customer => customer.status === status);
};

export const sortCustomersByValue = (customers: Customer[], ascending: boolean = false): Customer[] => {
  return [...customers].sort((a, b) => {
    return ascending ? a.value - b.value : b.value - a.value;
  });
};

export const searchCustomers = (customers: Customer[], query: string): Customer[] => {
  const lowercaseQuery = query.toLowerCase();
  return customers.filter(customer => 
    customer.name.toLowerCase().includes(lowercaseQuery) ||
    customer.email.toLowerCase().includes(lowercaseQuery) ||
    customer.phone.includes(query)
  );
};

export const getCustomerLifetimeValue = (customer: Customer): number => {
  // Simple CLV calculation - can be enhanced with more sophisticated algorithms
  return customer.value * 1.5; // Assuming 50% growth over lifetime
};

export const generateCustomerInsights = (customer: Customer): string[] => {
  const insights: string[] = [];
  
  if (customer.status === 'active' && customer.value > 20000) {
    insights.push('عميل عالي القيمة - يستحق اهتماماً خاصاً');
  }
  
  if (customer.status === 'pending') {
    insights.push('يحتاج متابعة عاجلة لتحويله إلى عميل نشط');
  }
  
  const daysSinceContact = Math.floor(
    (Date.now() - new Date(customer.lastContact).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceContact > 30) {
    insights.push('لم يتم التواصل معه منذ أكثر من شهر');
  }
  
  return insights;
};