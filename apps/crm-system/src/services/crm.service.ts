// استبدال بـ types محلية
// import { Customer, Lead, Campaign, CRMStats } from '@azizsys/crm-core';
import { Customer, Lead, Campaign, CRMStats, Customer360Data } from '../types/crm.types';

export class CRMService {
  private baseUrl = '/api/crm';

  // Customer Management
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${this.baseUrl}/customers`);
    return response.json();
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await fetch(`${this.baseUrl}/customers/${id}`);
    return response.json();
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    return response.json();
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    return response.json();
  }

  // Lead Management
  async getLeads(): Promise<Lead[]> {
    const response = await fetch(`${this.baseUrl}/leads`);
    return response.json();
  }

  async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const response = await fetch(`${this.baseUrl}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    return response.json();
  }

  async updateLeadStage(id: string, stage: Lead['stage']): Promise<Lead> {
    const response = await fetch(`${this.baseUrl}/leads/${id}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage })
    });
    return response.json();
  }

  // Campaign Management
  async getCampaigns(): Promise<Campaign[]> {
    const response = await fetch(`${this.baseUrl}/campaigns`);
    return response.json();
  }

  async syncWithMeta(): Promise<{ success: boolean; campaigns: Campaign[] }> {
    const response = await fetch(`${this.baseUrl}/campaigns/sync-meta`, {
      method: 'POST'
    });
    return response.json();
  }

  async exportToBigQuery(): Promise<{ success: boolean; rows: number }> {
    const response = await fetch(`${this.baseUrl}/campaigns/export-bigquery`, {
      method: 'POST'
    });
    return response.json();
  }

  // Customer 360 View
  async getCustomer360(customerId: string): Promise<Customer360Data> {
    const [odooData, metaData, analyticsData] = await Promise.all([
      fetch(`/api/odoo/customers/${customerId}`).then(r => r.json()),
      fetch(`/api/meta/customer-insights/${customerId}`).then(r => r.json()),
      fetch(`/api/analytics/customer-score/${customerId}`).then(r => r.json())
    ]);

    return {
      odoo: odooData.data,
      meta: metaData.data,
      analytics: analyticsData.data
    };
  }

  // Analytics & Stats
  async getCRMStats(): Promise<CRMStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    return response.json();
  }

  async getLeadScoring(leadId: string): Promise<{ score: number; factors: any[] }> {
    const response = await fetch(`${this.baseUrl}/leads/${leadId}/scoring`);
    return response.json();
  }

  // Integrations
  async syncWithOdoo(): Promise<{ success: boolean; synced: number }> {
    const response = await fetch(`${this.baseUrl}/sync/odoo`, {
      method: 'POST'
    });
    return response.json();
  }

  async sendToWhatsApp(customerId: string, message: string): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return response.json();
  }
}