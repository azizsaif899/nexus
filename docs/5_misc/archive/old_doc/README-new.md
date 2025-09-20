# 🚀 AzizSys - نظام إدارة ذكي متكامل

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/azizsaif899/g-assistant)
[![Version](https://img.shields.io/badge/version-6.4.0-blue)](https://github.com/azizsaif899/g-assistant)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-orange)](https://ai.google.dev/)

> نظام إدارة متكامل مدعوم بالذكاء الاصطناعي مع واجهة Google Sheets وتكامل WhatsApp

## 🎯 نظرة سريعة

AzizSys هو نظام إدارة ذكي يجمع بين قوة Google Apps Script وإمكانيات Gemini AI لتقديم:

- 🤖 **وكلاء ذكاء اصطناعي متخصصون** (مالي، تطوير، تحليل بيانات)
- 📊 **واجهة Google Sheets تفاعلية** مع سايدبار محسن v3
- 🔍 **بحث دلالي متقدم** باستخدام Embeddings
- 💬 **تكامل WhatsApp** للتفاعل عبر الرسائل
- 🌐 **واجهة ويب خارجية** كاملة الميزات

## 🚀 البدء السريع

```bash
# 1. استنساخ المشروع
git clone https://github.com/azizsaif899/g-assistant.git
cd g-assistant

# 2. تثبيت التبعيات
npm install

# 3. إعداد البيئة
cp .env.example .env
# أضف GEMINI_API_KEY في ملف .env

# 4. بناء ونشر
npm run build
npm run deploy
```

## 📚 دليل التوثيق

| القسم | الوصف | الرابط |
|-------|--------|-------|
| 🏗️ **البنية المعمارية** | فهم تصميم النظام والمكونات | [architecture-new.md](architecture-new.md) |
| ⚙️ **دليل الإعداد** | إعداد البيئة المحلية والنشر | [setup-new.md](setup-new.md) |
| 🔄 **سير العمل** | العمليات اليومية والتطوير | [development-workflow.md](development-workflow.md) |
| 🤖 **الوكلاء الذكيون** | دليل الوكلاء وإمكانياتهم | [agents-catalog-new.md](agents-catalog-new.md) |
| 🔍 **نظام التضمين** | البحث الدلالي والذاكرة | [embeddings-guide-new.md](embeddings-guide-new.md) |
| 📱 **تطوير السايدبار** | تخصيص واجهة Google Sheets | [sidebar-development.md](sidebar-development.md) |
| 💬 **تكامل WhatsApp** | إعداد وتطوير بوت WhatsApp | [whatsapp-integration.md](whatsapp-integration.md) |
| 🚀 **النشر والمراقبة** | استراتيجيات النشر والمراقبة | [deployment.md](deployment.md) |
| 🔧 **استكشاف الأخطاء** | حل المشاكل الشائعة | [troubleshooting-new.md](troubleshooting-new.md) |

## 🏗️ البنية العامة

```
azizsys5/
├── 📁 core/                    # النواة الأساسية
├── 📁 modules/                 # الوحدات الرئيسية
│   ├── ai/                    # الذكاء الاصطناعي
│   ├── ui/                    # واجهات المستخدم
│   ├── tools/                 # الأدوات
│   └── agents/                # الوكلاء
├── 📁 interfaces/              # الواجهات الخارجية
│   ├── sidebar/               # سايدبار Google Sheets
│   ├── webapp/                # الواجهة الخارجية
│   └── whatsapp/              # تكامل WhatsApp
└── 📁 dist/                    # الملفات الجاهزة للنشر
```

## ✨ الميزات الرئيسية

### 🤖 الوكلاء الذكيون
- **المحلل المالي (CFO)**: تحليل البيانات المالية وإنشاء التقارير
- **مساعد المطور**: مراجعة الكود وتقديم الاقتراحات
- **مدير البيانات**: تحليل وتنظيم البيانات في الجداول

### 🔍 البحث الدلالي
- فهرسة تلقائية للمحادثات والمستندات
- بحث ذكي باستخدام المعنى وليس الكلمات فقط
- ذاكرة طويلة المدى للسياق

### 📊 واجهة Google Sheets
- سايدبار تفاعلي مع تصميم حديث
- تحليل فوري للبيانات
- أدوات تصور متقدمة

## 🛠️ التقنيات المستخدمة

- **Google Apps Script**: البيئة الأساسية
- **Gemini AI**: محرك الذكاء الاصطناعي
- **Node.js**: أدوات البناء والتطوير
- **HTML/CSS/JavaScript**: واجهات المستخدم
- **Python**: الواجهة الخارجية (LangGraph)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى مراجعة [دليل المساهمة](contributing.md) للتفاصيل.

## 📄 الترخيص

هذا المشروع مرخص بموجب [ترخيص MIT](LICENSE).

## 🆘 الدعم

- 📖 **التوثيق**: راجع الأدلة أعلاه
- 🐛 **الأخطاء**: [فتح issue](https://github.com/azizsaif899/g-assistant/issues)
- 💬 **المناقشة**: [GitHub Discussions](https://github.com/azizsaif899/g-assistant/discussions)

---

<div align="center">
  <strong>صُنع بـ ❤️ لتبسيط إدارة البيانات والأعمال</strong>
</div>