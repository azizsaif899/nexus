@echo off
title Nexus Quick Launcher
color 0A
chcp 65001 > nul

echo.
echo ========================================
echo    🚀 Nexus Quick Launcher
echo    مشغل تطبيقات Nexus السريع
echo ========================================
echo.
echo Choose your action:
echo.
echo [1] Start N-Chat (Port 3003)
echo [2] Start CRM System (Port 3004) 
echo [3] Start Both Applications
echo [4] Check Ports Status
echo [5] Stop All Applications
echo [6] Clear All Cache
echo [0] Exit
echo.

set /p choice="Enter choice (0-6): "

if "%choice%"=="1" goto start_nchat
if "%choice%"=="2" goto start_crm
if "%choice%"=="3" goto start_both
if "%choice%"=="4" goto check_ports
if "%choice%"=="5" goto stop_all
if "%choice%"=="6" goto clear_cache
if "%choice%"=="0" goto exit
goto invalid

:start_nchat
echo.
echo 🚀 Starting N-Chat...
cd /d "C:\nexus\apps\n-chat"
echo 🔥 Killing port 3003...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3003') do taskkill /PID %%i /F 2>nul
echo 🧹 Clearing cache...
if exist .next rmdir /s /q .next
echo ⚡ Starting server...
start "N-Chat Server" cmd /k "npx next dev --port 3003"
goto end

:start_crm
echo.
echo 🚀 Starting CRM System...
cd /d "C:\nexus\apps\crm-system"
echo 🔥 Killing port 3004...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3004') do taskkill /PID %%i /F 2>nul
echo 🧹 Clearing cache...
if exist .next rmdir /s /q .next
echo ⚡ Starting server...
start "CRM System Server" cmd /k "npx next dev --port 3004"
goto end

:start_both
echo.
echo 🚀 Starting Both Applications...
call :start_nchat
timeout /t 3 /nobreak > nul
call :start_crm
goto end

:check_ports
echo.
echo 🔍 Checking ports status...
echo.
netstat -ano | findstr :3003 && echo ✅ Port 3003 is BUSY || echo 🟢 Port 3003 is FREE
netstat -ano | findstr :3004 && echo ✅ Port 3004 is BUSY || echo 🟢 Port 3004 is FREE
echo.
pause
goto start

:stop_all
echo.
echo 🛑 Stopping all applications...
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3003') do taskkill /PID %%i /F 2>nul
for /f "tokens=5" %%i in ('netstat -ano ^| findstr :3004') do taskkill /PID %%i /F 2>nul
echo ✅ All applications stopped!
pause
goto start

:clear_cache
echo.
echo 🧹 Clearing all cache...
cd /d "C:\nexus\apps\n-chat"
if exist .next rmdir /s /q .next
cd /d "C:\nexus\apps\crm-system"
if exist .next rmdir /s /q .next
cd /d "C:\nexus"
npm cache clean --force
echo ✅ All cache cleared!
pause
goto start

:invalid
echo.
echo ❌ Invalid choice!
timeout /t 2 > nul
goto start

:exit
echo.
echo 👋 Goodbye!
exit /b 0

:end
echo.
echo 🎉 Operation completed!
pause

:start
cls
goto :eof