@echo off
chcp 65001 >nul
title 🚀 Nexus AI - محسن للأداء

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 Nexus AI - محسن للأداء                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: تنظيف المنفذ
echo 🧹 تنظيف المنفذ 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo قتل العملية %%a
    taskkill /f /pid %%a >nul 2>&1
)

:: تنظيف الكاش
echo 🗑️ تنظيف الكاش...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1

:: تحديث المتغيرات البيئية للأداء
set NODE_ENV=development
set VITE_PERFORMANCE_MODE=true
set VITE_BUNDLE_ANALYZER=false

echo 🔧 تشغيل مع التحسينات...
echo.
echo 📍 العنوان: http://localhost:3000
echo 🎯 الوضع: محسن للأداء
echo.

:: تشغيل مع Vite config محسن
npx vite --config vite.config.performance.ts --port 3000 --host

if errorlevel 1 (
    echo.
    echo ❌ فشل في التشغيل، محاولة مع الإعدادات العادية...
    npx vite --port 3000 --host
)

pause