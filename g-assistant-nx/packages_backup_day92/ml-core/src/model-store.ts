import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelStore {
  private models = new Map<string, any>();
  private modelMetadata = new Map<string, any>();

  async saveModel(modelId: string, modelData: any, metadata: any): Promise<void> {
    this.models.set(modelId, modelData);
    this.modelMetadata.set(modelId, {
      ...metadata,
      savedAt: new Date(),
      version: this.getNextVersion(modelId)
    });
  }

  async loadModel(modelId: string): Promise<any> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }
    return model;
  }

  async getModelMetadata(modelId: string): Promise<any> {
    return this.modelMetadata.get(modelId);
  }

  async listModels(): Promise<any[]> {
    const modelList = [];
    for (const [id, metadata] of this.modelMetadata.entries()) {
      modelList.push({ id, ...metadata });
    }
    return modelList;
  }

  async deleteModel(modelId: string): Promise<void> {
    this.models.delete(modelId);
    this.modelMetadata.delete(modelId);
  }

  private getNextVersion(modelId: string): number {
    const existing = this.modelMetadata.get(modelId);
    return existing ? existing.version + 1 : 1;
  }
}