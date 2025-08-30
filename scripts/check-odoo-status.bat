@echo off
echo 🔍 Checking Odoo Status...

echo 📊 Docker Containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 📋 Odoo Logs (last 20 lines):
docker logs azizsys_odoo --tail 20

echo.
echo 📋 PostgreSQL Logs (last 10 lines):
docker logs azizsys_postgres --tail 10

echo.
echo 🌐 Testing Connection:
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:8069

echo.
echo 🔧 If still having issues, run: fix-odoo-permissions.bat
pause