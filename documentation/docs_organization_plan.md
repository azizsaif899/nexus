# خطة تنظيم الوثائق - G-Assistant

## 📁 الهيكل المقترح:

### 📚 `/docs/core/` - الوثائق الأساسية
- README.md
- PROJECT_STRUCTURE.md  
- CHANGELOG.md
- architecture.md
- VERSION_HISTORY.md

### ⚙️ `/docs/technical/` - الوثائق التقنية
- DEPLOYMENT_NOTES.md
- INTEGRATION_CHECK.md
- RECOVERY_VERIFICATION.md
- TROUBLESHOOTING.md
- impact-map.md

### 👥 `/docs/guides/` - أدلة المستخدمين
- CLIENT_GUIDE.md
- UPGRADE_GUIDE.md
- LIBRARY_USAGE.md
- USAGE_TRACKING.md

### 📋 `/docs/standards/` - المعايير والإرشادات
- COMMIT_MESSAGE.md
- DOCUMENTATION_INDEX.md

### 📊 `/docs/reports/` - التقارير والتحليلات
- تقرير تطوير وحدة الذكاء الصناعي.md
- جميع ملفات documentation/ الموجودة

### 🗄️ `/archive/` - الملفات القديمة والنسخ الاحتياطية
- archive_unused/
- backup_old_project/
- backups/

## 🔄 الملفات المكررة المكتشفة:

### في المجلد الرئيسي:
- Architecture_Overview.md ← يمكن دمجه مع architecture.md
- API_Documentation.md ← ينقل إلى /docs/technical/
- USER_MANUAL.md ← يمكن دمجه مع CLIENT_GUIDE.md

### في مجلد documentation/:
- DEPLOYMENT_GUIDE.md ← مكرر مع DEPLOYMENT_NOTES.md
- AzizSys_Troubleshooting_Guide.md ← مكرر مع TROUBLESHOOTING.md
- QUICK_START_GUIDE.md ← يمكن دمجه مع README.md

## ✅ الإجراءات المطلوبة:
1. إنشاء المجلدات المنظمة
2. نقل الملفات حسب التصنيف
3. دمج الملفات المكررة
4. تحديث الروابط في DOCUMENTATION_INDEX.md