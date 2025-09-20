import { Customer, Lead } from './types';

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

export const calculateLeadScore = (lead: Lead): number => {
  let score = 0;
  
  const sourceScores = {
    'Website': 20,
    'LinkedIn': 25,
    'Referral': 30,
    'Cold Call': 10,
    'Email': 15
  };
  
  score += sourceScores[lead.source as keyof typeof sourceScores] || 0;
  
  const stageScores = {
    'new': 10,
    'qualified': 30,
    'proposal': 50,
    'negotiation': 70,
    'closed': 100
  };
  
  score += stageScores[lead.stage];
  
  if (lead.expectedValue) {
    if (lead.expectedValue > 50000) score += 20;
    else if (lead.expectedValue > 20000) score += 15;
    else if (lead.expectedValue > 10000) score += 10;
    else score += 5;
  }
  
  return Math.min(score, 100);
};

export const calculateConversionRate = (leads: number, customers: number): number => {
  if (leads === 0) return 0;
  return Math.round((customers / leads) * 100);
};