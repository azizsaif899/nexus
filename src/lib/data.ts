import { User, Tenant, Campaign, Bot } from './types';

export const mockUsers: User[] = [
  { id: 'usr_1', name: 'Alice Johnson', email: 'alice@symphony.com', role: 'Admin', avatar: '/avatars/01.png', tenantId: 'tnt_1' },
  { id: 'usr_2', name: 'Bob Williams', email: 'bob@symphony.com', role: 'Manager', avatar: '/avatars/02.png', tenantId: 'tnt_1' },
  { id: 'usr_3', name: 'Charlie Brown', email: 'charlie@symphony.com', role: 'Viewer', avatar: '/avatars/03.png', tenantId: 'tnt_1' },
  { id: 'usr_4', name: 'Diana Prince', email: 'diana@innovate.co', role: 'Admin', avatar: '/avatars/04.png', tenantId: 'tnt_2' },
  { id: 'usr_5', name: 'Ethan Hunt', email: 'ethan@innovate.co', role: 'Manager', avatar: '/avatars/05.png', tenantId: 'tnt_2' },
];

export const mockTenants: Tenant[] = [
  { id: 'tnt_1', name: 'Symphony Inc.', plan: 'Enterprise', status: 'Active' },
  { id: 'tnt_2', name: 'Innovate Co.', plan: 'Pro', status: 'Active' },
  { id: 'tnt_3', name: 'Startup Hub', plan: 'Free', status: 'Inactive' },
];

export const mockCampaigns: Campaign[] = [
  { id: 'cmp_1', name: 'Summer Sale 2024', platform: 'Meta', status: 'Active', budget: 5000, spent: 2345, startDate: '2024-06-01', endDate: '2024-08-31' },
  { id: 'cmp_2', name: 'New Product Launch', platform: 'TikTok', status: 'Active', budget: 10000, spent: 8765, startDate: '2024-07-15', endDate: '2024-09-15' },
  { id: 'cmp_3', name: 'Brand Awareness Q3', platform: 'LinkedIn', status: 'Paused', budget: 7500, spent: 1200, startDate: '2024-07-01', endDate: '2024-09-30' },
  { id: 'cmp_4', name: 'Snapchat Story Ads', platform: 'Snapchat', status: 'Ended', budget: 3000, spent: 3000, startDate: '2024-05-01', endDate: '2024-05-31' },
  { id: 'cmp_5', name: 'Lead Gen Form', platform: 'WhatsApp', status: 'Active', budget: 2000, spent: 500, startDate: '2024-08-01', endDate: '2024-08-31' },
];

export const mockBots: Bot[] = [
  { id: 'bot_1', name: 'Welcome Bot', status: 'Active', interactions: 1024, createdAt: '2024-01-15' },
  { id: 'bot_2', name: 'Support Bot', status: 'Active', interactions: 5821, createdAt: '2024-03-01' },
  { id: 'bot_3', name: 'Sales Inquiry', status: 'Inactive', interactions: 450, createdAt: '2024-05-20' },
  { id: 'bot_4', name: 'Event Registration', status: 'Draft', interactions: 0, createdAt: '2024-07-28' },
];
