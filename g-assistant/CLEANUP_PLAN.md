# 🧹 خطة التنظيف والترتيب

## ✅ تم نقله إلى g-assistant:

### ملفات التكوين:
- `.claspignore` - تجاهل ملفات clasp
- `.eslintrc.json` - إعدادات ESLint  
- `.prettierrc` - إعدادات Prettier
- `babel.config.js` - تكوين Babel
- `jest.config.js` - تكوين Jest

### ملفات البيانات:
- `dashboard_data.json` - بيانات اللوحة

### سكربتات مفيدة:
- `scripts/launch_ui.js` - تشغيل الواجهة
- `scripts/test_production.js` - اختبار الإنتاج

## 🗑️ ملفات يُنصح بحذفها:

### ملفات مؤقتة/تجريبية:
```
cleanup_script.bat
advanced_cleanup.bat
hybrid_solution.js
setup_hybrid.bat
test_hybrid.js
test_hybrid.cjs
start_hybrid.bat
```

### ملفات إدارة العمليات (يمكن الاستغناء عنها):
```
kill-all-node.bat
simple-kill-node.bat
kill-node-simple.bat
kill-specific-port.bat
check-port.bat
check-port-status.bat
check-and-kill-port.bat
```

### ملفات نشر قديمة:
```
quick_deploy.bat
deploy_simple.bat
DEPLOY_EVERYTHING.bat
deploy_complete_project.bat
upload_everything.bat
upload_to_github.bat
```

### ملفات إصلاحات أمنية مؤقتة:
```
security_fixes_immediate.js
security_fixes_immediate_proposed-*.js
code_injection_fix_report.js
log_injection_fix_applied.js
```

## 📋 ملفات تحتاج مراجعة:

### يمكن الاحتفاظ بها في المجلد الرئيسي:
- `.env` - متغيرات البيئة (حساسة)
- `.clasp.json` - تكوين Google Apps Script
- `appsscript.json` - تكوين Apps Script
- `package.json` - تبعيات المشروع الرئيسي
- `package-lock.json` - قفل التبعيات
- `README.md` - وثيقة المشروع

### ملفات حالة المشروع:
- `status.json` - حالة المشروع
- `monthly_progress.json` - التقدم الشهري
- `CHANGELOG.md` - سجل التغييرات
- `fixes_log.md` - سجل الإصلاحات

## 🎯 التوصية:

1. **احتفظ بـ**: ملفات التكوين الأساسية في g-assistant
2. **احذف**: الملفات المؤقتة والتجريبية  
3. **راجع**: ملفات الحالة قبل الحذف
4. **انقل**: السكربتات المفيدة إلى scripts/