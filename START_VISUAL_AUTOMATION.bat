@echo off
echo 🚀 Starting Visual Automation on Port 3005...
cd /d "C:\nexus\apps\visual-automation"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install --legacy-peer-deps
)

echo 🎯 Launching Visual Automation...
echo 📍 URL: http://localhost:3005
echo ⏹️ Close this window to stop the server

start "Visual Automation" cmd /k "npm run dev"

echo ✅ Visual Automation started in new window!
echo 🌐 Open: http://localhost:3005
pause