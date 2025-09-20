# 📋 خطة العمل اليومية - يوم 123

**المدير المسؤول:** Gemini AI  
**المنفذ:** Amazon Q  
**التاريخ:** 2025-08-27

**الهدف الرئيسي لليوم:** توضيح استراتيجية البيانات، إصلاح مشاكل `tsconfig`، وتنظيف بقايا SQL.

---

### 🔥 **قائمة المهام (15 مهمة):**

**-- توضيح استراتيجية البيانات --**

- [ ] **TASK-123-01:** إنشاء وثيقة استراتيجية البيانات.
  - **الموقع:** `docs/architecture/`
  - **الملفات المتأثرة:** إنشاء `DATA_STRATEGY.md`.
  - **الوصف:** توضيح أن Firestore هي قاعدة البيانات الأساسية للبيانات التشغيلية، وأن BigQuery ستستخدم للتحليلات فقط.

**-- إصلاح مشاكل `tsconfig` والمسارات --**

- [ ] **TASK-123-02:** تفعيل `esModuleInterop` في `apps/api/tsconfig.json`.
  - **الموقع:** `apps/api/tsconfig.json`
  - **الوصف:** إضافة `"esModuleInterop": true` لحل مشاكل استيراد المكتبات.

- [ ] **TASK-123-03:** إصلاح مسار استيراد `firestore.service.ts`.
  - **الموقع:** `packages/core/src/services/firestore.service.ts`
  - **الوصف:** تغيير الاستيراد من `../firebase-config` إلى `../firebase`.

- [ ] **TASK-123-04:** إصلاح مسار استيراد `firestore.service.ts` في `agents.service.ts`.
  - **الموقع:** `apps/api/src/modules/agents/agents.service.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias (مثال: `@azizsys/core/services/firestore.service`).

- [ ] **TASK-123-05:** إصلاح مسار استيراد `firestore.service.ts` في `queries.service.ts`.
  - **الموقع:** `apps/api/src/modules/queries/queries.service.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias.

- [ ] **TASK-123-06:** إصلاح مسار استيراد `firestore.service.ts` في `users.service.ts`.
  - **الموقع:** `apps/api/src/modules/users/users.service.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias.

- [ ] **TASK-123-07:** إصلاح مسار استيراد `ai-engine` في `ai.service.ts`.
  - **الموقع:** `apps/api/src/ai/ai.service.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias (مثال: `@azizsys/domain/ai-engine`).

- [ ] **TASK-123-08:** إصلاح مسار استيراد `core-logic` في `chat.gateway.ts`.
  - **الموقع:** `apps/api/src/chat/chat.gateway.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias (مثال: `@azizsys/core/core-logic`).

- [ ] **TASK-123-09:** إصلاح مسار استيراد `core-logic` في `health.controller.ts`.
  - **الموقع:** `apps/api/src/health/health.controller.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias (مثال: `@azizsys/core/json-rpc-client`).

- [ ] **TASK-123-10:** إصلاح مسار استيراد `security-core` في `security.service.ts`.
  - **الموقع:** `apps/api/src/security/security.service.ts`
  - **الوصف:** تغيير المسار النسبي إلى alias (مثال: `@azizsys/domain/security-core`).

**-- تنظيف بقايا SQL --**

- [ ] **TASK-123-11:** حذف مجلد `migrations` الخاص بقاعدة بيانات SQL.
  - **الموقع:** `apps/api/src/database/migrations/`
  - **الوصف:** حذف المجلد بالكامل لأنه لم يعد له داعي بعد التحول إلى Firestore.

**-- إصلاح مشاكل الاستيراد العامة --**

- [ ] **TASK-123-12:** تثبيت أنواع `multer` المفقودة.
  - **الموقع:** `g-assistant-nx/`
  - **الوصف:** تثبيت `@types/multer` لحل مشكلة `Express.Multer.File`.
  - **الأمر:** `pnpm add -D @types/multer`

- [ ] **TASK-123-13:** إصلاح استيراد `crypto`.
  - **الموقع:** `apps/api/src/controllers/webhook.controller.ts`
  - **الوصف:** تغيير `import crypto from 'crypto'` إلى `import * as crypto from 'crypto'`.

- [ ] **TASK-123-14:** إصلاح استيراد `dotenv`.
  - **الموقع:** `apps/api/src/main.ts`
  - **الوصف:** تغيير `import dotenv from 'dotenv'` إلى `import * as dotenv from 'dotenv'`.

- [ ] **TASK-123-15:** إعادة تشغيل بناء الـ API للتحقق من الإصلاحات.
  - **الموقع:** `g-assistant-nx/`
  - **الوصف:** تشغيل `pnpm exec nx run api:build` لرؤية الأخطاء المتبقية.
