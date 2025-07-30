#!/usr/bin/env node
// ✅ Phase 1 Validation - التحقق من اكتمال المرحلة الأولى

console.log('✅ PHASE 1 VALIDATION - التحقق من الاكتمال');
console.log('='.repeat(50));

const fs = require('fs');

// Validation checklist
const checklist = {
  'fallback_modules_fixed': false,
  'gas_config_ready': false,
  'script_properties_template': false,
  'deployment_script': false,
  'system_integration': false,
  'basic_tests_passing': false
};

console.log('📋 VALIDATION CHECKLIST:');
console.log('='.repeat(30));

// Check 1: Fallback modules fixed
try {
  require('./real_gas_fixes.js');
  require('./00_utils.js');
  require('./fixed_docs_manager.js');
  require('./fixed_telemetry.js');
  require('./fixed_metrics.js');
  require('./fixed_ai.js');
  require('./fixed_tools.js');
  require('./fixed_security.js');
  require('./fixed_api.js');
  require('./fixed_dispatcher.js');
  require('./01_config_fixed.js');
  
  GAssistant.Utils.Injector.buildAllModules();
  
  const fallbackCount = Object.values(GAssistant.Utils.Injector._moduleExports)
    .filter(m => m._isFallback).length;
  
  if (fallbackCount === 0) {
    checklist.fallback_modules_fixed = true;
    console.log('✅ 1. Fallback modules: All fixed (0 fallbacks)');
  } else {
    console.log(`❌ 1. Fallback modules: ${fallbackCount} still in fallback`);
  }
} catch (error) {
  console.log(`❌ 1. Fallback modules: Error - ${error.message}`);
}

// Check 2: GAS config ready
if (fs.existsSync('appsscript.json')) {
  const config = JSON.parse(fs.readFileSync('appsscript.json', 'utf8'));
  if (config.oauthScopes && config.oauthScopes.length > 0) {
    checklist.gas_config_ready = true;
    console.log('✅ 2. Google Apps Script config: Ready');
  } else {
    console.log('❌ 2. Google Apps Script config: Missing scopes');
  }
} else {
  console.log('❌ 2. Google Apps Script config: appsscript.json missing');
}

// Check 3: Script Properties template
if (fs.existsSync('script_properties_template.js')) {
  const template = fs.readFileSync('script_properties_template.js', 'utf8');
  if (template.includes('GEMINI_API_KEY') && template.includes('DEBUG_MODE')) {
    checklist.script_properties_template = true;
    console.log('✅ 3. Script Properties template: Created');
  } else {
    console.log('❌ 3. Script Properties template: Incomplete');
  }
} else {
  console.log('❌ 3. Script Properties template: Missing');
}

// Check 4: Deployment script
if (fs.existsSync('deploy_to_gas.js')) {
  const deployScript = fs.readFileSync('deploy_to_gas.js', 'utf8');
  if (deployScript.includes('clasp push')) {
    checklist.deployment_script = true;
    console.log('✅ 4. Deployment script: Ready');
  } else {
    console.log('❌ 4. Deployment script: Incomplete');
  }
} else {
  console.log('❌ 4. Deployment script: Missing');
}

// Check 5: System integration
try {
  const moduleCount = Object.keys(GAssistant.Utils.Injector._moduleExports).length;
  if (moduleCount >= 10) {
    checklist.system_integration = true;
    console.log(`✅ 5. System integration: Working (${moduleCount} modules)`);
  } else {
    console.log(`❌ 5. System integration: Only ${moduleCount} modules loaded`);
  }
} catch (error) {
  console.log(`❌ 5. System integration: Error - ${error.message}`);
}

// Check 6: Basic tests
try {
  const config = GAssistant.Utils.Injector.get('Config').Config;
  const ai = GAssistant.Utils.Injector.get('AI').AI;
  const tools = GAssistant.Utils.Injector.get('Tools').Tools;
  
  if (config && ai && tools) {
    // Test basic operations
    const configTest = config.get('DEBUG_MODE');
    const aiTest = ai.ask('test');
    const toolTest = tools.execute('test', {});
    
    if (configTest !== undefined && aiTest && toolTest) {
      checklist.basic_tests_passing = true;
      console.log('✅ 6. Basic tests: All passing');
    } else {
      console.log('❌ 6. Basic tests: Some operations failed');
    }
  } else {
    console.log('❌ 6. Basic tests: Core modules not available');
  }
} catch (error) {
  console.log(`❌ 6. Basic tests: Error - ${error.message}`);
}

// Calculate completion percentage
const completedTasks = Object.values(checklist).filter(Boolean).length;
const totalTasks = Object.keys(checklist).length;
const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

console.log('\n📊 PHASE 1 COMPLETION:');
console.log('='.repeat(30));
console.log(`Completed: ${completedTasks}/${totalTasks} tasks`);
console.log(`Progress: ${completionPercentage}%`);

if (completionPercentage === 100) {
  console.log('\n🎉 PHASE 1 COMPLETE!');
  console.log('✅ All validation checks passed');
  console.log('✅ Ready for Phase 2: AI Integration');
  
  console.log('\n📋 DELIVERABLES SUMMARY:');
  console.log('✅ Fixed modules: No fallbacks remaining');
  console.log('✅ appsscript.json: OAuth scopes configured');
  console.log('✅ Script Properties: Template ready');
  console.log('✅ Deployment: Script ready for clasp');
  console.log('✅ Integration: All systems working');
  console.log('✅ Testing: Basic operations validated');
  
  console.log('\n🚀 NEXT PHASE PREPARATION:');
  console.log('1. Set up Google Apps Script project');
  console.log('2. Configure Gemini API key');
  console.log('3. Deploy and test in GAS environment');
  console.log('4. Begin AI integration development');
  
} else {
  console.log('\n⚠️ PHASE 1 INCOMPLETE');
  console.log(`${100 - completionPercentage}% remaining tasks`);
  
  console.log('\n❌ FAILED CHECKS:');
  Object.entries(checklist).forEach(([task, completed]) => {
    if (!completed) {
      console.log(`  - ${task.replace(/_/g, ' ')}`);
    }
  });
  
  console.log('\n📋 REQUIRED ACTIONS:');
  console.log('Fix the failed checks above before proceeding to Phase 2');
}

console.log('\n📈 OVERALL PROJECT STATUS:');
console.log(`Foundation: 30% (Phase 1 target)`);
console.log(`Current completion: ${completionPercentage}% of Phase 1`);
console.log(`Project overall: ${Math.round(30 * completionPercentage / 100)}% of total`);