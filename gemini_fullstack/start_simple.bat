@echo off
echo 🚀 Starting Gemini Fullstack (Simple Mode)...
echo.

REM Check ports
echo 🔍 Checking available ports...
netstat -an | findstr :3001 >nul
if not errorlevel 1 (
    echo ❌ Port 3001 is busy
    set FRONTEND_PORT=3002
) else (
    set FRONTEND_PORT=3001
)

netstat -an | findstr :2024 >nul  
if not errorlevel 1 (
    echo ❌ Port 2024 is busy
    set BACKEND_PORT=2025
) else (
    set BACKEND_PORT=2024
)

echo ✅ Using ports: Frontend=%FRONTEND_PORT%, Backend=%BACKEND_PORT%
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend ready
echo 🌐 Starting frontend on port %FRONTEND_PORT%...
start cmd /k "npm run dev -- --port %FRONTEND_PORT%"

echo.
echo ✅ Frontend started!
echo 📍 Open: http://localhost:%FRONTEND_PORT%/app
echo.
echo ⚠️  Backend requires Python 3.11+ and manual setup
echo 💡 For full functionality, install Python 3.11+ and run:
echo    cd backend && pip install . && langgraph dev
echo.
pause