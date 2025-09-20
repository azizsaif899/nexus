export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  customer: string;
  heatLevel: 'hot' | 'warm' | 'cold';
  lastActivity: string;
  nextAction: string;
  probability?: number;
  expectedCloseDate?: string;
  source?: string;
  tags?: string[];
}

export interface KanbanStage {
  id: string;
  title: string;
  color: string;
  order?: number;
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface AISuggestion {
  id: string;
  dealId: string;
  type: 'next_action' | 'risk_alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actions?: SuggestedAction[];
}

export interface SuggestedAction {
  id: string;
  label: string;
  type: 'email' | 'call' | 'meeting' | 'task';
  data?: any;
}