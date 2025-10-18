@echo off
REM Nexus AI Development Launcher
REM This batch file provides easy access to PowerShell scripts

echo.
echo ============================================
echo    Nexus AI Development Environment
echo ============================================
echo.

cd /d "%~dp0"

echo Available commands:
echo.
echo 1. Comprehensive Setup (recommended)
echo    powershell -ExecutionPolicy Bypass -File scripts\comprehensive-start.ps1
echo.
echo 2. Quick Start (if already set up)
echo    powershell -ExecutionPolicy Bypass -File scripts\start-dev.ps1
echo.
echo 3. Run Diagnostics
echo    powershell -ExecutionPolicy Bypass -File scripts\diagnose.ps1
echo.
echo 4. Clean Cache
echo    powershell -ExecutionPolicy Bypass -File scripts\clean.ps1
echo.
echo 5. Deep Clean (removes node_modules)
echo    powershell -ExecutionPolicy Bypass -File scripts\clean.ps1 -Deep
echo.

set /p choice="Enter your choice (1-5) or 'q' to quit: "

if "%choice%"=="1" goto comprehensive
if "%choice%"=="2" goto quickstart
if "%choice%"=="3" goto diagnose
if "%choice%"=="4" goto clean
if "%choice%"=="5" goto deepclean
if "%choice%"=="q" goto quit
if "%choice%"=="Q" goto quit

echo Invalid choice. Please run again.
pause
exit /b 1

:comprehensive
echo.
echo Starting comprehensive setup...
powershell -ExecutionPolicy Bypass -File scripts\comprehensive-start.ps1
goto end

:quickstart
echo.
echo Starting quick development server...
powershell -ExecutionPolicy Bypass -File scripts\start-dev.ps1
goto end

:diagnose
echo.
echo Running diagnostics...
powershell -ExecutionPolicy Bypass -File scripts\diagnose.ps1
goto end

:clean
echo.
echo Cleaning cache...
powershell -ExecutionPolicy Bypass -File scripts\clean.ps1
goto end

:deepclean
echo.
echo Performing deep clean...
powershell -ExecutionPolicy Bypass -File scripts\clean.ps1 -Deep
goto end

:quit
echo.
echo Goodbye!
goto end

:end
echo.
pause