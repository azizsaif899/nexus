export interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  features: string[];
  actions: number;
}

export interface FeatureUsage {
  feature: string;
  users: Set<string>;
  totalUsage: number;
  avgSessionTime: number;
  popularTimes: number[];
}

export interface UsageReport {
  totalUsers: number;
  activeUsers: number;
  avgSessionDuration: number;
  topFeatures: Array<{ feature: string; usage: number }>;
  userRetention: number;
  peakHours: number[];
}

export class UsageTracker {
  private sessions = new Map<string, UserSession>();
  private featureUsage = new Map<string, FeatureUsage>();
  private dailyStats: Array<{ date: string; users: number; sessions: number }> = [];

  startSession(userId: string, sessionId: string): void {
    const session: UserSession = {
      userId,
      sessionId,
      startTime: new Date(),
      lastActivity: new Date(),
      features: [],
      actions: 0
    };
    
    this.sessions.set(sessionId, session);
    this.updateDailyStats();
  }

  trackFeatureUsage(sessionId: string, feature: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.lastActivity = new Date();
    session.actions++;
    
    if (!session.features.includes(feature)) {
      session.features.push(feature);
    }

    this.updateFeatureUsage(feature, session.userId);
  }

  private updateFeatureUsage(feature: string, userId: string): void {
    let usage = this.featureUsage.get(feature);
    if (!usage) {
      usage = {
        feature,
        users: new Set(),
        totalUsage: 0,
        avgSessionTime: 0,
        popularTimes: new Array(24).fill(0)
      };
      this.featureUsage.set(feature, usage);
    }

    usage.users.add(userId);
    usage.totalUsage++;
    usage.popularTimes[new Date().getHours()]++;
  }

  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const duration = session.lastActivity.getTime() - session.startTime.getTime();
    
    // Update feature session times
    session.features.forEach(feature => {
      const usage = this.featureUsage.get(feature);
      if (usage) {
        const currentAvg = usage.avgSessionTime;
        const userCount = usage.users.size;
        usage.avgSessionTime = (currentAvg * (userCount - 1) + duration) / userCount;
      }
    });

    this.sessions.delete(sessionId);
  }

  private updateDailyStats(): void {
    const today = new Date().toDateString();
    let todayStats = this.dailyStats.find(s => s.date === today);
    
    if (!todayStats) {
      todayStats = { date: today, users: 0, sessions: 0 };
      this.dailyStats.push(todayStats);
    }

    const uniqueUsers = new Set(Array.from(this.sessions.values()).map(s => s.userId));
    todayStats.users = uniqueUsers.size;
    todayStats.sessions = this.sessions.size;

    // Keep only last 30 days
    if (this.dailyStats.length > 30) {
      this.dailyStats.shift();
    }
  }

  generateUsageReport(): UsageReport {
    const activeSessions = Array.from(this.sessions.values());
    const activeUsers = new Set(activeSessions.map(s => s.userId)).size;
    
    const sessionDurations = activeSessions.map(s => 
      s.lastActivity.getTime() - s.startTime.getTime()
    );
    const avgSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, d) => sum + d, 0) / sessionDurations.length 
      : 0;

    const topFeatures = Array.from(this.featureUsage.entries())
      .sort((a, b) => b[1].totalUsage - a[1].totalUsage)
      .slice(0, 10)
      .map(([feature, usage]) => ({ feature, usage: usage.totalUsage }));

    const peakHours = this.calculatePeakHours();
    const userRetention = this.calculateRetention();

    return {
      totalUsers: this.getTotalUsers(),
      activeUsers,
      avgSessionDuration: avgSessionDuration / (1000 * 60), // Convert to minutes
      topFeatures,
      userRetention,
      peakHours
    };
  }

  private calculatePeakHours(): number[] {
    const hourlyUsage = new Array(24).fill(0);
    
    this.featureUsage.forEach(usage => {
      usage.popularTimes.forEach((count, hour) => {
        hourlyUsage[hour] += count;
      });
    });

    return hourlyUsage
      .map((usage, hour) => ({ hour, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 3)
      .map(item => item.hour);
  }

  private calculateRetention(): number {
    if (this.dailyStats.length < 7) return 0;
    
    const lastWeek = this.dailyStats.slice(-7);
    const thisWeek = this.dailyStats.slice(-14, -7);
    
    if (thisWeek.length === 0) return 0;
    
    const lastWeekUsers = lastWeek.reduce((sum, day) => sum + day.users, 0) / 7;
    const thisWeekUsers = thisWeek.reduce((sum, day) => sum + day.users, 0) / 7;
    
    return thisWeekUsers > 0 ? (lastWeekUsers / thisWeekUsers) * 100 : 0;
  }

  private getTotalUsers(): number {
    const allUsers = new Set<string>();
    this.sessions.forEach(session => allUsers.add(session.userId));
    this.featureUsage.forEach(usage => {
      usage.users.forEach(user => allUsers.add(user));
    });
    return allUsers.size;
  }

  getFeatureUsage(): FeatureUsage[] {
    return Array.from(this.featureUsage.values());
  }
}