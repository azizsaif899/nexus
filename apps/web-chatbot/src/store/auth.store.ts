import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  authService,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "../services/auth.service";

interface AuthState {
  // الحالة
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // الإجراءات
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // الحالة الأولية
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // تسجيل الدخول
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const user = await authService.login(credentials);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "فشل في تسجيل الدخول",
          });
          throw error;
        }
      },

      // إنشاء حساب جديد
      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const user = await authService.register(data);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "فشل في إنشاء الحساب",
          });
          throw error;
        }
      },

      // تسجيل الدخول بـ Google
      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });

          const user = await authService.loginWithGoogle();

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "فشل في تسجيل الدخول بـ Google",
          });
          throw error;
        }
      },

      // تسجيل الخروج
      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          await authService.logout();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "فشل في تسجيل الخروج",
          });
          throw error;
        }
      },

      // إعادة تعيين كلمة المرور
      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });

          await authService.resetPassword(email);

          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "فشل في إرسال رابط إعادة التعيين",
          });
          throw error;
        }
      },

      // مسح الخطأ
      clearError: () => set({ error: null }),

      // تحديث المستخدم (للاستخدام الداخلي)
      setUser: (user: AuthUser | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // تحديث حالة التحميل
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // تحديث الخطأ
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "auth-storage", // اسم التخزين في localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // ما سيتم حفظه فقط
    }
  )
);

// مراقبة تغييرات حالة المصادقة من Firebase
authService.onAuthStateChange((user) => {
  const store = useAuthStore.getState();
  if (user !== store.user) {
    store.setUser(user);
  }
});
