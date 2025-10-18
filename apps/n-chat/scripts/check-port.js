#!/usr/bin/env node
/**
 * N-Chat Port Checker Script
 * يتحقق من حالة المنفذ 3003
 */

const { exec } = require('child_process');
const os = require('os');

const PORT = 3003;

console.log(`🔍 فحص حالة المنفذ ${PORT}...`);

function checkPort() {
  return new Promise((resolve) => {
    if (os.platform() === 'win32') {
      // Windows
      exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✅ المنفذ ${PORT} متاح`);
          resolve({ available: true, processes: [] });
          return;
        }

        const lines = stdout.split('\n').filter(line => line.trim());
        const processes = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          return {
            protocol: parts[0],
            localAddress: parts[1],
            foreignAddress: parts[2],
            state: parts[3],
            pid: parts[4]
          };
        });

        console.log(`❌ المنفذ ${PORT} مشغول بواسطة ${processes.length} عملية:`);
        processes.forEach((proc, index) => {
          console.log(`  ${index + 1}. PID: ${proc.pid}, State: ${proc.state}, Address: ${proc.localAddress}`);
        });

        resolve({ available: false, processes });
      });
    } else {
      // Unix/Linux/Mac
      exec(`lsof -ti:${PORT}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✅ المنفذ ${PORT} متاح`);
          resolve({ available: true, processes: [] });
          return;
        }

        const pids = stdout.trim().split('\n').filter(pid => pid);
        console.log(`❌ المنفذ ${PORT} مشغول بواسطة ${pids.length} عملية:`);
        pids.forEach((pid, index) => {
          console.log(`  ${index + 1}. PID: ${pid}`);
        });

        resolve({ available: false, processes: pids.map(pid => ({ pid })) });
      });
    }
  });
}

if (require.main === module) {
  checkPort().then((result) => {
    if (result.available) {
      console.log(`🎉 المنفذ ${PORT} جاهز لتطبيق N-Chat!`);
      process.exit(0);
    } else {
      console.log(`⚠️  المنفذ ${PORT} مشغول. استخدم 'npm run kill-port' لتحريره.`);
      process.exit(1);
    }
  });
}

module.exports = checkPort;