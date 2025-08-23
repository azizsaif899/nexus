# 🏢 CRM System - نظام إدارة علاقات العملاء

## 📍 الموقع الجديد
```
apps/crm-system/
```

## 🚀 التشغيل السريع

```bash
# تثبيت التبعيات
npm install

# تشغيل CRM System
nx serve crm-system

# أو
cd apps/crm-system
npm run dev
```

## 📁 الهيكل المنظم

```
apps/crm-system/
├── src/
│   ├── app/                 # التطبيق الرئيسي
│   │   └── App.tsx
│   ├── components/          # المكونات المشتركة
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── ui/             # مكونات UI الأساسية
│   ├── pages/              # الصفحات
│   │   ├── Dashboard.tsx
│   │   ├── Customers.tsx
│   │   ├── Leads.tsx
│   │   └── Campaigns.tsx
│   ├── services/           # خدمات API
│   │   └── crm.service.ts
│   ├── hooks/              # React Hooks
│   │   └── useCRM.ts
│   ├── types/              # تعريفات TypeScript
│   │   └── crm.types.ts
│   ├── utils/              # أدوات مساعدة
│   │   └── crm.utils.ts
│   └── assets/             # الملفات الثابتة
├── DESIGN_STRUCTURE.md     # هيكل التصميم
├── FIGMA_TEMPLATE.md       # قالب Figma
└── README.md              # هذا الملف
```

## 🎯 الميزات الأساسية

### ✅ جاهز للتطوير
- ⚡ Vite + React + TypeScript
- 🎨 Tailwind CSS + Design System
- 🔄 React Query للبيانات
- 📱 Responsive Design
- 🌐 RTL Support

### 🔗 التكامل
- 🗄️ BigQuery Database
- 🤖 Odoo CRM
- 📊 Meta Ads API
- 📱 WhatsApp Business

## 🎨 Design System

### الألوان
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)

### المكونات
- Cards, Buttons, Forms
- Status Badges
- KPI Cards
- Charts & Graphs

## 📊 الصفحات

1. **Dashboard** - لوحة التحكم الرئيسية
2. **Customers** - إدارة العملاء
3. **Leads** - إدارة العملاء المحتملين
4. **Campaigns** - تتبع الحملات

## 🔧 التطوير

### إضافة صفحة جديدة
```tsx
// src/pages/NewPage.tsx
import React from 'react';

export default function NewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">صفحة جديدة</h1>
    </div>
  );
}
```

### إضافة مكون جديد
```tsx
// src/components/NewComponent.tsx
import React from 'react';

interface Props {
  title: string;
}

export default function NewComponent({ title }: Props) {
  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  );
}
```

## 🚀 النشر

```bash
# بناء للإنتاج
nx build crm-system

# الملفات في
dist/apps/crm-system/
```

## 📱 الوصول

- **Development**: http://localhost:4200
- **Production**: سيتم تحديده لاحقاً

---

**✅ CRM System جاهز للتطوير في مكان منظم ومنفصل!**