@echo off
echo 🔧 G-Assistant Complete Fix and Deploy v4.0
echo ==========================================

echo.
echo 1. Installing dependencies...
npm install

echo.
echo 2. Running emergency repair...
npm run emergency-repair

echo.
echo 3. Running comprehensive fix...
npm run comprehensive-fix

echo.
echo 4. Running tests...
npm run run-tests

echo.
echo 5. Validating deployment...
npm run validate-deploy

echo.
echo 6. Building project...
npm run build

echo.
echo 7. Deploying to Apps Script...
call deploy.bat

echo.
echo ✅ Complete fix and deployment finished!
echo 📄 Check analysis-report.json and REPAIR_PLAN.md for details
echo 🩺 All repair systems integrated into system_doctor_final.cjs
pause