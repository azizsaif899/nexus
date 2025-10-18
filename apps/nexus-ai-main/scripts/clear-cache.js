#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🧹 Clearing cache and temporary files...');

const dirsToClean = [
  'node_modules/.vite',
  'node_modules/.cache',
  'dist',
  'coverage',
  '.nyc_output'
];

let cleaned = 0;

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Removed: ${dir}`);
      cleaned++;
    } catch (err) {
      console.log(`❌ Failed to remove: ${dir}`);
    }
  }
});

// Clean npm cache
exec('npm cache clean --force', (error) => {
  if (!error) {
    console.log('✅ NPM cache cleaned');
  }
  
  console.log(`🎯 Cleaned ${cleaned} directories`);
  console.log('✨ Cache cleanup completed!');
});