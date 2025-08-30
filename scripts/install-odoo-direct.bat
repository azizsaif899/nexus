@echo off
echo 🚀 Installing Odoo without Docker

echo 📦 Installing Python and pip...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found! 
    echo 📥 Download Python from: https://www.python.org/downloads/
    echo ✅ Make sure to check "Add to PATH" during installation
    pause
    exit /b 1
)

echo ✅ Python found!

echo 📦 Installing PostgreSQL...
echo 📥 Download PostgreSQL from: https://www.postgresql.org/download/windows/
echo 🔧 Install with default settings, remember the password!
echo.
set /p pg_password="Enter PostgreSQL password you set: "

echo 📦 Installing Odoo...
pip install odoo

echo 🗄️ Creating database...
createdb -U postgres -h localhost odoo_azizsys

echo 🚀 Starting Odoo...
echo ✅ Odoo will start on: http://localhost:8069
echo 📊 Database: odoo_azizsys
echo 👤 Create admin account on first visit

odoo --addons-path=addons --database=odoo_azizsys --db_host=localhost --db_user=postgres --db_password=%pg_password%

pause