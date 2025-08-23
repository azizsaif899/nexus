import { getDataConnect } from '@azizsys/data-connect-core';

export class AgentAnalyst {
  private dataConnect = getDataConnect();

  async analyzePerformanceData(sheetId: string, metrics: string[] = []) {
    const query = `
      query AnalystReport($sheetId: ID!, $metrics: [String!]) {
        analystReport(sheetId: $sheetId, metrics: $metrics) {
          averageScore
          totalTasks
          completedTasks
          successRate
          trends {
            period
            value
            changePercent
          }
        }
      }
    `;

    const result = await this.dataConnect.query(query, { sheetId, metrics });
    return this.generatePerformanceReport(result.analystReport);
  }

  async getPerformanceMetrics(sheetId: string) {
    const query = `
      query GetPerformanceData($sheetId: ID!) {
        sheet(id: $sheetId) {
          rows {
            date
            metric
            value
            target
          }
        }
      }
    `;

    const result = await this.dataConnect.query(query, { sheetId });
    return this.calculateMetrics(result.sheet.rows);
  }

  private generatePerformanceReport(data: any) {
    const { averageScore, totalTasks, completedTasks, successRate, trends } = data;
    
    return {
      summary: {
        averageScore: averageScore.toFixed(2),
        totalTasks,
        completedTasks,
        successRate: `${(successRate * 100).toFixed(2)}%`,
        efficiency: this.calculateEfficiency(data)
      },
      insights: this.generatePerformanceInsights(data),
      recommendations: this.generatePerformanceRecommendations(data),
      trends: trends.map((trend: any) => ({
        period: trend.period,
        value: trend.value.toFixed(2),
        change: `${trend.changePercent > 0 ? '+' : ''}${trend.changePercent.toFixed(2)}%`
      }))
    };
  }

  private calculateMetrics(rows: any[]) {
    const totalValue = rows.reduce((sum, row) => sum + (row.value || 0), 0);
    const totalTarget = rows.reduce((sum, row) => sum + (row.target || 0), 0);
    const averageValue = totalValue / Math.max(rows.length, 1);
    const averageTarget = totalTarget / Math.max(rows.length, 1);

    return {
      averageValue,
      averageTarget,
      achievementRate: averageTarget > 0 ? averageValue / averageTarget : 0,
      totalDataPoints: rows.length,
      variance: this.calculateVariance(rows.map(r => r.value || 0))
    };
  }

  private calculateVariance(values: number[]) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private calculateEfficiency(data: any) {
    const { totalTasks, completedTasks, averageScore } = data;
    const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
    const scoreNormalized = averageScore / 100;
    return ((completionRate + scoreNormalized) / 2 * 100).toFixed(2);
  }

  private generatePerformanceInsights(data: any) {
    const insights = [];
    
    if (data.successRate > 0.9) {
      insights.push('معدل نجاح ممتاز - أكثر من 90%');
    } else if (data.successRate > 0.7) {
      insights.push('معدل نجاح جيد - بين 70-90%');
    } else {
      insights.push('معدل نجاح يحتاج تحسين - أقل من 70%');
    }

    if (data.averageScore > 80) {
      insights.push('متوسط الأداء عالي');
    } else if (data.averageScore > 60) {
      insights.push('متوسط الأداء متوسط');
    } else {
      insights.push('متوسط الأداء منخفض');
    }

    const latestTrend = data.trends[data.trends.length - 1];
    if (latestTrend?.changePercent > 10) {
      insights.push('تحسن كبير في الأداء');
    } else if (latestTrend?.changePercent < -10) {
      insights.push('تراجع في الأداء يحتاج انتباه');
    }

    return insights;
  }

  private generatePerformanceRecommendations(data: any) {
    const recommendations = [];

    if (data.successRate < 0.8) {
      recommendations.push('تحسين عمليات ضمان الجودة');
    }

    if (data.averageScore < 70) {
      recommendations.push('مراجعة معايير الأداء وتحديد نقاط التحسين');
    }

    const efficiency = parseFloat(this.calculateEfficiency(data));
    if (efficiency < 75) {
      recommendations.push('تحسين الكفاءة العامة للعمليات');
    }

    return recommendations;
  }

  async createAnalysisTask(description: string, input: any) {
    const mutation = `
      mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
          id
          status
          createdAt
        }
      }
    `;

    return await this.dataConnect.mutate(mutation, {
      input: {
        agentId: 'analyst-agent-001',
        type: 'PERFORMANCE_ANALYSIS',
        description,
        input
      }
    });
  }
}

export const agentAnalyst = new AgentAnalyst();