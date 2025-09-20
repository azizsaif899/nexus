# 🚀 دليل الإعداد للمطورين الجدد

## متطلبات النظام

### Node.js
```bash
# استخدم الإصدار المحدد في .nvmrc
nvm use 18.17.0
# أو قم بتثبيته
nvm install 18.17.0
```

### مدير الحزم
```bash
# تثبيت pnpm (مفضل)
npm install -g pnpm@latest
```

## الإعداد السريع

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd g-assistant-nx
```

### 2. إعداد متغيرات البيئة
```bash
# نسخ ملف المثال
cp .env.example .env

# تحرير الملف وإضافة القيم الحقيقية
# لا تشارك هذا الملف مع أحد!
```

### 3. تثبيت التبعيات
```bash
pnpm install
```

### 4. التحقق من الإعداد
```bash
pnpm run test:quick
```

## حل المشاكل الشائعة

### مشكلة المسارات
- استخدم المسارات النسبية دائماً
- تجنب المسارات المطلقة مثل `e:\azizsys5\`

### مشكلة الأذونات
```bash
# Linux/Mac
chmod +x scripts/*.sh

# Windows
# تشغيل PowerShell كمدير
Set-ExecutionPolicy RemoteSigned
```

### مشكلة Firebase
```bash
# تسجيل الدخول
firebase login
# تحديد المشروع
firebase use --add
```

## الأوامر المهمة

```bash
# تطوير
pnpm run dev

# اختبار
pnpm run test

# بناء
pnpm run build

# فحص الكود
pnpm run lint
```