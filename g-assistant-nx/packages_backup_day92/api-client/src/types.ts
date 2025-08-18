export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    api: string;
    auth: string;
    query: string;
  };
}

export interface AnalysisResult {
  success: boolean;
  analysis: {
    dataPoints: number;
    summary: string;
    insights: string[];
    recommendations: string[];
  };
  timestamp: string;
}