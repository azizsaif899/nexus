import { Injectable } from '@nestjs/common';
import { MLModelManager, NLPProcessor, PredictiveAnalyzer } from '@g-assistant-nx/ai-engine';

@Injectable()
export class AIService {
  private mlModelManager: MLModelManager;
  private nlpProcessor: NLPProcessor;
  private predictiveAnalyzer: PredictiveAnalyzer;

  constructor() {
    this.mlModelManager = new MLModelManager();
    this.nlpProcessor = new NLPProcessor();
    this.predictiveAnalyzer = new PredictiveAnalyzer();
    
    this.initializeModels();
  }

  private initializeModels() {
    // Register some default models
    this.mlModelManager.registerModel({
      id: 'sentiment_classifier',
      name: 'Sentiment Analysis Model',
      type: 'classification',
      version: '1.0.0',
      accuracy: 0.89,
      status: 'ready',
      metadata: { language: 'multilingual', classes: ['positive', 'negative', 'neutral'] }
    });

    this.mlModelManager.registerModel({
      id: 'user_behavior_predictor',
      name: 'User Behavior Prediction Model',
      type: 'recommendation',
      version: '1.2.0',
      accuracy: 0.82,
      status: 'ready',
      metadata: { features: ['activity', 'engagement', 'preferences'] }
    });

    this.mlModelManager.registerModel({
      id: 'system_load_predictor',
      name: 'System Load Prediction Model',
      type: 'regression',
      version: '2.1.0',
      accuracy: 0.91,
      status: 'ready',
      metadata: { metrics: ['cpu', 'memory', 'requests'] }
    });

    // Add some sample time series data
    this.predictiveAnalyzer.addTimeSeriesData('system_cpu', [
      { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), value: 45 },
      { timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000), value: 52 },
      { timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), value: 48 },
      { timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000), value: 55 },
      { timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), value: 61 }
    ]);
  }

  async processText(text: string, language?: string) {
    return this.nlpProcessor.processText(text, language);
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string) {
    return this.nlpProcessor.translateText(text, targetLanguage, sourceLanguage);
  }

  async generateText(prompt: string, maxLength?: number) {
    return this.nlpProcessor.generateText(prompt, maxLength);
  }

  async predictTimeSeries(seriesId: string, forecastHorizon: number) {
    return this.predictiveAnalyzer.predictTimeSeries(seriesId, forecastHorizon);
  }

  async predictUserBehavior(userId: string, features: Record<string, number>) {
    return this.predictiveAnalyzer.predictUserBehavior(userId, features);
  }

  async predictSystemLoad(metrics: Record<string, number>) {
    return this.predictiveAnalyzer.predictSystemLoad(metrics);
  }

  detectAnomaly(seriesId: string, value: number, timestamp: Date) {
    return this.predictiveAnalyzer.detectAnomaly(seriesId, value, timestamp);
  }

  async trainModel(modelId: string, trainingData: any) {
    const success = await this.mlModelManager.trainModel(modelId, trainingData);
    return { success, message: success ? 'Model trained successfully' : 'Training failed' };
  }

  async predict(modelId: string, input: any) {
    return this.mlModelManager.predict(modelId, input);
  }

  getModels(type?: any, status?: any) {
    return this.mlModelManager.getModels(type, status);
  }

  getModel(id: string) {
    return this.mlModelManager.getModel(id);
  }

  getModelPerformance(id: string) {
    return this.mlModelManager.getModelPerformance(id);
  }

  getAIStatistics() {
    const models = this.mlModelManager.getModels();
    const readyModels = models.filter(m => m.status === 'ready');
    const trainingModels = models.filter(m => m.status === 'training');
    
    const averageAccuracy = models.length > 0 
      ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length 
      : 0;

    return {
      totalModels: models.length,
      readyModels: readyModels.length,
      trainingModels: trainingModels.length,
      averageAccuracy: Math.round(averageAccuracy * 100),
      supportedLanguages: this.nlpProcessor.getSupportedLanguages(),
      entityTypes: this.nlpProcessor.getEntityTypes(),
      capabilities: {
        nlp: true,
        prediction: true,
        anomalyDetection: true,
        translation: true,
        textGeneration: true
      }
    };
  }

  // Additional utility methods
  async analyzeUserQuery(query: string, userId?: string) {
    const nlpResult = await this.processText(query);
    
    // Use sentiment and intent to provide better responses
    const response = {
      originalQuery: query,
      analysis: nlpResult,
      suggestedActions: this.getSuggestedActions(nlpResult),
      confidence: nlpResult.sentiment.score
    };

    return response;
  }

  private getSuggestedActions(nlpResult: any): string[] {
    const actions = [];
    
    if (nlpResult.intent?.name === 'question') {
      actions.push('Provide detailed answer', 'Suggest related topics');
    }
    
    if (nlpResult.intent?.name === 'complaint') {
      actions.push('Escalate to support', 'Offer solution');
    }
    
    if (nlpResult.sentiment.label === 'negative') {
      actions.push('Improve user experience', 'Follow up');
    }
    
    if (nlpResult.entities.length > 0) {
      actions.push('Extract relevant information', 'Personalize response');
    }

    return actions;
  }

  async getRecommendations(userId: string, context: Record<string, any>) {
    const userBehavior = await this.predictUserBehavior(userId, context);
    
    const recommendations = [];
    
    if (userBehavior.churnProbability > 0.7) {
      recommendations.push('Send retention offer', 'Provide premium support');
    }
    
    if (userBehavior.engagementScore < 0.5) {
      recommendations.push('Send engagement content', 'Recommend popular features');
    }
    
    recommendations.push(...userBehavior.recommendations);
    
    return {
      userId,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      churnRisk: userBehavior.churnProbability > 0.5 ? 'high' : 'low',
      engagementLevel: userBehavior.engagementScore > 0.7 ? 'high' : 'medium'
    };
  }
}