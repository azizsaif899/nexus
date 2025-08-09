@echo off
chcp 65001 >nul
echo Starting G-Assistant NX Daily System...
echo ===================================

cd /d "%~dp0\..\..\.."

echo 1. System Check...
npm run test:system

echo.
echo 2. Starting Auto System...
echo    Runs every 5 minutes automatically
echo    Press Ctrl+C to stop
echo.

start "G-Assistant Dashboard" cmd /k "npm run dashboard"
timeout /t 3 >nul 2>&1

echo 3. Dashboard opened in separate window
echo    URL: http://localhost:3000
echo.

npm run auto:full

echo.
echo Daily work completed
pause