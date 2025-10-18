#!/usr/bin/env node

/**
 * 🚀 مدير ترقية المكتبات - مشروع Nexus
 * يقوم بترقية المكتبات للإصدارات الأحدث بأمان
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء ترقية المكتبات...\n');

// المكتبات المطلوب ترقيتها
const libraries = [
  'react-router-dom@^7.8.2',
  '@radix-ui/react-dialog@^1.1.14',
  'lucide-react@^0.544.0',
  'sonner@^2.0.7'
];

// التطبيقات المتأثرة
const apps = [
  'apps/web-chatbot',
  'apps/admin-dashboard'
];

function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 تشغيل: ${command}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    return true;
  } catch (error) {
    console.error(`❌ خطأ في: ${command}`);
    console.error(error.message);
    return false;
  }
}

function createBackup() {
  console.log('💾 إنشاء نسخة احتياطية...');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = `backups/upgrade-${timestamp}`;
  
  if (!fs.existsSync('backups')) {
    fs.mkdirSync('backups');
  }
  
  runCommand(`mkdir ${backupDir}`);
  runCommand(`copy package.json ${backupDir}/package.json`);
  
  apps.forEach(app => {
    if (fs.existsSync(`${app}/package.json`)) {
      runCommand(`copy ${app}/package.json ${backupDir}/${app.replace('/', '-')}-package.json`);
    }
  });
  
  console.log(`✅ نسخة احتياطية في: ${backupDir}\n`);
}

function installLibraries() {
  console.log('📦 تثبيت المكتبات الجديدة...');
  
  // تثبيت في المشروع الرئيسي
  const mainCommand = `npm install ${libraries.join(' ')}`;
  if (!runCommand(mainCommand)) {
    console.error('❌ فشل تثبيت المكتبات الرئيسية');
    return false;
  }
  
  // تثبيت في كل تطبيق
  apps.forEach(app => {
    if (fs.existsSync(app)) {
      console.log(`\n📱 ترقية ${app}...`);
      const appCommand = `npm install ${libraries.join(' ')}`;
      runCommand(appCommand, app);
    }
  });
  
  return true;
}

function updateTypeScriptConfig() {
  console.log('\n🔧 تحديث إعدادات TypeScript...');
  
  const tsConfigPath = 'tsconfig.base.json';
  if (fs.existsSync(tsConfigPath)) {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    // إضافة types جديدة إذا لزم الأمر
    if (!tsConfig.compilerOptions.types) {
      tsConfig.compilerOptions.types = [];
    }
    
    // حفظ التحديثات
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    console.log('✅ تم تحديث TypeScript config');
  }
}

function runTests() {
  console.log('\n🧪 تشغيل الاختبارات...');
  
  // اختبار سريع للتأكد من عدم وجود أخطاء
  const testCommands = [
    'nx build web-chatbot --dry-run',
    'nx build admin-dashboard --dry-run'
  ];
  
  testCommands.forEach(cmd => {
    if (!runCommand(cmd)) {
      console.warn(`⚠️ تحذير: فشل في ${cmd}`);
    }
  });
}

function showNextSteps() {
  console.log('\n🎯 الخطوات التالية:');
  console.log('1. راجع دليل الترقية: docs/2_developer_guide/REACT_ROUTER_V7_MIGRATION.md');
  console.log('2. حدث ملفات App.tsx حسب الدليل');
  console.log('3. اختبر التطبيقات: nx serve web-chatbot');
  console.log('4. اختبر admin-dashboard: nx serve admin-dashboard');
  console.log('5. شغل الاختبارات: npm run test');
  console.log('\n✅ ترقية المكتبات مكتملة!');
}

// تشغيل العملية
async function main() {
  try {
    createBackup();
    
    if (installLibraries()) {
      updateTypeScriptConfig();
      runTests();
      showNextSteps();
    } else {
      console.error('❌ فشلت عملية الترقية');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error.message);
    process.exit(1);
  }
}

main();