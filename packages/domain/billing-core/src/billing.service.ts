export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
}

export class BillingService {
  private plans = new Map<string, SubscriptionPlan>();
  private subscriptions = new Map<string, Subscription>();

  constructor() {
    this.initializePlans();
  }

  private initializePlans(): void {
    const basicPlan: SubscriptionPlan = {
      id: 'basic',
      name: 'Basic Plan',
      price: 29,
      currency: 'USD',
      interval: 'monthly',
      features: ['AI Chat', 'Basic Analytics', 'Email Support']
    };

    const proPlan: SubscriptionPlan = {
      id: 'pro',
      name: 'Pro Plan',
      price: 99,
      currency: 'USD',
      interval: 'monthly',
      features: ['AI Chat', 'Advanced Analytics', 'Priority Support', 'API Access']
    };

    this.plans.set('basic', basicPlan);
    this.plans.set('pro', proPlan);
  }

  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: 'trialing',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };

    this.subscriptions.set(subscription.id, subscription);
    // Removed console.log

    return subscription;
  }

  async processPayment(subscriptionId: string): Promise<{ success: boolean; message: string }> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return { success: false, message: 'Subscription not found' };
    }

    subscription.status = 'active';
    return { success: true, message: 'Payment processed successfully' };
  }

  getPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values());
  }
}