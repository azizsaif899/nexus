#!/usr/bin/env node

/**
 * سكربت بناء المشروع G-Assistant
 * يبني المكتبات المشتركة أولاً ثم التطبيقات
 */

const { execSync } = require('child_process');

console.log('🚀 بدء بناء مشروع G-Assistant...');

try {
  // بناء المكتبات المشتركة أولاً
  console.log('📦 بناء المكتبات المشتركة...');
  execSync('nx build core-logic', { stdio: 'inherit' });
  execSync('nx build bigquery-client', { stdio: 'inherit' });
  execSync('nx build whatsapp-core', { stdio: 'inherit' });
  execSync('nx build ui-components', { stdio: 'inherit' });
  
  // بناء التطبيقات
  console.log('🏗️ بناء التطبيقات...');
  execSync('nx build sheets-addon', { stdio: 'inherit' });
  execSync('nx build whatsapp-query-bot', { stdio: 'inherit' });
  execSync('nx build whatsapp-exec-bot', { stdio: 'inherit' });
  execSync('nx build admin-dashboard', { stdio: 'inherit' });
  execSync('nx build web-chatbot', { stdio: 'inherit' });
  
  console.log('✅ تم بناء المشروع بنجاح!');
} catch (error) {
  console.error('❌ فشل في بناء المشروع:', error.message);
  process.exit(1);
}