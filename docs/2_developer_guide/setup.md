# دليل إعداد بيئة التطوير

## المتطلبات الأساسية

- Node.js 18+ 
- npm أو yarn
- Google Apps Script CLI (clasp)
- حساب Google Cloud Platform

## خطوات الإعداد

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd g-assistant
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد Google Apps Script
```bash
npm install -g @google/clasp
clasp login
```

### 4. تكوين المتغيرات البيئية
```bash
cp .env.example .env
# قم بتعديل .env وإضافة المفاتيح المطلوبة
```

### 5. إعداد إضافة Sheets
```bash
cd apps/sheets-addon
clasp create --type sheets --title "G-Assistant"
clasp push
```

### 6. تشغيل بيئة التطوير
```bash
npm run dev
```

## الاختبار

```bash
# تشغيل جميع الاختبارات
npm run test

# تشغيل اختبارات مع التغطية
npm run test:coverage
```

## النشر

```bash
# بناء المشروع
npm run build

# نشر إضافة Sheets
cd apps/sheets-addon
clasp deploy
```