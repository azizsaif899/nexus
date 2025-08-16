@echo off
echo 🚀 Quick Start Odoo (Fixed Ports)

echo 🛑 Stopping any running containers...
docker stop azizsys_odoo azizsys_postgres 2>nul
docker rm azizsys_odoo azizsys_postgres 2>nul

echo 🗄️ Starting PostgreSQL on port 5433...
docker run -d --name azizsys_postgres ^
  -e POSTGRES_DB=postgres ^
  -e POSTGRES_USER=odoo ^
  -e POSTGRES_PASSWORD=odoo123 ^
  -p 5433:5432 ^
  postgres:15

echo ⏳ Waiting for PostgreSQL...
timeout /t 10 /nobreak >nul

echo 🏢 Starting Odoo on port 8070...
docker run -d --name azizsys_odoo ^
  --link azizsys_postgres:db ^
  -e HOST=db ^
  -e USER=odoo ^
  -e PASSWORD=odoo123 ^
  -p 8070:8069 ^
  odoo:17.0

echo ⏳ Waiting for Odoo to start...
timeout /t 30 /nobreak >nul

echo ✅ Done! 
echo 🌐 Open: http://localhost:8070
echo 📊 Database: postgres
echo 👤 Create admin account on first visit

pause