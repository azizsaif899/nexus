/**
 * Build script for G-Assistant Sheets Add-on
 */

const fs = require('fs-extra');
const path = require('path');

async function build() {
  console.log('🔨 Building Sheets Add-on...');
  
  try {
    // Copy source files
    await fs.copy('src', 'dist');
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();