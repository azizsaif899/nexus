import { DataConnect, connectDataConnect } from '@firebase/data-connect';
import { initializeApp, FirebaseApp } from '@firebase/app';

export interface DataConnectConfig {
  projectId: string;
  location?: string;
  serviceId?: string;
  emulator?: {
    host: string;
    port: number;
  };
}

export class AzizSysDataConnect {
  private app: FirebaseApp;
  private dataConnect: DataConnect;
  private config: DataConnectConfig;

  constructor(config: DataConnectConfig) {
    this.config = {
      location: 'us-central1',
      serviceId: 'azizsys-data-connect',
      ...config
    };

    // Initialize Firebase App
    this.app = initializeApp({
      projectId: this.config.projectId
    });

    // Connect to Data Connect
    this.dataConnect = connectDataConnect(this.app, {
      location: this.config.location!,
      serviceId: this.config.serviceId!,
      connector: 'default'
    });

    // Configure emulator if specified
    if (this.config.emulator) {
      this.connectToEmulator();
    }
  }

  private connectToEmulator(): void {
    if (this.config.emulator) {
      // Connect to local emulator for development
      console.log(`Connecting to Data Connect emulator at ${this.config.emulator.host}:${this.config.emulator.port}`);
    }
  }

  /**
   * Execute a GraphQL query
   */
  async query<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const result = await this.dataConnect.executeQuery({
        query,
        variables: variables || {}
      });
      
      return result.data as T;
    } catch (error) {
      console.error('DataConnect query error:', error);
      throw new Error(`Query failed: ${error}`);
    }
  }

  /**
   * Execute a GraphQL mutation
   */
  async mutate<T = any>(mutation: string, variables?: Record<string, any>): Promise<T> {
    try {
      const result = await this.dataConnect.executeMutation({
        mutation,
        variables: variables || {}
      });
      
      return result.data as T;
    } catch (error) {
      console.error('DataConnect mutation error:', error);
      throw new Error(`Mutation failed: ${error}`);
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe<T = any>(
    subscription: string, 
    variables?: Record<string, any>,
    callback?: (data: T) => void
  ) {
    try {
      return this.dataConnect.executeSubscription({
        subscription,
        variables: variables || {},
        callback: (result) => {
          if (callback && result.data) {
            callback(result.data as T);
          }
        }
      });
    } catch (error) {
      console.error('DataConnect subscription error:', error);
      throw new Error(`Subscription failed: ${error}`);
    }
  }

  /**
   * Get the underlying DataConnect instance
   */
  getDataConnect(): DataConnect {
    return this.dataConnect;
  }

  /**
   * Get the Firebase App instance
   */
  getApp(): FirebaseApp {
    return this.app;
  }

  /**
   * Health check for the connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query(`
        query HealthCheck {
          health {
            status
          }
        }
      `);
      
      return result?.health?.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
let instance: AzizSysDataConnect | null = null;

export function createDataConnect(config: DataConnectConfig): AzizSysDataConnect {
  if (!instance) {
    instance = new AzizSysDataConnect(config);
  }
  return instance;
}

export function getDataConnect(): AzizSysDataConnect {
  if (!instance) {
    throw new Error('DataConnect not initialized. Call createDataConnect() first.');
  }
  return instance;
}

export default AzizSysDataConnect;