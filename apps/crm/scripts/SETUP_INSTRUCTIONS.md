# 🚀 إعداد السكريبتات - Setup Instructions

> **خطوات سريعة للبدء**

---

## ✅ الخطوة 1: تحديث المسارات

### **Windows (PowerShell):**

```powershell
# 1. افتح ملف التكوين
notepad scripts\config.example.ps1

# 2. حدّث السطر التالي بمسارك الحقيقي:
$WORKSPACE_ROOT = "C:\your\actual\path\to\project"  # ← غيّر هذا

# 3. احفظ الملف

# 4. اختبر
.\scripts\diagnose.ps1
```

### **macOS/Linux (Bash):**

```bash
# 1. افتح ملف التكوين
nano scripts/config.example.sh

# 2. حدّث السطر التالي بمسارك الحقيقي:
export WORKSPACE_ROOT="/your/actual/path/to/project"  # ← غيّر هذا

# 3. احفظ (Ctrl+O ثم Enter ثم Ctrl+X)

# 4. منح صلاحيات
chmod +x scripts/*.sh

# 5. اختبر
./scripts/diagnose.sh
```

---

## ⚙️ الخطوة 2: تشغيل التشخيص

```bash
# Windows
.\scripts\diagnose.ps1

# macOS/Linux
./scripts/diagnose.sh
```

**سيفحص:**
- ✅ Node.js و npm
- ✅ بنية المشروع
- ✅ التبعيات
- ✅ الإعدادات
- ✅ المنافذ
- ✅ الكاش
- ✅ الأمان

---

## 🚀 الخطوة 3: التشغيل

```bash
# Windows
.\scripts\start-dev.ps1

# macOS/Linux
./scripts/start-dev.sh
```

---

## 🎯 ملاحظات مهمة:

### **إذا كنت تستخدم Standalone Vite Project:**
- المسار = مجلد المشروع مباشرة
- مثال: `C:\projects\crm-nxs`

### **إذا كنت تستخدم Nx Workspace:**
- المسار = المجلد الرئيسي للـ workspace
- مثال: `C:\nexus` (وليس `C:\nexus\apps\CRM`)

### **المنافذ:**
- Dev: 5173 (افتراضي)
- Preview: 4173 (افتراضي)

---

## ❓ استكشاف الأخطاء:

### "لا يمكن العثور على المشروع"
```bash
# تأكد من المسار الصحيح
# Windows
cd C:\your\project\path
pwd

# macOS/Linux
cd /your/project/path
pwd
```

### "Permission denied"
```bash
# macOS/Linux فقط
chmod +x scripts/*.sh
```

### "Port already in use"
```bash
.\scripts\quick-fix.ps1
```

---

**Happy Coding! 🚀**
