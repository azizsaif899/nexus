#!/usr/bin/env node
/**
 * N-Chat Full Restart Script
 * إعادة تشغيل كاملة مع تنظيف شامل
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const killPort = require('./kill-port');

console.log('🔄 إعادة تشغيل كاملة لـ N-Chat...\n');

async function fullRestart() {
  try {
    // 1. إيقاف جميع العمليات
    console.log('🛑 المرحلة 1: إيقاف جميع العمليات...');
    await killPort();
    
    // إيقاف جميع عمليات Node.js (Windows)
    if (process.platform === 'win32') {
      try {
        await runCommand('taskkill /f /im node.exe', false);
      } catch (e) {
        console.log('ℹ️  لا توجد عمليات Node.js أخرى');
      }
    }

    // 2. تنظيف الملفات المؤقتة
    console.log('🧹 المرحلة 2: تنظيف الملفات المؤقتة...');
    const filesToDelete = [
      '.next',
      '.turbo',
      'tsconfig.tsbuildinfo',
      'next-env.d.ts'
    ];

    for (const file of filesToDelete) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        await deleteFileOrDirectory(filePath);
        console.log(`✅ تم حذف ${file}`);
      }
    }

    // 3. إعادة تثبيت الحزم
    console.log('📦 المرحلة 3: إعادة تثبيت الحزم...');
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      fs.unlinkSync(packageLockPath);
      console.log('✅ تم حذف package-lock.json');
    }

    await runCommand('npm install --legacy-peer-deps');
    console.log('✅ تم تثبيت الحزم بنجاح');

    // 4. إنشاء next-env.d.ts
    console.log('📝 المرحلة 4: إنشاء ملفات TypeScript...');
    const nextEnvContent = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/**/*.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;
    fs.writeFileSync(path.join(process.cwd(), 'next-env.d.ts'), nextEnvContent);
    console.log('✅ تم إنشاء next-env.d.ts');

    // 5. فحص TypeScript
    console.log('🔍 المرحلة 5: فحص TypeScript...');
    try {
      await runCommand('npx tsc --noEmit');
      console.log('✅ لا توجد أخطاء TypeScript');
    } catch (e) {
      console.log('⚠️  توجد أخطاء TypeScript، سيتم المتابعة...');
    }

    // 6. بناء التطبيق
    console.log('🔨 المرحلة 6: بناء التطبيق...');
    try {
      await runCommand('npm run build');
      console.log('✅ تم بناء التطبيق بنجاح');
    } catch (e) {
      console.log('⚠️  فشل في البناء، سيتم تشغيل خادم التطوير...');
    }

    // 7. بدء الخادم
    console.log('🚀 المرحلة 7: بدء الخادم...');
    console.log('📍 العنوان: http://localhost:3003');
    console.log('🎯 N-Chat جاهز للاستخدام!\n');

    const startProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    // معالجة إشارات الإيقاف
    process.on('SIGINT', () => {
      console.log('\n🛑 إيقاف N-Chat...');
      startProcess.kill('SIGINT');
      process.exit(0);
    });

    startProcess.on('error', (error) => {
      console.error(`💥 خطأ في بدء الخادم: ${error.message}`);
      process.exit(1);
    });

  } catch (error) {
    console.error(`💥 خطأ في إعادة التشغيل: ${error.message}`);
    process.exit(1);
  }
}

function deleteFileOrDirectory(filePath) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (process.platform === 'win32') {
        exec(`rmdir /s /q "${filePath}"`, (error) => {
          if (error && !error.message.includes('cannot find')) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        exec(`rm -rf "${filePath}"`, (error) => {
          if (error) reject(error);
          else resolve();
        });
      }
    } else {
      try {
        fs.unlinkSync(filePath);
        resolve();
      } catch (error) {
        reject(error);
      }
    }
  });
}

function runCommand(command, throwOnError = true) {
  return new Promise((resolve, reject) => {
    console.log(`⚙️  تنفيذ: ${command}`);
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`خطأ في تنفيذ: ${command}`);
        if (stderr) console.error(stderr);
        if (throwOnError) {
          reject(error);
        } else {
          resolve();
        }
      } else {
        if (stdout) console.log(stdout);
        resolve();
      }
    });
  });
}

fullRestart();