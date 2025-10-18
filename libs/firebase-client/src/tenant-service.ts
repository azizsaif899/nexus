import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase-config';

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: Date;
  maxUsers: number;
  maxAIRequests: number;
}

export class TenantService {
  
  // إنشاء شركة جديدة
  async createTenant(name: string, ownerId: string): Promise<string> {
    const tenantId = `tenant_${Date.now()}`;
    
    const tenant: Tenant = {
      id: tenantId,
      name,
      plan: 'free',
      status: 'active',
      createdAt: new Date(),
      maxUsers: 1,
      maxAIRequests: 100
    };

    // إنشاء الشركة
    await setDoc(doc(db, 'tenants', tenantId), tenant);
    
    // ربط المالك بالشركة
    await setDoc(doc(db, 'users', ownerId), {
      tenantId,
      role: 'owner',
      email: '', // سيتم تحديثه من Auth
      createdAt: new Date()
    });

    return tenantId;
  }

  // الحصول على بيانات الشركة
  async getTenant(tenantId: string): Promise<Tenant | null> {
    const docRef = doc(db, 'tenants', tenantId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Tenant : null;
  }

  // الحصول على مجموعة بيانات خاصة بالشركة
  getTenantCollection(tenantId: string, collectionName: string) {
    return collection(db, 'tenant_data', tenantId, collectionName);
  }

  // التحقق من الحصة
  async checkQuota(tenantId: string, resource: 'users' | 'aiRequests'): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) return false;

    if (resource === 'users') {
      const usersQuery = query(
        collection(db, 'users'), 
        where('tenantId', '==', tenantId)
      );
      const users = await getDocs(usersQuery);
      return users.size < tenant.maxUsers || tenant.maxUsers === -1;
    }

    // يمكن إضافة فحص aiRequests هنا
    return true;
  }
}

export const tenantService = new TenantService();