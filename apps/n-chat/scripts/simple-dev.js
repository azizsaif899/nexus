#!/usr/bin/env node
/**
 * Simple N-Chat Development Server
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 بدء تشغيل N-Chat...\n');

// تشغيل Next.js مباشرة
const nextProcess = spawn('cmd', ['/c', 'npx', 'next', 'dev', '--port', '3003'], {
  stdio: 'inherit',
  shell: false,
  cwd: path.join(__dirname, '..')
});

nextProcess.on('error', (error) => {
  console.error(`خطأ: ${error.message}`);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`انتهى بكود: ${code}`);
  process.exit(code);
});

// معالجة Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 إيقاف الخادم...');
  nextProcess.kill('SIGINT');
});