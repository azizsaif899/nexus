@echo off
echo 🚀 Creating Simple AzizSys Dashboard...

cd /d e:\azizsys5\g-assistant-nx

echo 📄 Creating simple HTML dashboard...
mkdir simple-dashboard 2>nul

echo ^<!DOCTYPE html^> > simple-dashboard\index.html
echo ^<html^> >> simple-dashboard\index.html
echo ^<head^> >> simple-dashboard\index.html
echo     ^<title^>AzizSys Dashboard^</title^> >> simple-dashboard\index.html
echo     ^<style^> >> simple-dashboard\index.html
echo         body { font-family: Arial; margin: 40px; background: #f5f5f5; } >> simple-dashboard\index.html
echo         .container { max-width: 1200px; margin: 0 auto; } >> simple-dashboard\index.html
echo         .header { background: #2196F3; color: white; padding: 20px; border-radius: 8px; } >> simple-dashboard\index.html
echo         .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; } >> simple-dashboard\index.html
echo         .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); } >> simple-dashboard\index.html
echo         .btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; } >> simple-dashboard\index.html
echo         .btn:hover { background: #45a049; } >> simple-dashboard\index.html
echo     ^</style^> >> simple-dashboard\index.html
echo ^</head^> >> simple-dashboard\index.html
echo ^<body^> >> simple-dashboard\index.html
echo     ^<div class="container"^> >> simple-dashboard\index.html
echo         ^<div class="header"^> >> simple-dashboard\index.html
echo             ^<h1^>🚀 AzizSys Dashboard^</h1^> >> simple-dashboard\index.html
echo             ^<p^>نظام إدارة الأعمال المتكامل^</p^> >> simple-dashboard\index.html
echo         ^</div^> >> simple-dashboard\index.html
echo         ^<div class="cards"^> >> simple-dashboard\index.html
echo             ^<div class="card"^> >> simple-dashboard\index.html
echo                 ^<h3^>🏢 Odoo CRM^</h3^> >> simple-dashboard\index.html
echo                 ^<p^>نظام إدارة علاقات العملاء^</p^> >> simple-dashboard\index.html
echo                 ^<a href="http://localhost:8070" class="btn" target="_blank"^>فتح CRM^</a^> >> simple-dashboard\index.html
echo             ^</div^> >> simple-dashboard\index.html
echo             ^<div class="card"^> >> simple-dashboard\index.html
echo                 ^<h3^>📊 إحصائيات CRM^</h3^> >> simple-dashboard\index.html
echo                 ^<p^>العملاء المحتملين: 15^</p^> >> simple-dashboard\index.html
echo                 ^<p^>عملاء WhatsApp: 8^</p^> >> simple-dashboard\index.html
echo                 ^<p^>معدل التحويل: 20%%^</p^> >> simple-dashboard\index.html
echo             ^</div^> >> simple-dashboard\index.html
echo             ^<div class="card"^> >> simple-dashboard\index.html
echo                 ^<h3^>📱 WhatsApp Integration^</h3^> >> simple-dashboard\index.html
echo                 ^<p^>تكامل كامل مع الواتساب^</p^> >> simple-dashboard\index.html
echo                 ^<p^>✅ ردود تلقائية^</p^> >> simple-dashboard\index.html
echo                 ^<p^>✅ إضافة عملاء تلقائية^</p^> >> simple-dashboard\index.html
echo             ^</div^> >> simple-dashboard\index.html
echo             ^<div class="card"^> >> simple-dashboard\index.html
echo                 ^<h3^>📈 GTM Analytics^</h3^> >> simple-dashboard\index.html
echo                 ^<p^>Container: GTM-58RWKC76^</p^> >> simple-dashboard\index.html
echo                 ^<p^>✅ تتبع نشط^</p^> >> simple-dashboard\index.html
echo                 ^<a href="https://tagmanager.google.com" class="btn" target="_blank"^>فتح GTM^</a^> >> simple-dashboard\index.html
echo             ^</div^> >> simple-dashboard\index.html
echo         ^</div^> >> simple-dashboard\index.html
echo     ^</div^> >> simple-dashboard\index.html
echo ^</body^> >> simple-dashboard\index.html
echo ^</html^> >> simple-dashboard\index.html

echo 🌐 Starting simple HTTP server...
cd simple-dashboard
start cmd /k "python -m http.server 3000 || npx http-server -p 3000"

echo ✅ Simple Dashboard created!
echo 🌐 Open: http://localhost:3000
pause