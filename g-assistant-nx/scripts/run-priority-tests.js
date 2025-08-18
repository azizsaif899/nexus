#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🚀 تشغيل الاختبارات الأساسية للأولويات العالية\n'));

const tests = [
  {
    name: 'CRM WhatsApp Integration',
    command: 'npm run test tests/integration/crm-whatsapp.test.ts',
    description: 'اختبار تكامل الواتساب مع CRM'
  },
  {
    name: 'WhatsApp Webhook',
    command: 'npm run test tests/integration/webhook.test.ts',
    description: 'اختبار webhook الواتساب'
  }
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(chalk.yellow(`📋 ${test.description}...`));
      execSync(test.command, { stdio: 'inherit' });
      console.log(chalk.green(`✅ ${test.name} - نجح\n`));
      passed++;
    } catch (error) {
      console.log(chalk.red(`❌ ${test.name} - فشل\n`));
      failed++;
    }
  }

  console.log(chalk.blue('📊 النتائج النهائية:'));
  console.log(chalk.green(`✅ نجح: ${passed}`));
  console.log(chalk.red(`❌ فشل: ${failed}`));
  
  if (failed === 0) {
    console.log(chalk.green('\n🎉 جميع الاختبارات نجحت!'));
  } else {
    console.log(chalk.yellow('\n⚠️  بعض الاختبارات تحتاج إصلاح'));
  }
}

runTests().catch(console.error);