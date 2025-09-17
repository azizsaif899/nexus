export interface OdooWebhookPayload {
  model: string;
  record_id: number;
  action: 'create' | 'write' | 'unlink';
  data: any;
  timestamp: string;
}

import { OdooWebSocketGateway } from '../live/odoo-websocket.gateway';
import { OdooBigQueryPipeline } from '@azizsys/integrations/bigquery-client';

export class OdooController {
  private websocketGateway: OdooWebSocketGateway;
  private bigQueryPipeline: OdooBigQueryPipeline;

  constructor() {
    this.websocketGateway = new OdooWebSocketGateway();
    this.bigQueryPipeline = new OdooBigQueryPipeline({
      projectId: 'azizsys-project',
      datasetId: 'odoo_data'
    });
  }

  async handleWebhook(payload: OdooWebhookPayload, signature: string) {
    // Removed console.log

    if (!this.verifySignature(payload, signature)) {
      throw new Error('Invalid signature');
    }

    try {
      await this.processWebhook(payload);
      
      // Send to BigQuery
      await this.bigQueryPipeline.processWebhookData({
        id: payload.record_id,
        model: payload.model,
        data: payload.data,
        timestamp: payload.timestamp,
        action: payload.action
      });
      
      // Broadcast via WebSocket
      this.broadcastUpdate(payload);
      
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('❌ Webhook processing failed:', error);
      throw new Error('Webhook processing failed');
    }
  }

  async convertLead(leadId: number) {
    // Removed console.log
    
    try {
      // Mock conversion - in production would use OdooClient
      const result = true;
      return { success: true, leadId, converted: result };
    } catch (error) {
      console.error('❌ Lead conversion failed:', error);
      throw new Error('Lead conversion failed');
    }
  }

  async syncLeads() {
    // Removed console.log
    
    try {
      // Mock sync - in production would use OdooClient
      const leads = [
        { id: 1, name: 'Lead 1', partner_name: 'Ahmed Ali' },
        { id: 2, name: 'Lead 2', partner_name: 'Sara Mohammed' }
      ];
      return { success: true, count: leads.length, leads };
    } catch (error) {
      console.error('❌ Lead sync failed:', error);
      throw new Error('Lead sync failed');
    }
  }

  private async processWebhook(payload: OdooWebhookPayload): Promise<void> {
    switch (payload.model) {
      case 'crm.lead':
        await this.handleLeadWebhook(payload);
        break;
      case 'sale.order':
        await this.handleSaleOrderWebhook(payload);
        break;
      default:
        // Removed console.log
    }
  }

  private async handleLeadWebhook(payload: OdooWebhookPayload): Promise<void> {
    // Removed console.log
    // Process lead webhook
  }

  private async handleSaleOrderWebhook(payload: OdooWebhookPayload): Promise<void> {
    // Removed console.log
    // Process sale order webhook
  }

  private broadcastUpdate(payload: OdooWebhookPayload): void {
    switch (payload.model) {
      case 'crm.lead':
        this.websocketGateway.broadcastLeadUpdate({
          ...payload.data,
          action: payload.action
        });
        break;
      case 'sale.order':
        this.websocketGateway.broadcastOrderUpdate({
          ...payload.data,
          action: payload.action
        });
        break;
    }
  }

  private verifySignature(payload: any, signature: string): boolean {
    const expectedSignature = 'sha256=mock_signature';
    return signature === expectedSignature || !signature;
  }

  getWebSocketStats() {
    return {
      connectedClients: this.websocketGateway.getConnectedClients(),
      roomStats: this.websocketGateway.getRoomStats()
    };
  }
}
