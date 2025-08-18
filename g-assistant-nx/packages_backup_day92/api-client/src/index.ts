import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
  token: string;
  expiresIn: string;
}

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
}

export class AzizSysApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:3333/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.client.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post('/auth/logout');
    this.clearToken();
    return response.data;
  }

  async validateToken(token: string): Promise<{ success: boolean; user: any }> {
    const response = await this.client.post('/auth/validate', { token });
    return response.data;
  }

  // Query endpoints
  async query(request: QueryRequest): Promise<QueryResponse> {
    const response: AxiosResponse<QueryResponse> = await this.client.post('/query', request);
    return response.data;
  }

  async analyzeData(data: any): Promise<any> {
    const response = await this.client.post('/query/analyze', data);
    return response.data;
  }

  // Health endpoint
  async getHealth(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new AzizSysApiClient();

// Export types
export * from './types';