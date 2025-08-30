/**
 * Types للـ October Implementation
 */

export interface OctoberConfig {
  geminiApiKey: string;
  googleSearchApiKey?: string;
  maxSearchLoops?: number;
  enableCitations?: boolean;
  enableStreaming?: boolean;
}

export interface ResearchResult {
  query: string;
  answer: string;
  sources: Source[];
  searchSteps: SearchStep[];
  confidence: number;
  timestamp: Date;
}

export interface Source {
  url: string;
  title: string;
  snippet: string;
  relevanceScore: number;
  domain?: string;
  publishDate?: Date;
}

export interface SearchStep {
  step: number;
  query: string;
  results: number;
  reflection: string;
  nextAction: 'continue' | 'finalize';
  duration: number;
}

export interface Citation {
  id: string;
  source: Source;
  text: string;
  context: string;
  confidence: number;
}

export interface SearchMetrics {
  totalSearches: number;
  avgResponseTime: number;
  successRate: number;
  topDomains: string[];
}