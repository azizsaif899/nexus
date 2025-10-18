import { Injectable } from '@nestjs/common';
import { getFirestore } from 'firebase-admin/firestore';

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  maxUsers: number;
  maxStorage: number;
}

@Injectable()
export class TenantService {
  private db = getFirestore();

  // Multi-tenant data isolation
  getCollection(tenantId: string, collection: string) {
    return this.db.collection(`tenants/${tenantId}/${collection}`);
  }

  async createTenant(name: string, plan = 'free'): Promise<Tenant> {
    const tenant: Tenant = {
      id: `tenant_${Date.now()}`,
      name,
      plan,
      status: 'active',
      maxUsers: plan === 'free' ? 1 : plan === 'pro' ? 5 : -1,
      maxStorage: plan === 'free' ? 1024 : plan === 'pro' ? 10240 : -1
    };

    await this.db.collection('tenants').doc(tenant.id).set(tenant);
    return tenant;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    const doc = await this.db.collection('tenants').doc(tenantId).get();
    return doc.exists ? doc.data() as Tenant : null;
  }
}