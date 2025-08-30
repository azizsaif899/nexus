@echo off
echo 🔧 Fixing Odoo Access Denied Error...

echo 1️⃣ Stopping all containers...
docker-compose -f ../docker/odoo-setup.yml down

echo 2️⃣ Removing old volumes (this will reset data)...
docker volume rm azizsys5_postgres_data 2>nul
docker volume rm azizsys5_odoo_data 2>nul

echo 3️⃣ Checking if ports are free...
netstat -an | findstr :8069
if %errorlevel% equ 0 (
    echo ⚠️ Port 8069 is in use. Killing processes...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8069') do taskkill /PID %%a /F 2>nul
)

netstat -an | findstr :5432
if %errorlevel% equ 0 (
    echo ⚠️ Port 5432 is in use. Killing processes...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5432') do taskkill /PID %%a /F 2>nul
)

echo 4️⃣ Starting with fresh setup...
docker-compose -f ../docker/odoo-setup.yml up -d

echo 5️⃣ Waiting for services...
timeout /t 45 /nobreak >nul

echo 6️⃣ Checking status...
docker-compose -f ../docker/odoo-setup.yml ps

echo ✅ Try accessing: http://localhost:8069
echo 📊 Database name: odoo
echo 👤 Username: admin (create on first visit)

pause