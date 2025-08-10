# 🤖 AzizSys AI Assistant

نظام مساعد ذكي متكامل مع قدرات الإصلاح الذاتي وإدارة المهام التلقائية.

## ✨ الميزات الرئيسية

- 🔄 **إصلاح ذاتي تلقائي** للأخطاء والمشاكل
- 📋 **إدارة المهام الذكية** مع تنسيق الفريق
- 🤖 **تكامل مع Gemini AI** للتحليل والتطوير
- 📊 **لوحة تحكم تفاعلية** لمراقبة النظام
- 📚 **نظام توثيق تلقائي** مع تحديث مستمر
- 🔍 **مراقبة الجودة** والاختبارات التلقائية
- 💬 **تكامل WhatsApp** للتفاعل عبر الرسائل
- 🛡️ **نظام أمان متقدم** مع حماية متعددة الطبقات
- 🧠 **ذكاء اصطناعي متقدم** مع معالجة اللغة الطبيعية

## 🚀 التثبيت والتشغيل

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/azizsys-ai-assistant.git
cd azizsys-ai-assistant

# الانتقال إلى مجلد المشروع الرئيسي
cd g-assistant-nx

# تثبيت التبعيات
pnpm install

# تشغيل النظام الكامل
pnpm start

# أو تشغيل مكونات محددة
pnpm run dev:api          # تشغيل API فقط
pnpm run dev:dashboard    # تشغيل لوحة التحكم فقط
pnpm run dev:whatsapp     # تشغيل بوت WhatsApp فقط
```

## 📁 هيكل المشروع

```
azizsys5/
├── g-assistant-nx/         # المشروع الرئيسي (NX Workspace)
│   ├── apps/              # التطبيقات
│   │   ├── api/           # NestJS API
│   │   ├── admin-dashboard/ # React Admin Dashboard
│   │   ├── web-chatbot/   # Web Chatbot Interface
│   │   ├── whatsapp-exec-bot/ # WhatsApp Executive Bot
│   │   └── whatsapp-query-bot/ # WhatsApp Query Bot
│   ├── packages/          # الحزم المشتركة
│   │   ├── core-logic/    # منطق العمل الأساسي
│   │   ├── whatsapp-core/ # وظائف WhatsApp
│   │   ├── security-core/ # نظام الأمان
│   │   ├── ai-engine/     # محرك الذكاء الاصطناعي
│   │   ├── monitoring-core/ # نظام المراقبة
│   │   └── testing-core/  # إطار الاختبارات
│   ├── docs/              # التوثيق
│   └── tests/             # الاختبارات
├── src/                   # الكود المصدري القديم (Google Apps Script)
├── docs/                  # توثيق إضافي
└── config/                # ملفات التكوين
```

## 🔧 التكوين

1. انسخ `.env.example` إلى `.env`
2. أضف مفاتيح API المطلوبة:
   ```env
   # Google AI
   GEMINI_API_KEY=your_gemini_api_key
   
   # WhatsApp
   WHATSAPP_TOKEN=your_whatsapp_token
   WHATSAPP_VERIFY_TOKEN=your_verify_token
   
   # Database
   DATABASE_URL=your_database_url
   
   # Security
   JWT_SECRET=your_jwt_secret
   ```

## 🏗️ البنية التقنية

### التقنيات المستخدمة:
- **Backend**: NestJS, TypeScript, Node.js
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL, Redis
- **AI/ML**: Google Gemini AI, TensorFlow
- **Messaging**: WhatsApp Business API
- **Monitoring**: Prometheus, Grafana
- **Testing**: Jest, Playwright
- **Build System**: NX, Webpack

### المعمارية:
- **Microservices Architecture** مع NX Workspace
- **Event-Driven Architecture** مع EventBus
- **Modular Design** مع حزم قابلة للإعادة الاستخدام
- **Security-First Approach** مع حماية متعددة الطبقات

## 📖 التوثيق

- [دليل المطور](g-assistant-nx/docs/2_developer_guide/AzizSys_Developer_Guide.md)
- [معايير الكود](g-assistant-nx/docs/2_developer_guide/coding_standards.md)
- [دليل المساهمة](g-assistant-nx/CONTRIBUTING.md)
- [دليل النشر](g-assistant-nx/docs/4_operations/deployment.md)
- [مرجع API](g-assistant-nx/docs/3_api/api_reference.md)

## 🧪 الاختبارات

```bash
# تشغيل جميع الاختبارات
pnpm test

# اختبارات الوحدة
pnpm test:unit

# اختبارات التكامل
pnpm test:integration

# اختبارات E2E
pnpm test:e2e

# تقرير التغطية
pnpm test:coverage
```

## 🚀 النشر

```bash
# بناء المشروع للإنتاج
pnpm build

# نشر على AWS
pnpm deploy:aws

# نشر على Google Cloud
pnpm deploy:gcp

# نشر محلي مع Docker
docker-compose up -d
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](g-assistant-nx/CONTRIBUTING.md) قبل البدء.

### خطوات المساهمة:
1. Fork المشروع
2. إنشاء branch للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📊 الحالة الحالية

- ✅ **Core System**: مكتمل
- ✅ **API Development**: مكتمل
- ✅ **Admin Dashboard**: مكتمل
- ✅ **WhatsApp Integration**: مكتمل
- ✅ **Security System**: مكتمل
- ✅ **AI Engine**: مكتمل
- ✅ **Monitoring**: مكتمل
- ✅ **Testing Framework**: مكتمل
- 🔄 **DevOps & Deployment**: قيد التطوير
- 🔄 **Analytics & BI**: قيد التطوير
- 🔄 **Content Management**: قيد التطوير

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](g-assistant-nx/LICENSE) للتفاصيل.

## 🆘 الدعم

- [فتح مشكلة](https://github.com/yourusername/azizsys-ai-assistant/issues)
- [طلب ميزة](https://github.com/yourusername/azizsys-ai-assistant/issues/new?template=feature_request.md)
- [تقرير خطأ](https://github.com/yourusername/azizsys-ai-assistant/issues/new?template=bug_report.md)

## 👥 الفريق

- **المطور الرئيسي**: AzizSys Team
- **مساعد الذكاء الاصطناعي**: Gemini AI
- **المراجع**: Amazon Q Developer

---

**تم تطوير هذا المشروع بواسطة فريق AzizSys مع دعم الذكاء الاصطناعي 🚀**

## 🔗 روابط مفيدة

- [الموقع الرسمي](https://azizsys.com)
- [التوثيق الكامل](https://docs.azizsys.com)
- [لوحة التحكم](https://dashboard.azizsys.com)
- [حالة النظام](https://status.azizsys.com)