/**
 * Visual Automation SDK Client
 * SDK للاتصال بـ API من التطبيق الآخر
 */

import type {
  AutomationTask,
  CreateTaskDto,
  UpdateTaskDto,
  ExecuteTaskDto,
  ApiResponse,
  PaginatedResponse,
  AutomationExecution,
  TaskStatistics,
  AutomationLog,
} from '@/types/automation';

export interface AutomationClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class AutomationClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config: AutomationClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000; // 30 seconds default
  }

  /**
   * Internal fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  /**
   * Get list of tasks
   */
  async getTasks(options?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    userId?: string;
  }): Promise<PaginatedResponse<AutomationTask>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.status) params.set('status', options.status);
    if (options?.type) params.set('type', options.type);
    if (options?.userId) params.set('userId', options.userId);

    const query = params.toString();
    const endpoint = `/api/automation/tasks${query ? `?${query}` : ''}`;

    return this.fetch<AutomationTask[]>(endpoint) as Promise<
      PaginatedResponse<AutomationTask>
    >;
  }

  /**
   * Get single task by ID
   */
  async getTask(taskId: string): Promise<AutomationTask> {
    const response = await this.fetch<AutomationTask>(
      `/api/automation/tasks/${taskId}`
    );
    return response.data!;
  }

  /**
   * Create new task
   */
  async createTask(task: CreateTaskDto): Promise<AutomationTask> {
    const response = await this.fetch<AutomationTask>('/api/automation/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.data!;
  }

  /**
   * Update existing task
   */
  async updateTask(
    taskId: string,
    updates: UpdateTaskDto
  ): Promise<AutomationTask> {
    const response = await this.fetch<AutomationTask>(
      `/api/automation/tasks/${taskId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
    return response.data!;
  }

  /**
   * Delete task
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.fetch(`/api/automation/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Execute task
   */
  async executeTask(
    taskId: string,
    options?: ExecuteTaskDto
  ): Promise<{ task: AutomationTask; execution: AutomationExecution }> {
    const response = await this.fetch<{
      task: AutomationTask;
      execution: AutomationExecution;
    }>(`/api/automation/tasks/${taskId}/execute`, {
      method: 'PUT',
      body: JSON.stringify(options || {}),
    });
    return response.data!;
  }

  /**
   * Get task execution history
   */
  async getExecutions(taskId: string): Promise<AutomationExecution[]> {
    const response = await this.fetch<AutomationExecution[]>(
      `/api/automation/tasks/${taskId}/execute`
    );
    return response.data!;
  }

  /**
   * Get task status and statistics
   */
  async getTaskStatus(taskId: string): Promise<{
    task: Partial<AutomationTask>;
    statistics: TaskStatistics;
    recentExecutions: Partial<AutomationExecution>[];
  }> {
    const response = await this.fetch<{
      task: Partial<AutomationTask>;
      statistics: TaskStatistics;
      recentExecutions: Partial<AutomationExecution>[];
    }>(`/api/automation/tasks/${taskId}/status`);
    return response.data!;
  }

  /**
   * Get task logs
   */
  async getLogs(
    taskId: string,
    options?: {
      page?: number;
      limit?: number;
      level?: string;
      executionId?: string;
    }
  ): Promise<PaginatedResponse<AutomationLog>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.level) params.set('level', options.level);
    if (options?.executionId) params.set('executionId', options.executionId);

    const query = params.toString();
    const endpoint = `/api/automation/tasks/${taskId}/logs${
      query ? `?${query}` : ''
    }`;

    return this.fetch<AutomationLog[]>(endpoint) as Promise<
      PaginatedResponse<AutomationLog>
    >;
  }

  /**
   * Subscribe to task updates via WebSocket
   */
  subscribeToTask(
    taskId: string,
    callback: (update: any) => void
  ): () => void {
    // WebSocket implementation
    const wsUrl = this.baseUrl.replace(/^http/, 'ws') + '/automation';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          payload: { taskId },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'task-update' || message.type.startsWith('execution-')) {
          callback(message.payload);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Return cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'unsubscribe',
            payload: { taskId },
          })
        );
      }
      ws.close();
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    const response = await this.fetch('/api/health');
    return response.data;
  }
}

/**
 * Create AutomationClient instance
 */
export function createAutomationClient(
  config: AutomationClientConfig
): AutomationClient {
  return new AutomationClient(config);
}

/**
 * Default client for server-side usage
 */
export const automationClient =
  typeof window === 'undefined'
    ? new AutomationClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100',
      })
    : null;