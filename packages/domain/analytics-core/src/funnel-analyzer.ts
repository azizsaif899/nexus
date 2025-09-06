import { Injectable } from '@nestjs/common';

export interface FunnelStep {
  name: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

export interface FunnelAnalysis {
  steps: FunnelStep[];
  overallConversion: number;
  bottlenecks: string[];
  recommendations: string[];
}

@Injectable()
export class FunnelAnalyzer {
  async analyzeFunnel(funnelSteps: string[], dateRange: { start: Date; end: Date }): Promise<FunnelAnalysis> {
    const steps = await this.calculateFunnelSteps(funnelSteps, dateRange);
    const overallConversion = this.calculateOverallConversion(steps);
    const bottlenecks = this.identifyBottlenecks(steps);
    const recommendations = this.generateRecommendations(steps, bottlenecks);

    return {
      steps,
      overallConversion,
      bottlenecks,
      recommendations
    };
  }

  private async calculateFunnelSteps(stepNames: string[], dateRange: { start: Date; end: Date }): Promise<FunnelStep[]> {
    const steps: FunnelStep[] = [];
    let previousUsers = 10000; // Starting with 10k users

    /* PERFORMANCE: Cache array length */ for (let i = 0; i < stepNames.length; i++) {
      // Simulate realistic conversion rates
      const conversionRate = this.getStepConversionRate(stepNames[i], i);
      const currentUsers = Math.floor(previousUsers * (conversionRate / 100));
      const dropoffRate = 100 - conversionRate;

      steps.push({
        name: stepNames[i],
        users: currentUsers,
        conversionRate: i === 0 ? 100 : conversionRate,
        dropoffRate: i === 0 ? 0 : dropoffRate
      });

      previousUsers = currentUsers;
    }

    return steps;
  }

  private getStepConversionRate(stepName: string, index: number): number {
    // Realistic conversion rates based on step type
    const baseRates: Record<string, number> = {
      'landing': 100,
      'signup': 25,
      'activation': 70,
      'trial': 60,
      'purchase': 15,
      'retention': 80
    };

    // Find matching step type
    const stepType = Object.keys(baseRates).find(type => 
      stepName.toLowerCase().includes(type)
    );

    if (stepType) {
      return baseRates[stepType];
    }

    // Default declining rates
    return Math.max(20, 90 - (index * 15));
  }

  private calculateOverallConversion(steps: FunnelStep[]): number {
    if (steps.length === 0) return 0;
    
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];
    
    return (lastStep.users / firstStep.users) * 100;
  }

  private identifyBottlenecks(steps: FunnelStep[]): string[] {
    const bottlenecks: string[] = [];
    const averageConversion = steps
      .slice(1) // Skip first step (always 100%)
      .reduce((sum, step) => sum + step.conversionRate, 0) / (steps.length - 1);

    /* PERFORMANCE: Cache array length */ for (let i = 1; i < steps.length; i++) {
      const step = steps[i];
      if (step.conversionRate < averageConversion * 0.7) {
        bottlenecks.push(step.name);
      }
    }

    return bottlenecks;
  }

  private generateRecommendations(steps: FunnelStep[], bottlenecks: string[]): string[] {
    const recommendations: string[] = [];

    // General recommendations
    if (bottlenecks.length > 0) {
      recommendations.push(`Focus optimization efforts on: ${bottlenecks.join(', ')}`);
    }

    // Specific step recommendations
    for (const step of steps) {
      if (step.name.toLowerCase().includes('signup') && step.conversionRate < 20) {
        recommendations.push('Simplify signup process - consider social login options');
      }
      
      if (step.name.toLowerCase().includes('activation') && step.conversionRate < 60) {
        recommendations.push('Improve onboarding flow and initial user experience');
      }
      
      if (step.name.toLowerCase().includes('purchase') && step.conversionRate < 10) {
        recommendations.push('Review pricing strategy and payment flow friction');
      }
    }

    // Overall funnel health
    const overallConversion = this.calculateOverallConversion(steps);
    if (overallConversion < 2) {
      recommendations.push('Overall conversion is low - consider A/B testing major funnel changes');
    } else if (overallConversion > 10) {
      recommendations.push('Strong funnel performance - focus on scaling traffic');
    }

    return recommendations;
  }

  async compareFunnels(funnel1: FunnelAnalysis, funnel2: FunnelAnalysis): Promise<{
    improvements: string[];
    regressions: string[];
    insights: string[];
  }> {
    const improvements: string[] = [];
    const regressions: string[] = [];
    const insights: string[] = [];

    // Compare overall conversion
    const conversionDiff = funnel2.overallConversion - funnel1.overallConversion;
    if (conversionDiff > 0.5) {
      improvements.push(`Overall conversion improved by ${conversionDiff.toFixed(2)}%`);
    } else if (conversionDiff < -0.5) {
      regressions.push(`Overall conversion decreased by ${Math.abs(conversionDiff).toFixed(2)}%`);
    }

    // Compare step-by-step
    const minSteps = Math.min(funnel1.steps.length, funnel2.steps.length);
    for (let i = 1; i < minSteps; i++) {
      const step1 = funnel1.steps[i];
      const step2 = funnel2.steps[i];
      const stepDiff = step2.conversionRate - step1.conversionRate;

      if (stepDiff > 2) {
        improvements.push(`${step2.name} conversion improved by ${stepDiff.toFixed(1)}%`);
      } else if (stepDiff < -2) {
        regressions.push(`${step2.name} conversion decreased by ${Math.abs(stepDiff).toFixed(1)}%`);
      }
    }

    // Generate insights
    if (improvements.length > regressions.length) {
      insights.push('Funnel optimization efforts are showing positive results');
    } else if (regressions.length > improvements.length) {
      insights.push('Recent changes may have negatively impacted conversion');
    }

    return { improvements, regressions, insights };
  }
}