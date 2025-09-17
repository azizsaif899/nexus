# 🔧 مهام إصلاح crm-system اليومية - 8 يناير 2025

**المشروع:** crm-system  
**الحالة:** ❌ يحتاج إصلاح فوري  
**الأولوية:** Critical  
**المهام:** 8 مهام أساسية

---

## 🚨 المهام الحرجة (Critical Priority)

### [ ] TASK-CRM-001: إصلاح مشكلة @azizsys/crm-core المفقودة
- **الأولوية:** Critical
- **الوقت المقدر:** 30 دقيقة
- **الملف:** `src/services/crm.service.ts`
- **المشكلة:** `Cannot find module '@azizsys/crm-core'`
- **الحل:** إنشاء types محلية أو إزالة الاستيراد
- **الكود المطلوب:**
```typescript
// استبدال الاستيراد بـ types محلية
import { Customer, Lead, Campaign, CRMStats } from '../types/crm.types';
```

### [ ] TASK-CRM-002: إصلاح خطأ Customer360Data Type
- **الأولوية:** Critical
- **الوقت المقدر:** 15 دقيقة
- **الملف:** `src/hooks/useCRM.ts` (السطر 158)
- **المشكلة:** `Customer360Data` لا يمكن تعيينه لـ `SetStateAction<null>`
- **الحل:** تغيير نوع البيانات في useState
- **الكود المطلوب:**
```typescript
const [data, setData] = useState<Customer360Data | null>(null);
```

### [ ] TASK-CRM-003: إصلاح استيراد Sync من lucide-react
- **الأولوية:** Critical
- **الوقت المقدر:** 10 دقيقة
- **الملف:** `src/pages/Campaigns.tsx`
- **المشكلة:** `Module 'lucide-react' has no exported member 'Sync'`
- **الحل:** استبدال بـ RefreshCw أو RotateCcw
- **الكود المطلوب:**
```typescript
import { RefreshCw } from 'lucide-react';
// استبدال <Sync /> بـ <RefreshCw />
```

---

## ⚡ المهام عالية الأولوية (High Priority)

### [ ] TASK-CRM-004: تنظيف استيرادات React غير المستخدمة
- **الأولوية:** High
- **الوقت المقدر:** 20 دقيقة
- **الملفات المتأثرة:** 6 ملفات
  - `src/app/App.tsx`
  - `src/pages/campaign-tracker.tsx`
  - `src/pages/Campaigns.tsx`
  - `src/pages/crm-advanced.tsx`
  - `src/pages/Customers.tsx`
  - `src/pages/Dashboard.tsx`
- **المشكلة:** `'React' is declared but its value is never read`
- **الحل:** إزالة `import React from 'react'` غير المستخدم

### [ ] TASK-CRM-005: إضافة typecheck مخصص لـ project.json
- **الأولوية:** High
- **الوقت المقدر:** 15 دقيقة
- **الملف:** `project.json`
- **الهدف:** إصلاح مشكلة external dependency
- **الكود المطلوب:**
```json
"typecheck": {
  "executor": "nx:run-commands",
  "options": {
    "command": "tsc --noEmit -p apps/crm-system/tsconfig.json",
    "cwd": "."
  }
}
```

---

## 📊 المهام متوسطة الأولوية (Medium Priority)

### [ ] TASK-CRM-006: إنشاء types محلية شاملة
- **الأولوية:** Medium
- **الوقت المقدر:** 25 دقيقة
- **الملف:** `src/types/crm.types.ts`
- **الهدف:** إضافة جميع الأنواع المفقودة
- **المطلوب:**
  - Customer interface
  - Lead interface  
  - Campaign interface
  - CRMStats interface
  - Customer360Data interface

### [ ] TASK-CRM-007: اختبار Build Process
- **الأولوية:** Medium
- **الوقت المقدر:** 15 دقيقة
- **الأمر:** `npx nx build crm-system`
- **الهدف:** التأكد من نجاح البناء بعد الإصلاحات

---

## 🔧 المهام منخفضة الأولوية (Low Priority)

### [ ] TASK-CRM-008: تحسين tsconfig.json
- **الأولوية:** Low
- **الوقت المقدر:** 10 دقيقة
- **الملف:** `tsconfig.json`
- **الهدف:** تحسين الإعدادات للأداء الأفضل
- **تم بالفعل:** ✅ تم إصلاح moduleResolution

---

## 📋 خطة التنفيذ المقترحة

### المرحلة 1: الإصلاحات الحرجة (60 دقيقة)
1. **TASK-CRM-001** - إصلاح @azizsys/crm-core
2. **TASK-CRM-002** - إصلاح Customer360Data Type  
3. **TASK-CRM-003** - إصلاح Sync import

### المرحلة 2: التحسينات (35 دقيقة)
4. **TASK-CRM-004** - تنظيف React imports
5. **TASK-CRM-005** - إضافة typecheck مخصص

### المرحلة 3: الاستكمال (50 دقيقة)
6. **TASK-CRM-006** - إنشاء types شاملة
7. **TASK-CRM-007** - اختبار Build
8. **TASK-CRM-008** - تحسينات إضافية

---

## 🎯 النتائج المتوقعة

### بعد إنجاز المهام:
- ✅ **TypeScript:** صفر أخطاء
- ✅ **Build:** ينجح بدون مشاكل
- ✅ **Code Quality:** نظيف ومنظم
- ✅ **Types:** محددة بوضوح
- ✅ **Imports:** صحيحة ومحسنة

### معايير النجاح:
- [ ] `npx tsc --noEmit` ينجح
- [ ] `npx nx build crm-system` ينجح
- [ ] `npx nx run crm-system:typecheck` يعمل
- [ ] جميع الملفات خالية من أخطاء TypeScript

---

## ⏱️ تقدير الوقت الإجمالي

- **المهام الحرجة:** 55 دقيقة
- **المهام العالية:** 35 دقيقة  
- **المهام المتوسطة:** 40 دقيقة
- **المهام المنخفضة:** 10 دقيقة
- **المجموع:** 140 دقيقة (2.3 ساعة)

**🚀 جاهز للبدء فور الموافقة!**