# 🤝 دليل المساهمة في G-Assistant Enterprise

مرحباً بك في مشروع G-Assistant Enterprise! نحن نرحب بجميع المساهمات التي تساعد في تطوير هذه المنصة الذكية.

## 🚀 البدء السريع للمطورين

### متطلبات النظام
- Node.js 18+ 
- pnpm (مفضل) أو npm
- Git
- VS Code (مُوصى به)

### إعداد البيئة المحلية
```bash
# 1. استنساخ المشروع
git clone https://github.com/[username]/g-assistant-enterprise.git
cd g-assistant-enterprise

# 2. تثبيت التبعيات
pnpm install

# 3. نسخ ملف البيئة
cp .env.example .env

# 4. تشغيل التطبيقات
pnpm run dev
```

## 📋 أنواع المساهمات

### 🐛 الإبلاغ عن الأخطاء
- استخدم GitHub Issues
- اتبع قالب Bug Report
- أرفق screenshots إذا أمكن

### ✨ اقتراح ميزات جديدة
- استخدم GitHub Issues
- اتبع قالب Feature Request
- اشرح الحاجة والفائدة

### 💻 المساهمة بالكود
- Fork المشروع
- أنشئ branch جديد
- اتبع معايير الكود
- أضف اختبارات
- أرسل Pull Request

## 🌿 استراتيجية Branches

```
main
├── develop
├── feature/new-ai-agent
├── feature/crm-enhancement
├── hotfix/security-patch
└── release/v2.5.0
```

### أنواع Branches:
- **main**: الإنتاج المستقر
- **develop**: التطوير النشط
- **feature/***: ميزات جديدة
- **hotfix/***: إصلاحات عاجلة
- **release/***: تحضير الإصدارات

## 📝 معايير Commit Messages

نستخدم Conventional Commits:

```bash
# الميزات الجديدة
🚀 feat(api): إضافة endpoint جديد للمستخدمين

# إصلاح الأخطاء
🐛 fix(dashboard): إصلاح مشكلة تحميل البيانات

# التوثيق
📚 docs: تحديث دليل API

# التصميم
🎨 style(ui): تحسين تصميم الأزرار

# إعادة الهيكلة
♻️ refactor(core): تحسين منطق المصادقة

# الاختبارات
✅ test(api): إضافة اختبارات للمستخدمين

# المهام العامة
🔧 chore: تحديث التبعيات
```

## 🏗️ هيكل المشروع

```
g-assistant-nx/
├── apps/                 # التطبيقات
│   ├── api/             # NestJS API
│   ├── admin-dashboard/ # React Dashboard
│   ├── web-chatbot/     # React Chatbot
│   └── crm-system/      # CRM System
├── packages/            # المكتبات المشتركة
│   ├── ai-engine/       # محرك AI
│   ├── security-core/   # الأمان
│   └── monitoring-core/ # المراقبة
├── docs/               # التوثيق
└── tests/              # الاختبارات
```

## 🧪 معايير الجودة

### الاختبارات
```bash
# تشغيل جميع الاختبارات
pnpm test

# اختبارات وحدة معينة
pnpm test packages/ai-engine

# اختبارات E2E
pnpm test:e2e
```

### معايير التغطية:
- **Unit Tests**: >80%
- **Integration Tests**: >70%
- **E2E Tests**: >60%

### فحص الجودة:
```bash
# فحص ESLint
pnpm lint

# فحص TypeScript
pnpm type-check

# فحص الأمان
pnpm audit
```

## 📦 إضافة مكتبات جديدة

### إنشاء مكتبة جديدة:
```bash
# إنشاء مكتبة في packages/
nx generate @nx/js:library my-new-lib --directory=packages/my-new-lib

# إضافة التبعيات
cd packages/my-new-lib
pnpm add dependency-name
```

### معايير المكتبات:
- TypeScript فقط
- اختبارات شاملة
- توثيق README
- تصدير واضح في index.ts

## 🔒 الأمان

### معلومات حساسة:
- لا تضع API keys في الكود
- استخدم متغيرات البيئة
- راجع .gitignore قبل الcommit

### فحص الأمان:
```bash
# فحص الثغرات
pnpm audit

# فحص التبعيات
pnpm outdated
```

## 📋 Pull Request Process

### قبل إرسال PR:
1. ✅ تأكد من نجاح جميع الاختبارات
2. ✅ اتبع معايير الكود
3. ✅ أضف توثيق للميزات الجديدة
4. ✅ حدث CHANGELOG.md

### قالب PR:
```markdown
## 📝 الوصف
وصف موجز للتغييرات

## 🎯 نوع التغيير
- [ ] إصلاح خطأ
- [ ] ميزة جديدة
- [ ] تحسين الأداء
- [ ] تحديث التوثيق

## 🧪 الاختبارات
- [ ] اختبارات الوحدة
- [ ] اختبارات التكامل
- [ ] اختبار يدوي

## 📋 Checklist
- [ ] الكود يتبع معايير المشروع
- [ ] التوثيق محدث
- [ ] الاختبارات تمر بنجاح
```

## 🎨 معايير التصميم

### UI/UX:
- Material-UI للمكونات
- Responsive Design
- Dark/Light Mode
- RTL Support للعربية

### الألوان:
```css
:root {
  --primary: #1976d2;
  --secondary: #dc004e;
  --success: #2e7d32;
  --warning: #ed6c02;
  --error: #d32f2f;
}
```

## 🌍 الترجمة والتدويل

### إضافة ترجمات:
```typescript
// في ملفات i18n
export const translations = {
  en: {
    welcome: "Welcome to G-Assistant"
  },
  ar: {
    welcome: "مرحباً بك في مساعد جي"
  }
};
```

## 📞 الحصول على المساعدة

### قنوات التواصل:
- **GitHub Issues**: للأخطاء والاقتراحات
- **GitHub Discussions**: للأسئلة العامة
- **Email**: للاستفسارات الخاصة

### الموارد المفيدة:
- [دليل المطور](docs/2_developer_guide/)
- [مرجع API](docs/3_api/)
- [أمثلة الكود](examples/)

## 🏆 الاعتراف بالمساهمين

نقدر جميع المساهمات ونعترف بالمساهمين في:
- ملف CONTRIBUTORS.md
- صفحة About في التطبيق
- Release Notes

---

**شكراً لك على مساهمتك في جعل G-Assistant أفضل! 🚀**