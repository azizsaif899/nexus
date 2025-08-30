export interface Metric {
  id: string;
  name: string;
  type: MetricType;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  unit?: string;
  timestamp: string;
}

export interface DashboardData {
  totalCustomers: number;
  activeCustomers: number;
  totalLeads: number;
  qualifiedLeads: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageLeadScore: number;
}

export enum MetricType {
  REVENUE = 'REVENUE',
  LEADS = 'LEADS',
  CUSTOMERS = 'CUSTOMERS',
  CAMPAIGNS = 'CAMPAIGNS',
  CONVERSION_RATE = 'CONVERSION_RATE',
  ROI = 'ROI',
  ENGAGEMENT = 'ENGAGEMENT'
}

export enum TimeFrame {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR'
}