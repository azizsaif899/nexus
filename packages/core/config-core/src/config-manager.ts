import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigManager {
  private config = {
    monitoring: {
      enabled: true,
      healthCheckInterval: 30000,
      alertThresholds: {
        criticalTasks: 1,
        errorRateMax: 10,
        memoryUsageMax: 85
      }
    },
    telemetry: {
      enabled: true,
      retentionDays: 7,
      maxLogEntries: 100
    },
    errorHandling: {
      autoRetry: true,
      maxRetries: 3,
      retryDelay: 5000
    },
    performance: {
      maxConcurrentTasks: 5,
      taskTimeout: 300000,
      cpuThreshold: 80
    },
    features: {
      advancedAI: true,
      researchAgent: true,
      multiAgent: true,
      realTimeChat: true
    }
  };

  getConfig(key?: string): any {
    if (key) {
      return this.getNestedValue(this.config, key);
    }
    return this.config;
  }

  setConfig(key: string, value: any): void {
    this.setNestedValue(this.config, key, value);
  }

  isFeatureEnabled(feature: string): boolean {
    return this.config.features[feature] || false;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
}