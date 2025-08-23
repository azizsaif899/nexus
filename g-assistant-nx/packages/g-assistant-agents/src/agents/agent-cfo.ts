import { getDataConnect } from '@azizsys/data-connect-core';

export class AgentCFO {
  private dataConnect = getDataConnect();

  async analyzeFinancialData(sheetId: string, period: string = 'monthly') {
    const query = `
      query CFOAnalysis($sheetId: ID!, $period: String!) {
        cfoAnalysis(sheetId: $sheetId, period: $period) {
          totalRevenue
          totalExpenses
          totalProfit
          profitMargin
          trends {
            period
            value
            changePercent
          }
        }
      }
    `;

    const result = await this.dataConnect.query(query, { sheetId, period });
    return this.generateFinancialReport(result.cfoAnalysis);
  }

  async getFinancialSummary(sheetId: string) {
    const query = `
      query GetFinancialData($sheetId: ID!) {
        sheet(id: $sheetId) {
          rows {
            date
            revenue
            expenses
            profit
          }
        }
      }
    `;

    const result = await this.dataConnect.query(query, { sheetId });
    return this.calculateSummary(result.sheet.rows);
  }

  private generateFinancialReport(data: any) {
    const { totalRevenue, totalExpenses, totalProfit, profitMargin, trends } = data;
    
    return {
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit,
        profitMargin: `${(profitMargin * 100).toFixed(2)}%`,
        status: totalProfit > 0 ? 'ربح' : 'خسارة'
      },
      insights: this.generateInsights(data),
      recommendations: this.generateRecommendations(data),
      trends: trends.map((trend: any) => ({
        period: trend.period,
        value: trend.value,
        change: `${trend.changePercent > 0 ? '+' : ''}${trend.changePercent.toFixed(2)}%`
      }))
    };
  }

  private calculateSummary(rows: any[]) {
    const totalRevenue = rows.reduce((sum, row) => sum + (row.revenue || 0), 0);
    const totalExpenses = rows.reduce((sum, row) => sum + (row.expenses || 0), 0);
    const totalProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      profitMargin: totalRevenue > 0 ? totalProfit / totalRevenue : 0,
      averageMonthlyRevenue: totalRevenue / Math.max(rows.length, 1),
      breakEvenPoint: totalExpenses > 0 ? totalExpenses / (totalRevenue / Math.max(rows.length, 1)) : 0
    };
  }

  private generateInsights(data: any) {
    const insights = [];
    
    if (data.profitMargin > 0.2) {
      insights.push('هامش ربح ممتاز - أكثر من 20%');
    } else if (data.profitMargin > 0.1) {
      insights.push('هامش ربح جيد - بين 10-20%');
    } else {
      insights.push('هامش ربح منخفض - أقل من 10%');
    }

    const latestTrend = data.trends[data.trends.length - 1];
    if (latestTrend?.changePercent > 5) {
      insights.push('نمو إيجابي في الفترة الأخيرة');
    } else if (latestTrend?.changePercent < -5) {
      insights.push('تراجع في الأداء المالي');
    }

    return insights;
  }

  private generateRecommendations(data: any) {
    const recommendations = [];

    if (data.profitMargin < 0.1) {
      recommendations.push('تحسين هامش الربح عبر تقليل التكاليف أو زيادة الأسعار');
    }

    if (data.totalExpenses > data.totalRevenue * 0.8) {
      recommendations.push('مراجعة المصروفات - نسبة عالية من الإيرادات');
    }

    const latestTrend = data.trends[data.trends.length - 1];
    if (latestTrend?.changePercent < 0) {
      recommendations.push('وضع خطة لتحسين الأداء المالي');
    }

    return recommendations;
  }

  async createFinancialTask(description: string, input: any) {
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
        agentId: 'cfo-agent-001',
        type: 'FINANCIAL_ANALYSIS',
        description,
        input
      }
    });
  }
}

export const agentCFO = new AgentCFO();