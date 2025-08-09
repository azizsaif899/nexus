@echo off
chcp 65001 >nul
title GenAI Processors - Week 2
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🧠 GenAI Processors - Week 2                ║
echo ║                      AzizSys October                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 📦 تثبيت التبعيات...
if not exist "node_modules" (
    npm install
)

echo 🚀 بدء تشغيل المعالجات...
echo 📍 Processor API: http://localhost:8081
echo 📊 Metrics: http://localhost:8081/metrics
echo 🔍 Health: http://localhost:8081/health
echo.

start "Test Runner" cmd /k "timeout /t 3 && node test.js"
npm start