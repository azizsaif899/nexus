#!/usr/bin/env node
/**
 * N-Chat Clear Cache Script
 * سكريبت حذف ملفات التخزين المؤقت
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 تنظيف ملفات التخزين المؤقت لـ N-Chat...\n');

async function clearCache() {
  try {
    const filesToDelete = [
      '.next',
      '.turbo',
      'node_modules/.cache',
      'tsconfig.tsbuildinfo',
      '.eslintcache',
      'coverage'
    ];

    const foldersToDelete = [
      '.next',
      '.turbo',
      'node_modules/.cache',
      'coverage'
    ];

    const filesToDeleteOnly = [
      'tsconfig.tsbuildinfo',
      '.eslintcache',
      'next-env.d.ts'
    ];

    console.log('📂 حذف المجلدات المؤقتة...');
    for (const folder of foldersToDelete) {
      const folderPath = path.join(process.cwd(), folder);
      if (fs.existsSync(folderPath)) {
        await deleteDirectory(folderPath);
        console.log(`✅ تم حذف المجلد: ${folder}`);
      } else {
        console.log(`ℹ️  المجلد غير موجود: ${folder}`);
      }
    }

    console.log('\n📄 حذف الملفات المؤقتة...');
    for (const file of filesToDeleteOnly) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`✅ تم حذف الملف: ${file}`);
      } else {
        console.log(`ℹ️  الملف غير موجود: ${file}`);
      }
    }

    // إنشاء next-env.d.ts جديد
    console.log('\n📝 إعادة إنشاء next-env.d.ts...');
    const nextEnvContent = `/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/**/*.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;
    fs.writeFileSync(path.join(process.cwd(), 'next-env.d.ts'), nextEnvContent);
    console.log('✅ تم إنشاء next-env.d.ts جديد');

    // تنظيف npm cache
    console.log('\n🔄 تنظيف npm cache...');
    await runCommand('npm cache clean --force');
    console.log('✅ تم تنظيف npm cache');

    console.log('\n🎉 تم تنظيف جميع ملفات التخزين المؤقت بنجاح!');
    console.log('💡 يمكنك الآن تشغيل npm install && npm run dev');

  } catch (error) {
    console.error(`💥 خطأ في تنظيف التخزين المؤقت: ${error.message}`);
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
        if (error) reject(error);
        else resolve();
      });
    }
  });
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`⚙️  تنفيذ: ${command}`);
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`خطأ في تنفيذ: ${command}`);
        if (stderr) console.error(stderr);
        reject(error);
      } else {
        if (stdout) console.log(stdout.trim());
        resolve();
      }
    });
  });
}

clearCache();