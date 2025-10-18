/**
 * Odoo API Service - Mock Implementation
 * ملف mock بسيط لإصلاح الـ imports المفقودة
 */

export interface OdooConfig {
  url: string;
  database: string;
  username: string;
  password: string;
}

export interface OdooCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
}

class OdooAPI {
  private config: OdooConfig | null = null;
  private isConnectedState: boolean = false;

  async connect(config: OdooConfig): Promise<boolean> {
    // Mock implementation
    console.log('Odoo API: Connecting...', config);
    this.config = config;
    this.isConnectedState = true;
    return true;
  }

  async disconnect(): Promise<void> {
    this.config = null;
    this.isConnectedState = false;
  }

  isConnected(): boolean {
    return this.isConnectedState;
  }

  async testConnection(): Promise<boolean> {
    // Mock implementation
    return this.isConnectedState;
  }

  async fetchCustomers(): Promise<OdooCustomer[]> {
    // Mock implementation
    console.log('Odoo API: Fetching customers...');
    return [];
  }

  async syncCustomers(customers: OdooCustomer[]): Promise<void> {
    // Mock implementation
    console.log('Odoo API: Syncing customers...', customers);
  }
}

export const odooAPI = new OdooAPI();
