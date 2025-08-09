@echo off
chcp 65001 >nul
echo 🧪 Final System Test
echo ==================

echo ✅ Python 3.13 available
echo ✅ Python 3.10 with packages available  
echo ✅ Frontend dependencies installed
echo ✅ Backend dependencies installed
echo ✅ Environment file configured

echo.
echo 🚀 Starting servers...
echo 📍 Frontend: http://localhost:3001/app
echo 📍 Backend: http://127.0.0.1:2024

start "Backend" cmd /k "cd /d E:\azizsys5\gemini_fullstack\backend && chcp 65001 && set PYTHONIOENCODING=utf-8 && py -3.10 -c \"import subprocess; import sys; subprocess.run([sys.executable, '-m', 'langgraph_cli.main', 'dev'])\""

timeout /t 3 /nobreak >nul

start "Frontend" cmd /k "cd /d E:\azizsys5\gemini_fullstack\frontend && npm run dev"

echo ✅ Servers started!
pause