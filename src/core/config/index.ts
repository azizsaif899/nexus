import { AppConfig } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

export class ConfigManager {
  private static instance: ConfigManager;
  private config!: AppConfig;

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): void {
    const configPath = path.join(process.cwd(), '.env');
    const envVars = this.parseEnvFile(configPath);

    this.config = {
      gemini: {
        apiKey: envVars['GEMINI_API_KEY'] || '',
        model: envVars['GEMINI_MODEL'] || 'gemini-pro',
        timeout: parseInt(envVars['GEMINI_TIMEOUT'] || '30000')
      },
      paths: {
        repoRoot: envVars['REPO_ROOT'] || process.cwd(),
        dashboardPath: envVars['DASHBOARD_PATH'] || './docs/6_fixing/reports/central_dashboard.json',
        backupDir: envVars['BACKUP_DIR'] || './backups',
        logsDir: envVars['LOGS_DIR'] || './logs'
      },
      notifications: {
        slack: envVars['SLACK_WEBHOOK'] ? {
          webhook: envVars['SLACK_WEBHOOK'],
          channel: envVars['SLACK_CHANNEL'] || '#general'
        } : undefined,
        teams: envVars['TEAMS_WEBHOOK'] ? {
          webhook: envVars['TEAMS_WEBHOOK']
        } : undefined
      },
      scheduler: {
        interval: envVars['CRON_INTERVAL'] || '*/5 * * * *',
        timezone: envVars['TIMEZONE'] || 'Asia/Riyadh'
      },
      plugins: {
        enabled: envVars['ENABLED_PLUGINS']?.split(',') || [],
        config: {}
      }
    };
  }

  private parseEnvFile(filePath: string): Record<string, string> {
    if (!fs.existsSync(filePath)) return {};
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const vars: Record<string, string> = {};
    
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        vars[key.trim()] = value.trim().replace(/['"]/g, '');
      }
    });
    
    return vars;
  }

  getConfig(): AppConfig {
    return this.config;
  }

  validate(): boolean {
    const required = ['gemini.apiKey', 'paths.repoRoot'];
    return required.every(key => {
      const value = this.getNestedValue(this.config, key);
      return value !== undefined && value !== '';
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}