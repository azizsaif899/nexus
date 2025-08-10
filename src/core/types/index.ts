// Core Types for G-Assistant Auto-Fix System
export interface TaskRequest {
  id: string;
  type: 'fix' | 'review' | 'test' | 'deploy';
  priority: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  patch?: string;
  description: string;
  assignedTo: 'executor' | 'reviewer' | 'orchestrator';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'needs_clarification';
  createdAt: string;
  updatedAt: string;
  backupPath?: string;
  metadata?: Record<string, any>;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  message: string;
  changes: FileChange[];
  metrics: TaskMetrics;
  errors?: string[];
  warnings?: string[];
}

export interface FileChange {
  file: string;
  action: 'created' | 'modified' | 'deleted';
  linesChanged: number;
  backupPath?: string;
}

export interface TaskMetrics {
  executionTime: number;
  linesOfCode: number;
  complexity: number;
  testCoverage?: number;
  securityScore?: number;
}

export interface ErrorInfo {
  file: string;
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule?: string;
  fixable: boolean;
}

export interface Plugin {
  name: string;
  version: string;
  enabled: boolean;
  config: Record<string, any>;
  hooks: {
    beforeTask?: (task: TaskRequest) => Promise<void>;
    afterTask?: (task: TaskRequest, result: TaskResult) => Promise<void>;
    onError?: (error: Error, task: TaskRequest) => Promise<void>;
  };
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  lastUpdate: string;
  metrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageExecutionTime: number;
    errorRate: number;
  };
}

export interface AppConfig {
  gemini: {
    apiKey: string;
    model: string;
    timeout: number;
  };
  paths: {
    repoRoot: string;
    dashboardPath: string;
    backupDir: string;
    logsDir: string;
  };
  notifications: {
    slack?: {
      webhook: string;
      channel: string;
    };
    teams?: {
      webhook: string;
    };
  };
  scheduler: {
    interval: string;
    timezone: string;
  };
  plugins: {
    enabled: string[];
    config: Record<string, any>;
  };
}