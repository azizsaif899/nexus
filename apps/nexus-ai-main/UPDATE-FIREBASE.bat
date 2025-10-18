@echo off
echo 🔄 تحديث Nexus AI على Firebase
echo ===============================

echo 🧹 تنظيف الملفات القديمة...
if exist dist rmdir /s /q dist

echo 📦 بناء النسخة المحدثة...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ فشل في البناء!
    pause
    exit /b 1
)

echo 🔥 رفع التحديث على Firebase...
firebase deploy --only hosting

if %ERRORLEVEL% EQU 0 (
    echo ✅ تم التحديث بنجاح!
    echo 🌐 الرابط: https://nexus-ai-main.web.app
    echo 🚀 الأداء محسن - تحميل أسرع!
) else (
    echo ❌ فشل في الرفع!
)

pause