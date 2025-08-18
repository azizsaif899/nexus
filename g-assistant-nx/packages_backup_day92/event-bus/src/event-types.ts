export interface BaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  userId?: string;
  source: string;
}

export interface DealUpdatedEvent extends BaseEvent {
  type: 'deal.updated';
  dealId: string;
  changes: Record<string, any>;
  previousStage?: string;
  newStage?: string;
}

export interface CustomerCreatedEvent extends BaseEvent {
  type: 'customer.created';
  customerId: string;
  customerData: {
    name: string;
    email: string;
    company: string;
  };
}

export interface SystemHealthEvent extends BaseEvent {
  type: 'system.health';
  metrics: {
    cpu: number;
    memory: number;
    activeUsers: number;
    responseTime: number;
  };
}

export interface NotificationEvent extends BaseEvent {
  type: 'notification.new';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetUsers?: string[];
}

export type DomainEvent = 
  | DealUpdatedEvent 
  | CustomerCreatedEvent 
  | SystemHealthEvent 
  | NotificationEvent;