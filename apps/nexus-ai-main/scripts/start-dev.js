#!/usr/bin/env node
const { spawn, exec } = require('child_process');

const port = process.argv[2] || 3000;

console.log('🚀 Starting Nexus AI Development Server...');
console.log('=====================================');

// Kill existing processes
console.log(`🔫 Cleaning port ${port}...`);
exec(`node scripts/kill-port.js ${port}`, () => {
  
  // Start development server
  setTimeout(() => {
    console.log(`✅ Starting server on port ${port}...`);
    console.log(`🌐 URL: http://localhost:${port}`);
    console.log('📝 Press Ctrl+C to stop');
    console.log('=====================================\n');
    
    const vite = spawn('npx', ['vite', '--port', port, '--host', 'localhost'], {
      stdio: 'inherit',
      shell: true
    });
    
    vite.on('close', (code) => {
      console.log(`\n🛑 Server stopped with code ${code}`);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping server...');
      vite.kill();
      process.exit(0);
    });
    
  }, 2000);
});