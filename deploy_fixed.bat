@echo off
echo 🚀 نشر G-Assistant مع الإصلاحات الحرجة...

echo ✅ تشغيل البناء...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ فشل البناء
    pause
    exit /b 1
)

echo ✅ رفع الملفات...
call clasp push

if %ERRORLEVEL% NEQ 0 (
    echo ❌ فشل الرفع
    pause
    exit /b 1
)

echo ✅ فتح المشروع...
call clasp open

echo 🎯 تم النشر بنجاح!
pause