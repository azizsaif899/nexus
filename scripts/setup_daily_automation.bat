@echo off
echo 🔧 Setting up AzizSys Daily Automation...
echo.

set SCRIPT_PATH=%~dp0run_daily_system.bat
set TASK_NAME=AzizSys_Daily_Automation

echo 📅 Creating Windows Task Scheduler entry...
echo Task will run daily at 9:00 AM

schtasks /create /tn "%TASK_NAME%" /tr "%SCRIPT_PATH%" /sc daily /st 09:00 /f

if %errorlevel% equ 0 (
    echo ✅ Daily automation task created successfully!
    echo.
    echo 📋 Task Details:
    echo - Name: %TASK_NAME%
    echo - Schedule: Daily at 9:00 AM
    echo - Script: %SCRIPT_PATH%
    echo.
    echo 🎯 You can also run manually by executing:
    echo    %SCRIPT_PATH%
    echo.
    echo 🔧 To modify or delete the task, use Windows Task Scheduler
) else (
    echo ❌ Failed to create scheduled task
    echo Please run as Administrator or create manually
)

echo.
pause