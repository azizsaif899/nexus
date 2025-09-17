# 🎨 دليل مصمم الواجهات - AzizSys AI Assistant

## 🚀 البدء السريع

### 1. التثبيت:
```bash
npm install
```

### 2. التشغيل:
```bash
# لوحة التحكم
npm run dev:admin

# واجهة الدردشة  
npm run dev:chatbot

# نظام CRM
npm run dev:crm
```

## 🎯 التطبيقات الرئيسية

### 📊 Admin Dashboard
- **المسار**: `apps/admin-dashboard/`
- **الوصف**: لوحة تحكم شاملة للإدارة
- **التقنيات**: React + TypeScript + Tailwind CSS

### 💬 Web Chatbot
- **المسار**: `apps/web-chatbot/`
- **الوصف**: واجهة دردشة مع المساعد الذكي
- **التقنيات**: React + TypeScript + Socket.io

### 🏢 CRM System
- **المسار**: `apps/crm-system/`
- **الوصف**: نظام إدارة علاقات العملاء
- **التقنيات**: React + Firebase + GraphQL

## 🧩 المكونات المشتركة

### 🎨 UI Components
- **المسار**: `packages/ui-components/`
- **المحتوى**: مكونات قابلة لإعادة الاستخدام
- **أمثلة**: Button, Card, Modal, Form

### 🎭 Design System
- **المسار**: `packages/design-system/`
- **المحتوى**: الألوان، الخطوط، المسافات
- **ملف التكوين**: `tailwind.config.js`

## 📐 مواصفات التصميم

### 🎨 الألوان الأساسية:
```css
:root {
  --primary: #3B82F6;      /* أزرق */
  --secondary: #10B981;    /* أخضر */
  --accent: #F59E0B;       /* برتقالي */
  --neutral: #6B7280;      /* رمادي */
  --error: #EF4444;        /* أحمر */
  --success: #10B981;      /* أخضر */
}
```

### 📱 نقاط الكسر:
```css
/* Mobile First */
sm: 640px
md: 768px  
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 🔧 أدوات التطوير

### المتاحة:
- **Storybook** - عرض المكونات
- **Tailwind CSS** - تصميم سريع
- **TypeScript** - أمان الأنواع
- **ESLint** - جودة الكود

### السكريبتات المفيدة:
```bash
npm run storybook    # عرض المكونات
npm run build        # بناء الإنتاج
npm run test         # تشغيل الاختبارات
npm run lint         # فحص الكود
```

## 📋 قائمة المهام للمصمم

### ✅ المطلوب:
- [ ] مراجعة التصميم الحالي
- [ ] تحديث نظام الألوان
- [ ] تصميم مكونات جديدة
- [ ] تحسين تجربة المستخدم
- [ ] إنشاء دليل الاستخدام

### 🎯 الأولويات:
1. **لوحة التحكم** - الأهم
2. **واجهة الدردشة** - متوسط
3. **نظام CRM** - أقل أولوية

## 📞 التواصل

للأسئلة أو المساعدة، تواصل مع فريق التطوير.

---
**نسخة الحزمة**: v1.0  
**تاريخ الإنشاء**: ${new Date().toLocaleDateString('ar-SA')}  
**الحالة**: جاهز للتصميم 🎨