@echo off
echo 🔥 Starting Firebase Data Connect Development Environment...
echo.

echo 📋 Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

echo.
echo 🚀 Starting Data Connect Emulator...
echo 📍 GraphQL Playground: http://localhost:9399/graphql
echo 🎛️  Firebase UI: http://localhost:4000
echo.

cd /d "%~dp0"
firebase emulators:start --only dataconnect,ui

pause