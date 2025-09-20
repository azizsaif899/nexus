export class OdooClient {
  async getLeads(): Promise<any[]> {
    return [];
  }

  async getOpportunities(): Promise<any[]> {
    return [];
  }

  async updateLead(id: string, data: any): Promise<any> {
    return { id, ...data };
  }

  async createLead(data: any): Promise<any> {
    return { id: Date.now().toString(), ...data };
  }

  async getCustomers(): Promise<any[]> {
    return [];
  }

  async getDashboardData(): Promise<any> {
    return { leads: 0, opportunities: 0, revenue: 0 };
  }
}