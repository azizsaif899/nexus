import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('nlp/process')
  async processText(@Body() data: { text: string; language?: string }) {
    return this.aiService.processText(data.text, data.language);
  }

  @Post('nlp/translate')
  async translateText(@Body() data: { text: string; targetLanguage: string; sourceLanguage?: string }) {
    return this.aiService.translateText(data.text, data.targetLanguage, data.sourceLanguage);
  }

  @Post('nlp/generate')
  async generateText(@Body() data: { prompt: string; maxLength?: number }) {
    return this.aiService.generateText(data.prompt, data.maxLength);
  }

  @Post('predict/timeseries')
  async predictTimeSeries(@Body() data: { seriesId: string; forecastHorizon: number }) {
    return this.aiService.predictTimeSeries(data.seriesId, data.forecastHorizon);
  }

  @Post('predict/user-behavior')
  async predictUserBehavior(@Body() data: { userId: string; features: Record<string, number> }) {
    return this.aiService.predictUserBehavior(data.userId, data.features);
  }

  @Post('predict/system-load')
  async predictSystemLoad(@Body() data: { metrics: Record<string, number> }) {
    return this.aiService.predictSystemLoad(data.metrics);
  }

  @Post('anomaly/detect')
  async detectAnomaly(@Body() data: { seriesId: string; value: number; timestamp?: string }) {
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    return this.aiService.detectAnomaly(data.seriesId, data.value, timestamp);
  }

  @Post('models/train')
  async trainModel(@Body() data: { modelId: string; trainingData: any }) {
    return this.aiService.trainModel(data.modelId, data.trainingData);
  }

  @Post('models/predict')
  async predict(@Body() data: { modelId: string; input: any }) {
    return this.aiService.predict(data.modelId, data.input);
  }

  @Get('models')
  getModels(@Query('type') type?: string, @Query('status') status?: string) {
    return this.aiService.getModels(type as any, status as any);
  }

  @Get('models/:id')
  getModel(@Query('id') id: string) {
    return this.aiService.getModel(id);
  }

  @Get('models/:id/performance')
  getModelPerformance(@Query('id') id: string) {
    return this.aiService.getModelPerformance(id);
  }

  @Get('statistics')
  getAIStatistics() {
    return this.aiService.getAIStatistics();
  }
}