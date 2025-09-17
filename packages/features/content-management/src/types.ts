// Content Management Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export enum ContentType {
  ARTICLE = 'article',
  KNOWLEDGE_BASE = 'knowledge_base',
  FAQ = 'faq',
  TUTORIAL = 'tutorial',
  DOCUMENTATION = 'documentation',
  MEDIA = 'media'
}

export enum ContentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface ContentMetadata {
  description?: string;
  keywords: string[];
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: number;
  aiSuggestions?: any;
  aiEnhancements?: any;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  content: string;
  metadata: ContentMetadata;
  status: ContentStatus;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  version: number;
  tags: string[];
  categories: string[];
  language: string;
  seo: SEOMetadata;
}

export interface CreateContentRequest {
  type: ContentType;
  title: string;
  content: string;
  metadata: Partial<ContentMetadata>;
  tags?: string[];
  categories?: string[];
  language?: string;
  requiresApproval?: boolean;
}

export interface UpdateContentRequest {
  title?: string;
  content?: string;
  metadata?: Partial<ContentMetadata>;
  tags?: string[];
  categories?: string[];
  status?: ContentStatus;
}

export interface SearchQuery {
  query: string;
  filters?: {
    type?: ContentType[];
    status?: ContentStatus[];
    author?: string[];
    tags?: string[];
    categories?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

export interface SearchResults {
  results: ContentItem[];
  totalCount: number;
  facets: SearchFacets;
  suggestions: string[];
}

export interface SearchFacets {
  types: { [key: string]: number };
  authors: { [key: string]: number };
  tags: { [key: string]: number };
  categories: { [key: string]: number };
}

export interface KnowledgeItem {
  id: string;
  content: string;
  metadata: KnowledgeMetadata;
  embeddings: number[];
  entities: Entity[];
  relationships: Relationship[];
  createdAt: Date;
  confidence: number;
}

export interface KnowledgeMetadata {
  source: string;
  type: 'fact' | 'procedure' | 'concept' | 'example';
  domain: string;
  reliability: number;
  lastVerified?: Date;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  confidence: number;
  properties: Record<string, any>;
}

export interface SearchContext {
  userId?: string;
  sessionId?: string;
  previousQueries?: string[];
  userPreferences?: Record<string, any>;
}

export interface KnowledgeSearchResults {
  answer?: GeneratedAnswer;
  sources: SearchResult[];
  confidence: number;
  relatedQuestions: string[];
  learningPath?: LearningPathItem[];
}

export interface GeneratedAnswer {
  answer: string;
  confidence: number;
  sources: string[];
}

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  type: 'semantic' | 'graph' | 'expert';
  metadata: any;
}

export interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prerequisites: string[];
}

export interface ContentPrompt {
  description: string;
  type: ContentType;
  audience: string;
  tone?: 'formal' | 'casual' | 'technical' | 'friendly';
  length?: 'short' | 'medium' | 'long';
}

export interface GeneratedContent {
  content: string;
  suggestions: string[];
  seoScore: number;
  readabilityScore: number;
}

export interface ContentEnhancements {
  suggestedTags: string[];
  summary: string;
  grammarSuggestions: string[];
  seoOptimizations: string[];
  relatedTopics: string[];
}

export interface TranslationResult {
  translatedContent: string;
  confidence: number;
  suggestions: string[];
  qualityScore: number;
}