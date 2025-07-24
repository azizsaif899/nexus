/**
 * @file utils.js
 * @description Core utilities for AzizSys.
 */
AzizSys.defineModule('System.Utils', () => {
    function log(message, data) {
        console.log(message, data || '');
    }

    function warn(message, data) {
        console.warn(message, data || '');
    }

    function error(message, details = {}) {
        console.error(message, details);
    }

    function executeSafely(fn, context = 'Unknown Context', fallbackValue = null) {
        try { return fn(); } catch (e) { error('Execution failed', { context, errorObj: e }); return fallbackValue; }
    }

    // ... other utility functions
    return { log, warn, error, executeSafely };
});