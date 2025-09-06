import * as fs from 'fs';
import * as path from 'path';

export interface AutoFixConfig {
  gemini: {
    apiKey: string;
    model: string;
    timeout: number;
  };
  paths: {
    repoRoot: string;
    dashboardPath: string;
    backupDir: string;
    logsDir: string;
  };
  scheduler: {
    interval: string;
    timezone: string;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config!: AutoFixConfig;

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
        backupDir: envVars['BACKUP_DIR'] || './docs/6_fixing/backups',
        logsDir: envVars['LOGS_DIR'] || './docs/6_fixing/logs'
      },
      scheduler: {
        interval: envVars['CRON_INTERVAL'] || '*/5 * * * *',
        timezone: envVars['TIMEZONE'] || 'Asia/Riyadh'
      }
    };
  }

  private parseEnvFile(filePath: string): Record<string, string> {
    if (!/* PERFORMANCE: Consider using async version */ fs.existsSync(filePath)) return {};
    
    const content = /* PERFORMANCE: Consider using async version */ fs.readFileSync(filePath, 'utf-8');
    const vars: Record<string, string> = {};
    
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        vars[key.trim()] = value.trim().replace(/['"]/g, '');
      }
    });
    
    return vars;
  }

  getConfig(): AutoFixConfig {
    return this.config;
  }

  validate(): boolean {
    return this.config.gemini.apiKey !== '';
  }
}