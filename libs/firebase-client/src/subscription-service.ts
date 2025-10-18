import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config';

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  maxUsers: number;
  maxAIRequests: number;
  features: string[];
}

export const PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'مجاني',
    price: 0,
    maxUsers: 1,
    maxAIRequests: 100,
    features: ['chat', 'basic-ai']
  },
  pro: {
    id: 'pro', 
    name: 'احترافي',
    price: 99,
    maxUsers: 5,
    maxAIRequests: 10000,
    features: ['chat', 'ai', 'crm', 'automation']
  },
  enterprise: {
    id: 'enterprise',
    name: 'مؤسسي', 
    price: 499,
    maxUsers: -1,
    maxAIRequests: -1,
    features: ['all']
  }
};

export class SubscriptionService {
  
  async upgradePlan(tenantId: string, planId: string): Promise<void> {
    const plan = PLANS[planId];
    if (!plan) throw new Error('خطة غير صحيحة');

    // تحديث بيانات الشركة
    await updateDoc(doc(db, 'tenants', tenantId), {
      plan: planId,
      maxUsers: plan.maxUsers,
      maxAIRequests: plan.maxAIRequests,
      updatedAt: new Date()
    });

    // حفظ معلومات الاشتراك
    await setDoc(doc(db, 'subscriptions', tenantId), {
      planId,
      status: 'active',
      startDate: new Date(),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
      price: plan.price
    });
  }

  async getSubscription(tenantId: string) {
    const docRef = doc(db, 'subscriptions', tenantId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async trackUsage(tenantId: string, resource: string, amount = 1): Promise<void> {
    const usageRef = doc(db, 'usage', tenantId);
    const usageDoc = await getDoc(usageRef);
    
    const currentUsage = usageDoc.exists() ? usageDoc.data() : {};
    const newUsage = (currentUsage[resource] || 0) + amount;
    
    await setDoc(usageRef, {
      ...currentUsage,
      [resource]: newUsage,
      lastUpdated: new Date()
    });
  }
}

export const subscriptionService = new SubscriptionService();