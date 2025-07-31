@echo off
chcp 65001 >nul
title API Gateway - AzizSys October Plan
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 API Gateway - Week 1                   ║
echo ║                      AzizSys October                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 📦 تثبيت التبعيات...
if not exist "node_modules" (
    npm install
)

echo 🔧 إعداد البيئة...
if not exist ".env" (
    copy .env.example .env
    echo ⚠️  يرجى تحديث ملف .env بالمفاتيح الصحيحة
)

echo.
echo 🚀 بدء تشغيل API Gateway...
echo 📍 Endpoint: http://localhost:8080/api/v1/process
echo 🔍 Health Check: http://localhost:8080/health
echo.

npm start