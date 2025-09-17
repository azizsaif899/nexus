// Local replacement for @g-assistant/odoo-client

export interface OdooConfig {
  url: string;
  database: string;
  username: string;
  password: string;
}

export interface OdooRecord {
  id: number;
  [key: string]: any;
}

export class OdooClient {
  private config: OdooConfig;

  constructor(config: OdooConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    return true;
  }

  async search(model: string, domain: any[] = []): Promise<number[]> {
    return [1, 2, 3, 4, 5];
  }

  async read(model: string, ids: number[], fields: string[] = []): Promise<OdooRecord[]> {
    return ids.map(id => ({
      id,
      name: `Sample ${model} ${id}`,
      create_date: new Date().toISOString(),
      write_date: new Date().toISOString()
    }));
  }

  async create(model: string, values: any): Promise<number> {
    return Math.floor(Math.random() * 1000) + 100;
  }

  async write(model: string, ids: number[], values: any): Promise<boolean> {
    return true;
  }

  async unlink(model: string, ids: number[]): Promise<boolean> {
    return true;
  }

  // Additional methods for smart-actions compatibility
  async getLeads(domain: any[] = []): Promise<any[]> {
    return [
      { id: 1, name: 'Sample Lead 1', email: 'lead1@example.com', expected_revenue: 1000 },
      { id: 2, name: 'Sample Lead 2', email: 'lead2@example.com', expected_revenue: 2000 }
    ];
  }

  async updateLead(id: number, values: any): Promise<boolean> {
    return true;
  }

  async addContactNote(id: number, note: string): Promise<boolean> {
    return true;
  }

  async findPartnerByEmail(email: string): Promise<any | null> {
    return { id: 1, name: 'Sample Partner', email };
  }
}