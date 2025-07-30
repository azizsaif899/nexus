@echo off
echo تنظيف الملفات الزائدة مع الحفاظ على الملفات الحساسة...

REM حذف مجلدات النسخ الاحتياطية القديمة
if exist "backup_old_project" (
    echo حذف النسخ الاحتياطية القديمة...
    rmdir /s /q "backup_old_project"
)

if exist "archive_unused" (
    echo حذف الأرشيف غير المستخدم...
    rmdir /s /q "archive_unused"
)

REM حذف ملفات النسخ الاحتياطية المكررة
echo حذف ملفات .bak و .backup...
for /r . %%f in (*.bak) do del "%%f"
for /r . %%f in (*.backup) do del "%%f"

REM حذف ملفات التوثيق المكررة
if exist "archive_txt" (
    echo حذف ملفات النصوص المؤرشفة...
    rmdir /s /q "archive_txt"
)

REM حذف ملفات التطوير المؤقتة
echo حذف الملفات المؤقتة...
for /r . %%f in (*.tmp) do del "%%f"
for /r . %%f in (*.temp) do del "%%f"
for /r . %%f in (*~) do del "%%f"

REM حذف ملفات الاختبار القديمة
if exist "test_cases" (
    echo حذف حالات الاختبار القديمة...
    rmdir /s /q "test_cases"
)

REM تنظيف مجلد backups من الملفات المكررة
if exist "backups\backups" (
    echo حذف النسخ الاحتياطية المكررة...
    rmdir /s /q "backups\backups"
)

REM حذف ملفات البناء المؤقتة
for /r . %%f in (*.log) do del "%%f"

echo تم الانتهاء من التنظيف!
echo الملفات المحفوظة:
echo - ملفات التكوين (.clasp.json, appsscript.json, package.json)
echo - الكود المصدري الأساسي
echo - التوثيق الحالي
echo - ملفات الأمان والتشفير
pause