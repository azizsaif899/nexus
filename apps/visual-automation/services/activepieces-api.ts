/**
 * ActivePieces API Integration - Hybrid System
 * Professional integration layer between our advanced UI and ActivePieces backend
 */

import { logger } from '../lib/logger';

// Types
interface ActivePiecesConfig {
  apiUrl: string;
  apiKey: string;
  projectId?: string;
}

interface Flow {
  id: string;
  displayName: string;
  version: {
    trigger: any;
    steps: any[];
  };
  status: 'ENABLED' | 'DISABLED';
  created: string;
  updated: string;
}

interface FlowRun {
  id: string;
  flowId: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'PAUSED';
  startTime: string;
  finishTime?: string;
  logsFileId?: string;
}

interface NodeMapping {
  uiNodeId: string;
  activePiecesStepName: string;
  type: string;
}

export class ActivePiecesAPI {
  private config: ActivePiecesConfig | null = null;
  private connected: boolean = false;

  /**
   * Initialize connection to ActivePieces
   */
  async connect(config: ActivePiecesConfig): Promise<boolean> {
    try {
      logger.info('Connecting to ActivePieces...', { apiUrl: config.apiUrl });

      // Validate configuration
      if (!config.apiUrl || !config.apiKey) {
        throw new Error('Missing API URL or API Key');
      }

      // Test connection with health check
      const response = await fetch(`${config.apiUrl}/v1/flows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`);
      }

      this.config = config;
      this.connected = true;

      logger.info('✅ Connected to ActivePieces successfully');
      return true;
    } catch (error) {
      logger.error('❌ Failed to connect to ActivePieces:', error);
      this.connected = false;
      throw error;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected && this.config !== null;
  }

  /**
   * Get configuration
   */
  getConfig(): ActivePiecesConfig | null {
    return this.config;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    this.config = null;
    this.connected = false;
    logger.info('Disconnected from ActivePieces');
  }

  /**
   * Convert our UI nodes to ActivePieces flow format
   */
  convertToActivePiecesFlow(nodes: any[], connections: any[]): any {
    logger.info('Converting UI workflow to ActivePieces format...', { 
      nodeCount: nodes.length, 
      connectionCount: connections.length 
    });

    // Find trigger node
    const triggerNode = nodes.find(n => n.type.includes('trigger'));
    if (!triggerNode) {
      throw new Error('No trigger node found in workflow');
    }

    // Build steps from action nodes
    const actionNodes = nodes.filter(n => !n.type.includes('trigger'));
    const steps: any = {};

    actionNodes.forEach((node, index) => {
      const stepName = `step_${index + 1}`;
      
      steps[stepName] = {
        type: this.mapNodeTypeToActivePiecesAction(node.type),
        settings: {
          input: node.data?.config || {},
          displayName: node.data?.label || node.type,
        },
      };
    });

    const flow = {
      displayName: 'Imported Workflow',
      version: {
        trigger: {
          type: this.mapNodeTypeToActivePiecesTrigger(triggerNode.type),
          settings: {
            input: triggerNode.data?.config || {},
          },
        },
        steps: steps,
      },
    };

    logger.info('✅ Conversion complete', { flow });
    return flow;
  }

  /**
   * Map our node types to ActivePieces trigger types
   */
  private mapNodeTypeToActivePiecesTrigger(nodeType: string): string {
    const mapping: Record<string, string> = {
      'trigger-webhook': 'WEBHOOK',
      'trigger-schedule': 'SCHEDULE',
      'trigger-email': 'EMAIL',
      'trigger-form': 'WEBHOOK',
      'trigger-file': 'FILE_UPLOAD',
    };

    return mapping[nodeType] || 'WEBHOOK';
  }

  /**
   * Map our node types to ActivePieces action types
   */
  private mapNodeTypeToActivePiecesAction(nodeType: string): string {
    const mapping: Record<string, string> = {
      'action-http': 'HTTP',
      'action-email': 'EMAIL',
      'action-database': 'DATA_MAPPER',
      'action-transform': 'CODE',
      'action-filter': 'BRANCH',
      'action-delay': 'DELAY',
      'logic-condition': 'BRANCH',
      'logic-loop': 'LOOP',
    };

    return mapping[nodeType] || 'CODE';
  }

  /**
   * Create a new flow in ActivePieces
   */
  async createFlow(nodes: any[], connections: any[], flowName?: string): Promise<Flow> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      logger.info('Creating flow in ActivePieces...', { flowName });

      const flowDefinition = this.convertToActivePiecesFlow(nodes, connections);
      flowDefinition.displayName = flowName || 'Workflow from UI';

      const response = await fetch(`${this.config.apiUrl}/v1/flows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowDefinition),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create flow: ${error}`);
      }

      const flow = await response.json();
      logger.info('✅ Flow created successfully', { flowId: flow.id });
      
      return flow;
    } catch (error) {
      logger.error('❌ Failed to create flow:', error);
      throw error;
    }
  }

  /**
   * Update existing flow
   */
  async updateFlow(flowId: string, nodes: any[], connections: any[]): Promise<Flow> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      logger.info('Updating flow in ActivePieces...', { flowId });

      const flowDefinition = this.convertToActivePiecesFlow(nodes, connections);

      const response = await fetch(`${this.config.apiUrl}/v1/flows/${flowId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowDefinition),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update flow: ${error}`);
      }

      const flow = await response.json();
      logger.info('✅ Flow updated successfully', { flowId });
      
      return flow;
    } catch (error) {
      logger.error('❌ Failed to update flow:', error);
      throw error;
    }
  }

  /**
   * Execute a flow (run workflow)
   */
  async executeFlow(flowId: string, inputData?: any): Promise<FlowRun> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      logger.info('Executing flow in ActivePieces...', { flowId });

      const response = await fetch(`${this.config.apiUrl}/v1/flows/${flowId}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputData || {} }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to execute flow: ${error}`);
      }

      const run = await response.json();
      logger.info('✅ Flow execution started', { runId: run.id });
      
      return run;
    } catch (error) {
      logger.error('❌ Failed to execute flow:', error);
      throw error;
    }
  }

  /**
   * Get flow run status
   */
  async getFlowRunStatus(runId: string): Promise<FlowRun> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/flow-runs/${runId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get run status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get run status:', error);
      throw error;
    }
  }

  /**
   * List all flows
   */
  async listFlows(): Promise<Flow[]> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/flows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list flows: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      logger.error('Failed to list flows:', error);
      throw error;
    }
  }

  /**
   * Delete a flow
   */
  async deleteFlow(flowId: string): Promise<void> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      logger.info('Deleting flow from ActivePieces...', { flowId });

      const response = await fetch(`${this.config.apiUrl}/v1/flows/${flowId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete flow: ${response.statusText}`);
      }

      logger.info('✅ Flow deleted successfully', { flowId });
    } catch (error) {
      logger.error('❌ Failed to delete flow:', error);
      throw error;
    }
  }

  /**
   * Get flow execution logs
   */
  async getFlowLogs(runId: string): Promise<any[]> {
    if (!this.isConnected() || !this.config) {
      throw new Error('Not connected to ActivePieces');
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/v1/flow-runs/${runId}/logs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get logs: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Failed to get logs:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const activePiecesAPI = new ActivePiecesAPI();
