@echo off
echo 🚀 Starting AzizSys Daily Automation System...
echo.

echo 📅 Step 1: Generating daily boot tasks...
python "%~dp0generate_daily_boot.py"
if %errorlevel% neq 0 (
    echo ❌ Failed to generate daily boot
    pause
    exit /b 1
)
echo ✅ Daily boot generated successfully
echo.

echo 🔧 Step 2: Orchestrating tasks...
node "%~dp0task_orchestrator.js"
if %errorlevel% neq 0 (
    echo ❌ Failed to orchestrate tasks
    pause
    exit /b 1
)
echo ✅ Tasks orchestrated successfully
echo.

echo 📊 Step 3: Displaying results...
if exist "%~dp0..\doc\context\DAILY_BOOT.md" (
    echo 📋 Today's tasks:
    type "%~dp0..\doc\context\DAILY_BOOT.md"
) else (
    echo ⚠️ Daily boot file not found
)

echo.
echo 🎉 Daily automation system completed successfully!
echo.
pause