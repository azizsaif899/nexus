# 📜 CRM Nxs - Development Scripts

سكريبتات احترافية لتشغيل وصيانة مشروع CRM Nxs بشكل سلس وسهل.

---

## 📋 المحتويات

1. [Windows (PowerShell)](#windows-powershell)
2. [macOS / Linux (Bash)](#macos--linux-bash)
3. [الميزات](#الميزات)
4. [استكشاف الأخطاء](#استكشاف-الأخطاء)

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
3. **تحديث مسار المشروع في السكريبت:**
   - افتح ملف `start-dev.ps1`
   - عدّل السطر:
     ```powershell
     $PROJECT_DIR = "C:\path\to\nexus\apps\CRM"  # ضع مسارك الحقيقي هنا
     ```

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

2. **تحديث مسار المشروع في السكريبت:**
   - افتح ملف `start-dev.sh`
   - عدّل السطر:
     ```bash
     PROJECT_DIR="/path/to/nexus/apps/CRM"  # ضع مسارك الحقيقي هنا
     ```

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

## 🎉 شكراً

تم تطوير هذه السكريبتات لجعل تجربة التطوير أكثر سلاسة واحترافية.

**Happy Coding! 🚀**
