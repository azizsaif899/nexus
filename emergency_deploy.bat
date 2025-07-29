@echo off
echo 🔥 Emergency Deployment - Critical System Repair
echo ================================================

echo 1. Moving critical fix to first position...
copy "00_critical_fix.js" "dist\00_critical_fix.js" >nul 2>&1

echo 2. Running build process...
node build.js

echo 3. Deploying to Apps Script...
clasp push

echo 4. Opening Apps Script editor...
clasp open

echo ✅ Emergency deployment complete!
pause