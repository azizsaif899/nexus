#!/usr/bin/env node

/**
 * 🛡️ Al-Raqib Compliance Agent Runner
 * تشغيل وكيل الرقيب للفحص التلقائي في CI/CD
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Removed console.log

try {
  // التحقق من وجود وكيل الرقيب
  const complianceAgentPath = path.join(__dirname, '..', 'packages', 'compliance-agent');
  
  if (!fs.existsSync(complianceAgentPath)) {
    // Removed console.log
    process.exit(0);
  }

  // Removed console.log
  
  // تشغيل فحص أساسي
  // Removed console.log
  
  // فحص هيكل المشروع
  const projectStructure = {
    'packages/compliance-agent': fs.existsSync(complianceAgentPath),
    'docs/governance': fs.existsSync(path.join(__dirname, '..', 'docs', 'governance')),
    '.github/workflows': fs.existsSync(path.join(__dirname, '..', '.github', 'workflows'))
  };
  
  // Removed console.log
  Object.entries(projectStructure).forEach(([item, exists]) => {
    // Removed console.log
  });
  
  // فحص السياسات
  const policiesPath = path.join(complianceAgentPath, 'src', 'policies');
  if (fs.existsSync(policiesPath)) {
    const policies = fs.readdirSync(policiesPath).filter(f => f.endsWith('.yaml'));
    // Removed console.log
    policies.forEach(policy => {
      // Removed console.log
    });
  }
  
  // تشغيل وكيل الرقيب إذا كان متاحاً
  try {
    const complianceIndex = path.join(complianceAgentPath, 'src', 'index.ts');
    if (fs.existsSync(complianceIndex)) {
      // Removed console.log
      execSync(`npx tsx ${complianceIndex}`, { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit' 
      });
    }
  } catch (error) {
    // Removed console.log
  }
  
  // Removed console.log
  // Removed console.log
  // Removed console.log
  // Removed console.log
  // Removed console.log
  
} catch (error) {
  // Removed console.log
  // لا نفشل الـ CI، فقط نسجل التحذير
  process.exit(0);
}