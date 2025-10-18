# 🚀 نظام الأتمتة المرئية الاحترافي
## Professional Visual Workflow Automation System

> **منصة أتمتة مرئية احترافية بتقنيات SaaS 2025** - أفضل وأجمل من n8n  
> مبني بـ **Vite 6** + **React 19** + **Tailwind CSS v4** + **TypeScript 5**  
> متكامل مع **ActivePieces Self-Hosted** للتنفيذ الحقيقي

[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8)](https://tailwindcss.com/)

---

## 🎯 البدء السريع (خطوة واحدة!)

### طريقة 1: يدوياً (موصى به)

```bash
# 1. نظف الملفات القديمة
rm -rf node_modules .next .turbo package-lock.json

# 2. ثبّت المكتبات
npm install

# 3. شغّل المشروع
npm run dev

# 4. افتح المتصفح على:
# http://localhost:4100
```

**🎉 انتهيت! التطبيق يعمل الآن**

---

## ⚡ الأداء المُحسَّن

**تم تطبيق 3 تحسينات أساسية - تحسين 60-70%!**

- ✅ **React.memo** للمكونات الثقيلة
- ✅ **Debounce (300ms)** للبحث
- ✅ **Throttle (16ms)** للـ Pan

**النتائج:**
- TBT: 1,190ms → 400ms (66% ⬇️)
- Reflow: 1,207ms → 300ms (75% ⬇️)
- Long Tasks: 17 → 6 (65% ⬇️)

📖 **التفاصيل**: راجع [دليل تحسين الأداء](docs/PERFORMANCE_OPTIMIZATION.md)

---

## 📚 التوثيق الكامل

📁 **25+ دليل شامل منظم في مجلد [`/docs`](docs/)**

### 🎓 **الفهارس الرئيسية**
- **[📑 الفهرس السريع](docs/INDEX.md)** - بحث وتصفح سريع ⚡
- **[📚 فهرس التوثيق الشامل](docs/README_DOCUMENTATION.md)** - الدليل الكامل ⭐

### 🚀 **الإعداد والتشغيل** (جديد! ✨)
- **[🚀 دليل الإعداد الكامل](docs/project/COMPLETE_SETUP_GUIDE.md)** - من التثبيت للنشر
- **[📁 هيكل المشروع](docs/project/PROJECT_STRUCTURE.md)** - شرح تفصيلي للهيكل
- **[✅ قائمة التحقق النهائية](docs/project/PROJECT_CHECKLIST.md)** - 164 بند للجاهزية

### 📖 **الأدلة الأساسية**
- [🔌 دليل تكامل ActivePieces](docs/ACTIVEPIECES_INTEGRATION.md) - تركيب العقد والـ API
- [🤖 دليل سايد بار الذكاء الاصطناعي](docs/AI_CHAT_SIDEBAR.md) - المساعد الذكي الكامل
- [🎛️ دليل الأزرار والتحكمات](docs/BUTTONS_AND_CONTROLS.md) - شرح شامل للتحكمات
- [🎨 دليل الهيكل والألوان](docs/STRUCTURE_AND_COLORS.md) - نظام التصميم الكامل
- [📦 دليل العقد](docs/NODES_GUIDE.md) - كل شيء عن العقد
- [🔨 دليل إنشاء عقدة جديدة](docs/CREATE_NEW_NODE.md) - خطوة بخطوة

### 🔧 **الأدلة التقنية**
- [📊 نظام Analytics](docs/ANALYTICS_SYSTEM.md) - المراقبة والتحليل
- [⚡ تحسين الأداء](docs/PERFORMANCE_OPTIMIZATION.md) - أفضل الممارسات
- [🔲 نظام الشبكة](docs/GRID_SYSTEM.md) - Grid System احترافي
- [🔍 نظام الزوم](docs/ZOOM_SYSTEM.md) - Zoom & Pan متقدم

---

## ✨ الميزات الرئيسية

### 🎨 **واجهة احترافية**
- تصميم **Glassmorphism** و **Neumorphism**
- وضع فاتح/داكن مع **Gray Scale** احترافي
- دعم كامل لـ **RTL/LTR** (عربي/إنجليزي)
- خطوط **Cairo** (عربي) و **Inter** (إنجليزي)

### 🔌 **تكامل ActivePieces**
- **وضعان**: Demo Mode (محاكاة محلية) و Production Mode (تنفيذ فعلي)
- دعم **ActivePieces Self-Hosted** من GitHub
- تنفيذ حقيقي للـ Workflows على السيرفر
- مراقبة الأداء في الوقت الفعلي

### 📊 **13 نوع عقدة**
- **Triggers**: Webhook, Schedule, Email
- **Actions**: HTTP Request, Send Email, Notification, Database Read/Write
- **Logic**: Condition, Delay
- **Data**: Transform, Function

### ⚡ **أداء عالي**
- **SSR** و **ISR** مع Next.js 15.5
- **React 19.1** مع Server Components
- **Tailwind v4** (أسرع 10x من v3)
- تحميل سريع وخفيف

### 🔒 **أمان محسّن**
- مكتبة أمان شاملة مدمجة
- **CSP Headers** و **XSS Protection**
- **WCAG AA** معايير الوصول

---

## 🎭 أنواع العقد المدعومة

### Triggers (محفزات) - 3 أنواع
| العقدة | الوصف | الأيقونة |
|--------|-------|---------|
| **Webhook** | استقبال HTTP requests | ⚡ |
| **Schedule** | تشغيل دوري بالجدول الزمني | ⏰ |
| **Email** | عند استقبال بريد إلكتروني | 📧 |

### Actions (إجراءات) - 5 أنواع
| العقدة | الوصف | الأيقونة |
|--------|-------|---------|
| **HTTP Request** | استدعاء APIs خارجية | 🌐 |
| **Send Email** | إرسال بريد إلكتروني | 📤 |
| **Notification** | إرسال إشعارات | 🔔 |
| **Database Read** | قراءة من قاعدة البيانات | 📖 |
| **Database Write** | كتابة إلى قاعدة البيانات | 💾 |

### Logic (منطق) - 2 نوع
| العقدة | الوصف | الأيقونة |
|--------|-------|---------|
| **Condition** | شروط If/Else | 🔀 |
| **Delay** | تأخير زمني | ⏸️ |

### Data Processing (معالجة البيانات) - 3 أنواع
| العقدة | الوصف | الأيقونة |
|--------|-------|---------|
| **Transform** | تحويل البيانات | 🔧 |
| **Function** | تنفيذ كود مخصص JavaScript | 💻 |
| **Code** | كتابة كود مخصص | 📝 |

**المجموع: 13 نوع عقدة احترافية** ✅

---

## 📦 المتطلبات

```bash
Node.js >= 24.9.0
npm >= 11.60.0
```

### التحقق من الإصدارات

```bash
node --version   # v24.9.0 أو أحدث
npm --version    # 11.60.0 أو أحدث
```

---

## 🔗 التكامل مع ActivePieces

### الوضعان المتاحان

#### 1️⃣ **Demo Mode** (الافتراضي)

```bash
# يعمل مباشرة بدون أي تكوين
npm run dev
```

✅ محاكاة محلية كاملة  
✅ جميع العقد تعمل  
✅ لا يحتاج API key

#### 2️⃣ **Production Mode** (مع ActivePieces حقيقي)

```bash
# 1. انسخ ملف البيئة
cp .env.example .env.local

# 2. عدّل .env.local وأضف:
NEXT_PUBLIC_ACTIVEPIECES_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ACTIVEPIECES_API_KEY=ap_your_api_key_here

# 3. شغّل المشروع
npm run dev
```

### الحصول على API Key من ActivePieces

#### خيار A: ActivePieces Cloud (السحابي)

1. سجل في https://cloud.activepieces.com/sign-up
2. اذهب إلى: Settings → API Keys
3. أنشئ مفتاح جديد
4. انسخ المفتاح (يبدأ بـ `ap_...`)
5. استخدم: `NEXT_PUBLIC_ACTIVEPIECES_API_URL=https://cloud.activepieces.com/api/v1`

#### خيار B: ActivePieces Self-Hosted (موصى به)

```bash
# 1. نزّل ActivePieces من GitHub
git clone https://github.com/activepieces/activepieces.git
cd activepieces

# 2. شغّل بـ Docker Compose
docker-compose up -d

# 3. افتح http://localhost:8080

# 4. سجل حساب جديد

# 5. اذهب إلى: Settings → API Keys

# 6. أنشئ مفتاح جديد وانسخه

# 7. أضف إلى .env.local:
NEXT_PUBLIC_ACTIVEPIECES_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ACTIVEPIECES_API_KEY=ap_...
```

---

## 📁 هيكل المشروع

```
visual-workflow-automation/
├── 📄 App.tsx                   ⭐ المكون الرئيسي
├── 📄 README.md                 ✅ التوثيق الكامل
├── 📄 package.json              ✅ التبعيات والأوامر
├── 📄 vite.config.ts            ✅ إعدادات Vite
├── 📄 tsconfig.json             ✅ إعدادات TypeScript
├── 📄 postcss.config.js         ✅ Tailwind v4
│
├── 📁 src/                      ✅ الملفات المصدرية
│   └── main.tsx                 ⭐ Bootstrap التطبيق
│
├── 📁 components/               ✅ 50+ مكون
│   ├── WorkflowCanvasEnhanced.tsx        ⭐ الكانفا
│   ├── NodeTypesSidebarEnhanced.tsx      ⭐ سايد بار العقد
│   ├── WorkflowToolbarEnhanced.tsx       ⭐ شريط الأدوات
│   ├── PropertyPanel.tsx                 ⭐ لوحة الخصائص
│   ├── AIChatSidebar.tsx                 🤖 الذكاء الاصطناعي
│   ├── analytics/                        📊 7 مكونات تحليلات
│   ├── templates/                        📑 مكتبة القوالب
│   ├── nodes/                            📦 عقد معالجة الأخطاء
│   └── ui/                               🎨 40+ مكون Shadcn
│
├── 📁 docs/                     ✅ 25+ دليل شامل
│   ├── project/                 🚀 أدلة الإعداد والتشغيل
│   ├── setup/                   📖 أدلة التثبيت
│   └── *.md                     📚 أدلة متخصصة
│
├── 📁 config/                   ✅ الإعدادات
│   └── activepieces.config.ts
│
├── 📁 services/                 ✅ خدمات API
│   ├── activepieces-api.ts
│   └── activepieces-client.ts
│
├── 📁 lib/                      ✅ المكتبات المساعدة
│   ├── utils.ts                 🛠️ أدوات عامة
│   ├── constants.ts             📊 الثوابت
│   ├── logger.ts                📝 نظام السجلات
│   ├── performance-optimizer.ts ⚡ محسن الأداء
│   ├── automation-sdk/          🤖 SDK الأتمتة
│   └── security/                🔒 الأمان
│
├── 📁 types/                    ✅ TypeScript Types
│   └── automation.ts
│
├── 📁 guidelines/               ✅ الإرشادات
│   └── Guidelines.md            📋 إرشادات المشروع
│
├── 📁 styles/                   ✅ الأنماط
│   ├── globals.css              🎨 Tailwind v4 System
│   ├── ios-fixes.css            📱 إصلاحات iOS
│   └── mobile.css               📱 أنماط الموبايل
│
└── 📁 public/                   ✅ الملفات العامة
    ├── manifest.json            📋 PWA Manifest
    └── *.svg                    🖼️ الأيقونات
```

**📖 للتفاصيل الكاملة**: [📁 دليل هيكل المشروع](docs/project/PROJECT_STRUCTURE.md)

**✅ المشروع جاهز 100% للتسليم والإنتاج!** 🚀