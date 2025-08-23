// Main exports for @azizsys/data-connect-core

export { 
  AzizSysDataConnect, 
  createDataConnect, 
  getDataConnect,
  type DataConnectConfig 
} from './client';

// CRM Queries
export * from './queries/crm-queries';

// CRM Mutations  
export * from './mutations/crm-mutations';

// Services
export { CRMService } from './services/crm-service';
export { AnalyticsService } from './services/analytics-service';
export { UserService } from './services/user-service';
export { GeminiIntegration } from './services/gemini-integration';
export { RealtimeSubscriptions } from './services/realtime-subscriptions';
export { BigQueryIntegration } from './services/bigquery-integration';
export { CRMAPIAdapter } from './services/crm-api-adapter';
export { IntegrationTests } from './testing/integration-tests';

// Types
export * from './types/crm-types';
export * from './types/analytics-types';
export * from './types/user-types';

// Utilities
export { QueryBuilder } from './utils/query-builder';
export { DataConnectError } from './utils/errors';

// Default configuration
export const DEFAULT_CONFIG: Partial<DataConnectConfig> = {
  location: 'us-central1',
  serviceId: 'azizsys-data-connect'
};