/**
 * Visual Automation SDK
 * Entry point for the SDK
 */

export { AutomationClient, createAutomationClient, automationClient } from './client';
export type { AutomationClientConfig } from './client';

// Re-export types
export type {
  AutomationTask,
  AutomationTaskType,
  AutomationStatus,
  AutomationConfig,
  AutomationAction,
  ActionType,
  AutomationTrigger,
  TriggerType,
  AutomationSettings,
  RetryConfig,
  NotificationSettings,
  LoggingSettings,
  AutomationExecution,
  ExecutionStep,
  ExecutionError,
  AutomationLog,
  CreateTaskDto,
  UpdateTaskDto,
  ExecuteTaskDto,
  ApiResponse,
  PaginatedResponse,
  WebSocketMessage,
  WebSocketMessageType,
  SubscribeMessage,
  TaskStatistics,
  SystemStatistics,
  ExportOptions,
  ImportOptions,
  WorkflowNode,
  WorkflowConnection,
  WorkflowDefinition,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  AuthToken,
  ApiKeyInfo,
  RateLimitInfo,
  HealthStatus,
  ServiceStatus,
} from '@/types/automation';