export class AppController {
  getHello(): string {
    return 'AzizSys API Server is running!';
  }

  getHealth(): any {
    return {
      status: 'healthy',
      service: 'azizsys-api',
      timestamp: new Date().toISOString()
    };
  }
}
