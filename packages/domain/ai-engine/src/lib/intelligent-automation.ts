export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'event' | 'schedule' | 'condition';
    config: Record<string, any>;
  };
  conditions: Array<{
    field: string;
    operator: 'equals' | 'greater' | 'less' | 'contains';
    value: any;
  }>;
  actions: Array<{
    type: 'notify' | 'execute' | 'update' | 'create';
    config: Record<string, any>;
  }>;
  enabled: boolean;
}

export interface AutomationExecution {
  ruleId: string;
  triggeredAt: Date;
  status: 'success' | 'failed' | 'pending';
  result?: any;
  error?: string;
}

export class IntelligentAutomation {
  private rules = new Map<string, AutomationRule>();
  private executions: AutomationExecution[] = [];

  addRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
  }

  async executeRule(ruleId: string, context: Record<string, any>): Promise<AutomationExecution> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) {
      throw new Error(`Rule ${ruleId} not found or disabled`);
    }

    const execution: AutomationExecution = {
      ruleId,
      triggeredAt: new Date(),
      status: 'pending'
    };

    try {
      // Check conditions
      const conditionsMet = this.evaluateConditions(rule.conditions, context);
      if (!conditionsMet) {
        execution.status = 'failed';
        execution.error = 'Conditions not met';
        return execution;
      }

      // Execute actions
      const results = [];
      for (const action of rule.actions) {
        const result = await this.executeAction(action, context);
        results.push(result);
      }

      execution.status = 'success';
      execution.result = results;
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
    }

    this.executions.push(execution);
    return execution;
  }

  private evaluateConditions(conditions: AutomationRule['conditions'], context: Record<string, any>): boolean {
    return conditions.every(condition => {
      const value = context[condition.field];
      
      switch (condition.operator) {
        case 'equals': return value === condition.value;
        case 'greater': return value > condition.value;
        case 'less': return value < condition.value;
        case 'contains': return String(value).includes(condition.value);
        default: return false;
      }
    });
  }

  private async executeAction(action: AutomationRule['actions'][0], context: Record<string, any>): Promise<any> {
    switch (action.type) {
      case 'notify':
        return this.sendNotification(action.config, context);
      case 'execute':
        return this.executeCommand(action.config, context);
      case 'update':
        return this.updateData(action.config, context);
      case 'create':
        return this.createResource(action.config, context);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async sendNotification(config: Record<string, any>, context: Record<string, any>): Promise<any> {
    return { type: 'notification', message: config.message, sent: true };
  }

  private async executeCommand(config: Record<string, any>, context: Record<string, any>): Promise<any> {
    return { type: 'command', command: config.command, executed: true };
  }

  private async updateData(config: Record<string, any>, context: Record<string, any>): Promise<any> {
    return { type: 'update', target: config.target, updated: true };
  }

  private async createResource(config: Record<string, any>, context: Record<string, any>): Promise<any> {
    return { type: 'create', resource: config.resource, created: true };
  }

  getExecutionHistory(ruleId?: string): AutomationExecution[] {
    let executions = this.executions;
    if (ruleId) {
      executions = executions.filter(e => e.ruleId === ruleId);
    }
    return executions.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
  }
}