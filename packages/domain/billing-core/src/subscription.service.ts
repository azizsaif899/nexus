import { Injectable } from '@nestjs/common';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  currency: string;
  features: {
    aiRequests: number;
    storage: number;
    users: number;
    crm: boolean;
    automation: boolean;
    support: 'community' | 'email' | '24/7';
  };
}

export const PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'SAR',
    features: {
      aiRequests: 100,
      storage: 1,
      users: 1,
      crm: false,
      automation: false,
      support: 'community'
    }
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    price: 99,
    currency: 'SAR',
    features: {
      aiRequests: 10000,
      storage: 50,
      users: 5,
      crm: true,
      automation: true,
      support: 'email'
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    currency: 'SAR',
    features: {
      aiRequests: -1,
      storage: 500,
      users: -1,
      crm: true,
      automation: true,
      support: '24/7'
    }
  }
};

@Injectable()
export class SubscriptionService {
  private db = getFirestore();

  async getUserSubscription(userId: string) {
    const doc = await this.db.collection('subscriptions').doc(userId).get();
    return doc.exists ? doc.data() : PLANS.free;
  }

  async createSubscription(userId: string, planId: string) {
    const plan = PLANS[planId];
    if (!plan) throw new Error('Invalid plan');

    await this.db.collection('subscriptions').doc(userId).set({
      planId,
      status: 'active',
      startDate: Timestamp.now(),
      currentPeriodEnd: Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
      features: plan.features
    });
  }

  async checkQuota(userId: string, resource: keyof SubscriptionPlan['features']): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    const usage = await this.getUsage(userId, resource);
    
    const limit = subscription.features[resource];
    if (limit === -1) return true;
    if (typeof limit === 'boolean') return limit;
    
    return usage < limit;
  }

  private async getUsage(userId: string, resource: string): Promise<number> {
    const doc = await this.db.collection('usage').doc(userId).get();
    return doc.exists ? (doc.data()?.[resource] || 0) : 0;
  }

  async incrementUsage(userId: string, resource: string, amount = 1) {
    const ref = this.db.collection('usage').doc(userId);
    await ref.set(
      { [resource]: (await this.getUsage(userId, resource)) + amount },
      { merge: true }
    );
  }
}
