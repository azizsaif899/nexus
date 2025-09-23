import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import {
  authService,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "../services/auth.service";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: storeLogin,
    register: storeRegister,
    loginWithGoogle: storeLoginWithGoogle,
    logout: storeLogout,
    resetPassword: storeResetPassword,
    clearError,
  } = useAuthStore();

  // Query للحصول على بيانات المستخدم الحالية
  const {
    data: currentUser,
    isLoading: queryLoading,
    error: queryError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<AuthUser | null> => {
      return authService.getCurrentUser();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated, // تشغيل الـ query فقط إذا كان المستخدم مصادقاً
  });

  // Mutation لتسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return storeLogin(credentials);
    },
    onSuccess: () => {
      // تحديث cache بعد تسجيل الدخول الناجح
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      clearError();
    },
    onError: (error: any) => {
      console.error("Login mutation error:", error);
    },
  });

  // Mutation لإنشاء حساب جديد
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return storeRegister(data);
    },
    onSuccess: () => {
      // تحديث cache بعد التسجيل الناجح
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      clearError();
    },
    onError: (error: any) => {
      console.error("Register mutation error:", error);
    },
  });

  // Mutation لتسجيل الدخول بـ Google
  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      return storeLoginWithGoogle();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      clearError();
    },
    onError: (error: any) => {
      console.error("Google login mutation error:", error);
    },
  });

  // Mutation لتسجيل الخروج
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return storeLogout();
    },
    onSuccess: () => {
      // مسح cache بعد تسجيل الخروج
      queryClient.clear();
      clearError();
    },
    onError: (error: any) => {
      console.error("Logout mutation error:", error);
    },
  });

  // Mutation لإعادة تعيين كلمة المرور
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return storeResetPassword(email);
    },
    onSuccess: () => {
      clearError();
    },
    onError: (error: any) => {
      console.error("Reset password mutation error:", error);
    },
  });

  // دمج حالات التحميل والأخطاء
  const isLoading =
    storeLoading ||
    queryLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    googleLoginMutation.isPending ||
    logoutMutation.isPending ||
    resetPasswordMutation.isPending;

  const error =
    storeError ||
    queryError?.message ||
    loginMutation.error?.message ||
    registerMutation.error?.message ||
    googleLoginMutation.error?.message ||
    logoutMutation.error?.message ||
    resetPasswordMutation.error?.message;

  return {
    // البيانات
    user: currentUser || user,
    isAuthenticated,

    // الحالات
    isLoading,
    error,

    // الإجراءات
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    loginWithGoogle: googleLoginMutation.mutate,
    logout: logoutMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    // مسح الخطأ
    clearError,

    // إعادة تحميل البيانات
    refetchUser,

    // حالات مفصلة للتحكم الدقيق
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isGoogleLoginLoading: googleLoginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };
};
