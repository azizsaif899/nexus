#!/usr/bin/env node
const readline = require('readline');
const { exec, spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log('🎯 NEXUS AI - Development Manager');
console.log('=================================');

function showMenu() {
  console.log('\n📋 Available Options:');
  console.log('1. 🚀 Start Development Server');
  console.log('2. 🔍 Check Port Status');
  console.log('3. 🔫 Kill Port Processes');
  console.log('4. 🧹 Clear Cache');
  console.log('5. 📦 Install Dependencies');
  console.log('6. 🔄 Full Reset');
  console.log('7. 🚪 Exit');
  console.log('\n');
}

function executeOption(choice) {
  switch(choice) {
    case '1':
      console.log('🚀 Starting development server...');
      spawn('node', ['scripts/start-dev.js'], { stdio: 'inherit' });
      break;
      
    case '2':
      exec('node scripts/check-port.js 3000', (err, stdout) => {
        console.log(stdout);
        askForChoice();
      });
      break;
      
    case '3':
      exec('node scripts/kill-port.js 3000', (err, stdout) => {
        console.log(stdout);
        askForChoice();
      });
      break;
      
    case '4':
      exec('node scripts/clear-cache.js', (err, stdout) => {
        console.log(stdout);
        askForChoice();
      });
      break;
      
    case '5':
      console.log('📦 Installing dependencies...');
      spawn('npm', ['install'], { stdio: 'inherit' }).on('close', () => {
        console.log('✅ Dependencies installed!');
        askForChoice();
      });
      break;
      
    case '6':
      console.log('🔄 Full reset: cleaning and reinstalling...');
      exec('node scripts/clear-cache.js && rmdir /s /q node_modules 2>nul && del package-lock.json 2>nul', () => {
        spawn('npm', ['install'], { stdio: 'inherit' }).on('close', () => {
          console.log('✅ Full reset completed!');
          askForChoice();
        });
      });
      break;
      
    case '7':
      console.log('👋 Goodbye!');
      rl.close();
      break;
      
    default:
      console.log('❌ Invalid option. Please choose 1-7.');
      askForChoice();
  }
}

function askForChoice() {
  rl.question('Choose option (1-7): ', (choice) => {
    executeOption(choice.trim());
  });
}

// Start
showMenu();
askForChoice();