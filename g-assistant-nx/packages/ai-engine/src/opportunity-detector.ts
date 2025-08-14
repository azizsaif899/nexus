import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventBus } from '@azizsys/core-logic';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'market' | 'operational' | 'financial' | 'technological' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  potentialValue: number;
  investmentRequired: number;
  roi: number;
  timeframe: string;
  probability: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high';
  requirements: string[];
  keyMetrics: OpportunityMetric[];
  actionPlan: ActionStep[];
}

export interface OpportunityMetric {
  name: string;
  currentValue: number;
  targetValue: number;
  improvement: number;
  unit: string;
}

export interface ActionStep {
  id: string;
  step: string;
  duration: string;
  resources: string[];
  dependencies: string[];
  cost: number;
}

export interface OpportunityDetectionContext {
  businessType: string;
  currentMetrics: Record<string, number>;
  marketData: Record<string, any>;
  competitorAnalysis: any[];
  customerFeedback: string[];
  internalCapabilities: string[];
  budget: number;
  timeframe: string;
}

export class OpportunityDetector {
  private genAI: GoogleGenerativeAI;
  private eventBus: EventBus;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.eventBus = EventBus.getInstance();
  }

  async detectOpportunities(context: OpportunityDetectionContext): Promise<Opportunity[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze business opportunities for a ${context.businessType} company.
        
        Current Business Metrics:
        ${JSON.stringify(context.currentMetrics, null, 2)}
        
        Market Data:
        ${JSON.stringify(context.marketData, null, 2)}
        
        Competitor Analysis:
        ${JSON.stringify(context.competitorAnalysis, null, 2)}
        
        Customer Feedback Themes:
        ${context.customerFeedback.join(', ')}
        
        Internal Capabilities:
        ${context.internalCapabilities.join(', ')}
        
        Available Budget: $${context.budget}
        Timeframe: ${context.timeframe}
        
        Identify strategic opportunities across categories:
        - Market opportunities (new segments, geographic expansion, partnerships)
        - Operational opportunities (efficiency improvements, automation, process optimization)
        - Financial opportunities (cost reduction, revenue optimization, new revenue streams)
        - Technological opportunities (digital transformation, AI implementation, system upgrades)
        - Strategic opportunities (acquisitions, diversification, innovation)
        
        For each opportunity, provide:
        - Detailed description and rationale
        - Priority level based on impact and feasibility
        - Potential financial value and required investment
        - ROI calculation and probability of success
        - Risk assessment
        - Specific requirements and action plan
        - Key metrics to track progress
        
        Return structured JSON with comprehensive opportunity analysis.
      `;

      const result = await model.generateContent(prompt);
      const aiAnalysis = JSON.parse(result.response.text());

      const opportunities = await this.processOpportunities(aiAnalysis.opportunities || [], context);
      
      // Sort by priority and ROI
      opportunities.sort((a, b) => {
        const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority] * a.roi * a.probability;
        const bPriority = priorityWeight[b.priority] * b.roi * b.probability;
        return bPriority - aPriority;
      });

      this.eventBus.emit('opportunities:detected', { opportunities, context });
      return opportunities;

    } catch (error) {
      this.eventBus.emit('opportunities:detection:error', { error: error.message, context });
      throw error;
    }
  }

  private async processOpportunities(
    rawOpportunities: any[], 
    context: OpportunityDetectionContext
  ): Promise<Opportunity[]> {
    return rawOpportunities.map((opp, index) => {
      const investmentRequired = opp.investmentRequired || 0;
      const potentialValue = opp.potentialValue || 0;
      const roi = investmentRequired > 0 ? (potentialValue - investmentRequired) / investmentRequired : 0;

      return {
        id: `opportunity_${Date.now()}_${index}`,
        title: opp.title || `Opportunity ${index + 1}`,
        description: opp.description || '',
        category: opp.category || 'operational',
        priority: opp.priority || 'medium',
        potentialValue,
        investmentRequired,
        roi,
        timeframe: opp.timeframe || '3-6 months',
        probability: Math.min(1, Math.max(0, opp.probability || 0.7)),
        riskLevel: opp.riskLevel || 'medium',
        requirements: opp.requirements || [],
        keyMetrics: (opp.keyMetrics || []).map((metric: any, mIndex: number) => ({
          name: metric.name || `Metric ${mIndex + 1}`,
          currentValue: metric.currentValue || 0,
          targetValue: metric.targetValue || 0,
          improvement: metric.targetValue - metric.currentValue || 0,
          unit: metric.unit || 'units'
        })),
        actionPlan: (opp.actionPlan || []).map((step: any, sIndex: number) => ({
          id: `step_${Date.now()}_${index}_${sIndex}`,
          step: step.step || `Step ${sIndex + 1}`,
          duration: step.duration || '1 week',
          resources: step.resources || [],
          dependencies: step.dependencies || [],
          cost: step.cost || 0
        }))
      };
    });
  }

  async prioritizeOpportunities(opportunities: Opportunity[]): Promise<{
    quickWins: Opportunity[];
    majorProjects: Opportunity[];
    longTermStrategic: Opportunity[];
    fillIns: Opportunity[];
  }> {
    const quickWins = opportunities.filter(opp => 
      opp.investmentRequired < 10000 && 
      opp.timeframe.includes('week') || opp.timeframe.includes('1-2 month')
    );

    const majorProjects = opportunities.filter(opp => 
      opp.potentialValue > 50000 && 
      opp.investmentRequired > 10000 &&
      opp.priority === 'high' || opp.priority === 'critical'
    );

    const longTermStrategic = opportunities.filter(opp => 
      opp.category === 'strategic' || 
      opp.timeframe.includes('year') ||
      opp.timeframe.includes('6+ month')
    );

    const fillIns = opportunities.filter(opp => 
      !quickWins.includes(opp) && 
      !majorProjects.includes(opp) && 
      !longTermStrategic.includes(opp)
    );

    return { quickWins, majorProjects, longTermStrategic, fillIns };
  }

  async trackOpportunityProgress(opportunityId: string): Promise<{
    completedSteps: number;
    totalSteps: number;
    progressPercentage: number;
    currentPhase: string;
    estimatedCompletion: string;
    actualValue: number;
    projectedValue: number;
  }> {
    // This would integrate with project management systems
    const mockProgress = {
      completedSteps: Math.floor(Math.random() * 10),
      totalSteps: 10,
      progressPercentage: Math.floor(Math.random() * 100),
      currentPhase: 'Implementation',
      estimatedCompletion: '2 weeks',
      actualValue: Math.floor(Math.random() * 50000),
      projectedValue: Math.floor(Math.random() * 100000)
    };

    this.eventBus.emit('opportunity:progress:tracked', { opportunityId, progress: mockProgress });
    return mockProgress;
  }

  async generateOpportunityReport(opportunities: Opportunity[]): Promise<{
    summary: {
      totalOpportunities: number;
      totalPotentialValue: number;
      totalInvestmentRequired: number;
      averageROI: number;
      highPriorityCount: number;
    };
    categoryBreakdown: Record<string, {
      count: number;
      totalValue: number;
      averageROI: number;
    }>;
    recommendations: string[];
  }> {
    const summary = {
      totalOpportunities: opportunities.length,
      totalPotentialValue: opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0),
      totalInvestmentRequired: opportunities.reduce((sum, opp) => sum + opp.investmentRequired, 0),
      averageROI: opportunities.reduce((sum, opp) => sum + opp.roi, 0) / opportunities.length,
      highPriorityCount: opportunities.filter(opp => opp.priority === 'high' || opp.priority === 'critical').length
    };

    const categoryBreakdown: Record<string, any> = {};
    const categories = [...new Set(opportunities.map(opp => opp.category))];
    
    categories.forEach(category => {
      const categoryOpps = opportunities.filter(opp => opp.category === category);
      categoryBreakdown[category] = {
        count: categoryOpps.length,
        totalValue: categoryOpps.reduce((sum, opp) => sum + opp.potentialValue, 0),
        averageROI: categoryOpps.reduce((sum, opp) => sum + opp.roi, 0) / categoryOpps.length
      };
    });

    const recommendations = [
      'Focus on high-ROI opportunities first',
      'Balance quick wins with long-term strategic initiatives',
      'Ensure adequate resources for implementation',
      'Monitor progress regularly and adjust plans as needed'
    ];

    // Add specific recommendations based on analysis
    if (summary.averageROI > 2) {
      recommendations.push('Excellent opportunity portfolio - consider accelerating implementation');
    }
    
    if (summary.highPriorityCount > 5) {
      recommendations.push('High number of priority opportunities - consider resource allocation carefully');
    }

    return { summary, categoryBreakdown, recommendations };
  }

  async validateOpportunity(opportunity: Opportunity, currentData: Record<string, any>): Promise<{
    isValid: boolean;
    confidence: number;
    updatedProbability: number;
    validationNotes: string[];
  }> {
    // Validate opportunity against current business conditions
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      Validate this business opportunity against current conditions:
      
      Opportunity: ${JSON.stringify(opportunity, null, 2)}
      Current Business Data: ${JSON.stringify(currentData, null, 2)}
      
      Assess:
      - Feasibility given current resources and market conditions
      - Accuracy of financial projections
      - Risk factors that may have changed
      - Market timing and competitive landscape
      
      Return validation assessment with confidence score and updated probability.
    `;

    const result = await model.generateContent(prompt);
    const validation = JSON.parse(result.response.text());

    return {
      isValid: validation.isValid || true,
      confidence: Math.min(1, Math.max(0, validation.confidence || 0.8)),
      updatedProbability: Math.min(1, Math.max(0, validation.updatedProbability || opportunity.probability)),
      validationNotes: validation.notes || []
    };
  }
}