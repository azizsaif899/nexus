export interface ModelSelectionStrategy {
  selectModel(prompt: string, options: any): Promise<any>;
  evaluateModel(model: any, metrics: any): number;
}

export class CostOptimizedStrategy implements ModelSelectionStrategy {
  async selectModel(prompt: string, options: any) {
    return { name: 'cost-optimized', cost: 0.001 };
  }

  evaluateModel(model: any, metrics: any): number {
    return metrics.cost || 0;
  }
}

export class QualityOptimizedStrategy implements ModelSelectionStrategy {
  async selectModel(prompt: string, options: any) {
    return { name: 'quality-optimized', cost: 0.01 };
  }

  evaluateModel(model: any, metrics: any): number {
    return metrics.quality || 0;
  }
}