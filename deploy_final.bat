@echo off
echo 🚀 G-Assistant Final Deployment
echo ================================
echo.

echo 📦 Step 1: Building project...
call run_build_test.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

echo.
echo 📋 Step 2: Updating appsscript.json...
node update_appsscript.js

echo.
echo 🧪 Step 3: Running tests...
echo Tests will be run after deployment in Apps Script

echo.
echo 🚀 Step 4: Deploying to Google Apps Script...
clasp push
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo 🌐 Step 5: Creating deployment...
clasp deploy --description "G-Assistant v3.0.0 - Complete AI System"

echo.
echo ✅ Deployment completed successfully!
echo 🎉 G-Assistant is now live!
echo.
echo Next steps:
echo 1. Open Google Apps Script console
echo 2. Test the enhanced sidebar
echo 3. Run comprehensive tests
echo 4. Configure API keys in PropertiesService
echo.
pause