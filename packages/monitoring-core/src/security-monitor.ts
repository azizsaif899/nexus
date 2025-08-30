import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityMonitor {
  private readonly logger = new Logger(SecurityMonitor.name);
  private suspiciousActivities = new Map<string, number>();
  private blockedIPs = new Set<string>();

  async monitorRequest(ip: string, endpoint: string, statusCode: number): Promise<void> {
    // Monitor failed authentication attempts
    if (endpoint.includes('/auth/login') && statusCode === 401) {
      this.trackFailedLogin(ip);
    }

    // Monitor suspicious patterns
    if (this.isSuspiciousPattern(endpoint)) {
      this.trackSuspiciousActivity(ip, endpoint);
    }

    // Monitor high error rates
    if (statusCode >= 400) {
      this.trackErrorRate(ip);
    }
  }

  private trackFailedLogin(ip: string): void {
    const key = `failed_login:${ip}`;
    const count = (this.suspiciousActivities.get(key) || 0) + 1;
    this.suspiciousActivities.set(key, count);

    if (count >= 5) {
      this.blockIP(ip, 'Multiple failed login attempts');
    }
  }

  private trackSuspiciousActivity(ip: string, endpoint: string): void {
    const key = `suspicious:${ip}`;
    const count = (this.suspiciousActivities.get(key) || 0) + 1;
    this.suspiciousActivities.set(key, count);

    this.logger.warn(`Suspicious activity detected from ${ip}: ${endpoint}`);

    if (count >= 10) {
      this.blockIP(ip, 'Suspicious activity pattern');
    }
  }

  private trackErrorRate(ip: string): void {
    const key = `errors:${ip}`;
    const count = (this.suspiciousActivities.get(key) || 0) + 1;
    this.suspiciousActivities.set(key, count);

    if (count >= 50) {
      this.blockIP(ip, 'High error rate');
    }
  }

  private isSuspiciousPattern(endpoint: string): boolean {
    const suspiciousPatterns = [
      '/admin',
      '/wp-admin',
      '/.env',
      '/config',
      'SELECT',
      'UNION',
      '<script>',
      'javascript:'
    ];

    return suspiciousPatterns.some(pattern => 
      endpoint.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip);
    this.logger.error(`IP ${ip} blocked: ${reason}`);
    
    // Send alert (implement your alerting mechanism)
    this.sendSecurityAlert(ip, reason);
  }

  private sendSecurityAlert(ip: string, reason: string): void {
    // Implement alerting (email, Slack, etc.)
    this.logger.error(`SECURITY ALERT: ${reason} from IP ${ip}`);
  }

  isBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.logger.log(`IP ${ip} unblocked`);
  }
}