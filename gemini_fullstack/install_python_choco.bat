@echo off
echo 🍫 Installing Python via Chocolatey
echo.

REM Check if chocolatey is installed
choco --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Chocolatey not found. Installing Chocolatey first...
    echo.
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if errorlevel 1 (
        echo ❌ Failed to install Chocolatey
        pause
        exit /b 1
    )
    echo ✅ Chocolatey installed
)

echo 📦 Installing Python 3.11...
choco install python311 -y

echo 🔄 Refreshing environment...
refreshenv

echo ✅ Python installation complete!
echo 🧪 Testing installation...
python --version

pause