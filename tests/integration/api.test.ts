import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../apps/api/src/app.module';

describe('API Integration Tests', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token for protected routes
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Endpoints', () => {
    describe('POST /auth/login', () => {
      it('should login with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'testuser',
            password: 'testpass'
          })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.success).toBe(true);
      });

      it('should reject invalid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: 'invalid',
            password: 'invalid'
          })
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Invalid credentials');
      });

      it('should validate required fields', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({})
          .expect(400);

        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'test' })
          .expect(400);
      });

      it('should handle SQL injection attempts', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: "admin'; DROP TABLE users; --",
            password: 'password'
          })
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('POST /auth/logout', () => {
      it('should logout successfully with valid token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/logout')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('should reject requests without token', async () => {
        await request(app.getHttpServer())
          .post('/auth/logout')
          .expect(401);
      });
    });
  });

  describe('Query Endpoints', () => {
    describe('POST /query', () => {
      it('should process valid queries', async () => {
        const response = await request(app.getHttpServer())
          .post('/query')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            prompt: 'What is artificial intelligence?',
            context: 'general'
          })
          .expect(200);

        expect(response.body).toHaveProperty('response');
        expect(response.body).toHaveProperty('confidence');
        expect(response.body.success).toBe(true);
        expect(typeof response.body.response).toBe('string');
        expect(response.body.confidence).toBeGreaterThan(0);
      });

      it('should handle Arabic queries', async () => {
        const response = await request(app.getHttpServer())
          .post('/query')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            prompt: 'ما هو الذكاء الاصطناعي؟',
            context: 'general'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.response).toBeTruthy();
      });

      it('should reject empty queries', async () => {
        await request(app.getHttpServer())
          .post('/query')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            prompt: '',
            context: 'general'
          })
          .expect(400);
      });

      it('should handle long queries', async () => {
        const longPrompt = 'A'.repeat(5000);
        
        const response = await request(app.getHttpServer())
          .post('/query')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            prompt: longPrompt,
            context: 'general'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('should require authentication', async () => {
        await request(app.getHttpServer())
          .post('/query')
          .send({
            prompt: 'Test query',
            context: 'general'
          })
          .expect(401);
      });
    });
  });

  describe('User Management Endpoints', () => {
    describe('GET /users', () => {
      it('should return user list for authenticated users', async () => {
        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('should support pagination', async () => {
        const response = await request(app.getHttpServer())
          .get('/users?page=1&limit=5')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(5);
      });

      it('should require authentication', async () => {
        await request(app.getHttpServer())
          .get('/users')
          .expect(401);
      });
    });

    describe('GET /users/:id', () => {
      it('should return specific user', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('username');
        expect(response.body).not.toHaveProperty('password');
      });

      it('should return 404 for non-existent user', async () => {
        await request(app.getHttpServer())
          .get('/users/99999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });
  });

  describe('WhatsApp Endpoints', () => {
    describe('GET /webhook/whatsapp', () => {
      it('should verify webhook with correct token', async () => {
        const response = await request(app.getHttpServer())
          .get('/webhook/whatsapp')
          .query({
            'hub.mode': 'subscribe',
            'hub.verify_token': process.env.WHATSAPP_VERIFY_TOKEN || 'test_token',
            'hub.challenge': 'test_challenge'
          })
          .expect(200);

        expect(response.text).toBe('test_challenge');
      });

      it('should reject webhook with incorrect token', async () => {
        await request(app.getHttpServer())
          .get('/webhook/whatsapp')
          .query({
            'hub.mode': 'subscribe',
            'hub.verify_token': 'wrong_token',
            'hub.challenge': 'test_challenge'
          })
          .expect(403);
      });
    });

    describe('POST /webhook/whatsapp', () => {
      it('should process valid WhatsApp webhook', async () => {
        const webhookPayload = {
          object: 'whatsapp_business_account',
          entry: [{
            id: 'entry_id',
            changes: [{
              value: {
                messaging_product: 'whatsapp',
                metadata: { phone_number_id: 'test_id' },
                messages: [{
                  id: 'msg_id',
                  from: '1234567890',
                  timestamp: '1234567890',
                  text: { body: 'Hello' },
                  type: 'text'
                }]
              },
              field: 'messages'
            }]
          }]
        };

        const response = await request(app.getHttpServer())
          .post('/webhook/whatsapp')
          .set('x-hub-signature-256', 'sha256=test_signature')
          .send(webhookPayload)
          .expect(200);

        expect(response.body.status).toBe('success');
      });

      it('should reject webhook without signature', async () => {
        await request(app.getHttpServer())
          .post('/webhook/whatsapp')
          .send({ test: 'data' })
          .expect(500);
      });
    });
  });

  describe('Monitoring Endpoints', () => {
    describe('GET /monitoring/health', () => {
      it('should return health status', async () => {
        const response = await request(app.getHttpServer())
          .get('/monitoring/health')
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('metrics');
      });
    });

    describe('GET /monitoring/metrics', () => {
      it('should return system metrics', async () => {
        const response = await request(app.getHttpServer())
          .get('/monitoring/metrics')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should filter metrics by name', async () => {
        const response = await request(app.getHttpServer())
          .get('/monitoring/metrics?name=api_response_time')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  describe('Security Endpoints', () => {
    describe('GET /security/threats', () => {
      it('should return threat information', async () => {
        const response = await request(app.getHttpServer())
          .get('/security/threats')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should filter threats by severity', async () => {
        const response = await request(app.getHttpServer())
          .get('/security/threats?severity=high')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('GET /security/compliance', () => {
      it('should return compliance status', async () => {
        const response = await request(app.getHttpServer())
          .get('/security/compliance')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('totalStandards');
        expect(response.body).toHaveProperty('averageCompliance');
      });
    });
  });

  describe('AI Endpoints', () => {
    describe('POST /ai/nlp/process', () => {
      it('should process text with NLP', async () => {
        const response = await request(app.getHttpServer())
          .post('/ai/nlp/process')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            text: 'This is a great product!',
            language: 'en'
          })
          .expect(200);

        expect(response.body).toHaveProperty('sentiment');
        expect(response.body).toHaveProperty('entities');
        expect(response.body).toHaveProperty('keywords');
      });
    });

    describe('POST /ai/predict/user-behavior', () => {
      it('should predict user behavior', async () => {
        const response = await request(app.getHttpServer())
          .post('/ai/predict/user-behavior')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            userId: 'test_user',
            features: {
              activity: 0.8,
              engagement: 0.6,
              recency: 0.9
            }
          })
          .expect(200);

        expect(response.body).toHaveProperty('churnProbability');
        expect(response.body).toHaveProperty('nextAction');
        expect(response.body).toHaveProperty('engagementScore');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent endpoints', async () => {
      await request(app.getHttpServer())
        .get('/non-existent-endpoint')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      await request(app.getHttpServer())
        .post('/query')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });

    it('should handle large payloads', async () => {
      const largePayload = {
        prompt: 'A'.repeat(100000),
        context: 'test'
      };

      const response = await request(app.getHttpServer())
        .post('/query')
        .set('Authorization', `Bearer ${authToken}`)
        .send(largePayload);

      expect([200, 413]).toContain(response.status); // Either success or payload too large
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = Array.from({ length: 20 }, () =>
        request(app.getHttpServer())
          .post('/query')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            prompt: 'Rate limit test',
            context: 'test'
          })
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app.getHttpServer())
        .options('/query')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeTruthy();
      expect(response.headers['access-control-allow-methods']).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .get('/monitoring/health')
        .expect(200);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle concurrent requests', async () => {
      const concurrentRequests = Array.from({ length: 10 }, () =>
        request(app.getHttpServer())
          .get('/monitoring/health')
      );

      const startTime = Date.now();
      const responses = await Promise.all(concurrentRequests);
      const duration = Date.now() - startTime;

      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});