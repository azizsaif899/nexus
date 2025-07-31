# 🚀 دليل التشغيل السريع

## 📋 المتطلبات
- Python 3.11+
- Node.js 18+
- مفتاح Gemini API

## ⚡ التشغيل السريع

### 1. إعداد مفتاح API
```bash
# عدل الملف backend/.env وأضف مفتاحك
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. تشغيل المشروع
```bash
# تشغيل تلقائي
start.bat

# أو تشغيل يدوي
cd backend && pip install . && langgraph dev
cd frontend && npm install && npm run dev
```

### 3. الاختبار
```bash
# اختبار CLI
test.bat

# اختبار الواجهة
# افتح http://localhost:3001/app
```

## 🌐 المنافذ
- **Backend**: http://127.0.0.1:2024
- **Frontend**: http://localhost:3001/app
- **LangGraph UI**: http://127.0.0.1:2024

## 🧪 اختبار سريع
اسأل: "What are the latest trends in renewable energy?"

## 🔧 استكشاف الأخطاء
- تأكد من مفتاح Gemini API
- تحقق من تثبيت Python 3.11+
- تأكد من تثبيت Node.js
- تحقق من المنافذ المتاحة