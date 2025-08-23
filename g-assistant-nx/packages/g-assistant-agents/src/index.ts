// G-Assistant Smart Agents

export { AgentCFO, agentCFO } from './agents/agent-cfo';
export { AgentAnalyst, agentAnalyst } from './agents/agent-analyst';
export { AgentReviewer, agentReviewer } from './agents/agent-reviewer';

export { SheetsConnector, sheetsConnector } from './services/sheets-connector';

// Agent Manager
export class AgentManager {
  private agents = {
    cfo: agentCFO,
    analyst: agentAnalyst,
    reviewer: agentReviewer
  };

  getAgent(type: 'cfo' | 'analyst' | 'reviewer') {
    return this.agents[type];
  }

  async executeTask(agentType: string, taskType: string, params: any) {
    const agent = this.agents[agentType as keyof typeof this.agents];
    if (!agent) throw new Error(`Agent ${agentType} not found`);

    switch (taskType) {
      case 'financial_analysis':
        return await agent.analyzeFinancialData?.(params.sheetId, params.period);
      case 'performance_analysis':
        return await agent.analyzePerformanceData?.(params.sheetId, params.metrics);
      case 'code_review':
        return await agent.analyzeCodeReview?.(params.sheetId, params.severity);
      default:
        throw new Error(`Task type ${taskType} not supported`);
    }
  }
}

export const agentManager = new AgentManager();