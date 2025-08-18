/**
 * 🎮 Live Simulation Engine - TASK-016
 * محرك المحاكاة الفورية للقرارات الاستراتيجية
 */

import { eventBus, EventTypes } from './event-bus';

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
  baselineData: Record<string, number>;
  impact: SimulationImpact;
}

export interface SimulationImpact {
  revenue: number;
  costs: number;
  profit: number;
  cashFlow: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface SimulationResult {
  scenarioId: string;
  baseline: Record<string, number>;
  predicted: Record<string, number>;
  impact: SimulationImpact;
  recommendations: string[];
  timestamp: Date;
}

export class SimulationEngine {
  private scenarios: Map<string, SimulationScenario> = new Map();
  private cache: Map<string, SimulationResult> = new Map();

  constructor() {
    this.initializeDefaultScenarios();
  }

  /**
   * تشغيل محاكاة فورية
   */
  async runSimulation(
    scenarioId: string, 
    parameters: Record<string, number>
  ): Promise<SimulationResult> {
    const cacheKey = `${scenarioId}_${JSON.stringify(parameters)}`;
    
    // التحقق من الكاش أولاً
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }

    // حساب التأثير
    const impact = await this.calculateImpact(scenario, parameters);
    const baseline = scenario.baselineData;
    const predicted = this.applyImpact(baseline, impact);

    const result: SimulationResult = {
      scenarioId,
      baseline,
      predicted,
      impact,
      recommendations: await this.generateRecommendations(impact),
      timestamp: new Date()
    };

    // حفظ في الكاش
    this.cache.set(cacheKey, result);

    // إرسال حدث
    await eventBus.publish({
      type: 'simulation.completed',
      source: 'simulation-engine',
      data: { scenarioId, result }
    });

    return result;
  }

  /**
   * إنشاء سيناريو جديد
   */
  createScenario(scenario: Omit<SimulationScenario, 'id'>): string {
    const id = `scenario_${Date.now()}`;
    const fullScenario: SimulationScenario = { ...scenario, id };
    
    this.scenarios.set(id, fullScenario);
    return id;
  }

  /**
   * الحصول على جميع السيناريوهات
   */
  getScenarios(): SimulationScenario[] {
    return Array.from(this.scenarios.values());
  }

  /**
   * محاكاة متعددة السيناريوهات
   */
  async runMultipleScenarios(
    scenarioIds: string[],
    parameters: Record<string, number>
  ): Promise<SimulationResult[]> {
    const results = await Promise.all(
      scenarioIds.map(id => this.runSimulation(id, parameters))
    );

    return results.sort((a, b) => b.impact.profit - a.impact.profit);
  }

  /**
   * حساب التأثير
   */
  private async calculateImpact(
    scenario: SimulationScenario,
    parameters: Record<string, number>
  ): Promise<SimulationImpact> {
    // خوارزمية حساب التأثير المبسطة
    const baseRevenue = scenario.baselineData.revenue || 1000000;
    const baseCosts = scenario.baselineData.costs || 700000;

    // تطبيق المعاملات
    const revenueMultiplier = 1 + (parameters.marketingBudget || 0) * 0.001;
    const costMultiplier = 1 + (parameters.operationalEfficiency || 0) * 0.002;

    const newRevenue = baseRevenue * revenueMultiplier;
    const newCosts = baseCosts * costMultiplier;
    const profit = newRevenue - newCosts;
    const cashFlow = profit * 0.8; // تقدير مبسط

    // تقييم المخاطر
    const riskLevel = this.assessRisk(parameters);
    const confidence = this.calculateConfidence(parameters);

    return {
      revenue: newRevenue - baseRevenue,
      costs: newCosts - baseCosts,
      profit: profit - (baseRevenue - baseCosts),
      cashFlow,
      riskLevel,
      confidence
    };
  }

  /**
   * تطبيق التأثير على البيانات الأساسية
   */
  private applyImpact(
    baseline: Record<string, number>,
    impact: SimulationImpact
  ): Record<string, number> {
    return {
      revenue: (baseline.revenue || 0) + impact.revenue,
      costs: (baseline.costs || 0) + impact.costs,
      profit: (baseline.profit || 0) + impact.profit,
      cashFlow: (baseline.cashFlow || 0) + impact.cashFlow
    };
  }

  /**
   * تقييم المخاطر
   */
  private assessRisk(parameters: Record<string, number>): 'low' | 'medium' | 'high' {
    const riskScore = Object.values(parameters).reduce((sum, val) => sum + Math.abs(val), 0);
    
    if (riskScore < 50) return 'low';
    if (riskScore < 100) return 'medium';
    return 'high';
  }

  /**
   * حساب مستوى الثقة
   */
  private calculateConfidence(parameters: Record<string, number>): number {
    const paramCount = Object.keys(parameters).length;
    const baseConfidence = 0.7;
    const confidenceBoost = Math.min(paramCount * 0.05, 0.25);
    
    return Math.min(baseConfidence + confidenceBoost, 0.95);
  }

  /**
   * توليد التوصيات
   */
  private async generateRecommendations(impact: SimulationImpact): Promise<string[]> {
    const recommendations: string[] = [];

    if (impact.profit > 0) {
      recommendations.push('💰 هذا السيناريو يحقق ربحية إيجابية');
    } else {
      recommendations.push('⚠️ هذا السيناريو قد يؤثر سلباً على الربحية');
    }

    if (impact.riskLevel === 'high') {
      recommendations.push('🚨 مستوى المخاطر عالي - يُنصح بالحذر');
    } else if (impact.riskLevel === 'low') {
      recommendations.push('✅ مستوى المخاطر منخفض - آمن للتنفيذ');
    }

    if (impact.confidence > 0.8) {
      recommendations.push('🎯 مستوى الثقة في التنبؤ عالي');
    }

    return recommendations;
  }

  /**
   * تهيئة السيناريوهات الافتراضية
   */
  private initializeDefaultScenarios(): void {
    const scenarios: Omit<SimulationScenario, 'id'>[] = [
      {
        name: 'زيادة الميزانية التسويقية',
        description: 'تأثير زيادة الإنفاق التسويقي على المبيعات',
        parameters: { marketingBudget: 50000 },
        baselineData: { revenue: 1000000, costs: 700000, profit: 300000 },
        impact: {
          revenue: 150000,
          costs: 50000,
          profit: 100000,
          cashFlow: 80000,
          riskLevel: 'medium',
          confidence: 0.8
        }
      },
      {
        name: 'تحسين الكفاءة التشغيلية',
        description: 'تأثير تحسين العمليات على التكاليف',
        parameters: { operationalEfficiency: 20 },
        baselineData: { revenue: 1000000, costs: 700000, profit: 300000 },
        impact: {
          revenue: 0,
          costs: -100000,
          profit: 100000,
          cashFlow: 80000,
          riskLevel: 'low',
          confidence: 0.9
        }
      },
      {
        name: 'توسع في السوق الجديد',
        description: 'تأثير دخول سوق جديد على الإيرادات',
        parameters: { marketExpansion: 100, marketingBudget: 200000 },
        baselineData: { revenue: 1000000, costs: 700000, profit: 300000 },
        impact: {
          revenue: 500000,
          costs: 250000,
          profit: 250000,
          cashFlow: 200000,
          riskLevel: 'high',
          confidence: 0.6
        }
      }
    ];

    scenarios.forEach(scenario => {
      const id = `default_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.scenarios.set(id, { ...scenario, id });
    });
  }

  /**
   * تنظيف الكاش
   */
  clearCache(): void {
    this.cache.clear();
  }
}