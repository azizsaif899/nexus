export * from './model-selection.strategy';

export interface TaskContext {
  complexity: 'simple' | 'medium' | 'complex';
  type: 'chat' | 'analysis' | 'code' | 'creative';
  urgency: 'low' | 'medium' | 'high';
}

export interface ModelConfig {
  name: string;
  cost: number;
  speed: number;
  quality: number;
}