@echo off
title Visual Automation System - VSC
color 0A

echo.
echo ==========================================
echo     🚀 نظام الأتمتة المرئية الاحترافي
echo     Professional Visual Workflow System
echo ==========================================
echo.
echo 📍 المسار: C:\nexus\apps\visual-automation
echo 🌐 المنفذ: 4100 (نظيف)
echo 📊 الوضع: Demo Mode (محاكاة محلية)
echo.

cd /d "C:\nexus\apps\visual-automation"

echo ⚡ تشغيل التطبيق...
npm run dev

echo.
echo ✅ التطبيق متاح على: http://localhost:4100
echo.
pause