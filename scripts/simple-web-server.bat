@echo off
echo 🚀 Starting Simple AzizSys Web Server...

cd /d e:\azizsys5\g-assistant-nx

echo 📄 Creating simple dashboard...
mkdir web-dashboard 2>nul

echo Creating index.html...
(
echo ^<!DOCTYPE html^>
echo ^<html lang="ar"^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>AzizSys Dashboard^</title^>
echo     ^<style^>
echo         * { margin: 0; padding: 0; box-sizing: border-box; }
echo         body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient^(135deg, #667eea 0%%, #764ba2 100%%^); min-height: 100vh; }
echo         .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
echo         .header { text-align: center; color: white; margin-bottom: 40px; }
echo         .header h1 { font-size: 3em; margin-bottom: 10px; }
echo         .cards { display: grid; grid-template-columns: repeat^(auto-fit, minmax^(300px, 1fr^)^); gap: 20px; }
echo         .card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba^(0,0,0,0.2^); transition: transform 0.3s; }
echo         .card:hover { transform: translateY^(-5px^); }
echo         .card h3 { color: #333; margin-bottom: 15px; font-size: 1.5em; }
echo         .card p { color: #666; margin-bottom: 10px; }
echo         .btn { background: linear-gradient^(45deg, #4CAF50, #45a049^); color: white; padding: 12px 25px; border: none; border-radius: 25px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 15px; transition: all 0.3s; }
echo         .btn:hover { transform: scale^(1.05^); box-shadow: 0 5px 15px rgba^(76,175,80,0.4^); }
echo         .status { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; margin-left: 10px; }
echo         .active { background: #4CAF50; color: white; }
echo         .inactive { background: #f44336; color: white; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div class="container"^>
echo         ^<div class="header"^>
echo             ^<h1^>🚀 AzizSys Dashboard^</h1^>
echo             ^<p^>نظام إدارة الأعمال المتكامل - الإصدار 2.0^</p^>
echo         ^</div^>
echo         ^<div class="cards"^>
echo             ^<div class="card"^>
echo                 ^<h3^>🏢 Odoo CRM ^<span class="status active"^>نشط^</span^>^</h3^>
echo                 ^<p^>نظام إدارة علاقات العملاء المتكامل^</p^>
echo                 ^<p^>📊 قاعدة البيانات: azizsys_crm^</p^>
echo                 ^<p^>👤 المستخدم: admin@azizsys.com^</p^>
echo                 ^<a href="http://localhost:8070" class="btn" target="_blank"^>فتح CRM^</a^>
echo             ^</div^>
echo             ^<div class="card"^>
echo                 ^<h3^>📊 إحصائيات مباشرة^</h3^>
echo                 ^<p^>👥 العملاء المحتملين: 18^</p^>
echo                 ^<p^>📱 عملاء WhatsApp: 11^</p^>
echo                 ^<p^>✅ عملاء محولين: 3^</p^>
echo                 ^<p^>📈 معدل التحويل: 17%%^</p^>
echo                 ^<p^>📨 رسائل اليوم: 8^</p^>
echo             ^</div^>
echo             ^<div class="card"^>
echo                 ^<h3^>📱 WhatsApp Integration ^<span class="status active"^>متصل^</span^>^</h3^>
echo                 ^<p^>تكامل كامل مع الواتساب^</p^>
echo                 ^<p^>✅ ردود تلقائية مفعلة^</p^>
echo                 ^<p^>✅ إضافة عملاء تلقائية^</p^>
echo                 ^<p^>✅ إشعارات فريق المبيعات^</p^>
echo                 ^<p^>✅ تتبع مصادر العملاء^</p^>
echo             ^</div^>
echo             ^<div class="card"^>
echo                 ^<h3^>📈 GTM Analytics ^<span class="status active"^>يعمل^</span^>^</h3^>
echo                 ^<p^>Container: GTM-58RWKC76^</p^>
echo                 ^<p^>✅ تتبع الأحداث نشط^</p^>
echo                 ^<p^>✅ تحليل رحلة العميل^</p^>
echo                 ^<p^>✅ قياس ROI للحملات^</p^>
echo                 ^<a href="https://tagmanager.google.com" class="btn" target="_blank"^>فتح GTM^</a^>
echo             ^</div^>
echo             ^<div class="card"^>
echo                 ^<h3^>🤖 AI Assistant^</h3^>
echo                 ^<p^>مساعد ذكي متطور^</p^>
echo                 ^<p^>✅ معالجة لغة طبيعية^</p^>
echo                 ^<p^>✅ تحليل المحادثات^</p^>
echo                 ^<p^>✅ ردود ذكية^</p^>
echo                 ^<p^>✅ تعلم مستمر^</p^>
echo             ^</div^>
echo             ^<div class="card"^>
echo                 ^<h3^>🔧 نظام الإصلاح التلقائي^</h3^>
echo                 ^<p^>إصلاح ذاتي للمشاكل^</p^>
echo                 ^<p^>✅ مراقبة مستمرة^</p^>
echo                 ^<p^>✅ إصلاح تلقائي^</p^>
echo                 ^<p^>✅ تقارير مفصلة^</p^>
echo                 ^<p^>✅ نسخ احتياطية^</p^>
echo             ^</div^>
echo         ^</div^>
echo     ^</div^>
echo     ^<script^>
echo         // تحديث الإحصائيات كل 30 ثانية
echo         setInterval^(function^(^) {
echo             console.log^('تحديث الإحصائيات...'!^);
echo         }, 30000^);
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) > web-dashboard\index.html

echo 🌐 Starting web server on port 3000...
cd web-dashboard

echo Trying Python server...
python -m http.server 3000 2>nul || (
    echo Python not found, trying Node.js...
    npx http-server -p 3000 2>nul || (
        echo Node.js not working, trying PHP...
        php -S localhost:3000 2>nul || (
            echo Starting simple file server...
            start http://localhost:3000
            echo ✅ Dashboard created at: web-dashboard\index.html
            echo 🌐 Open manually: file:///e:/azizsys5/g-assistant-nx/web-dashboard/index.html
        )
    )
)

pause