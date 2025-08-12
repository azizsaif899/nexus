export class AppService {
  getHello(): string {
    return 'Hello API!';
  }

  getSystemStatus(): any {
    return {
      api: 'running',
      database: 'connected',
      cache: 'active',
      timestamp: new Date().toISOString()
    };
  }
}