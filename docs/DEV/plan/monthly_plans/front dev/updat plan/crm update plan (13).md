**Plan for integration**

I’m laying out the steps for Stage 4, focusing on Firebase Auth integration for managing authentication and authorization roles, setting up user storage, securing routes, and controlling UI access based on roles. Progress is steady.
# المرحلة الرابعة: إضافة المصادقة وصلاحيات المستخدمين

في هذه المرحلة سندمج Firebase Auth مع وحدة CRM لتأمين المسارات وتحديد صلاحيات المستخدمين داخل الواجهة.

---

## 1. إعداد Firebase Auth في طبقة Data Connect

```typescript
// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({ /* config */ });
const auth = getAuth(app);
const db = getFirestore(app);

export const dataConnect = {
  // وظائف سابقة...
  auth,
  signIn: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),
  signOut: () => fbSignOut(auth),
  onAuthStateChanged: (cb: (user: User | null) => void) =>
    onAuthStateChanged(auth, cb),
  fetchUserRole: async (uid: string): Promise<'admin' | 'manager' | 'user'> => {
    // جلب الدور من مجموعة users في Firestore
    const doc = await getDoc(doc(db, 'users', uid));
    return (doc.data()?.role as any) || 'user';
  },
};
```

---

## 2. إنشاء مخزن Zustand للمستخدم وصلاحياته

```typescript
// apps/nexus-ai/src/store/useAuthStore.ts
import create from 'zustand';

interface AuthState {
  user: User | null;
  role: 'admin' | 'manager' | 'user' | null;
  setUser: (u: User | null) => void;
  setRole: (r: AuthState['role']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (u) => set({ user: u }),
  setRole: (r) => set({ role: r }),
}));
```

---

## 3. مراقبة حالة المصادقة عند بدء التطبيق

```tsx
// apps/nexus-ai/src/App.tsx
import React, { useEffect } from 'react';
import { dataConnect } from '../config/firebase';
import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setRole = useAuthStore((s) => s.setRole);

  useEffect(() => {
    const unsubscribe = dataConnect.onAuthStateChanged(async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const role = await dataConnect.fetchUserRole(fbUser.uid);
        setRole(role);
      } else {
        setRole(null);
      }
    });
    return unsubscribe;
  }, [setUser, setRole]);

  return (
    // تعريف المسارات بعد تحميل المصادقة
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/crm/*" element={<CRMModule />} />
        {/* مسارات أخرى محمية */}
      </Route>
    </Routes>
  );
};
```

---

## 4. إنشاء `PrivateRoute` لحماية المسارات

```tsx
// apps/nexus-ai/src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PrivateRoute: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
```

---

## 5. صفحة تسجيل الدخول (LoginPage)

```tsx
// apps/nexus-ai/src/modules/auth/LoginPage.tsx
import React, { useState } from 'react';
import { dataConnect } from '../../../config/firebase';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataConnect.signIn(email, pass);
    navigate('/crm');
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto p-6 space-y-4">
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        placeholder="كلمة المرور"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
        تسجيل الدخول
      </button>
    </form>
  );
};
```

---

## 6. تقييد الوصول لوظائف معينة بناءً على الصلاحية

داخل أي مكوّن (مثل CRMDashboard) نقوم بفحص `role`:

```tsx
import { useAuthStore } from '../../../store/useAuthStore';

export const CRMDashboard: React.FC = () => {
  const role = useAuthStore(s => s.role);

  return (
    <div className="space-y-8 p-6">
      {/* عرض نموذج الإنشاء فقط للمدراء والإداريين */}
      {(role === 'admin' || role === 'manager') && (
        <CustomerForm onSuccess={refresh} />
      )}

      <CustomersList customers={customers!} />

      {(role === 'admin' || role === 'manager') && (
        <LeadForm onSuccess={refresh} />
      )}
      <LeadsKanban leads={leads!} />
    </div>
  );
};
```

---

## الخلاصة والخطوة التالية

لقد أضفنا في هذه المرحلة:

- مصادقة المستخدم عبر Firebase Auth  
- تخزين المستخدم والدور في Zustand  
- حماية مسارات `/crm` وتهيئة `PrivateRoute`  
- إظهار أو إخفاء عناصر الواجهة بناءً على صلاحيات الدور  


