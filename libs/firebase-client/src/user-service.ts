import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import { tenantService } from './tenant-service';

export interface UserProfile {
  uid: string;
  email: string;
  tenantId: string;
  role: 'owner' | 'admin' | 'user';
  displayName?: string;
  createdAt: Date;
}

export class UserService {
  
  // تسجيل مستخدم جديد (مالك شركة)
  async signUpOwner(email: string, password: string, companyName: string): Promise<UserProfile> {
    // إنشاء حساب في Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // إنشاء شركة جديدة
    const tenantId = await tenantService.createTenant(companyName, user.uid);

    // حفظ بيانات المستخدم
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      tenantId,
      role: 'owner',
      displayName: companyName,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  }

  // دعوة مستخدم جديد للشركة
  async inviteUser(email: string, tenantId: string, role: 'admin' | 'user'): Promise<void> {
    // التحقق من الحصة
    const canAddUser = await tenantService.checkQuota(tenantId, 'users');
    if (!canAddUser) {
      throw new Error('تم الوصول للحد الأقصى من المستخدمين');
    }

    // إنشاء دعوة (يمكن إرسال إيميل هنا)
    await setDoc(doc(db, 'invitations', `${tenantId}_${email}`), {
      email,
      tenantId,
      role,
      status: 'pending',
      createdAt: new Date()
    });
  }

  // تسجيل دخول
  async signIn(email: string, password: string): Promise<UserProfile | null> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return this.getUserProfile(userCredential.user.uid);
  }

  // الحصول على بيانات المستخدم
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
  }

  // تسجيل خروج
  async signOut(): Promise<void> {
    await signOut(auth);
  }

  // مراقبة حالة المستخدم
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

export const userService = new UserService();