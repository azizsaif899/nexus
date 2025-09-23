# 🔒 دليل الإعداد الآمن - AzizSys AI Assistant

## 🚨 إعداد متغيرات البيئة

### 1. إنشاء ملف .env
```bash
cp .env.example .env
```

### 2. تعبئة المتغيرات المطلوبة:

#### Firebase Configuration:
```env
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

#### Google Service Account:
```env
GOOGLE_SERVICE_ACCOUNT_PATH=./config/service-account.json
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

#### Gemini AI:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### WhatsApp Business API:
```env
WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
```

#### Database:
```env
DATABASE_URL=your_database_url_here
```

#### Security:
```env
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
```

## 🔑 إعداد Google Service Account

### 1. إنشاء Service Account:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى IAM & Admin > Service Accounts
4. انقر "Create Service Account"
5. أعط اسم للحساب ووصف
6. اختر الأدوار المطلوبة:
   - Firebase Admin SDK Administrator Service Agent
   - BigQuery Admin
   - Cloud Functions Admin

### 2. تحميل المفتاح:
1. انقر على Service Account المُنشأ
2. اذهب إلى Keys tab
3. انقر "Add Key" > "Create new key"
4. اختر JSON format
5. احفظ الملف كـ `config/service-account.json`

## 🔥 إعداد Firebase

### 1. إنشاء مشروع Firebase:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. انقر "Add project"
3. اتبع خطوات الإعداد

### 2. تفعيل الخدمات المطلوبة:
- Authentication
- Firestore Database
- Cloud Functions
- Firebase Data Connect

### 3. الحصول على Configuration:
1. اذهب إلى Project Settings
2. انسخ Firebase configuration
3. أضف القيم إلى ملف .env

## 🤖 إعداد Gemini AI

### 1. الحصول على API Key:
1. اذهب إلى [Google AI Studio](https://makersuite.google.com/app/apikey)
2. انقر "Create API Key"
3. انسخ المفتاح وأضفه إلى .env

## 📱 إعداد WhatsApp Business API

### 1. إنشاء Facebook App:
1. اذهب إلى [Facebook Developers](https://developers.facebook.com)
2. أنشئ تطبيق جديد
3. أضف WhatsApp Business API

### 2. الحصول على Tokens:
1. انسخ Access Token
2. أنشئ Verify Token (أي نص عشوائي)
3. أضف القيم إلى .env

## ⚠️ تحذيرات الأمان

### ❌ لا تفعل:
- لا تضع المفاتيح في الكود مباشرة
- لا ترفع ملف .env إلى Git
- لا تشارك المفاتيح في المحادثات أو الرسائل

### ✅ افعل:
- استخدم متغيرات البيئة دائماً
- احتفظ بنسخ احتياطية آمنة من المفاتيح
- غير المفاتيح بانتظام
- استخدم أدوار محدودة للـ Service Accounts

## 🔍 فحص الإعداد

```bash
# فحص متغيرات البيئة
npm run check:env

# اختبار الاتصال بـ Firebase
npm run test:firebase

# اختبار Gemini AI
npm run test:gemini

# اختبار WhatsApp
npm run test:whatsapp
```

## 🆘 استكشاف الأخطاء

### مشكلة: Firebase connection failed
- تأكد من صحة FIREBASE_PROJECT_ID
- تأكد من تفعيل الخدمات المطلوبة

### مشكلة: Gemini API error
- تأكد من صحة GEMINI_API_KEY
- تأكد من تفعيل Gemini API في Google Cloud

### مشكلة: Service Account error
- تأكد من وجود ملف service-account.json
- تأكد من صحة الأدوار المعطاة للحساب

---

**⚠️ هذا الملف يحتوي على معلومات حساسة. لا تشاركه مع أحد.**