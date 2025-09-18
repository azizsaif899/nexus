@echo off
echo 🔄 بدء المزامنة التلقائية...

cd /d "%~dp0\.."

echo 📥 جلب التحديثات...
git fetch origin main

echo 📝 إضافة التغييرات...
git add .

echo 💾 حفظ التغييرات...
git commit -m "🔄 Auto sync: %date% %time%" 2>nul

echo 📤 رفع التحديثات...
git push origin main

echo ✅ تمت المزامنة بنجاح!
pause