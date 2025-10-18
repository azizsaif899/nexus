/**
 * Visual Automation API Types
 * النماذج والأنواع الأساسية لنظام الأتمتة المرئية
 */

// === Core Types ===

export interface AutomationTask {
  id: string;
  name: string;
  type: AutomationTaskType;
  config: AutomationConfig;
  status: AutomationStatus;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt?: Date;
  executionCount?: number;
  successCount?: number;
  failureCount?: number;
  metadata?: Record<string, any>;
}

export type AutomationTaskType =
  | 'web-scraping'
  | 'form-filling'
  | 'data-extraction'
  | 'api-integration'
  | 'workflow'
  | 'scheduled-task'
  | 'trigger-based';

export type AutomationStatus =
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'scheduled';

export interface AutomationConfig {
  url?: string;
  selectors?: Record<string, string>;
  actions?: AutomationAction[];
  schedule?: string;
  triggers?: AutomationTrigger[];
  variables?: Record<string, any>;
  settings?: AutomationSettings;
}

export interface AutomationAction {
  id: string;
  type: ActionType;
  selector?: string;
  value?: string;
  delay?: number;
  condition?: string;
  onSuccess?: string;
  onError?: string;
  retry?: RetryConfig;
}

export type ActionType =
  | 'click'
  | 'type'
  | 'wait'
  | 'extract'
  | 'navigate'
  | 'scroll'
  | 'screenshot'
  | 'api-call'
  | 'transform'
  | 'condition'
  | 'loop';

export interface AutomationTrigger {
  id: string;
  type: TriggerType;
  config: Record<string, any>;
  enabled: boolean;
}

export type TriggerType =
  | 'webhook'
  | 'schedule'
  | 'email'
  | 'api'
  | 'manual'
  | 'event';

export interface AutomationSettings {
  timeout?: number;
  maxRetries?: number;
  parallel?: boolean;
  notifications?: NotificationSettings;
  logging?: LoggingSettings;
}

export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
}

export interface NotificationSettings {
  onSuccess?: boolean;
  onFailure?: boolean;
  channels?: ('email' | 'webhook' | 'slack')[];
}

export interface LoggingSettings {
  level: 'debug' | 'info' | 'warn' | 'error';
  includeData?: boolean;
}

// === Execution Types ===

export interface AutomationExecution {
  id: string;
  taskId: string;
  status: AutomationStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  steps: ExecutionStep[];
  result?: any;
  error?: ExecutionError;
  metadata?: Record<string, any>;
}

export interface ExecutionStep {
  id: string;
  actionId: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface ExecutionError {
  message: string;
  code?: string;
  stack?: string;
  details?: Record<string, any>;
}

// === Log Types ===

export interface AutomationLog {
  id: string;
  taskId: string;
  executionId?: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  timestamp: Date;
}

// === API Request/Response Types ===

export interface CreateTaskDto {
  name: string;
  type: AutomationTaskType;
  config: AutomationConfig;
  userId?: string;
}

export interface UpdateTaskDto {
  name?: string;
  config?: AutomationConfig;
  status?: AutomationStatus;
}

export interface ExecuteTaskDto {
  taskId: string;
  variables?: Record<string, any>;
  immediate?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// === WebSocket Types ===

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  timestamp: string;
  requestId?: string;
}

export type WebSocketMessageType =
  | 'subscribe'
  | 'unsubscribe'
  | 'task-update'
  | 'execution-start'
  | 'execution-progress'
  | 'execution-complete'
  | 'execution-error'
  | 'step-update'
  | 'log'
  | 'ping'
  | 'pong';

export interface SubscribeMessage {
  taskId?: string;
  userId?: string;
  events?: WebSocketMessageType[];
}

// === Statistics Types ===

export interface TaskStatistics {
  taskId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  lastExecutionStatus?: AutomationStatus;
  successRate: number;
}

export interface SystemStatistics {
  totalTasks: number;
  activeTasks: number;
  totalExecutions: number;
  activeExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  uptime: number;
}

// === Export Types ===

export interface ExportOptions {
  format: 'json' | 'yaml' | 'typescript' | 'javascript';
  includeLogs?: boolean;
  includeStatistics?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface ImportOptions {
  overwrite?: boolean;
  validate?: boolean;
  merge?: boolean;
}

// === Workflow Types (for visual builder) ===

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDefinition {
  id?: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  version: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// === Validation Types ===

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

// === Authentication Types ===

export interface AuthToken {
  token: string;
  expiresAt: Date;
  userId?: string;
  permissions?: string[];
}

export interface ApiKeyInfo {
  key: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
}

// === Rate Limiting Types ===

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

// === Health Check Types ===

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  services: {
    database: ServiceStatus;
    websocket: ServiceStatus;
    queue?: ServiceStatus;
  };
  timestamp: string;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  message?: string;
}