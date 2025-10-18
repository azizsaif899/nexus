import { collection, doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from './firebase-config';

const db = getFirestore(firebaseApp);

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro';
  maxUsers: number;
  maxAIRequests: number;
}

export class TenantService {

  async createTenant(name: string, ownerId: string): Promise<string> {
    const tenantId = `tenant_${Date.now()}`;

    const tenant: Tenant = {
      id: tenantId,
      name,
      plan: 'free',
      maxUsers: 1,
      maxAIRequests: 100
    };

    await setDoc(doc(db, 'tenants', tenantId), tenant);
    await setDoc(doc(db, 'users', ownerId), {
      tenantId,
      role: 'owner',
      createdAt: new Date()
    });

    return tenantId;
  }

  getTenantCollection(tenantId: string, collectionName: string) {
    return collection(db, 'tenant_data', tenantId, collectionName);
  }
}

export const tenantService = new TenantService();