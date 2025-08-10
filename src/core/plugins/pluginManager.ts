import { Plugin, TaskRequest, TaskResult } from '../types';
import { eventBus } from '../events/eventBus';
import * as fs from 'fs-extra';
import * as path from 'path';

export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, Plugin> = new Map();
  private pluginDir: string;

  private constructor() {
    this.pluginDir = path.join(process.cwd(), 'src/plugins');
    this.discoverPlugins();
  }

  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  private async discoverPlugins(): Promise<void> {
    if (!fs.existsSync(this.pluginDir)) {
      fs.ensureDirSync(this.pluginDir);
      return;
    }

    const files = fs.readdirSync(this.pluginDir);
    
    for (const file of files) {
      if (file.endsWith('.plugin.ts') || file.endsWith('.plugin.js')) {
        try {
          const pluginPath = path.join(this.pluginDir, file);
          const pluginModule = await import(pluginPath);
          const plugin: Plugin = pluginModule.default || pluginModule;
          
          this.plugins.set(plugin.name, plugin);
          eventBus.emit('plugin:loaded', { name: plugin.name, version: plugin.version });
        } catch (error) {
          eventBus.emit('plugin:error', { name: file, error: error as Error });
        }
      }
    }
  }

  async runPreTaskHooks(task: TaskRequest): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      if (plugin.enabled && plugin.hooks.beforeTask) {
        try {
          await plugin.hooks.beforeTask(task);
        } catch (error) {
          eventBus.emit('plugin:error', { name, error: error as Error });
        }
      }
    }
  }

  async runPostTaskHooks(task: TaskRequest, result: TaskResult): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      if (plugin.enabled && plugin.hooks.afterTask) {
        try {
          await plugin.hooks.afterTask(task, result);
        } catch (error) {
          eventBus.emit('plugin:error', { name, error: error as Error });
        }
      }
    }
  }

  async runErrorHooks(error: Error, task: TaskRequest): Promise<void> {
    for (const [name, plugin] of this.plugins) {
      if (plugin.enabled && plugin.hooks.onError) {
        try {
          await plugin.hooks.onError(error, task);
        } catch (pluginError) {
          eventBus.emit('plugin:error', { name, error: pluginError as Error });
        }
      }
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  enablePlugin(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.enabled = true;
      return true;
    }
    return false;
  }

  disablePlugin(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.enabled = false;
      return true;
    }
    return false;
  }
}