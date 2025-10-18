@echo off
title Visual Automation - Starting Server
color 0A

echo ========================================
echo    🚀 تشغيل نظام الأتمتة المرئية
echo ========================================
echo.

cd /d "C:\nexus\apps\visual-automation"

echo 📍 المسار الحالي: %CD%
echo.

echo ⚡ تثبيت المكتبات...
call npm install
if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت المكتبات
    pause
    exit /b 1
)

echo.
echo ✅ تم تثبيت المكتبات بنجاح
echo.
echo 🚀 بدء تشغيل الخادم على المنفذ 4100...
echo 🌐 سيفتح المتصفح تلقائياً على: http://localhost:4100
echo.
echo ⏹️ للإيقاف: اضغط Ctrl+C
echo ========================================
echo.

call npm run dev

echo.
echo ⚠️ تم إيقاف الخادم
pause