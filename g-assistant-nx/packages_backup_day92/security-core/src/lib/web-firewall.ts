export interface FirewallRule {
  id: string;
  name: string;
  type: 'block' | 'allow' | 'rate_limit' | 'sanitize';
  condition: {
    field: 'ip' | 'url' | 'method' | 'header' | 'body' | 'user_agent';
    operator: 'equals' | 'contains' | 'regex' | 'in' | 'not_in';
    value: string | string[];
  };
  action: {
    type: 'block' | 'allow' | 'rate_limit' | 'sanitize' | 'log';
    parameters?: Record<string, any>;
  };
  priority: number;
  enabled: boolean;
}

export interface FirewallEvent {
  id: string;
  timestamp: Date;
  ruleId: string;
  action: string;
  request: {
    ip: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
  };
  blocked: boolean;
  reason: string;
}

export class WebFirewall {
  private rules: Map<string, FirewallRule> = new Map();
  private events: FirewallEvent[] = [];
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    const defaultRules: FirewallRule[] = [
      {
        id: 'block_malicious_ips',
        name: 'Block Known Malicious IPs',
        type: 'block',
        condition: {
          field: 'ip',
          operator: 'in',
          value: ['192.168.1.100', '10.0.0.50'] // Example malicious IPs
        },
        action: { type: 'block' },
        priority: 1,
        enabled: true
      },
      {
        id: 'sql_injection_protection',
        name: 'SQL Injection Protection',
        type: 'block',
        condition: {
          field: 'body',
          operator: 'regex',
          value: '((\%27)|(\')|((\%3D)|(=))[^\n]*((\%27)|(\')|((\%2D)|(\-)){2}|(\%3B)|(;)))'
        },
        action: { type: 'block' },
        priority: 2,
        enabled: true
      },
      {
        id: 'xss_protection',
        name: 'XSS Protection',
        type: 'sanitize',
        condition: {
          field: 'body',
          operator: 'regex',
          value: '<script[^>]*>.*?</script>'
        },
        action: { type: 'sanitize' },
        priority: 3,
        enabled: true
      },
      {
        id: 'rate_limit_api',
        name: 'API Rate Limiting',
        type: 'rate_limit',
        condition: {
          field: 'url',
          operator: 'contains',
          value: '/api/'
        },
        action: { 
          type: 'rate_limit',
          parameters: { limit: 100, window: 60000 } // 100 requests per minute
        },
        priority: 4,
        enabled: true
      },
      {
        id: 'block_admin_external',
        name: 'Block External Admin Access',
        type: 'block',
        condition: {
          field: 'url',
          operator: 'contains',
          value: '/admin'
        },
        action: { type: 'block' },
        priority: 5,
        enabled: true
      }
    ];

    defaultRules.forEach(rule => this.rules.set(rule.id, rule));
  }

  addRule(rule: FirewallRule): void {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  updateRule(ruleId: string, updates: Partial<FirewallRule>): boolean {
    const rule = this.rules.get(ruleId);
    if (rule) {
      Object.assign(rule, updates);
      return true;
    }
    return false;
  }

  processRequest(request: {
    ip: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
    userAgent?: string;
  }): { allowed: boolean; modifiedRequest?: any; reason?: string } {
    // Sort rules by priority
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => a.priority - b.priority);

    let modifiedRequest = { ...request };
    
    for (const rule of sortedRules) {
      const matches = this.evaluateCondition(rule.condition, modifiedRequest);
      
      if (matches) {
        const event: FirewallEvent = {
          id: `fw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          ruleId: rule.id,
          action: rule.action.type,
          request: modifiedRequest,
          blocked: false,
          reason: `Matched rule: ${rule.name}`
        };

        switch (rule.action.type) {
          case 'block':
            event.blocked = true;
            this.logEvent(event);
            return { 
              allowed: false, 
              reason: `Blocked by rule: ${rule.name}` 
            };

          case 'rate_limit':
            const rateLimitResult = this.applyRateLimit(
              modifiedRequest.ip, 
              rule.action.parameters?.limit || 100,
              rule.action.parameters?.window || 60000
            );
            
            if (!rateLimitResult.allowed) {
              event.blocked = true;
              this.logEvent(event);
              return { 
                allowed: false, 
                reason: 'Rate limit exceeded' 
              };
            }
            break;

          case 'sanitize':
            modifiedRequest = this.sanitizeRequest(modifiedRequest, rule.condition);
            break;

          case 'log':
            this.logEvent(event);
            break;
        }

        this.logEvent(event);
      }
    }

    return { allowed: true, modifiedRequest };
  }

  private evaluateCondition(condition: FirewallRule['condition'], request: any): boolean {
    let fieldValue: string;

    switch (condition.field) {
      case 'ip':
        fieldValue = request.ip;
        break;
      case 'url':
        fieldValue = request.url;
        break;
      case 'method':
        fieldValue = request.method;
        break;
      case 'body':
        fieldValue = request.body || '';
        break;
      case 'user_agent':
        fieldValue = request.userAgent || request.headers['user-agent'] || '';
        break;
      case 'header':
        fieldValue = JSON.stringify(request.headers);
        break;
      default:
        return false;
    }

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      
      case 'contains':
        return fieldValue.includes(condition.value as string);
      
      case 'regex':
        const regex = new RegExp(condition.value as string, 'i');
        return regex.test(fieldValue);
      
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      
      default:
        return false;
    }
  }

  private applyRateLimit(identifier: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const key = `rate_limit_${identifier}`;
    
    let rateLimitData = this.rateLimits.get(key);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      rateLimitData = {
        count: 1,
        resetTime: now + windowMs
      };
      this.rateLimits.set(key, rateLimitData);
      return { allowed: true, remaining: limit - 1 };
    }

    if (rateLimitData.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    rateLimitData.count++;
    return { allowed: true, remaining: limit - rateLimitData.count };
  }

  private sanitizeRequest(request: any, condition: FirewallRule['condition']): any {
    const sanitized = { ...request };

    if (condition.field === 'body' && sanitized.body) {
      // Remove script tags and other dangerous content
      sanitized.body = sanitized.body
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    return sanitized;
  }

  private logEvent(event: FirewallEvent): void {
    this.events.push(event);
    
    // Keep only last 10000 events
    if (this.events.length > 10000) {
      this.events.shift();
    }

    if (event.blocked) {
      console.warn('🛡️ FIREWALL BLOCKED REQUEST:', {
        ip: event.request.ip,
        url: event.request.url,
        reason: event.reason
      });
    }
  }

  getEvents(limit = 1000): FirewallEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getBlockedRequests(limit = 100): FirewallEvent[] {
    return this.events
      .filter(event => event.blocked)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getRules(): FirewallRule[] {
    return Array.from(this.rules.values())
      .sort((a, b) => a.priority - b.priority);
  }

  getStatistics(): {
    totalRequests: number;
    blockedRequests: number;
    blockRate: number;
    topBlockedIPs: Array<{ ip: string; count: number }>;
    topBlockedUrls: Array<{ url: string; count: number }>;
    ruleEffectiveness: Array<{ ruleId: string; ruleName: string; triggers: number }>;
  } {
    const totalRequests = this.events.length;
    const blockedEvents = this.events.filter(e => e.blocked);
    const blockedRequests = blockedEvents.length;
    const blockRate = totalRequests > 0 ? (blockedRequests / totalRequests) * 100 : 0;

    // Count blocked IPs
    const ipCounts: Record<string, number> = {};
    const urlCounts: Record<string, number> = {};
    const ruleCounts: Record<string, { name: string; count: number }> = {};

    blockedEvents.forEach(event => {
      ipCounts[event.request.ip] = (ipCounts[event.request.ip] || 0) + 1;
      urlCounts[event.request.url] = (urlCounts[event.request.url] || 0) + 1;
      
      const rule = this.rules.get(event.ruleId);
      if (rule) {
        if (!ruleCounts[event.ruleId]) {
          ruleCounts[event.ruleId] = { name: rule.name, count: 0 };
        }
        ruleCounts[event.ruleId].count++;
      }
    });

    const topBlockedIPs = Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    const topBlockedUrls = Object.entries(urlCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([url, count]) => ({ url, count }));

    const ruleEffectiveness = Object.entries(ruleCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([ruleId, data]) => ({
        ruleId,
        ruleName: data.name,
        triggers: data.count
      }));

    return {
      totalRequests,
      blockedRequests,
      blockRate: Math.round(blockRate * 100) / 100,
      topBlockedIPs,
      topBlockedUrls,
      ruleEffectiveness
    };
  }
}