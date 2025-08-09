#!/usr/bin/env node

/**
 * سكربت بناء المشروع
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 بدء بناء المشروع...');

try {
  // بناء المكتبات المشتركة أولاً
  console.log('📦 بناء المكتبات المشتركة...');
  execSync('npm run build --workspace=packages/core-logic', { stdio: 'inherit' });
  
  // بناء التطبيقات
  console.log('🏗️ بناء التطبيقات...');
  execSync('npm run build --workspace=apps/sheets-addon', { stdio: 'inherit' });
  execSync('npm run build --workspace=apps/web-chatbot', { stdio: 'inherit' });
  execSync('npm run build --workspace=apps/admin-dashboard', { stdio: 'inherit' });
  execSync('npm run build --workspace=apps/web-interface', { stdio: 'inherit' });
  execSync('npm run build --workspace=apps/api', { stdio: 'inherit' });
  
  console.log('✅ تم بناء المشروع بنجاح!');
} catch (error) {
  console.error('❌ فشل في بناء المشروع:', error.message);
  process.exit(1);
}