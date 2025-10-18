/**
 * Activepieces Service - React Integration
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

export interface Flow {
  id: string;
  displayName: string;
  name?: string; // for compatibility
  status: 'ENABLED' | 'DISABLED';
  created: string;
  updated?: string;
}

export interface FlowExecution {
  id: string;
  flowId: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  startTime: string;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  plan?: string;
}

export interface ActivepiecesError {
  message: string;
  code: string;
}

class ActivepiecesService {
  private token: string | null = null;
  private baseUrl: string | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    const initFunction = httpsCallable(functions, 'initActivepieces');
    const result = await initFunction();
    const data = result.data as any;

    this.token = data.token;
    this.baseUrl = data.baseUrl;
    this.initialized = true;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.initialized) await this.init();

    const response = await fetch(`${this.baseUrl}/api/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Activepieces API error: ${response.statusText}`);
    }

    return response.json();
  }

  // إدارة Flows
  async getFlows(): Promise<Flow[]> {
    const response = await this.request('/flows');
    return response.data || [];
  }

  async createFlow(flowData: { displayName: string; trigger: any; actions: any[] }): Promise<Flow> {
    return this.request('/flows', {
      method: 'POST',
      body: JSON.stringify(flowData)
    });
  }

  async updateFlow(flowId: string, updates: Partial<Flow>): Promise<Flow> {
    return this.request(`/flows/${flowId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteFlow(flowId: string): Promise<void> {
    await this.request(`/flows/${flowId}`, {
      method: 'DELETE'
    });
  }

  // تنفيذ Flows
  async runFlow(flowId: string, input?: any): Promise<FlowExecution> {
    return this.request(`/flows/${flowId}/runs`, {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async getFlowRuns(flowId: string): Promise<FlowExecution[]> {
    const response = await this.request(`/flows/${flowId}/runs`);
    return response.data || [];
  }

  // Quota
  async getQuota(): Promise<QuotaInfo> {
    const response = await this.request('/quota');
    return response;
  }

  // Executions
  async getExecutions(flowId?: string): Promise<FlowExecution[]> {
    if (flowId) {
      return this.getFlowRuns(flowId);
    }
    // If no flowId, get all executions
    const response = await this.request('/executions');
    return response.data || [];
  }

  // Templates
  async getTemplates() {
    return this.request('/flow-templates');
  }

  async createFromTemplate(templateId: string, customizations?: any) {
    return this.request('/flows/from-template', {
      method: 'POST',
      body: JSON.stringify({ templateId, ...customizations })
    });
  }
}

export const activepiecesService = new ActivepiecesService();