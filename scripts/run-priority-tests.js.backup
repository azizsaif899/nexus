#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

// Removed console.log);

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
      // Removed console.log);
      execSync(test.command, { stdio: 'inherit' });
      // Removed console.log);
      passed++;
    } catch (error) {
      // Removed console.log);
      failed++;
    }
  }

  // Removed console.log);
  // Removed console.log);
  // Removed console.log);
  
  if (failed === 0) {
    // Removed console.log);
  } else {
    // Removed console.log);
  }
}

runTests().catch(console.error);