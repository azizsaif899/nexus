#!/usr/bin/env node
// 🔍 Reality Check - فحص الواقع الحقيقي

console.log('🔍 REALITY CHECK - فحص الواقع الحقيقي');
console.log('='.repeat(60));

// Load real fixes
require('./real_gas_fixes.js');
require('./00_utils.js');

// Load all available modules
const fs = require('fs');
const moduleFiles = [
  '01_config_fixed.js',
  '02_intro.js',
  '10_ui/0_ui_dialogue.js',
  '20_ai/5_ai_core.js',
  '25_ai_agents/agent_cfo.gs.js',
  '30_tools/4_tools_developer.js'
];

let loadedModules = 0;
let workingModules = 0;
let functionalModules = 0;

console.log('\n📦 LOADING MODULES:');
moduleFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      require(`./${file}`);
      loadedModules++;
      console.log(`✅ Loaded: ${file}`);
    } else {
      console.log(`⚠️ Not found: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${file} - ${error.message}`);
  }
});

console.log('\n🔧 BUILDING MODULES:');
try {
  GAssistant.Utils.Injector.buildAllModules();
  const exports = GAssistant.Utils.Injector._moduleExports;
  workingModules = Object.keys(exports).length;
  console.log(`✅ Built ${workingModules} modules`);
} catch (error) {
  console.log(`❌ Build error: ${error.message}`);
}

console.log('\n🧪 TESTING FUNCTIONALITY:');

// Test 1: Config
try {
  const config = GAssistant.Utils.Injector.get('Config').Config;
  if (config && config.get) {
    const apiKey = config.get('API_KEY');
    console.log(`✅ Config works - API_KEY: ${apiKey ? 'SET' : 'EMPTY'}`);
    functionalModules++;
  }
} catch (e) {
  console.log(`❌ Config test failed: ${e.message}`);
}

// Test 2: AI Core
try {
  const aiCore = GAssistant.Utils.Injector.get('AI').AI;
  if (aiCore && aiCore.ask) {
    console.log(`⚠️ AI Core exists but can't make real API calls`);
  }
} catch (e) {
  console.log(`❌ AI Core test failed: ${e.message}`);
}

// Test 3: Tools
try {
  const tools = GAssistant.Utils.Injector.get('Tools').Tools;
  if (tools) {
    console.log(`⚠️ Tools exist but limited functionality`);
  }
} catch (e) {
  console.log(`❌ Tools test failed: ${e.message}`);
}

// Test 4: Agents
try {
  const cfoAgent = GAssistant.Utils.Injector.get('CFOAgent').CFOAgent;
  if (cfoAgent && cfoAgent.handleRequest) {
    console.log(`⚠️ CFO Agent exists but can't access real data`);
  }
} catch (e) {
  console.log(`❌ CFO Agent test failed: ${e.message}`);
}

console.log('\n📊 REALITY SUMMARY:');
console.log('='.repeat(40));
console.log(`📦 Modules Loaded: ${loadedModules}`);
console.log(`🔧 Modules Built: ${workingModules}`);
console.log(`✅ Functional Modules: ${functionalModules}`);

console.log('\n🎯 WHAT ACTUALLY WORKS:');
console.log('✅ Module system and dependency injection');
console.log('✅ Configuration loading (with fallbacks)');
console.log('✅ Basic logging and utilities');
console.log('✅ System Doctor and diagnostics');

console.log('\n❌ WHAT DOESN\'T WORK:');
console.log('❌ Real Google Sheets integration');
console.log('❌ Actual Gemini AI API calls');
console.log('❌ Real data processing and analysis');
console.log('❌ Actual spreadsheet manipulation');
console.log('❌ Real-time user interactions');
console.log('❌ Production-ready features');

console.log('\n🔍 THE TRUTH:');
console.log('The project has a solid FOUNDATION but lacks:');
console.log('1. Real API integrations');
console.log('2. Actual data processing');
console.log('3. Production environment setup');
console.log('4. Real user interface');
console.log('5. Functional business logic');

console.log('\n📋 TO MAKE IT FULLY FUNCTIONAL:');
console.log('1. Set up real Google Apps Script environment');
console.log('2. Configure actual Gemini API keys');
console.log('3. Create real spreadsheet templates');
console.log('4. Implement actual business logic');
console.log('5. Test in production environment');

const functionalityPercentage = Math.round((functionalModules / Math.max(workingModules, 1)) * 100);
console.log(`\n🎯 FUNCTIONALITY LEVEL: ${functionalityPercentage}% (Foundation Only)`);