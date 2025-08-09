defineModule('System.PluginManager', ({ Utils, Config }) => {
  const MODULE_VERSION = '1.0.0';

  const PLUGIN_CONFIG = {
    'CFO_AGENT': { enabled: true, priority: 1 },
    'DEVELOPER_AGENT': { enabled: true, priority: 2 },
    'DATABASE_AGENT': { enabled: true, priority: 3 },
    'ADMIN_AGENT': { enabled: false, priority: 4 },
    'OPERATIONS_AGENT': { enabled: false, priority: 5 }
  };

  function isPluginEnabled(pluginName) {
    const config = Config.get(`PLUGIN_${pluginName}_ENABLED`);
    return config === 'true' || PLUGIN_CONFIG[pluginName]?.enabled || false;
  }

  function getEnabledAgents() {
    return Object.entries(PLUGIN_CONFIG)
      .filter(([name, config]) => isPluginEnabled(name))
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([name]) => name);
  }

  function togglePlugin(pluginName, enabled) {
    Config.set(`PLUGIN_${pluginName}_ENABLED`, enabled.toString());
    return { type: 'success', text: `Plugin ${pluginName}: ${enabled ? 'enabled' : 'disabled'}` };
  }

  return {
    isPluginEnabled,
    getEnabledAgents,
    togglePlugin,
    MODULE_VERSION
  };
});
