#!/usr/bin/env node
// 🩺 G-Assistant Comprehensive System Doctor v5.0

const fs = require('fs');

(function(global) {
  'use strict';

  // Safe bootstrapping
  if (typeof global.Logger === 'undefined') {
    global.Logger = { 
      log: console.log,
      warn: console.warn,
      error: console.error
    };
  }
  
  // Mock GAssistant for testing
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

  // Doctor Modules
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
          results.reasons.push(`${name}: Factory exists but no export`);
        });
      } catch (e) {
        results.error = e.message;
      }
      return results;
    }
  };

  // Doctor Diagnostics
  const DoctorDiagnostics = {
    catchUndefinedPaths() {
      const paths = {
        'global.GAssistant': !!global.GAssistant,
        'GAssistant.Utils': !!global.GAssistant?.Utils,
        'GAssistant.Utils.Injector': !!global.GAssistant?.Utils?.Injector,
        'Injector._moduleFactories': !!global.GAssistant?.Utils?.Injector?._moduleFactories,
        'Injector._moduleExports': !!global.GAssistant?.Utils?.Injector?._moduleExports,
        'global.defineModule': typeof global.defineModule === 'function'
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

  // Doctor Dependencies
  const DoctorDependencies = {
    mapFallbackReasons() {
      const results = { fallbacks: [], reasons: [] };
      try {
        const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
        Object.entries(exports).forEach(([name, moduleExport]) => {
          if (moduleExport?._isFallback) {
            results.fallbacks.push(name);
            results.reasons.push(`${name}: Module is in fallback state`);
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
            status: exports[name]?._isFallback ? 'fallback' : 'healthy'
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

  // Doctor Readiness
  const DoctorReadiness = {
    checkAllUnits(isDeep = true) {
      const results = { ready: [], notReady: [], assumed: [], errors: [] };
      try {
        const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
        Object.entries(exports).forEach(([name, moduleExport]) => {
          if (moduleExport?._isFallback) return;
          
          try {
            if (typeof moduleExport?.isReady === 'function') {
              if (moduleExport.isReady()) {
                results.ready.push(name);
              } else {
                results.notReady.push(name);
              }
            } else if (isDeep) {
              const hasEssentials = moduleExport && Object.keys(moduleExport).length > 0;
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

  // Enhanced Dependency Tracker
  const DependencyTracker = {
    analyzeDependencyChain() {
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const dependencyMap = new Map();
      const circularDeps = [];
      
      Object.entries(factories).forEach(([name, factory]) => {
        const deps = this.extractDependencies(factory);
        dependencyMap.set(name, deps);
      });
      
      dependencyMap.forEach((deps, moduleName) => {
        const visited = new Set();
        if (this.hasCircularDependency(moduleName, dependencyMap, visited)) {
          circularDeps.push(moduleName);
        }
      });
      
      return {
        dependencyMap: Object.fromEntries(dependencyMap),
        circularDependencies: circularDeps,
        totalModules: dependencyMap.size
      };
    },

    extractDependencies(factory) {
      if (typeof factory !== 'function') return [];
      const funcStr = factory.toString();
      const paramMatch = funcStr.match(/function\s*\([^)]*\)|^\s*\([^)]*\)\s*=>/);
      if (!paramMatch) return [];
      const params = paramMatch[0].replace(/function\s*\(|\)|\s*=>.*/g, '').split(',').map(p => p.trim()).filter(p => p);
      return params;
    },

    hasCircularDependency(moduleName, depMap, visited, path = []) {
      if (path.includes(moduleName)) return true;
      if (visited.has(moduleName)) return false;
      visited.add(moduleName);
      const deps = depMap.get(moduleName) || [];
      for (const dep of deps) {
        if (this.hasCircularDependency(dep, depMap, visited, [...path, moduleName])) {
          return true;
        }
      }
      return false;
    },

    calculateBuildOrder() {
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const dependencyMap = new Map();
      const buildOrder = [];
      const built = new Set();
      
      Object.entries(factories).forEach(([name, factory]) => {
        const deps = this.extractDependencies(factory);
        dependencyMap.set(name, deps);
      });
      
      const canBuild = (moduleName) => {
        const deps = dependencyMap.get(moduleName) || [];
        return deps.every(dep => built.has(dep) || !dependencyMap.has(dep));
      };
      
      let iterations = 0;
      const maxIterations = dependencyMap.size * 2;
      
      while (built.size < dependencyMap.size && iterations < maxIterations) {
        let progress = false;
        for (const [moduleName] of dependencyMap) {
          if (!built.has(moduleName) && canBuild(moduleName)) {
            buildOrder.push(moduleName);
            built.add(moduleName);
            progress = true;
          }
        }
        if (!progress) break;
        iterations++;
      }
      
      const unresolved = Array.from(dependencyMap.keys()).filter(name => !built.has(name));
      return { buildOrder, unresolved, totalModules: dependencyMap.size, resolved: built.size };
    }
  };

  // Enhanced Module Verifier
  const EnhancedModuleVerifier = {
    isReady(moduleName) {
      const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
      const moduleExport = exports[moduleName];
      if (!moduleExport || moduleExport._isFallback || moduleExport._autoFixed) return false;
      return true;
    },

    checkReady(moduleNames) {
      if (!Array.isArray(moduleNames)) return false;
      return moduleNames.every(name => this.isReady(name));
    }
  };

  // Safe Module Builder
  const SafeModuleBuilder = {
    buildWithDependencies(moduleName) {
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
      
      if (!factories[moduleName]) return { success: false, error: 'Factory not found' };
      if (exports[moduleName] && !exports[moduleName]._isFallback) return { success: true, message: 'Already built' };
      
      const factory = factories[moduleName];
      const deps = DependencyTracker.extractDependencies(factory);
      
      if (!EnhancedModuleVerifier.checkReady(deps)) {
        const notReady = deps.filter(dep => !EnhancedModuleVerifier.isReady(dep));
        return { success: false, error: 'Dependencies not ready', missingDeps: notReady };
      }
      
      try {
        const resolvedDeps = deps.map(depName => exports[depName]);
        const result = factory(...resolvedDeps);
        exports[moduleName] = result;
        Logger.log(`✅ Successfully built: ${moduleName}`);
        return { success: true, result };
      } catch (error) {
        exports[moduleName] = { _isFallback: true, _error: error.message, _timestamp: new Date().toISOString() };
        return { success: false, error: error.message };
      }
    },

    buildAllInOrder() {
      const buildOrder = DependencyTracker.calculateBuildOrder();
      const results = { built: [], failed: [], skipped: [] };
      
      buildOrder.buildOrder.forEach(moduleName => {
        const result = this.buildWithDependencies(moduleName);
        if (result.success) {
          results.built.push(moduleName);
        } else {
          results.failed.push({ name: moduleName, error: result.error });
        }
      });
      
      buildOrder.unresolved.forEach(moduleName => {
        results.skipped.push(moduleName);
      });
      
      return results;
    }
  };

  // Main System Doctor Function
  function runSystemDoctor(config = {}) {
    const { deepScan = false, traceDependencies = false, autoFix = false } = config;
    
    Logger.log('🩺 G-Assistant System Doctor v5.0 - Enhanced Analysis');
    Logger.log('='.repeat(75));
    
    const report = {
      timestamp: new Date().toISOString(),
      overall: 'UNKNOWN',
      config: { deepScan, traceDependencies, autoFix },
      checks: {}
    };

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
    Logger.log('\n🔍 2. MISSING EXPORTS ANALYSIS');
    const missingCheck = DoctorModules.traceMissingExports();
    report.checks.missing = missingCheck;
    Logger.log(`Missing Exports: ${missingCheck.missing.length}`);
    if (missingCheck.missing.length > 0) {
      Logger.log(`❌ Missing: ${missingCheck.missing.join(', ')}`);
      missingCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 3. Fallback Analysis
    Logger.log('\n🔗 3. FALLBACK ANALYSIS');
    const fallbackCheck = DoctorDependencies.mapFallbackReasons();
    report.checks.fallbacks = fallbackCheck;
    Logger.log(`Fallback Modules: ${fallbackCheck.fallbacks.length}`);
    if (fallbackCheck.fallbacks.length > 0) {
      Logger.log(`⚠️ Fallbacks: ${fallbackCheck.fallbacks.join(', ')}`);
      fallbackCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 4. Dependency Graph
    if (traceDependencies) {
      Logger.log('\n🤖 4. DEPENDENCY GRAPH');
      const depGraph = DoctorDependencies.analyzeDependencyGraph();
      report.checks.dependencies = depGraph;
      Logger.log(`Dependency Issues: ${depGraph.issues.length}`);
      if (depGraph.issues.length > 0) {
        depGraph.issues.forEach(issue => Logger.log(`  ⚠️ ${issue}`));
      }
    }

    // 5. Readiness Analysis
    Logger.log('\n🚀 5. READINESS ANALYSIS');
    const readinessCheck = DoctorReadiness.checkAllUnits(deepScan);
    report.checks.readiness = readinessCheck;
    Logger.log(`Ready: ${readinessCheck.ready.length} | Assumed: ${readinessCheck.assumed.length} | Not Ready: ${readinessCheck.notReady.length}`);
    if (readinessCheck.ready.length > 0) Logger.log(`✅ Ready: ${readinessCheck.ready.join(', ')}`);
    if (readinessCheck.assumed.length > 0) Logger.log(`🔍 Assumed: ${readinessCheck.assumed.join(', ')}`);
    if (readinessCheck.notReady.length > 0) Logger.log(`⚠️ Not Ready: ${readinessCheck.notReady.join(', ')}`);
    if (readinessCheck.errors.length > 0) Logger.log(`❌ Errors: ${readinessCheck.errors.join(', ')}`);

    // 6. Auto-Fix
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

    // Overall Status
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

  // Emergency Repair System
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

      // 3. Create fallback modules
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

  // Master Analysis
  function masterAnalysis() {
    Logger.log('🎆 Master Analysis - All Systems');
    Logger.log('='.repeat(50));
    
    const results = {
      timestamp: new Date().toISOString(),
      systemDoctor: runSystemDoctor({ deepScan: true, traceDependencies: true, autoFix: false }),
      emergencyRepair: emergencyRepairSystem()
    };
    
    Logger.log('✅ Master analysis completed');
    return results;
  }

  // Enhanced Dependency Doctor
  function runDependencyDoctor() {
    Logger.log('🩺 Enhanced Dependency Doctor v1.0');
    Logger.log('='.repeat(60));
    
    const report = {
      timestamp: new Date().toISOString(),
      dependencyAnalysis: DependencyTracker.analyzeDependencyChain(),
      buildOrder: DependencyTracker.calculateBuildOrder(),
      buildResults: SafeModuleBuilder.buildAllInOrder()
    };
    
    Logger.log('\n📊 DEPENDENCY ANALYSIS SUMMARY:');
    Logger.log(`🔗 Total modules: ${report.dependencyAnalysis.totalModules}`);
    Logger.log(`🔄 Circular dependencies: ${report.dependencyAnalysis.circularDependencies.length}`);
    Logger.log(`📋 Build order resolved: ${report.buildOrder.resolved}/${report.buildOrder.totalModules}`);
    Logger.log(`✅ Successfully built: ${report.buildResults.built.length}`);
    Logger.log(`❌ Failed to build: ${report.buildResults.failed.length}`);
    Logger.log(`⏭️ Skipped: ${report.buildResults.skipped.length}`);
    
    if (report.dependencyAnalysis.circularDependencies.length > 0) {
      Logger.log(`\n⚠️ Circular Dependencies:`);
      report.dependencyAnalysis.circularDependencies.forEach(dep => Logger.log(`  - ${dep}`));
    }
    
    if (report.buildResults.failed.length > 0) {
      Logger.log(`\n❌ Build Failures:`);
      report.buildResults.failed.forEach(failure => Logger.log(`  - ${failure.name}: ${failure.error}`));
    }
    
    return report;
  }

  // Export functions
  global.runSystemDoctor = runSystemDoctor;
  global.runDependencyDoctor = runDependencyDoctor;
  global.emergencyRepairSystem = emergencyRepairSystem;
  global.masterAnalysis = masterAnalysis;
  global.DoctorModules = DoctorModules;
  global.DoctorDiagnostics = DoctorDiagnostics;
  global.DoctorDependencies = DoctorDependencies;
  global.DoctorReadiness = DoctorReadiness;
  global.DependencyTracker = DependencyTracker;
  global.EnhancedModuleVerifier = EnhancedModuleVerifier;
  global.SafeModuleBuilder = SafeModuleBuilder;

})(typeof global !== 'undefined' ? global : this);

// Auto-execute
runSystemDoctor();

// Enhanced functions
function fullDependencyAnalysis() {
  Logger.log('🔬 Full Dependency Analysis');
  Logger.log('='.repeat(50));
  
  const systemReport = runSystemDoctor({ deepScan: true, traceDependencies: true });
  const dependencyReport = runDependencyDoctor();
  
  return { systemAnalysis: systemReport, dependencyAnalysis: dependencyReport, timestamp: new Date().toISOString() };
}

global.fullDependencyAnalysis = fullDependencyAnalysis;