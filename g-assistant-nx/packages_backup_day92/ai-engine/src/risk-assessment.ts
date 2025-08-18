import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventBus } from '@azizsys/core-logic';

export interface RiskFactor {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'strategic' | 'compliance' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  impact: number; // 0-100
  riskScore: number; // probability * impact
  description: string;
  indicators: string[];
  mitigation: MitigationStrategy[];
}

export interface MitigationStrategy {
  id: string;
  strategy: string;
  cost: number;
  effectiveness: number; // 0-1
  timeframe: string;
  resources: string[];
}

export interface RiskAssessmentResult {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  totalRiskScore: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
  priorityActions: MitigationStrategy[];
}

export class RiskAssessmentEngine {
  private genAI: GoogleGenerativeAI;
  private eventBus: EventBus;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.eventBus = EventBus.getInstance();
  }

  async assessRisks(context: {
    businessType: string;
    currentMetrics: Record<string, number>;
    plannedChanges: Record<string, any>;
    marketConditions: string[];
    timeframe: string;
  }): Promise<RiskAssessmentResult> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Conduct a comprehensive risk assessment for a ${context.businessType} business.
        
        Current Business Metrics:
        ${JSON.stringify(context.currentMetrics, null, 2)}
        
        Planned Changes:
        ${JSON.stringify(context.plannedChanges, null, 2)}
        
        Market Conditions:
        ${context.marketConditions.join(', ')}
        
        Timeframe: ${context.timeframe}
        
        Identify and analyze potential risks across all categories:
        - Financial risks (cash flow, profitability, funding)
        - Operational risks (supply chain, technology, human resources)
        - Strategic risks (competition, market changes, innovation)
        - Compliance risks (regulatory, legal, environmental)
        - Market risks (demand fluctuation, economic conditions)
        
        For each risk, provide:
        - Severity level (low/medium/high/critical)
        - Probability (0-1)
        - Impact score (0-100)
        - Early warning indicators
        - Specific mitigation strategies with costs and effectiveness
        
        Return structured JSON with comprehensive risk analysis.
      `;

      const result = await model.generateContent(prompt);
      const aiAnalysis = JSON.parse(result.response.text());

      // Process and enhance AI analysis
      const riskFactors = await this.processRiskFactors(aiAnalysis.risks || []);
      const overallRiskLevel = this.calculateOverallRiskLevel(riskFactors);
      const totalRiskScore = this.calculateTotalRiskScore(riskFactors);
      const recommendations = await this.generateRecommendations(riskFactors, context);
      const priorityActions = this.identifyPriorityActions(riskFactors);

      const assessment: RiskAssessmentResult = {
        overallRiskLevel,
        totalRiskScore,
        riskFactors,
        recommendations,
        priorityActions
      };

      this.eventBus.emit('risk:assessment:completed', { assessment, context });
      return assessment;

    } catch (error) {
      this.eventBus.emit('risk:assessment:error', { error: error.message, context });
      throw error;
    }
  }

  private async processRiskFactors(rawRisks: any[]): Promise<RiskFactor[]> {
    return rawRisks.map((risk, index) => ({
      id: `risk_${Date.now()}_${index}`,
      name: risk.name || `Risk ${index + 1}`,
      category: risk.category || 'operational',
      severity: risk.severity || 'medium',
      probability: Math.min(1, Math.max(0, risk.probability || 0.5)),
      impact: Math.min(100, Math.max(0, risk.impact || 50)),
      riskScore: (risk.probability || 0.5) * (risk.impact || 50),
      description: risk.description || '',
      indicators: risk.indicators || [],
      mitigation: (risk.mitigation || []).map((m: any, mIndex: number) => ({
        id: `mitigation_${Date.now()}_${index}_${mIndex}`,
        strategy: m.strategy || '',
        cost: m.cost || 0,
        effectiveness: Math.min(1, Math.max(0, m.effectiveness || 0.5)),
        timeframe: m.timeframe || '1-3 months',
        resources: m.resources || []
      }))
    }));
  }

  private calculateOverallRiskLevel(riskFactors: RiskFactor[]): 'low' | 'medium' | 'high' | 'critical' {
    const totalScore = this.calculateTotalRiskScore(riskFactors);
    const criticalRisks = riskFactors.filter(r => r.severity === 'critical').length;
    const highRisks = riskFactors.filter(r => r.severity === 'high').length;

    if (criticalRisks > 0 || totalScore > 300) return 'critical';
    if (highRisks > 2 || totalScore > 200) return 'high';
    if (totalScore > 100) return 'medium';
    return 'low';
  }

  private calculateTotalRiskScore(riskFactors: RiskFactor[]): number {
    return riskFactors.reduce((total, risk) => total + risk.riskScore, 0);
  }

  private async generateRecommendations(
    riskFactors: RiskFactor[], 
    context: any
  ): Promise<string[]> {
    const highRisks = riskFactors.filter(r => r.severity === 'high' || r.severity === 'critical');
    
    const recommendations = [
      'Implement continuous risk monitoring system',
      'Establish risk management committee',
      'Create contingency plans for high-impact scenarios'
    ];

    // Add specific recommendations based on risk categories
    const categories = [...new Set(riskFactors.map(r => r.category))];
    categories.forEach(category => {
      const categoryRisks = riskFactors.filter(r => r.category === category);
      const avgScore = categoryRisks.reduce((sum, r) => sum + r.riskScore, 0) / categoryRisks.length;
      
      if (avgScore > 30) {
        recommendations.push(`Focus on ${category} risk mitigation strategies`);
      }
    });

    return recommendations;
  }

  private identifyPriorityActions(riskFactors: RiskFactor[]): MitigationStrategy[] {
    const allStrategies = riskFactors.flatMap(r => r.mitigation);
    
    // Sort by effectiveness/cost ratio and risk score
    return allStrategies
      .map(strategy => {
        const parentRisk = riskFactors.find(r => r.mitigation.includes(strategy));
        const priority = parentRisk ? 
          (strategy.effectiveness / Math.max(1, strategy.cost / 1000)) * parentRisk.riskScore : 0;
        return { ...strategy, priority };
      })
      .sort((a, b) => (b as any).priority - (a as any).priority)
      .slice(0, 5); // Top 5 priority actions
  }

  async monitorRiskIndicators(riskFactors: RiskFactor[]): Promise<{
    alerts: Array<{
      riskId: string;
      indicator: string;
      status: 'normal' | 'warning' | 'critical';
      value: number;
      threshold: number;
    }>;
  }> {
    // This would integrate with real-time data sources
    const alerts = riskFactors.flatMap(risk => 
      risk.indicators.map(indicator => ({
        riskId: risk.id,
        indicator,
        status: 'normal' as const,
        value: Math.random() * 100,
        threshold: 75
      }))
    );

    this.eventBus.emit('risk:indicators:monitored', { alerts });
    return { alerts };
  }

  async updateRiskAssessment(
    riskId: string, 
    updates: Partial<RiskFactor>
  ): Promise<RiskFactor> {
    // Update risk factor with new information
    const updatedRisk = { ...updates, id: riskId } as RiskFactor;
    
    // Recalculate risk score
    updatedRisk.riskScore = updatedRisk.probability * updatedRisk.impact;
    
    this.eventBus.emit('risk:updated', { riskId, updates: updatedRisk });
    return updatedRisk;
  }
}