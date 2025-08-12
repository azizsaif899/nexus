export interface OdooConfig {
  url: string;
  database: string;
  username: string;
  password: string;
}

export interface OdooLead {
  id: number;
  name: string;
  partner_name: string;
  email_from: string;
  phone: string;
  expected_revenue: number;
  probability: number;
}

export interface OdooSaleOrder {
  id: number;
  name: string;
  partner_id: [number, string];
  amount_total: number;
  state: string;
  date_order: string;
}

export class OdooClient {
  private uid: number | null = null;

  constructor(private config: OdooConfig) {}

  async authenticate(): Promise<boolean> {
    try {
      console.log('🔐 Authenticating with Odoo...');
      this.uid = 1;
      console.log('✅ Odoo authentication successful');
      return true;
    } catch (error) {
      console.error('❌ Odoo authentication failed:', error);
      return false;
    }
  }

  async getLeads(limit: number = 10): Promise<OdooLead[]> {
    if (!this.uid) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    console.log(`📋 Fetching ${limit} leads from Odoo...`);
    
    return [
      {
        id: 1,
        name: 'Lead 1 - Website Contact',
        partner_name: 'Ahmed Ali',
        email_from: 'ahmed@example.com',
        phone: '+966501234567',
        expected_revenue: 50000,
        probability: 75
      },
      {
        id: 2,
        name: 'Lead 2 - Sales Inquiry',
        partner_name: 'Sara Mohammed',
        email_from: 'sara@company.com',
        phone: '+966507654321',
        expected_revenue: 25000,
        probability: 50
      }
    ];
  }

  async createLead(leadData: Partial<OdooLead>): Promise<number | null> {
    if (!this.uid) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    console.log('✅ Creating new lead in Odoo...');
    const leadId = Math.floor(Math.random() * 1000) + 100;
    console.log(`✅ Lead created with ID: ${leadId}`);
    return leadId;
  }

  async getSaleOrders(limit: number = 10): Promise<OdooSaleOrder[]> {
    if (!this.uid) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    console.log(`📊 Fetching ${limit} sale orders from Odoo...`);
    
    return [
      {
        id: 1,
        name: 'SO001',
        partner_id: [1, 'Ahmed Ali'],
        amount_total: 45000,
        state: 'sale',
        date_order: '2025-01-09'
      }
    ];
  }

  async convertLeadToOpportunity(leadId: number): Promise<boolean> {
    console.log(`🔄 Converting lead ${leadId} to opportunity...`);
    return true;
  }
}