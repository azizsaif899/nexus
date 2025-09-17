@echo off
echo 🔧 Fixing and Starting AzizSys Applications...

cd /d e:\azizsys5\g-assistant-nx

echo 📦 Installing dependencies...
npm install

echo 🔨 Building applications...
echo Building Admin Dashboard...
npx nx build admin-dashboard

echo Building Web Chatbot...
npx nx build web-chatbot

echo Building AI Dashboard...
npx nx build ai-dashboard

echo 🚀 Starting applications...

echo Starting Admin Dashboard on port 3000...
start cmd /k "npx nx serve admin-dashboard --port=3000"

timeout /t 5 /nobreak >nul

echo Starting Web Chatbot on port 4200...
start cmd /k "npx nx serve web-chatbot --port=4200"

timeout /t 5 /nobreak >nul

echo Starting AI Dashboard on port 4201...
start cmd /k "npx nx serve ai-dashboard --port=4201"

echo ⏳ Waiting for applications to start...
timeout /t 15 /nobreak >nul

echo ✅ Applications should be ready!
echo.
echo 🌐 Check these URLs:
echo    📊 Admin Dashboard: http://localhost:3000
echo    💬 Web Chatbot: http://localhost:4200
echo    🤖 AI Dashboard: http://localhost:4201
echo.
echo 🔍 If still not working, check the command windows for errors
pause