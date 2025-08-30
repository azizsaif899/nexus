#!/usr/bin/env node

/**
 * سكربت نشر تطبيقات G-Assistant
 */

const { execSync } = require('child_process');

const app = process.argv[2];

if (!app) {
  console.log('الاستخدام: node scripts/deploy.js <app-name>');
  console.log('التطبيقات المتاحة: sheets-addon, web-chatbot, admin-dashboard');
  process.exit(1);
}

console.log(`🚀 نشر تطبيق ${app}...`);

try {
  switch (app) {
    case 'sheets-addon':
      execSync('nx deploy sheets-addon', { stdio: 'inherit' });
      break;
    case 'web-chatbot':
      execSync('nx deploy web-chatbot', { stdio: 'inherit' });
      break;
    case 'admin-dashboard':
      execSync('nx deploy admin-dashboard', { stdio: 'inherit' });
      break;
    default:
      console.error(`❌ تطبيق غير معروف: ${app}`);
      process.exit(1);
  }
  
  console.log(`✅ تم نشر ${app} بنجاح!`);
} catch (error) {
  console.error(`❌ فشل في نشر ${app}:`, error.message);
  process.exit(1);
}