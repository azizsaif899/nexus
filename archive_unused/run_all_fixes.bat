@echo off
echo 🔧 G-Assistant Complete Project Repair Suite
echo ==========================================

echo.
echo 1. Running Comprehensive Project Fixer...
node COMPREHENSIVE_PROJECT_FIXER.cjs

echo.
echo 2. Running System Doctor...
node system_doctor_final.cjs

echo.
echo 3. Building project...
npm run build

echo.
echo 4. Deploying to Apps Script...
call deploy.bat

echo.
echo ✅ All fixes and deployment completed!
pause