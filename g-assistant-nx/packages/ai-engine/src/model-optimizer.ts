import { ModelSelectionStrategy, TaskContext, ModelConfig } from '../../config-core/src/model-selection.strategy';

export class ModelOptimizer {
  private strategy: ModelSelectionStrategy;
  private usageStats: Map<string, number> = new Map();

  constructor() {
    this.strategy = new ModelSelectionStrategy();
  }

  async optimizeForTask(context: TaskContext): Promise<{
    selectedModel: ModelConfig;
    estimatedCost: number;
    estimatedTime: number;
  }> {
    const recommendation = this.strategy.getModelRecommendation(context);
    const selectedModel = recommendation.primary;

    // Track usage
    const currentUsage = this.usageStats.get(selectedModel.name) || 0;
    this.usageStats.set(selectedModel.name, currentUsage + 1);

    // Estimate cost and time
    const estimatedTokens = this.estimateTokens(context);
    const estimatedCost = this.strategy.calculateCost(selectedModel, estimatedTokens);
    const estimatedTime = this.estimateTime(selectedModel, estimatedTokens);

    console.log(`🎯 Selected ${selectedModel.name} for ${context.type} task`);
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)}`);
    console.log(`⏱️ Estimated time: ${estimatedTime}s`);

    return {
      selectedModel,
      estimatedCost,
      estimatedTime
    };
  }

  private estimateTokens(context: TaskContext): number {
    const baseTokens = {
      simple: 500,
      medium: 1500,
      complex: 3000
    };

    const typeMultiplier = {
      chat: 1.0,
      analysis: 1.5,
      code: 2.0,
      creative: 1.2
    };

    return baseTokens[context.complexity] * typeMultiplier[context.type];
  }

  private estimateTime(model: ModelConfig, tokens: number): number {
    // Base time calculation: tokens / (speed * 100)
    return Math.ceil(tokens / (model.speed * 100));
  }

  getUsageStats(): Record<string, number> {
    return Object.fromEntries(this.usageStats);
  }

  resetStats(): void {
    this.usageStats.clear();
  }

  // Dynamic model switching based on load
  async selectModelWithLoadBalancing(context: TaskContext): Promise<ModelConfig> {
    const models = this.strategy.getAvailableModels();
    const usage = this.getUsageStats();

    // Find least used model that meets requirements
    const suitableModels = models.filter(model => {
      if (context.complexity === 'complex') return model.quality >= 8;
      if (context.complexity === 'simple') return model.speed >= 8;
      return true;
    });

    // Sort by usage (ascending) then by suitability
    const selectedModel = suitableModels.sort((a, b) => {
      const usageA = usage[a.name] || 0;
      const usageB = usage[b.name] || 0;
      return usageA - usageB;
    })[0];

    return selectedModel || models[0];
  }
}