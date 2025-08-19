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

export interface Customer360Data {
  odoo: {
    id: number;
    name: string;
    email: string;
    phone: string;
    stage: string;
    opportunities: Opportunity[];
    activities: Activity[];
    expected_revenue: number;
  };
  meta: {
    source_campaign: string;
    ad_id: string;
    roas: number;
    cost_per_lead: number;
    interactions: Interaction[];
  };
  analytics: {
    lead_score: number;
    temperature: 'Hot' | 'Warm' | 'Cold';
    last_interaction: string;
    conversion_probability: number;
  };
}

export interface Opportunity {
  id: string;
  name: string;
  stage: string;
  expected_revenue: number;
  probability: number;
  close_date: string;
}

export interface Activity {
  id: string;
  type: string;
  date: string;
  summary: string;
  user: string;
}

export interface Interaction {
  id: string;
  type: string;
  platform: string;
  timestamp: string;
  details: any;
}

export interface CRMStats {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  totalLeads: number;
  conversionRate: number;
  avgDealSize: number;
}