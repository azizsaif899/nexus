@echo off
echo Starting Nexus AI Main Application...
echo.

REM Kill any existing processes on port 3000
echo Cleaning up port 3000...
npx kill-port 3000 2>nul

REM Change to the application directory
cd /d "C:\nexus\apps\nexus-ai-main"

REM Start the development server
echo Starting development server on http://localhost:3000
echo.
npx vite --port 3000 --host

pause