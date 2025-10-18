#!/usr/bin/env node
const { exec } = require('child_process');

const port = process.argv[2] || 3000;

console.log(`🔍 Checking port ${port}...`);

exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
  if (stdout) {
    console.log(`⚠️  Port ${port} is in use:`);
    console.log(stdout);
    
    // Extract PIDs and show processes
    const lines = stdout.trim().split('\n');
    const pids = [...new Set(lines.map(line => line.trim().split(/\s+/).pop()))];
    
    pids.forEach(pid => {
      exec(`tasklist /FI "PID eq ${pid}"`, (err, out) => {
        if (out && !err) {
          const processLine = out.split('\n')[3];
          if (processLine) {
            console.log(`📋 Process: ${processLine.split(/\s+/)[0]} (PID: ${pid})`);
          }
        }
      });
    });
  } else {
    console.log(`✅ Port ${port} is free`);
  }
});