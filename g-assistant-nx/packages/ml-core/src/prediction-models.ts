import { Injectable } from '@nestjs/common';

@Injectable()
export class PredictionModels {
  async predictUserBehavior(userId: string, features: any): Promise<any> {
    // User behavior prediction
    return {
      nextAction: 'purchase',
      probability: 0.78,
      timeframe: '24h',
      confidence: 0.85
    };
  }

  async predictSystemLoad(metrics: any[]): Promise<any> {
    // System load prediction
    const trend = this.calculateTrend(metrics);
    
    return {
      predictedLoad: trend * 1.2,
      timeframe: '1h',
      confidence: 0.92,
      recommendation: trend > 0.8 ? 'scale_up' : 'maintain'
    };
  }

  async predictChurn(userFeatures: any): Promise<any> {
    // Customer churn prediction
    const riskScore = this.calculateChurnRisk(userFeatures);
    
    return {
      churnProbability: riskScore,
      riskLevel: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      factors: this.getChurnFactors(userFeatures),
      recommendations: this.getRetentionRecommendations(riskScore)
    };
  }

  async predictDemand(historicalData: any[], features: any): Promise<any> {
    // Demand forecasting
    const seasonality = this.detectSeasonality(historicalData);
    const trend = this.calculateTrend(historicalData);
    
    return {
      predictedDemand: this.forecastDemand(trend, seasonality, features),
      confidence: 0.88,
      factors: ['seasonality', 'trend', 'external_factors'],
      timeframe: '7d'
    };
  }

  private calculateTrend(data: any[]): number {
    if (data.length < 2) return 0;
    
    const recent = data.slice(-5);
    const sum = recent.reduce((acc, item) => acc + (item.value || item), 0);
    return sum / recent.length;
  }

  private calculateChurnRisk(features: any): number {
    let risk = 0;
    
    if (features.lastLogin > 30) risk += 0.3;
    if (features.supportTickets > 3) risk += 0.2;
    if (features.usageDecline > 0.5) risk += 0.4;
    if (features.paymentIssues) risk += 0.1;
    
    return Math.min(risk, 1.0);
  }

  private getChurnFactors(features: any): string[] {
    const factors = [];
    
    if (features.lastLogin > 30) factors.push('inactive_user');
    if (features.supportTickets > 3) factors.push('support_issues');
    if (features.usageDecline > 0.5) factors.push('declining_usage');
    if (features.paymentIssues) factors.push('payment_problems');
    
    return factors;
  }

  private getRetentionRecommendations(riskScore: number): string[] {
    if (riskScore > 0.7) {
      return ['immediate_intervention', 'personal_contact', 'special_offer'];
    } else if (riskScore > 0.4) {
      return ['engagement_campaign', 'feature_education', 'feedback_survey'];
    }
    return ['monitor_closely', 'regular_communication'];
  }

  private detectSeasonality(data: any[]): any {
    // Simple seasonality detection
    return {
      hasSeasonality: true,
      period: 7, // weekly
      strength: 0.6
    };
  }

  private forecastDemand(trend: number, seasonality: any, features: any): number {
    let forecast = trend;
    
    if (seasonality.hasSeasonality) {
      forecast *= (1 + seasonality.strength * 0.2);
    }
    
    // Apply external factors
    if (features.promotion) forecast *= 1.3;
    if (features.holiday) forecast *= 1.5;
    if (features.weather === 'bad') forecast *= 0.8;
    
    return Math.max(0, forecast);
  }
}