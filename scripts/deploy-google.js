#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 نشر Nexus AI على Google...\n');

// فحص متطلبات النشر
function checkRequirements() {
  console.log('📋 فحص المتطلبات...');
  
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    console.log('✅ Firebase CLI مثبت');
  } catch {
    console.log('❌ Firebase CLI غير مثبت');
    console.log('تثبيت: npm install -g firebase-tools');
    process.exit(1);
  }
}

// بناء التطبيق
function buildApp() {
  console.log('\n🔨 بناء التطبيق...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ تم بناء التطبيق بنجاح');
  } catch (error) {
    console.log('❌ فشل في بناء التطبيق');
    process.exit(1);
  }
}

// النشر على Firebase
function deployToFirebase() {
  console.log('\n🚀 النشر على Firebase...');
  
  try {
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    console.log('\n✅ تم النشر بنجاح!');
    console.log('🌐 التطبيق متاح على: https://your-project.web.app');
  } catch (error) {
    console.log('❌ فشل في النشر');
    process.exit(1);
  }
}

// تشغيل عملية النشر
async function main() {
  try {
    checkRequirements();
    buildApp();
    deployToFirebase();
    
    console.log('\n🎉 تم النشر بنجاح!');
    console.log('📱 يمكنك الآن الوصول للتطبيق من أي مكان');
    
  } catch (error) {
    console.error('❌ خطأ في النشر:', error.message);
    process.exit(1);
  }
}

main();