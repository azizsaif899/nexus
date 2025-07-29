/**
 * @file SystemDoctorUtils.js
 * @module System.Dev.SystemDoctorUtils
 * @description
 * Utility functions for System Doctor - Helper functions and shortcuts
 */

defineModule('System.Dev.SystemDoctorUtils', ({ SystemDoctor }) => {
  'use strict';

  /**
   * Quick system health check
   */
  function quickCheck() {
    Logger.log('🔍 Quick System Health Check...');
    const doctor = SystemDoctor || GAssistant.System?.Dev?.SystemDoctor;
    if (doctor && typeof doctor.run === 'function') {
      return doctor.run();
    } else {
      Logger.log('❌ SystemDoctor not available');
      return { overall: 'UNAVAILABLE', error: 'SystemDoctor module not found' };
    }
  }

  /**
   * Deep system analysis
   */
  function deepAnalysis() {
    Logger.log('🔬 Deep System Analysis...');
    const doctor = SystemDoctor || GAssistant.System?.Dev?.SystemDoctor;
    if (doctor && typeof doctor.run === 'function') {
      return doctor.run({ 
        deepScan: true, 
        traceDependencies: true, 
        autoFix: false 
      });
    } else {
      Logger.log('❌ SystemDoctor not available');
      return { overall: 'UNAVAILABLE', error: 'SystemDoctor module not found' };
    }
  }

  /**
   * Auto-repair system issues
   */
  function autoRepair() {
    Logger.log('🔧 Auto-Repair System Issues...');
    const doctor = SystemDoctor || GAssistant.System?.Dev?.SystemDoctor;
    if (doctor && typeof doctor.run === 'function') {
      return doctor.run({ 
        deepScan: true, 
        traceDependencies: true, 
        autoFix: true 
      });
    } else {
      Logger.log('❌ SystemDoctor not available');
      return { overall: 'UNAVAILABLE', error: 'SystemDoctor module not found' };
    }
  }

  /**
   * Get system health summary
   */
  function getHealthSummary() {
    const result = quickCheck();
    if (result.overall === 'UNAVAILABLE') return result;
    
    return {
      status: result.overall,
      timestamp: result.timestamp,
      summary: {
        factories: result.checks?.factories?.valid?.length || 0,
        missing: result.checks?.missing?.missing?.length || 0,
        fallbacks: result.checks?.fallbacks?.fallbacks?.length || 0,
        ready: result.checks?.readiness?.ready?.length || 0
      }
    };
  }

  /**
   * Check if system is healthy
   */
  function isSystemHealthy() {
    const summary = getHealthSummary();
    return summary.status === 'HEALTHY';
  }

  /**
   * Get system issues
   */
  function getSystemIssues() {
    const result = deepAnalysis();
    if (result.overall === 'UNAVAILABLE') return [];
    
    const issues = [];
    
    // Factory issues
    if (result.checks?.factories?.broken?.length > 0) {
      issues.push({
        type: 'FACTORY_BROKEN',
        count: result.checks.factories.broken.length,
        items: result.checks.factories.broken.map(b => b.name)
      });
    }
    
    // Missing exports
    if (result.checks?.missing?.missing?.length > 0) {
      issues.push({
        type: 'MISSING_EXPORTS',
        count: result.checks.missing.missing.length,
        items: result.checks.missing.missing
      });
    }
    
    // Fallbacks
    if (result.checks?.fallbacks?.fallbacks?.length > 0) {
      issues.push({
        type: 'FALLBACKS',
        count: result.checks.fallbacks.fallbacks.length,
        items: result.checks.fallbacks.fallbacks
      });
    }
    
    return issues;
  }

  // Export all utility functions
  return {
    quickCheck,
    deepAnalysis,
    autoRepair,
    getHealthSummary,
    isSystemHealthy,
    getSystemIssues
  };
});