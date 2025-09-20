# 📋 خطة العمل اليومية - يوم 121

**المدير المسؤول:** Gemini AI  
**المنفذ:** Amazon Q  
**التاريخ:** 2025-08-25

**الهدف الرئيسي لليوم:** إعداد أساسات Firestore، إزالة النظام القديم، وبناء خدمة البيانات المركزية.

---

### 🔥 **قائمة المهام (15 مهمة):**

**-- الإعداد الأساسي --**

- [x] **TASK-121-01:** تثبيت حزمة `firebase` في المشروع. ✅
  - **الموقع:** `g-assistant-nx/`
  - **الملفات المتأثرة:** `package.json`, `pnpm-lock.yaml`
  - **الأمر:** `pnpm add firebase`

- [x] **TASK-121-02:** إنشاء ملف إعدادات Firebase المركزي. ✅
  - **الموقع:** `packages/core/src/`
  - **الملفات المتأثرة:** إنشاء `firebase.ts`
  - **المحتوى:** يجب أن يحتوي على تهيئة الاتصال بـ Firebase وتصدير `db`.

- [x] **TASK-121-03:** تأمين مفاتيح API باستخدام متغيرات البيئة. ✅
  - **الموقع:** `packages/core/src/firebase.ts` و `g-assistant-nx/.env`
  - **الملفات المتأثرة:** تعديل `firebase.ts` ليقرأ من `process.env`، إضافة المتغيرات إلى `.env.example`.

- [x] **TASK-121-04:** حذف ملف `dataconnect.yaml` القديم. ✅
  - **الموقع:** `g-assistant-nx/`
  - **الملفات المتأثرة:** حذف `dataconnect.yaml`.

- [x] **TASK-121-05:** حذف مجلد `schema/` القديم. ✅
  - **الموقع:** `g-assistant-nx/`
  - **الملفات المتأثرة:** حذف مجلد `schema/` وكل محتوياته.

- [x] **TASK-121-06:** إنشاء ملف قواعد أمان Firestore. ✅
  - **الموقع:** جذر المشروع (بجانب `firebase.json`)
  - **الملفات المتأثرة:** إنشاء `firestore.rules` مع قواعد أولية (مغلقة بشكل افتراضي).

**-- بناء خدمة Firestore --**

- [x] **TASK-121-07:** إنشاء ملف خدمة Firestore المركزية. ✅
  - **الموقع:** `packages/core/src/services/`
  - **الملفات المتأثرة:** إنشاء `firestore.service.ts`.

- [x] **TASK-121-08:** بناء دالة `addDoc` في `FirestoreService`. ✅
  - **الموقع:** `packages/core/src/services/firestore.service.ts`
  - **الوصف:** دالة عامة لإضافة مستند جديد إلى أي collection.

- [x] **TASK-121-09:** بناء دالة `getDoc` في `FirestoreService`. ✅
  - **الموقع:** `packages/core/src/services/firestore.service.ts`
  - **الوصف:** دالة عامة لجلب مستند معين بواسطة ID.

- [x] **TASK-121-10:** بناء دالة `updateDoc` في `FirestoreService`. ✅
  - **الموقع:** `packages/core/src/services/firestore.service.ts`
  - **الوصف:** دالة عامة لتحديث مستند موجود.

- [x] **TASK-121-11:** بناء دالة `deleteDoc` في `FirestoreService`. ✅
  - **الموقع:** `packages/core/src/services/firestore.service.ts`
  - **الوصف:** دالة عامة لحذف مستند معين.

**-- بناء وحدة المستخدمين (API) --**

- [x] **TASK-121-12:** إنشاء وحدة المستخدمين `UsersModule`. ✅
  - **الموقع:** `apps/api/src/modules/users/`
  - **الملفات المتأثرة:** إنشاء `users.module.ts`.

- [x] **TASK-121-13:** إنشاء خدمة المستخدمين `UsersService`. ✅
  - **الموقع:** `apps/api/src/modules/users/`
  - **الملفات المتأثرة:** إنشاء `users.service.ts` مع هيكل الكلاس الأساسي.

- [x] **TASK-121-14:** إنشاء متحكم المستخدمين `UsersController`. ✅
  - **الموقع:** `apps/api/src/modules/users/`
  - **الملفات المتأثرة:** إنشاء `users.controller.ts` مع هيكل الكلاس الأساسي.

- [x] **TASK-121-15:** ربط `UsersService` و `UsersController` في `UsersModule`. ✅
  - **الموقع:** `apps/api/src/modules/users/users.module.ts`
  - **الوصف:** إضافة `UsersService` كـ provider و `UsersController` كـ controller في إعدادات الـ module.
