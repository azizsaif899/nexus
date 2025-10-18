#!/usr/bin/env node
/**
 * N-Chat Development Server Starter
 * يبدأ خادم التطوير على المنفذ 3003 مع تنظيف تلقائي
 */

const { spawn } = require('child_process');
const killPort = require('./kill-port');
const checkPort = require('./check-port');

const PORT = 3003;

console.log('🚀 بدء تشغيل N-Chat Development Server...\n');

async function startDev() {
  try {
    // 1. فحص المنفذ
    console.log('📋 المرحلة 1: فحص حالة المنفذ...');
    const portStatus = await checkPort();
    
    if (!portStatus.available) {
      // 2. تحرير المنفذ
      console.log('🔥 المرحلة 2: تحرير المنفذ...');
      await killPort();
      
      // 3. انتظار قصير للتأكد
      console.log('⏳ انتظار 2 ثانية للتأكد من تحرير المنفذ...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 4. بدء الخادم
    console.log('🌟 المرحلة 3: بدء خادم Next.js...');
    console.log(`📍 العنوان: http://localhost:${PORT}`);
    console.log('🎯 اضغط Ctrl+C للإيقاف\n');
    
    const nextProcess = spawn('node', ['./node_modules/.bin/next', 'dev', '--port', PORT.toString()], {
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

    process.on('SIGTERM', () => {
      console.log('\n🛑 إيقاف الخادم...');
      nextProcess.kill('SIGTERM');
      process.exit(0);
    });

    nextProcess.on('error', (error) => {
      console.error(`💥 خطأ في بدء الخادم: ${error.message}`);
      process.exit(1);
    });

    nextProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`💥 توقف الخادم بخطأ (code: ${code})`);
        process.exit(1);
      }
      console.log('✅ تم إيقاف الخادم بنجاح');
    });

  } catch (error) {
    console.error(`💥 خطأ في بدء التطبيق: ${error.message}`);
    process.exit(1);
  }
}

startDev();