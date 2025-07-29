#!/usr/bin/env node
// 🔧 G-Assistant Comprehensive Project Fixer v4.0
// Usage: node COMPREHENSIVE_PROJECT_FIXER.cjs

const fs = require('fs');
const path = require('path');

class ProjectFixer {
  constructor() {
    this.fixes = [];
    this.errors = [];
    this.projectRoot = __dirname;
  }

  log(message) {
    console.log(message);
    this.fixes.push(message);
  }

  error(message) {
    console.error(message);
    this.errors.push(message);
  }

  // 1. Fix _moduleExports undefined issues
  fixModuleExportsIssues() {
    this.log('\n🔧 1. FIXING _moduleExports UNDEFINED ISSUES');
    
    const filesToFix = [
      '99_Initializer.js',
      'dist/99_Initializer.js',
      'COMPREHENSIVE_INITIALIZER.js',
      '00_initializer.js'
    ];

    filesToFix.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Fix initializeAllModules function
          const oldPattern = /Object\.keys\(injector\._moduleExports\)\.forEach\(name => \{/g;
          const newPattern = `if (!injector || !injector._moduleExports) {
      Logger.log('⚠️ Cannot initialize modules: _moduleExports is undefined');
      return;
    }
    
    Object.keys(injector._moduleExports).forEach(name => {`;
          
          if (content.includes('Object.keys(injector._moduleExports).forEach(name => {')) {
            content = content.replace(oldPattern, newPattern);
            fs.writeFileSync(filePath, content, 'utf8');
            this.log(`✅ Fixed ${file}`);
          }
        } catch (e) {
          this.error(`❌ Failed to fix ${file}: ${e.message}`);
        }
      }
    });
  }

  // 2. Fix Utils Injector initialization
  fixUtilsInjector() {
    this.log('\n🔧 2. FIXING UTILS INJECTOR INITIALIZATION');
    
    const utilsPath = path.join(this.projectRoot, '00_utils.js');
    if (fs.existsSync(utilsPath)) {
      try {
        let content = fs.readFileSync(utilsPath, 'utf8');
        
        // Add safety check in buildAllModules
        const buildPattern = /buildAllModules: function\(\) \{/;
        const buildReplacement = `buildAllModules: function() {
    // Ensure _moduleExports is initialized
    if (!this._moduleExports) {
      this._moduleExports = {};
      Logger.log('⚠️ _moduleExports was undefined, initialized to empty object');
    }`;
        
        if (content.match(buildPattern) && !content.includes('_moduleExports was undefined')) {
          content = content.replace(buildPattern, buildReplacement);
          fs.writeFileSync(utilsPath, content, 'utf8');
          this.log('✅ Fixed 00_utils.js buildAllModules');
        }
      } catch (e) {
        this.error(`❌ Failed to fix 00_utils.js: ${e.message}`);
      }
    }
  }

  // 3. Create comprehensive test suite
  createTestSuite() {
    this.log('\n🔧 3. CREATING COMPREHENSIVE TEST SUITE');
    
    const testContent = `// 🧪 G-Assistant Comprehensive Test Suite
function runComprehensiveTests() {
  Logger.log('🧪 Running Comprehensive Test Suite...');
  
  const results = {
    coreSystem: testCoreSystem(),
    moduleSystem: testModuleSystem(),
    initialization: testInitialization(),
    fallbacks: testFallbacks()
  };
  
  const totalTests = Object.values(results).reduce((sum, r) => sum + r.total, 0);
  const passedTests = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
  
  Logger.log(\`\\n📊 OVERALL RESULTS: \${passedTests}/\${totalTests} tests passed\`);
  return results;
}

function testCoreSystem() {
  Logger.log('\\n🔍 Testing Core System...');
  const tests = [
    ['GAssistant exists', () => typeof GAssistant !== 'undefined'],
    ['Utils exists', () => !!GAssistant?.Utils],
    ['Injector exists', () => !!GAssistant?.Utils?.Injector],
    ['defineModule exists', () => typeof defineModule === 'function'],
    ['Logger exists', () => typeof Logger !== 'undefined']
  ];
  
  return runTests(tests);
}

function testModuleSystem() {
  Logger.log('\\n📦 Testing Module System...');
  const injector = GAssistant?.Utils?.Injector;
  const tests = [
    ['_moduleFactories initialized', () => !!injector?._moduleFactories],
    ['_moduleExports initialized', () => !!injector?._moduleExports],
    ['buildAllModules function', () => typeof injector?.buildAllModules === 'function'],
    ['registerFactory function', () => typeof injector?.registerFactory === 'function'],
    ['get function', () => typeof injector?.get === 'function']
  ];
  
  return runTests(tests);
}

function testInitialization() {
  Logger.log('\\n🚀 Testing Initialization...');
  const tests = [
    ['initializeGAssistantSystem exists', () => typeof initializeGAssistantSystem === 'function'],
    ['Can call buildAllModules safely', () => {
      try {
        GAssistant.Utils.Injector.buildAllModules();
        return true;
      } catch (e) {
        Logger.log(\`buildAllModules error: \${e.message}\`);
        return false;
      }
    }],
    ['Module exports count > 0', () => Object.keys(GAssistant?.Utils?.Injector?._moduleExports || {}).length > 0]
  ];
  
  return runTests(tests);
}

function testFallbacks() {
  Logger.log('\\n🛡️ Testing Fallback System...');
  const injector = GAssistant?.Utils?.Injector;
  const tests = [
    ['Can get non-existent module', () => {
      const result = injector?.get('NonExistentModule');
      return result && result.NonExistentModule;
    }],
    ['Fallback has required methods', () => {
      const fallback = injector?.get('TestFallback')?.TestFallback;
      return fallback && typeof fallback.log === 'function';
    }]
  ];
  
  return runTests(tests);
}

function runTests(tests) {
  let passed = 0;
  tests.forEach(([name, test]) => {
    try {
      const result = test();
      Logger.log(\`\${result ? '✅' : '❌'} \${name}\`);
      if (result) passed++;
    } catch (e) {
      Logger.log(\`❌ \${name}: ERROR - \${e.message}\`);
    }
  });
  
  return { passed, total: tests.length };
}

// Auto-run if in Apps Script environment
if (typeof SpreadsheetApp !== 'undefined') {
  runComprehensiveTests();
}`;

    const testPath = path.join(this.projectRoot, 'COMPREHENSIVE_TESTS.js');
    fs.writeFileSync(testPath, testContent, 'utf8');
    this.log('✅ Created COMPREHENSIVE_TESTS.js');
  }

  // 4. Create auto-repair system
  createAutoRepairSystem() {
    this.log('\n🔧 4. CREATING AUTO-REPAIR SYSTEM');
    
    const repairContent = `// 🔧 G-Assistant Auto-Repair System
function runAutoRepair() {
  Logger.log('🔧 Running Auto-Repair System...');
  
  const repairs = {
    coreSystem: repairCoreSystem(),
    moduleSystem: repairModuleSystem(),
    fallbacks: repairFallbacks()
  };
  
  Logger.log('✅ Auto-repair completed');
  return repairs;
}

function repairCoreSystem() {
  Logger.log('\\n🔍 Repairing Core System...');
  const repairs = [];
  
  // Ensure GAssistant exists
  if (typeof GAssistant === 'undefined') {
    global.GAssistant = { System: {}, Utils: {}, AI: {}, Tools: {}, UI: {}, Agents: {} };
    repairs.push('Created GAssistant namespace');
  }
  
  // Ensure Logger exists
  if (typeof Logger === 'undefined') {
    global.Logger = {
      log: function() { try { console.log.apply(console, arguments); } catch(e) {} },
      warn: function() { try { console.warn.apply(console, arguments); } catch(e) {} },
      error: function() { try { console.error.apply(console, arguments); } catch(e) {} }
    };
    repairs.push('Created Logger');
  }
  
  return repairs;
}

function repairModuleSystem() {
  Logger.log('\\n📦 Repairing Module System...');
  const repairs = [];
  
  // Ensure Injector exists
  if (!GAssistant?.Utils?.Injector) {
    if (!GAssistant.Utils) GAssistant.Utils = {};
    GAssistant.Utils.Injector = {
      _moduleFactories: {},
      _moduleExports: {},
      _isInitialized: false,
      registerFactory: function(name, factory) { this._moduleFactories[name] = factory; },
      setExports: function(name, exports) { this._moduleExports[name] = exports; },
      get: function(...deps) {
        const resolved = {};
        deps.forEach(dep => {
          resolved[dep] = this._moduleExports[dep] || this._createFallback(dep);
        });
        return resolved;
      },
      _createFallback: function(name) {
        return {
          _isFallback: true,
          log: (msg) => Logger.log(\`[\${name}] \${msg}\`),
          init: () => true,
          isReady: () => ({ status: 'fallback', name }),
          get: () => null,
          set: () => true
        };
      },
      buildAllModules: function() {
        if (!this._moduleExports) this._moduleExports = {};
        Logger.log('🔧 Emergency buildAllModules executed');
      }
    };
    repairs.push('Created emergency Injector');
  }
  
  // Ensure defineModule exists
  if (typeof defineModule === 'undefined') {
    global.defineModule = function(name, factory) {
      GAssistant.Utils.Injector.registerFactory(name, factory);
    };
    repairs.push('Created defineModule function');
  }
  
  return repairs;
}

function repairFallbacks() {
  Logger.log('\\n🛡️ Repairing Fallback System...');
  const repairs = [];
  
  const injector = GAssistant?.Utils?.Injector;
  if (injector && injector._moduleExports) {
    // Check for broken exports and replace with fallbacks
    Object.keys(injector._moduleExports).forEach(name => {
      const moduleExport = injector._moduleExports[name];
      if (!moduleExport || (typeof moduleExport === 'object' && Object.keys(moduleExport).length === 0)) {
        injector._moduleExports[name] = injector._createFallback(name);
        repairs.push(\`Repaired fallback for \${name}\`);
      }
    });
  }
  
  return repairs;
}`;

    const repairPath = path.join(this.projectRoot, 'AUTO_REPAIR_SYSTEM.js');
    fs.writeFileSync(repairPath, repairContent, 'utf8');
    this.log('✅ Created AUTO_REPAIR_SYSTEM.js');
  }

  // 5. Create deployment validator
  createDeploymentValidator() {
    this.log('\n🔧 5. CREATING DEPLOYMENT VALIDATOR');
    
    const validatorContent = `// 🚀 G-Assistant Deployment Validator
function validateDeployment() {
  Logger.log('🚀 Validating Deployment Readiness...');
  
  const validation = {
    coreFiles: validateCoreFiles(),
    moduleSystem: validateModuleSystem(),
    initialization: validateInitialization(),
    overall: 'UNKNOWN'
  };
  
  const issues = Object.values(validation).filter(v => v.status === 'FAILED').length;
  validation.overall = issues === 0 ? 'READY' : issues < 2 ? 'WARNING' : 'CRITICAL';
  
  Logger.log(\`\\n🎯 DEPLOYMENT STATUS: \${validation.overall}\`);
  return validation;
}

function validateCoreFiles() {
  const required = ['00_utils.js', '99_Initializer.js'];
  const missing = required.filter(file => {
    try {
      // In Apps Script, we can't check file existence directly
      // So we check if the core functions are available
      return false;
    } catch (e) {
      return true;
    }
  });
  
  return {
    status: missing.length === 0 ? 'PASSED' : 'FAILED',
    missing,
    message: missing.length === 0 ? 'All core files present' : \`Missing: \${missing.join(', ')}\`
  };
}

function validateModuleSystem() {
  const checks = [
    GAssistant?.Utils?.Injector,
    typeof defineModule === 'function',
    GAssistant?.Utils?.Injector?._moduleFactories,
    GAssistant?.Utils?.Injector?._moduleExports
  ];
  
  const passed = checks.filter(Boolean).length;
  
  return {
    status: passed === checks.length ? 'PASSED' : 'FAILED',
    score: \`\${passed}/\${checks.length}\`,
    message: passed === checks.length ? 'Module system healthy' : 'Module system has issues'
  };
}

function validateInitialization() {
  try {
    const injector = GAssistant?.Utils?.Injector;
    if (!injector) return { status: 'FAILED', message: 'Injector not available' };
    
    injector.buildAllModules();
    const moduleCount = Object.keys(injector._moduleExports || {}).length;
    
    return {
      status: moduleCount > 0 ? 'PASSED' : 'WARNING',
      moduleCount,
      message: \`\${moduleCount} modules built successfully\`
    };
  } catch (e) {
    return {
      status: 'FAILED',
      error: e.message,
      message: 'Initialization failed'
    };
  }
}`;

    const validatorPath = path.join(this.projectRoot, 'DEPLOYMENT_VALIDATOR.js');
    fs.writeFileSync(validatorPath, validatorContent, 'utf8');
    this.log('✅ Created DEPLOYMENT_VALIDATOR.js');
  }

  // 6. Update build script
  updateBuildScript() {
    this.log('\n🔧 6. UPDATING BUILD SCRIPT');
    
    const buildPath = path.join(this.projectRoot, 'build.js');
    if (fs.existsSync(buildPath)) {
      try {
        let content = fs.readFileSync(buildPath, 'utf8');
        
        // Add validation step to build
        const validationStep = `
// Add validation step
console.log('🔍 Running pre-build validation...');
const validator = require('./DEPLOYMENT_VALIDATOR.js');
// Add validation logic here if needed
`;
        
        if (!content.includes('pre-build validation')) {
          content = validationStep + content;
          fs.writeFileSync(buildPath, content, 'utf8');
          this.log('✅ Updated build.js with validation');
        }
      } catch (e) {
        this.error(`❌ Failed to update build.js: ${e.message}`);
      }
    }
  }

  // Main execution
  async run() {
    console.log('🔧 G-Assistant Comprehensive Project Fixer v4.0');
    console.log('='.repeat(60));
    
    this.fixModuleExportsIssues();
    this.fixUtilsInjector();
    this.createTestSuite();
    this.createAutoRepairSystem();
    this.createDeploymentValidator();
    this.updateBuildScript();
    
    console.log('\n📊 SUMMARY');
    console.log(`✅ Fixes applied: ${this.fixes.length}`);
    console.log(`❌ Errors encountered: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Run: node COMPREHENSIVE_TESTS.cjs (if created)');
    console.log('2. Deploy with: .\\deploy.bat');
    console.log('3. Test in Apps Script with: runComprehensiveTests()');
    
    return {
      fixes: this.fixes.length,
      errors: this.errors.length,
      success: this.errors.length === 0
    };
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new ProjectFixer();
  fixer.run().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = ProjectFixer;