/**
 * ⚡ Performance & Load Testing
 * اختبارات الأداء والحمولة
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { performance } from 'perf_hooks';
import axios from 'axios';

describe('⚡ Performance & Load Tests', () => {
  const apiURL = 'http://localhost:3001/api/v1';
  let authToken: string;

  beforeAll(async () => {
    const authResponse = await axios.post(`${apiURL}/auth/login`, {
      email: 'test@azizsys.com',
      password: 'test123'
    });
    authToken = authResponse.data.access_token;
  });

  describe('API Response Time Tests', () => {
    it('should respond to /leads endpoint within 500ms', async () => {
      const startTime = performance.now();
      
      const response = await axios.get(`${apiURL}/crm/leads`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(500);
    });

    it('should handle AI query processing within 2 seconds', async () => {
      const startTime = performance.now();
      
      const response = await axios.post(`${apiURL}/ai/query`, {
        text: 'العملاء المحتملون في الرياض',
        context: 'crm'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(2000);
    });
  });

  describe('Concurrent Load Tests', () => {
    it('should handle 50 concurrent requests', async () => {
      const concurrentRequests = 50;
      const requests = Array(concurrentRequests).fill(null).map(() =>
        axios.get(`${apiURL}/crm/leads`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      );

      const startTime = performance.now();
      const responses = await Promise.all(requests);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const avgResponseTime = totalTime / concurrentRequests;

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(avgResponseTime).toBeLessThan(1000);
    });
  });

  describe('Memory Usage Tests', () => {
    it('should not have memory leaks', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 100; i++) {
        await axios.get(`${apiURL}/crm/leads?page=${i % 10}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // أقل من 10MB
    });
  });
});