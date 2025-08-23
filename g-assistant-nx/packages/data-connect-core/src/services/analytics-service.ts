import { getDataConnect } from '../client';

export class AnalyticsService {
  private dataConnect = getDataConnect();

  async getAnalytics(filter?: any) {
    const result = await this.dataConnect.query(`
      query GetAnalytics($filter: AnalyticsFilter) {
        analytics(filter: $filter) {
          totalRevenue
          totalCustomers
          totalLeads
          conversionRate
        }
      }
    `, { filter });
    return result.analytics;
  }

  async getMetrics(types?: string[], timeFrame?: string) {
    const result = await this.dataConnect.query(`
      query GetMetrics($types: [MetricType!], $timeFrame: TimeFrame) {
        metrics(types: $types, timeFrame: $timeFrame) {
          id
          name
          type
          value
          changePercent
        }
      }
    `, { types, timeFrame });
    return result.metrics;
  }
}

let analyticsService: AnalyticsService | null = null;

export function getAnalyticsService(): AnalyticsService {
  if (!analyticsService) {
    analyticsService = new AnalyticsService();
  }
  return analyticsService;
}