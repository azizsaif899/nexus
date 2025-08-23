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
  confidenceScore: number; // 0-100
  requiresHumanReview: boolean;
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
    averageConfidence?: number;
  };
}