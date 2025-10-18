# 🎯 CRM Nxs - نظام إدارة علاقات العملاء

> **نظام CRM احترافي متكامل مبني بأحدث التقنيات**

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.1.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-✅_Production_Ready-green)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ⚠️ مهم: هذا التطبيق جزء من Nx Monorepo

<div align="center">

**الموقع:** `nexus/apps/CRM/`

**📚 [التوثيق الكامل](docs/README.md)** ← **ابدأ هنا**

</div>

---

## ✨ **الميزات الرئيسية**

```
✅ Dashboard احترافي مع مخططات Recharts
✅ إدارة شاملة للعملاء (Leads Management)
✅ Pipeline Board تفاعلي (React DnD)
✅ نظام مهام متقدم (Tasks Management)
✅ تقارير قابلة للتصدير (PDF/Excel)
✅ Dark/Light Mode مع Gray Scale Design
✅ دعم كامل للعربية (RTL)
✅ تصميم احترافي مع Shadcn/ui
```

---

## 🚀 **البداية السريعة**

### **المتطلبات:**
- Node.js >= 18.0.0
- npm >= 9.0.0
- Nx CLI (موصى به): `npm install -g nx`

### **إعداد في Nx Workspace (موصى بها) ⭐**

```bash
# من مجلد Workspace الرئيسي
cd nexus

# تثبيت التبعيات
npm install

# تشغيل التطبيق
nx serve CRM

# أو
npm run CRM:dev
```

**النتيجة:** يفتح التطبيق على http://localhost:5173 ✨

### **تشغيل Standalone (بدون Nx):**

```bash
# من مجلد التطبيق
cd apps/CRM

# Windows
.\scripts\setup.ps1
.\scripts\start-dev.ps1

# macOS/Linux
chmod +x scripts/*.sh
./scripts/setup.sh
./scripts/start-dev.sh
```

<details>
<summary>الطريقة التقليدية (npm)</summary>

```bash
npm install
npm run dev
```
</details>

<details>
<summary>من الصفر (Git Clone)</summary>

```bash
git clone https://github.com/your-org/nexus.git
cd nexus
npm install
nx serve CRM
```
</details>

### **الوصول:**
```
🌐 http://localhost:5173
```

---

## 📁 **هيكل المشروع**

```
/CRM (في Nx Workspace)
├── /components          # مكونات React
│   ├── /crm            # مكونات CRM
│   │   ├── /dashboard  # لوحة التحكم
│   │   ├── /leads      # إدارة العملاء
│   │   ├── /pipeline   # لوحة المبيعات
│   │   ├── /tasks      # إدارة المهام
│   │   └── /reports    # التقارير
│   └── /ui             # مكونات Shadcn/ui
├── /lib                # أدوات ومساعدات
├── /services           # خدمات API
├── /styles             # ملفات CSS
├── /docs               # 📚 التوثيق الكامل ⭐
├── /scripts            # 28 سكريبت تلقائي
├── /test               # الاختبارات
├── project.json        # Nx project config
├── Dockerfile          # Docker للنشر
├── nginx.conf          # Nginx config
└── cloudbuild.yaml     # Cloud Build CI/CD
```

---

## 📚 **التوثيق الكامل**

<div align="center">

### **[📚 مجلد التوثيق الكامل](docs/README.md)**

**جميع المستندات في مكان واحد منظم!**

</div>

### **أهم الأدلة:**

| النوع | الملف | الوصف |
|------|------|-------|
| 🔧 **تطوير تطبيقات** | [`docs/NEW_APP_DEVELOPMENT_GUIDE.md`](docs/NEW_APP_DEVELOPMENT_GUIDE.md) | **دليل شامل** ⭐ |
| 📋 **الإرشادات** | [`docs/GUIDELINES.md`](docs/GUIDELINES.md) | القواعد والمعايير |
| 💻 **التطوير** | [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | دليل التطوير |
| 🎨 **التصميم** | [`docs/STYLING.md`](docs/STYLING.md) | نظام التصميم |
| 🧩 **المكونات** | [`docs/COMPONENTS.md`](docs/COMPONENTS.md) | استخدام المكونات |
| 📦 **النشر** | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Docker & Cloud |
| 🧪 **الاختبارات** | [`docs/TESTING.md`](docs/TESTING.md) | Testing Guide |

---

## 🛠️ **التقنيات المستخدمة**

### **Frontend:**
- **React 19.1.1** - مكتبة UI
- **TypeScript 5.9** - Type Safety
- **Vite 6.0.5** - Build Tool
- **Tailwind CSS 4.1.14** - Styling
- **Shadcn/ui** - Component Library

### **State Management:**
- **React Query** - Server State
- **React Hook Form** - Form Management

### **UI Components:**
- **Lucide React** - Icons
- **Recharts** - Charts
- **React DnD** - Drag & Drop
- **Motion** - Animations

### **DevOps:**
- **Nx Workspace** - Monorepo
- **Docker** - Containerization
- **Google Cloud Run** - Deployment
- **GitHub Actions** - CI/CD

---

## 🎨 **نظام التصميم**

### **الألوان:**
- **Light Mode:** Gray Scale Professional
- **Dark Mode:** Sophisticated Gray Scale
- **WCAG AA Compliant** - Accessible

### **Typography:**
- **عربي:** IBM Plex Sans Arabic
- **إنجليزي:** Inter
- **Fixed Sizes:** 14px, 16px, 18px, 20px, 24px

### **الأوزان المستخدمة:**
```
300 - Light (نصوص خفيفة)
400 - Normal (النص العادي)
500 - Medium (أزرار، labels)
600 - Semibold (عناوين h1-h6)
700 - Bold (تأكيد قوي)
```

### **⚠️ القاعدة الذهبية:**
**لا تستخدم typography classes (text-*, font-*, leading-*) مطلقاً!**
استخدم عناصر HTML مباشرة: `<h1>`, `<p>`, `<small>`, `<label>`, `<button>`

---

## 🔧 **الأوامر المتاحة**

### **Nx Commands:**

```bash
# Development
nx serve CRM                        # تشغيل dev server
nx build CRM --configuration=production  # بناء للإنتاج
nx run CRM:preview                  # معاينة البناء

# Testing
nx run CRM:type-check               # فحص TypeScript
nx run CRM:lint                     # ESLint
nx run CRM:test                     # جميع الاختبارات

# Docker
nx run CRM:docker-build             # بناء Docker image
nx run CRM:docker-run               # تشغيل container

# Cloud
nx run CRM:cloud-build              # بناء على Cloud Build
nx run CRM:cloud-deploy             # نشر على Cloud Run
```

### **npm Scripts:**

```bash
npm run dev              # تشغيل dev server
npm run build            # بناء للإنتاج
npm run preview          # معاينة البناء
npm run lint             # فحص ESLint
npm run type-check       # فحص TypeScript
npm run test             # تشغيل الاختبارات
```

---

## 🚢 **النشر على Cloud Run**

### **بداية سريعة:**

```bash
# نشر مباشر
gcloud run deploy crm-nxs \
  --source apps/CRM \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

### **دليل كامل:**
راجع [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## 📊 **الحالة والإحصائيات**

```
✅ 28 سكريبت تلقائي
✅ 20+ ملف توثيق
✅ 50+ مكون React
✅ 45+ مكون Shadcn/ui
✅ 5 صفحات رئيسية
✅ TypeScript 100%
✅ Nx Workspace جاهز
✅ Cloud Run جاهز
✅ Production Ready

الحالة: 🟢 100% Ready to Deploy!
```

---

## 🤝 **المساهمة**

راجع [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) للحصول على دليل المساهمة.

---

## 📄 **الترخيص**

MIT License - راجع [LICENSE](LICENSE) للتفاصيل.

---

## 🆘 **الدعم**

### **واجهت مشكلة؟**
1. راجع [`docs/README.md`](docs/README.md)
2. شغّل `nx run CRM:diagnose`
3. راجع التوثيق الشامل

---

## 🌟 **الميزات القادمة**

- [ ] تكامل مع Supabase
- [ ] تطبيق Mobile (React Native)
- [ ] تحليلات متقدمة
- [ ] AI Assistant محسّن
- [ ] تكامل مع Odoo ERP

---

<div align="center">

## **🎉 جاهز للاستخدام!**

**الخطوة التالية:**

**[📚 التوثيق الكامل](docs/README.md)** ← ابدأ هنا

**[🔧 دليل تطوير التطبيقات](docs/NEW_APP_DEVELOPMENT_GUIDE.md)** ← إنشاء تطبيق جديد

---

**Happy Coding! 🚀**

**الإصدار:** 1.0.0 | **Nx Ready** ✅ | **Cloud Ready** ✅

</div>
