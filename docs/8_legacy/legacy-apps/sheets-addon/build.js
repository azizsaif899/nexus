/**
 * Build script for G-Assistant Sheets Add-on
 */

const fs = require('fs-extra');
const path = require('path');

async function build() {
  // Removed console.log
  
  try {
    // Copy source files
    await fs.copy('src', 'dist');
    
    // Removed console.log
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();