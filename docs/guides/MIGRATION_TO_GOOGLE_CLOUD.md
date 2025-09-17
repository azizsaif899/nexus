# 🚀 خطة الانتقال والتكامل مع منظومة Google & Firebase

**الجمهور المستهدف:** فريق التطوير بأكمله (Frontend, Backend, DevOps).
**الهدف:** توفير خارطة طريق مفصلة لنقل مشروع `AzizSys` إلى بيئة تطوير وإنتاج سحابية متكاملة باستخدام Project IDX, Firebase, و Google Cloud.

---

## 1. الرؤية والمقدمة: لماذا هذا الانتقال؟

الانتقال إلى Firebase و Google Cloud ليس مجرد تغيير في بيئة العمل، بل هو ترقية استراتيجية للمشروع بأكمله. الهدف هو الاستفادة من بنية تحتية مُدارة بالكامل (Managed Infrastructure)، قابلة للتوسع، وآمنة، ومصممة للعمل الجماعي، مع فتح الباب للتكامل العميق مع خدمات Google الأخرى (مثل Google AI, BigQuery).

**المفاهيم الأساسية التي سنعتمد عليها:**

*   **بيئة التطوير (بديل VS Code المحلي):** سنستخدم **Project IDX**، وهو بيئة تطوير سحابية من Google مبنية على VS Code، تسمح بالبرمجة والتعاون مباشرة في المتصفح مع تكامل عميق مع Firebase.
*   **استضافة الواجهة (Frontend Hosting):** سنستخدم **Firebase Hosting** لنشر واجهة Next.js عالمياً عبر شبكة CDN فائقة السرعة.
*   **استضافة الخلفية (Backend Hosting):** سننشر الواجهة الخلفية (NestJS API) باستخدام **Cloud Functions for Firebase**.
*   **استضافة محرك العمليات (Workflow Engine):** سننشر حاوية Docker الخاصة بـ Camunda باستخدام **Google Cloud Run**.

---

## 2. كيف أنقله؟ (آلية الاستيراد والدمج)

نعم، يمكنك استيراد مشروعك الحالي بسهولة من GitHub. العملية لا تتطلب إعادة بناء، بل إعادة نشر (Re-platforming).

### **خطة الانتقال خطوة بخطوة:**

#### **المرحلة 0: التحضير**

1.  **إنشاء مشروع Firebase:** اذهب إلى [Firebase Console](https://console.firebase.google.com/) وأنشئ مشروعاً جديداً (e.g., `azizsys-prod`). سيتم تلقائياً إنشاء مشروع Google Cloud مرتبط به.
2.  **تفعيل الفوترة:** بعض الخدمات التي سنستخدمها (مثل Cloud Run و Cloud Functions) تتطلب تفعيل الفوترة في مشروع Google Cloud. (ملاحظة: كلتا الخدمتين لهما طبقة مجانية سخية جداً).
3.  **تنظيف GitHub:** تأكد من أن الفرع الرئيسي (main branch) في مستودع GitHub الخاص بك يحتوي على أحدث نسخة مستقرة من الكود.

#### **المرحلة 1: الانتقال إلى بيئة التطوير السحابية (Project IDX)**

هذه الخطوة ستجمع فريقك في مكان واحد.

1.  **اذهب إلى Project IDX:** [https://idx.google.com/](https://idx.google.com/)
2.  **استيراد المشروع:** اختر "Import a repository" وقم بربط حساب GitHub الخاص بك. اختر مستودع `azizsys5`.
3.  **انتظر الإعداد:** سيقوم IDX تلقائياً بتحليل مشروعك، تثبيت التبعيات (مثل `pnpm install`)، وتوفير بيئة تطوير كاملة مشابهة لـ VS Code تعمل في المتصفح.
4.  **التعاون:** الآن يمكن لجميع المبرمجين الوصول إلى نفس بيئة العمل، مع طرفية (terminal) ومعاينة حية للمشروع، مما يسهل العمل الجماعي بشكل كبير.

#### **المرحلة 2: نشر الواجهة الأمامية (Next.js Frontend)**

1.  **تثبيت أدوات Firebase:** في طرفية IDX، نفذ `pnpm install -g firebase-tools`.
2.  **تسجيل الدخول:** نفذ `firebase login`.
3.  **تهيئة الاستضافة:** نفذ `firebase init hosting` داخل مجلد `g-assistant-nx`.
    *   اختر المشروع الذي أنشأته في Firebase Console.
    *   عندما يسألك عن المجلد العام (public directory)، أدخل المسار الذي يحتوي على ملفات Next.js المبنية (غالباً `.next` أو `out`).
    *   اختر "Yes" عندما يسألك "Configure as a single-page app".
4.  **النشر:** نفذ الأمر `firebase deploy --only hosting`.
5.  **النتيجة:** سيتم نشر واجهتك الأمامية على رابط عام (`your-project-id.web.app`) وتوزيعها عالمياً.

#### **المرحلة 3: نشر الواجهة الخلفية (NestJS API)**

هذه هي الخطوة الأكثر تقنية. سنقوم بتحويل NestJS API ليعمل كـ "دالة سحابية" (Cloud Function).

1.  **تعديل الـ API:** في مجلد `apps/api`، سنحتاج إلى ملف `index.ts` يقوم بتصدير التطبيق كدالة.
    *   **مثال للكود في `apps/api/src/index.ts`:**
        ```typescript
        import * as functions from 'firebase-functions';
        import { NestFactory } from '@nestjs/core';
        import { AppModule } from './app/app.module';
        import { ExpressAdapter } from '@nestjs/platform-express';
        import * as express from 'express';

        const server = express();
        const createNestServer = async (expressInstance) => {
          const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
          return app.init();
        };

        createNestServer(server);
        export const api = functions.https.onRequest(server);
        ```
2.  **تهيئة Functions:** في ملف `firebase.json` في جذر المشروع، أضف إعدادات الدوال لإعادة توجيه الطلبات.
    ```json
    {
      "functions": {
        "source": "dist/apps/api" // المسار بعد عملية البناء
      },
      "hosting": {
        // ... إعدادات الاستضافة
        "rewrites": [
          {
            "source": "/api/**",
            "function": "api"
          }
        ]
      }
    }
    ```
3.  **النشر:** نفذ `firebase deploy --only functions`.
4.  **النتيجة:** الآن أي طلب يذهب إلى `your-project-id.web.app/api/...` سيتم توجيهه تلقائياً إلى NestJS API الذي يعمل الآن بدون خوادم (Serverless).

#### **المرحلة 4: نشر محرك Camunda**

بما أن Camunda هو تطبيق Java في حاوية Docker، لا يمكن تشغيله مباشرة في Cloud Functions. الحل الأمثل هو **Google Cloud Run**.

1.  **نشر الحاوية:**
    *   اذهب إلى Google Artifact Registry (مستودع الحاويات) وأنشئ مستودعاً جديداً.
    *   من بيئة IDX، قم ببناء صورة Docker الخاصة بـ Camunda وادفعها (push) إلى Artifact Registry.
2.  **إنشاء خدمة Cloud Run:**
    *   اذهب إلى Google Cloud Run في لوحة تحكم Google Cloud.
    *   أنشئ خدمة جديدة، واختر صورة الحاوية التي دفعتها في الخطوة السابقة.
    *   قم بتعيين إعدادات الذاكرة والمعالج، وافتح المنفذ `8080`.
3.  **تأمين الرابط:** ستحصل على رابط HTTPS عام لخدمة Camunda.
4.  **تحديث الإعدادات:** في إعدادات البيئة الخاصة بالـ API (الذي يعمل على Cloud Functions)، قم بتحديث متغير `CAMUNDA_URL` ليشير إلى رابط خدمة Cloud Run الجديدة.

---

## 3. الفوائد النهائية

*   **لا مزيد من إدارة الخوادم:** كل شيء (الواجهة، الخلفية، Camunda) يعمل في بيئة مُدارة بالكامل وقابلة للتوسع تلقائياً.
*   **بيئة تطوير موحدة:** كل فريقك يعمل على Project IDX، مما ينهي مشاكل "it works on my machine".
*   **تكامل مستقبلي:** مشروعك الآن في قلب منظومة Google، ويمكنك بسهولة إضافة خدمات مثل BigQuery للتحليلات، أو Vertex AI لتدريب نماذج مخصصة.

هذه الخطة توفر لك مساراً واضحاً ومفصلاً. قد تبدو طويلة، لكنها عملية منهجية ستنقل مشروعك إلى مستوى جديد من الاحترافية والجاهزية للسوق.
