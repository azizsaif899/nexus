@echo off
cd /d "c:\nexus\apps\nexus-ai-main"
echo Testing minimal setup...
echo.

REM Check if dependencies exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Start with minimal config
echo Starting server...
npx vite --port 3000 --host localhost