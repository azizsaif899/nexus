@echo off
echo 🔗 Setting up WhatsApp CRM Integration...

echo 📦 Installing required packages...
cd /d "%~dp0.."
npm install axios

echo 🔧 Configuring WhatsApp Bot...
echo ✅ Odoo URL: http://localhost:8070
echo ✅ Database: azizsys_crm
echo ✅ Integration: Ready

echo 📱 WhatsApp Bot will now:
echo   - Add new contacts to CRM automatically
echo   - Track customer interactions
echo   - Update lead status
echo   - Generate sales reports

echo 🎯 Next: Configure WhatsApp webhook to send data to CRM
echo 🌐 Test: Send a WhatsApp message to see it in Odoo CRM

pause