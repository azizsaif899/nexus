@echo off
echo 🚀 G-Assistant Auto-Fix System - Quick Start
echo ==========================================

echo.
echo 📋 Checking prerequisites...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

echo.
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ⚙️ Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please edit .env file and add your API keys
    echo.
    echo Opening .env file for editing...
    notepad .env
    echo.
    echo Press any key after you've configured your .env file...
    pause >nul
) else (
    echo ✅ .env file already exists
)

echo.
echo 🔨 Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo 🧪 Running tests...
call npm test
if %errorlevel% neq 0 (
    echo ⚠️  Some tests failed, but continuing...
)

echo.
echo 🚀 Starting G-Assistant Auto-Fix System...
echo.
echo System is starting... Press Ctrl+C to stop
echo.

call npm start

echo.
echo 👋 System stopped. Press any key to exit...
pause >nul