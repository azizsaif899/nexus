# 🛠️ إعداد بيئة التطوير

## المتطلبات الأساسية

### البرامج المطلوبة
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** أحدث إصدار

### أدوات Google
```bash
npm install -g @google/clasp
clasp login
```

## خطوات الإعداد

### 1. استنساخ المشروع
```bash
git clone https://github.com/azizsaif899/g-assistant.git
cd g-assistant
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد المتغيرات البيئية
```bash
cp .env.example .env
# أضف مفاتيح API الخاصة بك
```

### 4. المتغيرات المطلوبة
```env
GEMINI_API_KEY=your_gemini_api_key_here
SCRIPT_ID=your_google_apps_script_id
NODE_ENV=development
```

## التحقق من الإعداد

```bash
# اختبار البناء
npm run build

# تشغيل الاختبارات
npm test

# فحص الكود
npm run lint
```

## إعداد VS Code

الإضافات الموصى بها:
- ESLint
- Prettier
- TypeScript
- Google Apps Script