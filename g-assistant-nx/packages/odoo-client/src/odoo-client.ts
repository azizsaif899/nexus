import axios, { AxiosInstance } from 'axios';

export interface OdooConfig {
  url: string;
  database: string;
  username: string;
  password: string;
}

export interface LeadPayload {
  name: string;
  contact_name?: string;
  email_from?: string;
  phone?: string;
  partner_name?: string;
  source_id?: number;
  description?: string;
  tag_ids?: number[];
}

export class OdooClient {
  private client: AxiosInstance;
  private sessionId: string | null = null;
  private userId: number | null = null;

  constructor(private config: OdooConfig) {
    this.client = axios.create({
      baseURL: `${config.url}/web/dataset`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.client.post('/call_kw', {
        service: 'common',
        method: 'authenticate',
        args: [this.config.database, this.config.username, this.config.password, {}]
      });

      if (response.data.result) {
        this.userId = response.data.result;
        this.sessionId = response.headers['set-cookie']?.[0];
        return true;
      }
      return false;
    } catch (error) {
      console.error('Odoo authentication failed:', error);
      return false;
    }
  }

  async createLead(leadData: LeadPayload): Promise<number> {
    await this.ensureAuthenticated();

    const response = await this.client.post('/call_kw', {
      service: 'object',
      method: 'execute_kw',
      args: [
        this.config.database,
        this.userId,
        this.config.password,
        'crm.lead',
        'create',
        [leadData]
      ]
    });

    return response.data.result;
  }

  async findPartnerByEmail(email: string): Promise<any> {
    await this.ensureAuthenticated();

    const response = await this.client.post('/call_kw', {
      service: 'object',
      method: 'execute_kw',
      args: [
        this.config.database,
        this.userId,
        this.config.password,
        'res.partner',
        'search_read',
        [[['email', '=', email]]],
        { fields: ['id', 'name', 'email', 'phone'] }
      ]
    });

    return response.data.result?.[0] || null;
  }

  async findPartnerByPhone(phone: string): Promise<any> {
    await this.ensureAuthenticated();

    const response = await this.client.post('/call_kw', {
      service: 'object',
      method: 'execute_kw',
      args: [
        this.config.database,
        this.userId,
        this.config.password,
        'res.partner',
        'search_read',
        [[['phone', '=', phone]]],
        { fields: ['id', 'name', 'email', 'phone'] }
      ]
    });

    return response.data.result?.[0] || null;
  }

  async addContactNote(contactId: number, note: string): Promise<void> {
    await this.ensureAuthenticated();

    await this.client.post('/call_kw', {
      service: 'object',
      method: 'execute_kw',
      args: [
        this.config.database,
        this.userId,
        this.config.password,
        'mail.message',
        'create',
        [{
          model: 'res.partner',
          res_id: contactId,
          body: note,
          message_type: 'comment'
        }]
      ]
    });
  }

  async getLeads(filters: any[] = []): Promise<any[]> {
    await this.ensureAuthenticated();

    const response = await this.client.post('/call_kw', {
      service: 'object',
      method: 'execute_kw',
      args: [
        this.config.database,
        this.userId,
        this.config.password,
        'crm.lead',
        'search_read',
        [filters],
        {
          fields: [
            'id', 'name', 'partner_name', 'email_from', 'phone',
            'stage_id', 'user_id', 'team_id', 'expected_revenue',
            'probability', 'create_date', 'write_date'
          ]
        }
      ]
    });

    return response.data.result || [];
  }

  async updateLead(leadId: number, updateData: Partial<LeadPayload>): Promise<boolean> {
    await this.ensureAuthenticated();

    const response = await this.client.post('/call_kw', {
      service: 'object',
      method: 'execute_kw',
      args: [
        this.config.database,
        this.userId,
        this.config.password,
        'crm.lead',
        'write',
        [[leadId], updateData]
      ]
    });

    return response.data.result === true;
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.userId) {
      const success = await this.authenticate();
      if (!success) {
        throw new Error('Failed to authenticate with Odoo');
      }
    }
  }

  // Health check method
  async isConnected(): Promise<boolean> {
    try {
      return await this.authenticate();
    } catch {
      return false;
    }
  }
}