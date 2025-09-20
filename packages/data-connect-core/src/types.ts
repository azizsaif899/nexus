// Base types for Data Connect operations
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastActiveAt?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  agentType: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAgent?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}