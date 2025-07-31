@echo off
echo 🔍 Verifying Python Installation
echo ===============================

python --version 2>nul
if errorlevel 1 (
    echo ❌ Python not found in PATH
    echo 💡 Solution: Run install_python_safe.bat
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ Python version: %PYTHON_VERSION%

echo %PYTHON_VERSION% | findstr "3.1[1-9]" >nul
if errorlevel 1 (
    echo ❌ Python version too old (need 3.11+)
    echo 💡 Current: %PYTHON_VERSION%
    echo 💡 Required: 3.11+
    pause
    exit /b 1
)

echo ✅ Python version compatible

echo 📦 Testing pip...
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip not found
    pause
    exit /b 1
)
echo ✅ pip working

echo 🧪 Testing backend installation...
cd backend
pip install . >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend installation failed
    echo 💡 Try: pip install --upgrade pip
    pause
    exit /b 1
)

echo ✅ All checks passed! System ready.
echo 🚀 Run: start.bat to launch the application
pause