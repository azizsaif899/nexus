@echo off
title Nexus AI - Fixed Launcher
color 0A

echo ========================================
echo    NEXUS AI - FIXED LAUNCHER v2.0
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is available

REM Check if npm is available
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    pause
    exit /b 1
)
echo ✅ npm is available

REM Kill any existing processes on port 3000
echo [3/5] Cleaning up port 3000...
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Found process on port 3000, attempting to kill...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)
echo ✅ Port 3000 is clean

REM Navigate to nexus-ai-main directory
echo [4/5] Navigating to nexus-ai-main...
cd /d "%~dp0apps\nexus-ai-main"
if %errorlevel% neq 0 (
    echo ❌ Failed to navigate to nexus-ai-main directory
    echo Current directory: %cd%
    pause
    exit /b 1
)
echo ✅ In nexus-ai-main directory

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found in nexus-ai-main
    echo Current directory: %cd%
    dir
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [5/5] Starting Nexus AI Main Application...
echo.
echo 🚀 Starting development server...
echo 📍 URL: http://localhost:3000
echo 🔄 This may take a few moments...
echo.
echo ========================================
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the development server
npm run dev

REM If we reach here, the server stopped
echo.
echo Server stopped. Press any key to exit...
pause >nul