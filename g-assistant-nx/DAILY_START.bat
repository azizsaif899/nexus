@echo off
echo G-Assistant NX - Daily Start
echo =============================
cd /d "%~dp0"

echo Starting system check...
npm run test:system

echo.
echo Opening dashboard...
start "Dashboard" cmd /k "npm run dashboard"

echo.
echo Starting auto system (every 5 minutes)...
npm run auto:full