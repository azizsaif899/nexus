@echo off
title Nexus AI - تشغيل سريع
color 0A

echo 🚀 تشغيل Nexus AI...
echo.

REM تنظيف المنفذ 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do taskkill /PID %%a /F >nul 2>&1

REM الانتقال للمجلد الصحيح
cd /d "%~dp0apps\nexus-ai-main"

REM تثبيت المكتبات إذا لم تكن موجودة
if not exist "node_modules" npm install

REM تشغيل الخادم
echo ✅ بدء الخادم على http://localhost:3000
npm run dev