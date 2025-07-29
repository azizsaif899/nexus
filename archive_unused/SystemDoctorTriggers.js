/**
 * @file SystemDoctorTriggers.js
 * @description
 * Global functions for System Doctor - Can be called from Apps Script editor
 */

/**
 * Run basic system health check
 * Usage: Call from Apps Script editor
 */
function runSystemHealthCheck() {
  try {
    const doctor = GAssistant?.System?.Dev?.SystemDoctor;
    if (doctor && typeof doctor.run === 'function') {
      return doctor.run();
    } else {
      Logger.log('❌ SystemDoctor not available. Run initializeGAssistantSystem() first.');
      return { overall: 'UNAVAILABLE', error: 'SystemDoctor module not found' };
    }
  } catch (e) {
    Logger.log('❌ Error running system health check:', e.message);
    return { overall: 'ERROR', error: e.message };
  }
}

/**
 * Run deep system analysis
 * Usage: Call from Apps Script editor
 */
function runDeepSystemAnalysis() {
  try {
    const doctor = GAssistant?.System?.Dev?.SystemDoctor;
    if (doctor && typeof doctor.run === 'function') {
      return doctor.run({ 
        deepScan: true, 
        traceDependencies: true, 
        autoFix: false 
      });
    } else {
      Logger.log('❌ SystemDoctor not available. Run initializeGAssistantSystem() first.');
      return { overall: 'UNAVAILABLE', error: 'SystemDoctor module not found' };
    }
  } catch (e) {
    Logger.log('❌ Error running deep analysis:', e.message);
    return { overall: 'ERROR', error: e.message };
  }
}

/**
 * Run system auto-repair
 * Usage: Call from Apps Script editor
 */
function runSystemAutoRepair() {
  try {
    const doctor = GAssistant?.System?.Dev?.SystemDoctor;
    if (doctor && typeof doctor.run === 'function') {
      return doctor.run({ 
        deepScan: true, 
        traceDependencies: true, 
        autoFix: true 
      });
    } else {
      Logger.log('❌ SystemDoctor not available. Run initializeGAssistantSystem() first.');
      return { overall: 'UNAVAILABLE', error: 'SystemDoctor module not found' };
    }
  } catch (e) {
    Logger.log('❌ Error running auto-repair:', e.message);
    return { overall: 'ERROR', error: e.message };
  }
}

/**
 * Get quick system status
 * Usage: Call from Apps Script editor
 */
function getSystemStatus() {
  try {
    const utils = GAssistant?.System?.Dev?.SystemDoctorUtils;
    if (utils && typeof utils.getHealthSummary === 'function') {
      return utils.getHealthSummary();
    } else {
      // Fallback to basic check
      return runSystemHealthCheck();
    }
  } catch (e) {
    Logger.log('❌ Error getting system status:', e.message);
    return { status: 'ERROR', error: e.message };
  }
}

/**
 * Check if system is healthy
 * Usage: Call from Apps Script editor
 */
function isSystemHealthy() {
  try {
    const status = getSystemStatus();
    return status.status === 'HEALTHY' || status.overall === 'HEALTHY';
  } catch (e) {
    Logger.log('❌ Error checking system health:', e.message);
    return false;
  }
}

/**
 * Initialize system and run health check
 * Usage: Call from Apps Script editor
 */
function initAndCheckSystem() {
  try {
    Logger.log('🚀 Initializing system and running health check...');
    
    // Initialize system first
    if (typeof initializeGAssistantSystem === 'function') {
      const initResult = initializeGAssistantSystem();
      if (!initResult) {
        Logger.log('❌ System initialization failed');
        return { overall: 'INIT_FAILED', error: 'System initialization failed' };
      }
    }
    
    // Wait a moment for initialization to complete
    Utilities.sleep(1000);
    
    // Run health check
    return runSystemHealthCheck();
  } catch (e) {
    Logger.log('❌ Error in initAndCheckSystem:', e.message);
    return { overall: 'ERROR', error: e.message };
  }
}