@echo off
title Nexus AI - Emergency Start
color 0C

echo 🚨 تشغيل طوارئ - Nexus AI
echo.

REM قتل جميع العمليات على المنافذ
echo تنظيف المنافذ...
netstat -ano | findstr :3000 | for /f "tokens=5" %%a in ('more') do taskkill /PID %%a /F >nul 2>&1
netstat -ano | findstr :3001 | for /f "tokens=5" %%a in ('more') do taskkill /PID %%a /F >nul 2>&1

REM الانتقال للمجلد
cd /d "%~dp0apps\nexus-ai-main"

REM تشغيل بالإعداد المبسط
echo ✅ تشغيل بالإعداد المبسط...
npx vite --config vite.config.simple.ts --port 3000 --host 0.0.0.0

pause