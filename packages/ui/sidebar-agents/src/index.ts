export * from './agents/CFOAgent';
export * from './agents/DeveloperAgent';
export * from './agents/DatabaseManagerAgent';
export * from './agents/OperationsAgent';
export * from './agents/GeneralAgent';
export * from './modes/SmartMode';
export * from './modes/IterativeMode';
export * from './modes/AnalysisMode';

import { CFOAgent } from './agents/CFOAgent';
import { DeveloperAgent } from './agents/DeveloperAgent';
import { DatabaseManagerAgent } from './agents/DatabaseManagerAgent';
import { OperationsAgent } from './agents/OperationsAgent';
import { GeneralAgent } from './agents/GeneralAgent';
import { SmartMode } from './modes/SmartMode';
import { IterativeMode } from './modes/IterativeMode';
import { AnalysisMode } from './modes/AnalysisMode';

export class SidebarSystem {
  private agents = {
    cfo: new CFOAgent(),
    developer: new DeveloperAgent(),
    database: new DatabaseManagerAgent(),
    operations: new OperationsAgent(),
    general: new GeneralAgent()
  };

  private modes = {
    smart: new SmartMode(),
    iterative: new IterativeMode(),
    analysis: new AnalysisMode()
  };

  async processQuery(agentType: string, mode: string, query: string): Promise<string> {
    const agent = this.agents[agentType as keyof typeof this.agents];
    const processingMode = this.modes[mode as keyof typeof this.modes];
    
    if (!agent || !processingMode) {
      throw new Error('Agent or mode not found');
    }

    return await processingMode.process(query, agent);
  }

  getAgents() {
    return Object.keys(this.agents);
  }

  getModes() {
    return Object.keys(this.modes);
  }

  getStatus() {
    return {
      agents: Object.keys(this.agents).length,
      modes: Object.keys(this.modes).length,
      active: true
    };
  }
}