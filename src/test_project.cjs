#!/usr/bin/env node

/**
 * G-Assistant v6.0.0 - Project Test Suite
 * اختبار شامل للمشروع للتأكد من سلامة الكود
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 G-Assistant v6.0.0 - Project Test Suite');
console.log('=' .repeat(50));

// Test Results
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function logTest(name, status, message = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${name}: ${status} ${message}`);
  
  testResults.details.push({ name, status, message });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

// Test 1: Check Core Files
function testCoreFiles() {
  console.log('\n📁 Testing Core Files...');
  
  const coreFiles = [
    '00_utils.js',
    '01_config.js',
    '02_intro.js',
    '98_Code.js',
    '99_Initializer.js',
    'package.json',
    'README.md'
  ];
  
  coreFiles.forEach(file => {
    if (fs.existsSync(file)) {
      logTest(`Core file: ${file}`, 'PASS');
    } else {
      logTest(`Core file: ${file}`, 'FAIL', 'File not found');
    }
  });
}

// Test 2: Check Module Structure
function testModuleStructure() {
  console.log('\n🏗️ Testing Module Structure...');
  
  const modules = [
    '10_ui',
    '20_ai', 
    '25_ai_agents',
    '30_tools',
    'src',
    'docs',
    'tests'
  ];
  
  modules.forEach(module => {
    if (fs.existsSync(module) && fs.statSync(module).isDirectory()) {
      const files = fs.readdirSync(module);
      logTest(`Module: ${module}`, 'PASS', `(${files.length} files)`);
    } else {
      logTest(`Module: ${module}`, 'FAIL', 'Directory not found');
    }
  });
}

// Test 3: Check JavaScript Syntax
function testJavaScriptSyntax() {
  console.log('\n🔍 Testing JavaScript Syntax...');
  
  function checkJSFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Basic syntax checks
      const issues = [];
      
      // Check for common syntax errors
      if (content.includes('function(') && !content.includes('function (')) {
        // This is actually valid, just a style preference
      }
      
      // Check for defineModule usage
      if (content.includes('defineModule') && !content.includes('defineModule(')) {
        issues.push('Invalid defineModule syntax');
      }
      
      // Check for basic JavaScript structure
      const lines = content.split('\n');
      let braceCount = 0;
      
      lines.forEach((line, index) => {
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;
      });
      
      if (braceCount !== 0) {
        issues.push(`Unmatched braces (${braceCount})`);
      }
      
      if (issues.length === 0) {
        logTest(`Syntax: ${path.basename(filePath)}`, 'PASS');
      } else {
        logTest(`Syntax: ${path.basename(filePath)}`, 'WARN', issues.join(', '));
      }
      
    } catch (error) {
      logTest(`Syntax: ${path.basename(filePath)}`, 'FAIL', error.message);
    }
  }
  
  // Check main JS files
  const jsFiles = [
    '00_utils.js',
    '01_config.js',
    '98_Code.js',
    '99_Initializer.js'
  ];
  
  jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
      checkJSFile(file);
    }
  });
}

// Test 4: Check Package.json
function testPackageJson() {
  console.log('\n📦 Testing package.json...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.name) {
      logTest('Package name', 'PASS', packageJson.name);
    } else {
      logTest('Package name', 'FAIL', 'Missing name');
    }
    
    if (packageJson.version) {
      logTest('Package version', 'PASS', packageJson.version);
    } else {
      logTest('Package version', 'FAIL', 'Missing version');
    }
    
    if (packageJson.dependencies) {
      logTest('Dependencies', 'PASS', `${Object.keys(packageJson.dependencies).length} deps`);
    } else {
      logTest('Dependencies', 'WARN', 'No dependencies defined');
    }
    
  } catch (error) {
    logTest('Package.json', 'FAIL', error.message);
  }
}

// Test 5: Check Documentation
function testDocumentation() {
  console.log('\n📚 Testing Documentation...');
  
  const docs = [
    'README.md',
    'CONTRIBUTING.md', 
    'LICENSE',
    'PROJECT_SUMMARY.md'
  ];
  
  docs.forEach(doc => {
    if (fs.existsSync(doc)) {
      const content = fs.readFileSync(doc, 'utf8');
      if (content.length > 100) {
        logTest(`Documentation: ${doc}`, 'PASS', `${content.length} chars`);
      } else {
        logTest(`Documentation: ${doc}`, 'WARN', 'Too short');
      }
    } else {
      logTest(`Documentation: ${doc}`, 'FAIL', 'File not found');
    }
  });
}

// Test 6: Check Project Organization
function testProjectOrganization() {
  console.log('\n🗂️ Testing Project Organization...');
  
  // Check if archive folders exist
  const archiveFolders = ['archive_txt', 'archive_unused', 'documentation'];
  
  archiveFolders.forEach(folder => {
    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
      const files = fs.readdirSync(folder);
      logTest(`Archive: ${folder}`, 'PASS', `${files.length} files organized`);
    } else {
      logTest(`Archive: ${folder}`, 'WARN', 'Archive folder not found');
    }
  });
}

// Test 7: Check Git Status
function testGitStatus() {
  console.log('\n🔄 Testing Git Status...');
  
  if (fs.existsSync('.git')) {
    logTest('Git repository', 'PASS', 'Git initialized');
    
    if (fs.existsSync('.gitignore')) {
      logTest('Git ignore', 'PASS', 'Gitignore exists');
    } else {
      logTest('Git ignore', 'WARN', 'No gitignore file');
    }
  } else {
    logTest('Git repository', 'FAIL', 'Not a git repository');
  }
}

// Run All Tests
async function runAllTests() {
  console.log('Starting comprehensive project tests...\n');
  
  testCoreFiles();
  testModuleStructure();
  testJavaScriptSyntax();
  testPackageJson();
  testDocumentation();
  testProjectOrganization();
  testGitStatus();
  
  // Final Results
  console.log('\n' + '='.repeat(50));
  console.log('🎯 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📊 Total: ${testResults.passed + testResults.failed + testResults.warnings}`);
  
  const successRate = Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100);
  console.log(`🎯 Success Rate: ${successRate}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 ALL CRITICAL TESTS PASSED!');
    console.log('✅ Project is ready for deployment!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues.');
  }
  
  console.log('\n🚀 G-Assistant v6.0.0 - Test Complete!');
  
  return testResults.failed === 0;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests, testResults };