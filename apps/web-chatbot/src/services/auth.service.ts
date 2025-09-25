// Firebase Auth Service - Integration with Nexus Core
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDNigeaS3tyY809X9KCKMNRGB6LgkO6BmY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0147492600.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0147492600',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0147492600.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '869672857667',
  appId: process.env.FIREBASE_APP_ID || '1:869672857667:web:1604e7fa7df84b4dd3a4f6'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

export class AuthService {
  private googleProvider = new GoogleAuthProvider();

  // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      return this.mapFirebaseUser(result.user);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // إنشاء حساب جديد
  async register(data: RegisterData): Promise<AuthUser> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // تحديث الاسم المعروض إذا تم توفيره
      if (data.displayName && result.user) {
        await updateProfile(result.user, {
          displayName: data.displayName,
        });
      }

      return this.mapFirebaseUser(result.user);
    } catch (error: any) {
      console.error("Register error:", error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // تسجيل الدخول بـ Google
  async loginWithGoogle(): Promise<AuthUser> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      return this.mapFirebaseUser(result.user);
    } catch (error: any) {
      console.error("Google login error:", error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // تسجيل الخروج
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error("فشل في تسجيل الخروج");
    }
  }

  // إعادة تعيين كلمة المرور
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // مراقبة حالة المصادقة
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.mapFirebaseUser(user) : null);
    });
  }

  // الحصول على المستخدم الحالي
  getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  // تحويل Firebase User إلى AuthUser
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  // تحويل رموز الأخطاء إلى رسائل عربية
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/user-not-found":
        return "المستخدم غير موجود";
      case "auth/wrong-password":
        return "كلمة المرور غير صحيحة";
      case "auth/email-already-in-use":
        return "البريد الإلكتروني مستخدم بالفعل";
      case "auth/weak-password":
        return "كلمة المرور ضعيفة جداً";
      case "auth/invalid-email":
        return "البريد الإلكتروني غير صالح";
      case "auth/user-disabled":
        return "تم تعطيل هذا الحساب";
      case "auth/too-many-requests":
        return "تم تجاوز عدد المحاولات المسموحة";
      case "auth/network-request-failed":
        return "خطأ في الشبكة، تحقق من اتصالك بالإنترنت";
      case "auth/popup-closed-by-user":
        return "تم إغلاق نافذة تسجيل الدخول";
      default:
        return "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى";
    }
  }
}

export const authService = new AuthService();
