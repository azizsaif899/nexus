import axios from 'axios';
import { Lead, CreateLeadRequest, Activity, ApiResponse } from '@azizsys/shared-types';

export class JsonRpcClient {
  private baseUrl: string;
  private database: string;
  private username: string;
  private password: string;
  private uid?: number;

  constructor(config: {
    baseUrl: string;
    database: string;
    username: string;
    password: string;
  }) {
    this.baseUrl = config.baseUrl;
    this.database = config.database;
    this.username = config.username;
    this.password = config.password;
  }

  async authenticate(): Promise<number> {
    const response = await axios.post(`${this.baseUrl}/jsonrpc`, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'common',
        method: 'authenticate',
        args: [this.database, this.username, this.password, {}]
      },
      id: 1
    });

    this.uid = response.data.result;
    return this.uid;
  }

  async createLead(leadData: CreateLeadRequest): Promise<ApiResponse<Lead>> {
    try {
      if (!this.uid) await this.authenticate();

      const response = await axios.post(`${this.baseUrl}/jsonrpc`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            this.database,
            this.uid,
            this.password,
            'crm.lead',
            'create',
            [leadData]
          ]
        },
        id: 2
      });

      return {
        success: true,
        data: { id: response.data.result, ...leadData } as Lead
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getLeads(): Promise<ApiResponse<Lead[]>> {
    try {
      if (!this.uid) await this.authenticate();

      const response = await axios.post(`${this.baseUrl}/jsonrpc`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            this.database,
            this.uid,
            this.password,
            'crm.lead',
            'search_read',
            [[]],
            { fields: ['name', 'phone', 'email', 'description'] }
          ]
        },
        id: 3
      });

      return {
        success: true,
        data: response.data.result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}