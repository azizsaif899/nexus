@echo off
echo 📦 سحب النسخة الاحتياطية...

REM إنشاء مجلد النسخة الاحتياطية
mkdir backup_old_project 2>nul

REM الانتقال للمجلد
cd backup_old_project

REM سحب المشروع الحالي
clasp pull

echo ✅ تم! النسخة الاحتياطية في مجلد: backup_old_project
echo.
echo 🎯 الآن ارجع للمجلد الأصلي وشغل:
echo clasp create --title "G-Assistant-New" --type sheets
echo clasp push
pause