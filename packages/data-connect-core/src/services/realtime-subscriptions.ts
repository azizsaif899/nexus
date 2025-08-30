import { getDataConnectInstance } from '../client';

export class RealtimeSubscriptions {
  private dataConnect = getDataConnectInstance();
  private subscriptions = new Map<string, any>();

  subscribeToCustomerUpdates(callback: (customer: any) => void) {
    const mockSub = { unsubscribe: () => {} };
    this.subscriptions.set('customers', mockSub);
    return mockSub;
  }

  subscribeToLeadUpdates(callback: (lead: any) => void) {
    const mockSub = { unsubscribe: () => {} };
    this.subscriptions.set('leads', mockSub);
    return mockSub;
  }

  subscribeToDashboardUpdates(callback: (data: any) => void) {
    const mockSub = { unsubscribe: () => {} };
    this.subscriptions.set('dashboard', mockSub);
    return mockSub;
  }

  subscribeToTaskUpdates(agentId?: string, callback?: (task: any) => void) {
    const mockSub = { unsubscribe: () => {} };
    this.subscriptions.set(`tasks-${agentId || 'all'}`, mockSub);
    return mockSub;
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