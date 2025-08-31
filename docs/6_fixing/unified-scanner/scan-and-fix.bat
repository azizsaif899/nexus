@echo off
chcp 65001 >nul
echo Ultimate Scanner and Fixer - Unified Version
echo ==========================================
echo.

echo Step 1: Cleaning old reports...
del "latest-scan-report.json" 2>nul
del "latest-scan-report.html" 2>nul
del "fix-report.json" 2>nul
del "fix-report.html" 2>nul

echo Step 2: Running comprehensive scan...
node ultimate-scanner.js

echo.
echo Step 3: Running automatic fixer...
node pro-safe-fixer.js --report "latest-scan-report.json"

echo.
echo Process completed!
echo Check fix-report.html for details
echo.
pause