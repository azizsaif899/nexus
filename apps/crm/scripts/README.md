# 📜 CRM Nxs - Development Scripts

> **مهم**: مشروع CRM Nxs هو جزء من **Nx Monorepo Workspace**

سكريبتات احترافية لتشغيل وصيانة مشروع CRM Nxs بشكل سلس وسهل.

## ⚠️ تنبيه مهم قبل البدء

**المشروع في Nx Workspace** - يجب تشغيل السكريبتات من المجلد الرئيسي `C:\nexus` وليس من `C:\nexus\apps\CRM`

**قبل أي شيء، اقرأ**: `/scripts/INSTALL.md` للحصول على دليل كامل للتثبيت.

---

## ⚡ البدء السريع

```bash
# 1. حدّث المسار في config.example.ps1 أو config.example.sh
# 2. شغّل:

# Windows
.\scripts\diagnose.ps1  # فحص
.\scripts\start-dev.ps1 # تشغيل

# macOS/Linux
chmod +x scripts/*.sh
./scripts/diagnose.sh   # فحص
./scripts/start-dev.sh  # تشغيل
```

**راجع:** [`SETUP_INSTRUCTIONS.md`](SETUP_INSTRUCTIONS.md) للتفاصيل

---

## 📋 المحتويات

1. [Windows (PowerShell)](#windows-powershell)
2. [macOS / Linux (Bash)](#macos--linux-bash)
3. [جميع السكريبتات المتوفرة](#جميع-السكريبتات-المتوفرة)
4. [الميزات](#الميزات)
5. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🪟 Windows (PowerShell)

### التشغيل السريع

```powershell
# طريقة 1: من مجلد المشروع
.\scripts\start-dev.ps1

# طريقة 2: من أي مكان (بعد تعيين المسار)
pwsh -File "C:\path\to\nexus\apps\CRM\scripts\start-dev.ps1"
```

### الإعداد الأولي

1. **فتح PowerShell كمسؤول** (Administrator)
2. **السماح بتنفيذ السكريبتات:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. **تحديث مسار Workspace في السكريبت:**
   - افتح ملف `start-dev.ps1`
   - عدّل السطر:
     ```powershell
     $WORKSPACE_ROOT = "C:\nexus"  # ← Workspace root (ليس apps\CRM)
     ```
   - **مهم**: استخدم المجلد الرئيسي للـ workspace، وليس مجلد التطبيق

### استخدام متقدم

```powershell
# تشغيل مع إعادة تثبيت كاملة
Remove-Item -Recurse -Force node_modules
.\scripts\start-dev.ps1

# تشغيل مع عرض التفاصيل
.\scripts\start-dev.ps1 -Verbose
```

---

## 🍎 macOS / Linux (Bash)

### التشغيل السريع

```bash
# طريقة 1: من مجلد المشروع
./scripts/start-dev.sh

# طريقة 2: من أي مكان (بعد تعيين المسار)
bash /path/to/nexus/apps/CRM/scripts/start-dev.sh
```

### الإعداد الأولي

1. **منح صلاحيات التنفيذ:**
   ```bash
   chmod +x scripts/start-dev.sh
   ```

2. **تحديث مسار Workspace في السكريبت:**
   - افتح ملف `start-dev.sh`
   - عدّل السطر:
     ```bash
     WORKSPACE_ROOT="/path/to/nexus"  # ← Workspace root (ليس apps/CRM)
     ```
   - **مهم**: استخدم المجلد الرئيسي للـ workspace، وليس مجلد التطبيق

### استخدام متقدم

```bash
# تشغيل مع إعادة تثبيت كاملة
rm -rf node_modules
./scripts/start-dev.sh

# تشغيل في الخلفية
nohup ./scripts/start-dev.sh > dev.log 2>&1 &

# عرض اللوج المباشر
tail -f dev.log
```

---

## 📜 جميع السكريبتات المتوفرة

### 🚀 التطوير

| السكريبت | الوصف | الاستخدام |
|----------|-------|-----------|
| `start-dev.ps1` / `.sh` | تشغيل بيئة التطوير كاملة | `.\scripts\start-dev.ps1` |
| `clean.ps1` / `.sh` | تنظيف عميق للكاش والملفات المؤقتة | `.\scripts\clean.ps1` |
| `quick-fix.ps1` / `.sh` | حل سريع للمشاكل الشائعة | `.\scripts\quick-fix.ps1` |

### 📦 البناء والاختبار

| السكريبت | الوصف | الاستخدام |
|----------|-------|-----------|
| `build.ps1` / `.sh` | بناء التطبيق للإنتاج | `.\scripts\build.ps1` |
| `preview.ps1` / `.sh` | **معاينة البناء الإنتاجي** | `.\scripts\preview.ps1` |
| `test.ps1` / `.sh` | تشغيل الاختبارات والـ linting | `.\scripts\test.ps1` |
| `check.ps1` / `.sh` | **فحص شامل للمشروع** | `.\scripts\check.ps1` |

### 🔧 الصيانة

| السكريبت | الوصف | الاستخدام |
|----------|-------|-----------|
| `update-deps.ps1` / `.sh` | **تحديث التبعيات بأمان** | `.\scripts\update-deps.ps1` |
| `diagnose.ps1` / `.sh` | **تشخيص شامل للمشروع** | `.\scripts\diagnose.ps1` |

### 📊 المعلومات

| السكريبت | الوصف | الاستخدام |
|----------|-------|-----------|
| `info.ps1` / `.sh` | عرض معلومات المشروع | `.\scripts\info.ps1` |

### 📚 التوثيق

| الملف | الوصف |
|-------|-------|
| `README.md` | دليل السكريبتات الكامل |
| `INSTALL.md` | دليل التثبيت والتشغيل |
| `SCRIPTS_GUIDE.md` | **دليل مفصّل لكل سكريبت** |

---

## ✨ الميزات

### 1️⃣ تنظيف تلقائي للمنافذ
- يكتشف ويقتل أي عملية على المنفذ 5173
- يضمن عدم حدوث تعارض عند التشغيل

### 2️⃣ تنظيف الكاش
يحذف تلقائياً:
- `node_modules/.cache`
- `node_modules/.vite`
- `.vite`
- `dist`

### 3️⃣ إدارة التبعيات
- يفحص وجود `node_modules`
- يثبت التبعيات إذا لم تكن موجودة
- يحدث التبعيات إذا كانت قديمة

### 4️⃣ فحص الأخطاء الشائعة
- يتحقق من وجود `package.json`
- يتحقق من وجود `vite.config.ts`
- يعرض إصدارات Node.js و npm

### 5️⃣ فتح المتصفح تلقائياً
- يفتح `http://localhost:5173` تلقائياً
- يعمل على جميع أنظمة التشغيل

### 6️⃣ تحليل الأخطاء
يكتشف ويقدم حلول للأخطاء الشائعة:
- `EADDRINUSE` - المنفذ مستخدم
- `MODULE_NOT_FOUND` - تبعيات ناقصة
- `EACCES` - مشاكل صلاحيات
- وأكثر...

---

## 🔧 استكشاف الأخطاء

### المشكلة: "لا يمكن تنفيذ السكريبت" (Windows)

**الحل:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### المشكلة: "Permission denied" (macOS/Linux)

**الحل:**
```bash
chmod +x scripts/start-dev.sh
```

---

### المشكلة: المنفذ ما زال مستخدماً

**الحل اليدوي:**

**Windows:**
```powershell
# ابحث عن العملية
netstat -ano | findstr :5173

# اقتل العملية (استبدل PID برقم العملية)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# ابحث عن العملية
lsof -ti:5173

# اقتل العملية
kill -9 $(lsof -ti:5173)
```

---

### المشكلة: خطأ في تثبيت التبعيات

**الحل:**
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install

# أو استخدم npm cache clean
npm cache clean --force
npm install
```

---

### المشكلة: "Cannot find module" بعد التثبيت

**الحل:**
```bash
# تأكد من تثبيت جميع التبعيات
npm install

# تحقق من package.json
cat package.json

# أعد بناء المشروع
npm run build
```

---

## 🎯 نصائح احترافية

### 1. استخدم alias للتشغيل السريع

**Windows (PowerShell Profile):**
```powershell
# افتح profile
notepad $PROFILE

# أضف:
function Start-CRM {
    Set-Location "C:\path\to\nexus\apps\CRM"
    .\scripts\start-dev.ps1
}
Set-Alias crm Start-CRM
```

**macOS/Linux (.bashrc أو .zshrc):**
```bash
# أضف في نهاية الملف:
alias crm='cd /path/to/nexus/apps/CRM && ./scripts/start-dev.sh'
```

الآن يمكنك تشغيل المشروع بكتابة:
```bash
crm
```

---

### 2. تشغيل متعدد للمشاريع

إذا كان لديك عدة مشاريع:

**Windows:**
```powershell
# المشروع 1
Start-Process pwsh -ArgumentList "-File .\project1\scripts\start-dev.ps1"

# المشروع 2
Start-Process pwsh -ArgumentList "-File .\project2\scripts\start-dev.ps1"
```

**macOS/Linux:**
```bash
# المشروع 1
./project1/scripts/start-dev.sh &

# المشروع 2
./project2/scripts/start-dev.sh &
```

---

### 3. مراقبة الأداء أثناء التطوير

```bash
# افتح terminal ثاني وراقب الذاكرة
while true; do
  clear
  echo "=== CRM Nxs Performance Monitor ==="
  ps aux | grep node | grep -v grep
  sleep 2
done
```

---

## 📝 سجل التغييرات

### v1.0 (Current)
- ✅ إصدار أولي مع جميع الميزات الأساسية
- ✅ دعم Windows (PowerShell)
- ✅ دعم macOS/Linux (Bash)
- ✅ تنظيف تلقائي للمنافذ
- ✅ إدارة التبعيات
- ✅ تحليل الأخطاء

---

## 🤝 المساهمة

إذا وجدت مشكلة أو لديك اقتراح لتحسين السكريبتات:
1. افتح issue في المشروع
2. اقترح تحسينات
3. شارك تجربتك

---

## 📄 الترخيص

هذه السكريبتات جزء من مشروع CRM Nxs.

---

## 🔥 دليل السكريبتات المفصل

### 1. سكريبت البناء للإنتاج

**Windows:**
```powershell
.\scripts\build.ps1
```

**macOS/Linux:**
```bash
./scripts/build.sh
```

**ما يفعله:**
- ينظف المجلدات القديمة
- يبني التطبيق للإنتاج
- يُنتج ملفات محسّنة في `dist/apps/CRM`

---

### 2. سكريبت المعاينة (جديد)

**Windows:**
```powershell
.\scripts\preview.ps1
```

**macOS/Linux:**
```bash
./scripts/preview.sh
```

**ما يفعله:**
- يتحقق من وجود البناء الإنتاجي
- يشغل preview server على المنفذ 4173
- يفتح المتصفح تلقائياً
- يسمح باختبار البناء قبل النشر

---

### 3. سكريبت الفحص الشامل (جديد)

**Windows:**
```powershell
.\scripts\check.ps1
```

**macOS/Linux:**
```bash
./scripts/check.sh
```

**ما يفعله:**
- يفحص وجود التبعيات
- يفحص TypeScript types
- يشغل ESLint
- يختبر البناء
- يتحقق من بنية الملفات

**استخدمه قبل**: الـ commit، الـ deploy، أو عند الشك

---

### 4. سكريبت الاختبار

**Windows:**
```powershell
.\scripts\test.ps1
```

**macOS/Linux:**
```bash
./scripts/test.sh
```

**ما يفعله:**
- يفحص TypeScript
- يشغّل ESLint
- يشغّل الاختبارات

---

### 5. سكريبت تحديث التبعيات (جديد)

**Windows:**
```powershell
.\scripts\update-deps.ps1
```

**macOS/Linux:**
```bash
./scripts/update-deps.sh
```

**ما يفعله:**
- ينشئ backup تلقائي
- يعرض الحزم القديمة
- يطلب تأكيد قبل التحديث
- يحدث الحزم بأمان
- يستعيد الـ backup عند الفشل

**استخدمه**: مرة شهرياً أو عند الحاجة لتحديث

---

### 6. سكريبت الحل السريع

**Windows:**
```powershell
.\scripts\quick-fix.ps1
```

**macOS/Linux:**
```bash
./scripts/quick-fix.sh
```

**ما يفعله:**
- يحرر المنافذ المستخدمة
- ينظف Nx cache
- يُعيد بناء package-lock
- ينظف npm cache

**استخدمه عندما**: تواجه مشاكل غريبة ولا تعرف السبب

---

### 7. سكريبت التشخيص الشامل (جديد)

**Windows:**
```powershell
.\scripts\diagnose.ps1
```

**macOS/Linux:**
```bash
./scripts/diagnose.sh
```

**ما يفعله:**
- يفحص بيئة التطوير (Node, npm, Nx)
- يتحقق من بنية المشروع
- يفحص التبعيات والإصدارات
- يتحقق من ملفات الإعدادات
- يفحص المنافذ المتاحة
- يحلل حجم الكاش
- يفحص Git status
- يشغل npm audit للأمان

**استخدمه**: 
- قبل بداية كل sprint
- بعد clone المشروع
- عند مواجهة مشاكل غريبة
- قبل النشر للإنتاج

---

### 8. سكريبت المعلومات

**Windows:**
```powershell
.\scripts\info.ps1
```

**macOS/Linux:**
```bash
./scripts/info.sh
```

**ما يفعله:**
- يعرض معلومات النظام
- يعرض إحصائيات المشروع
- يعرض معلومات Git
- يعرض السكريبتات المتاحة

---

## 📋 خريطة عمل السكريبتات (محدّثة)

```
🔄 دورة التطوير اليومية:
│
├─ بداية اليوم ← start-dev.ps1
├─ أثناء التطوير ← (تطوير عادي)
├─ قبل الـ commit ← check.ps1
└─ نهاية اليوم ← (Git commit & push)

🐛 عند وجود مشكلة:
│
├─ مشكلة بسيطة ← quick-fix.ps1
├─ تنظيف شامل ← clean.ps1
├─ تشخيص شامل ← diagnose.ps1 (جديد)
└─ فحص كامل ← check.ps1

📦 عند البناء والنشر:
│
├─ بناء إنتاجي ← build.ps1
├─ معاينة البناء ← preview.ps1
└─ نشر ← (deploy manually)

🔧 الصيانة الدورية:
│
├─ تحديث التبعيات ← update-deps.ps1 (شهرياً)
├─ فحص شامل ← check.ps1
└─ معلومات المشروع ← info.ps1

🧪 الاختبار:
│
├─ tests & lint ← test.ps1
└─ فحص types ← check.ps1
```

---

## 🎉 شكراً

تم تطوير هذه السكريبتات لجعل تجربة التطوير أكثر سلاسة واحترافية.

**الآن لديك مجموعة كاملة من الأدوات الاحترافية! 🚀**

---

## 📖 للمزيد من التفاصيل

راجع `/scripts/SCRIPTS_GUIDE.md` للحصول على:
- ✅ شرح مفصّل لكل سكريبت
- ✅ متى تستخدم كل سكريبت
- ✅ سيناريوهات واقعية
- ✅ حل المشاكل الشائعة
- ✅ نصائح احترافية
- ✅ جدول صيانة مقترح

**Happy Coding! 🚀**
