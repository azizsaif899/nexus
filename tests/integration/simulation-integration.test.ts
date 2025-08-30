import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioGenerator } from '@azizsys/ai-engine';
import { ImpactCalculator } from '@azizsys/core-logic';
import { PredictionModels } from '@azizsys/ml-core';
import { WhatIfAnalysis } from '@azizsys/analytics-core';
import { RiskAssessmentEngine, OpportunityDetector } from '@azizsys/ai-engine';

describe('Simulation Integration Tests', () => {
  let scenarioGenerator: ScenarioGenerator;
  let impactCalculator: ImpactCalculator;
  let predictionModels: PredictionModels;
  let whatIfAnalysis: WhatIfAnalysis;
  let riskAssessment: RiskAssessmentEngine;
  let opportunityDetector: OpportunityDetector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenarioGenerator,
        ImpactCalculator,
        PredictionModels,
        WhatIfAnalysis,
        RiskAssessmentEngine,
        OpportunityDetector
      ],
    }).compile();

    scenarioGenerator = module.get<ScenarioGenerator>(ScenarioGenerator);
    impactCalculator = module.get<ImpactCalculator>(ImpactCalculator);
    predictionModels = module.get<PredictionModels>(PredictionModels);
    whatIfAnalysis = module.get<WhatIfAnalysis>(WhatIfAnalysis);
    riskAssessment = module.get<RiskAssessmentEngine>(RiskAssessmentEngine);
    opportunityDetector = module.get<OpportunityDetector>(OpportunityDetector);
  });

  describe('Scenario Generation', () => {
    it('should generate business scenarios', async () => {
      const context = {
        businessType: 'retail',
        currentMetrics: { revenue: 100000, costs: 80000 },
        goals: ['increase revenue', 'reduce costs'],
        constraints: ['limited budget', 'small team']
      };

      const scenarios = await scenarioGenerator.generateScenarios(context);
      
      expect(scenarios).toBeDefined();
      expect(Array.isArray(scenarios)).toBe(true);
    });

    it('should generate what-if scenarios', async () => {
      const baseScenario = {
        id: 'test',
        title: 'Base Scenario',
        description: 'Test scenario',
        probability: 0.8,
        impact: 'medium' as const,
        timeframe: '6 months',
        variables: [],
        outcomes: []
      };

      const changes = { revenue: 10, costs: -5 };
      const result = await scenarioGenerator.generateWhatIfScenario(baseScenario, changes);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe('Impact Calculation', () => {
    it('should calculate scenario impact', () => {
      const scenario = {
        id: 'test',
        title: 'Test Scenario',
        description: 'Test',
        probability: 0.8,
        impact: 'high' as const,
        timeframe: '3 months',
        variables: [],
        outcomes: []
      };

      const variables = [{
        name: 'revenue',
        currentValue: 50,
        suggestedRange: [0, 100] as [number, number],
        unit: '%',
        impact: 0.8
      }];

      const result = impactCalculator.calculateImpact(scenario, variables);
      
      expect(result).toBeDefined();
      expect(result.totalImpact).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('Prediction Models', () => {
    it('should predict revenue', async () => {
      const input = {
        features: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        timeframe: 6,
        context: { historical: [100000, 105000, 110000] }
      };

      const prediction = await predictionModels.predictRevenue(input);
      
      expect(prediction).toBeDefined();
      expect(prediction.value).toBeGreaterThan(0);
      expect(prediction.confidence).toBeGreaterThan(0);
      expect(['up', 'down', 'stable']).toContain(prediction.trend);
    });

    it('should predict costs', async () => {
      const input = {
        features: [1, 2, 3, 4, 5, 6, 7, 8],
        timeframe: 6,
        context: { historical: [80000, 82000, 84000] }
      };

      const prediction = await predictionModels.predictCosts(input);
      
      expect(prediction).toBeDefined();
      expect(prediction.value).toBeGreaterThan(0);
      expect(prediction.confidence).toBeGreaterThan(0);
    });
  });

  describe('What-If Analysis', () => {
    it('should analyze scenarios', async () => {
      const request = {
        baselineData: { revenue: 100000, costs: 80000, profit: 20000 },
        scenarios: [
          { name: 'Optimistic', changes: { revenue: 20, costs: -10 } },
          { name: 'Pessimistic', changes: { revenue: -10, costs: 15 } }
        ],
        timeframe: 12,
        analysisType: 'financial' as const
      };

      const scenarios = await whatIfAnalysis.analyzeScenarios(request);
      
      expect(scenarios).toBeDefined();
      expect(scenarios.length).toBe(2);
      expect(scenarios[0].projectedOutcomes).toBeDefined();
    });

    it('should compare scenarios', async () => {
      const scenarios = [
        {
          id: '1',
          name: 'Scenario 1',
          description: 'Test',
          baselineMetrics: {},
          changes: {},
          projectedOutcomes: [
            {
              metric: 'revenue',
              baselineValue: 100000,
              projectedValue: 120000,
              absoluteChange: 20000,
              percentageChange: 20,
              impact: 'positive' as const
            }
          ],
          confidence: 0.8,
          riskLevel: 'low' as const
        }
      ];

      const comparison = await whatIfAnalysis.compareScenarios(scenarios);
      
      expect(comparison).toBeDefined();
      expect(comparison.bestScenario).toBeDefined();
      expect(comparison.worstScenario).toBeDefined();
    });
  });

  describe('Risk Assessment', () => {
    it('should assess business risks', async () => {
      const context = {
        businessType: 'technology',
        currentMetrics: { revenue: 500000, costs: 400000 },
        plannedChanges: { expansion: 'new market' },
        marketConditions: ['competitive', 'growing'],
        timeframe: '1 year'
      };

      const assessment = await riskAssessment.assessRisks(context);
      
      expect(assessment).toBeDefined();
      expect(assessment.overallRiskLevel).toBeDefined();
      expect(assessment.riskFactors).toBeDefined();
      expect(Array.isArray(assessment.recommendations)).toBe(true);
    });
  });

  describe('Opportunity Detection', () => {
    it('should detect business opportunities', async () => {
      const context = {
        businessType: 'e-commerce',
        currentMetrics: { revenue: 200000, customers: 1000 },
        marketData: { growth: 15, competition: 'medium' },
        competitorAnalysis: [{ name: 'Competitor A', strength: 'pricing' }],
        customerFeedback: ['faster delivery', 'better support'],
        internalCapabilities: ['technology', 'logistics'],
        budget: 50000,
        timeframe: '6 months'
      };

      const opportunities = await opportunityDetector.detectOpportunities(context);
      
      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });

    it('should prioritize opportunities', async () => {
      const opportunities = [
        {
          id: '1',
          title: 'Quick Win',
          description: 'Low cost, high impact',
          category: 'operational' as const,
          priority: 'high' as const,
          potentialValue: 10000,
          investmentRequired: 1000,
          roi: 9,
          timeframe: '2 weeks',
          probability: 0.9,
          riskLevel: 'low' as const,
          requirements: [],
          keyMetrics: [],
          actionPlan: []
        }
      ];

      const prioritized = await opportunityDetector.prioritizeOpportunities(opportunities);
      
      expect(prioritized).toBeDefined();
      expect(prioritized.quickWins).toBeDefined();
      expect(prioritized.majorProjects).toBeDefined();
    });
  });

  describe('Integration Flow', () => {
    it('should complete full simulation workflow', async () => {
      // 1. Generate scenarios
      const context = {
        businessType: 'retail',
        currentMetrics: { revenue: 100000, costs: 80000 },
        goals: ['growth'],
        constraints: ['budget']
      };

      const scenarios = await scenarioGenerator.generateScenarios(context);
      expect(scenarios).toBeDefined();

      // 2. Calculate impact for first scenario
      if (scenarios.length > 0) {
        const impact = impactCalculator.calculateImpact(scenarios[0], scenarios[0].variables);
        expect(impact).toBeDefined();
      }

      // 3. Assess risks
      const riskContext = {
        businessType: context.businessType,
        currentMetrics: context.currentMetrics,
        plannedChanges: { strategy: 'expansion' },
        marketConditions: ['stable'],
        timeframe: '1 year'
      };

      const risks = await riskAssessment.assessRisks(riskContext);
      expect(risks).toBeDefined();

      // 4. Detect opportunities
      const oppContext = {
        ...context,
        marketData: { growth: 10 },
        competitorAnalysis: [],
        customerFeedback: ['quality'],
        internalCapabilities: ['service'],
        budget: 25000,
        timeframe: '6 months'
      };

      const opportunities = await opportunityDetector.detectOpportunities(oppContext);
      expect(opportunities).toBeDefined();
    });
  });
});