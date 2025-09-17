export interface UserInteraction {
  userId: string;
  action: string;
  context: Record<string, any>;
  feedback?: 'positive' | 'negative' | 'neutral';
  timestamp: Date;
}

export interface LearningModel {
  userId: string;
  preferences: Record<string, number>;
  patterns: Array<{ pattern: string; weight: number }>;
  lastUpdated: Date;
}

export class AdaptiveLearning {
  private userModels = new Map<string, LearningModel>();
  private interactions: UserInteraction[] = [];

  recordInteraction(interaction: Omit<UserInteraction, 'timestamp'>): void {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: new Date()
    };
    
    this.interactions.push(fullInteraction);
    this.updateUserModel(fullInteraction);
  }

  private updateUserModel(interaction: UserInteraction): void {
    let model = this.userModels.get(interaction.userId);
    
    if (!model) {
      model = {
        userId: interaction.userId,
        preferences: {},
        patterns: [],
        lastUpdated: new Date()
      };
    }

    // Update preferences based on feedback
    if (interaction.feedback) {
      const weight = interaction.feedback === 'positive' ? 1 : -0.5;
      Object.keys(interaction.context).forEach(key => {
        model!.preferences[key] = (model!.preferences[key] || 0) + weight;
      });
    }

    // Update patterns
    const pattern = `${interaction.action}:${JSON.stringify(interaction.context)}`;
    const existingPattern = model.patterns.find(p => p.pattern === pattern);
    
    if (existingPattern) {
      existingPattern.weight += 0.1;
    } else {
      model.patterns.push({ pattern, weight: 1 });
    }

    model.lastUpdated = new Date();
    this.userModels.set(interaction.userId, model);
  }

  getPersonalizedRecommendations(userId: string, context: Record<string, any>): string[] {
    const model = this.userModels.get(userId);
    if (!model) return [];

    const recommendations = [];
    
    // Based on preferences
    for (const [key, weight] of Object.entries(model.preferences)) {
      if (weight > 0.5) {
        recommendations.push(`Recommend ${key} based on preferences`);
      }
    }

    // Based on patterns
    const relevantPatterns = model.patterns
      .filter(p => p.weight > 1)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);

    relevantPatterns.forEach(pattern => {
      recommendations.push(`Suggest action based on pattern: ${pattern.pattern.split(':')[0]}`);
    });

    return recommendations;
  }

  adaptResponse(userId: string, originalResponse: string, context: Record<string, any>): string {
    const model = this.userModels.get(userId);
    if (!model) return originalResponse;

    // Simple adaptation based on user preferences
    let adaptedResponse = originalResponse;
    
    if (model.preferences['detailed'] > 0) {
      adaptedResponse += ' (Detailed explanation available if needed)';
    }
    
    if (model.preferences['quick'] > 0) {
      adaptedResponse = adaptedResponse.substring(0, 100) + '...';
    }

    return adaptedResponse;
  }
}