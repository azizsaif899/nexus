@echo off
echo ⚡ تحديث سريع - Nexus AI
echo =======================

npm run build && firebase deploy --only hosting

echo ✅ تم!
pause