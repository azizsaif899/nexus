// ML Core exports
export class PredictionModels {
  async predict(data: any) { return { prediction: 0.8 }; }
}

export class ImpactCalculator {
  calculate(data: any) { return { impact: 'high' }; }
}

export class ScenarioGenerator {
  generate(params: any) { return { scenarios: [] }; }
}