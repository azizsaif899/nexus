#!/usr/bin/env node
const { exec } = require('child_process');

const port = process.argv[2] || 3000;

console.log(`🔫 Killing processes on port ${port}...`);

exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
  if (stdout) {
    const lines = stdout.trim().split('\n');
    const pids = [...new Set(lines.map(line => line.trim().split(/\s+/).pop()))];
    
    let killed = 0;
    pids.forEach(pid => {
      if (pid && pid !== '0') {
        exec(`taskkill /PID ${pid} /F`, (err) => {
          if (!err) {
            killed++;
            console.log(`✅ Killed process PID: ${pid}`);
          }
        });
      }
    });
    
    setTimeout(() => {
      console.log(`🎯 Killed ${killed} processes on port ${port}`);
    }, 1000);
  } else {
    console.log(`✅ No processes found on port ${port}`);
  }
});