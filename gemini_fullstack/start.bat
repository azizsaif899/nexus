@echo off
echo 🚀 Starting Gemini Fullstack Application...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.11+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
pip install . >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..

echo.
echo 🎯 Starting servers...
echo 📍 Backend will run on: http://127.0.0.1:2024
echo 📍 Frontend will run on: http://localhost:3001/app
echo ⚠️  Port 5000 is busy, using 3001 instead
echo.

REM Start both servers
start "Backend Server" cmd /k "cd backend && langgraph dev"
timeout /t 5 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo ✅ Servers started successfully!
echo 🌐 Open http://localhost:3001/app in your browser
pause