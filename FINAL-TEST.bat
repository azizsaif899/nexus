@echo off
title Nexus AI - Final Test
color 0A

echo 🔧 إصلاح المسارات مكتمل
echo 🚀 اختبار نهائي...
echo.

cd /d "c:\nexus\apps\nexus-ai-main"

REM Install if needed
if not exist "node_modules" (
    echo 📦 تثبيت المكتبات...
    npm install
)

echo ✅ بدء الخادم على http://localhost:3000
echo.
npx vite --port 3000 --host localhost