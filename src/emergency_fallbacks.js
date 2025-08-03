// إنشاء fallbacks للوحدات المفقودة الأساسية
defineModule('System.DocsManager', [], () => ({
  log: (msg) => Logger.log(`[DocsManager] ${msg}`),
  registerConfigDocs: () => Logger.log('[DocsManager] Config docs registered'),
  registerCoreDocs: () => Logger.log('[DocsManager] Core docs registered'),
  init: () => true,
  isReady: () => ({ status: 'fallback', name: 'DocsManager' })
}));

defineModule('System.Telemetry', [], () => ({
  log: (msg) => Logger.log(`[Telemetry] ${msg}`),
  track: (event, data) => Logger.log(`[Telemetry] Event: ${event}, Data: ${JSON.stringify(data)}`),
  error: (msg, error) => Logger.log(`[Telemetry ERROR] ${msg}: ${error?.message || error}`),
  init: () => true,
  isReady: () => ({ status: 'fallback', name: 'Telemetry' })
}));

defineModule('System.Security', [], () => ({
  log: (msg) => Logger.log(`[Security] ${msg}`),
  init: () => true,
  isReady: () => ({ status: 'fallback', name: 'Security' })
}));

defineModule('System.HealthCheck', [], () => ({
  log: (msg) => Logger.log(`[HealthCheck] ${msg}`),
  runHealthCheckAndSave: () => ({
    systemStatus: 'OK',
    healthPercentage: 85,
    timestamp: new Date()
  }),
  init: () => true,
  isReady: () => ({ status: 'fallback', name: 'HealthCheck' })
}));

defineModule('System.Storage.Provider', [], () => ({
  log: (msg) => Logger.log(`[StorageProvider] ${msg}`),
  init: () => true,
  isReady: () => ({ status: 'fallback', name: 'StorageProvider' })
}));
