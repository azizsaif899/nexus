
defineModule('System.MetricsLogger', () => ({
  log: (metric, value) => {
    console.log(`[METRICS] ${metric}: ${value}`);
    return true;
  },
  init: () => true
}));
