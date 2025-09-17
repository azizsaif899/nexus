#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Legacy patterns to detect
const LEGACY_PATTERNS = [
  // Old module system
  /defineModule\s*\(/,
  /ModuleVerifier/,
  
  // Old Google Apps Script patterns
  /SpreadsheetApp\.getActiveSpreadsheet\(\)/,
  /PropertiesService\.getScriptProperties\(\)/,
  /CacheService\.getScriptCache\(\)/,
  
  // Old utility patterns
  /Utils\.executeSafely/,
  /Utils\.validateString/,
  /Telemetry\.logError/,
  
  // Old AI patterns
  /AI\.Core\./,
  /AI\.Orchestrator\./,
  /System\.AI\./,
  
  // Old config patterns
  /Config\.get\(/,
  /Config\.initialize\(/,
  
  // Deprecated functions
  /getSheet\s*\(/,
  /clearAndWriteData\s*\(/
];

const LEGACY_IMPORTS = [
  'System.AI.Core',
  'System.Config',
  'System.Utils',
  'Tools.Sheets'
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  
  // Check for legacy patterns
  LEGACY_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      violations.push({
        file: filePath,
        pattern: pattern.toString(),
        line: findLineNumber(content, matches[0]),
        match: matches[0]
      });
    }
  });
  
  // Check for legacy imports
  LEGACY_IMPORTS.forEach(importName => {
    if (content.includes(importName)) {
      violations.push({
        file: filePath,
        pattern: `Legacy import: ${importName}`,
        line: findLineNumber(content, importName),
        match: importName
      });
    }
  });
  
  return violations;
}

function findLineNumber(content, searchString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1;
    }
  }
  return 1;
}

function main() {
  // Removed console.log
  
  const files = glob.sync('**/*.{ts,js,tsx,jsx}', {
    ignore: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.test.{ts,js}',
      '**/*.spec.{ts,js}',
      'scripts/**',
      'docs/**'
    ]
  });
  
  let totalViolations = 0;
  const violationsByFile = {};
  
  files.forEach(file => {
    const violations = checkFile(file);
    if (violations.length > 0) {
      violationsByFile[file] = violations;
      totalViolations += violations.length;
    }
  });
  
  if (totalViolations === 0) {
    // Removed console.log
    process.exit(0);
  }
  
  // Removed console.log
  
  Object.entries(violationsByFile).forEach(([file, violations]) => {
    // Removed console.log
    violations.forEach(violation => {
      // Removed console.log
      // Removed console.log
    });
  });
  
  // Removed console.log
  process.exit(1);
}

if (require.main === module) {
  main();
}