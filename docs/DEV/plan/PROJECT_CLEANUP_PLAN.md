# 🧹 خطة ترتيب المشروع

## 🗑️ ملفات للحذف (في الجذر)

### ملفات backup غير ضرورية:
- `DEEP_FIX.js.backup`
- `DEEP_SCAN.js.backup` 
- `package.json.backup`

### ملفات مؤقتة:
- `affected_files.txt`
- `DEEP_FIX.js` (إذا لم يعد مستخدم)
- `DEEP_SCAN.js` (إذا لم يعد مستخدم)

## 📁 ملفات للنقل

### إلى مجلد `tools/`:
- `DEPLOY_TO_GITHUB.bat`
- `UI_DESIGNER_PACKAGE.md`

### إلى مجلد `docs/`:
- `CHANGELOG.md` (إذا لم يكن موجود هناك)

## 🗂️ الهيكل المثالي للجذر

### ✅ يجب أن يبقى:
```
g-assistant-nx/
├── package.json          # ✅ ضروري
├── tsconfig.json         # ✅ ضروري  
├── tsconfig.base.json    # ✅ ضروري
├── nx.json              # ✅ ضروري
├── pnpm-lock.yaml       # ✅ ضروري
├── firebase.json        # ✅ ضروري
├── .firebaserc          # ✅ ضروري
├── .gitignore           # ✅ ضروري
├── .nxignore            # ✅ ضروري
├── LICENSE              # ✅ ضروري
├── README.md            # ✅ ضروري
└── [مجلدات المشروع]
```

### ❌ يجب إزالته من الجذر:
- ملفات .backup
- ملفات .js مؤقتة
- ملفات .txt مؤقتة
- ملفات .bat (نقل لـ tools/)

## 🎯 الفوائد

### بعد الترتيب:
- **جذر نظيف** - ملفات أساسية فقط
- **سهولة التنقل** - لا تشتت
- **مظهر احترافي** - للمطورين الجدد
- **أداء أفضل** - أقل ملفات للفحص

## ⚡ تنفيذ سريع

```bash
# حذف ملفات backup
del *.backup

# نقل الملفات
move DEPLOY_TO_GITHUB.bat tools/
move UI_DESIGNER_PACKAGE.md docs/

# حذف المؤقتة
del affected_files.txt
del DEEP_*.js
```