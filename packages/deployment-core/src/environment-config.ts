import { Injectable } from '@nestjs/common';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  maxRetriesPerRequest: number;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  corsOrigins: string[];
  rateLimitMax: number;
  rateLimitWindowMs: number;
}

export interface MonitoringConfig {
  enabled: boolean;
  metricsPort: number;
  healthCheckPath: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enableTracing: boolean;
}

export interface EnvironmentConfiguration {
  name: string;
  type: 'development' | 'staging' | 'production' | 'test';
  api: {
    port: number;
    host: string;
    baseUrl: string;
  };
  database: DatabaseConfig;
  redis: RedisConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  features: {
    enableCaching: boolean;
    enableRateLimiting: boolean;
    enableMetrics: boolean;
    enableSwagger: boolean;
  };
  external: {
    geminiApiKey: string;
    whatsappToken: string;
    emailService: {
      provider: 'sendgrid' | 'ses' | 'smtp';
      apiKey?: string;
      smtpConfig?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
          user: string;
          pass: string;
        };
      };
    };
  };
}

@Injectable()
export class EnvironmentConfig {
  private configurations = new Map<string, EnvironmentConfiguration>();

  constructor() {
    this.initializeConfigurations();
  }

  private initializeConfigurations(): void {
    // Development Configuration
    this.configurations.set('development', {
      name: 'development',
      type: 'development',
      api: {
        port: 3000,
        host: 'localhost',
        baseUrl: 'http://localhost:3000'
      },
      database: {
        host: 'localhost',
        port: 5432,
        database: 'azizsys_dev',
        username: 'postgres',
        password: 'postgres',
        ssl: false,
        maxConnections: 10
      },
      redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
        maxRetriesPerRequest: 3
      },
      security: {
        jwtSecret: 'dev-secret-key',
        jwtExpiresIn: '24h',
        bcryptRounds: 10,
        corsOrigins: ['http://localhost:3000', 'http://localhost:4200'],
        rateLimitMax: 1000,
        rateLimitWindowMs: 60000
      },
      monitoring: {
        enabled: true,
        metricsPort: 9090,
        healthCheckPath: '/health',
        logLevel: 'debug',
        enableTracing: false
      },
      features: {
        enableCaching: true,
        enableRateLimiting: false,
        enableMetrics: true,
        enableSwagger: true
      },
      external: {
        geminiApiKey: process.env.GEMINI_API_KEY || 'dev-key',
        whatsappToken: process.env.WHATSAPP_TOKEN || 'dev-token',
        emailService: {
          provider: 'smtp',
          smtpConfig: {
            host: 'localhost',
            port: 1025,
            secure: false,
            auth: {
              user: 'test',
              pass: 'test'
            }
          }
        }
      }
    });

    // Staging Configuration
    this.configurations.set('staging', {
      name: 'staging',
      type: 'staging',
      api: {
        port: 3000,
        host: '0.0.0.0',
        baseUrl: 'https://staging-api.azizsys.com'
      },
      database: {
        host: process.env.DB_HOST || 'staging-db.azizsys.com',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'azizsys_staging',
        username: process.env.DB_USER || 'azizsys',
        password: process.env.DB_PASSWORD || '',
        ssl: true,
        maxConnections: 20
      },
      redis: {
        host: process.env.REDIS_HOST || 'staging-redis.azizsys.com',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: 0,
        maxRetriesPerRequest: 3
      },
      security: {
        jwtSecret: process.env.JWT_SECRET || '',
        jwtExpiresIn: '12h',
        bcryptRounds: 12,
        corsOrigins: [
          'https://staging-dashboard.azizsys.com',
          'https://staging-chat.azizsys.com'
        ],
        rateLimitMax: 500,
        rateLimitWindowMs: 60000
      },
      monitoring: {
        enabled: true,
        metricsPort: 9090,
        healthCheckPath: '/health',
        logLevel: 'info',
        enableTracing: true
      },
      features: {
        enableCaching: true,
        enableRateLimiting: true,
        enableMetrics: true,
        enableSwagger: true
      },
      external: {
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        whatsappToken: process.env.WHATSAPP_TOKEN || '',
        emailService: {
          provider: 'sendgrid',
          apiKey: process.env.SENDGRID_API_KEY
        }
      }
    });

    // Production Configuration
    this.configurations.set('production', {
      name: 'production',
      type: 'production',
      api: {
        port: 3000,
        host: '0.0.0.0',
        baseUrl: 'https://api.azizsys.com'
      },
      database: {
        host: process.env.DB_HOST || '',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'azizsys_prod',
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        ssl: true,
        maxConnections: 50
      },
      redis: {
        host: process.env.REDIS_HOST || '',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: 0,
        maxRetriesPerRequest: 3
      },
      security: {
        jwtSecret: process.env.JWT_SECRET || '',
        jwtExpiresIn: '8h',
        bcryptRounds: 14,
        corsOrigins: [
          'https://dashboard.azizsys.com',
          'https://chat.azizsys.com'
        ],
        rateLimitMax: 200,
        rateLimitWindowMs: 60000
      },
      monitoring: {
        enabled: true,
        metricsPort: 9090,
        healthCheckPath: '/health',
        logLevel: 'warn',
        enableTracing: true
      },
      features: {
        enableCaching: true,
        enableRateLimiting: true,
        enableMetrics: true,
        enableSwagger: false
      },
      external: {
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        whatsappToken: process.env.WHATSAPP_TOKEN || '',
        emailService: {
          provider: 'ses',
          apiKey: process.env.AWS_SES_API_KEY
        }
      }
    });

    // Test Configuration
    this.configurations.set('test', {
      name: 'test',
      type: 'test',
      api: {
        port: 3001,
        host: 'localhost',
        baseUrl: 'http://localhost:3001'
      },
      database: {
        host: 'localhost',
        port: 5433,
        database: 'azizsys_test',
        username: 'postgres',
        password: 'postgres',
        ssl: false,
        maxConnections: 5
      },
      redis: {
        host: 'localhost',
        port: 6380,
        db: 1,
        maxRetriesPerRequest: 1
      },
      security: {
        jwtSecret: 'test-secret-key',
        jwtExpiresIn: '1h',
        bcryptRounds: 4,
        corsOrigins: ['*'],
        rateLimitMax: 10000,
        rateLimitWindowMs: 60000
      },
      monitoring: {
        enabled: false,
        metricsPort: 9091,
        healthCheckPath: '/health',
        logLevel: 'error',
        enableTracing: false
      },
      features: {
        enableCaching: false,
        enableRateLimiting: false,
        enableMetrics: false,
        enableSwagger: false
      },
      external: {
        geminiApiKey: 'test-key',
        whatsappToken: 'test-token',
        emailService: {
          provider: 'smtp',
          smtpConfig: {
            host: 'localhost',
            port: 1025,
            secure: false,
            auth: {
              user: 'test',
              pass: 'test'
            }
          }
        }
      }
    });
  }

  getConfiguration(environment: string): EnvironmentConfiguration {
    const config = this.configurations.get(environment);
    if (!config) {
      throw new Error(`Configuration for environment '${environment}' not found`);
    }
    return config;
  }

  getCurrentConfiguration(): EnvironmentConfiguration {
    const env = process.env.NODE_ENV || 'development';
    return this.getConfiguration(env);
  }

  getAllEnvironments(): string[] {
    return Array.from(this.configurations.keys());
  }

  validateConfiguration(environment: string): boolean {
    try {
      const config = this.getConfiguration(environment);
      
      // Validate required fields
      if (!config.database.host || !config.database.username) {
        return false;
      }
      
      if (config.type === 'production') {
        if (!config.security.jwtSecret || config.security.jwtSecret === 'dev-secret-key') {
          return false;
        }
        
        if (!config.external.geminiApiKey || !config.external.whatsappToken) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }

  updateConfiguration(environment: string, updates: Partial<EnvironmentConfiguration>): void {
    const existing = this.getConfiguration(environment);
    const updated = { ...existing, ...updates };
    this.configurations.set(environment, updated);
  }
}