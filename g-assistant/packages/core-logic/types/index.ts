/**
 * تعريفات TypeScript المشتركة
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid';
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'assistant';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}