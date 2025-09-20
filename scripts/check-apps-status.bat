@echo off
echo 🔍 Checking AzizSys Applications Status...

cd /d e:\azizsys5\g-assistant-nx

echo 📋 Checking project structure...
if exist "apps\admin-dashboard" (
    echo ✅ Admin Dashboard folder exists
) else (
    echo ❌ Admin Dashboard folder missing
)

if exist "apps\web-chatbot" (
    echo ✅ Web Chatbot folder exists
) else (
    echo ❌ Web Chatbot folder missing
)

if exist "apps\ai-dashboard" (
    echo ✅ AI Dashboard folder exists
) else (
    echo ❌ AI Dashboard folder missing
)

echo.
echo 📦 Checking package.json...
if exist "package.json" (
    echo ✅ Package.json exists
) else (
    echo ❌ Package.json missing
)

echo.
echo 🔧 Checking NX workspace...
if exist "nx.json" (
    echo ✅ NX workspace configured
) else (
    echo ❌ NX workspace missing
)

echo.
echo 🌐 Testing ports...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo ✅ Port 3000 is in use
) else (
    echo ❌ Port 3000 is free
)

netstat -an | findstr :4200
if %errorlevel% equ 0 (
    echo ✅ Port 4200 is in use
) else (
    echo ❌ Port 4200 is free
)

netstat -an | findstr :4201
if %errorlevel% equ 0 (
    echo ✅ Port 4201 is in use
) else (
    echo ❌ Port 4201 is free
)

pause