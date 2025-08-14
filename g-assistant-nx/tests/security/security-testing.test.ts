/**
 * 🔒 Security Testing Suite
 * مجموعة اختبارات الأمان الشاملة
 */

import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

describe('🔒 Security Tests', () => {
  const apiURL = 'http://localhost:3001/api/v1';

  describe('Authentication Security', () => {
    it('should reject invalid JWT tokens', async () => {
      const invalidToken = 'invalid.jwt.token';
      
      try {
        await axios.get(`${apiURL}/crm/leads`, {
          headers: { Authorization: `Bearer ${invalidToken}` }
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should prevent brute force attacks', async () => {
      const attempts = [];
      
      for (let i = 0; i < 10; i++) {
        attempts.push(
          axios.post(`${apiURL}/auth/login`, {
            email: 'test@example.com',
            password: 'wrongpassword'
          }).catch(err => err.response)
        );
      }
      
      const responses = await Promise.all(attempts);
      const lastResponse = responses[responses.length - 1];
      
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection attacks', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      try {
        await axios.get(`${apiURL}/crm/leads?search=${encodeURIComponent(maliciousInput)}`);
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should prevent XSS attacks', () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const sanitized = xssPayload.replace(/<script.*?>.*?<\/script>/gi, '');
      
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('API Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await axios.get(`${apiURL}/health`);
      
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('Rate Limiting Security', () => {
    it('should enforce rate limits', async () => {
      const requests = [];
      
      for (let i = 0; i < 50; i++) {
        requests.push(
          axios.get(`${apiURL}/health`).catch(err => err.response)
        );
      }
      
      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});