# 📚 توثيق نظام CRM

## 🎯 نظرة عامة
نظام إدارة علاقات العملاء (CRM) المتكامل مع الأتمتة المرئية والذكاء الاصطناعي.

## 📁 هيكل المشروع

### التطبيقات (Apps)
- `apps/CRM/` - تطبيق CRM مستقل
- `apps/admin-dashboard/src/components/CRM/` - مكونات CRM في لوحة الإدارة
- `apps/admin-dashboard/src/pages/CRM/` - صفحات CRM في لوحة الإدارة

### الحزم (Packages)
- `packages/ui/crm-ui/` - مكونات واجهة المستخدم
- `packages/domain/crm/` - منطق الأعمال والبيانات

## 🚀 الميزات الرئيسية

### 1. الأتمتة المرئية
- محرر سحب وإفلات للمشغلات والإجراءات
- قوالب جاهزة للأتمتة الشائعة
- تكامل مع الخدمات الخارجية

### 2. إدارة العملاء
- ملفات شخصية شاملة للعملاء
- تتبع تاريخ التفاعلات
- تقييم العملاء المحتملين

### 3. إدارة الحملات
- إنشاء وإدارة الحملات التسويقية
- تتبع الأداء والنتائج
- تحليلات متقدمة

### 4. التكاملات
- Meta Ads API
- WhatsApp Business API
- Google Sheets
- Odoo ERP
- Slack

## 📖 أدلة الاستخدام

### للمطورين
- [دليل التطوير](./developer-guide.md)
- [معايير الكود](./coding-standards.md)
- [API Reference](./api-reference.md)

### للمستخدمين
- [دليل المستخدم](./user-guide.md)
- [دليل الأتمتة](./automation-guide.md)
- [الأسئلة الشائعة](./faq.md)

## 🔧 التثبيت والإعداد

```bash
# تثبيت التبعيات
pnpm install

# تشغيل التطبيق
pnpm dev:crm

# بناء للإنتاج
pnpm build:crm
```

## 🎨 التصميم والواجهة

### Material-UI مع RTL
- دعم كامل للغة العربية
- تصميم متجاوب
- وضع داكن/فاتح

### الألوان والخطوط
- خطوط عربية: Cairo, Tajawal, Amiri
- نظام ألوان متناسق
- أيقونات Material Design

## 🔗 الروابط المفيدة

- [GitHub Repository](https://github.com/azizsaif899/g-assistant.git)
- [Live Demo](#)
- [API Documentation](#)
- [Support](#)