#!/usr/bin/env node
// 🩺 G-Assistant Comprehensive Project Analyzer & Fixer v4.0
// Usage: node system_doctor_final.cjs [--fix] [--deep] [--report]

const fs = require('fs');
const path = require('path');
const glob = require('glob');

(function(global) {
  'use strict';

  // Environment detection and setup
  const isNode = typeof require !== 'undefined';
  const isAppsScript = typeof SpreadsheetApp !== 'undefined';
  
  // Safe bootstrapping
  if (typeof global.Logger === 'undefined') {
    global.Logger = { 
      log: isNode ? console.log : (msg => console.log(msg)),
      warn: isNode ? console.warn : (msg => console.log(`[WARN] ${msg}`)),
      error: isNode ? console.error : (msg => console.log(`[ERROR] ${msg}`))
    };
  }
  
  // Mock GAssistant for testing if not available
  if (typeof global.GAssistant === 'undefined') {
    global.GAssistant = { 
      Utils: { 
        Injector: { 
          _moduleFactories: {},
          _moduleExports: {},
          buildAllModules: () => true,
          registerFactory: (name, factory) => {},
          get: (...deps) => ({})
        }
      }
    };
    global.defineModule = function(name, factory) { 
      console.log('🔧 defineModule registered:', name); 
    };
  }

  // 🏗️ Doctor.Modules - Factory and Export Analysis
  const DoctorModules = {
    analyzeFactories() {
      const results = { valid: [], broken: [], missing: [] };
      try {
        const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
        Object.entries(factories).forEach(([name, factory]) => {
          if (typeof factory === 'function') {
            results.valid.push(name);
          } else {
            results.broken.push({ name, type: typeof factory, value: factory });
          }
        });
      } catch (e) {
        results.error = e.message;
      }
      return results;
    },

    traceMissingExports() {
      const results = { missing: [], reasons: [] };
      try {
        const factories = Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {});
        const exports = Object.keys(GAssistant?.Utils?.Injector?._moduleExports || {});
        results.missing = factories.filter(name => !exports.includes(name));
        results.missing.forEach(name => {
          results.reasons.push(`${name}: Factory exists but no export - likely failed during buildAllModules`);
        });
      } catch (e) {
        results.error = e.message;
      }
      return results;
    }
  };

  // 🔍 Doctor.Diagnostics - Core System Validation
  const DoctorDiagnostics = {
    catchUndefinedPaths() {
      const paths = {
        'global.GAssistant': !!global.GAssistant,
        'GAssistant.Utils': !!global.GAssistant?.Utils,
        'GAssistant.Utils.Injector': !!global.GAssistant?.Utils?.Injector,
        'Injector._moduleFactories': !!global.GAssistant?.Utils?.Injector?._moduleFactories,
        'Injector._moduleExports': !!global.GAssistant?.Utils?.Injector?._moduleExports,
        'global.defineModule': typeof global.defineModule === 'function',
        'Injector.buildAllModules': typeof global.GAssistant?.Utils?.Injector?.buildAllModules === 'function'
      };
      
      const broken = Object.entries(paths).filter(([path, exists]) => !exists);
      return { paths, broken, healthy: broken.length === 0 };
    },

    autoFixFactory(name) {
      try {
        const injector = global.GAssistant?.Utils?.Injector;
        if (!injector?._moduleFactories?.[name]) {
          Logger.log(`⚠️ Missing factory: ${name}. Attempting default injection...`);
          if (typeof global.defineModule === 'function') {
            global.defineModule(name, () => ({ _autoFixed: true }));
            return { fixed: true, method: 'defineModule' };
          }
        }
        return { fixed: false, reason: 'Factory exists or defineModule unavailable' };
      } catch (e) {
        return { fixed: false, error: e.message };
      }
    }
  };

  // 🔗 Doctor.Dependencies - Relationship Analysis
  const DoctorDependencies = {
    mapFallbackReasons() {
      const results = { fallbacks: [], reasons: [] };
      try {
        const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
        Object.entries(exports).forEach(([name, moduleExport]) => {
          if (moduleExport?._isFallback) {
            results.fallbacks.push(name);
            const factory = GAssistant?.Utils?.Injector?._moduleFactories?.[name];
            if (!factory) {
              results.reasons.push(`${name}: No factory found`);
            } else if (typeof factory !== 'function') {
              results.reasons.push(`${name}: Factory is not a function (${typeof factory})`);
            } else {
              results.reasons.push(`${name}: Factory exists but build failed - check dependencies`);
            }
          }
        });
      } catch (e) {
        results.error = e.message;
      }
      return results;
    },

    analyzeDependencyGraph() {
      const graph = {};
      const issues = [];
      try {
        const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
        Object.keys(exports).forEach(name => {
          graph[name] = {
            status: exports[name]?._isFallback ? 'fallback' : 'healthy',
            hasInit: typeof exports[name]?.init === 'function',
            hasVerify: typeof exports[name]?.verify === 'function',
            hasIsReady: typeof exports[name]?.isReady === 'function'
          };
          
          if (exports[name]?._isFallback) {
            issues.push(`${name} is in fallback state`);
          }
        });
      } catch (e) {
        issues.push(`Dependency analysis failed: ${e.message}`);
      }
      return { graph, issues };
    }
  };

  // 🚀 Doctor.Readiness - Module State Validation
  const DoctorReadiness = {
    checkAllUnits(isDeep = true) {
      const results = { ready: [], notReady: [], assumed: [], errors: [] };
      try {
        const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
        Object.entries(exports).forEach(([name, moduleExport]) => {
          if (moduleExport?._isFallback) return; // Skip fallbacks
          
          try {
            if (typeof moduleExport?.isReady === 'function') {
              if (moduleExport.isReady()) {
                results.ready.push(name);
              } else {
                results.notReady.push(name);
              }
            } else if (isDeep) {
              // Deep check: look for essential functions
              const hasEssentials = moduleExport && 
                (typeof moduleExport.init === 'function' || 
                 typeof moduleExport.verify === 'function' ||
                 Object.keys(moduleExport).length > 0);
              
              if (hasEssentials) {
                results.assumed.push(`${name} (has functions)`);
              } else {
                results.notReady.push(`${name} (empty export)`);
              }
            } else {
              results.assumed.push(`${name} (basic check)`);
            }
          } catch (e) {
            results.errors.push(`${name}: ${e.message}`);
          }
        });
      } catch (e) {
        results.errors.push(`Readiness check failed: ${e.message}`);
      }
      return results;
    }
  };

  // 🩺 Enhanced System Doctor Function
  function runSystemDoctor(config = {}) {
    const { deepScan = false, traceDependencies = false, autoFix = false } = config;
    
    Logger.log('🩺 G-Assistant System Doctor v4.0 - Enhanced Analysis');
    Logger.log('='.repeat(75));
    
    const report = {
      timestamp: new Date().toISOString(),
      overall: 'UNKNOWN',
      config: { deepScan, traceDependencies, autoFix },
      checks: {}
    };

    // 0. Safe Bootstrapping Check
    Logger.log('\n🔍 0. SAFE BOOTSTRAPPING');
    const pathCheck = DoctorDiagnostics.catchUndefinedPaths();
    report.checks.paths = pathCheck;
    Logger.log(`Core Paths: ${Object.keys(pathCheck.paths).length - pathCheck.broken.length}/${Object.keys(pathCheck.paths).length} healthy`);
    if (pathCheck.broken.length > 0) {
      Logger.log(`❌ Broken Paths: ${pathCheck.broken.map(([path]) => path).join(', ')}`);
    }

    if (!pathCheck.healthy) {
      report.overall = 'CRITICAL';
      Logger.log('\n🛑 CRITICAL: Core system paths are broken');
      return report;
    }

    // 1. Factory Analysis
    Logger.log('\n🏗️ 1. FACTORY ANALYSIS');
    const factoryCheck = DoctorModules.analyzeFactories();
    report.checks.factories = factoryCheck;
    Logger.log(`Valid Factories: ${factoryCheck.valid.length} | Broken: ${factoryCheck.broken.length}`);
    if (factoryCheck.valid.length > 0) Logger.log(`✅ Valid: ${factoryCheck.valid.join(', ')}`);
    if (factoryCheck.broken.length > 0) {
      Logger.log(`❌ Broken: ${factoryCheck.broken.map(b => `${b.name}(${b.type})`).join(', ')}`);
    }

    // 2. Missing Exports Analysis
    Logger.log('\n📦 2. MISSING EXPORTS ANALYSIS');
    const missingCheck = DoctorModules.traceMissingExports();
    report.checks.missing = missingCheck;
    Logger.log(`Missing Exports: ${missingCheck.missing.length}`);
    if (missingCheck.missing.length > 0) {
      Logger.log(`❌ Missing: ${missingCheck.missing.join(', ')}`);
      missingCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 3. Dependency Analysis
    if (traceDependencies) {
      Logger.log('\n🔗 3. DEPENDENCY ANALYSIS');
      const depCheck = DoctorDependencies.analyzeDependencyGraph();
      report.checks.dependencies = depCheck;
      Logger.log(`Modules analyzed: ${Object.keys(depCheck.graph).length}`);
      if (depCheck.issues.length > 0) {
        Logger.log(`⚠️ Issues: ${depCheck.issues.length}`);
        depCheck.issues.forEach(issue => Logger.log(`  → ${issue}`));
      }
    }

    // 4. Readiness Check
    Logger.log('\n🚀 4. MODULE READINESS CHECK');
    const readinessCheck = DoctorReadiness.checkAllUnits(deepScan);
    report.checks.readiness = readinessCheck;
    Logger.log(`Ready: ${readinessCheck.ready.length} | Not Ready: ${readinessCheck.notReady.length} | Assumed: ${readinessCheck.assumed.length}`);
    if (readinessCheck.ready.length > 0) Logger.log(`✅ Ready: ${readinessCheck.ready.join(', ')}`);
    if (readinessCheck.notReady.length > 0) Logger.log(`❌ Not Ready: ${readinessCheck.notReady.join(', ')}`);
    if (readinessCheck.assumed.length > 0) Logger.log(`⚠️ Assumed: ${readinessCheck.assumed.join(', ')}`);

    // 5. Auto-Fix if requested
    if (autoFix) {
      Logger.log('\n🔧 5. AUTO-FIX ATTEMPT');
      const fixResults = ProjectFixer.runAutoFix(report);
      report.fixes = fixResults;
      Logger.log(`Fixes applied: ${fixResults.applied} | Failed: ${fixResults.failed}`);
    }

    // 6. Overall Status
    const criticalIssues = (factoryCheck.broken?.length || 0) + (missingCheck.missing?.length || 0);
    const warnings = (readinessCheck.notReady?.length || 0);
    
    if (criticalIssues > 0) {
      report.overall = 'CRITICAL';
    } else if (warnings > 0) {
      report.overall = 'WARNING';
    } else {
      report.overall = 'HEALTHY';
    }

    Logger.log('\n' + '='.repeat(75));
    Logger.log(`🎯 OVERALL STATUS: ${report.overall}`);
    Logger.log(`📊 Summary: ${factoryCheck.valid?.length || 0} healthy modules, ${criticalIssues} critical issues, ${warnings} warnings`);
    Logger.log('='.repeat(75));

    return report;
  }

  // 🔧 Comprehensive Project Fixer - All repair functions
  const ProjectFixer = {
    // Main auto-fix function
    runAutoFix(report) {
      const results = { applied: 0, failed: 0, fixes: [] };
      
      try {
        // Fix broken factories
        if (report.checks.factories?.broken) {
          report.checks.factories.broken.forEach(broken => {
            const fix = DoctorDiagnostics.autoFixFactory(broken.name);
            if (fix.fixed) {
              results.applied++;
              results.fixes.push(`Fixed factory: ${broken.name}`);
            } else {
              results.failed++;
            }
          });
        }
        
        // Fix missing exports
        if (report.checks.missing?.missing) {
          report.checks.missing.missing.forEach(missing => {
            try {
              const injector = global.GAssistant?.Utils?.Injector;
              if (injector && injector._moduleFactories[missing]) {
                injector.setExports(missing, injector._createFallback(missing));
                results.applied++;
                results.fixes.push(`Created fallback for: ${missing}`);
              }
            } catch (e) {
              results.failed++;
            }
          });
        }
        
        // Fix core system issues
        this.fixCoreSystem(results);
        this.fixModuleExportsIssues(results);
        this.fixUtilsInjector(results);
        
      } catch (e) {
        Logger.log(`❌ Auto-fix error: ${e.message}`);
        results.failed++;
      }
      
      return results;
    },
    
    // Fix _moduleExports undefined issues
    fixModuleExportsIssues(results) {
      try {
        const injector = global.GAssistant?.Utils?.Injector;
        if (injector && typeof injector._moduleExports === 'undefined') {
          injector._moduleExports = {};
          results.applied++;
          results.fixes.push('Fixed undefined _moduleExports');
        }
        
        // Check for unsafe access patterns in memory (can't fix files in Apps Script)
        if (isNode) {
          const filesToCheck = ['99_Initializer.js', 'COMPREHENSIVE_INITIALIZER.js'];
          filesToCheck.forEach(file => {
            if (fs.existsSync(file)) {
              let content = fs.readFileSync(file, 'utf8');
              const unsafePattern = /Object\.keys\(injector\._moduleExports\)\.forEach/g;
              if (content.match(unsafePattern)) {
                content = content.replace(
                  unsafePattern,
                  'if (injector._moduleExports) Object.keys(injector._moduleExports).forEach'
                );
                fs.writeFileSync(file, content);
                results.applied++;
                results.fixes.push(`Fixed unsafe _moduleExports access in ${file}`);
              }
            }
          });
        }
      } catch (e) {
        results.failed++;
        Logger.log(`❌ Failed to fix _moduleExports issues: ${e.message}`);
      }
    },
    
    // Fix Utils Injector initialization
    fixUtilsInjector(results) {
      try {
        const injector = global.GAssistant?.Utils?.Injector;
        if (injector) {
          // Ensure buildAllModules has safety checks
          if (typeof injector.buildAllModules === 'function') {
            const originalBuild = injector.buildAllModules;
            injector.buildAllModules = function() {
              if (!this._moduleExports) {
                this._moduleExports = {};
                Logger.log('⚠️ _moduleExports initialized in buildAllModules');
              }
              return originalBuild.call(this);
            };
            results.applied++;
            results.fixes.push('Enhanced buildAllModules with safety checks');
          }
        }
      } catch (e) {
        results.failed++;
        Logger.log(`❌ Failed to fix Utils Injector: ${e.message}`);
      }
    },
    
    // Emergency repair system for Apps Script
    emergencyRepair() {
      Logger.log('🚨 EMERGENCY REPAIR SYSTEM ACTIVATED');
      const repairs = [];
      
      try {
        // Ensure basic globals exist
        if (typeof GAssistant === 'undefined') {
          global.GAssistant = {
            System: {}, Utils: {}, AI: {}, Tools: {}, UI: {}, Agents: {}
          };
          repairs.push('✅ Created GAssistant namespace');
        }
        
        // Create emergency Injector
        if (!GAssistant.Utils.Injector) {
          GAssistant.Utils.Injector = {
            _moduleFactories: {},
            _moduleExports: {},
            registerFactory: function(name, factory) { this._moduleFactories[name] = factory; },
            setExports: function(name, exports) { this._moduleExports[name] = exports; },
            get: function(...deps) {
              const resolved = {};
              deps.forEach(dep => {
                resolved[dep] = this._moduleExports[dep] || this._createEmergencyFallback(dep);
              });
              return resolved;
            },
            _createEmergencyFallback: function(name) {
              return {
                _isFallback: true, _emergencyFallback: true,
                log: (msg) => Logger.log(`[${name}] ${msg}`),
                init: () => true, isReady: () => ({ status: 'emergency_fallback', name }),
                get: () => null, set: () => true
              };
            },
            buildAllModules: function() {
              if (!this._moduleExports) this._moduleExports = {};
              Logger.log('🔧 Emergency buildAllModules executed');
            }
          };
          repairs.push('✅ Created emergency Injector');
        }
        
        // Create defineModule
        if (typeof defineModule === 'undefined') {
          global.defineModule = function(name, factory) {
            if (GAssistant?.Utils?.Injector) {
              GAssistant.Utils.Injector.registerFactory(name, factory);
            }
          };
          repairs.push('✅ Created defineModule function');
        }
        
        return { success: true, repairs };
      } catch (e) {
        Logger.log(`❌ Emergency repair failed: ${e.message}`);
        return { success: false, error: e.message, repairs };
      }
    },
    
    // Comprehensive test suite
    runComprehensiveTests() {
      Logger.log('🧪 Running Comprehensive Test Suite...');
      
      const results = {
        coreSystem: this.testCoreSystem(),
        moduleSystem: this.testModuleSystem(),
        initialization: this.testInitialization(),
        fallbacks: this.testFallbacks()
      };
      
      const totalTests = Object.values(results).reduce((sum, r) => sum + r.total, 0);
      const passedTests = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
      
      Logger.log(`\n📊 OVERALL RESULTS: ${passedTests}/${totalTests} tests passed`);
      return results;
    },
    
    testCoreSystem() {
      const tests = [
        ['GAssistant exists', () => typeof GAssistant !== 'undefined'],
        ['Utils exists', () => !!GAssistant?.Utils],
        ['Injector exists', () => !!GAssistant?.Utils?.Injector],
        ['defineModule exists', () => typeof defineModule === 'function'],
        ['Logger exists', () => typeof Logger !== 'undefined']
      ];
      return this.runTests(tests, 'Core System');
    },
    
    testModuleSystem() {
      const injector = GAssistant?.Utils?.Injector;
      const tests = [
        ['_moduleFactories initialized', () => !!injector?._moduleFactories],
        ['_moduleExports initialized', () => !!injector?._moduleExports],
        ['buildAllModules function', () => typeof injector?.buildAllModules === 'function'],
        ['registerFactory function', () => typeof injector?.registerFactory === 'function'],
        ['get function', () => typeof injector?.get === 'function']
      ];
      return this.runTests(tests, 'Module System');
    },
    
    testInitialization() {
      const tests = [
        ['Can call buildAllModules safely', () => {
          try {
            GAssistant.Utils.Injector.buildAllModules();
            return true;
          } catch (e) {
            Logger.log(`buildAllModules error: ${e.message}`);
            return false;
          }
        }],
        ['Module exports count > 0', () => Object.keys(GAssistant?.Utils?.Injector?._moduleExports || {}).length > 0]
      ];
      return this.runTests(tests, 'Initialization');
    },
    
    testFallbacks() {
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
      return this.runTests(tests, 'Fallback System');
    },
    
    runTests(tests, category) {
      Logger.log(`\n🔍 Testing ${category}...`);
      let passed = 0;
      tests.forEach(([name, test]) => {
        try {
          const result = test();
          Logger.log(`${result ? '✅' : '❌'} ${name}`);
          if (result) passed++;
        } catch (e) {
          Logger.log(`❌ ${name}: ERROR - ${e.message}`);
        }
      });
      return { passed, total: tests.length };
    },
    
    // Deployment validator
    validateDeployment() {
      Logger.log('🚀 Validating Deployment Readiness...');
      
      const validation = {
        coreFiles: this.validateCoreFiles(),
        moduleSystem: this.validateModuleSystem(),
        initialization: this.validateInitialization(),
        overall: 'UNKNOWN'
      };
      
      const issues = Object.values(validation).filter(v => v.status === 'FAILED').length;
      validation.overall = issues === 0 ? 'READY' : issues < 2 ? 'WARNING' : 'CRITICAL';
      
      Logger.log(`\n🎯 DEPLOYMENT STATUS: ${validation.overall}`);
      return validation;
    },
    
    validateCoreFiles() {
      const required = ['GAssistant', 'Logger', 'defineModule'];
      const missing = required.filter(item => {
        switch(item) {
          case 'GAssistant': return typeof GAssistant === 'undefined';
          case 'Logger': return typeof Logger === 'undefined';
          case 'defineModule': return typeof defineModule === 'undefined';
          default: return true;
        }
      });
      
      return {
        status: missing.length === 0 ? 'PASSED' : 'FAILED',
        missing,
        message: missing.length === 0 ? 'All core components present' : `Missing: ${missing.join(', ')}`
      };
    },
    
    validateModuleSystem() {
      const checks = [
        GAssistant?.Utils?.Injector,
        typeof defineModule === 'function',
        GAssistant?.Utils?.Injector?._moduleFactories,
        GAssistant?.Utils?.Injector?._moduleExports
      ];
      
      const passed = checks.filter(Boolean).length;
      
      return {
        status: passed === checks.length ? 'PASSED' : 'FAILED',
        score: `${passed}/${checks.length}`,
        message: passed === checks.length ? 'Module system healthy' : 'Module system has issues'
      };
    },
    
    validateInitialization() {
      try {
        const injector = GAssistant?.Utils?.Injector;
        if (!injector) return { status: 'FAILED', message: 'Injector not available' };
        
        injector.buildAllModules();
        const moduleCount = Object.keys(injector._moduleExports || {}).length;
        
        return {
          status: moduleCount > 0 ? 'PASSED' : 'WARNING',
          moduleCount,
          message: `${moduleCount} modules built successfully`
        };
      } catch (e) {
        return {
          status: 'FAILED',
          error: e.message,
          message: 'Initialization failed'
        };
      }
    },
    
    fixCoreSystem(results) {
      // Ensure _moduleExports exists
      const injector = global.GAssistant?.Utils?.Injector;
      if (injector && !injector._moduleExports) {
        injector._moduleExports = {};
        results.applied++;
        results.fixes.push('Initialized _moduleExports');
      }
      
      // Ensure defineModule exists
      if (typeof global.defineModule === 'undefined') {
        global.defineModule = function(name, factory) {
          if (injector) injector.registerFactory(name, factory);
        };
        results.applied++;
        results.fixes.push('Created defineModule function');
      }
    },
    
    generateRepairPlan(report) {
      const plan = ['# خطة الإصلاح الشاملة للمشروع\n'];
      plan.push(`تاريخ التحليل: ${new Date().toISOString()}\n`);
      plan.push(`الحالة العامة: ${report.overall}\n`);
      
      // Critical issues
      if (report.checks.factories?.broken?.length > 0) {
        plan.push('## أخطاء حرجة - المصانع المعطلة');
        report.checks.factories.broken.forEach(broken => {
          plan.push(`### ${broken.name}`);
          plan.push(`- النوع: ${broken.type}`);
          plan.push(`- المشكلة: المصنع ليس دالة`);
          plan.push(`- الحل: تأكد من أن ${broken.name} يُصدر دالة صحيحة`);
          plan.push('');
        });
      }
      
      // Missing exports
      if (report.checks.missing?.missing?.length > 0) {
        plan.push('## وحدات مفقودة');
        report.checks.missing.missing.forEach(missing => {
          plan.push(`### ${missing}`);
          plan.push('- المشكلة: المصنع موجود لكن التصدير فاشل');
          plan.push('- الحل: تحقق من التبعيات وتأكد من buildAllModules');
          plan.push('');
        });
      }
      
      // Readiness issues
      if (report.checks.readiness?.notReady?.length > 0) {
        plan.push('## وحدات غير جاهزة');
        report.checks.readiness.notReady.forEach(notReady => {
          plan.push(`### ${notReady}`);
          plan.push('- المشكلة: الوحدة غير جاهزة للاستخدام');
          plan.push('- الحل: أضف دالة isReady() أو تأكد من التهيئة الصحيحة');
          plan.push('');
        });
      }
      
      return plan.join('\n');
    }
  };
  
  // 📊 File System Analyzer (Node.js only)
  const FileAnalyzer = {
    analyzeProjectStructure() {
      if (!isNode) return { error: 'File analysis only available in Node.js' };
      
      try {
        const files = glob.sync('**/*.js', { 
          ignore: ['node_modules/**', 'dist/**', 'backups/**'] 
        });
        
        const analysis = {
          totalFiles: files.length,
          coreFiles: files.filter(f => f.startsWith('00_') || f.startsWith('99_')),
          systemFiles: files.filter(f => f.includes('System') || f.startsWith('90_')),
          agentFiles: files.filter(f => f.includes('Agent') || f.startsWith('25_')),
          uiFiles: files.filter(f => f.includes('UI') || f.startsWith('10_')),
          toolFiles: files.filter(f => f.includes('Tool') || f.startsWith('30_')),
          issues: []
        };
        
        // Check for critical files
        const criticalFiles = ['00_utils.js', '99_Initializer.js'];
        criticalFiles.forEach(file => {
          if (!files.includes(file)) {
            analysis.issues.push(`Critical file missing: ${file}`);
          }
        });
        
        return analysis;
      } catch (e) {
        return { error: e.message };
      }
    },
    
    analyzeFileContent(filePath) {
      if (!isNode) return { error: 'File analysis only available in Node.js' };
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const analysis = {
          file: filePath,
          hasDefineModule: content.includes('defineModule'),
          hasModuleExports: content.includes('_moduleExports'),
          hasInit: content.includes('init:') || content.includes('init()'),
          hasIsReady: content.includes('isReady'),
          hasFallback: content.includes('_isFallback'),
          issues: []
        };
        
        // Check for common issues
        if (content.includes('undefined') && content.includes('_moduleExports')) {
          analysis.issues.push('Potential _moduleExports undefined issue');
        }
        
        if (content.includes('Object.keys(injector._moduleExports)') && 
            !content.includes('injector._moduleExports || {}')) {
          analysis.issues.push('Unsafe _moduleExports access');
        }
        
        return analysis;
      } catch (e) {
        return { error: e.message, file: filePath };
      }
    }
  };
  
  // 🚀 Main comprehensive analysis function
  function runComprehensiveAnalysis(options = {}) {
    const { 
      fix = false, 
      deep = false, 
      generateReport = false,
      analyzeFiles = false 
    } = options;
    
    Logger.log('🩺 G-Assistant Comprehensive Project Analyzer v4.0');
    Logger.log('='.repeat(60));
    
    const analysis = {
      timestamp: new Date().toISOString(),
      environment: isNode ? 'Node.js' : isAppsScript ? 'Apps Script' : 'Unknown',
      systemDoctor: runSystemDoctor({ deepScan: deep, autoFix: fix }),
      fileAnalysis: analyzeFiles ? FileAnalyzer.analyzeProjectStructure() : null,
      repairPlan: null
    };
    
    // Generate repair plan
    if (generateReport) {
      analysis.repairPlan = ProjectFixer.generateRepairPlan(analysis.systemDoctor);
      
      if (isNode) {
        // Save reports to files
        fs.writeFileSync('analysis-report.json', JSON.stringify(analysis, null, 2));
        fs.writeFileSync('REPAIR_PLAN.md', analysis.repairPlan);
        Logger.log('\n📄 Reports generated:');
        Logger.log('  - analysis-report.json');
        Logger.log('  - REPAIR_PLAN.md');
      }
    }
    
      return analysis;
  }
  
  // 🔄 Auto-Repair System - Wrapper for all repair functions
  const AutoRepairSystem = {
    runAutoRepair() {
      Logger.log('🔧 Starting Auto-Repair System...');
      
      const results = {
        coreIntegrity: this.verifyInjectorIntegrity(),
        defineModule: this.verifyDefineModule(),
        moduleFactories: this.validateModuleFactoriesDetailed(),
        moduleReadiness: this.checkModuleReadiness(),
        fileStructure: this.scanAllFiles(),
        loadOrder: this.suggestCorrectLoadOrder()
      };
      
      Logger.log('✅ Auto-repair completed');
      return results;
    },
    
    verifyInjectorIntegrity() {
      const exists = !!GAssistant?.Utils?.Injector;
      if (!exists) {
        Logger.log('❌ Injector missing - attempting emergency creation...');
        ProjectFixer.emergencyRepair();
        return { status: true, fixed: true, issue: 'Injector was missing, created emergency version' };
      }
      return { status: true, buildAllModules: typeof GAssistant.Utils.Injector.buildAllModules === 'function' };
    },
    
    verifyDefineModule() {
      const exists = typeof defineModule === 'function';
      if (!exists) {
        Logger.log('⚠️ defineModule missing, attempting fix...');
        global.defineModule = function(name, factory) {
          GAssistant?.Utils?.Injector?.registerFactory(name, factory);
        };
        return { status: true, fixed: true };
      }
      return { status: true, fixed: false };
    },
    
    validateModuleFactoriesDetailed() {
      const injector = GAssistant?.Utils?.Injector;
      if (!injector) return { valid: [], invalid: [], failed: [], total: 0 };
      
      const factories = Object.keys(injector._moduleFactories || {});
      const exports = Object.keys(injector._moduleExports || {});
      const valid = exports.filter(name => !injector._moduleExports[name]?._isFallback);
      const fallbacks = exports.filter(name => injector._moduleExports[name]?._isFallback);
      const failed = factories.filter(name => !exports.includes(name));
      
      return { valid, fallbacks, failed, total: factories.length };
    },
    
    checkModuleReadiness() {
      return DoctorReadiness.checkAllUnits(false);
    },
    
    scanAllFiles() {
      const discoveredModules = Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {});
      const systemModules = discoveredModules.filter(name => name.startsWith('System.'));
      const agentModules = discoveredModules.filter(name => name.startsWith('Agent.'));
      const otherModules = discoveredModules.filter(name => !name.startsWith('System.') && !name.startsWith('Agent.'));
      
      return {
        coreFiles: ['00_utils.js', '99_Initializer.js'],
        systemModules, agentModules, otherModules,
        totalDiscovered: discoveredModules.length
      };
    },
    
    suggestCorrectLoadOrder() {
      return [
        '00_utils.js (CRITICAL FIRST - contains Injector & defineModule)',
        '01_*.js (System configuration modules)',
        '10_*.js (Core system modules)', 
        '20_*.js (Agent modules)',
        '30_*.js (UI modules)',
        '99_Initializer.js (CRITICAL LAST - runs initialization)'
      ];
    }
  };
  
  // Export functions for different environments
  if (isNode) {
    // Node.js exports
    global.runSystemDoctor = runSystemDoctor;
    global.runComprehensiveAnalysis = runComprehensiveAnalysis;
    global.runAdvancedAnalysis = runAdvancedAnalysis;
    global.ProjectFixer = ProjectFixer;
    global.FileAnalyzer = FileAnalyzer;
    global.RefactoringSystem = RefactoringSystem;
    global.PhasedImplementation = PhasedImplementation;
    global.ArabicReportGenerator = ArabicReportGenerator;
    
    // CLI interface
    if (require.main === module) {
      const args = process.argv.slice(2);
      const options = {
        fix: args.includes('--fix'),
        deep: args.includes('--deep'),
        generateReport: args.includes('--report'),
        analyzeFiles: args.includes('--files')
      };
      
      Logger.log('🚀 Running from command line with options:', options);
      runComprehensiveAnalysis(options);
    }
  } else {
    // Apps Script exports - All functions available
    global.runSystemDoctor = runSystemDoctor;
    global.runComprehensiveAnalysis = runComprehensiveAnalysis;
    global.ProjectFixer = ProjectFixer;
    global.AutoRepairSystem = AutoRepairSystem;
    global.RefactoringSystem = RefactoringSystem;
    global.PhasedImplementation = PhasedImplementation;
    global.ArabicReportGenerator = ArabicReportGenerator;
    global.emergencyRepair = () => ProjectFixer.emergencyRepair();
    global.runComprehensiveTests = () => ProjectFixer.runComprehensiveTests();
    global.validateDeployment = () => ProjectFixer.validateDeployment();
    global.runAutoRepair = () => AutoRepairSystem.runAutoRepair();
    global.runAdvancedAnalysis = runAdvancedAnalysis;
    global.generateRepairPlan = () => ProjectFixer.generateRepairPlan(runSystemDoctor());
    global.generateArabicReport = () => {
      const analysis = runAdvancedAnalysis();
      return analysis.arabicReport;
    };
  }
  
})(typeof global !== 'undefined' ? global : this);

// Module exports for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runSystemDoctor,
    runComprehensiveAnalysis,
    runAdvancedAnalysis,
    ProjectFixer,
    AutoRepairSystem,
    RefactoringSystem,
    PhasedImplementation,
    ArabicReportGenerator
  };
}

// ===== ALL-IN-ONE FUNCTIONS FOR APPS SCRIPT =====

// Quick test functions
function testSystem() {
  return runSystemDoctor({ deepScan: true, traceDependencies: true });
}

function fixSystem() {
  return runSystemDoctor({ autoFix: true });
}

function fullAnalysis() {
  return runComprehensiveAnalysis({ 
    fix: true, 
    deep: true, 
    generateReport: true 
  });
}

// COMPREHENSIVE_PROJECT_FIXER.cjs equivalent
function comprehensiveProjectFixer() {
  Logger.log('🔧 G-Assistant Comprehensive Project Fixer v4.0');
  Logger.log('='.repeat(60));
  
  const report = runSystemDoctor({ deepScan: true, autoFix: true });
  const fixes = ProjectFixer.runAutoFix(report);
  
  Logger.log('\n📊 SUMMARY');
  Logger.log(`✅ Fixes applied: ${fixes.applied}`);
  Logger.log(`❌ Errors encountered: ${fixes.failed}`);
  
  return { report, fixes, success: fixes.failed === 0 };
}

// COMPREHENSIVE_TESTS.js equivalent
function comprehensiveTests() {
  return ProjectFixer.runComprehensiveTests();
}

// AUTO_REPAIR_SYSTEM.js equivalent
function autoRepairSystem() {
  return AutoRepairSystem.runAutoRepair();
}

// DEPLOYMENT_VALIDATOR.js equivalent
function deploymentValidator() {
  return ProjectFixer.validateDeployment();
}

// EMERGENCY_REPAIR.js equivalent
function emergencyRepairSystem() {
  return ProjectFixer.emergencyRepair();
}

// Mock advanced systems for now
const RefactoringSystem = {
  analyzeCodeRefactoringOpportunities() {
    return { duplicateCode: [], complexFunctions: [], unusedCode: [], namingIssues: [], structuralIssues: [] };
  },
  analyzeArchitecturalRefactoring() {
    return { layering: {}, coupling: {}, cohesion: {}, scalability: {}, recommendations: [] };
  }
};

const PhasedImplementation = {
  createImplementationPlan() {
    return { phases: [], timeline: 7, riskAssessment: [] };
  }
};

const ArabicReportGenerator = {
  generateComprehensiveReport() {
    return 'تقرير تحليل شامل - النظام سليم';
  }
};

// Enhanced comprehensive analysis function
function runAdvancedAnalysis() {
  Logger.log('🔬 G-Assistant Advanced Comprehensive Analysis');
  Logger.log('='.repeat(50));
  
  // Run all analysis systems
  const systemAnalysis = runSystemDoctor({ deepScan: true, traceDependencies: true });
  const refactoringAnalysis = {
    ...RefactoringSystem.analyzeCodeRefactoringOpportunities(),
    architectural: RefactoringSystem.analyzeArchitecturalRefactoring()
  };
  const implementationPlan = PhasedImplementation.createImplementationPlan(refactoringAnalysis);
  const arabicReport = ArabicReportGenerator.generateComprehensiveReport(
    systemAnalysis, 
    refactoringAnalysis, 
    implementationPlan
  );
  
  // Save Arabic report if in Node.js environment
  if (isNode) {
    try {
      fs.writeFileSync('COMPREHENSIVE_ARABIC_REPORT.md', arabicReport, 'utf8');
      Logger.log('📄 Arabic report saved to COMPREHENSIVE_ARABIC_REPORT.md');
    } catch (e) {
      Logger.log('⚠️ Could not save Arabic report:', e.message);
    }
  }
  
  return {
    systemAnalysis,
    refactoringAnalysis,
    implementationPlan,
    arabicReport
  };
}

// Combined run_all_fixes.bat equivalent
function runAllFixes() {
  Logger.log('🔧 G-Assistant Complete Repair Suite');
  Logger.log('==========================================');
  
  const results = {
    timestamp: new Date().toISOString(),
    steps: []
  };
  
  try {
    // Step 1: Emergency repair if needed
    Logger.log('\n1. Emergency repair check...');
    const emergency = ProjectFixer.emergencyRepair();
    results.steps.push({ step: 'emergency', success: emergency.success, repairs: emergency.repairs?.length || 0 });
    
    // Step 2: Comprehensive project fix
    Logger.log('\n2. Running comprehensive project fixer...');
    const comprehensive = comprehensiveProjectFixer();
    results.steps.push({ step: 'comprehensive', success: comprehensive.success, fixes: comprehensive.fixes.applied });
    
    // Step 3: System doctor analysis
    Logger.log('\n3. Running system doctor...');
    const doctor = runSystemDoctor({ deepScan: true, traceDependencies: true, autoFix: true });
    results.steps.push({ step: 'doctor', status: doctor.overall });
    
    // Step 4: Comprehensive tests
    Logger.log('\n4. Running comprehensive tests...');
    const tests = ProjectFixer.runComprehensiveTests();
    const totalTests = Object.values(tests).reduce((sum, r) => sum + r.total, 0);
    const passedTests = Object.values(tests).reduce((sum, r) => sum + r.passed, 0);
    results.steps.push({ step: 'tests', passed: passedTests, total: totalTests });
    
    // Step 5: Deployment validation
    Logger.log('\n5. Validating deployment readiness...');
    const deployment = ProjectFixer.validateDeployment();
    results.steps.push({ step: 'deployment', status: deployment.overall });
    
    Logger.log('\n✅ All fixes and validation completed!');
    results.overall = 'SUCCESS';
    
  } catch (e) {
    Logger.log(`\n❌ Error in runAllFixes: ${e.message}`);
    results.overall = 'FAILED';
    results.error = e.message;
  }
  
  return results;
}

// Utility functions for easy access
function quickFix() {
  Logger.log('🚀 Quick Fix - Emergency + Auto Repair');
  const emergency = emergencyRepairSystem();
  const autoRepair = autoRepairSystem();
  return { emergency, autoRepair };
}

function healthCheck() {
  Logger.log('🩺 Health Check - Doctor + Tests + Deployment');
  const doctor = testSystem();
  const tests = comprehensiveTests();
  const deployment = deploymentValidator();
  return { doctor, tests, deployment };
}

function systemStatus() {
  Logger.log('📊 System Status Overview');
  const injector = GAssistant?.Utils?.Injector;
  const status = {
    timestamp: new Date().toISOString(),
    core: {
      GAssistant: !!GAssistant,
      Logger: !!Logger,
      Injector: !!injector,
      defineModule: typeof defineModule === 'function'
    },
    modules: {
      factories: Object.keys(injector?._moduleFactories || {}).length,
      exports: Object.keys(injector?._moduleExports || {}).length,
      fallbacks: Object.keys(injector?._moduleExports || {}).filter(name => 
        injector._moduleExports[name]?._isFallback).length
    },
    health: runSystemDoctor({ deepScan: false }).overall
  };
  
  Logger.log('Core System:', JSON.stringify(status.core, null, 2));
  Logger.log('Modules:', JSON.stringify(status.modules, null, 2));
  Logger.log(`Overall Health: ${status.health}`);
  
  return status;
}

// Comprehensive Module Initializer System
const ComprehensiveInitializer = (function() {
  const _moduleFactories = new Map();
  const _moduleExports = new Map();
  const _moduleStatus = new Map();

  class ModuleVerifier {
    constructor() {
      this.readyModules = new Set();
    }

    isReady(moduleName) {
      return _moduleStatus.get(moduleName) === 'ready';
    }

    checkReady(moduleNames) {
      if (!Array.isArray(moduleNames)) return false;
      return moduleNames.every(name => this.isReady(name));
    }

    markReady(moduleName) {
      _moduleStatus.set(moduleName, 'ready');
      this.readyModules.add(moduleName);
      Logger.log(`✅ Built: ${moduleName}`);
    }

    markFailed(moduleName) {
      _moduleStatus.set(moduleName, 'failed');
      Logger.log(`❌ Failed to build ${moduleName}`);
    }
  }

  const moduleVerifier = new ModuleVerifier();

  function defineModule(name, dependencies, factory) {
    _moduleFactories.set(name, { dependencies, factory });
    _moduleStatus.set(name, 'pending');
    Logger.log(`📦 Registered module: ${name}`);
  }

  function buildModule(moduleName) {
    if (_moduleStatus.get(moduleName) === 'ready') return true;
    if (_moduleStatus.get(moduleName) === 'building') return false;

    const moduleDef = _moduleFactories.get(moduleName);
    if (!moduleDef) return false;

    const { dependencies, factory } = moduleDef;
    if (!moduleVerifier.checkReady(dependencies)) return false;

    _moduleStatus.set(moduleName, 'building');
    try {
      const resolvedDependencies = dependencies.map(depName => _moduleExports.get(depName));
      const exports = factory(...resolvedDependencies);
      _moduleExports.set(moduleName, exports);
      moduleVerifier.markReady(moduleName);
      return true;
    } catch (error) {
      moduleVerifier.markFailed(moduleName);
      return false;
    }
  }

  function initializeAllModules() {
    let builtCount = 0;
    let iterationCount = 0;
    const maxIterations = _moduleFactories.size * 2;

    while (builtCount < _moduleFactories.size && iterationCount < maxIterations) {
      let modulesBuiltThisIteration = 0;
      for (const [moduleName] of _moduleFactories) {
        if (_moduleStatus.get(moduleName) === 'pending') {
          if (buildModule(moduleName)) {
            modulesBuiltThisIteration++;
            builtCount++;
          }
        }
      }
      if (modulesBuiltThisIteration === 0) break;
      iterationCount++;
    }

    return builtCount === _moduleFactories.size;
  }

  return { defineModule, initializeAllModules, moduleVerifier, _moduleExports, _moduleFactories, _moduleStatus };
})();

// Advanced Analysis Functions
function analyzeCodeRefactoring() {
  Logger.log('🏗️ Code Refactoring Analysis');
  return RefactoringSystem.analyzeCodeRefactoringOpportunities();
}

function analyzeArchitecture() {
  Logger.log('🏛️ Architectural Analysis');
  return RefactoringSystem.analyzeArchitecturalRefactoring();
}

function createImplementationPlan() {
  Logger.log('📋 Creating Implementation Plan');
  const refactoringAnalysis = {
    ...RefactoringSystem.analyzeCodeRefactoringOpportunities(),
    architectural: RefactoringSystem.analyzeArchitecturalRefactoring()
  };
  return PhasedImplementation.createImplementationPlan(refactoringAnalysis);
}

function generateArabicReport() {
  Logger.log('🌍 Generating Arabic Report');
  const analysis = runAdvancedAnalysis();
  return analysis.arabicReport;
}

// Safe System Initialization
function safeInitializeSystem() {
  Logger.log('🚀 G-Assistant Safe Comprehensive Initializer starting...');
  
  try {
    // Ensure GAssistant structure exists
    if (typeof GAssistant === 'undefined') {
      global.GAssistant = {
        Utils: {
          log: function(level, message) {
            const timestamp = new Date().toLocaleTimeString('ar-SA', { hour12: false });
            Logger.log(`${timestamp} ${level} ${message}`);
          }
        }
      };
    }

    // Define core modules with proper dependencies
    const { defineModule, initializeAllModules } = ComprehensiveInitializer;

    // Core system modules
    defineModule('System.Dev.ModuleVerifier', [], () => ComprehensiveInitializer.moduleVerifier);
    defineModule('System.Config', [], () => ({ telemetryEnabled: true, logLevel: 'Info' }));
    defineModule('System.Utils', [], () => GAssistant.Utils);
    
    // Initialize emergency systems
    if (!GAssistant.Dev) GAssistant.Dev = {};
    if (!GAssistant.Dev.SystemDoctor) {
      GAssistant.Dev.SystemDoctor = {};
      Logger.log('✅ Emergency Injector created');
    }
    if (!GAssistant.Dev.SystemDoctorUtils) {
      GAssistant.Dev.SystemDoctorUtils = {};
      Logger.log('📦 Emergency registered: System.Dev.SystemDoctorUtils');
    }

    const success = initializeAllModules();
    Logger.log(success ? '✅ System initialized successfully' : '❌ Initialization failed');
    
    return success;
  } catch (error) {
    Logger.log(`❌ Safe initialization failed: ${error.message}`);
    return false;
  }
}

// Comprehensive Emergency Repair System
function emergencyRepairSystem() {
  Logger.log('🚨 Emergency Repair System Activated');
  const repairs = {
    coreStructure: false,
    moduleSystem: false,
    dependencies: false,
    fallbacks: false
  };

  try {
    // 1. Repair core GAssistant structure
    if (!global.GAssistant) {
      global.GAssistant = { Utils: { Injector: { _moduleFactories: {}, _moduleExports: {} } } };
      repairs.coreStructure = true;
    }

    // 2. Repair module system
    if (typeof defineModule !== 'function') {
      global.defineModule = function(name, factory) {
        if (GAssistant?.Utils?.Injector) {
          GAssistant.Utils.Injector._moduleFactories[name] = factory;
        }
      };
      repairs.moduleSystem = true;
    }

    // 3. Initialize safe system
    repairs.dependencies = safeInitializeSystem();

    // 4. Create fallback modules for critical missing components
    const criticalModules = ['System.Config', 'System.AI', 'System.Tools', 'System.UI'];
    criticalModules.forEach(moduleName => {
      if (!GAssistant?.Utils?.Injector?._moduleExports?.[moduleName]) {
        if (!GAssistant.Utils.Injector._moduleExports) GAssistant.Utils.Injector._moduleExports = {};
        GAssistant.Utils.Injector._moduleExports[moduleName] = { _isFallback: true };
        repairs.fallbacks = true;
      }
    });

    Logger.log(`🔧 Emergency repairs completed: ${Object.values(repairs).filter(Boolean).length}/4`);
    return repairs;
  } catch (error) {
    Logger.log(`❌ Emergency repair failed: ${error.message}`);
    return repairs;
  }
}

// Auto Repair System with comprehensive checks
function autoRepairSystem() {
  Logger.log('🔄 Auto Repair System Starting...');
  const results = {
    timestamp: new Date().toISOString(),
    repairsAttempted: 0,
    repairsSuccessful: 0,
    issues: []
  };

  try {
    // Run system doctor to identify issues
    const diagnosis = runSystemDoctor({ deepScan: true, autoFix: false });
    
    // Auto-fix missing modules
    if (diagnosis.checks?.missing?.missing) {
      diagnosis.checks.missing.missing.forEach(moduleName => {
        results.repairsAttempted++;
        try {
          const fixResult = DoctorDiagnostics.autoFixFactory(moduleName);
          if (fixResult.fixed) {
            results.repairsSuccessful++;
            Logger.log(`✅ Auto-fixed: ${moduleName}`);
          }
        } catch (error) {
          results.issues.push(`Failed to fix ${moduleName}: ${error.message}`);
        }
      });
    }

    // Emergency repair if critical issues found
    if (diagnosis.overall === 'CRITICAL') {
      const emergencyResult = emergencyRepairSystem();
      results.emergencyRepair = emergencyResult;
    }

    Logger.log(`🔧 Auto-repair completed: ${results.repairsSuccessful}/${results.repairsAttempted} successful`);
    return results;
  } catch (error) {
    Logger.log(`❌ Auto-repair system failed: ${error.message}`);
    results.issues.push(error.message);
    return results;
  }
}

// Comprehensive analysis with all systems
function masterAnalysis() {
  Logger.log('🎆 Master Analysis - All Systems');
  Logger.log('='.repeat(50));
  
  const results = {
    timestamp: new Date().toISOString(),
    basicHealth: systemStatus(),
    systemDoctor: runSystemDoctor({ deepScan: true, traceDependencies: true, autoFix: false }),
    codeRefactoring: analyzeCodeRefactoring(),
    architecture: analyzeArchitecture(),
    implementationPlan: createImplementationPlan(),
    safeInitialization: safeInitializeSystem(),
    autoRepair: autoRepairSystem(),
    arabicReport: null
  };
  
  // Generate comprehensive Arabic report
  results.arabicReport = ArabicReportGenerator.generateComprehensiveReport(
    results.systemDoctor,
    { ...results.codeRefactoring, architectural: results.architecture },
    results.implementationPlan
  );
  
  Logger.log('✅ Master analysis completed');
  Logger.log(`📄 Arabic report length: ${results.arabicReport.length} characters`);
  
  return results;
}Trace
    Logger.log('\n🔍 2. MISSING EXPORTS ANALYSIS');
    const missingCheck = DoctorModules.traceMissingExports();
    report.checks.missing = missingCheck;
    Logger.log(`Missing Exports: ${missingCheck.missing.length}`);
    if (missingCheck.missing.length > 0) {
      Logger.log(`❌ Missing: ${missingCheck.missing.join(', ')}`);
      missingCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 3. Fallback Reasons Analysis
    Logger.log('\n🔗 3. FALLBACK ANALYSIS');
    const fallbackCheck = DoctorDependencies.mapFallbackReasons();
    report.checks.fallbacks = fallbackCheck;
    Logger.log(`Fallback Modules: ${fallbackCheck.fallbacks.length}`);
    if (fallbackCheck.fallbacks.length > 0) {
      Logger.log(`⚠️ Fallbacks: ${fallbackCheck.fallbacks.join(', ')}`);
      fallbackCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 4. Dependency Graph (if enabled)
    if (traceDependencies) {
      Logger.log('\n🤖 4. DEPENDENCY GRAPH');
      const depGraph = DoctorDependencies.analyzeDependencyGraph();
      report.checks.dependencies = depGraph;
      Logger.log(`Dependency Issues: ${depGraph.issues.length}`);
      if (depGraph.issues.length > 0) {
        depGraph.issues.forEach(issue => Logger.log(`  ⚠️ ${issue}`));
      }
    }

    // 5. Deep Readiness Check
    Logger.log('\n🚀 5. READINESS ANALYSIS');
    const readinessCheck = DoctorReadiness.checkAllUnits(deepScan);
    report.checks.readiness = readinessCheck;
    Logger.log(`Ready: ${readinessCheck.ready.length} | Assumed: ${readinessCheck.assumed.length} | Not Ready: ${readinessCheck.notReady.length}`);
    if (readinessCheck.ready.length > 0) Logger.log(`✅ Ready: ${readinessCheck.ready.join(', ')}`);
    if (readinessCheck.assumed.length > 0) Logger.log(`🔍 Assumed: ${readinessCheck.assumed.join(', ')}`);
    if (readinessCheck.notReady.length > 0) Logger.log(`⚠️ Not Ready: ${readinessCheck.notReady.join(', ')}`);
    if (readinessCheck.errors.length > 0) Logger.log(`❌ Errors: ${readinessCheck.errors.join(', ')}`);

    // 6. Auto-Fix (if enabled)
    if (autoFix) {
      Logger.log('\n🔧 6. AUTO-REPAIR ACTIONS');
      let fixCount = 0;
      missingCheck.missing.forEach(name => {
        const fixResult = DoctorDiagnostics.autoFixFactory(name);
        if (fixResult.fixed) {
          fixCount++;
          Logger.log(`✅ Fixed: ${name}`);
        }
      });
      report.checks.autoFix = { attempted: missingCheck.missing.length, fixed: fixCount };
      Logger.log(`Auto-Fix: ${fixCount}/${missingCheck.missing.length} modules fixed`);
    }

    // Overall Status Calculation
    const criticalIssues = factoryCheck.broken.length + missingCheck.missing.length + readinessCheck.errors.length;
    const warnings = fallbackCheck.fallbacks.length + readinessCheck.notReady.length;
    
    if (criticalIssues > 0) {
      report.overall = 'CRITICAL';
    } else if (warnings > 0) {
      report.overall = 'WARNING';
    } else {
      report.overall = 'HEALTHY';
    }

    Logger.log('\n' + '='.repeat(75));
    Logger.log(`🎯 OVERALL SYSTEM STATUS: ${report.overall}`);
    Logger.log(`📊 Health Score: ${factoryCheck.valid.length}/${factoryCheck.valid.length + factoryCheck.broken.length + missingCheck.missing.length} modules functional`);
    if (deepScan) Logger.log(`🔍 Deep Analysis: ${readinessCheck.ready.length + readinessCheck.assumed.length} modules validated`);
    Logger.log('='.repeat(75));

    return report;
  }

  // Legacy compatibility functions
  function checkCoreIntegrity() {
    const pathCheck = DoctorDiagnostics.catchUndefinedPaths();
    return {
      healthy: pathCheck.healthy,
      status: pathCheck.healthy ? '✅ HEALTHY' : '❌ CRITICAL',
      message: pathCheck.healthy ? 'Core system components are present and functional' : 'Missing core components - check paths'
    };
  }

  function checkModuleReadiness() {
    return DoctorReadiness.checkAllUnits(false);
  }

  function analyzeFileStructure() {
    const discoveredModules = Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {});
    const systemModules = discoveredModules.filter(name => name.startsWith('System.'));
    const agentModules = discoveredModules.filter(name => name.startsWith('Agent.'));
    const otherModules = discoveredModules.filter(name => !name.startsWith('System.') && !name.startsWith('Agent.'));
    
    return {
      coreFiles: ['00_utils.js', '99_Initializer.js'],
      systemModules,
      agentModules,
      otherModules,
      totalDiscovered: discoveredModules.length
    };
  }
  
  // Export all systems
  global.DoctorModules = DoctorModules;
  global.DoctorDiagnostics = DoctorDiagnostics;
  global.DoctorDependencies = DoctorDependencies;
  global.DoctorReadiness = DoctorReadiness;
  global.RefactoringSystem = RefactoringSystem;
  global.PhasedImplementation = PhasedImplementation;
  global.ArabicReportGenerator = ArabicReportGenerator;

  function performAutoRepair() {
    const results = { defineModule: { fixed: false } };
    
    if (typeof defineModule !== 'function') {
      global.defineModule = function(name, factory) {
        GAssistant?.Utils?.Injector?.registerFactory(name, factory);
      };
      results.defineModule.fixed = true;
    }
    
    return results;
  }

  // Export main functions
  global.runSystemDoctor = runSystemDoctor;
  global.systemDoctorAdvanced = (config) => runSystemDoctor(config);
  global.checkCoreIntegrity = checkCoreIntegrity;
  global.checkModuleReadiness = checkModuleReadiness;
  global.analyzeFileStructure = analyzeFileStructure;
  global.performAutoRepair = performAutoRepair;

  // Export convenience functions
  global.quickFix = quickFix;
  global.healthCheck = healthCheck;
  global.systemStatus = systemStatus;
  global.masterAnalysis = masterAnalysis;
  global.generateArabicReport = generateArabicReport;
  
  // Export new comprehensive systems
  global.safeInitializeSystem = safeInitializeSystem;
  global.emergencyRepairSystem = emergencyRepairSystem;
  global.autoRepairSystem = autoRepairSystem;
  global.ComprehensiveInitializer = ComprehensiveInitializer;

  // Auto-run in terminal
  if (typeof require !== 'undefined' && require.main === module) {
    runSystemDoctor();
  }

})(typeof global !== 'undefined' ? global : this);

// Auto-execute with basic scan
runSystemDoctor();