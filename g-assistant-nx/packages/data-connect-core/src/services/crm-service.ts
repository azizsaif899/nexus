import { getDataConnect } from '../client';
import {
  GET_DASHBOARD_DATA,
  GET_CUSTOMERS,
  GET_CUSTOMER_DETAILS,
  GET_LEADS,
  GET_CAMPAIGNS,
  SEARCH_ALL
} from '../queries/crm-queries';
import {
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER,
  CREATE_LEAD,
  UPDATE_LEAD,
  CREATE_CAMPAIGN,
  UPDATE_CAMPAIGN
} from '../mutations/crm-mutations';

export class CRMService {
  private dataConnect = getDataConnect();

  async getDashboardData() {
    const result = await this.dataConnect.query(GET_DASHBOARD_DATA);
    return result.dashboardData;
  }

  async getCustomers(filter?: any, limit?: number, offset?: number) {
    const result = await this.dataConnect.query(GET_CUSTOMERS, {
      filter, limit, offset
    });
    return result.customers;
  }

  async getCustomer(id: string) {
    const result = await this.dataConnect.query(GET_CUSTOMER_DETAILS, { id });
    return result.customer;
  }

  async createCustomer(input: any) {
    const result = await this.dataConnect.mutate(CREATE_CUSTOMER, { input });
    return result.createCustomer;
  }

  async updateCustomer(id: string, input: any) {
    const result = await this.dataConnect.mutate(UPDATE_CUSTOMER, { id, input });
    return result.updateCustomer;
  }

  async getLeads(filter?: any, limit?: number, offset?: number) {
    const result = await this.dataConnect.query(GET_LEADS, {
      filter, limit, offset
    });
    return result.leads;
  }

  async createLead(input: any) {
    const result = await this.dataConnect.mutate(CREATE_LEAD, { input });
    return result.createLead;
  }

  async updateLead(id: string, input: any) {
    const result = await this.dataConnect.mutate(UPDATE_LEAD, { id, input });
    return result.updateLead;
  }

  async getCampaigns(filter?: any, limit?: number, offset?: number) {
    const result = await this.dataConnect.query(GET_CAMPAIGNS, {
      filter, limit, offset
    });
    return result.campaigns;
  }

  async createCampaign(input: any) {
    const result = await this.dataConnect.mutate(CREATE_CAMPAIGN, { input });
    return result.createCampaign;
  }

  async updateCampaign(id: string, input: any) {
    const result = await this.dataConnect.mutate(UPDATE_CAMPAIGN, { id, input });
    return result.updateCampaign;
  }

  async searchAll(query: string) {
    const result = await this.dataConnect.query(SEARCH_ALL, { query });
    return result.searchAll;
  }
}

let crmService: CRMService | null = null;

export function getCRMService(): CRMService {
  if (!crmService) {
    crmService = new CRMService();
  }
  return crmService;
}