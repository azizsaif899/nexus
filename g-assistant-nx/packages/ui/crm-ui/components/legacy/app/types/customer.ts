export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  region: string;
  status: 'active' | 'inactive' | 'prospect';
  createdAt: string;
  engagementScore: number;
  totalDeals?: number;
  totalValue?: number;
  lastContactDays?: number;
  responseRate?: number;
  activeDeals?: Deal[];
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
}

export interface TimelineActivity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'whatsapp' | 'deal' | 'note';
  title: string;
  description: string;
  timestamp: string;
  userName: string;
  userId: string;
  source?: string;
  metadata?: {
    duration?: string;
    value?: number;
    status?: string;
    attachments?: string[];
  };
}

export interface CustomerInsights {
  personality?: {
    type: string;
    traits: string[];
    communicationStyle: string;
    decisionMaking: string;
  };
  personalityRecommendations?: string[];
  engagementScore?: number;
  engagementTrend?: 'up' | 'down' | 'stable';
  engagementFactors?: string[];
  similarDeals?: SimilarDeal[];
  successProbability?: number;
  patternRecommendations?: string[];
  aiAnalysis?: string;
  predictions?: Prediction[];
}

export interface SimilarDeal {
  id: string;
  customerName: string;
  similarity: number;
  outcome: 'won' | 'lost';
  value: number;
  duration: number;
}

export interface Prediction {
  type: 'revenue' | 'churn' | 'upsell';
  probability: number;
  value?: number;
  timeframe: string;
  confidence: number;
}