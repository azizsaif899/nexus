#!/usr/bin/env node
// 🩺 Enhanced Dependency Doctor - يحل مشاكل التبعيات والترتيب

(function(global) {
  'use strict';

  // Enhanced Dependency Tracker
  const DependencyTracker = {
    // 1. تعريف التبعيات الصريحة
    analyzeDependencyChain() {
      Logger.log('🔗 Analyzing Dependency Chain...');
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const dependencyMap = new Map();
      const circularDeps = [];
      
      // Build dependency map
      Object.entries(factories).forEach(([name, factory]) => {
        const deps = this.extractDependencies(factory);
        dependencyMap.set(name, deps);
      });
      
      // Check for circular dependencies
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
      
      const params = paramMatch[0]
        .replace(/function\s*\(|\)|\s*=>.*/g, '')
        .split(',')
        .map(p => p.trim())
        .filter(p => p);
      
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

    // 2. التهيئة بالترتيب الصحيح
    calculateBuildOrder() {
      Logger.log('📋 Calculating Optimal Build Order...');
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const dependencyMap = new Map();
      const buildOrder = [];
      const built = new Set();
      
      // Extract dependencies
      Object.entries(factories).forEach(([name, factory]) => {
        const deps = this.extractDependencies(factory);
        dependencyMap.set(name, deps);
      });
      
      // Topological sort
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
      
      return {
        buildOrder,
        unresolved,
        totalModules: dependencyMap.size,
        resolved: built.size
      };
    },

    // 3. تتبع حالة الوحدات المحسن
    trackModuleStates() {
      Logger.log('📊 Tracking Module States...');
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
      
      const states = {
        pending: [],
        ready: [],
        failed: [],
        fallback: [],
        missing: []
      };
      
      Object.keys(factories).forEach(name => {
        if (!exports[name]) {
          states.pending.push(name);
        } else if (exports[name]._isFallback) {
          states.fallback.push(name);
        } else if (exports[name]._autoFixed) {
          states.failed.push(name);
        } else {
          states.ready.push(name);
        }
      });
      
      // Check for missing factories
      Object.keys(exports).forEach(name => {
        if (!factories[name] && !exports[name]._isFallback) {
          states.missing.push(name);
        }
      });
      
      return states;
    },

    // 4. معالجة الأخطاء المحسنة
    validateFactoryFunctions() {
      Logger.log('🔍 Validating Factory Functions...');
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const validation = {
        valid: [],
        invalid: [],
        errors: []
      };
      
      Object.entries(factories).forEach(([name, factory]) => {
        try {
          if (typeof factory !== 'function') {
            validation.invalid.push({
              name,
              issue: 'Not a function',
              type: typeof factory
            });
            return;
          }
          
          // Test if factory can be called safely
          const deps = this.extractDependencies(factory);
          const mockDeps = deps.map(() => ({}));
          
          try {
            factory(...mockDeps);
            validation.valid.push(name);
          } catch (e) {
            validation.errors.push({
              name,
              error: e.message,
              dependencies: deps
            });
          }
        } catch (e) {
          validation.errors.push({
            name,
            error: `Validation failed: ${e.message}`
          });
        }
      });
      
      return validation;
    }
  };

  // Enhanced Module Verifier
  const EnhancedModuleVerifier = {
    isReady(moduleName) {
      const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
      const moduleExport = exports[moduleName];
      
      if (!moduleExport) return false;
      if (moduleExport._isFallback) return false;
      if (moduleExport._autoFixed) return false;
      
      return true;
    },

    checkReady(moduleNames) {
      if (!Array.isArray(moduleNames)) return false;
      return moduleNames.every(name => this.isReady(name));
    },

    getReadinessReport() {
      const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
      const report = {
        ready: [],
        notReady: [],
        fallback: [],
        missing: []
      };
      
      Object.entries(exports).forEach(([name, moduleExport]) => {
        if (this.isReady(name)) {
          report.ready.push(name);
        } else if (moduleExport._isFallback) {
          report.fallback.push(name);
        } else {
          report.notReady.push(name);
        }
      });
      
      return report;
    }
  };

  // Safe Module Builder
  const SafeModuleBuilder = {
    buildWithDependencies(moduleName) {
      Logger.log(`🔧 Building ${moduleName} with dependency checking...`);
      
      const factories = GAssistant?.Utils?.Injector?._moduleFactories || {};
      const exports = GAssistant?.Utils?.Injector?._moduleExports || {};
      
      if (!factories[moduleName]) {
        return { success: false, error: 'Factory not found' };
      }
      
      if (exports[moduleName] && !exports[moduleName]._isFallback) {
        return { success: true, message: 'Already built' };
      }
      
      const factory = factories[moduleName];
      const deps = DependencyTracker.extractDependencies(factory);
      
      // Check if dependencies are ready
      if (!EnhancedModuleVerifier.checkReady(deps)) {
        const notReady = deps.filter(dep => !EnhancedModuleVerifier.isReady(dep));
        return { 
          success: false, 
          error: 'Dependencies not ready', 
          missingDeps: notReady 
        };
      }
      
      try {
        // Resolve dependencies
        const resolvedDeps = deps.map(depName => exports[depName]);
        
        // Build module
        const result = factory(...resolvedDeps);
        exports[moduleName] = result;
        
        Logger.log(`✅ Successfully built: ${moduleName}`);
        return { success: true, result };
        
      } catch (error) {
        Logger.log(`❌ Failed to build ${moduleName}: ${error.message}`);
        
        // Create fallback
        exports[moduleName] = { 
          _isFallback: true, 
          _error: error.message,
          _timestamp: new Date().toISOString()
        };
        
        return { success: false, error: error.message };
      }
    },

    buildAllInOrder() {
      Logger.log('🏗️ Building all modules in dependency order...');
      
      const buildOrder = DependencyTracker.calculateBuildOrder();
      const results = {
        built: [],
        failed: [],
        skipped: []
      };
      
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

  // Comprehensive Dependency Doctor
  function runDependencyDoctor() {
    Logger.log('🩺 Enhanced Dependency Doctor v1.0');
    Logger.log('='.repeat(60));
    
    const report = {
      timestamp: new Date().toISOString(),
      dependencyAnalysis: DependencyTracker.analyzeDependencyChain(),
      buildOrder: DependencyTracker.calculateBuildOrder(),
      moduleStates: DependencyTracker.trackModuleStates(),
      factoryValidation: DependencyTracker.validateFactoryFunctions(),
      readinessReport: EnhancedModuleVerifier.getReadinessReport(),
      buildResults: SafeModuleBuilder.buildAllInOrder()
    };
    
    // Summary
    Logger.log('\n📊 DEPENDENCY ANALYSIS SUMMARY:');
    Logger.log(`🔗 Total modules: ${report.dependencyAnalysis.totalModules}`);
    Logger.log(`🔄 Circular dependencies: ${report.dependencyAnalysis.circularDependencies.length}`);
    Logger.log(`📋 Build order resolved: ${report.buildOrder.resolved}/${report.buildOrder.totalModules}`);
    Logger.log(`✅ Successfully built: ${report.buildResults.built.length}`);
    Logger.log(`❌ Failed to build: ${report.buildResults.failed.length}`);
    Logger.log(`⏭️ Skipped (unresolved deps): ${report.buildResults.skipped.length}`);
    
    if (report.dependencyAnalysis.circularDependencies.length > 0) {
      Logger.log(`\n⚠️ Circular Dependencies Found:`);
      report.dependencyAnalysis.circularDependencies.forEach(dep => {
        Logger.log(`  - ${dep}`);
      });
    }
    
    if (report.buildResults.failed.length > 0) {
      Logger.log(`\n❌ Build Failures:`);
      report.buildResults.failed.forEach(failure => {
        Logger.log(`  - ${failure.name}: ${failure.error}`);
      });
    }
    
    return report;
  }

  // Export enhanced functions
  global.DependencyTracker = DependencyTracker;
  global.EnhancedModuleVerifier = EnhancedModuleVerifier;
  global.SafeModuleBuilder = SafeModuleBuilder;
  global.runDependencyDoctor = runDependencyDoctor;

})(typeof global !== 'undefined' ? global : this);

// Auto-execute if run directly
if (typeof require !== 'undefined' && require.main === module) {
  // Mock setup for testing
  global.Logger = { log: console.log };
  global.GAssistant = { 
    Utils: { 
      Injector: { 
        _moduleFactories: {
          'System.Config': function() { return { version: '1.0' }; },
          'System.Utils': function(Config) { return { config: Config }; },
          'System.AI': function(Config, Utils) { return { ready: true }; }
        },
        _moduleExports: {}
      }
    }
  };
  
  runDependencyDoctor();
}