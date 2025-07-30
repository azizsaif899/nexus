@echo off
echo 🚀 Starting G-Assistant Build Process...
echo.

echo 📦 Running build.js...
node build.js

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

echo 📋 Checking appsscript.json...
if exist "dist\appsscript.json" (
    echo ✅ appsscript.json found
) else (
    echo ❌ appsscript.json missing!
    pause
    exit /b 1
)

echo.
echo 🎯 Build process completed successfully!
echo Ready for deployment to Google Apps Script
pause