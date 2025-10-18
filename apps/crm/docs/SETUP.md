# 🚀 دليل الإعداد - Setup Guide

> **المشروع:** CRM Nxs  
> **الإصدار:** 1.0.0  
> **التاريخ:** 2025-10-16

---

## 📋 **المتطلبات - Requirements**

### **البرامج الأساسية**
```bash
✅ Node.js >= 18.0.0
✅ npm >= 9.0.0 (أو yarn/pnpm)
✅ Git >= 2.0.0
```

### **التحقق من الإصدارات**
```bash
node --version  # يجب أن يكون >= 18
npm --version   # يجب أن يكون >= 9
git --version   # يجب أن يكون >= 2
```

### **المتصفحات المدعومة**
```
✅ Chrome/Edge >= 90
✅ Firefox >= 88
✅ Safari >= 14
✅ iOS Safari >= 14
```

---

## 📦 **التثبيت - Installation**

### **1. استنساخ المشروع**
```bash
# HTTPS
git clone https://github.com/your-org/crm-nxs.git

# SSH
git clone git@github.com:your-org/crm-nxs.git

# دخول المجلد
cd crm-nxs
```

### **2. تثبيت التبعيات**
```bash
# باستخدام npm
npm install

# أو باستخدام yarn
yarn install

# أو باستخدام pnpm
pnpm install
```

**الوقت المتوقع:** 2-5 دقائق

### **3. التحقق من التثبيت**
```bash
# التحقق من package.json
npm list --depth=0

# يجب أن ترى:
# ├── react@19.1.1
# ├── vite@6.0.5
# ├── tailwindcss@4.1.14
# ├── typescript@5.9.2
# └── ...
```

---

## ⚙️ **التكوين - Configuration**

### **1. متغيرات البيئة**
قم بإنشاء ملف `.env.local`:

```bash
# نسخ القالب
cp .env.example .env.local

# تحرير الملف
nano .env.local
```

**محتوى `.env.local`:**
```env
# App Configuration
VITE_APP_NAME=CRM Nxs
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# API Configuration (اختياري)
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Features Flags
VITE_ENABLE_AI_CHAT=false
VITE_ENABLE_ANALYTICS=false

# Odoo Integration (اختياري)
VITE_ODOO_URL=
VITE_ODOO_DB=
VITE_ODOO_USERNAME=
VITE_ODOO_PASSWORD=
```

### **2. Tailwind CSS**
الملف `tailwind.config.js` موجود بالفعل:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        // ... المزيد
      }
    }
  }
}
```

**لا تحتاج تعديل!** ✅

### **3. PostCSS**
الملف `postcss.config.js` موجود:

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
```

**لا تحتاج تعديل!** ✅

### **4. TypeScript**
الملف `tsconfig.json` مُكوّن مسبقاً:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "strict": true,
    "jsx": "react-jsx",
    // ...
  }
}
```

**لا تحتاج تعديل!** ✅

---

## 🏃 **التشغيل - Running**

### **1. وضع التطوير**
```bash
# تشغيل خادم التطوير
npm run dev

# أو مع port محدد
PORT=3005 npm run dev
```

**الوصول:**
```
🌐 Local:   http://localhost:5173
🌐 Network: http://192.168.x.x:5173
```

**الميزات:**
- ✅ Hot Module Replacement (HMR)
- ✅ Fast Refresh
- ✅ Source Maps
- ✅ TypeScript Check

### **2. البناء للإنتاج**
```bash
# بناء التطبيق
npm run build

# النتيجة في /dist
ls -la dist/

# يجب أن ترى:
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css
# └── ...
```

### **3. معاينة البناء**
```bash
# معاينة البناء محلياً
npm run preview

# الوصول:
# http://localhost:4173
```

### **4. فحص TypeScript**
```bash
# فحص الأخطاء
npm run type-check

# أو
tsc --noEmit
```

### **5. فحص Lint**
```bash
# فحص الكود (إذا كان مُكوّن)
npm run lint

# إصلاح تلقائي
npm run lint:fix
```

---

## 🎨 **إعداد المحرر - Editor Setup**

### **VS Code (موصى به)**

#### **الإضافات المطلوبة:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Orta.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "styled-components.vscode-styled-components"
  ]
}
```

#### **الإعدادات (`.vscode/settings.json`):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### **WebStorm/IntelliJ IDEA**
1. فعّل TypeScript Service
2. فعّل Tailwind CSS IntelliSense
3. فعّل Prettier

---

## 🔧 **استكشاف الأخطاء - Troubleshooting**

### **مشكلة: `npm install` يفشل**
```bash
# حذف node_modules و lock file
rm -rf node_modules package-lock.json

# مسح cache
npm cache clean --force

# إعادة التثبيت
npm install
```

### **مشكلة: Port مُستخدم**
```bash
# تغيير Port
PORT=3006 npm run dev

# أو قتل العملية على Port 5173
lsof -ti:5173 | xargs kill -9
```

### **مشكلة: Tailwind Classes لا تعمل**
```bash
# التحقق من postcss.config.js
cat postcss.config.js

# التحقق من globals.css
cat styles/globals.css

# إعادة تشغيل خادم التطوير
npm run dev
```

### **مشكلة: TypeScript Errors**
```bash
# حذف cache
rm -rf node_modules/.vite

# إعادة التشغيل
npm run dev
```

### **مشكلة: الخطوط لا تظهر**
```bash
# التحقق من index.html
cat index.html | grep "IBM Plex"

# يجب أن ترى:
# <link href="..." rel="stylesheet">

# أو راجع styles/globals.css
cat styles/globals.css | grep "font-family"
```

---

## 🌐 **النشر - Deployment**

### **Vercel (موصى به)**
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# الإنتاج
vercel --prod
```

### **Netlify**
```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# النشر
netlify deploy

# الإنتاج
netlify deploy --prod
```

### **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
# بناء الصورة
docker build -t crm-nxs .

# تشغيل الحاوية
docker run -p 3000:3000 crm-nxs
```

راجع [`DEPLOYMENT.md`](./DEPLOYMENT.md) للتفاصيل الكاملة.

---

## 📚 **الخطوات التالية**

### **1. فهم البنية**
```bash
# استعرض المشروع
tree -L 2 -I 'node_modules'
```

### **2. قراءة التوثيق**
- [`GUIDELINES.md`](./GUIDELINES.md) - القواعد والمعايير
- [`DEVELOPMENT.md`](./DEVELOPMENT.md) - دليل التطوير
- [`STYLING.md`](./STYLING.md) - نظام التصميم

### **3. بدء التطوير**
```bash
# افتح المشروع في VS Code
code .

# شغّل التطوير
npm run dev

# افتح المتصفح
open http://localhost:5173
```

---

## ✅ **Checklist - قائمة التحقق**

قبل البدء، تأكد من:

- [ ] ✅ Node.js >= 18 مُثبّت
- [ ] ✅ npm >= 9 مُثبّت
- [ ] ✅ `npm install` نجح
- [ ] ✅ `.env.local` موجود (اختياري)
- [ ] ✅ `npm run dev` يعمل
- [ ] ✅ التطبيق يظهر في المتصفح
- [ ] ✅ الخطوط تعمل (IBM Plex Sans Arabic)
- [ ] ✅ Dark/Light Mode يعمل
- [ ] ✅ جميع الصفحات تعمل (Dashboard, Leads, Pipeline, Tasks, Reports)

---

## 🎯 **ملاحظات مهمة**

### **1. لا تضف `@tailwind` في globals.css**
```css
/* ❌ لا تفعل */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**السبب:** Tailwind v4 يعمل عبر PostCSS مباشرة.

### **2. استخدم `/docs/GUIDELINES.md`**
```
✅ /docs/GUIDELINES.md  <- الصحيح
❌ /guidelines/Guidelines.md  <- محمي (قديم)
```

### **3. Typography Classes**
```typescript
// ❌ لا تستخدم
<h1 className="text-3xl font-bold">عنوان</h1>

// ✅ استخدم
<h1>عنوان</h1>  // من globals.css
```

---

## 📞 **الدعم**

### **المشاكل الشائعة**
راجع قسم [استكشاف الأخطاء](#-استكشاف-الأخطاء---troubleshooting)

### **الأسئلة**
- 📧 **البريد:** support@crm-nxs.com
- 🐛 **البلاغات:** GitHub Issues
- 📖 **التوثيق:** `/docs`

---

## 🎉 **مبروك!**

الآن أنت جاهز لبدء التطوير! 🚀

**الخطوة التالية:** [`DEVELOPMENT.md`](./DEVELOPMENT.md)

---

**تم بواسطة:** فريق CRM Nxs  
**التاريخ:** 2025-10-16
