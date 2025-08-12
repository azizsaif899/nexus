export interface ScalingMetrics {
  cpu: number;
  memory: number;
  requests: number;
  responseTime: number;
}

export class AutoScaler {
  private minReplicas = 3;
  private maxReplicas = 100;
  private targetCPU = 70;

  async evaluateScaling(metrics: ScalingMetrics): Promise<{ action: 'scale-up' | 'scale-down' | 'maintain', replicas: number }> {
    console.log('📊 Evaluating scaling decision...', metrics);

    if (metrics.cpu > this.targetCPU || metrics.responseTime > 200) {
      return { action: 'scale-up', replicas: Math.min(this.maxReplicas, this.getCurrentReplicas() * 2) };
    }

    if (metrics.cpu < 30 && metrics.responseTime < 50) {
      return { action: 'scale-down', replicas: Math.max(this.minReplicas, Math.floor(this.getCurrentReplicas() / 2)) };
    }

    return { action: 'maintain', replicas: this.getCurrentReplicas() };
  }

  private getCurrentReplicas(): number {
    return 5;
  }

  async scaleService(serviceName: string, replicas: number): Promise<void> {
    console.log(`⚡ Scaling ${serviceName} to ${replicas} replicas`);
  }
}