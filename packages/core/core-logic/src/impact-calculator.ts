import { EventBus } from './event-bus';
import { Scenario, ScenarioVariable, ScenarioOutcome } from './index';

export interface ImpactCalculation {
  scenarioId: string;
  totalImpact: number;
  impactBreakdown: ImpactBreakdownItem[];
  riskAdjustedImpact: number;
  confidence: number;
}

export interface ImpactBreakdownItem {
  variable: string;
  impact: number;
  weight: number;
  contribution: number;
}

export class ImpactCalculator {
  private eventBus: EventBus;
  private impactWeights: Map<string, number>;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.impactWeights = new Map([
      ['revenue', 0.3],
      ['costs', 0.25],
      ['efficiency', 0.2],
      ['customer_satisfaction', 0.15],
      ['market_share', 0.1]
    ]);
  }

  calculateImpact(scenario: Scenario, variables: ScenarioVariable[]): ImpactCalculation {
    const impactBreakdown: ImpactBreakdownItem[] = [];
    let totalImpact = 0;

    variables.forEach(variable => {
      const weight = this.impactWeights.get(variable.name) || 0.1;
      const impact = this.calculateVariableImpact(variable);
      const contribution = impact * weight;

      impactBreakdown.push({
        variable: variable.name,
        impact,
        weight,
        contribution
      });

      totalImpact += contribution;
    });

    const riskAdjustedImpact = this.adjustForRisk(totalImpact, scenario);
    const confidence = this.calculateConfidence(scenario, variables);

    const calculation: ImpactCalculation = {
      scenarioId: scenario.id,
      totalImpact,
      impactBreakdown,
      riskAdjustedImpact,
      confidence
    };

    this.eventBus.emit('impact:calculated', calculation);
    return calculation;
  }

  private calculateVariableImpact(variable: ScenarioVariable): number {
    const range = variable.suggestedRange[1] - variable.suggestedRange[0];
    const position = (variable.currentValue - variable.suggestedRange[0]) / range;
    return position * variable.impact;
  }

  private adjustForRisk(impact: number, scenario: Scenario): number {
    const riskMultipliers = {
      low: 0.9,
      medium: 0.8,
      high: 0.6,
      critical: 0.4
    };

    return impact * riskMultipliers[scenario.impact];
  }

  private calculateConfidence(scenario: Scenario, variables: ScenarioVariable[]): number {
    const baseConfidence = scenario.probability;
    const variableConfidence = variables.reduce((acc, v) => acc + v.impact, 0) / variables.length;
    return (baseConfidence + variableConfidence) / 2;
  }

  updateImpactWeights(weights: Record<string, number>): void {
    Object.entries(weights).forEach(([key, value]) => {
      this.impactWeights.set(key, value);
    });
    
    this.eventBus.emit('impact:weights:updated', weights);
  }
}