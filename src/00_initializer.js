/**
 * @file 00_Initializer.js
 * @module System.Initializer
 * @version 2.0.0
 * @author عبدالعزيز
 * @description
 * نقطة التشغيل الموحدة للنظام. يقوم بتهيئة السياق والبيئة،
 * تحميل الوحدات بالترتيب الصحيح، وتفعيل نظام المراقبة.
 * المراحل المعمارية المطبقة:
 *   • 1: تهيئة نظام حقن التبعيات
 *   • 2: تحميل الوحدات بالترتيب الصحيح
 *   • 3: تفعيل نظام المراقبة
 *   • 4: إعداد معالجة الأخطاء العامة
 */

(function(global) {
  'use strict';

  // --- المرحلة الثانية: الربط والتنفيذ ---
  function buildAndInitializeModules() {
    const injector = global.GAssistant.Utils.Injector;
    if (!injector) throw new Error("Injector is missing.");

    const factories = injector._moduleFactories;
    const moduleNames = Object.keys(factories);
    const builtModules = new Set();

    function buildModule(name) {
      if (builtModules.has(name)) return;
      if (!factories[name]) {
        // قد تكون وحدة أساسية مثل System.Utils تم بناؤها بالفعل
        if (name === 'System.Utils') {
           builtModules.add(name);
           return;
        }
        throw new Error(`Module factory not found for "${name}".`);
      }

      const factory = factories[name];
      
      // استخراج التبعيات من الدالة المصنعية
      const fnStr = factory.toString();
      const argsMatch = fnStr.match(/^(?:function|\()?\s*\(?([^)]*)\)?\s*=>|function[^(]*\(([^)]*)\)/);
      let argNames = [];
      if (argsMatch) {
        const args = (argsMatch[1] || argsMatch[2] || '').trim();
        if (args.startsWith('{') && args.endsWith('}')) {
          argNames = args.slice(1, -1).split(',').map(a => a.split(':')[0].trim());
        } else {
          argNames = args.split(',').map(a => a.trim()).filter(a => a);
        }
      }

      // بناء التبعيات بشكل تعاودي
      argNames.forEach(depName => buildModule(depName));

      // الآن بعد بناء التبعيات، يمكننا حلها وتنفيذ المصنع
      const deps = injector.get(...argNames);
      const exports = factory(deps);

      // إرفاق الوحدة بالمساحة العامة
      const parts = name.split('.');
      let current = global.GAssistant;
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = exports;

      // تسجيل المخرجات في Injector
      injector.setExports(name, exports);
      builtModules.add(name);
      console.log(`✅ Module built: ${name}`);
    }

    // بناء جميع الوحدات المسجلة
    moduleNames.forEach(name => {
      try {
        buildModule(name);
      } catch (error) {
        console.error(`❌ Failed to build module ${name}: ${error.message}`);
      }
    });

    // الآن بعد بناء جميع الوحدات، قم بتشغيل دوال init()
    const initResults = { success: 0, failed: 0 };
    moduleNames.forEach(name => {
      const moduleExports = injector._moduleExports[name];
      if (moduleExports && typeof moduleExports.init === 'function') {
        try {
          moduleExports.init();
          initResults.success++;
        } catch (e) {
          console.error(`❌ Error initializing module ${name}: ${e.message}`);
          initResults.failed++;
        }
      }
    });
    console.log(`🔧 Initialization complete: ${initResults.success} modules initialized, ${initResults.failed} failed.`);
  }

  /**
   * تهيئة النظام الأساسي
   */
  function initializeSystem() {
    console.log('🚀 G-Assistant Initializer v3.0 starting...');
    try {
      // 1. التحقق من وجود نظام الوحدات
      if (typeof global.defineModule === 'undefined' || !global.GAssistant?.Utils?.Injector) {
        throw new Error('Module system not found. Utils must be loaded first.');
      }

      // 2. بناء وتهيئة جميع الوحدات المسجلة
      buildAndInitializeModules();

      // 3. تفعيل نظام المراقبة
      if (global.GAssistant.System && global.GAssistant.System.Telemetry) {
        global.GAssistant.System.Telemetry.track('System.Initialization.V3', { status: 'success' });
      }

      // 5. تسجيل التوثيق للوحدات ذات التبعية الدائرية
      if (global.GAssistant.System && global.GAssistant.System.DocsManager) {
        global.GAssistant.System.DocsManager.registerConfigDocs();
        global.GAssistant.System.DocsManager.registerCoreDocs();
      }

      // 6. تشغيل health-check شامل
      if (global.GAssistant.System && global.GAssistant.System.HealthCheck) {
        const healthReport = global.GAssistant.System.HealthCheck.runHealthCheckAndSave();
        console.log(`📊 صحة النظام: ${healthReport.systemStatus} (${healthReport.healthPercentage}%)`);
      }

      console.log('✅ تم تهيئة نظام G-Assistant بنجاح.');
      return true;

    } catch (e) {
      const errorMessage = `CRITICAL FAILURE: G-Assistant could not be initialized. ${e.stack || e.message}`;
      console.error(errorMessage);
      
      // في حالة الفشل الكارثي، أظهر تنبيهًا للمستخدم
      try {
        SpreadsheetApp.getUi().alert('فشل حرج في تهيئة النظام. يرجى مراجعة السجلات.');
      } catch (uiError) {
        console.error('Could not show UI alert:', uiError.message);
      }
      return false;
    }
  }

  // 🩺 Unified System Doctor - Works in both environments
  function runSystemDoctor() {
    console.log('🩺 G-Assistant System Doctor v3.0 - Comprehensive Analysis');
    console.log('=' .repeat(60));
    
    const report = { timestamp: new Date().toISOString(), overall: 'UNKNOWN', checks: {} };

    // 1. Core System Check
    console.log('\n🔍 1. CORE SYSTEM INTEGRITY');
    const hasInjector = !!global.GAssistant?.Utils?.Injector;
    const hasDefineModule = typeof global.defineModule === 'function';
    const hasBuildFunction = typeof global.GAssistant?.Utils?.Injector?.buildAllModules === 'function';
    const coreHealthy = hasInjector && hasDefineModule && hasBuildFunction;
    
    report.checks.core = { healthy: coreHealthy, hasInjector, hasDefineModule, hasBuildFunction };
    console.log(`Status: ${coreHealthy ? '✅ HEALTHY' : '❌ CRITICAL'}`);
    console.log(`Details: ${coreHealthy ? 'Core system components present' : 'Missing core - check 00_utils.js'}`);

    if (!coreHealthy) {
      report.overall = 'CRITICAL';
      console.log('\n🛑 CRITICAL: Cannot proceed without core system');
      return report;
    }

    // 2. Module Analysis
    console.log('\n📦 2. MODULE ANALYSIS');
    const injector = global.GAssistant.Utils.Injector;
    const factories = Object.keys(injector._moduleFactories || {});
    const exports = Object.keys(injector._moduleExports || {});
    const valid = exports.filter(name => !injector._moduleExports[name]?._isFallback);
    const fallbacks = exports.filter(name => injector._moduleExports[name]?._isFallback);
    const failed = factories.filter(name => !exports.includes(name));
    
    report.checks.modules = { total: factories.length, valid, fallbacks, failed };
    console.log(`Total: ${factories.length} | Valid: ${valid.length} | Fallbacks: ${fallbacks.length} | Failed: ${failed.length}`);
    if (valid.length > 0) console.log(`✅ Valid: ${valid.join(', ')}`);
    if (fallbacks.length > 0) console.log(`⚠️ Fallbacks: ${fallbacks.join(', ')}`);
    if (failed.length > 0) console.log(`❌ Failed: ${failed.join(', ')}`);

    // 3. Overall Status
    const criticalIssues = failed.length;
    const warnings = fallbacks.length;
    
    if (criticalIssues > 0) {
      report.overall = 'CRITICAL';
    } else if (warnings > 0) {
      report.overall = 'WARNING';
    } else {
      report.overall = 'HEALTHY';
    }

    console.log('\n' + '=' .repeat(60));
    console.log(`🎯 OVERALL SYSTEM STATUS: ${report.overall}`);
    console.log(`📊 Summary: ${valid.length}/${factories.length} modules healthy`);
    console.log('=' .repeat(60));

    return report;
  }

  // تشغيل التهيئة
  global.initializeGAssistantSystem = initializeSystem;
  global.runSystemDoctor = runSystemDoctor;
  global.systemDoctor = runSystemDoctor; // Alias for easier access
  
  // System Doctor v3.5 Integration
  try {
    const doctorPath = './system_doctor_final.cjs';
    if (typeof require !== 'undefined') {
      const doctor = require(doctorPath);
      global.runAdvancedSystemDoctor = doctor.runSystemDoctor;
      Logger.log('🩺 System Doctor v3.5 integrated successfully');
    }
  } catch (e) {
    Logger.log('⚠️ System Doctor v3.5 not available:', e.message);
  }
  
  initializeSystem();

})(this);
