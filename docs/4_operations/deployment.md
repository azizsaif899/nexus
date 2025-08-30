# 🚀 دليل النشر

## نشر الشريط الجانبي (Sidebar)

### المتطلبات
- Google Apps Script project
- clasp CLI مثبت ومصادق عليه

### خطوات النشر
```bash
cd monorepo-new/apps/sidebar
npm run build
npm run deploy
```

### التحقق من النشر
1. افتح Google Sheets
2. تحقق من ظهور قائمة "🤖 G-Assistant"
3. اختبر فتح الشريط الجانبي

## نشر واجهة الويب

### Vercel (موصى به)
```bash
cd monorepo-new/apps/web
vercel --prod
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## نشر بوابة الإدارة

### للفريق الداخلي فقط
```bash
cd monorepo-new/apps/admin
npm run build
# نشر على خادم داخلي آمن
```

## المتغيرات البيئية للإنتاج

### للـ Sidebar
```javascript
// في Google Apps Script Properties
GEMINI_API_KEY: "production_key"
ENVIRONMENT: "production"
```

### للـ Web
```env
NEXT_PUBLIC_API_URL=https://api.g-assistant.com
GEMINI_API_KEY=production_key
```

## التحقق من النشر

- [ ] Sidebar يعمل في Google Sheets
- [ ] واجهة الويب متاحة ومتجاوبة
- [ ] API endpoints تستجيب بشكل صحيح
- [ ] المتغيرات البيئية محدثة

## 📋 عملية النشر التفصيلية

### الإعداد لمرة واحدة

1. **تثبيت clasp:**
   ```bash
   npm install -g @google/clasp
   ```

2. **تسجيل الدخول:**
   ```bash
   clasp login
   ```

3. **ربط المشروع:**
   - تأكد من وجود `.clasp.json` مع `scriptId` صحيح
   - أو استنسخ: `clasp clone <scriptId>`

### عملية النشر القياسية

1. **التأكد من الفرع الصحيح** (main/develop)
2. **سحب التغييرات:**
   ```bash
   clasp pull
   ```
3. **دفع التغييرات:**
   ```bash
   clasp push
   ```
4. **إنشاء إصدار جديد:**
   - Deploy → Manage deployments
   - Edit → New version → Deploy

### النشر الآلي (CI/CD)

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

**ملاحظة:** `--force` ضروري في CI لتجاوز التعارضات

## 📋 عملية النشر التفصيلية

### الإعداد لمرة واحدة

1. **تثبيت clasp:**
   ```bash
   npm install -g @google/clasp
   ```

2. **تسجيل الدخول:**
   ```bash
   clasp login
   ```

3. **ربط المشروع:**
   - تأكد من وجود `.clasp.json` مع `scriptId` صحيح
   - أو استنسخ: `clasp clone <scriptId>`

### عملية النشر القياسية

1. **التأكد من الفرع الصحيح** (main/develop)
2. **سحب التغييرات:**
   ```bash
   clasp pull
   ```
3. **دفع التغييرات:**
   ```bash
   clasp push
   ```
4. **إنشاء إصدار جديد:**
   - Deploy → Manage deployments
   - Edit → New version → Deploy

### النشر الآلي (CI/CD)

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

**ملاحظة:** `--force` ضروري في CI لتجاوز التعارضات