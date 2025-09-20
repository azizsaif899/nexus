/**
 * 🔗 API Integration Tests
 * اختبارات التكامل لواجهات برمجة التطبيقات
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/api/src/app.module';

describe('🔗 API Integration Tests', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    // Mock the app for testing without actual server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).overrideProvider('DATABASE_CONNECTION')
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Mock auth token for tests
    authToken = 'mock-jwt-token-for-testing';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Endpoints', () => {
    it('POST /auth/login should authenticate user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@azizsys.com',
          password: 'test123'
        });

      expect(response.status).toBe(200);
      expect(response.body.access_token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('GET /auth/profile should return user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@azizsys.com');
    });
  });

  describe('CRM Endpoints', () => {
    it('GET /api/v1/crm/leads should return leads list', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/crm/leads')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it('POST /api/v1/crm/leads should create new lead', async () => {
      const newLead = {
        name: 'Test Lead',
        email: 'lead@test.com',
        phone: '+966501234567',
        company: 'Test Company'
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/crm/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newLead);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(newLead.name);
    });

    it('PUT /api/v1/crm/leads/:id should update lead', async () => {
      const leadId = 1;
      const updateData = { stage: 'Qualified' };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/crm/leads/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.stage).toBe('Qualified');
    });
  });

  describe('AI Endpoints', () => {
    it('POST /api/v1/ai/query should process natural language', async () => {
      const query = {
        text: 'العملاء المحتملون في الرياض',
        context: 'crm'
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/ai/query')
        .set('Authorization', `Bearer ${authToken}`)
        .send(query);

      expect(response.status).toBe(200);
      expect(response.body.intent).toBe('search_leads');
      expect(response.body.filters).toBeDefined();
    });

    it('POST /api/v1/ai/recommendations should get smart suggestions', async () => {
      const leadData = {
        id: 1,
        stage: 'Qualified',
        score: 85
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/ai/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(leadData);

      expect(response.status).toBe(200);
      expect(response.body.recommendations).toBeInstanceOf(Array);
      expect(response.body.recommendations[0].action).toBeDefined();
    });
  });

  describe('Research Endpoints', () => {
    it('POST /api/v1/research/search should perform intelligent search', async () => {
      const searchQuery = {
        query: 'latest AI trends in CRM',
        sources: ['web', 'academic'],
        language: 'ar'
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/research/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send(searchQuery);

      expect(response.status).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
      expect(response.body.citations).toBeDefined();
    });
  });

  describe('Analytics Endpoints', () => {
    it('GET /api/v1/analytics/dashboard should return dashboard data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ period: '30d' });

      expect(response.status).toBe(200);
      expect(response.body.metrics).toBeDefined();
      expect(response.body.charts).toBeDefined();
    });

    it('GET /api/v1/analytics/performance should return performance metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/analytics/performance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.cpu).toBeDefined();
      expect(response.body.memory).toBeDefined();
      expect(response.body.responseTime).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should return 401 for unauthorized requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/crm/leads');

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/non-existent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should handle validation errors', async () => {
      const invalidLead = {
        name: '', // اسم فارغ
        email: 'invalid-email' // إيميل غير صحيح
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/crm/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidLead);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});