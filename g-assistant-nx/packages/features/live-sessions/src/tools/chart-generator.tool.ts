export interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: Array<{ label: string; value: number }>;
}

export class ChartGeneratorTool {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async generateChart(config: ChartConfig): Promise<void> {
    console.log(`📊 Generating ${config.type} chart for session: ${this.sessionId}`);
    
    const chartData = {
      type: 'chart-update',
      payload: config.data,
      metadata: {
        chartType: config.type,
        title: config.title,
        timestamp: new Date().toISOString()
      }
    };

    this.broadcastChartUpdate(chartData);
  }

  async updateChart(data: Array<{ label: string; value: number }>): Promise<void> {
    console.log(`🔄 Updating chart for session: ${this.sessionId}`);
    
    const updateData = {
      type: 'chart-update',
      payload: data,
      metadata: {
        timestamp: new Date().toISOString()
      }
    };

    this.broadcastChartUpdate(updateData);
  }

  private broadcastChartUpdate(data: any): void {
    console.log(`📡 Broadcasting chart update:`, data);
  }

  static async createFinancialChart(revenue: number[], months: string[]): Promise<ChartConfig> {
    return {
      type: 'bar',
      title: 'الإيرادات الشهرية',
      data: months.map((month, index) => ({
        label: month,
        value: revenue[index] || 0
      }))
    };
  }
}