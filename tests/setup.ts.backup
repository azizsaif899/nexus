/**
 * 🔧 Test Setup Configuration
 * إعداد الاختبارات العام
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { TestEnvironmentSetup } from './test-scripts/setup-test-environment';

// إعداد بيئة الاختبار العامة
const testSetup = new TestEnvironmentSetup();

beforeAll(async () => {
  // Removed console.log
  
  // تحديد متغيرات البيئة للاختبار
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/azizsys_test';
  process.env.REDIS_URL = 'redis://localhost:6379/1';
  process.env.JWT_SECRET = 'test_jwt_secret_key';
  process.env.LOG_LEVEL = 'error';
  
  try {
    await testSetup.setupEnvironment();
    // Removed console.log
  } catch (error) {
    console.warn('⚠️  تحذير: بعض خدمات الاختبار غير متاحة، سيتم استخدام mocks');
  }
});

afterAll(async () => {
  // Removed console.log
  
  try {
    await testSetup.cleanupEnvironment();
    // Removed console.log
  } catch (error) {
    console.warn('⚠️  تحذير: بعض موارد الاختبار قد تحتاج تنظيف يدوي');
  }
});

beforeEach(() => {
  // إعادة تعيين mocks قبل كل اختبار
  if (typeof vi !== 'undefined') {
    vi.clearAllMocks();
  }
});

afterEach(() => {
  // تنظيف بعد كل اختبار
  if (typeof vi !== 'undefined') {
    vi.restoreAllMocks();
  }
});

// Mock للخدمات الخارجية
export const mockServices = {
  geminiAI: {
    processQuery: vi.fn().mockResolvedValue({
      intent: 'search_leads',
      filters: ['city:Riyadh'],
      confidence: 0.95
    }),
    getRecommendation: vi.fn().mockResolvedValue({
      action: 'SEND_CASE_STUDY',
      confidence: 0.85,
      reason: 'Lead is qualified and interested'
    })
  },
  
  whatsapp: {
    sendMessage: vi.fn().mockResolvedValue({ success: true }),
    getMessages: vi.fn().mockResolvedValue([])
  },
  
  database: {
    query: vi.fn().mockResolvedValue([]),
    execute: vi.fn().mockResolvedValue({ affectedRows: 1 })
  },
  
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1)
  }
};

// Helper functions للاختبارات
export const testHelpers = {
  createMockUser: () => ({
    id: 1,
    email: 'test@azizsys.com',
    role: 'admin',
    createdAt: new Date()
  }),
  
  createMockLead: () => ({
    id: 1,
    name: 'عميل اختبار',
    email: 'lead@test.com',
    phone: '+966501234567',
    city: 'الرياض',
    stage: 'New',
    createdAt: new Date()
  }),
  
  createMockOpportunity: () => ({
    id: 1,
    name: 'فرصة اختبار',
    value: 50000,
    stage: 'Proposal',
    probability: 75,
    createdAt: new Date()
  }),
  
  generateAuthToken: () => 'mock.jwt.token.for.testing',
  
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  expectToBeWithinRange: (actual: number, expected: number, tolerance: number = 0.1) => {
    const diff = Math.abs(actual - expected);
    const maxDiff = expected * tolerance;
    return diff <= maxDiff;
  }
};

// تصدير المتغيرات العامة للاختبارات
export const TEST_CONFIG = {
  API_BASE_URL: 'http://localhost:3001/api/v1',
  WEB_BASE_URL: 'http://localhost:3000',
  TEST_TIMEOUT: 30000,
  PERFORMANCE_THRESHOLD: 1000, // ms
  CONCURRENT_REQUESTS: 50
};

// Removed console.log