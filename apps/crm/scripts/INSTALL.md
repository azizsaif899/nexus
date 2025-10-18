# 🚀 دليل التثبيت والتشغيل - CRM Nxs

> **مهم جداً**: مشروع CRM Nxs هو جزء من **Nx Monorepo Workspace**، وليس standalone project.

---

## 📍 بنية المشروع

```
C:\nexus\                          ← Nx Workspace Root (المجلد الرئيسي)
├── package.json                   ← التبعيات الرئيسية
├── node_modules\                  ← جميع التبعيات هنا
├── nx.json                        ← إعدادات Nx
├── apps\
│   └── CRM\                       ← تطبيق CRM Nxs
│       ├── App.tsx
│       ├── components\
│       ├── styles\
│       └── vite.config.ts
└── scripts\                       ← سكريبتات التشغيل
    ├── start-dev.ps1
    └── start-dev.sh
```

---

## ⚠️ أخطاء شائعة وحلولها

### ❌ الخطأ: "Unable to resolve @nx/next:dev"

**السبب**: محاولة تشغيل `npm run dev` من **المجلد الخاطئ**

**الحل الصحيح**: 

```bash
# ❌ خطأ - لا تشغل من مجلد التطبيق
cd C:\nexus\apps\CRM
npm run dev              # ← سيفشل!

# ✅ صحيح - شغّل من workspace root
cd C:\nexus
npm run dev              # ← سيعمل!
```

---

### ❌ الخطأ: "Cannot find module"

**السبب**: التبعيات غير مثبتة أو قديمة

**الحل**:

```bash
# من workspace root
cd C:\nexus
npm install
```

---

## 🎯 طرق التشغيل

### **الطريقة 1: استخدام السكريبتات الجاهزة (الأسهل)**

#### Windows (PowerShell):

```powershell
# 1. تحديث مسار workspace في السكريبت
# افتح: C:\nexus\scripts\start-dev.ps1
# عدّل السطر:
$WORKSPACE_ROOT = "C:\nexus"   # ← ضع المسار الصحيح

# 2. السماح بتنفيذ السكريبتات (مرة واحدة فقط)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. التشغيل
cd C:\nexus
.\scripts\start-dev.ps1
```

#### macOS/Linux:

```bash
# 1. تحديث مسار workspace في السكريبت
# افتح: /path/to/nexus/scripts/start-dev.sh
# عدّل السطر:
WORKSPACE_ROOT="/path/to/nexus"   # ← ضع المسار الصحيح

# 2. منح صلاحيات التنفيذ (مرة واحدة فقط)
chmod +x scripts/start-dev.sh

# 3. التشغيل
cd /path/to/nexus
./scripts/start-dev.sh
```

---

### **الطريقة 2: استخدام Nx مباشرة**

```bash
# من workspace root
cd C:\nexus

# تشغيل التطبيق
nx serve CRM

# أو
npx nx serve CRM
```

---

### **الطريقة 3: استخدام npm scripts**

```bash
# من workspace root
cd C:\nexus

# تشغيل جميع التطبيقات
npm run dev

# أو تشغيل CRM فقط
npm run dev:crm
```

---

## 📦 التثبيت من الصفر

### الخطوة 1: تثبيت التبعيات

```bash
# انتقل إلى workspace root
cd C:\nexus

# تثبيت جميع التبعيات
npm install

# أو إذا كنت تستخدم pnpm
pnpm install

# أو yarn
yarn install
```

### الخطوة 2: التحقق من التثبيت

```bash
# تحقق من Nx
nx --version

# تحقق من Node.js (يُفضل v18 أو أحدث)
node --version

# تحقق من npm
npm --version
```

### الخطوة 3: تشغيل التطبيق

```bash
# باستخدام السكريبت
.\scripts\start-dev.ps1     # Windows
./scripts/start-dev.sh      # macOS/Linux

# أو مباشرة
nx serve CRM
```

---

## 🔧 إعدادات إضافية

### تعيين المنفذ (Port)

```bash
# في ملف: apps/CRM/vite.config.ts
export default defineConfig({
  server: {
    port: 5173,  # ← غيّر المنفذ هنا
  },
});
```

### تعطيل فتح المتصفح تلقائياً

```bash
# في ملف: apps/CRM/vite.config.ts
export default defineConfig({
  server: {
    open: false,  # ← عطّل الفتح التلقائي
  },
});
```

---

## 🛠️ استكشاف الأخطاء

### المشكلة: "Port already in use"

**الحل 1**: استخدام السكريبت (ينظف المنفذ تلقائياً)
```bash
.\scripts\start-dev.ps1
```

**الحل 2**: قتل العملية يدوياً

**Windows**:
```powershell
# ابحث عن العملية
netstat -ano | findstr :5173

# اقتل العملية (استبدل PID برقم العملية)
taskkill /PID <PID> /F
```

**macOS/Linux**:
```bash
# ابحث واقتل
lsof -ti:5173 | xargs kill -9
```

---

### المشكلة: "Module not found"

```bash
# حذف node_modules وإعادة التثبيت
cd C:\nexus
rm -rf node_modules package-lock.json
npm install
```

---

### المشكلة: "Nx cache corrupted"

```bash
# تنظيف Nx cache
cd C:\nexus
nx reset

# ثم إعادة التشغيل
nx serve CRM
```

---

## 🎨 بناء للإنتاج

```bash
# بناء التطبيق
cd C:\nexus
nx build CRM

# النتيجة في:
# dist/apps/CRM/
```

---

## 📊 أوامر مفيدة

```bash
# عرض جميع المشاريع في workspace
nx show projects

# عرض dependency graph
nx graph

# تشغيل الاختبارات
nx test CRM

# Lint
nx lint CRM

# تنظيف الكاش
nx reset
```

---

## 💡 نصائح احترافية

### 1. استخدام Nx Console (VS Code Extension)

```bash
# ثبّت الإضافة من VS Code Marketplace
Nx Console
```

### 2. تشغيل متعدد

```bash
# تشغيل عدة apps في نفس الوقت
nx run-many -t serve --projects=CRM,AnotherApp
```

### 3. Watch Mode

```bash
# إعادة البناء تلقائياً عند التعديل
nx serve CRM --watch
```

---

## 📱 التشغيل على الموبايل

```bash
# 1. احصل على IP address
ipconfig     # Windows
ifconfig     # macOS/Linux

# 2. شغّل التطبيق
nx serve CRM

# 3. افتح في المتصفح على الموبايل
http://192.168.1.x:5173
```

---

## 🔐 متغيرات البيئة (Environment Variables)

```bash
# أنشئ ملف في workspace root
# .env.local

VITE_API_URL=https://api.example.com
VITE_APP_NAME=CRM Nxs
```

---

## 📝 الخلاصة

| الأمر | الاستخدام |
|-------|-----------|
| `npm install` | تثبيت التبعيات |
| `nx serve CRM` | تشغيل التطبيق |
| `nx build CRM` | بناء للإنتاج |
| `nx reset` | تنظيف الكاش |
| `.\scripts\start-dev.ps1` | تشغيل شامل (Windows) |
| `./scripts/start-dev.sh` | تشغيل شامل (macOS/Linux) |

---

## ❓ أسئلة شائعة

**س: هل أحتاج لتثبيت التبعيات في مجلد CRM؟**  
ج: **لا**، جميع التبعيات تُثبّت في `C:\nexus\node_modules`

**س: لماذا لا يعمل `npm run dev` من مجلد CRM؟**  
ج: لأن CRM جزء من Nx workspace، يجب التشغيل من workspace root

**س: هل يمكن تشغيل CRM standalone؟**  
ج: نعم، لكن ستحتاج لإعادة هيكلة المشروع وإخراجه من workspace

---

## 🎉 Happy Coding!

إذا واجهت أي مشاكل، راجع:
- `/scripts/README.md` - دليل السكريبتات
- `/docs/SETUP.md` - دليل الإعداد الكامل
- `/docs/DEVELOPMENT.md` - دليل التطوير

**دعم**: افتح issue في المشروع أو راجع التوثيق.
