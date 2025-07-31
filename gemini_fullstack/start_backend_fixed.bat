@echo off
chcp 65001 >nul
cd /d E:\azizsys5\gemini_fullstack\backend

echo 🚀 Starting LangGraph Backend...
echo 📍 Config: langgraph.json
echo 📍 Port: 2024
echo.

set PYTHONIOENCODING=utf-8
set PYTHONPATH=%CD%

echo 🔧 Environment check:
py -3.10 --version
echo GEMINI_API_KEY: %GEMINI_API_KEY:~0,10%...
echo.

echo 🌐 Starting server...
C:\Users\dmm-dgn2\AppData\Local\Programs\Python\Python310\Scripts\langgraph.exe dev --config langgraph.json

pause