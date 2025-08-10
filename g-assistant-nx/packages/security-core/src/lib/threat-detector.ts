export interface ThreatRule {
  id: string;
  name: string;
  type: 'sql_injection' | 'xss' | 'brute_force' | 'anomaly' | 'malware';
  pattern?: RegExp;
  threshold?: number;
  timeWindow?: number; // seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'log' | 'block' | 'alert' | 'quarantine';
}

export interface ThreatEvent {
  id: string;
  ruleId: string;
  type: ThreatRule['type'];
  severity: ThreatRule['severity'];
  source: string;
  target?: string;
  timestamp: Date;
  details: Record<string, any>;
  blocked: boolean;
}

export interface AttackAttempt {
  source: string;
  type: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
}

export class ThreatDetector {
  private rules: Map<string, ThreatRule> = new Map();
  private events: ThreatEvent[] = [];
  private attackAttempts: Map<string, AttackAttempt> = new Map();
  private blockedIPs: Set<string> = new Set();

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    const defaultRules: ThreatRule[] = [
      {
        id: 'sql_injection_1',
        name: 'SQL Injection Detection',
        type: 'sql_injection',
        pattern: /((\%27)|(\')|((\%3D)|(=))[^\n]*((\%27)|(\')|((\%2D)|(\-)){2}|(\%3B)|(;)))/i,
        severity: 'high',
        action: 'block'
      },
      {
        id: 'xss_1',
        name: 'Cross-Site Scripting Detection',
        type: 'xss',
        pattern: /<script[^>]*>.*?<\/script>/gi,
        severity: 'high',
        action: 'block'
      },
      {
        id: 'brute_force_1',
        name: 'Brute Force Attack Detection',
        type: 'brute_force',
        threshold: 5,
        timeWindow: 300, // 5 minutes
        severity: 'medium',
        action: 'block'
      },
      {
        id: 'anomaly_1',
        name: 'Traffic Anomaly Detection',
        type: 'anomaly',
        threshold: 100, // requests per minute
        timeWindow: 60,
        severity: 'medium',
        action: 'alert'
      }
    ];

    defaultRules.forEach(rule => this.rules.set(rule.id, rule));
  }

  addRule(rule: ThreatRule): void {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  analyzeRequest(request: {
    ip: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
    userAgent?: string;
  }): { allowed: boolean; threats: ThreatEvent[] } {
    const threats: ThreatEvent[] = [];
    let allowed = true;

    // Check if IP is already blocked
    if (this.blockedIPs.has(request.ip)) {
      allowed = false;
      threats.push(this.createThreatEvent('blocked_ip', 'anomaly', 'high', request.ip, {
        reason: 'IP previously blocked',
        url: request.url
      }));
    }

    // Check each rule
    for (const rule of this.rules.values()) {
      const threat = this.checkRule(rule, request);
      if (threat) {
        threats.push(threat);
        
        if (rule.action === 'block' || rule.action === 'quarantine') {
          allowed = false;
          if (rule.action === 'block') {
            this.blockedIPs.add(request.ip);
          }
        }
      }
    }

    // Update attack attempts tracking
    if (threats.length > 0) {
      this.updateAttackAttempts(request.ip, threats[0].type);
    }

    return { allowed, threats };
  }

  private checkRule(rule: ThreatRule, request: any): ThreatEvent | null {
    switch (rule.type) {
      case 'sql_injection':
      case 'xss':
        return this.checkPatternRule(rule, request);
      case 'brute_force':
        return this.checkBruteForceRule(rule, request);
      case 'anomaly':
        return this.checkAnomalyRule(rule, request);
      default:
        return null;
    }
  }

  private checkPatternRule(rule: ThreatRule, request: any): ThreatEvent | null {
    if (!rule.pattern) return null;

    const testStrings = [
      request.url,
      request.body || '',
      JSON.stringify(request.headers),
      request.userAgent || ''
    ];

    for (const testString of testStrings) {
      if (rule.pattern.test(testString)) {
        return this.createThreatEvent(rule.id, rule.type, rule.severity, request.ip, {
          matchedString: testString.substring(0, 100),
          url: request.url,
          method: request.method
        });
      }
    }

    return null;
  }

  private checkBruteForceRule(rule: ThreatRule, request: any): ThreatEvent | null {
    const key = `${request.ip}_${rule.type}`;
    const attempt = this.attackAttempts.get(key);
    const now = new Date();

    if (attempt) {
      const timeDiff = (now.getTime() - attempt.firstSeen.getTime()) / 1000;
      
      if (timeDiff <= (rule.timeWindow || 300)) {
        if (attempt.count >= (rule.threshold || 5)) {
          return this.createThreatEvent(rule.id, rule.type, rule.severity, request.ip, {
            attemptCount: attempt.count,
            timeWindow: timeDiff,
            url: request.url
          });
        }
      }
    }

    return null;
  }

  private checkAnomalyRule(rule: ThreatRule, request: any): ThreatEvent | null {
    // Simple anomaly detection based on request rate
    const key = `${request.ip}_requests`;
    const now = new Date();
    const timeWindow = (rule.timeWindow || 60) * 1000; // Convert to milliseconds
    
    // Count recent requests from this IP
    const recentEvents = this.events.filter(event => 
      event.source === request.ip && 
      (now.getTime() - event.timestamp.getTime()) <= timeWindow
    );

    if (recentEvents.length >= (rule.threshold || 100)) {
      return this.createThreatEvent(rule.id, rule.type, rule.severity, request.ip, {
        requestCount: recentEvents.length,
        timeWindow: rule.timeWindow,
        url: request.url
      });
    }

    return null;
  }

  private createThreatEvent(
    ruleId: string, 
    type: ThreatRule['type'], 
    severity: ThreatRule['severity'], 
    source: string, 
    details: Record<string, any>
  ): ThreatEvent {
    const event: ThreatEvent = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId,
      type,
      severity,
      source,
      timestamp: new Date(),
      details,
      blocked: this.rules.get(ruleId)?.action === 'block'
    };

    this.events.push(event);
    
    // Keep only last 10000 events
    if (this.events.length > 10000) {
      this.events.shift();
    }

    return event;
  }

  private updateAttackAttempts(source: string, type: string): void {
    const key = `${source}_${type}`;
    const now = new Date();
    
    const attempt = this.attackAttempts.get(key);
    if (attempt) {
      attempt.count++;
      attempt.lastSeen = now;
    } else {
      this.attackAttempts.set(key, {
        source,
        type,
        count: 1,
        firstSeen: now,
        lastSeen: now
      });
    }
  }

  getThreatEvents(severity?: ThreatRule['severity'], limit = 100): ThreatEvent[] {
    let filtered = this.events;
    
    if (severity) {
      filtered = filtered.filter(event => event.severity === severity);
    }
    
    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  unblockIP(ip: string): boolean {
    return this.blockedIPs.delete(ip);
  }

  getAttackAttempts(): AttackAttempt[] {
    return Array.from(this.attackAttempts.values())
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  getThreatStatistics(): {
    totalThreats: number;
    threatsBySeverity: Record<string, number>;
    threatsByType: Record<string, number>;
    blockedIPs: number;
    topAttackers: Array<{ ip: string; attempts: number }>;
  } {
    const threatsBySeverity: Record<string, number> = {};
    const threatsByType: Record<string, number> = {};

    this.events.forEach(event => {
      threatsBySeverity[event.severity] = (threatsBySeverity[event.severity] || 0) + 1;
      threatsByType[event.type] = (threatsByType[event.type] || 0) + 1;
    });

    const topAttackers = Array.from(this.attackAttempts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(attempt => ({ ip: attempt.source, attempts: attempt.count }));

    return {
      totalThreats: this.events.length,
      threatsBySeverity,
      threatsByType,
      blockedIPs: this.blockedIPs.size,
      topAttackers
    };
  }
}