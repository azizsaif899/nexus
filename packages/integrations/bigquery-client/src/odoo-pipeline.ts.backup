export interface BigQueryConfig {
  projectId: string;
  datasetId: string;
  keyFilename?: string;
}

export interface OdooDataRecord {
  id: number;
  model: string;
  data: any;
  timestamp: string;
  action: 'create' | 'update' | 'delete';
}

export class OdooBigQueryPipeline {
  private config: BigQueryConfig;

  constructor(config: BigQueryConfig) {
    this.config = config;
  }

  async syncLeadsToBigQuery(leads: any[]): Promise<void> {
    // Removed console.log
    
    const transformedLeads = leads.map(lead => ({
      lead_id: lead.id,
      name: lead.name,
      partner_name: lead.partner_name,
      email: lead.email_from,
      phone: lead.phone,
      expected_revenue: lead.expected_revenue || 0,
      probability: lead.probability || 0,
      stage: lead.stage || 'new',
      created_date: lead.create_date || new Date().toISOString(),
      updated_date: new Date().toISOString(),
      source: 'odoo'
    }));

    // Mock BigQuery insert - في الإنتاج سيستخدم @google-cloud/bigquery
    // Removed console.log
  }

  async syncSaleOrdersToBigQuery(orders: any[]): Promise<void> {
    // Removed console.log
    
    const transformedOrders = orders.map(order => ({
      order_id: order.id,
      name: order.name,
      partner_id: order.partner_id?.[0] || null,
      partner_name: order.partner_id?.[1] || '',
      amount_total: order.amount_total || 0,
      state: order.state || 'draft',
      date_order: order.date_order || new Date().toISOString(),
      created_date: order.create_date || new Date().toISOString(),
      updated_date: new Date().toISOString(),
      source: 'odoo'
    }));

    // Removed console.log
  }

  async processWebhookData(webhookData: OdooDataRecord): Promise<void> {
    // Removed console.log

    switch (webhookData.model) {
      case 'crm.lead':
        await this.processLeadWebhook(webhookData);
        break;
      case 'sale.order':
        await this.processSaleOrderWebhook(webhookData);
        break;
      default:
        // Removed console.log
    }
  }

  private async processLeadWebhook(data: OdooDataRecord): Promise<void> {
    const leadRecord = {
      lead_id: data.id,
      ...data.data,
      action: data.action,
      processed_at: new Date().toISOString()
    };

    // Removed console.log
  }

  private async processSaleOrderWebhook(data: OdooDataRecord): Promise<void> {
    const orderRecord = {
      order_id: data.id,
      ...data.data,
      action: data.action,
      processed_at: new Date().toISOString()
    };

    // Removed console.log
  }

  async runAnalyticsQuery(query: string): Promise<any[]> {
    // Removed console.log}...`);
    
    // Mock query results
    const mockResults = [
      {
        customer_name: 'شركة التقنية المتقدمة',
        total_leads: 5,
        converted_leads: 3,
        total_revenue: 450000,
        conversion_rate: 0.6
      },
      {
        customer_name: 'مؤسسة الابتكار',
        total_leads: 3,
        converted_leads: 2,
        total_revenue: 280000,
        conversion_rate: 0.67
      }
    ];

    // Removed console.log
    return mockResults;
  }

  async getLeadConversionAnalytics(): Promise<any> {
    const query = `
      SELECT 
        partner_name,
        COUNT(*) as total_leads,
        SUM(CASE WHEN stage = 'won' THEN 1 ELSE 0 END) as converted_leads,
        SUM(expected_revenue) as total_revenue,
        AVG(probability) as avg_probability
      FROM \`${this.config.projectId}.${this.config.datasetId}.leads\`
      WHERE created_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
      GROUP BY partner_name
      ORDER BY total_revenue DESC
    `;

    return await this.runAnalyticsQuery(query);
  }
}