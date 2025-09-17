import axios from 'axios';
import { AzizSysApiClient } from '../src/index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AzizSysApiClient', () => {
  let client: AzizSysApiClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    client = new AzizSysApiClient();
  });

  describe('login', () => {
    it('should login successfully and set token', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          user: { id: 1, username: 'admin', role: 'admin' },
          token: 'mock-jwt-token',
          expiresIn: '24h'
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await client.login({
        username: 'admin',
        password: 'password'
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        username: 'admin',
        password: 'password'
      });

      expect(result.success).toBe(true);
      expect(result.token).toBe('mock-jwt-token');
      expect(client['token']).toBe('mock-jwt-token');
    });

    it('should handle login failure', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid credentials'
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await client.login({
        username: 'wrong',
        password: 'wrong'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
      expect(client['token']).toBeNull();
    });
  });

  describe('query', () => {
    it('should send query successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          query: 'test query',
          response: 'test response',
          timestamp: '2025-01-09T12:00:00.000Z',
          processingTime: 1000,
          confidence: 85,
          context: 'test'
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await client.query({
        prompt: 'test query',
        context: 'test',
        language: 'ar'
      });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/query', {
        prompt: 'test query',
        context: 'test',
        language: 'ar'
      });

      expect(result.success).toBe(true);
      expect(result.response).toBe('test response');
      expect(result.confidence).toBe(85);
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear token', async () => {
      client.setToken('test-token');
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Logout successful'
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await client.logout();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
      expect(result.success).toBe(true);
      expect(client['token']).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: { id: 1, username: 'admin', role: 'admin' }
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await client.validateToken('test-token');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/validate', {
        token: 'test-token'
      });

      expect(result.success).toBe(true);
      expect(result.user.username).toBe('admin');
    });
  });

  describe('analyzeData', () => {
    it('should analyze data successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          analysis: {
            dataPoints: 100,
            summary: 'Analysis complete',
            insights: ['insight 1', 'insight 2']
          }
        }
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const testData = [['col1', 'col2'], ['val1', 'val2']];
      const result = await client.analyzeData(testData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/query/analyze', testData);
      expect(result.success).toBe(true);
      expect(result.analysis.dataPoints).toBe(100);
    });
  });

  describe('getHealth', () => {
    it('should get health status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'healthy',
          timestamp: '2025-01-09T12:00:00.000Z',
          uptime: 3600,
          services: {
            api: 'operational',
            auth: 'operational',
            query: 'operational'
          }
        }
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await client.getHealth();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health');
      expect(result.status).toBe('healthy');
      expect(result.services.api).toBe('operational');
    });
  });

  describe('token management', () => {
    it('should set and clear token correctly', () => {
      expect(client['token']).toBeNull();

      client.setToken('test-token');
      expect(client['token']).toBe('test-token');

      client.clearToken();
      expect(client['token']).toBeNull();
    });
  });
});