export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  avatar: string;
  tenantId: string;
};

export type Tenant = {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Inactive';
};

export type Platform = 'Meta' | 'TikTok' | 'Snapchat' | 'LinkedIn' | 'WhatsApp';

export type Campaign = {
  id: string;
  name: string;
  platform: Platform;
  status: 'Active' | 'Paused' | 'Ended';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
};

export type Bot = {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Draft';
  interactions: number;
  createdAt: string;
};
