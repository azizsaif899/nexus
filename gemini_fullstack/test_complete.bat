@echo off
chcp 65001 >nul
echo 🧪 Complete System Test
echo ======================

echo 📋 Test Scenarios:
echo 1. Test Agent - Simple chat
echo 2. Main Agent - Web research
echo 3. WebSocket connectivity
echo 4. Live updates
echo.

echo 🚀 Starting servers...
start "Backend" cmd /k "cd /d E:\azizsys5\gemini_fullstack\backend && chcp 65001 && set PYTHONIOENCODING=utf-8 && py -3.10 -c \"import subprocess; import sys; subprocess.run([sys.executable, '-m', 'langgraph_cli.main', 'dev'])\""

timeout /t 5 /nobreak >nul

start "Frontend" cmd /k "cd /d E:\azizsys5\gemini_fullstack\frontend && npm run dev"

echo.
echo 🧪 Test Instructions:
echo.
echo 📍 Frontend: http://localhost:3001/app
echo 📍 LangGraph UI: http://127.0.0.1:2024
echo.
echo 🔧 Test Agent (Simple):
echo   - Click "Test Agent" button
echo   - Type: "hello"
echo   - Type: "test"
echo   - Verify responses
echo.
echo 🔍 Main Agent (Research):
echo   - Click "Main Agent" button  
echo   - Ask: "What is AI?"
echo   - Watch live updates
echo   - Check citations
echo.
echo 🌐 LangGraph UI:
echo   - Open: http://127.0.0.1:2024
echo   - Test both agents
echo   - View execution graphs
echo.

pause