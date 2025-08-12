/**
 * Frontend Components للـ October Implementation
 */

// Component interfaces
export interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface ResultsDisplayProps {
  results: any[];
  loading?: boolean;
  onSourceClick?: (source: any) => void;
}

export interface CitationPanelProps {
  citations: any[];
  onExport?: (format: string) => void;
  style?: 'apa' | 'mla' | 'chicago';
}

export interface SearchMetricsProps {
  metrics: {
    totalSearches: number;
    avgResponseTime: number;
    successRate: number;
  };
}