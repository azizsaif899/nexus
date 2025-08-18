import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventBus } from '@azizsys/core-logic';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  variables: ScenarioVariable[];
  outcomes: ScenarioOutcome[];
}

export interface ScenarioVariable {
  name: string;
  currentValue: number;
  suggestedRange: [number, number];
  unit: string;
  impact: number;
}

export interface ScenarioOutcome {
  metric: string;
  baseValue: number;
  projectedValue: number;
  change: number;
  changePercent: number;
}

export class ScenarioGenerator {
  private genAI: GoogleGenerativeAI;
  private eventBus: EventBus;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.eventBus = EventBus.getInstance();
  }

  async generateScenarios(context: {
    businessType: string;
    currentMetrics: Record<string, number>;
    goals: string[];
    constraints: string[];
  }): Promise<Scenario[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Generate 5 strategic business scenarios for a ${context.businessType} company.
        Current metrics: ${JSON.stringify(context.currentMetrics)}
        Goals: ${context.goals.join(', ')}
        Constraints: ${context.constraints.join(', ')}
        
        Return JSON array with scenarios including probability, impact, variables, and projected outcomes.
      `;

      const result = await model.generateContent(prompt);
      const scenarios = JSON.parse(result.response.text());

      this.eventBus.emit('scenarios:generated', { scenarios, context });
      return scenarios;
    } catch (error) {
      this.eventBus.emit('scenarios:error', { error: error.message });
      throw error;
    }
  }

  async generateWhatIfScenario(baseScenario: Scenario, changes: Record<string, number>): Promise<Scenario> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Modify this scenario based on variable changes:
      Base scenario: ${JSON.stringify(baseScenario)}
      Changes: ${JSON.stringify(changes)}
      
      Return updated scenario with new outcomes and probability.
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }

  async assessScenarioRisk(scenario: Scenario): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    mitigation: string[];
  }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Assess risk for this scenario:
      ${JSON.stringify(scenario)}
      
      Return risk level, factors, and mitigation strategies.
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}