#!/usr/bin/env node
/**
 * Nexus - Clean All Applications
 * تنظيف كاش جميع التطبيقات
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const apps = [
  { name: 'N-Chat', path: 'apps/n-chat' },
  { name: 'Nexus AI Main', path: 'apps/nexus-ai-main/project' },
  { name: 'Visual Automation', path: 'apps/visual-automation' }
];

const dirsToClean = ['.next', 'node_modules/.cache', '.turbo', 'out', 'dist'];

console.log('🧹 بدء تنظيف جميع التطبيقات...\n');

async function cleanApp(app) {
  const appPath = path.join(__dirname, '..', app.path);
  
  if (!fs.existsSync(appPath)) {
    console.log(`⏭️  ${app.name}: المسار غير موجود\n`);
    return;
  }

  console.log(`🗑️  ${app.name}:`);
  let cleaned = 0;

  for (const dir of dirsToClean) {
    const fullPath = path.join(appPath, dir);
    
    if (fs.existsSync(fullPath)) {
      await new Promise((resolve) => {
        const command = process.platform === 'win32'
          ? `rmdir /s /q "${fullPath}"`
          : `rm -rf "${fullPath}"`;
          
        exec(command, (error) => {
          if (!error) {
            console.log(`   ✅ ${dir}`);
            cleaned++;
          }
          resolve();
        });
      });
    }
  }

  if (cleaned === 0) {
    console.log(`   ✨ نظيف بالفعل`);
  }
  console.log('');
}

async function cleanAll() {
  for (const app of apps) {
    await cleanApp(app);
  }

  console.log('🎉 اكتمل تنظيف جميع التطبيقات!\n');
  console.log('💡 يمكنك الآن تشغيل: npm run start:all\n');
}

cleanAll().catch((error) => {
  console.error(`💥 خطأ: ${error.message}`);
  process.exit(1);
});
