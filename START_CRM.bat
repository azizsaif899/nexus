@echo off
echo 🚀 Starting CRM Nxs on Port 4100...
cd /d "C:\nexus\apps\CRM"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🎯 Launching CRM Nxs...
echo 📍 URL: http://localhost:4100
echo ⏹️ Close this window to stop the server

start "CRM Nxs" cmd /k "npm run dev"

echo ✅ CRM Nxs started in new window!
echo 🌐 Open: http://localhost:4100
pause