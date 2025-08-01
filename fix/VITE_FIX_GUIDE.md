# 🔧 دليل إصلاح مشاكل Vite - Gemini Research System

## ❌ المشكلة الشائعة

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vitejs/plugin-react-swc'
```

## ✅ الحل السريع

### 1. إعادة تثبيت التبعيات
```bash
cd gemini_research_system/frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 2. تثبيت Plugin العادي
```bash
npm install @vitejs/plugin-react --save-dev
```

### 3. تحديث vite.config.ts
```typescript
// تغيير هذا السطر:
import react from "@vitejs/plugin-react-swc";

// إلى:
import react from "@vitejs/plugin-react";
```

### 4. مسح Vite Cache
```bash
rmdir /s /q node_modules\.vite-temp
```

### 5. اختبار التشغيل
```bash
npm run dev
```

## 🎯 النتيجة المتوقعة

```
> frontend@0.0.0 dev
> vite

  VITE v6.3.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/app/
  ➜  Network: use --host to expose
```

## 🔄 إصلاح شامل للنظام

### تشغيل النظام الكامل بعد الإصلاح:

```bash
# 1. الخدمة الخارجية
cd external_service
node enhanced_server.js

# 2. Gemini Research System (في terminal جديد)
cd gemini_research_system
.\start.bat

# 3. في Google Sheets
createEnhancedSidebar()
```

## ✅ التحقق من التكامل

- ✅ External Service: http://localhost:3002
- ✅ Backend: http://localhost:2024  
- ✅ Frontend: http://localhost:5173/app/
- ✅ Google Sheets: السايدبار المحسن

---

**تم إصلاح المشكلة بنجاح!** 🎉