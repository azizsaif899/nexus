# 🚀 AzizSys AI Assistant v2.0 - النظام الذكي المتكامل

**AzizSys AI Assistant v2.0** هو نظام ذكاء اصطناعي مؤسسي متكامل، مبني على معمارية Monorepo حديثة باستخدام NX، ومصمم لتحويل العمليات التجارية من خلال الذكاء الاصطناعي المتقدم والتكاملات القوية.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo)
[![Node Version](https://img.shields.io/badge/node-18.17.0-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## ✨ الميزات الرئيسية

### 🎯 التطبيقات الأساسية
- **🎛️ Admin Dashboard** (Port 4200) - لوحة تحكم شاملة مع تحليلات BI
- **💬 Web Chatbot** (Port 3000) - واجهة دردشة ذكية بالعربية
- **🔧 API Backend** (Port 3333) - خادم NestJS قوي ومرن
- **👥 CRM System** - إدارة علاقات العملاء مع Firebase Data Connect

### 🧠 قدرات الذكاء الاصطناعي
- **محرك AI مركزي** - معالجة اللغة الطبيعية والتحليل التنبؤي
- **تكامل Gemini AI** - قدرات متقدمة للفهم والاستجابة
- **ذاكرة المحادثات** - تتبع السياق عبر الجلسات
- **توجيه النوايا الذكي** - فهم دقيق لطلبات المستخدمين

### 🔗 التكاملات القوية
- **Firebase** - المصادقة وقاعدة البيانات والتخزين
- **WhatsApp Business API** - تفاعل مباشر مع العملاء
- **Odoo ERP** - تكامل أنظمة تخطيط الموارد
- **BigQuery** - تحليلات البيانات الضخمة
- **Meta Ads** - إدارة الحملات الإعلانية

### 🛡️ الأمان والامتثال
- **مصادقة JWT** - نظام مصادقة آمن ومرن
- **GDPR Compliance** - امتثال كامل لقوانين حماية البيانات
- **Security Middleware** - طبقات حماية متعددة
- **Audit Logging** - تسجيل شامل للعمليات

---

## 🏗️ هيكل المشروع

```
g-assistant-nx/
├── 🎯 apps/                    # التطبيقات الرئيسية
│   ├── admin-dashboard/        # لوحة التحكم الإدارية (React)
│   ├── web-chatbot/           # واجهة الدردشة الذكية (React)
│   ├── api/                   # الخادم الخلفي (NestJS)
│   ├── crm-system/            # نظام إدارة العملاء
│   └── sheets-addon/          # إضافة Google Sheets
│
├── 📦 packages/               # المكتبات المشتركة
│   ├── ai-engine/             # محرك الذكاء الاصطناعي
│   ├── security-core/         # نظام الأمان والحماية
│   ├── monitoring-core/       # نظام المراقبة والتحليل
│   ├── crm-core/              # منطق إدارة العملاء
│   └── core/                  # المكونات الأساسية
│
├── 🔧 config/                 # ملفات التكوين
│   ├── deployment/            # إعدادات النشر
│   ├── firebase/              # تكوين Firebase
│   └── security/              # إعدادات الأمان
│
├── 📚 docs/                   # التوثيق الشامل
│   ├── 2_developer_guide/     # دليل المطورين
│   ├── 3_api/                 # توثيق API
│   └── 4_operations/          # دليل العمليات
│
├── 🛠️ scripts/               # أدوات التشغيل والصيانة
├── 🧪 tests/                  # الاختبارات الشاملة
└── 📋 ملفات التكوين الرئيسية
    ├── package.json           # تبعيات المشروع
    ├── nx.json               # تكوين NX
    ├── tsconfig.base.json    # تكوين TypeScript
    └── .env.example          # قالب متغيرات البيئة
```

---

## 🎨 التقنيات المستخدمة

### Frontend
- **React 18** - مكتبة واجهات المستخدم
- **TypeScript** - لغة البرمجة المطورة
- **Vite** - أداة البناء السريعة
- **Material-UI** - مكونات واجهة المستخدم
- **TanStack Query** - إدارة حالة الخادم

### Backend
- **NestJS** - إطار عمل Node.js المتقدم
- **TypeORM** - ORM لقواعد البيانات
- **JWT** - نظام المصادقة
- **WebSocket** - الاتصال المباشر
- **Swagger** - توثيق API

### Database & Cloud
- **Firebase** - المصادقة والتخزين
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **BigQuery** - تحليل البيانات الضخمة
- **Google Cloud** - البنية التحتية السحابية

### DevOps & Tools
- **NX** - أدوات Monorepo
- **Docker** - الحاويات
- **GitHub Actions** - CI/CD
- **Jest/Vitest** - الاختبارات

---

## 🚀 البدء السريع

### المتطلبات الأساسية
- **Node.js**: 18.17.0 (استخدم `nvm use` للتبديل التلقائي)
- **pnpm**: مدير الحزم المفضل
- **Git**: لإدارة الإصدارات

### خطوات الإعداد

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd g-assistant-nx

# 2. تثبيت pnpm (إذا لم يكن مثبتاً)
npm install -g pnpm

# 3. تثبيت التبعيات
pnpm install

# 4. إعداد متغيرات البيئة
cp .env.example .env
# قم بتحرير .env وإضافة القيم المطلوبة

# 5. فحص الإعداد
pnpm run setup:dev
```

### تشغيل التطبيقات

```bash
# تشغيل جميع التطبيقات
pnpm run dev

# تشغيل تطبيق محدد
pnpm nx serve admin-dashboard  # Port 4200
pnpm nx serve web-chatbot      # Port 3000
pnpm nx serve api              # Port 3333

# بناء للإنتاج
pnpm run build

# تشغيل الاختبارات
pnpm run test
```

### فحص الأمان

```bash
# فحص الثغرات الأمنية
pnpm run security:audit

# فحص سريع للأمان
node scripts/security-scan.js
```

---

## 📚 التوثيق والموارد

### 📖 الأدلة الأساسية
- **[تحليل المشروع الكامل](PROJECT_ANALYSIS.md)** - نظرة شاملة على البنية والمكونات
- **[دليل الإعداد للمطورين](DEVELOPER_SETUP.md)** - خطوات الإعداد التفصيلية
- **[قائمة فحص الأمان](SECURITY_CHECKLIST.md)** - إرشادات الأمان والحماية
- **[دليل المطورين](docs/2_developer_guide/)** - معايير التطوير والبرمجة

### 🔗 روابط مفيدة
- **[معمارية النظام](docs/2_developer_guide/architecture.md)**
- **[دليل النشر](docs/4_operations/deployment.md)**
- **[دليل الاختبارات](docs/2_developer_guide/testing.md)**
- **[API Reference](docs/3_api/)**

## 🛠️ أوامر مفيدة

```bash
# فحص حالة النظام
pnpm run system:health

# تشغيل اختبارات سريعة
pnpm run test:quick

# فحص الأمان
pnpm run security:check

# تحليل المشروع
node PROJECT_TEST_SUITE.js

# تنظيف الملفات المؤقتة
pnpm run clean
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. قراءة [دليل المساهمة](docs/2_developer_guide/CONTRIBUTING.md)
2. اتباع [معايير البرمجة](docs/2_developer_guide/coding_standards.md)
3. تشغيل الاختبارات قبل الإرسال

## 📞 الدعم والتواصل

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@azizsys.com

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT. انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

<div align="center">
  <strong>🚀 مبني بـ ❤️ بواسطة فريق AzizSys</strong>
</div>