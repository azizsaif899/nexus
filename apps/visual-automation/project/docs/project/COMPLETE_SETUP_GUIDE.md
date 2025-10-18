# 🚀 دليل الإعداد والتشغيل الكامل
## Complete Setup & Deployment Guide

> **آخر تحديث**: 2025-10-16  
> **الإصدار**: 1.0.0

---

## 📑 جدول المحتويات

1. [المتطلبات الأساسية](#1-المتطلبات-الأساسية)
2. [التثبيت والإعداد](#2-التثبيت-والإعداد)
3. [تشغيل المشروع](#3-تشغيل-المشروع)
4. [تكامل ActivePieces](#4-تكامل-activepieces)
5. [البناء للإنتاج](#5-البناء-للإنتاج)
6. [النشر](#6-النشر)
7. [استكشاف الأخطاء](#7-استكشاف-الأخطاء)
8. [قائمة التحقق النهائية](#8-قائمة-التحقق-النهائية)

---

## 1. المتطلبات الأساسية

### 1.1 البرمجيات المطلوبة

```bash
# التحقق من الإصدارات
node --version   # يجب أن يكون >= 18.0.0
npm --version    # يجب أن يكون >= 9.0.0
git --version    # أي إصدار حديث
```

### 1.2 الأدوات الموصى بها

- **محرر الأكواد**: VS Code أو WebStorm
- **المتصفح**: Chrome أو Firefox (أحدث إصدار)
- **Terminal**: Bash, Zsh, أو PowerShell

### 1.3 المعرفة المطلوبة

- ✅ React أساسي
- ✅ TypeScript أساسي
- ✅ Terminal/Command Line
- ⚡ معرفة بـ Vite (اختياري)

---

## 2. التثبيت والإعداد

### 2.1 استنساخ المشروع

```bash
# إذا كان المشروع على Git
git clone <repository-url>
cd visual-workflow-automation

# أو فك ضغط الملف المضغوط
unzip visual-workflow-automation.zip
cd visual-workflow-automation
```

### 2.2 تثبيت المكتبات

```bash
# تنظيف التبعيات القديمة (إذا وُجدت)
rm -rf node_modules package-lock.json

# تثبيت جميع المكتبات
npm install

# أو باستخدام yarn
yarn install
```

### 2.3 إعداد ملف البيئة

```bash
# لا يوجد ملف .env مطلوب للوضع Demo!
# المشروع يعمل مباشرة بدون أي تكوين

# (اختياري) للوضع Production مع ActivePieces:
# انسخ الملف المثال
cp .env.example .env.local

# عدّل .env.local
nano .env.local  # أو أي محرر نصوص
```

**محتوى `.env.local` (اختياري):**

```env
# ActivePieces API Configuration
VITE_ACTIVEPIECES_API_URL=http://localhost:8080/api/v1
VITE_ACTIVEPIECES_API_KEY=ap_your_api_key_here

# Environment
VITE_NODE_ENV=development

# API Keys (إذا كنت تستخدم خدمات خارجية)
# VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

---

## 3. تشغيل المشروع

### 3.1 وضع التطوير (Development)

```bash
# تشغيل خادم التطوير
npm run dev

# سيفتح على: http://localhost:4100
```

**يجب أن ترى:**
```
VITE v6.0.5  ready in 234 ms

➜  Local:   http://localhost:4100/
➜  Network: http://192.168.1.100:4100/
➜  press h + enter to show help
```

### 3.2 التحقق من التشغيل

افتح المتصفح على `http://localhost:4100`

**يجب أن ترى:**
- ✅ واجهة الكانفا مع الشبكة
- ✅ سايد بار العقد على اليسار
- ✅ شريط الأدوات في الأعلى
- ✅ سايد بار الذكاء الاصطناعي على اليمين
- ✅ لا توجد أخطاء في Console

### 3.3 الأوامر المتاحة

```bash
# التطوير
npm run dev          # تشغيل خادم التطوير

# البناء
npm run build        # بناء للإنتاج
npm run preview      # معاينة البناء

# الاختبار والتحليل
npm run lint         # فحص الأكواد (إذا كان مُعرَّف)
npm run type-check   # التحقق من الأنواع (إذا كان مُعرَّف)
```

---

## 4. تكامل ActivePieces

### 4.1 الوضعان المتاحان

#### أ) Demo Mode (الافتراضي - لا يحتاج إعداد)

```bash
# يعمل مباشرة!
npm run dev
```

**الميزات:**
- ✅ محاكاة كاملة محلية
- ✅ جميع أنواع العقد تعمل
- ✅ لا يحتاج API key
- ✅ رائع للتجربة والتطوير

**القيود:**
- ⚠️ لا يُنفذ workflows حقيقية
- ⚠️ البيانات لا تُحفظ عند إعادة التحميل

#### ب) Production Mode (مع ActivePieces حقيقي)

```bash
# 1. أضف API Key إلى .env.local
VITE_ACTIVEPIECES_API_URL=http://localhost:8080/api/v1
VITE_ACTIVEPIECES_API_KEY=ap_xxxxxxxxxxxx

# 2. شغّل المشروع
npm run dev
```

**الميزات:**
- ✅ تنفيذ workflows حقيقية
- ✅ حفظ البيانات في قاعدة البيانات
- ✅ مراقبة الأداء الحقيقي
- ✅ جاهز للإنتاج

### 4.2 إعداد ActivePieces Self-Hosted

#### الخطوة 1: تثبيت Docker

```bash
# تحقق من تثبيت Docker
docker --version
docker-compose --version

# إذا لم يكن مُثبتاً، ثبته من:
# https://docs.docker.com/get-docker/
```

#### الخطوة 2: تحميل ActivePieces

```bash
# استنسخ المشروع
git clone https://github.com/activepieces/activepieces.git
cd activepieces

# شغّل بـ Docker Compose
docker-compose up -d

# انتظر حتى يكتمل التشغيل (1-2 دقيقة)
```

#### الخطوة 3: الوصول إلى ActivePieces

```bash
# افتح المتصفح على:
http://localhost:8080
```

#### الخطوة 4: إنشاء API Key

1. سجل حساب جديد في `http://localhost:8080/sign-up`
2. اذهب إلى: **Settings** → **API Keys**
3. انقر على **Create New API Key**
4. انسخ المفتاح (يبدأ بـ `ap_...`)
5. أضفه إلى `.env.local`

#### الخطوة 5: اختبار الاتصال

```bash
# في مجلد المشروع
npm run dev

# يجب أن ترى في Console:
# ✅ ActivePieces connected successfully!
```

---

## 5. البناء للإنتاج

### 5.1 بناء المشروع

```bash
# بناء للإنتاج
npm run build

# يجب أن ترى:
# vite v6.0.5 building for production...
# ✓ 127 modules transformed.
# dist/index.html                  0.45 kB
# dist/assets/index-[hash].css    45.23 kB
# dist/assets/index-[hash].js    523.45 kB
# 
# ✓ built in 5.23s
```

### 5.2 معاينة البناء

```bash
# معاينة البناء المحلي
npm run preview

# يفتح على: http://localhost:4173
```

### 5.3 التحقق من جودة البناء

```bash
# فحص حجم الملفات
ls -lh dist/assets/

# يجب أن يكون:
# - CSS: ~30-50 KB (gzipped)
# - JS: ~200-300 KB (gzipped)
```

### 5.4 تحسينات الإنتاج

**ملف `vite.config.ts` مُحسّن مسبقاً:**

```typescript
build: {
  minify: 'terser',           // تصغير الكود
  sourcemap: false,           // بدون sourcemaps في الإنتاج
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        ui: ['lucide-react', 'motion/react']
      }
    }
  }
}
```

---

## 6. النشر

### 6.1 النشر على Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# للإنتاج
vercel --prod
```

**أو باستخدام واجهة Vercel:**

1. اذهب إلى https://vercel.com
2. انقر على **New Project**
3. استورد المشروع من Git
4. اترك الإعدادات الافتراضية
5. انقر على **Deploy**

### 6.2 النشر على Netlify

```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# تسجيل الدخول
netlify login

# نشر
netlify deploy

# للإنتاج
netlify deploy --prod
```

### 6.3 النشر على VPS (Ubuntu)

```bash
# على السيرفر
# 1. ثبت Node.js و Nginx
sudo apt update
sudo apt install nodejs npm nginx

# 2. استنسخ المشروع
git clone <your-repo-url>
cd visual-workflow-automation

# 3. ثبت المكتبات وابنِ
npm install
npm run build

# 4. اعمل Nginx config
sudo nano /etc/nginx/sites-available/workflow

# أضف:
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/visual-workflow-automation/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 5. فعّل الموقع
sudo ln -s /etc/nginx/sites-available/workflow /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### 6.4 النشر مع Docker

```bash
# إنشاء Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]

# بناء الصورة
docker build -t workflow-automation .

# تشغيل
docker run -p 4173:4173 workflow-automation
```

---

## 7. استكشاف الأخطاء

### 7.1 المشاكل الشائعة

#### ❌ خطأ: "Cannot find module"

```bash
# الحل:
rm -rf node_modules package-lock.json
npm install
```

#### ❌ خطأ: "Port 4100 is already in use"

```bash
# الحل 1: إيقاف العملية القديمة
# Linux/Mac:
lsof -ti:4100 | xargs kill -9

# Windows:
netstat -ano | findstr :4100
taskkill /PID <PID> /F

# الحل 2: تغيير المنفذ
# في vite.config.ts:
server: {
  port: 3000  // أي منفذ آخر
}
```

#### ❌ خطأ: "ActivePieces connection failed"

```bash
# الحل:
# 1. تحقق من أن ActivePieces يعمل:
curl http://localhost:8080/api/v1/health

# 2. تحقق من .env.local:
cat .env.local

# 3. تحقق من API Key صحيح
```

#### ❌ خطأ: الواجهة لا تظهر بشكل صحيح

```bash
# الحل:
# 1. احذف الكاش:
rm -rf .vite node_modules/.vite

# 2. أعد التثبيت:
npm install

# 3. شغّل من جديد:
npm run dev
```

### 7.2 أدوات التشخيص

```bash
# فحص الأخطاء في Console
# افتح Developer Tools (F12) → Console

# فحص الأداء
# افتح Developer Tools (F12) → Performance

# فحص الشبكة
# افتح Developer Tools (F12) → Network
```

---

## 8. قائمة التحقق النهائية

### ✅ قبل التسليم

#### الوظائف الأساسية
- [ ] جميع أنواع العقد (13 نوع) تعمل
- [ ] السحب والإفلات يعمل
- [ ] الاتصالات بين العقد تعمل
- [ ] Zoom و Pan يعملان
- [ ] حفظ وتحميل Workflows يعمل
- [ ] Export (JSON, PNG) يعمل

#### الواجهة والتصميم
- [ ] الوضع الداكن/الفاتح يعمل
- [ ] RTL (العربية) تعمل بشكل صحيح
- [ ] جميع الأزرار والأيقونات واضحة
- [ ] لا توجد أخطاء في Console
- [ ] الواجهة متجاوبة (Mobile/Tablet/Desktop)

#### الأداء
- [ ] الصفحة تحمل في أقل من 3 ثوانٍ
- [ ] لا توجد تأخيرات واضحة
- [ ] الأنيميشن سلس (60 FPS)
- [ ] الذاكرة مستقرة (لا تزداد مع الوقت)

#### التوثيق
- [ ] README.md محدث
- [ ] جميع الأدلة في `/docs` موجودة
- [ ] Guidelines.md محدث
- [ ] تعليقات الكود واضحة

#### الأمان
- [ ] لا توجد API keys في الكود
- [ ] .env.local في .gitignore
- [ ] جميع المدخلات مُنظفة (sanitized)
- [ ] HTTPS في الإنتاج

#### التكامل مع ActivePieces
- [ ] Demo Mode يعمل بدون إعداد
- [ ] Production Mode يعمل مع API Key
- [ ] الاتصال بـ ActivePieces مستقر
- [ ] Workflows تُنفذ بنجاح

---

## 🎉 تهانينا!

المشروع الآن جاهز 100% للتسليم والتشغيل! 🚀

### 📚 الخطوات التالية

1. **اقرأ التوثيق الكامل** في `/docs`
2. **جرّب جميع الميزات** للتأكد من عملها
3. **اعمل نسخة احتياطية** قبل النشر
4. **انشر على Vercel** أو أي منصة أخرى
5. **شارك المشروع** مع الفريق! 🎊

---

## 📞 الدعم والمساعدة

### 📖 التوثيق الكامل
- [📑 الفهرس السريع](../INDEX.md)
- [📚 فهرس التوثيق الكامل](../README_DOCUMENTATION.md)
- [🔌 دليل ActivePieces](../ACTIVEPIECES_INTEGRATION.md)
- [📋 إرشادات المشروع](../../guidelines/Guidelines.md)

### 🐛 الإبلاغ عن الأخطاء
- افتح Issue في GitHub
- راسلنا على البريد الإلكتروني
- راجع [استكشاف الأخطاء](#7-استكشاف-الأخطاء)

---

**✨ نتمنى لك تجربة رائعة!**
