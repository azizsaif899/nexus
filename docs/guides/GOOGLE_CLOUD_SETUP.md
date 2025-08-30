# 🔧 إعداد Google Cloud BigQuery

## 📋 الخطوات:

### 1. إنشاء مشروع Google Cloud
1. اذهب إلى: https://console.cloud.google.com
2. اضغط "Select a project" → "New Project"
3. اكتب اسم المشروع: `azizsys-workflows`
4. اضغط "Create"
5. **انسخ Project ID** (مثل: azizsys-workflows-123456)

### 2. تفعيل BigQuery API
1. في Google Cloud Console
2. اذهب إلى: APIs & Services → Library
3. ابحث عن "BigQuery API"
4. اضغط "Enable"

### 3. إنشاء Service Account
1. اذهب إلى: IAM & Admin → Service Accounts
2. اضغط "Create Service Account"
3. اكتب الاسم: `workflows-service`
4. اضغط "Create and Continue"
5. اختر Role: "BigQuery Admin"
6. اضغط "Continue" → "Done"

### 4. تحميل JSON Key
1. في قائمة Service Accounts
2. اضغط على الـ service account الذي أنشأته
3. اذهب إلى تبويب "Keys"
4. اضغط "Add Key" → "Create new key"
5. اختر "JSON"
6. اضغط "Create"
7. **احفظ الملف** في: `E:\azizsys5\g-assistant-nx\service-account.json`

### 5. تحديث .env
```env
GOOGLE_CLOUD_PROJECT_ID=azizsys-workflows-123456
GOOGLE_APPLICATION_CREDENTIALS=E:\azizsys5\g-assistant-nx\service-account.json
```

## 🎯 اختبار الإعداد:
```bash
cd apps/api
npm run dev
```

## 💡 نصائح:
- **لا تشارك** ملف service-account.json
- أضف `service-account.json` إلى `.gitignore`
- BigQuery **مجاني** حتى 1TB شهرياً

## 🔍 استكشاف الأخطاء:
- تأكد من تفعيل BigQuery API
- تأكد من صحة مسار الملف JSON
- تأكد من صحة Project ID