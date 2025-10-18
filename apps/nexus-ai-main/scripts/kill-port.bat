@echo off
title Kill Port Process
set PORT=%1
if "%PORT%"=="" set PORT=3000

echo Killing processes on port %PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Port %PORT% cleaned.