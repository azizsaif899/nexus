import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketplaceService {
  private apps = []; // In-memory store for apps

  async submitApp(app: any): Promise<any> {
    this.apps.push(app);
    return { success: true, app };
  }

  async listApps(): Promise<any[]> {
    return this.apps;
  }
}
