@echo off
echo 🚀 بدء عملية النشر التلقائي...

echo 📝 إضافة جميع التغييرات...
git add .

echo 💬 إنشاء commit...
set /p commit_msg="أدخل رسالة الـ commit: "
git commit -m "%commit_msg%"

echo 🌐 رفع التغييرات لـ GitHub...
git push origin master

echo ✅ تم النشر بنجاح!
pause