@echo off
chcp 65001 >nul
echo ========================================
echo تنظيف شامل للمشروع مع حماية الملفات الحساسة
echo ========================================

REM قائمة الملفات الحساسة المحمية
echo الملفات المحمية:
echo - .clasp.json (إعدادات النشر)
echo - appsscript.json (إعدادات التطبيق)
echo - package.json (تبعيات المشروع)
echo - LICENSE (رخصة المشروع)
echo - .gitignore (إعدادات Git)
echo - config\*.json (ملفات التكوين)
echo - 40_security\Security.js (ملف الأمان)
echo ========================================

REM 1. تنظيف مجلد backup_old_project
if exist "backup_old_project" (
    echo [1/8] حذف النسخ الاحتياطية القديمة...
    rmdir /s /q "backup_old_project"
    echo ✓ تم حذف backup_old_project
) else (
    echo [1/8] backup_old_project غير موجود
)

REM 2. تنظيف مجلد archive_unused
if exist "archive_unused" (
    echo [2/8] حذف الأرشيف غير المستخدم...
    rmdir /s /q "archive_unused"
    echo ✓ تم حذف archive_unused
) else (
    echo [2/8] archive_unused غير موجود
)

REM 3. تنظيف مجلد archive_txt
if exist "archive_txt" (
    echo [3/8] حذف ملفات النصوص المؤرشفة...
    rmdir /s /q "archive_txt"
    echo ✓ تم حذف archive_txt
) else (
    echo [3/8] archive_txt غير موجود
)

REM 4. تنظيف النسخ الاحتياطية المكررة في backups
if exist "backups\backups" (
    echo [4/8] حذف النسخ الاحتياطية المكررة...
    rmdir /s /q "backups\backups"
    echo ✓ تم حذف backups\backups
) else (
    echo [4/8] backups\backups غير موجود
)

REM 5. حذف ملفات .bak و .backup
echo [5/8] حذف ملفات النسخ الاحتياطية (.bak, .backup)...
set count=0
for /r . %%f in (*.bak) do (
    del "%%f" 2>nul
    set /a count+=1
)
for /r . %%f in (*.backup) do (
    del "%%f" 2>nul
    set /a count+=1
)
echo ✓ تم حذف %count% ملف نسخ احتياطية

REM 6. حذف ملفات التطوير المؤقتة
echo [6/8] حذف الملفات المؤقتة...
set temp_count=0
for /r . %%f in (*.tmp) do (
    del "%%f" 2>nul
    set /a temp_count+=1
)
for /r . %%f in (*.temp) do (
    del "%%f" 2>nul
    set /a temp_count+=1
)
for /r . %%f in (*~) do (
    del "%%f" 2>nul
    set /a temp_count+=1
)
echo ✓ تم حذف %temp_count% ملف مؤقت

REM 7. تنظيف ملفات السجلات القديمة
echo [7/8] حذف ملفات السجلات القديمة...
set log_count=0
for /r . %%f in (*.log) do (
    del "%%f" 2>nul
    set /a log_count+=1
)
echo ✓ تم حذف %log_count% ملف سجل

REM 8. تنظيف test_cases إذا كان موجوداً
if exist "test_cases" (
    echo [8/8] حذف حالات الاختبار القديمة...
    rmdir /s /q "test_cases"
    echo ✓ تم حذف test_cases
) else (
    echo [8/8] test_cases غير موجود
)

echo ========================================
echo تم الانتهاء من التنظيف بنجاح!
echo ========================================
echo الملفات المحفوظة والمحمية:
echo ✓ ملفات التكوين الأساسية
echo ✓ الكود المصدري الحالي
echo ✓ التوثيق الحديث
echo ✓ ملفات الأمان
echo ✓ إعدادات Git و Clasp
echo ========================================
pause