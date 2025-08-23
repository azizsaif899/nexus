import { getDataConnect } from '../client';

export class RealtimeSubscriptions {
  private dataConnect = getDataConnect();
  private subscriptions = new Map<string, any>();

  subscribeToCustomerUpdates(callback: (customer: any) => void) {
    const subscription = `
      subscription CustomerUpdated {
        customerUpdated {
          id
          name
          email
          value
          status
          updatedAt
        }
      }
    `;

    const sub = this.dataConnect.subscribe(subscription, {}, callback);
    this.subscriptions.set('customers', sub);
    return sub;
  }

  subscribeToLeadUpdates(callback: (lead: any) => void) {
    const subscription = `
      subscription LeadUpdated {
        leadUpdated {
          id
          name
          email
          stage
          score
          updatedAt
        }
      }
    `;

    const sub = this.dataConnect.subscribe(subscription, {}, callback);
    this.subscriptions.set('leads', sub);
    return sub;
  }

  subscribeToDashboardUpdates(callback: (data: any) => void) {
    const subscription = `
      subscription DashboardUpdated {
        dashboardUpdated {
          totalCustomers
          activeCustomers
          totalLeads
          qualifiedLeads
          totalRevenue
          conversionRate
        }
      }
    `;

    const sub = this.dataConnect.subscribe(subscription, {}, callback);
    this.subscriptions.set('dashboard', sub);
    return sub;
  }

  subscribeToTaskUpdates(agentId?: string, callback?: (task: any) => void) {
    const subscription = `
      subscription TaskUpdated($agentId: ID) {
        taskUpdated(agentId: $agentId) {
          id
          type
          status
          output
          completedAt
          agent {
            name
            type
          }
        }
      }
    `;

    const sub = this.dataConnect.subscribe(subscription, { agentId }, callback);
    this.subscriptions.set(`tasks-${agentId || 'all'}`, sub);
    return sub;
  }

  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((sub, key) => {
      sub.unsubscribe();
    });
    this.subscriptions.clear();
  }

  getActiveSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }
}

export const realtimeSubscriptions = new RealtimeSubscriptions();