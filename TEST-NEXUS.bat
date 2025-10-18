@echo off
cd /d "%~dp0apps\nexus-ai-main"
echo Testing Nexus AI startup...
echo Current directory: %cd%
echo.
echo Checking files:
if exist "package.json" echo ✅ package.json found
if exist "src\main.tsx" echo ✅ main.tsx found  
if exist "vite.config.ts" echo ✅ vite.config.ts found
echo.
echo Starting server...
npm run dev