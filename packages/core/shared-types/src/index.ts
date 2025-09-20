export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  stack?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventType = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  level: EventType;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}