export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  value: number;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  score: number;
  stage: LeadStage;
  expectedValue?: number;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent?: number;
  roi?: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROSPECT = 'PROSPECT',
  CHURNED = 'CHURNED'
}

export enum LeadStage {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export enum CampaignType {
  EMAIL = 'EMAIL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  PAID_ADS = 'PAID_ADS',
  CONTENT_MARKETING = 'CONTENT_MARKETING',
  WEBINAR = 'WEBINAR',
  EVENT = 'EVENT'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}