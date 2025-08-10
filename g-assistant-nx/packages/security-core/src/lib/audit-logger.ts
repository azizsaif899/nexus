export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface SuspiciousActivity {
  id: string;
  userId?: string;
  ipAddress: string;
  activityType: 'multiple_failed_logins' | 'unusual_access_pattern' | 'privilege_escalation' | 'data_exfiltration';
  riskScore: number;
  timestamp: Date;
  evidence: AuditEvent[];
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
}

export class AuditLogger {
  private events: AuditEvent[] = [];
  private suspiciousActivities: SuspiciousActivity[] = [];
  private maxEvents = 50000;

  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    };

    this.events.push(auditEvent);
    
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Analyze for suspicious activity
    this.analyzeSuspiciousActivity(auditEvent);

    // Log critical events immediately
    if (auditEvent.severity === 'critical') {
      console.error('🚨 CRITICAL AUDIT EVENT:', auditEvent);
    }

    return auditEvent;
  }

  private analyzeSuspiciousActivity(event: AuditEvent): void {
    // Check for multiple failed logins
    if (event.action === 'login' && event.outcome === 'failure') {
      this.checkMultipleFailedLogins(event);
    }

    // Check for unusual access patterns
    if (event.action.includes('access') || event.action.includes('view')) {
      this.checkUnusualAccessPattern(event);
    }

    // Check for privilege escalation
    if (event.action.includes('permission') || event.action.includes('role')) {
      this.checkPrivilegeEscalation(event);
    }
  }

  private checkMultipleFailedLogins(event: AuditEvent): void {
    const timeWindow = 15 * 60 * 1000; // 15 minutes
    const threshold = 5;
    const now = new Date();

    const recentFailedLogins = this.events.filter(e => 
      e.action === 'login' &&
      e.outcome === 'failure' &&
      e.ipAddress === event.ipAddress &&
      (now.getTime() - e.timestamp.getTime()) <= timeWindow
    );

    if (recentFailedLogins.length >= threshold) {
      this.createSuspiciousActivity({
        userId: event.userId,
        ipAddress: event.ipAddress!,
        activityType: 'multiple_failed_logins',
        riskScore: Math.min(recentFailedLogins.length * 10, 100),
        evidence: recentFailedLogins,
        status: 'detected'
      });
    }
  }

  private checkUnusualAccessPattern(event: AuditEvent): void {
    if (!event.userId) return;

    const timeWindow = 24 * 60 * 60 * 1000; // 24 hours
    const now = new Date();

    const userEvents = this.events.filter(e => 
      e.userId === event.userId &&
      (now.getTime() - e.timestamp.getTime()) <= timeWindow
    );

    // Check for unusual time access
    const hour = event.timestamp.getHours();
    const isUnusualTime = hour < 6 || hour > 22; // Outside business hours

    // Check for unusual resource access
    const resourceAccess = userEvents.filter(e => e.resource === event.resource);
    const isUnusualResource = resourceAccess.length === 1; // First time accessing this resource

    if (isUnusualTime && isUnusualResource) {
      this.createSuspiciousActivity({
        userId: event.userId,
        ipAddress: event.ipAddress!,
        activityType: 'unusual_access_pattern',
        riskScore: 60,
        evidence: [event],
        status: 'detected'
      });
    }
  }

  private checkPrivilegeEscalation(event: AuditEvent): void {
    if (event.action.includes('permission') && event.outcome === 'success') {
      this.createSuspiciousActivity({
        userId: event.userId,
        ipAddress: event.ipAddress!,
        activityType: 'privilege_escalation',
        riskScore: 80,
        evidence: [event],
        status: 'detected'
      });
    }
  }

  private createSuspiciousActivity(activity: Omit<SuspiciousActivity, 'id' | 'timestamp'>): void {
    // Check if similar activity already exists
    const existing = this.suspiciousActivities.find(sa => 
      sa.userId === activity.userId &&
      sa.ipAddress === activity.ipAddress &&
      sa.activityType === activity.activityType &&
      sa.status === 'detected'
    );

    if (existing) {
      existing.riskScore = Math.min(existing.riskScore + 10, 100);
      existing.evidence.push(...activity.evidence);
      return;
    }

    const suspiciousActivity: SuspiciousActivity = {
      id: `suspicious_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...activity
    };

    this.suspiciousActivities.push(suspiciousActivity);
    
    console.warn('⚠️ SUSPICIOUS ACTIVITY DETECTED:', suspiciousActivity);
  }

  getEvents(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    outcome?: 'success' | 'failure' | 'unknown';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    since?: Date;
    until?: Date;
  }, limit = 1000): AuditEvent[] {
    let filtered = this.events;

    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter(e => e.userId === filters.userId);
      }
      if (filters.action) {
        filtered = filtered.filter(e => e.action.includes(filters.action!));
      }
      if (filters.resource) {
        filtered = filtered.filter(e => e.resource.includes(filters.resource!));
      }
      if (filters.outcome) {
        filtered = filtered.filter(e => e.outcome === filters.outcome);
      }
      if (filters.severity) {
        filtered = filtered.filter(e => e.severity === filters.severity);
      }
      if (filters.since) {
        filtered = filtered.filter(e => e.timestamp >= filters.since!);
      }
      if (filters.until) {
        filtered = filtered.filter(e => e.timestamp <= filters.until!);
      }
    }

    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getSuspiciousActivities(status?: SuspiciousActivity['status']): SuspiciousActivity[] {
    let filtered = this.suspiciousActivities;
    
    if (status) {
      filtered = filtered.filter(sa => sa.status === status);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  updateSuspiciousActivityStatus(id: string, status: SuspiciousActivity['status']): boolean {
    const activity = this.suspiciousActivities.find(sa => sa.id === id);
    if (activity) {
      activity.status = status;
      return true;
    }
    return false;
  }

  generateAuditReport(period: 'daily' | 'weekly' | 'monthly' = 'daily'): {
    period: string;
    totalEvents: number;
    eventsByAction: Record<string, number>;
    eventsByOutcome: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    suspiciousActivities: number;
    topUsers: Array<{ userId: string; eventCount: number }>;
    topResources: Array<{ resource: string; accessCount: number }>;
  } {
    const now = new Date();
    let since: Date;

    switch (period) {
      case 'daily':
        since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const periodEvents = this.events.filter(e => e.timestamp >= since);

    const eventsByAction: Record<string, number> = {};
    const eventsByOutcome: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const userEventCounts: Record<string, number> = {};
    const resourceAccessCounts: Record<string, number> = {};

    periodEvents.forEach(event => {
      eventsByAction[event.action] = (eventsByAction[event.action] || 0) + 1;
      eventsByOutcome[event.outcome] = (eventsByOutcome[event.outcome] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      if (event.userId) {
        userEventCounts[event.userId] = (userEventCounts[event.userId] || 0) + 1;
      }
      
      resourceAccessCounts[event.resource] = (resourceAccessCounts[event.resource] || 0) + 1;
    });

    const topUsers = Object.entries(userEventCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, eventCount]) => ({ userId, eventCount }));

    const topResources = Object.entries(resourceAccessCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([resource, accessCount]) => ({ resource, accessCount }));

    const suspiciousActivitiesCount = this.suspiciousActivities.filter(sa => 
      sa.timestamp >= since
    ).length;

    return {
      period,
      totalEvents: periodEvents.length,
      eventsByAction,
      eventsByOutcome,
      eventsBySeverity,
      suspiciousActivities: suspiciousActivitiesCount,
      topUsers,
      topResources
    };
  }
}