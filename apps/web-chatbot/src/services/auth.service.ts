import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  UserCredential 
} from 'firebase/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  /**
   * تسجيل الدخول
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new Error(`فشل تسجيل الدخول: ${error.message}`);
    }
  }

  /**
   * إنشاء حساب جديد
   */
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw new Error(`فشل إنشاء الحساب: ${error.message}`);
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(`فشل تسجيل الخروج: ${error.message}`);
    }
  }

  /**
   * الحصول على المستخدم الحالي
   */
  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  /**
   * تحويل Firebase User إلى AuthUser
   */
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  }
}

export const authService = new AuthService();