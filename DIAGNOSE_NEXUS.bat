@echo off
title Nexus AI - Diagnostic Tool
color 0E

echo ========================================
echo    NEXUS AI - DIAGNOSTIC TOOL v1.0
echo ========================================
echo.

echo [SYSTEM CHECK]
echo ===============

REM Check Node.js
echo Checking Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js: NOT FOUND
    set NODE_OK=0
) else (
    echo ✅ Node.js: OK
    set NODE_OK=1
)

REM Check npm
echo Checking npm...
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm: NOT FOUND
    set NPM_OK=0
) else (
    echo ✅ npm: OK
    set NPM_OK=1
)

REM Check npx
echo Checking npx...
npx --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ npx: NOT FOUND
    set NPX_OK=0
) else (
    echo ✅ npx: OK
    set NPX_OK=1
)

echo.
echo [DIRECTORY CHECK]
echo ================

REM Check main directory
echo Current directory: %cd%
if exist "package.json" (
    echo ✅ Main package.json: FOUND
) else (
    echo ❌ Main package.json: NOT FOUND
)

REM Check nexus-ai-main
if exist "apps\nexus-ai-main" (
    echo ✅ nexus-ai-main directory: FOUND
    cd /d "apps\nexus-ai-main"
    if exist "package.json" (
        echo ✅ nexus-ai-main package.json: FOUND
    ) else (
        echo ❌ nexus-ai-main package.json: NOT FOUND
    )
    if exist "src\main.tsx" (
        echo ✅ main.tsx: FOUND
    ) else (
        echo ❌ main.tsx: NOT FOUND
    )
    if exist "vite.config.ts" (
        echo ✅ vite.config.ts: FOUND
    ) else (
        echo ❌ vite.config.ts: NOT FOUND
    )
    cd /d "%~dp0"
) else (
    echo ❌ nexus-ai-main directory: NOT FOUND
)

echo.
echo [PORT CHECK]
echo ===========

REM Check port 3000
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000: IN USE
    echo Processes using port 3000:
    netstat -ano | findstr :3000
) else (
    echo ✅ Port 3000: AVAILABLE
)

echo.
echo [DEPENDENCIES CHECK]
echo ===================

if exist "apps\nexus-ai-main\node_modules" (
    echo ✅ node_modules: FOUND
) else (
    echo ❌ node_modules: NOT FOUND (run npm install)
)

echo.
echo [SUMMARY]
echo ========

if %NODE_OK%==1 if %NPM_OK%==1 if %NPX_OK%==1 (
    echo ✅ System requirements: OK
    echo.
    echo [RECOMMENDED ACTIONS]
    echo ===================
    if not exist "apps\nexus-ai-main\node_modules" (
        echo 1. Run: cd apps\nexus-ai-main && npm install
    )
    echo 2. Use NEXUS_LAUNCHER_FIXED.bat to start the app
    echo 3. Open http://localhost:3000 in your browser
) else (
    echo ❌ System requirements: FAILED
    echo.
    echo [REQUIRED ACTIONS]
    echo =================
    if %NODE_OK%==0 (
        echo 1. Install Node.js from https://nodejs.org/
    )
    if %NPM_OK%==0 (
        echo 2. Reinstall Node.js (npm should come with it)
    )
    echo 3. Restart this diagnostic after installation
)

echo.
echo Press any key to exit...
pause >nul