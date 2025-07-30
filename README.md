# 🚀 AzizSys - نظام إدارة ذكي متكامل

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/your-username/azizsys5)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)](https://github.com/your-username/azizsys5)
[![Remote Work](https://img.shields.io/badge/Remote%20Work-Supported-brightgreen)](./REMOTE_WORK_GUIDE.md)

## 📋 نظرة عامة

AzizSys هو نظام إدارة ذكي متكامل يجمع بين قوة Google Apps Script وتقنيات الذكاء الاصطناعي لتوفير حلول شاملة لإدارة الأعمال والبيانات.

## ✨ الميزات الرئيسية

### 🤖 نظام الذكاء الاصطناعي
- **Gemini AI Integration** - تكامل كامل مع Gemini AI
- **معالجة النصوص والصور** - تحليل ذكي للمحتوى
- **الذاكرة طويلة المدى** - نظام ذاكرة متقدم للمحادثات
- **وكلاء ذكيون متخصصون** - CFO, Developer, General agents

### 📊 أدوات Google Sheets المتقدمة
- **تحليل البيانات المالية** - تقارير مالية تلقائية
- **أدوات المحاسبة** - نظام محاسبي متكامل
- **التقارير التفاعلية** - لوحات تحكم ديناميكية
- **البحث الذكي** - بحث متقدم في البيانات

### 🔧 النظام المعياري
- **هيكل منظم** - مكونات قابلة للإعادة الاستخدام
- **سهولة الصيانة** - كود منظم وموثق
- **قابلية التوسع** - إضافة ميزات جديدة بسهولة
- **اختبارات شاملة** - نظام اختبار متكامل

### 🌐 الخدمات الخارجية
- **واجهات ويب حديثة** - UI/UX متطور
- **APIs متقدمة** - واجهات برمجية شاملة
- **WebSocket Support** - تحديثات مباشرة
- **Multi-modal Processing** - معالجة متعددة الوسائط

## 🚀 البدء السريع

### 📋 المتطلبات
- Node.js (v16+)
- Google Apps Script CLI (clasp)
- Git
- محرر نصوص (VS Code مُفضل)

### ⚡ التثبيت السريع

```bash
# استنساخ المشروع
git clone https://github.com/your-username/azizsys5.git
cd azizsys5

# تثبيت المكتبات
npm install

# إعداد البيئة
copy .env.example .env
# أضف مفاتيح API الخاصة بك

# تسجيل الدخول إلى Google
clasp login

# رفع المشروع
clasp push

# تشغيل الاختبارات
npm test
```

### 🔧 التشغيل

```bash
# تشغيل الخادم المحلي
npm run dev

# تشغيل الخدمات الخارجية
cd web_interface && npm start

# فتح المشروع في Google Apps Script
clasp open
```

## 📁 هيكل المشروع

```
azizsys5/
├── 📁 src/                    # الكود المصدري الرئيسي
│   ├── 📁 AI/                 # نظام الذكاء الاصطناعي
│   ├── 📁 Tools/              # أدوات Google Sheets
│   ├── 📁 UI/                 # واجهات المستخدم
│   └── 📁 System/             # النظام الأساسي
├── 📁 10_ui/                  # مكونات الواجهة
├── 📁 20_ai/                  # وحدات الذكاء الاصطناعي
├── 📁 30_tools/               # أدوات متخصصة
├── 📁 web_interface/          # الواجهات الخارجية
├── 📁 tests/                  # الاختبارات
├── 📁 documentation/          # التوثيق الشامل
└── 📁 scripts/                # سكريبتات التشغيل
```

## 🛠️ الاستخدام

### 🤖 الذكاء الاصطناعي

```javascript
// استخدام Gemini AI
const ai = new AI.Core();
const response = await ai.query("تحليل بيانات المبيعات");

// الوكلاء المتخصصون
const cfo = new Agents.CFO();
const analysis = await cfo.analyzeFinancials(data);
```

### 📊 أدوات Google Sheets

```javascript
// تحليل البيانات
const sheets = new Tools.Sheets();
const report = await sheets.generateReport(range);

// المحاسبة
const accounting = new Tools.Accounting();
const balance = await accounting.getBalanceSheet();
```

### 🌐 الواجهات الخارجية

```javascript
// API calls
fetch('/api/query', {
  method: 'POST',
  body: JSON.stringify({ query: 'تحليل البيانات' })
});

// WebSocket
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (data) => console.log(data);
```

## 📚 التوثيق

- 📖 **[دليل المطور](./documentation/AzizSys_Developer_Guide.md)**
- 🚀 **[دليل النشر](./documentation/DEPLOYMENT_GUIDE.md)**
- 🏠 **[العمل عن بُعد](./REMOTE_WORK_GUIDE.md)**
- 🔧 **[استكشاف الأخطاء](./documentation/AzizSys_Troubleshooting_Guide.md)**
- 📋 **[دليل المستخدم](./documentation/USER_MANUAL.md)**

## 🧪 الاختبارات

```bash
# تشغيل جميع الاختبارات
npm test

# اختبارات محددة
npm run test:ai
npm run test:sheets
npm run test:integration

# تقرير التغطية
npm run test:coverage
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](./documentation/CONTRIBUTING.md) قبل البدء.

### 🔄 سير العمل

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📈 الحالة الحالية

- ✅ **النظام الأساسي:** مكتمل (100%)
- ✅ **الذكاء الاصطناعي:** مكتمل (95%)
- ✅ **أدوات Google Sheets:** مكتمل (90%)
- ✅ **الواجهات:** مكتمل (85%)
- ✅ **الاختبارات:** مكتمل (80%)
- ✅ **التوثيق:** مكتمل (85%)

## 🏠 العمل عن بُعد

المشروع **مُحسّن بالكامل للعمل عن بُعد** مع:
- 📱 دعم كامل للمنصات المختلفة
- 🔄 مزامنة تلقائية مع GitHub
- 🛠️ أدوات تطوير محلية
- 📚 توثيق شامل
- 🆘 دعم فني متكامل

## 📞 الدعم

- 📧 **البريد الإلكتروني:** support@azizsys.com
- 🐛 **تقارير الأخطاء:** [GitHub Issues](https://github.com/your-username/azizsys5/issues)
- 💬 **المناقشات:** [GitHub Discussions](https://github.com/your-username/azizsys5/discussions)
- 📖 **الوثائق:** [Documentation](./documentation/)

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](./LICENSE).

## 🙏 شكر وتقدير

- Google Apps Script Team
- Gemini AI Team
- المساهمون في المشروع
- المجتمع المطور

---

<div align="center">

**🚀 AzizSys - نظام إدارة ذكي للمستقبل**

[![GitHub Stars](https://img.shields.io/github/stars/your-username/azizsys5?style=social)](https://github.com/your-username/azizsys5)
[![GitHub Forks](https://img.shields.io/github/forks/your-username/azizsys5?style=social)](https://github.com/your-username/azizsys5)

</div>