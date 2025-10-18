#!/usr/bin/env node
/**
 * N-Chat Clean Start Script
 * ينظف البيئة ويبدأ التطبيق من الصفر
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const killPort = require('./kill-port');

console.log('🧹 بدء التنظيف الشامل لـ N-Chat...\n');

async function cleanStart() {
  try {
    // 1. إيقاف جميع عمليات Node.js
    console.log('🔥 المرحلة 1: إيقاف جميع عمليات المنفذ 3003...');
    await killPort();

    // 2. حذف مجلد .next
    console.log('🗑️  المرحلة 2: حذف مجلد .next...');
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      await deleteDirectory(nextDir);
      console.log('✅ تم حذف مجلد .next');
    } else {
      console.log('ℹ️  مجلد .next غير موجود');
    }

    // 3. حذف مجلد node_modules (اختياري)
    console.log('📦 المرحلة 3: فحص node_modules...');
    const nodeModulesDir = path.join(process.cwd(), 'node_modules');
    if (process.argv.includes('--full') && fs.existsSync(nodeModulesDir)) {
      console.log('🗑️  حذف node_modules (التنظيف الكامل)...');
      await deleteDirectory(nodeModulesDir);
      
      // إعادة تثبيت الحزم
      console.log('📥 إعادة تثبيت الحزم...');
      await runCommand('npm install --legacy-peer-deps');
    }

    // 4. بناء التطبيق
    console.log('🔨 المرحلة 4: بناء التطبيق...');
    await runCommand('npm run build');

    // 5. بدء الخادم
    console.log('🚀 المرحلة 5: بدء خادم التطوير...');
    console.log('📍 العنوان: http://localhost:3003\n');

    const nextProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    // معالجة إشارات الإيقاف
    process.on('SIGINT', () => {
      console.log('\n🛑 إيقاف الخادم...');
      nextProcess.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    console.error(`💥 خطأ في التنظيف والبدء: ${error.message}`);
    process.exit(1);
  }
}

function deleteDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    if (process.platform === 'win32') {
      exec(`rmdir /s /q "${dirPath}"`, (error) => {
        if (error && !error.message.includes('cannot find')) {
          reject(error);
        } else {
          resolve();
        }
      });
    } else {
      exec(`rm -rf "${dirPath}"`, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }
  });
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`خطأ في تنفيذ: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

cleanStart();