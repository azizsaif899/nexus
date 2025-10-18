@echo off
echo 🔍 Checking Visual Automation Status...

echo.
echo 📁 Checking directory...
if exist "C:\nexus\apps\visual-automation" (
    echo ✅ Directory exists
) else (
    echo ❌ Directory not found
    pause
    exit
)

echo.
echo 📦 Checking package.json...
cd /d "C:\nexus\apps\visual-automation"
if exist "package.json" (
    echo ✅ package.json exists
) else (
    echo ❌ package.json not found
    pause
    exit
)

echo.
echo 🔌 Checking port 3005...
netstat -ano | findstr :3005
if %errorlevel% == 0 (
    echo ⚠️ Port 3005 is in use
) else (
    echo ✅ Port 3005 is free
)

echo.
echo 📋 Node.js version:
node --version

echo.
echo 📋 NPM version:
npm --version

echo.
echo 🎯 Ready to start Visual Automation!
pause