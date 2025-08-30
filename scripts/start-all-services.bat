@echo off
echo 🚀 Starting all AzizSys services...

echo 📡 Starting API Server...
start "API Server" cmd /k "cd /d %~dp0.. && npm run dev:api"

timeout /t 3 /nobreak >nul

echo 🎨 Starting Admin Dashboard...
start "Admin Dashboard" cmd /k "cd /d %~dp0.. && npm run dev:admin-dashboard"

timeout /t 3 /nobreak >nul

echo 💬 Starting Web Chatbot...
start "Web Chatbot" cmd /k "cd /d %~dp0.. && npm run dev:web-chatbot"

timeout /t 3 /nobreak >nul

echo 🐍 Starting Gemini Backend...
start "Gemini Backend" cmd /k "cd /d %~dp0..\apps\gemini-research-agent && python main.py"

echo ✅ All services started!
echo 📊 Check services at:
echo   - API Server: http://localhost:3000
echo   - Admin Dashboard: http://localhost:4200
echo   - Web Chatbot: http://localhost:4201
echo   - Gemini Backend: http://localhost:8000

pause