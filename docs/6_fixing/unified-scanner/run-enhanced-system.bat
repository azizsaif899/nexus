@echo off
echo Enhanced Scanner and Fixer System
echo ===================================
echo.

echo Step 1: Cleaning old reports...
del "enhanced-scan-report.json" 2>nul
del "enhanced-fix-report.json" 2>nul
del "enhanced-fix-report.html" 2>nul

echo Step 2: Running Enhanced Scanner...
node enhanced-scanner.js

echo.
echo Step 3: System completed
echo Check enhanced-scan-report.json for results
echo.
pause