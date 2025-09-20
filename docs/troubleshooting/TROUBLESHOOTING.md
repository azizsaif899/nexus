# 🔧 دليل حل المشاكل - AzizSys AI Assistant

## 🚨 المشاكل الشائعة وحلولها

### 1. مشاكل التثبيت

#### ❌ "Module not found" أو "Cannot resolve dependency"
```bash
# الحل: نظف وأعد التثبيت
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### ❌ "PNPM command not found"
```bash
# ثبت PNPM عالمياً
npm install -g pnpm

# أو استخدم npx
npx pnpm install
```

#### ❌ "Node version not supported"
```bash
# تحقق من الإصدار (يجب أن يكون 18+)
node --version

# ثبت Node.js 18+ من nodejs.org
```

### 2. مشاكل البيئة والتكوين

#### ❌ "Firebase connection failed"
```bash
# تحقق من المتغيرات في .env
FIREBASE_API_KEY=your_actual_key
FIREBASE_PROJECT_ID=your_actual_project_id

# اختبر الاتصال
pnpm run test:firebase
```

#### ❌ "Gemini API error" أو "401 Unauthorized"
```bash
# تحقق من مفتاح Gemini
GEMINI_API_KEY=your_actual_gemini_key

# اختبر الاتصال
pnpm run test:gemini
```

#### ❌ "Environment file not found"
```bash
# انسخ ملف البيئة
cp .env.example .env

# تأكد من وجود الملف
ls -la .env
```

### 3. مشاكل التشغيل

#### ❌ "Port already in use" (EADDRINUSE)
```bash
# غير المنفذ في .env
PORT=3001

# أو أوقف العملية المستخدمة للمنفذ
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

#### ❌ "Build failed" أو "Compilation error"
```bash
# نظف cache NX
pnpm exec nx reset

# أعد البناء
pnpm build

# إذا استمرت المشكلة
rm -rf dist
pnpm build
```

#### ❌ "Database connection error"
```bash
# للتطوير، استخدم mock database
export NODE_ENV=test

# أو تأكد من تشغيل قاعدة البيانات
# PostgreSQL: pg_ctl start
# Redis: redis-server
```

### 4. مشاكل الاختبارات

#### ❌ "Tests failing" أو "Test timeout"
```bash
# شغل اختبار واحد للتشخيص
pnpm run test:quick

# زد timeout للاختبارات البطيئة
export VITEST_TIMEOUT=30000

# شغل الاختبارات مع تفاصيل أكثر
pnpm test --reporter=verbose
```

#### ❌ "Missing script: db:migrate:test"
```bash
# هذا تم إصلاحه، لكن إذا ظهر مرة أخرى:
pnpm run db:migrate:test
```

### 5. مشاكل الأداء

#### ❌ "Slow startup" أو "High memory usage"
```bash
# زد memory limit لـ Node.js
export NODE_OPTIONS="--max-old-space-size=4096"

# شغل تطبيق واحد فقط للتطوير
pnpm dev:web-chatbot
# بدلاً من pnpm dev (كل التطبيقات)
```

#### ❌ "Hot reload not working"
```bash
# أعد تشغيل dev server
Ctrl+C
pnpm dev:web-chatbot

# تأكد من عدم وجود cache مشاكل
pnpm exec nx reset
```

### 6. مشاكل النشر

#### ❌ "Docker build failed"
```bash
# تأكد من وجود Dockerfile
ls Dockerfile

# بناء مع تفاصيل أكثر
docker build --no-cache -t azizsys-ai .
```

#### ❌ "Environment variables not loaded in production"
```bash
# تأكد من وجود .env في production
# أو استخدم متغيرات النظام
export FIREBASE_API_KEY=your_key
export GEMINI_API_KEY=your_key
```

## 🔍 أدوات التشخيص

### فحص النظام
```bash
# فحص شامل للنظام
pnpm run system:health

# فحص متغيرات البيئة
pnpm run check:env

# فحص الاتصالات
pnpm run test:connections
```

### سجلات مفيدة
```bash
# سجلات التطبيق
tail -f logs/app.log

# سجلات الأخطاء
tail -f logs/error.log

# سجلات NX
cat .nx/workspace-data/daemon.log
```

## 📞 طلب المساعدة

### قبل طلب المساعدة، اجمع هذه المعلومات:

1. **معلومات النظام:**
```bash
node --version
pnpm --version
npm --version
```

2. **رسالة الخطأ الكاملة:**
```bash
# انسخ الخطأ كاملاً من Terminal
```

3. **خطوات إعادة إنتاج المشكلة:**
```bash
# اكتب الخطوات بالتفصيل
```

### قنوات الدعم:
- [🐛 GitHub Issues](https://github.com/yourusername/azizsys-ai-assistant/issues)
- [💬 Discussions](https://github.com/yourusername/azizsys-ai-assistant/discussions)
- [📧 البريد الإلكتروني](mailto:support@azizsys.com)

## 🛠️ إعادة تعيين كاملة

إذا فشل كل شيء، جرب إعادة التعيين الكاملة:

```bash
# 1. احفظ تغييراتك
git add .
git commit -m "Save work before reset"

# 2. نظف كل شيء
rm -rf node_modules
rm -rf dist
rm -rf .nx
rm pnpm-lock.yaml

# 3. أعد التثبيت
pnpm install

# 4. أعد البناء
pnpm build

# 5. اختبر
pnpm run test:quick
```

---

**💡 نصيحة:** احتفظ بهذا الدليل مرجعياً، معظم المشاكل لها حلول بسيطة!