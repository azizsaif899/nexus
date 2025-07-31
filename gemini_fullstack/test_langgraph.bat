@echo off
chcp 65001 >nul
cd /d E:\azizsys5\gemini_fullstack\backend

echo 🧪 Testing LangGraph CLI...
echo.

echo 📋 Step 1: Check langgraph command
C:\Users\dmm-dgn2\AppData\Local\Programs\Python\Python310\Scripts\langgraph.exe --version
echo.

echo 📋 Step 2: Check config file
if exist langgraph.json (
    echo ✅ langgraph.json found
    type langgraph.json
) else (
    echo ❌ langgraph.json not found
)
echo.

echo 📋 Step 3: Check environment
if defined GEMINI_API_KEY (
    echo ✅ GEMINI_API_KEY is set
) else (
    echo ❌ GEMINI_API_KEY not set
)
echo.

echo 📋 Step 4: Test dev command (5 seconds)
echo Starting langgraph dev...
start /B C:\Users\dmm-dgn2\AppData\Local\Programs\Python\Python310\Scripts\langgraph.exe dev --config langgraph.json
timeout /t 5 /nobreak >nul
echo.

echo 📋 Step 5: Check if server started
netstat -a -n | findstr :2024
if errorlevel 1 (
    echo ❌ Server not running on port 2024
) else (
    echo ✅ Server running on port 2024
)

pause