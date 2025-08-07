const fs = require('fs');
const path = require('path');

class MonitoringDashboard {
  constructor() {
    this.dashboardPath = path.join(__dirname, '../docs/6_fixing/reports/central_dashboard.json');
    this.alerts = [];
  }

  async checkSystemHealth() {
    try {
      const data = JSON.parse(fs.readFileSync(this.dashboardPath, 'utf8'));
      const health = data.systemHealth;
      
      // Check critical metrics
      if (health.metrics.criticalTasks > 0) {
        this.alerts.push({
          type: 'critical',
          message: `${health.metrics.criticalTasks} مهام حرجة تحتاج انتباه فوري`,
          timestamp: new Date().toISOString()
        });
      }

      // Check completion rate
      if (health.metrics.completionRate < 30) {
        this.alerts.push({
          type: 'warning',
          message: `معدل الإنجاز منخفض: ${health.metrics.completionRate}%`,
          timestamp: new Date().toISOString()
        });
      }

      return {
        status: health.overall,
        alerts: this.alerts,
        metrics: health.metrics
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async sendAlert(alert) {
    console.log(`🚨 تنبيه: ${alert.message}`);
    // Integration point for Slack/Discord
    return true;
  }
}

module.exports = MonitoringDashboard;