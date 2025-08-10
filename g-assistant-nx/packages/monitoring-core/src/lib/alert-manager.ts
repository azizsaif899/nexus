export interface Alert {
  id: string;
  name: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface AlertRule {
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'ne';
  threshold: number;
  level: Alert['level'];
  message: string;
  cooldown: number; // minutes
}

export class AlertManager {
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private lastTriggered = new Map<string, Date>();

  addRule(rule: AlertRule): void {
    this.rules.push(rule);
  }

  checkMetric(metricName: string, value: number): Alert[] {
    const triggeredAlerts: Alert[] = [];
    const now = new Date();

    for (const rule of this.rules) {
      if (rule.metric !== metricName) continue;

      const lastTrigger = this.lastTriggered.get(rule.name);
      if (lastTrigger) {
        const cooldownMs = rule.cooldown * 60 * 1000;
        if (now.getTime() - lastTrigger.getTime() < cooldownMs) {
          continue;
        }
      }

      let shouldTrigger = false;
      switch (rule.condition) {
        case 'gt': shouldTrigger = value > rule.threshold; break;
        case 'lt': shouldTrigger = value < rule.threshold; break;
        case 'eq': shouldTrigger = value === rule.threshold; break;
        case 'ne': shouldTrigger = value !== rule.threshold; break;
      }

      if (shouldTrigger) {
        const alert: Alert = {
          id: `${rule.name}-${Date.now()}`,
          name: rule.name,
          level: rule.level,
          message: rule.message.replace('{value}', value.toString()),
          timestamp: now,
          resolved: false,
          metadata: { metric: metricName, value, threshold: rule.threshold }
        };

        this.alerts.push(alert);
        triggeredAlerts.push(alert);
        this.lastTriggered.set(rule.name, now);
      }
    }

    return triggeredAlerts;
  }

  getAlerts(level?: Alert['level'], resolved?: boolean): Alert[] {
    let filtered = this.alerts;

    if (level) {
      filtered = filtered.filter(a => a.level === level);
    }

    if (resolved !== undefined) {
      filtered = filtered.filter(a => a.resolved === resolved);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  clearResolvedAlerts(): void {
    this.alerts = this.alerts.filter(a => !a.resolved);
  }
}