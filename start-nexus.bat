@echo off
REM Nexus AI Main - Startup Script for Windows
REM This script ensures the application runs smoothly without port conflicts

echo 🚀 Starting Nexus AI Main...
echo ===============================

REM Navigate to the correct directory
cd /d "%~dp0apps\nexus-ai-main"
if errorlevel 1 (
    echo ❌ Error: Could not navigate to nexus-ai-main directory
    pause
    exit /b 1
)

REM Kill any existing processes on port 3000
echo 🧹 Cleaning up port 3000...
npx kill-port 3000 >nul 2>&1

REM Clear any cached files
echo 🗂️ Clearing cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1
if exist "dist" rmdir /s /q "dist" >nul 2>&1

REM Start the development server
echo ▶️ Starting development server on http://localhost:3000
echo ===============================
npx vite --port 3000 --host

pause