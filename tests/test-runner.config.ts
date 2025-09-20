/**
 * 🧪 Test Runner Configuration - AzizSys v2.0
 * نظام تشغيل الاختبارات الشامل والمتكامل
 */

export interface TestConfig {
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  timeout: number;
  retries: number;
  parallel: boolean;
  coverage: boolean;
}

export const testConfigs: Record<string, TestConfig> = {
  unit: {
    type: 'unit',
    timeout: 5000,
    retries: 2,
    parallel: true,
    coverage: true
  },
  integration: {
    type: 'integration',
    timeout: 30000,
    retries: 1,
    parallel: false,
    coverage: true
  },
  e2e: {
    type: 'e2e',
    timeout: 60000,
    retries: 3,
    parallel: false,
    coverage: false
  },
  performance: {
    type: 'performance',
    timeout: 120000,
    retries: 0,
    parallel: false,
    coverage: false
  },
  security: {
    type: 'security',
    timeout: 45000,
    retries: 1,
    parallel: false,
    coverage: false
  }
};

export const testSuites = {
  core: ['packages/core-logic', 'packages/ai-engine', 'packages/security-core'],
  apps: ['apps/api', 'apps/admin-dashboard', 'apps/web-chatbot'],
  integrations: ['packages/odoo-client', 'packages/whatsapp-core'],
  advanced: ['packages/ml-core', 'packages/research-core']
};