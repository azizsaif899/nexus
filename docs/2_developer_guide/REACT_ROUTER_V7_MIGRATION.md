# 🚀 React Router v7 Migration Guide

## 📋 **التغييرات الرئيسية**

### **1. تحديث App.tsx للـ web-chatbot**

```tsx
// قبل - React Router v6
import { useState } from 'react';

// بعد - React Router v7
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HeroSection />
      },
      {
        path: "app-selection",
        element: <AppSelectionPage />
      }
    ]
  }
]);

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

### **2. تحديث admin-dashboard**

```tsx
// apps/admin-dashboard/src/main.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/settings",
    element: <Settings />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

## 🔧 **الملفات المتأثرة**

### **web-chatbot:**
- `src/App.tsx` - تحديث كامل للروتينج
- `src/components/Header.tsx` - تحديث navigation
- `src/components/AppSelectionPage.tsx` - تحديث links

### **admin-dashboard:**
- `src/main.tsx` - إعداد router جديد
- `src/components/Navigation.tsx` - تحديث navigation
- `src/pages/*.tsx` - تحديث route components

## ⚠️ **نصائح مهمة**

1. **Data Loading**: استخدم `loader` functions للبيانات
2. **Error Handling**: استخدم `errorElement` لكل route
3. **Navigation**: استخدم `useNavigate` بدلاً من `navigate`
4. **Links**: استخدم `Link` component الجديد

## 🧪 **اختبار الترقية**

```bash
# تشغيل التطبيقات للاختبار
nx serve web-chatbot
nx serve admin-dashboard

# فحص الروابط والتنقل
npm run test:routing
```