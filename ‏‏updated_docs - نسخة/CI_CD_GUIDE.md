# دليل إعداد بيئة التطوير والنشر المستمر (CI/CD)

هذا الدليل يشرح كيفية إعداد بيئة تطوير محلية لمشروع G-Assistant باستخدام `clasp` وكيفية بناء خط أنابيب بسيط للنشر المستمر باستخدام GitHub Actions.

---

## 1. إعداد بيئة التطوير المحلية (clasp)

`clasp` (Command Line Apps Script Projects) هي أداة من Google تسمح لك بتطوير مشاريع Apps Script على جهازك المحلي باستخدام محرر الكود المفضل لديك (مثل VS Code).

### المتطلبات
- Node.js and npm
- حساب Google

### خطوات الإعداد

1.  **تثبيت `clasp` عالميًا:**
    ```bash
    npm install -g @google/clasp
    ```

2.  **تسجيل الدخول إلى حساب Google:**
    سيفتح هذا الأمر نافذة في المتصفح لتسجيل الدخول ومنح `clasp` الصلاحيات اللازمة.
    ```bash
    clasp login
    ```

3.  **تفعيل Apps Script API:**
    - اذهب إلى إعدادات مشروع Apps Script.
    - تأكد من تفعيل "Google Apps Script API".

4.  **استنساخ المشروع (Clone):**
    إذا كان المشروع موجودًا بالفعل على Apps Script، يمكنك استنساخه باستخدام معرف السكربت (Script ID).
    - افتح مشروعك على `script.google.com`.
    - اذهب إلى "إعدادات المشروع" (Project Settings).
    - انسخ "معرف السكربت" (Script ID).
    - في مجلد جديد على جهازك، نفذ الأمر:
    ```bash
    clasp clone "YOUR_SCRIPT_ID"
    ```
    سيقوم هذا الأمر بإنشاء ملف `.clasp.json` وسحب جميع ملفات `.js` و `.html` من المشروع السحابي.

5.  **العمل على المشروع:**
    - **سحب التغييرات:** `clasp pull`
    - **دفع التغييرات:** `clasp push`

---

## 2. بناء خط أنابيب النشر (CI/CD) مع GitHub Actions

يمكننا أتمتة عملية نشر التحديثات إلى Apps Script عند دمج التغييرات في الفرع الرئيسي (`main` أو `master`) في مستودع GitHub.

### الخطوة 1: تخزين بيانات المصادقة كـ Secrets

للسماح لـ GitHub Actions بالمصادقة مع Google، نحتاج إلى تخزين ملفات المصادقة بشكل آمن.

1.  نفذ `clasp login` مرة أخرى.
2.  ابحث عن ملف `~/.clasprc.json` في مجلد المستخدم الخاص بك. هذا الملف يحتوي على `access_token`, `refresh_token`, `client_id`, و `client_secret`.
3.  في مستودع GitHub، اذهب إلى `Settings` > `Secrets and variables` > `Actions`.
4.  أنشئ Secrets جديدة بالأسماء التالية وأضف القيم المقابلة من ملف `.clasprc.json`:
    - `CLASPRC_ACCESS_TOKEN`
    - `CLASPRC_REFRESH_TOKEN`
    - `CLASPRC_CLIENT_ID`
    - `CLASPRC_CLIENT_SECRET`
5.  أنشئ Secret آخر باسم `SCRIPT_ID` وضع فيه معرف السكربت الخاص بمشروعك.

### الخطوة 2: إنشاء ملف سير العمل (Workflow)

أنشئ مجلد `.github/workflows` في مشروعك، وبداخله ملف `deploy.yml`:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Google Apps Script

on:
  push:
    branches:
      - main # أو الفرع الرئيسي الذي تستخدمه

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install clasp
        run: npm install -g @google/clasp

      - name: Create .clasprc.json
        run: |
          echo '{
            "token": {
              "access_token": "${{ secrets.CLASPRC_ACCESS_TOKEN }}",
              "refresh_token": "${{ secrets.CLASPRC_REFRESH_TOKEN }}",
              "scope": "https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/script.deployments https://www.googleapis.com/auth/script.webapp.deploy https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/service.management",
              "token_type": "Bearer",
              "expiry_date": 0
            },
            "oauth2ClientSettings": {
              "clientId": "${{ secrets.CLASPRC_CLIENT_ID }}",
              "clientSecret": "${{ secrets.CLASPRC_CLIENT_SECRET }}",
              "redirectUri": "http://localhost"
            }
          }' > ~/.clasprc.json

      - name: Create .clasp.json
        run: echo '{"scriptId":"${{ secrets.SCRIPT_ID }}"}' > .clasp.json

      - name: Push files to Apps Script
        run: clasp push -f
```

الآن، في كل مرة يتم فيها دمج تغييرات جديدة في الفرع `main`، سيقوم GitHub Actions تلقائيًا بدفع الكود المحدث إلى مشروعك على Google Apps Script.