export * from './embedding.service';
export * from './model-optimizer';
export * from './dynamic-model-selector';
export * from './advanced-chatbot';
export * from './advanced-core';
export * from './long-context.service';
export * from './tool-use.orchestrator';

// Missing exports for API
export class MLModelManager {
  private models = new Map();
  
  async loadModel(name: string) { return { name, loaded: true }; }
  async predict(data: any) { return { prediction: 'mock' }; }
  async registerModel(name: string, config: any) { this.models.set(name, config); }
  async trainModel(name: string, data: any) { return { trained: true }; }
  getModels() { return Array.from(this.models.keys()); }
  getModel(name: string) { return this.models.get(name); }
  getModelPerformance(name: string) { return { accuracy: 0.95 }; }
}

export class NLPProcessor {
  async processText(text: string) { return { processed: text, tokens: text.split(' '), sentiment: 'positive' }; }
  async analyze(text: string) { return { sentiment: 'positive', entities: [] }; }
  async translateText(text: string, lang: string) { return `translated: ${text}`; }
  async generateText(prompt: string) { return `generated: ${prompt}`; }
  getSupportedLanguages() { return ['en', 'ar']; }
  getEntityTypes() { return ['person', 'location']; }
}

export class PredictiveAnalyzer {
  private timeSeriesData: any[] = [];
  
  async analyze(data: any) { return { prediction: 'mock', confidence: 0.95 }; }
  async forecast(data: any) { return { forecast: [1, 2, 3], accuracy: 0.9 }; }
  addTimeSeriesData(data: any) { this.timeSeriesData.push(data); }
  async predictTimeSeries(data: any) { return { prediction: [1, 2, 3] }; }
  async predictUserBehavior(data: any) { return { behavior: 'active' }; }
  async predictSystemLoad(data: any) { return { load: 0.7 }; }
  async detectAnomaly(data: any) { return { anomaly: false }; }
}

import { DynamicModelSelector } from './dynamic-model-selector';
import { ModelOptimizer } from './model-optimizer';
import { EmbeddingService } from './embedding.service';

export class AIEngine {
  private modelSelector: DynamicModelSelector;
  private optimizer: ModelOptimizer;
  private embeddingService: EmbeddingService;

  constructor(apiKey: string) {
    this.modelSelector = new DynamicModelSelector();
    this.optimizer = new ModelOptimizer();
    this.embeddingService = new EmbeddingService(apiKey);
  }

  async processQuery(prompt: string, options: {
    priority?: 'cost' | 'speed' | 'quality';
    maxCost?: number;
  } = {}) {
    console.log('🤖 AI Engine processing query...');
    
    const selection = await this.modelSelector.selectBestModel(prompt, options);
    
    console.log(`✅ Selected model: ${selection.model.name}`);
    console.log(`💡 Reason: ${selection.reason}`);
    console.log(`💰 Cost: $${selection.metrics.cost.toFixed(4)}`);
    
    return {
      model: selection.model.name,
      response: `Mock response using ${selection.model.name}`,
      metrics: selection.metrics,
      reason: selection.reason
    };
  }

  async generateEmbedding(text: string, taskType: 'RETRIEVAL_DOCUMENT' | 'SEMANTIC_SIMILARITY' = 'SEMANTIC_SIMILARITY') {
    return await this.embeddingService.generateEmbedding(text, taskType);
  }

  getModelStats() {
    return this.modelSelector.getModelStats();
  }
}