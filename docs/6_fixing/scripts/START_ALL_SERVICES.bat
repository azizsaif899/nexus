@echo off
chcp 65001 >nul
title 🚀 تشغيل جميع الخدمات - ورشة الإصلاح الذاتي

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🚀 ورشة الإصلاح الذاتي - تشغيل الخدمات                  ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝

set "PROJECT_ROOT=E:\azizsys5\g-assistant-nx"
cd /d "%PROJECT_ROOT%"

echo 🔍 فحص المشروع...
if not exist "package.json" (
    echo ❌ package.json غير موجود
    pause
    exit /b 1
)

echo ✅ المشروع موجود
echo.

echo 🚀 بدء تشغيل الخدمات...
echo.

echo 📡 تشغيل API Server (Port 3333)...
start "API Server" cmd /k "nx serve api --port=3333"
timeout /t 3 >nul

echo 💬 تشغيل Web Chatbot (Port 3000)...
start "Web Chatbot" cmd /k "nx serve web-chatbot --port=3000"
timeout /t 3 >nul

echo 🎨 تشغيل Admin Dashboard (Port 4200)...
start "Admin Dashboard" cmd /k "nx serve admin-dashboard --port=4200"
timeout /t 3 >nul

echo 🧠 تشغيل Gemini Backend (Port 8000)...
if exist "packages\gemini-research-agent\src\backend\agent\app.py" (
    start "Gemini Backend" cmd /k "cd packages\gemini-research-agent\src\backend && python -m uvicorn agent.app:app --reload --port 8000"
) else (
    echo ⚠️ Gemini Backend غير موجود - سيتم إنشاؤه
)

echo.
echo ✅ تم تشغيل جميع الخدمات!
echo.
echo 🔗 الروابط المتاحة:
echo    📡 API Server: http://localhost:3333
echo    💬 Web Chatbot: http://localhost:3000
echo    🎨 Admin Dashboard: http://localhost:4200
echo    🧠 Gemini Backend: http://localhost:8000
echo.
echo ⏳ انتظر 30 ثانية ثم شغل فحص الصحة...
timeout /t 30 >nul

echo 🔍 تشغيل فحص الصحة...
node docs\6_fixing\scripts\health-check-v2.js

pause