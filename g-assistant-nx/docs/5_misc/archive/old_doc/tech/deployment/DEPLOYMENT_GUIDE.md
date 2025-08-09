# دليل النشر (Deployment Guide) - مشروع G-Assistant

**الإصدار:** 1.0
**الحالة:** إلزامي

---

## 1.0 نظرة عامة

يوضح هذا المستند الخطوات المعتمدة لنشر التغييرات من بيئة التطوير المحلية إلى مشروع Google Apps Script على السحابة. الأداة الرسمية المستخدمة لهذه العملية هي `clasp`.

---

## 2.0 الإعداد لمرة واحدة (One-Time Setup)

قبل أن تتمكن من النشر، تأكد من إكمال الخطوات التالية مرة واحدة لكل مطور:

1.  **تثبيت `clasp`:**
    ```bash
    npm install -g @google/clasp
    ```

2.  **تسجيل الدخول إلى حساب Google:**
    ```bash
    clasp login
    ```
    سيؤدي هذا إلى فتح نافذة في المتصفح لطلب الإذن بالوصول إلى حساب Google الخاص بك.

3.  **ربط المشروع المحلي بالمشروع السحابي:**
    - تأكد من وجود ملف `.clasp.json` في جذر المشروع.
    - يجب أن يحتوي هذا الملف على `scriptId` الصحيح لمشروع Google Apps Script.
    - إذا لم يكن موجودًا، يمكنك استنساخ المشروع باستخدام:
      ```bash
      clasp clone <scriptId>
      ```

---

## 3.0 عملية النشر القياسية (Standard Deployment Process)

يجب اتباع هذه الخطوات في كل مرة تريد فيها نشر تغييراتك:

1.  **التأكد من أنك على الفرع الصحيح:** تأكد من أنك على فرع `main` أو `develop` وأن لديك أحدث التغييرات.

2.  **سحب أي تغييرات عن بعد:** قبل الدفع، اسحب دائمًا أي تغييرات قد تكون قد تمت مباشرة في محرر Apps Script:
    ```bash
    clasp pull
    ```
    هذا يمنع فقدان أي تغييرات تمت على السحابة.

3.  **دفع التغييرات:** استخدم الأمر التالي لدفع جميع ملفات `.js` و `.html` إلى مشروع Apps Script:
    ```bash
    clasp push
    ```

4.  **إنشاء إصدار جديد (Versioning):** بعد دفع تغييرات مهمة (مثل إصلاح خطأ أو إضافة ميزة)، من الأفضل إنشاء إصدار جديد غير قابل للتغيير من داخل محرر Apps Script:
    - اذهب إلى `Deploy` -> `Manage deployments`.
    - اختر النشر النشط (Active Deployment) وانقر على أيقونة القلم (Edit).
    - من القائمة المنسدلة `Version`، اختر `New version`.
    - أضف وصفًا للإصدار الجديد وانقر على `Deploy`.

---

## 4.0 النشر الآلي عبر GitHub Actions (CI/CD)

لأتمتة عملية النشر عند الدمج في فرع `main`، يمكن استخدام GitHub Actions.

- **ملف الإعداد:** `.github/workflows/deploy.yml`
- **المتطلبات:** يجب تخزين بيانات اعتماد `clasp` (`~/.clasprc.json`) كـ "Secret" في إعدادات مستودع GitHub.

- **مثال على ملف `deploy.yml`:**
  ```yaml
  name: Deploy to Google Apps Script

  on:
    push:
      branches: [ main ]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Setup clasp credentials
        run: echo '${{ secrets.CLASPRC_JSON }}' > ~/.clasprc.json
      - name: Push to Apps Script
        run: clasp push --force
  ```
**ملاحظة:** استخدام `--force` ضروري في بيئة CI لتجاوز التعارضات المحتملة، حيث أن البيئة تبدأ من الصفر في كل مرة.
