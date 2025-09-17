export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  replicas: number;
  resources: ResourceLimits;
  healthCheck: HealthCheckConfig;
}

export interface ResourceLimits {
  cpu: string;
  memory: string;
}

export interface HealthCheckConfig {
  path: string;
  port: number;
  initialDelaySeconds: number;
  periodSeconds: number;
}

export interface DeploymentStatus {
  id: string;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolling-back';
  progress: number;
  message: string;
  timestamp: Date;
}

export interface RollbackOptions {
  targetVersion: string;
  reason: string;
  immediate: boolean;
}