# 📚 دليل السكريبتات الكامل - CRM Nxs

> دليل مفصّل لجميع السكريبتات ومتى تستخدمها

---

## 🎯 الفهرس السريع

| الفئة | السكريبتات | الاستخدام الشائع |
|------|------------|------------------|
| **التطوير** | start-dev, clean, quick-fix | يومياً |
| **البناء** | build, preview | قبل النشر |
| **الاختبار** | test, check | قبل الـ commit |
| **الصيانة** | update-deps, info | شهرياً |

---

## 📖 السكريبتات بالتفصيل

### 1. 🚀 start-dev - تشغيل بيئة التطوير

**متى تستخدمه:**
- بداية يوم العمل
- بعد تحديث التبعيات
- بعد clone المشروع

**ما يفعله:**
1. يقتل العمليات على المنفذ 5173
2. ينظف الكاش (.vite, .nx/cache)
3. يتحقق من التبعيات ويثبتها
4. يشغل Nx dev server
5. يفتح المتصفح تلقائياً

**الاستخدام:**
```bash
# Windows
.\scripts\start-dev.ps1

# macOS/Linux
./scripts/start-dev.sh
```

**نصيحة:** استخدمه دائماً بدلاً من `npm run dev` لضمان بيئة نظيفة

---

### 2. 🧹 clean - تنظيف عميق

**متى تستخدمه:**
- عند مشاكل غريبة في البناء
- قبل إعادة تثبيت التبعيات
- عند تغيير major في التبعيات

**ما يفعله:**
- يحذف node_modules بالكامل
- يحذف جميع ملفات الكاش
- يحذف lock files
- ينظف npm cache

**الاستخدام:**
```bash
# Windows
.\scripts\clean.ps1

# macOS/Linux
./scripts/clean.sh
```

**تحذير:** سيحتاج لإعادة تثبيت كاملة بعده

---

### 3. 🔧 quick-fix - حل سريع للمشاكل

**متى تستخدمه:**
- خطأ "Port already in use"
- المشروع لا يعمل فجأة
- بعد reboot أو تحديث النظام

**ما يفعله:**
1. يحرر المنافذ المستخدمة (5173, 3000, 4200)
2. ينظف Nx cache
3. ينظف node_modules cache
4. يعيد بناء package-lock.json
5. ينظف npm cache

**الاستخدام:**
```bash
# Windows
.\scripts\quick-fix.ps1

# macOS/Linux
./scripts/quick-fix.sh
```

**نصيحة:** أول شيء تجربه عند أي مشكلة

---

### 4. 📦 build - بناء للإنتاج

**متى تستخدمه:**
- قبل النشر
- لاختبار البناء الإنتاجي
- قبل إنشاء Docker image

**ما يفعله:**
1. ينظف المجلد dist القديم
2. يبني التطبيق بـ production mode
3. ينتج ملفات محسّنة ومضغوطة
4. يعرض حجم الملفات

**الاستخدام:**
```bash
# Windows
.\scripts\build.ps1

# macOS/Linux
./scripts/build.sh
```

**الناتج:** `dist/apps/CRM/`

---

### 5. 👁️ preview - معاينة البناء (جديد)

**متى تستخدمه:**
- بعد البناء مباشرة
- لاختبار البناء الإنتاجي محلياً
- قبل النشر الفعلي

**ما يفعله:**
1. يتحقق من وجود dist/apps/CRM
2. يشغل preview server على 4173
3. يفتح المتصفح
4. يحاكي بيئة الإنتاج

**الاستخدام:**
```bash
# Windows
.\scripts\build.ps1
.\scripts\preview.ps1

# macOS/Linux
./scripts/build.sh
./scripts/preview.sh
```

**فائدة:** اكتشاف مشاكل الإنتاج قبل النشر

---

### 6. 🧪 test - الاختبارات

**متى تستخدمه:**
- قبل كل commit
- بعد إضافة ميزة جديدة
- قبل merge إلى main

**ما يفعله:**
1. TypeScript type check
2. ESLint check
3. Unit tests (إن وجدت)

**الاستخدام:**
```bash
# Windows
.\scripts\test.ps1

# macOS/Linux
./scripts/test.sh
```

**CI/CD:** يمكن تشغيله في GitHub Actions

---

### 7. 🔍 check - فحص شامل (جديد)

**متى تستخدمه:**
- قبل الـ commit المهم
- قبل النشر
- بعد تحديث التبعيات
- عند الشك في استقرار المشروع

**ما يفعله:**
1. ✅ يفحص التبعيات
2. ✅ TypeScript check
3. ✅ ESLint check
4. ✅ Test build
5. ✅ File structure check

**الاستخدام:**
```bash
# Windows
.\scripts\check.ps1

# macOS/Linux
./scripts/check.sh
```

**Exit Code:** 
- `0` = كل شيء OK
- `>0` = عدد الأخطاء

---

### 8. 📦 update-deps - تحديث التبعيات (جديد)

**متى تستخدمه:**
- مرة شهرياً
- عند الحاجة لميزة جديدة في حزمة
- بعد security alert

**ما يفعله:**
1. ✅ ينشئ backup تلقائي
2. ✅ يعرض الحزم القديمة
3. ✅ يطلب تأكيد
4. ✅ يحدث بأمان
5. ✅ يستعيد عند الفشل

**الاستخدام:**
```bash
# Windows
.\scripts\update-deps.ps1

# macOS/Linux
./scripts/update-deps.sh
```

**أمان:** Backup تلقائي + Rollback عند الفشل

---

### 9. 📊 info - معلومات المشروع

**متى تستخدمه:**
- عند بداية العمل على مشروع جديد
- لمشاركة معلومات المشروع
- لتوثيق البيئة

**ما يفعله:**
- يعرض معلومات النظام
- إحصائيات الملفات
- معلومات Git
- التبعيات الرئيسية

**الاستخدام:**
```bash
# Windows
.\scripts\info.ps1

# macOS/Linux
./scripts/info.sh
```

---

## 🎬 السيناريوهات الشائعة

### سيناريو 1: بداية يوم عمل عادي

```bash
# 1. تشغيل المشروع
.\scripts\start-dev.ps1

# 2. تطوير...

# 3. قبل الـ commit
.\scripts\test.ps1

# 4. commit & push
git add .
git commit -m "feat: add new feature"
git push
```

---

### سيناريو 2: المشروع لا يعمل فجأة

```bash
# 1. جرب الحل السريع
.\scripts\quick-fix.ps1

# 2. إذا لم ينجح، تنظيف عميق
.\scripts\clean.ps1
npm install

# 3. شغّل من جديد
.\scripts\start-dev.ps1
```

---

### سيناريو 3: الاستعداد للنشر

```bash
# 1. فحص شامل
.\scripts\check.ps1

# 2. بناء
.\scripts\build.ps1

# 3. معاينة
.\scripts\preview.ps1

# 4. إذا كل شيء OK، deploy
# (deploy commands here)
```

---

### سيناريو 4: تحديث شهري

```bash
# 1. فحص الحالة الحالية
.\scripts\check.ps1

# 2. تحديث التبعيات
.\scripts\update-deps.ps1

# 3. فحص بعد التحديث
.\scripts\check.ps1

# 4. اختبار
.\scripts\test.ps1

# 5. إذا كل شيء OK، commit
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

---

## 🚨 حل المشاكل الشائعة

### المشكلة: "Cannot find module"

**الحل:**
```bash
.\scripts\clean.ps1
npm install
.\scripts\start-dev.ps1
```

---

### المشكلة: "Port 5173 already in use"

**الحل:**
```bash
.\scripts\quick-fix.ps1
# ثم
.\scripts\start-dev.ps1
```

---

### المشكلة: "TypeScript errors"

**الحل:**
```bash
# 1. فحص
.\scripts\check.ps1

# 2. إصلاح الأخطاء يدوياً

# 3. تأكد
tsc --noEmit
```

---

### المشكلة: "Build fails"

**الحل:**
```bash
# 1. تنظيف
.\scripts\clean.ps1

# 2. إعادة تثبيت
npm install

# 3. فحص
.\scripts\check.ps1

# 4. محاولة البناء
.\scripts\build.ps1
```

---

## 💡 نصائح احترافية

### 1. استخدم Aliases

**Windows (PowerShell Profile):**
```powershell
# افتح
notepad $PROFILE

# أضف
Set-Alias dev "C:\nexus\scripts\start-dev.ps1"
Set-Alias check "C:\nexus\scripts\check.ps1"
Set-Alias fix "C:\nexus\scripts\quick-fix.ps1"

# الآن يمكنك كتابة:
dev
check
fix
```

**macOS/Linux (.bashrc or .zshrc):**
```bash
alias dev='cd /path/to/nexus && ./scripts/start-dev.sh'
alias check='cd /path/to/nexus && ./scripts/check.sh'
alias fix='cd /path/to/nexus && ./scripts/quick-fix.sh'
```

---

### 2. أتمتة pre-commit

أنشئ `.git/hooks/pre-commit`:
```bash
#!/bin/bash
./scripts/check.sh
if [ $? -ne 0 ]; then
    echo "❌ Pre-commit check failed!"
    exit 1
fi
```

---

### 3. CI/CD Integration

**GitHub Actions example:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: ./scripts/check.sh
```

---

## 📅 جدول الصيانة المقترح

| التردد | المهمة | السكريبت |
|--------|--------|----------|
| يومياً | تشغيل المشروع | `start-dev` |
| عند كل commit | فحص واختبار | `test` أو `check` |
| أسبوعياً | فحص شامل | `check` |
| شهرياً | تحديث التبعيات | `update-deps` |
| عند النشر | بناء ومعاينة | `build` + `preview` |

---

## 🎓 الخلاصة

**السكريبتات الأساسية (استخدمها دائماً):**
- ✅ `start-dev` - للتشغيل
- ✅ `quick-fix` - لحل المشاكل
- ✅ `check` - قبل الـ commit

**السكريبتات المتقدمة (حسب الحاجة):**
- 📦 `build` + `preview` - قبل النشر
- 🧪 `test` - للاختبارات المفصلة
- 🔧 `update-deps` - للتحديثات
- 🧹 `clean` - للتنظيف العميق
- 📊 `info` - للمعلومات

**القاعدة الذهبية:**
> عند الشك، شغّل `check.ps1` أولاً!

---

**Happy Coding! 🚀**
