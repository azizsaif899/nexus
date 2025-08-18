/**
 * Types للـ Gemini Research Agent - محول من Python
 */

// State Types (محول من state.py)
export interface OverallState {
  messages: Message[];
  searchQuery: Query[];
  webResearchResult: string[];
  sourcesGathered: Source[];
  initialSearchQueryCount: number;
  maxResearchLoops: number;
  researchLoopCount: number;
  reasoningModel: string;
}

export interface ReflectionState {
  isSufficient: boolean;
  knowledgeGap: string;
  followUpQueries: string[];
  researchLoopCount: number;
  numberOfRanQueries: number;
}

export interface QueryGenerationState {
  searchQuery: Query[];
}

export interface WebSearchState {
  searchQuery: string;
  id: string;
}

export interface Query {
  query: string;
  rationale: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Source {
  url: string;
  title: string;
  snippet: string;
  shortUrl?: string;
  value?: string;
  relevanceScore: number;
  segments?: SourceSegment[];
}

export interface SourceSegment {
  short_url: string;
  value: string;
  title: string;
  snippet: string;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  metadata?: any;
}

export interface Citation {
  segments: SourceSegment[];
  text: string;
  startIndex: number;
  endIndex: number;
}

export interface Reflection {
  isSufficient: boolean;
  knowledgeGap: string;
  followUpQueries: string[];
}

export interface SearchQueryList {
  query: Query[];
}

// Configuration Types
export interface GeminiResearchConfig {
  geminiApiKey: string;
  googleSearchApiKey?: string;
  queryGeneratorModel?: string;
  reflectionModel?: string;
  answerModel?: string;
  numberOfInitialQueries?: number;
  maxResearchLoops?: number;
  temperature?: number;
  maxRetries?: number;
}

// Result Types
export interface ResearchResult {
  answer: string;
  sources: Source[];
  searchQueries: string[];
  researchLoops: number;
  confidence: number;
  timestamp: Date;
  citations: Citation[];
}

// Graph Node Types
export type GraphNode = 
  | 'generate_query'
  | 'web_research' 
  | 'reflection'
  | 'finalize_answer';

export interface NodeResult {
  [key: string]: any;
}

// API Response Types
export interface GoogleSearchResponse {
  candidates: Array<{
    grounding_metadata: {
      grounding_chunks: Array<{
        web: {
          uri: string;
          title: string;
        };
      }>;
    };
  }>;
  text: string;
}

export interface WebSearchResponse {
  sourcesGathered: Source[];
  searchQuery: string[];
  webResearchResult: string[];
}

// Frontend Component Types
export interface ActivityTimelineProps {
  activities: Activity[];
  isLoading?: boolean;
}

export interface Activity {
  id: string;
  type: 'query' | 'search' | 'reflection' | 'answer';
  title: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'running' | 'completed' | 'error';
  data?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  citations?: Citation[];
}

export interface ChatMessagesViewProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSourceClick?: (source: Source) => void;
}

export interface InputFormProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export interface WelcomeScreenProps {
  onGetStarted: () => void;
  examples?: string[];
}