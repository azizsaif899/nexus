#!/usr/bin/env node
// 🚀 Complete System Loader - تحميل جميع الوحدات

const fs = require('fs');
const path = require('path');

// Load core system
require('./00_utils.js');

console.log('🚀 Loading G-Assistant Complete System...');

// Load all module files
const moduleFiles = [
  '01_config.js',
  '02_intro.js',
  // UI modules
  '10_ui/0_ui_dialogue.js',
  '10_ui/1_ui.gs.js',
  '10_ui/2_ui_developerSidebar.js',
  '10_ui/3_ui_action_handler.js',
  '10_ui/4_ui_dev_sidebar_handler.js',
  // AI modules
  '20_ai/0_ai_constitution.js',
  '20_ai/1_ai_memory.js',
  '20_ai/3_ai_dispatcher.js',
  '20_ai/4_ai_context.js',
  '20_ai/5_ai_core.js',
  '20_ai/5_ai_orchestrator.js',
  '20_ai/6_ai_geminiAdapter.js',
  '20_ai/7_ai_json_query.js',
  '20_ai/8_ai_code_assistance.js',
  // Agent modules
  '25_ai_agents/0_agent_triggers.js',
  '25_ai_agents/2_agents_router.js',
  '25_ai_agents/agent_cfo.gs.js',
  '25_ai_agents/agent_developer.gs.js',
  '25_ai_agents/agents_catalog.js',
  // Tools
  '30_tools/0_tools_catalog.js',
  '30_tools/1_tools_sheets.js',
  '30_tools/2_tools_accounting.js',
  '30_tools/4_tools_developer.js',
  // System modules
  '90_System/06_ModuleVerifier.js',
  '90_System/08_HealthCheck.js',
  // Final initializer
  '99_Initializer.js'
];

let loadedCount = 0;
let errorCount = 0;

moduleFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      require(`./${file}`);
      loadedCount++;
      console.log(`✅ Loaded: ${file}`);
    } else {
      console.log(`⚠️ Not found: ${file}`);
    }
  } catch (error) {
    errorCount++;
    console.log(`❌ Error loading ${file}: ${error.message}`);
  }
});

console.log(`\n📊 Loading Summary:`);
console.log(`✅ Loaded: ${loadedCount} files`);
console.log(`❌ Errors: ${errorCount} files`);

// Build all modules
console.log('\n🔧 Building all modules...');
try {
  GAssistant.Utils.Injector.buildAllModules();
  console.log('✅ All modules built successfully');
} catch (error) {
  console.log(`❌ Build error: ${error.message}`);
}

// Run system doctor
console.log('\n🩺 Running System Doctor...');
require('./system_doctor_fixed.cjs');
const report = runSystemDoctor({ deepScan: true, traceDependencies: true });

console.log('\n🎯 FINAL STATUS:');
console.log(`Overall: ${report.overall}`);
console.log(`Factories: ${report.checks.factories?.valid?.length || 0}`);
console.log(`Ready modules: ${report.checks.readiness?.ready?.length || 0}`);

// Run dependency analysis
console.log('\n🔬 Running Dependency Analysis...');
const depReport = runDependencyDoctor();

console.log('\n✅ System loading complete!');