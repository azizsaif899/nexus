export interface NotificationChannel {
  type: 'email' | 'sms' | 'webhook' | 'console';
  config: Record<string, any>;
  enabled: boolean;
}

export interface NotificationRule {
  alertLevel: 'info' | 'warning' | 'critical';
  channels: string[];
  template?: string;
}

export class NotificationService {
  private channels = new Map<string, NotificationChannel>();
  private rules: NotificationRule[] = [];

  addChannel(name: string, channel: NotificationChannel): void {
    this.channels.set(name, channel);
  }

  addRule(rule: NotificationRule): void {
    this.rules.push(rule);
  }

  async sendAlert(alert: any): Promise<void> {
    const applicableRules = this.rules.filter(rule => rule.alertLevel === alert.level);
    
    for (const rule of applicableRules) {
      for (const channelName of rule.channels) {
        const channel = this.channels.get(channelName);
        if (channel?.enabled) {
          await this.sendToChannel(channel, alert, rule.template);
        }
      }
    }
  }

  private async sendToChannel(channel: NotificationChannel, alert: any, template?: string): Promise<void> {
    const message = template ? this.formatMessage(template, alert) : alert.message;
    
    switch (channel.type) {
      case 'console':
        console.log(`🚨 ALERT [${alert.level.toUpperCase()}]: ${message}`);
        break;
      case 'webhook':
        await this.sendWebhook(channel.config.url, { alert, message });
        break;
      case 'email':
        console.log(`📧 EMAIL ALERT to ${channel.config.to}: ${message}`);
        break;
      case 'sms':
        console.log(`📱 SMS ALERT to ${channel.config.phone}: ${message}`);
        break;
    }
  }

  private async sendWebhook(url: string, payload: any): Promise<void> {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Webhook notification failed:', error);
    }
  }

  private formatMessage(template: string, alert: any): string {
    return template
      .replace('{level}', alert.level)
      .replace('{message}', alert.message)
      .replace('{timestamp}', alert.timestamp);
  }
}