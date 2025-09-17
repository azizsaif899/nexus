export interface QueryRequest {
  prompt: string;
  context?: string;
  language?: string;
}

export interface QueryResponse {
  success: boolean;
  query: string;
  response: string;
  timestamp: string;
  processingTime: number;
  confidence: number;
  context: string;
  sessionId: string;
}

export class ApiService {
  private baseUrl = 'http://localhost:3333/api';
  private token: string | null = null;

  async sendQuery(queryRequest: QueryRequest): Promise<QueryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
        body: JSON.stringify(queryRequest),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Query error:', error);
      return {
        success: false,
        query: queryRequest.prompt,
        response: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
        processingTime: 0,
        confidence: 0,
        context: queryRequest.context || 'general',
        sessionId: ''
      };
    }
  }
}

export const apiService = new ApiService();