export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  value: number;
  source?: string;
  assignedTo?: string;
  tags?: string[];
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  score: number;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  email?: string;
  phone?: string;
  company?: string;
  expectedValue?: number;
  probability?: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Facebook' | 'Google' | 'LinkedIn' | 'Twitter';
  status: 'Active' | 'Paused' | 'Completed';
  impressions: number;
  clicks: number;
  leads: number;
  cost: number;
  cpl: number;
  ctr: number;
  startDate: string;
  endDate?: string;
}

export interface CRMStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  totalLeads: number;
  conversionRate: number;
  avgDealSize: number;
}