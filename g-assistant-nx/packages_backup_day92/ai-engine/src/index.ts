export * from './embedding.service';
export * from './model-optimizer';
export * from './dynamic-model-selector';
export * from './advanced-chatbot';
export * from './advanced-core';
export * from './long-context.service';
export * from './tool-use.orchestrator';

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