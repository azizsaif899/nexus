#!/usr/bin/env node
/**
 * N-Chat Port Killer Script
 * يقتل جميع العمليات التي تستخدم المنفذ 3003
 */

const { exec } = require('child_process');
const os = require('os');

const PORT = 3003;

console.log(`🔥 قتل جميع العمليات على المنفذ ${PORT}...`);

function killPort() {
  return new Promise((resolve, reject) => {
    if (os.platform() === 'win32') {
      // Windows
      exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✅ لا توجد عمليات تستخدم المنفذ ${PORT}`);
          resolve();
          return;
        }

        const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
        const pids = lines.map(line => {
          const parts = line.trim().split(/\s+/);
          return parts[parts.length - 1];
        }).filter(pid => pid && pid !== '0');

        if (pids.length === 0) {
          console.log(`✅ لا توجد عمليات تستخدم المنفذ ${PORT}`);
          resolve();
          return;
        }

        console.log(`🎯 وُجدت ${pids.length} عملية تستخدم المنفذ ${PORT}`);
        
        const killPromises = pids.map(pid => {
          return new Promise((killResolve) => {
            exec(`taskkill /F /PID ${pid}`, (killError) => {
              if (killError) {
                console.log(`❌ فشل في قتل العملية ${pid}: ${killError.message}`);
              } else {
                console.log(`✅ تم قتل العملية ${pid}`);
              }
              killResolve();
            });
          });
        });

        Promise.all(killPromises).then(() => {
          console.log(`🎉 تم تحرير المنفذ ${PORT} بنجاح!`);
          resolve();
        });
      });
    } else {
      // Unix/Linux/Mac
      exec(`lsof -ti:${PORT}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✅ لا توجد عمليات تستخدم المنفذ ${PORT}`);
          resolve();
          return;
        }

        const pids = stdout.trim().split('\n').filter(pid => pid);
        console.log(`🎯 وُجدت ${pids.length} عملية تستخدم المنفذ ${PORT}`);

        const killPromises = pids.map(pid => {
          return new Promise((killResolve) => {
            exec(`kill -9 ${pid}`, (killError) => {
              if (killError) {
                console.log(`❌ فشل في قتل العملية ${pid}: ${killError.message}`);
              } else {
                console.log(`✅ تم قتل العملية ${pid}`);
              }
              killResolve();
            });
          });
        });

        Promise.all(killPromises).then(() => {
          console.log(`🎉 تم تحرير المنفذ ${PORT} بنجاح!`);
          resolve();
        });
      });
    }
  });
}

if (require.main === module) {
  killPort().then(() => {
    console.log(`🚀 المنفذ ${PORT} جاهز للاستخدام!`);
    process.exit(0);
  }).catch((error) => {
    console.error(`💥 خطأ في تحرير المنفذ: ${error.message}`);
    process.exit(1);
  });
}

module.exports = killPort;