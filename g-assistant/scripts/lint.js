#!/usr/bin/env node

/**
 * سكربت فحص الكود
 */

const { execSync } = require('child_process');

console.log('🔍 بدء فحص الكود...');

try {
  // فحص TypeScript
  console.log('📝 فحص TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  // فحص ESLint
  console.log('🔧 فحص ESLint...');
  execSync('npx eslint . --ext .ts,.js,.jsx,.tsx', { stdio: 'inherit' });
  
  // فحص Prettier
  console.log('💅 فحص Prettier...');
  execSync('npx prettier --check .', { stdio: 'inherit' });
  
  console.log('✅ تم فحص الكود بنجاح!');
} catch (error) {
  console.error('❌ فشل في فحص الكود:', error.message);
  process.exit(1);
}