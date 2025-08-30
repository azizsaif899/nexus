/**
 * 🤖 Sidebar Agents Unit Tests
 * اختبارات الوحدة للوكلاء الذكيين في السايد بار
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CFOAgent } from '../../packages/ui/sidebar-agents/src/agents/CFOAgent';
import { DeveloperAgent } from '../../packages/ui/sidebar-agents/src/agents/DeveloperAgent';
import { DatabaseManager } from '../../packages/ui/sidebar-agents/src/agents/DatabaseManagerAgent';
import { OperationsAgent } from '../../packages/ui/sidebar-agents/src/agents/OperationsAgent';
import { GeneralAgent } from '../../packages/ui/sidebar-agents/src/agents/GeneralAgent';

describe('🤖 Sidebar Agents Tests', () => {
  describe('CFO Agent', () => {
    let cfoAgent: CFOAgent;

    beforeEach(() => {
      cfoAgent = new CFOAgent();
    });

    it('should analyze financial data', async () => {
      const financialData = {
        revenue: 100000,
        expenses: 75000,
        profit: 25000
      };

      const analysis = await cfoAgent.analyzeFinancials(financialData);
      
      expect(analysis.profitMargin).toBe(25);
      expect(analysis.recommendations).toBeDefined();
      expect(analysis.riskLevel).toBe('LOW');
    });

    it('should generate budget forecasts', async () => {
      const historicalData = [
        { month: 'Jan', revenue: 80000 },
        { month: 'Feb', revenue: 85000 },
        { month: 'Mar', revenue: 90000 }
      ];

      const forecast = await cfoAgent.generateForecast(historicalData);
      
      expect(forecast.nextMonth.revenue).toBeGreaterThan(90000);
      expect(forecast.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Developer Agent', () => {
    let devAgent: DeveloperAgent;

    beforeEach(() => {
      devAgent = new DeveloperAgent();
    });

    it('should review code quality', async () => {
      const codeSnippet = `
        function calculateTotal(items) {
          let total = 0;
          for (let i = 0; i < items.length; i++) {
            total += items[i].price;
          }
          return total;
        }
      `;

      const review = await devAgent.reviewCode(codeSnippet);
      
      expect(review.score).toBeGreaterThanOrEqual(7);
      expect(review.suggestions).toContain('Use array methods');
    });

    it('should detect security vulnerabilities', async () => {
      const vulnerableCode = `
        const query = "SELECT * FROM users WHERE id = " + userId;
      `;

      const security = await devAgent.scanSecurity(vulnerableCode);
      
      expect(security.vulnerabilities).toHaveLength(1);
      expect(security.vulnerabilities[0].type).toBe('SQL_INJECTION');
    });
  });

  describe('Database Manager', () => {
    let dbManager: DatabaseManager;

    beforeEach(() => {
      dbManager = new DatabaseManager();
    });

    it('should optimize database queries', async () => {
      const slowQuery = 'SELECT * FROM large_table WHERE column LIKE "%search%"';
      
      const optimized = await dbManager.optimizeQuery(slowQuery);
      
      expect(optimized.query).toContain('INDEX');
      expect(optimized.estimatedImprovement).toBeGreaterThan(50);
    });

    it('should monitor database health', async () => {
      const health = await dbManager.checkHealth();
      
      expect(health.status).toBe('healthy');
      expect(health.connections).toBeLessThan(100);
      expect(health.responseTime).toBeLessThan(100);
    });
  });

  describe('Operations Agent', () => {
    let opsAgent: OperationsAgent;

    beforeEach(() => {
      opsAgent = new OperationsAgent();
    });

    it('should monitor system performance', async () => {
      const metrics = await opsAgent.getSystemMetrics();
      
      expect(metrics.cpu).toBeLessThan(80);
      expect(metrics.memory).toBeLessThan(85);
      expect(metrics.disk).toBeLessThan(90);
    });

    it('should handle auto-scaling decisions', async () => {
      const loadData = { cpu: 85, requests: 1000, responseTime: 500 };
      
      const decision = await opsAgent.shouldScale(loadData);
      
      expect(decision.action).toBe('scale_up');
      expect(decision.instances).toBeGreaterThan(1);
    });
  });

  describe('General Agent', () => {
    let generalAgent: GeneralAgent;

    beforeEach(() => {
      generalAgent = new GeneralAgent();
    });

    it('should handle natural language queries', async () => {
      const query = 'ما هو عدد العملاء الجدد هذا الشهر؟';
      
      const response = await generalAgent.processQuery(query);
      
      expect(response.intent).toBe('get_new_customers');
      expect(response.answer).toBeDefined();
    });

    it('should provide contextual help', async () => {
      const context = { page: 'dashboard', user: 'admin' };
      
      const help = await generalAgent.getHelp(context);
      
      expect(help.suggestions.length).toBeGreaterThan(0);
      expect(help.quickActions).toBeDefined();
    });
  });
});