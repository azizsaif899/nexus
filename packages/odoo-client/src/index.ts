// Odoo Client exports
export class OdooClient {
  constructor(config: any) {}
  
  async connect() { return true; }
  
  async query(model: string, method: string, params: any) { return []; }
  
  async getLeads(filters?: any[]): Promise<any[]> {
    return [
      { id: 1, name: 'Lead 1', stage: 'new', probability: 50 },
      { id: 2, name: 'Lead 2', stage: 'qualified', probability: 75 }
    ];
  }
  
  async updateLead(id: number, data: any): Promise<boolean> {
    console.log(`Updating lead ${id} with:`, data);
    return true;
  }
  
  async getStages(): Promise<any[]> {
    return [
      { id: 1, name: 'New', sequence: 1 },
      { id: 2, name: 'Qualified', sequence: 2 },
      { id: 3, name: 'Proposition', sequence: 3 },
      { id: 4, name: 'Won', sequence: 4 }
    ];
  }
  
  async searchRead(model: string, domain: any[], fields?: string[]): Promise<any[]> {
    const mockData = {
      'crm.lead': [
        { id: 1, name: 'Lead 1', expected_revenue: 1000, stage_id: [1, 'New'] },
        { id: 2, name: 'Lead 2', expected_revenue: 2000, stage_id: [2, 'Qualified'] }
      ]
    };
    return mockData[model as keyof typeof mockData] || [];
  }
}