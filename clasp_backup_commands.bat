@echo off
echo 📦 إنشاء نسخة احتياطية من المشروع الحالي...

REM إنشاء مشروع جديد للنسخة الاحتياطية
clasp create --title "G-Assistant-Old-Backup" --type sheets

REM سحب الملفات الحالية
clasp pull

REM إنشاء مجلد للنسخة الاحتياطية
mkdir old_project_backup
move *.js old_project_backup\
move *.html old_project_backup\
move appsscript.json old_project_backup\

echo ✅ تم إنشاء النسخة الاحتياطية!
echo.
echo 🎯 الآن يمكنك:
echo 1. clasp create --title "G-Assistant-New" --type sheets
echo 2. clasp push
echo.
pause