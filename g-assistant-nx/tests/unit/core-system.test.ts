/**
 * 🧪 Core System Unit Tests
 * اختبارات الوحدة للنظام الأساسي
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AIEngine } from '../../packages/ai-engine/src/ai-engine';
import { SecurityCore } from '../../packages/security-core/src/security-core';
import { CoreLogic } from '../../packages/core-logic/src/core-logic';

describe('🔧 Core System Tests', () => {
  let aiEngine: AIEngine;
  let securityCore: SecurityCore;
  let coreLogic: CoreLogic;

  beforeEach(() => {
    aiEngine = new AIEngine();
    securityCore = new SecurityCore();
    coreLogic = new CoreLogic();
  });

  describe('AI Engine', () => {
    it('should initialize with default configuration', () => {
      expect(aiEngine.isInitialized()).toBe(true);
      expect(aiEngine.getModels()).toHaveLength(8);
    });

    it('should process natural language queries', async () => {
      const query = 'العملاء المحتملون في الرياض';
      const result = await aiEngine.processQuery(query);
      
      expect(result).toBeDefined();
      expect(result.intent).toBe('search_leads');
      expect(result.filters).toContain('city:Riyadh');
    });

    it('should generate smart recommendations', async () => {
      const leadData = { stage: 'Qualified', score: 85 };
      const recommendation = await aiEngine.getRecommendation(leadData);
      
      expect(recommendation.action).toBeDefined();
      expect(recommendation.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('Security Core', () => {
    it('should validate authentication tokens', () => {
      const validToken = 'valid.jwt.token';
      const result = securityCore.validateToken(validToken);
      
      expect(result.isValid).toBe(true);
      expect(result.payload).toBeDefined();
    });

    it('should encrypt sensitive data', () => {
      const sensitiveData = 'user_password_123';
      const encrypted = securityCore.encrypt(sensitiveData);
      
      expect(encrypted).not.toBe(sensitiveData);
      expect(encrypted.length).toBeGreaterThan(20);
    });

    it('should detect security threats', async () => {
      const suspiciousRequest = {
        ip: '192.168.1.100',
        userAgent: 'malicious-bot',
        attempts: 10
      };
      
      const threat = await securityCore.analyzeThreat(suspiciousRequest);
      expect(threat.riskLevel).toBe('HIGH');
    });
  });

  describe('Core Logic', () => {
    it('should handle business workflows', async () => {
      const workflow = {
        type: 'lead_qualification',
        data: { name: 'Test Lead', email: 'test@example.com' }
      };
      
      const result = await coreLogic.executeWorkflow(workflow);
      expect(result.status).toBe('completed');
      expect(result.nextSteps).toBeDefined();
    });

    it('should manage data transformations', () => {
      const rawData = { id: 1, name: 'Test', stage_id: [2, 'Qualified'] };
      const transformed = coreLogic.transformData(rawData);
      
      expect(transformed.stage).toBe('Qualified');
      expect(transformed.id).toBe(1);
    });
  });

  afterEach(() => {
    // تنظيف الموارد
    aiEngine?.cleanup();
    securityCore?.cleanup();
    coreLogic?.cleanup();
  });
});