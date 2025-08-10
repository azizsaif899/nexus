# 🤖 G-Assistant Auto-Fix System v5.0

نظام إصلاح ذاتي متكامل ومتقدم مع ذكاء اصطناعي لمشروع G-Assistant

## ✨ الميزات الرئيسية

- 🔄 **إصلاح ذاتي تلقائي** مع AI-powered analysis
- 📊 **مراجعة متعددة المستويات** (Quality, Security, Tests, Architecture)
- 🔌 **نظام إضافات قابل للتوسع** (Plugin System)
- 🛡️ **نسخ احتياطية ذكية** مع إمكانية التراجع الفوري
- 📈 **مقاييس الأداء المتقدمة** والتقارير التفاعلية
- 🎯 **Type Safety كامل** مع TypeScript
- ⚡ **معالجة متوازية** للمهام عالية الأداء

## 🚀 التشغيل السريع

### الطريقة الأسرع:
```bash
# تشغيل بنقرة واحدة
QUICK_START.bat
```

### التشغيل اليدوي:
```bash
# 1. تثبيت التبعيات
npm install

# 2. إعداد البيئة
cp .env.example .env
# تحرير .env وإضافة مفاتيح API

# 3. بناء المشروع
npm run build

# 4. تشغيل النظام
npm start
```

## 📋 المتطلبات

- Node.js 18+ 
- npm 8+
- Gemini API Key
- TypeScript 5+

## 🏗️ البنية المعمارية

```
src/
├── core/                    # النواة الأساسية
│   ├── types/              # تعريفات TypeScript
│   ├── config/             # إدارة الإعدادات
│   ├── events/             # نظام الأحداث
│   ├── plugins/            # إدارة الإضافات
│   ├── orchestrator/       # منسق النظام
│   ├── executor/           # منفذ المهام
│   └── reviewer/           # مراجع الكود
└── plugins/                # الإضافات المخصصة
```

## 🔧 الاستخدام

### تشغيل دورة إصلاح يدوية:
```typescript
import { AutoFixSystem } from './src/core';

const system = new AutoFixSystem();
await system.runManualCycle();
```

### مراجعة ملفات محددة:
```typescript
const result = await system.reviewFiles([
  'src/components/Button.tsx',
  'src/utils/helpers.ts'
]);
```

### الحصول على حالة النظام:
```typescript
const health = system.getSystemHealth();
console.log(`System Score: ${health.score}/100`);
```

## 🔌 إضافة Plugin جديد

```typescript
// src/plugins/myPlugin.plugin.ts
import { Plugin } from '../core/types';

export const myPlugin: Plugin = {
  name: 'My Custom Plugin',
  version: '1.0.0',
  enabled: true,
  hooks: {
    beforeTask: async (task) => {
      console.log(`Processing task: ${task.id}`);
    },
    afterTask: async (task, result) => {
      console.log(`Task completed: ${result.success}`);
    }
  }
};
```

## 📊 مثال على النتائج

### System Health:
```json
{
  "status": "healthy",
  "score": 95,
  "metrics": {
    "totalTasks": 150,
    "completedTasks": 142,
    "failedTasks": 8,
    "errorRate": 0.05
  }
}
```

### Review Results:
```json
{
  "branch": "main",
  "status": "passed",
  "score": 88,
  "checks": {
    "quality": { "score": 90, "status": "passed" },
    "security": { "score": 95, "status": "passed" },
    "tests": { "score": 85, "status": "warning" },
    "architecture": { "score": 82, "status": "passed" }
  }
}
```

## 🛠️ الأوامر المتاحة

```bash
npm run dev              # تشغيل في وضع التطوير
npm run build            # بناء المشروع
npm start                # تشغيل النظام
npm test                 # تشغيل الاختبارات
npm run test:coverage    # اختبارات مع التغطية
npm run lint             # فحص الكود
npm run lint:fix         # إصلاح مشاكل الكود
npm run format           # تنسيق الكود
```

## ⚙️ الإعدادات

### متغيرات البيئة الأساسية:
```env
GEMINI_API_KEY=your_api_key_here
REPO_ROOT=E:/azizsys5
CRON_INTERVAL=*/5 * * * *
SLACK_WEBHOOK=your_webhook_url
```

### إعدادات متقدمة:
```env
MAX_CONCURRENT_TASKS=5
TASK_TIMEOUT=300000
BACKUP_RETENTION_DAYS=7
ENABLED_PLUGINS=example,security,quality
```

## 🔒 الأمان

- ✅ فحص الثغرات الأمنية التلقائي
- ✅ كشف الأسرار المدفونة في الكود
- ✅ تحليل التبعيات للمخاطر
- ✅ نسخ احتياطية آمنة مع تشفير
- ✅ سجل مراجعة شامل

## 📈 الأداء

- ⚡ معالجة متوازية للمهام
- 🚀 تحليل تدريجي للتغييرات فقط
- 💾 تخزين مؤقت ذكي للنتائج
- 🔄 استرداد تلقائي من الأخطاء
- 📊 مراقبة الأداء المستمرة

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

**خطأ في API Key:**
```bash
❌ Configuration validation failed
✅ تأكد من إضافة GEMINI_API_KEY في .env
```

**فشل في البناء:**
```bash
❌ Build failed
✅ تشغيل: npm run clean && npm run build
```

**مشاكل الأذونات:**
```bash
❌ Permission denied
✅ تشغيل كمدير: Run as Administrator
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## 📄 الترخيص

MIT License - انظر ملف LICENSE للتفاصيل

## 🆘 الدعم

- 📧 البريد الإلكتروني: support@g-assistant.com
- 💬 Discord: G-Assistant Community
- 📖 التوثيق: [docs.g-assistant.com](https://docs.g-assistant.com)

---

**تم تطوير هذا النظام بواسطة فريق G-Assistant 🚀**

*نظام إصلاح ذاتي متقدم - جاهز للاستخدام الفوري!*