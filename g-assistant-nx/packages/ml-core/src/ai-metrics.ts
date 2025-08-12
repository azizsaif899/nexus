import { Injectable } from '@nestjs/common';

@Injectable()
export class AIMetrics {
  private metrics = new Map<string, any[]>();

  async recordMetric(modelId: string, metricType: string, value: number): Promise<void> {
    const key = `${modelId}:${metricType}`;
    const history = this.metrics.get(key) || [];
    
    history.push({
      value,
      timestamp: new Date(),
      modelId,
      metricType
    });
    
    this.metrics.set(key, history);
  }

  async getMetrics(modelId: string, metricType?: string): Promise<any[]> {
    if (metricType) {
      return this.metrics.get(`${modelId}:${metricType}`) || [];
    }
    
    const allMetrics = [];
    for (const [key, values] of this.metrics.entries()) {
      if (key.startsWith(`${modelId}:`)) {
        allMetrics.push(...values);
      }
    }
    
    return allMetrics;
  }

  async calculateAccuracy(modelId: string): Promise<number> {
    const accuracyMetrics = this.metrics.get(`${modelId}:accuracy`) || [];
    if (accuracyMetrics.length === 0) return 0;
    
    const sum = accuracyMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / accuracyMetrics.length;
  }

  async getPerformanceReport(modelId: string): Promise<any> {
    const accuracy = await this.calculateAccuracy(modelId);
    const precision = await this.calculatePrecision(modelId);
    const recall = await this.calculateRecall(modelId);
    
    return {
      modelId,
      accuracy,
      precision,
      recall,
      f1Score: this.calculateF1Score(precision, recall),
      generatedAt: new Date()
    };
  }

  private async calculatePrecision(modelId: string): Promise<number> {
    const precisionMetrics = this.metrics.get(`${modelId}:precision`) || [];
    if (precisionMetrics.length === 0) return 0;
    
    const sum = precisionMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / precisionMetrics.length;
  }

  private async calculateRecall(modelId: string): Promise<number> {
    const recallMetrics = this.metrics.get(`${modelId}:recall`) || [];
    if (recallMetrics.length === 0) return 0;
    
    const sum = recallMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / recallMetrics.length;
  }

  private calculateF1Score(precision: number, recall: number): number {
    if (precision + recall === 0) return 0;
    return 2 * (precision * recall) / (precision + recall);
  }
}