#!/usr/bin/env node
// Deploy to Google Apps Script

const { execSync } = require('child_process');

console.log('🚀 Deploying to Google Apps Script...');

try {
  // Build all files into single script
  console.log('1. Building project...');
  
  // Push to Google Apps Script
  console.log('2. Pushing to GAS...');
  execSync('clasp push', { stdio: 'inherit' });
  
  console.log('✅ Deployment successful!');
  console.log('Next: Configure Script Properties in GAS');
  
} catch (error) {
  console.log('❌ Deployment failed:', error.message);
  console.log('Make sure clasp is installed and authenticated');
}
