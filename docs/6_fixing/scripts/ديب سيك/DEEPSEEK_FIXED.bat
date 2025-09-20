@echo off
chcp 65001 >nul
title DeepSeek AI Master Control v3.0

:MAIN_MENU
cls
echo.
echo ===============================================================
echo                DeepSeek AI Master Control v3.0
echo                     Code Analysis and Fixing System
echo ===============================================================
echo.
echo  1. Full Code Scan (AI Analyzer)
echo  2. Auto Fix Issues (Auto Fixer)
echo  3. Quick Scan
echo  4. View Dashboard
echo  5. View Reports
echo  6. Setup Environment
echo  7. Cleanup Temp Files
echo  8. Help
echo  0. Exit
echo.
set /p choice="Choose option: "

if "%choice%"=="1" goto FULL_SCAN
if "%choice%"=="2" goto AUTO_FIX
if "%choice%"=="3" goto QUICK_SCAN
if "%choice%"=="4" goto DASHBOARD
if "%choice%"=="5" goto VIEW_REPORTS
if "%choice%"=="6" goto SETUP_ENV
if "%choice%"=="7" goto CLEANUP
if "%choice%"=="8" goto HELP
if "%choice%"=="0" goto EXIT

echo Invalid choice!
timeout /t 2 >nul
goto MAIN_MENU

:FULL_SCAN
cls
echo ===============================================================
echo                    Full Code Scan
echo ===============================================================
echo.
echo Starting full scan...
echo.

python ai-analyzer.py --dir "..\..\..\.."

echo.
echo Full scan completed!
echo You can view the report through the dashboard
echo.
pause
goto MAIN_MENU

:AUTO_FIX
cls
echo ===============================================================
echo                   Auto Fix Issues
echo ===============================================================
echo.
echo Starting auto fix...
echo.

python deepseek_fixer.py --dir "..\..\..\.."

echo.
echo Auto fix completed!
echo You can view the fix report through the dashboard
echo.
pause
goto MAIN_MENU

:QUICK_SCAN
cls
echo ===============================================================
echo                      Quick Scan
echo ===============================================================
echo.
echo Starting quick scan...
echo.

python simple-scan.py

echo.
echo Quick scan completed!
echo.
pause
goto MAIN_MENU

:DASHBOARD
cls
echo ===============================================================
echo                    Dashboard
echo ===============================================================
echo.
echo Opening interactive dashboard...
echo.

start "" "dashboard.html"

echo Dashboard opened in browser
echo.
pause
goto MAIN_MENU

:VIEW_REPORTS
cls
echo ===============================================================
echo                     View Reports
echo ===============================================================
echo.

echo Scan Reports:
echo =============
if exist "reports\*.json" (
    dir /b /o-d "reports\scan_report_*.json" 2>nul
) else (
    echo No scan reports found
)

echo.
echo Fix Reports:
echo ============
if exist "fix_reports\*.json" (
    dir /b /o-d "fix_reports\fix_report_*.json" 2>nul
) else (
    echo No fix reports found
)

echo.
pause
goto MAIN_MENU

:SETUP_ENV
cls
echo ===============================================================
echo                   Setup Environment
echo ===============================================================
echo.

echo Setting up DeepSeek AI environment...
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo Python not installed! Please install Python first.
    echo Download from: https://python.org
    pause
    goto MAIN_MENU
)

echo Python is available
echo.

echo Installing requirements...
pip install requests rich colorama

if errorlevel 1 (
    echo Failed to install requirements!
    pause
    goto MAIN_MENU
)

echo.
echo Environment setup completed!
echo You can now use all DeepSeek AI features
echo.
pause
goto MAIN_MENU

:CLEANUP
cls
echo ===============================================================
echo                  Cleanup Temp Files
echo ===============================================================
echo.

echo Cleaning temporary files...
echo.

if exist "__pycache__" (
    rmdir /s /q "__pycache__"
    echo Removed __pycache__
)

del /s /q "*.pyc" >nul 2>&1
echo Removed .pyc files

echo.
echo Cleanup completed!
echo.
pause
goto MAIN_MENU

:HELP
cls
echo ===============================================================
echo                        Help
echo ===============================================================
echo.
echo DeepSeek AI Master Control User Guide:
echo.
echo Full Scan:
echo    - Scans all project files
echo    - Detects security and quality issues
echo    - Creates detailed report
echo.
echo Auto Fix:
echo    - Reads scan report
echo    - Creates detailed fix plan
echo    - Applies safe automatic fixes
echo    - Creates backups before modification
echo.
echo Quick Scan:
echo    - Quick scan for common issues
echo    - Suitable for daily checks
echo.
echo Dashboard:
echo    - Interactive web interface
echo    - View reports and statistics
echo    - Monitor project status
echo.
pause
goto MAIN_MENU

:EXIT
cls
echo.
echo Thank you for using DeepSeek AI Master Control
echo See you soon!
echo.
timeout /t 2 >nul
exit /b 0