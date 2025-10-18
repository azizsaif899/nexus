#!/usr/bin/env node
/**
 * Nexus - Start All Applications
 * تشغيل جميع تطبيقات Nexus
 */

const { spawn } = require('child_process');
const path = require('path');

const apps = [
  { name: 'N-Chat', path: 'apps/n-chat', port: 3003, color: '\x1b[36m' },
  { name: 'Nexus AI Main', path: 'apps/nexus-ai-main/project', port: 3000, color: '\x1b[35m' },
  { name: 'Visual Automation', path: 'apps/visual-automation', port: 3005, color: '\x1b[33m' }
];

const reset = '\x1b[0m';
const processes = [];

console.log('🚀 بدء تشغيل جميع تطبيقات Nexus...\n');

function startApp(app) {
  return new Promise((resolve) => {
    const appPath = path.join(__dirname, '..', app.path);
    
    console.log(`${app.color}[${app.name}]${reset} بدء التشغيل على المنفذ ${app.port}...`);
    
    const proc = spawn('npm', ['run', 'dev'], {
      cwd: appPath,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`${app.color}[${app.name}]${reset} ${line.trim()}`);
        }
      });
    });

    proc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`${app.color}[${app.name}]${reset} ${line.trim()}`);
        }
      });
    });

    proc.on('error', (error) => {
      console.error(`${app.color}[${app.name}]${reset} ❌ خطأ: ${error.message}`);
    });

    proc.on('exit', (code) => {
      if (code !== 0) {
        console.log(`${app.color}[${app.name}]${reset} 🛑 توقف (code: ${code})`);
      }
    });

    processes.push({ name: app.name, process: proc });
    
    setTimeout(() => {
      console.log(`${app.color}[${app.name}]${reset} ✅ تم البدء على http://localhost:${app.port}\n`);
      resolve();
    }, 2000);
  });
}

async function startAll() {
  console.log('📋 التطبيقات المتاحة:\n');
  apps.forEach((app, i) => {
    console.log(`   ${i + 1}. ${app.color}${app.name}${reset} - Port ${app.port}`);
  });
  console.log('\n⏳ بدء التشغيل التدريجي...\n');

  for (const app of apps) {
    await startApp(app);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎉 جميع التطبيقات تعمل الآن!\n');
  console.log('📍 الروابط:');
  apps.forEach(app => {
    console.log(`   ${app.color}${app.name}${reset}: http://localhost:${app.port}`);
  });
  console.log('\n🎯 اضغط Ctrl+C لإيقاف جميع التطبيقات\n');
}

// معالجة الإيقاف
process.on('SIGINT', () => {
  console.log('\n\n🛑 إيقاف جميع التطبيقات...\n');
  
  processes.forEach(({ name, process }) => {
    console.log(`   🛑 إيقاف ${name}...`);
    process.kill('SIGINT');
  });
  
  setTimeout(() => {
    console.log('\n✅ تم إيقاف جميع التطبيقات\n');
    process.exit(0);
  }, 2000);
});

process.on('SIGTERM', () => {
  processes.forEach(({ process }) => process.kill('SIGTERM'));
  process.exit(0);
});

startAll().catch((error) => {
  console.error(`💥 خطأ: ${error.message}`);
  process.exit(1);
});
