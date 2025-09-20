// خدمة المصادقة المؤقتة للتطوير
// سيتم استبدالها بـ Firebase Authentication عند جاهزية الإعداد

export interface MockUser {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  avatar?: string;
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  constructor() {
    // محاكاة مستخدم مسجل دخول للتطوير
    this.currentUser = {
      id: 'demo-user-123',
      email: 'demo@nexus-ai.com',
      displayName: 'مطور تجريبي',
      role: 'admin',
      avatar: undefined
    };
  }

  async login(email: string, password: string) {
    // محاكاة تسجيل الدخول
    if (email && password) {
      this.currentUser = {
        id: 'demo-user-123',
        email,
        displayName: 'مطور تجريبي',
        role: 'admin'
      };
      this.notifyListeners();
      return { success: true };
    }
    return { success: false, error: 'بيانات غير صحيحة' };
  }

  async logout() {
    this.currentUser = null;
    this.notifyListeners();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    // استدعاء فوري للحالة الحالية
    callback(this.currentUser);
    
    // إرجاع دالة إلغاء الاشتراك
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const authService = new MockAuthService();