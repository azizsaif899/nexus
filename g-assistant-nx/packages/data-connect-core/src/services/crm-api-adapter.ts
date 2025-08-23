import { getCRMService } from './crm-service';
import { geminiIntegration } from './gemini-integration';
import { realtimeSubscriptions } from './realtime-subscriptions';

export class CRMAPIAdapter {
  private crmService = getCRMService();

  // Legacy REST API compatibility layer
  async getCustomers(req: any) {
    const { filter, limit, offset } = req.query;
    return await this.crmService.getCustomers(filter, limit, offset);
  }

  async getCustomer(req: any) {
    const { id } = req.params;
    return await this.crmService.getCustomer(id);
  }

  async createCustomer(req: any) {
    const customerData = req.body;
    return await this.crmService.createCustomer(customerData);
  }

  async updateCustomer(req: any) {
    const { id } = req.params;
    const updateData = req.body;
    return await this.crmService.updateCustomer(id, updateData);
  }

  // Smart query endpoint
  async smartQuery(req: any) {
    const { query, schema } = req.body;
    
    try {
      const graphqlQuery = await geminiIntegration.generateSmartQuery(query, schema);
      const result = await geminiIntegration.executeGeneratedQuery(graphqlQuery);
      
      return {
        originalQuery: query,
        generatedGraphQL: graphqlQuery,
        result
      };
    } catch (error) {
      throw new Error(`Smart query failed: ${error}`);
    }
  }

  // Real-time endpoints
  setupRealtimeEndpoints(io: any) {
    io.on('connection', (socket: any) => {
      console.log('Client connected for real-time updates');

      // Subscribe to customer updates
      socket.on('subscribe:customers', () => {
        realtimeSubscriptions.subscribeToCustomerUpdates((customer) => {
          socket.emit('customer:updated', customer);
        });
      });

      // Subscribe to lead updates
      socket.on('subscribe:leads', () => {
        realtimeSubscriptions.subscribeToLeadUpdates((lead) => {
          socket.emit('lead:updated', lead);
        });
      });

      // Subscribe to dashboard updates
      socket.on('subscribe:dashboard', () => {
        realtimeSubscriptions.subscribeToDashboardUpdates((data) => {
          socket.emit('dashboard:updated', data);
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
        realtimeSubscriptions.unsubscribeAll();
      });
    });
  }

  // Batch operations
  async batchCreateCustomers(req: any) {
    const { customers } = req.body;
    const results = [];

    for (const customer of customers) {
      try {
        const result = await this.crmService.createCustomer(customer);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message, data: customer });
      }
    }

    return {
      total: customers.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  // Analytics endpoints
  async getDashboardData(req: any) {
    return await this.crmService.getDashboardData();
  }

  async getCustomerAnalytics(req: any) {
    const { period, segment } = req.query;
    // This would integrate with BigQuery for advanced analytics
    return {
      period,
      segment,
      metrics: {
        totalCustomers: 150,
        activeCustomers: 120,
        churnRate: 0.05,
        averageLifetimeValue: 2500
      }
    };
  }
}

export const crmAPIAdapter = new CRMAPIAdapter();