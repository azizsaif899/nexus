export interface Customer360Data {
  customer: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    region: string;
    status: 'active' | 'inactive' | 'prospect';
    createdAt: string;
    engagementScore: number;
    totalDeals: number;
    totalValue: number;
    lastContactDays: number;
    responseRate: number;
  };
  activeDeals: Array<{
    id: string;
    title: string;
    value: number;
    stage: 'proposal' | 'negotiation' | 'closed' | 'lost';
  }>;
  interactions: Array<{
    id: string;
    type: 'call' | 'email' | 'meeting' | 'note';
    date: string;
    details: InteractionDetails;
  }>;
}

export interface InteractionDetails {
  call?: {
    duration: number;
    outcome: string;
  };
  email?: {
    subject: string;
    opened: boolean;
  };
  meeting?: {
    location: string;
    attendees: string[];
  };
  note?: {
    content: string;
    priority: 'low' | 'medium' | 'high';
  };
}

export type SupportedCurrency = 'SAR' | 'USD';

export function formatCurrency(amount: number, currency: SupportedCurrency = 'SAR'): string {
  const formatters = {
    SAR: new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  };
  
  return formatters[currency].format(amount);
}