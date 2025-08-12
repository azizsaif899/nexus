@echo off
chcp 65001 >nul
title AzizSys AI Assistant v2.0 - Master Control

echo.
echo +--------------------------------------------------------------+
echo ^|                AzizSys AI Assistant v2.0                     ^|
echo ^|                    Master Control System                     ^|
echo +--------------------------------------------------------------+
echo.

:MENU
echo Select an option:
echo.
echo [1] Start Full System v2.0
echo [2] Run Daily Maintenance
echo [3] Run Comprehensive Tests
echo [4] Run Security and Performance Check
echo [5] Display System Status
echo [6] Stop All Services
echo [7] Launch NexusChat Pro
echo [0] Exit
echo.

set /p choice="Enter your choice (0-7): "

if "%choice%"=="1" goto START_FULL_SYSTEM
if "%choice%"=="2" goto DAILY_MAINTENANCE
if "%choice%"=="3" goto SYSTEM_TEST
if "%choice%"=="4" goto SECURITY_CHECK
if "%choice%"=="5" goto SYSTEM_STATUS
if "%choice%"=="6" goto STOP_ALL
if "%choice%"=="7" goto NEXUS_CHAT
if "%choice%"=="0" goto EXIT
goto INVALID_CHOICE

:START_FULL_SYSTEM
echo.
echo Starting Full System v2.0...
echo Please wait, this may take a moment...
echo.

echo 1. Building all necessary applications...
call nx run-many --target=build --projects=api,gateway,web-chatbot,admin-dashboard

echo 2. Starting services in the background...
start "API Server" cmd /c "nx serve api"
start "Gateway Server" cmd /c "nx serve gateway"
start "Gemini Backend" cmd /c "npm run gemini:backend"

echo Activating smart agents...
call npm run activate:cfo-agent
call npm run activate:developer-agent
call npm run activate:database-manager
call npm run activate:operations-agent
call npm run activate:general-agent

echo Activating processing modes...
call npm run activate:smart-mode
call npm run activate:iterative-mode
call npm run activate:analysis-mode

echo.
echo [+] System started successfully!
echo [+] Main Gateway available at: http://localhost:4201
echo.
echo    - Home (Chatbot): http://localhost:4201
echo    - Admin Dashboard: http://localhost:4201/admin
echo    - Health Check: http://localhost:4201/health
echo.
echo Opening NexusChat Pro in your browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:5176

echo.
pause
goto MENU

:DAILY_MAINTENANCE
echo.
echo Starting daily maintenance...
echo.

echo Checking system health...
call npm run health-check:v2

echo Running comprehensive auto-fix...
call npm run auto-fix:v2

echo Checking smart agents...
call npm run fix:sidebar-agents

echo Checking Python services...
call npm run fix:python-services

echo Checking hybrid integration...
call npm run fix:hybrid-integration

echo.
echo [+] Daily maintenance complete!
echo [+] Check reports in docs/6_fixing/reports/
echo.
pause
goto MENU

:SYSTEM_TEST
echo.
echo Starting comprehensive system tests...
echo.

echo Running unit tests...
call npm run test:all

echo Running advanced integration tests...
call npm run test:integration-advanced

echo Running performance tests...
call npm run test:performance-stress

echo Running security tests...
call npm run test:security-advanced

echo.
echo [+] All tests complete!
echo.
pause
goto MENU

:SECURITY_CHECK
echo.
echo Starting security and performance check...
echo.

echo Activating advanced security...
call npm run activate:advanced-security

echo Activating performance optimization...
call npm run activate:performance-optimization

echo Activating enhanced analytics...
call npm run activate:enhanced-analytics

echo.
echo [+] Security and performance check complete!
echo.
pause
goto MENU

:SYSTEM_STATUS
echo.
echo Displaying system status...
echo.

echo Checking services...
curl -s http://localhost:4201/api/health 2>nul && echo [+] API Server (via Gateway): Online || echo [-] API Server (via Gateway): Offline
curl -s http://localhost:4201/admin 2>nul && echo [+] Admin Dashboard (via Gateway): Online || echo [-] Admin Dashboard (via Gateway): Offline
curl -s http://localhost:4201 2>nul && echo [+] Web Chatbot (via Gateway): Online || echo [-] Web Chatbot (via Gateway): Offline
curl -s http://localhost:4201/research/health 2>nul && echo [+] Gemini Backend (via Gateway): Online || echo [-] Gemini Backend (via Gateway): Offline

echo.
echo System Statistics:
call npm run system:complete

echo.
pause
goto MENU

:STOP_ALL
echo.
echo Stopping all services...
echo.

taskkill /f /im node.exe 2>nul
taskkill /f /im python.exe 2>nul
taskkill /f /im uvicorn.exe 2>nul

echo [+] All services stopped!
echo.
pause
goto MENU

:NEXUS_CHAT
echo.
echo Starting NexusChat Pro - Advanced AI Interface...
echo.
cd apps\nexus-chat
if not exist node_modules (
    echo Installing dependencies...
    npm install
)
if not exist .env (
    echo Setting up environment...
    copy .env.example .env 2>nul || (
        echo VITE_API_KEY=your_gemini_api_key_here > .env
    )
    echo Please edit .env file and add your Gemini API key
    pause
)
echo.
echo [+] NexusChat Pro starting on http://localhost:5173
echo [+] Opening in browser...
echo.
start http://localhost:5173
npm run dev
cd ..\..
echo.
pause
goto MENU

:INVALID_CHOICE
echo.
echo Invalid choice! Please select a number from 0 to 7.
echo.
pause
goto MENU

:EXIT
echo.
echo Thank you for using AzizSys AI Assistant v2.0!
echo.
pause
exit