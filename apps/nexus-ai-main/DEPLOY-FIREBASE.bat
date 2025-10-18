@echo off
echo 🚀 رفع Nexus AI على Firebase
echo ============================

echo 📦 بناء المشروع...
npm run build

echo 🔥 رفع على Firebase...
firebase deploy --only hosting

echo ✅ تم الرفع بنجاح!
echo 🌐 الرابط: https://nexus-ai-main.web.app

pause