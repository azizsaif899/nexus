@echo off
title Launch Standalone Tests
echo 🧪 Launching Standalone Tests...
echo.
echo 📍 Standalone Tests: http://localhost:4202
echo.
cd /d "C:\nexus\apps\CRM\test"
if not exist "node_modules" (
    echo 📦 Installing test dependencies...
    npm install
)
start "Test Server" cmd /k "npm run dev"
echo.
echo ✅ Test Server launched in new window!
echo 🌐 Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:4202
echo.
echo 📋 Standalone Tests Include:
echo   ✅ UI Components (40+ components)
echo   ✅ Theme System (Dark/Light)
echo   ✅ RTL Support (Arabic)
echo   ✅ Charts (Recharts)
echo   ✅ Drag & Drop (React DnD)
echo.
pause