export interface ModelConfig {
  name: string;
  cost: number;
  speed: number;
  quality: number;
  maxTokens: number;
}

export interface TaskContext {
  complexity: 'simple' | 'medium' | 'complex';
  type: 'chat' | 'analysis' | 'code' | 'creative';
  urgency: 'low' | 'medium' | 'high';
  budget?: number;
}

export class ModelSelectionStrategy {
  private models: ModelConfig[] = [
    {
      name: 'gemini-1.5-flash',
      cost: 0.1,
      speed: 10,
      quality: 7,
      maxTokens: 1000000
    },
    {
      name: 'gemini-1.5-pro',
      cost: 0.5,
      speed: 6,
      quality: 9,
      maxTokens: 2000000
    },
    {
      name: 'gemini-2.0-flash-exp',
      cost: 0.2,
      speed: 9,
      quality: 8,
      maxTokens: 1000000
    }
  ];

  selectModel(context: TaskContext): ModelConfig {
    // Removed console.log

    // Simple tasks - prioritize speed and cost
    if (context.complexity === 'simple') {
      return this.models.find(m => m.name === 'gemini-1.5-flash') || this.models[0];
    }

    // Complex tasks - prioritize quality
    if (context.complexity === 'complex') {
      return this.models.find(m => m.name === 'gemini-1.5-pro') || this.models[1];
    }

    // Medium tasks - balanced approach
    if (context.urgency === 'high') {
      return this.models.find(m => m.name === 'gemini-2.0-flash-exp') || this.models[2];
    }

    // Default to balanced model
    return this.models.find(m => m.name === 'gemini-2.0-flash-exp') || this.models[0];
  }

  getModelRecommendation(context: TaskContext): {
    primary: ModelConfig;
    fallback: ModelConfig;
    reason: string;
  } {
    const primary = this.selectModel(context);
    const fallback = this.models.find(m => m.name !== primary.name) || this.models[0];

    let reason = '';
    if (context.complexity === 'simple') {
      reason = 'اختيار نموذج سريع وموفر للمهام البسيطة';
    } else if (context.complexity === 'complex') {
      reason = 'اختيار نموذج عالي الجودة للمهام المعقدة';
    } else {
      reason = 'اختيار نموذج متوازن للمهام المتوسطة';
    }

    return { primary, fallback, reason };
  }

  calculateCost(model: ModelConfig, tokens: number): number {
    return (tokens / 1000) * model.cost;
  }

  getAvailableModels(): ModelConfig[] {
    return [...this.models];
  }
}