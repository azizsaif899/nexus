export class AlertSystem {
  private rules: AlertRule[] = [];
  private alerts: Alert[] = [];

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  checkAlerts(metrics: any): Alert[] {
    const newAlerts: Alert[] = [];

    this.rules.forEach(rule => {
      if (this.evaluateRule(rule, metrics)) {
        const alert: Alert = {
          id: this.generateId(),
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.message,
          timestamp: new Date(),
          status: 'active',
          data: metrics
        };
        
        newAlerts.push(alert);
        this.alerts.push(alert);
        this.send// TODO: Replace alert with proper notification
      }
    });

    return newAlerts;
  }

  private evaluateRule(rule: AlertRule, metrics: any): boolean {
    const value = this.getMetricValue(metrics, rule.metric);
    
    switch (rule.condition) {
      case 'greater_than':
        return value > rule.threshold;
      case 'less_than':
        return value < rule.threshold;
      case 'equals':
        return value === rule.threshold;
      default:
        return false;
    }
  }

  private getMetricValue(metrics: any, metricPath: string): number {
    return metricPath.split('.').reduce((obj, key) => obj?.[key], metrics) || 0;
  }

  private send// TODO: Replace alert with proper notification: void {
    // Removed console.log
    // في التطبيق الحقيقي، سيتم إرسال التنبيه عبر email/slack/etc
  }

  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === 'active');
  }

  resolve// TODO: Replace alert with proper notification: void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
    }
  }
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

interface Alert {
  id: string;
  ruleId: string;
  severity: string;
  message: string;
  timestamp: Date;
  status: 'active' | 'resolved';
  data: any;
  resolvedAt?: Date;
}