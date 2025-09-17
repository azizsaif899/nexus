// 🎯 أنواع البيانات الأساسية لـ Nexus.AI

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  lastActiveAt: Date;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager', 
  AGENT = 'agent',
  USER = 'user'
}

export enum Permission {
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_ANALYTICS = 'view_analytics',
  
  // CRM permissions
  MANAGE_CUSTOMERS = 'manage_customers',
  MANAGE_LEADS = 'manage_leads',
  VIEW_SALES = 'view_sales',
  
  // Chatbot permissions
  MANAGE_CHATBOT = 'manage_chatbot',
  VIEW_CONVERSATIONS = 'view_conversations',
  
  // Automation permissions
  MANAGE_AUTOMATION = 'manage_automation',
  CREATE_WORKFLOWS = 'create_workflows'
}

export interface Module {
  id: ModuleId;
  label: string;
  labelAr: string;
  icon: string;
  color: string;
  path: string;
  permissions: Permission[];
  isActive: boolean;
}

export enum ModuleId {
  DASHBOARD = 'dashboard',
  ADMIN = 'admin',
  CRM = 'crm', 
  CHATBOT = 'chatbot',
  ANALYTICS = 'analytics',
  AUTOMATION = 'automation'
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: CustomerStatus;
  tags: string[];
  value: number;
  lastContact?: Date;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
  CONVERTED = 'converted'
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  stage: LeadStage;
  score: number;
  expectedRevenue: number;
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadSource {
  WEBSITE = 'website',
  SOCIAL_MEDIA = 'social_media',
  EMAIL = 'email',
  REFERRAL = 'referral',
  COLD_CALL = 'cold_call',
  EVENT = 'event',
  OTHER = 'other'
}

export enum LeadStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export interface ChatSession {
  id: string;
  userId: string;
  agentType: AgentType;
  title?: string;
  status: ChatStatus;
  messagesCount: number;
  lastMessage?: string;
  lastActivity: Date;
  createdAt: Date;
}

export enum AgentType {
  SUPPORT = 'support',
  SALES = 'sales',
  GENERAL = 'general',
  TECHNICAL = 'technical'
}

export enum ChatStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  PENDING = 'pending',
  ARCHIVED = 'archived'
}

export interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface Analytics {
  period: AnalyticsPeriod;
  data: {
    users: {
      total: number;
      active: number;
      new: number;
    };
    customers: {
      total: number;
      active: number;
      converted: number;
    };
    leads: {
      total: number;
      qualified: number;
      converted: number;
      conversionRate: number;
    };
    chatbot: {
      sessions: number;
      messages: number;
      satisfaction: number;
    };
  };
}

export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week', 
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTrigger {
  type: TriggerType;
  conditions: Record<string, any>;
}

export enum TriggerType {
  LEAD_CREATED = 'lead_created',
  CUSTOMER_UPDATED = 'customer_updated',
  CHAT_RESOLVED = 'chat_resolved',
  SCHEDULE = 'schedule',
  MANUAL = 'manual'
}

export interface WorkflowAction {
  type: ActionType;
  parameters: Record<string, any>;
  order: number;
}

export enum ActionType {
  SEND_EMAIL = 'send_email',
  CREATE_TASK = 'create_task',
  UPDATE_RECORD = 'update_record',
  NOTIFY_USER = 'notify_user',
  WEBHOOK = 'webhook'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Theme and UI Types
export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';
export type Direction = 'ltr' | 'rtl';

export interface AppState {
  user: User | null;
  currentModule: ModuleId;
  theme: Theme;
  language: Language;
  isLoading: boolean;
  error: string | null;
}