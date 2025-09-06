import { useState, useEffect } from 'react';
import { User, UserRole, Permission } from '../../types/app.types';
import { authService, MockUser } from '../services/auth.service';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((mockUser: MockUser | null) => {
      if (mockUser) {
        // تحويل MockUser إلى User المخصص
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          displayName: mockUser.displayName,
          role: mockUser.role === 'admin' ? UserRole.ADMIN : UserRole.USER,
          permissions: mockUser.role === 'admin' ? Object.values(Permission) : [],
          avatar: mockUser.avatar,
          lastActiveAt: new Date(),
          createdAt: new Date()
        };

        setState({
          user,
          loading: false,
          error: null
        });
      } else {
        setState({
          user: null,
          loading: false,
          error: null
        });
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await authService.login(email, password);
      if (!result.success) {
        setState(prev => ({ ...prev, loading: false, error: result.error }));
      }
      return result;
    } catch (error: any) {
      const errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await authService.logout();
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return state.user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const isAuthenticated = !!state.user;

  return {
    ...state,
    login,
    logout,
    isAuthenticated,
    hasPermission,
    hasRole
  };
};

// دالة مساعدة لترجمة رسائل الخطأ
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'المستخدم غير موجود',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/invalid-email': 'بريد إلكتروني غير صحيح',
    'auth/user-disabled': 'تم تعطيل هذا الحساب',
    'auth/too-many-requests': 'محاولات كثيرة، حاول مرة أخرى لاحقاً',
    'auth/network-request-failed': 'خطأ في الشبكة، تحقق من الاتصال'
  };

  return errorMessages[errorCode] || 'حدث خطأ غير متوقع';
};