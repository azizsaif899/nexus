// *************************************************************************************************
// --- START OF FILE: 00_dependency_map.js ---
// *************************************************************************************************

/**
 * @file 00_dependency_map.js
 * @module System.Dev.DependencyMap
 * @version 1.0.0
 * @author عبدالعزيز
 * @description
 * وحدة مركزية لتوثيق شجرة التبعيات المعمارية للمشروع.
 * تساعد هذه الوحدة في عمليات التحقق والمراقبة الآلية لبنية النظام،
 * وتوفر مصدرًا واحدًا للحقيقة حول كيفية ترابط الوحدات.
 */

'use strict';

defineModule('System.Dev.DependencyMap', () => {

  const dependencyTree = {
    // Core System
    'Config': ['Utils', 'AI', 'Telemetry'],
    'DocsManager': ['Utils', 'Config', 'Telemetry'],
    'Telemetry': ['Utils', 'Config', 'ModuleVerifier'],
    'ModuleVerifier': ['Utils'], // Injector is global
    'MetricsLogger': ['Utils', 'AI', 'Telemetry', 'Config', 'DocsManager'],

    // AI System
    'AI.Core': ['Utils', 'Dialogue', 'Config', 'AI', 'Tools', 'DocsManager', 'Telemetry', 'MetricsLogger', 'ModuleVerifier'],
    'AI.Memory': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry'],
    'AI.LongTermMemory': ['Utils', 'Config', 'DocsManager', 'Telemetry'],
    'AI.Constitution': ['Config', 'DocsManager', 'AI', 'Telemetry', 'Utils', 'MetricsLogger'],
    'AI.GeminiAdapter': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry'],
    'AI.IntentAnalyzer': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry', 'Tools'],
    'AI.ToolExecutor': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry', 'Tools'],
    'AI.Context': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry', 'Tools'],

    // Agents System
    'AgentsCatalog': ['Utils', 'DocsManager'],
    'AgentDeveloper': ['Utils', 'Config', 'AI', 'Context', 'Tools'],
    'AgentDispatcher.Core': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry', 'AgentsCatalog', 'UI', 'MetricsLogger'],

    // UI System
    'UI': ['Utils', 'Dialogue', 'Config', 'API', 'Tools', 'AI', 'Telemetry', 'DocsManager'],
    'UI.Dialogue': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry'],
    'UI.DeveloperSidebar': ['Utils', 'Config', 'DocsManager', 'AI', 'Telemetry', 'UI'],

    // Tools
    'Tools.ProjectService': ['Utils', 'DocsManager'],
    'Tools.Accounting': ['Utils', 'UI', 'Config', 'AI', 'DocsManager'],
    'Tools.Developer': ['Utils', 'Agents', 'Tools', 'Config', 'UI', 'AI', 'DocsManager'],

    // High-level modules
    'ProjectExport': ['Utils', 'DocsManager', 'UI', 'Config', 'Tools', 'ModuleVerifier', 'Telemetry'],
    'System.Code': ['Config', 'UI', 'AI', 'Tools', 'Tests', 'Utils', 'Dispatcher', 'LongTermMemory'],
    'API.Endpoints': ['Utils', 'AI', 'Tools', 'Telemetry']
  };

  /**
   * يعيد شجرة التبعيات الكاملة.
   * @returns {object}
   */
  function getTree() {
    return JSON.parse(JSON.stringify(dependencyTree));
  }

  return { getTree };
});

// *************************************************************************************************
// --- END OF FILE: 00_dependency_map.js ---
// *************************************************************************************************