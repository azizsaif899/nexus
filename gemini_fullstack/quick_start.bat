@echo off
chcp 65001 >nul
echo 🚀 Quick Start - Gemini Fullstack
echo ================================

cd /d E:\azizsys5\gemini_fullstack\backend

echo 📋 Step 1: Load environment
if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do set %%a=%%b
    echo ✅ Environment loaded
) else (
    echo ❌ .env file not found
    pause
    exit /b 1
)

echo 📋 Step 2: Test environment
if defined GEMINI_API_KEY (
    echo ✅ GEMINI_API_KEY loaded: %GEMINI_API_KEY:~0,10%...
) else (
    echo ❌ GEMINI_API_KEY not set
    pause
    exit /b 1
)

echo 📋 Step 3: Start simple server
echo 🌐 Starting on http://127.0.0.1:8000
py -3.10 -c "
import os
os.environ['GEMINI_API_KEY'] = '%GEMINI_API_KEY%'
import sys
sys.path.insert(0, '.')
exec(open('simple_server.py').read())
"