/**
 * @file SystemDoctor.js
 * @module System.Dev.SystemDoctor
 * @description
 * System Doctor v3.5 - Comprehensive Modular Diagnostic Suite
 * Converted for Google Apps Script environment
 */

defineModule('System.Dev.SystemDoctor', () => {
  'use strict';

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
        'GAssistant': !!GAssistant,
        'GAssistant.Utils': !!GAssistant?.Utils,
        'GAssistant.Utils.Injector': !!GAssistant?.Utils?.Injector,
        'Injector._moduleFactories': !!GAssistant?.Utils?.Injector?._moduleFactories,
        'Injector._moduleExports': !!GAssistant?.Utils?.Injector?._moduleExports,
        'defineModule': typeof defineModule === 'function',
        'Injector.buildAllModules': typeof GAssistant?.Utils?.Injector?.buildAllModules === 'function'
      };
      
      const broken = Object.entries(paths).filter(([path, exists]) => !exists);
      return { paths, broken, healthy: broken.length === 0 };
    },

    autoFixFactory(name) {
      try {
        const injector = GAssistant?.Utils?.Injector;
        if (!injector?._moduleFactories?.[name]) {
          Logger.log(`⚠️ Missing factory: ${name}. Attempting default injection...`);
          if (typeof defineModule === 'function') {
            defineModule(name, () => ({ _autoFixed: true }));
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

  // 🩺 Main System Doctor Function
  function runSystemDoctor(config = {}) {
    const { deepScan = false, traceDependencies = false, autoFix = false } = config;
    
    Logger.log('🩺 G-Assistant System Doctor v3.5 - Comprehensive Analysis');
    Logger.log('='.repeat(70));
    
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
    Logger.log(`Valid: ${factoryCheck.valid.length} | Broken: ${factoryCheck.broken.length}`);
    if (factoryCheck.valid.length > 0) Logger.log(`✅ Valid: ${factoryCheck.valid.join(', ')}`);
    if (factoryCheck.broken.length > 0) {
      Logger.log(`❌ Broken: ${factoryCheck.broken.map(b => `${b.name}(${b.type})`).join(', ')}`);
    }

    // 2. Missing Exports Analysis
    Logger.log('\n🔍 2. MISSING EXPORTS');
    const missingCheck = DoctorModules.traceMissingExports();
    report.checks.missing = missingCheck;
    Logger.log(`Missing: ${missingCheck.missing.length}`);
    if (missingCheck.missing.length > 0) {
      Logger.log(`❌ Missing: ${missingCheck.missing.join(', ')}`);
      missingCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 3. Fallback Analysis
    Logger.log('\n🔗 3. FALLBACK ANALYSIS');
    const fallbackCheck = DoctorDependencies.mapFallbackReasons();
    report.checks.fallbacks = fallbackCheck;
    Logger.log(`Fallbacks: ${fallbackCheck.fallbacks.length}`);
    if (fallbackCheck.fallbacks.length > 0) {
      Logger.log(`⚠️ Fallbacks: ${fallbackCheck.fallbacks.join(', ')}`);
      fallbackCheck.reasons.forEach(reason => Logger.log(`  → ${reason}`));
    }

    // 4. Dependency Graph (if enabled)
    if (traceDependencies) {
      Logger.log('\n🤖 4. DEPENDENCY GRAPH');
      const depGraph = DoctorDependencies.analyzeDependencyGraph();
      report.checks.dependencies = depGraph;
      Logger.log(`Issues: ${depGraph.issues.length}`);
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

    // 6. Auto-Fix (if enabled)
    if (autoFix) {
      Logger.log('\n🔧 6. AUTO-REPAIR');
      let fixCount = 0;
      missingCheck.missing.forEach(name => {
        const fixResult = DoctorDiagnostics.autoFixFactory(name);
        if (fixResult.fixed) {
          fixCount++;
          Logger.log(`✅ Fixed: ${name}`);
        }
      });
      report.checks.autoFix = { attempted: missingCheck.missing.length, fixed: fixCount };
      Logger.log(`Fixed: ${fixCount}/${missingCheck.missing.length}`);
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

    Logger.log('\n' + '='.repeat(70));
    Logger.log(`🎯 OVERALL STATUS: ${report.overall}`);
    Logger.log(`📊 Health: ${factoryCheck.valid.length}/${factoryCheck.valid.length + factoryCheck.broken.length + missingCheck.missing.length} modules functional`);
    if (deepScan) Logger.log(`🔍 Deep: ${readinessCheck.ready.length + readinessCheck.assumed.length} validated`);
    Logger.log('='.repeat(70));

    return report;
  }

  // Export the main function and components
  return {
    run: runSystemDoctor,
    modules: DoctorModules,
    diagnostics: DoctorDiagnostics,
    dependencies: DoctorDependencies,
    readiness: DoctorReadiness
  };
});