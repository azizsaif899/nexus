// deploy_to_gas.js - نشر إلى Google Apps Script
const fs = require('fs');
const path = require('path');

function deployToGAS() {
  console.log('📤 تحضير الملفات للنشر في Google Apps Script...\n');

  // قراءة ملف Google Apps Script
  const gasCode = fs.readFileSync(
    path.join(__dirname, 'gas_integration', '99_Code.gs'), 
    'utf8'
  );

  // قراءة ملف الإعدادات
  const appsscriptJson = fs.readFileSync(
    path.join(__dirname, 'gas_integration', 'appsscript.json'), 
    'utf8'
  );

  console.log('✅ ملف 99_Code.gs جاهز للنسخ');
  console.log('✅ ملف appsscript.json جاهز للنسخ');

  console.log('\n📋 خطوات النشر:');
  console.log('1. افتح Google Apps Script: https://script.google.com');
  console.log('2. أنشئ مشروع جديد أو افتح مشروع موجود');
  console.log('3. انسخ محتوى 99_Code.gs إلى ملف Code.gs');
  console.log('4. انسخ محتوى appsscript.json إلى ملف appsscript.json');
  console.log('5. احفظ ونشر كـ Web App');

  console.log('\n🔗 URL الـ Webhook سيكون:');
  console.log('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?source=whatsapp');

  // حفظ الملفات في مجلد منفصل للنسخ السهل
  const deployDir = path.join(__dirname, 'ready_for_gas');
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir);
  }

  fs.writeFileSync(path.join(deployDir, 'Code.gs'), gasCode);
  fs.writeFileSync(path.join(deployDir, 'appsscript.json'), appsscriptJson);

  console.log(`\n📁 الملفات محفوظة في: ${deployDir}`);
}

deployToGAS();