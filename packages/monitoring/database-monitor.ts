export class DatabaseMonitor {
  async checkHealth(): Promise<boolean> {
    // Removed console.log
    return true;
  }

  async getStats(): Promise<any> {
    return {
      connections: 15,
      queries: 1250,
      avgResponseTime: 45,
      status: 'healthy'
    };
  }
}