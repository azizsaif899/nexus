@echo off
title Nexus AI Simple Start
echo 🚀 Starting Nexus AI...

REM Kill port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do taskkill /PID %%a /F >nul 2>&1

REM Go to directory
cd /d "%~dp0apps\nexus-ai-main"

REM Start with basic vite command
echo ✅ Server starting on http://localhost:3000
vite --port 3000 --host 0.0.0.0