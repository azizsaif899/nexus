import { ConnectorConfig } from 'firebase/data-connect';

// Data Connect Configuration Type
export interface DataConnectConfig {
  projectId: string;
  connector: ConnectorConfig;
  emulator?: {
    host: string;
    port: number;
  };
}

export const connectorConfig: ConnectorConfig = {
  connector: 'example',
  service: 'azizsys5',
  location: 'us-central1'
};

export const dataConnectConfig: DataConnectConfig = {
  projectId: process.env['FIREBASE_PROJECT_ID'] || 'gen-lang-client-0147492600',
  connector: connectorConfig,
  emulator: {
    host: 'localhost',
    port: 9399
  }
};