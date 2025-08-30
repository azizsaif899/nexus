@echo off
echo 🚀 Setting up Odoo CRM for AzizSys...

echo 📦 Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found! Please install Docker Desktop first.
    echo 📥 Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker found!

echo 🔧 Starting Odoo services...
cd /d "%~dp0..\docker"
docker-compose -f odoo-setup.yml up -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

echo 🌐 Checking Odoo status...
curl -s http://localhost:8069 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Odoo is running!
    echo 🎯 Access Odoo at: http://localhost:8069
    echo 📊 Database: odoo
    echo 👤 Create your admin account on first visit
) else (
    echo ⏳ Odoo is still starting... please wait a few more minutes
    echo 🔍 Check status: docker-compose -f odoo-setup.yml logs odoo
)

echo.
echo 📋 Next Steps:
echo 1. Open http://localhost:8069 in your browser
echo 2. Create database and admin account
echo 3. Install CRM module
echo 4. Configure integration with AzizSys
echo.
pause