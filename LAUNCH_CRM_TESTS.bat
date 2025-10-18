@echo off
title Launch CRM Tests
echo 🚀 Launching CRM with Tests...
echo.
echo 📍 CRM Main: http://localhost:4201
echo 🧪 Tests: Click "🧪 اختبارات" button in navigation
echo.
cd /d "C:\nexus\apps\CRM"
start "CRM Server" cmd /k "npm run dev"
echo.
echo ✅ CRM Server launched in new window!
echo 🌐 Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:4201
echo.
echo 📋 Instructions:
echo   1. Wait for server to start
echo   2. Click "🧪 اختبارات" in navigation
echo   3. Test all 40+ components
echo.
pause