@echo off
echo Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel%==0 (
    echo ✅ Node.js processes stopped successfully
) else (
    echo ℹ️ No Node.js processes were running
)

echo Freeing ports...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :4000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :3001') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :3002') do taskkill /f /pid %%a 2>nul

echo ✅ Cleanup completed
timeout /t 2 /nobreak >nul