export interface LiveSession {
  id: string;
  userId: string;
  status: 'active' | 'paused' | 'ended';
  createdAt: Date;
  data: any;
}

export class SessionManager {
  private sessions = new Map<string, LiveSession>();

  createSession(userId: string): LiveSession {
    const session: LiveSession = {
      id: `session_${Date.now()}`,
      userId,
      status: 'active',
      createdAt: new Date(),
      data: {}
    };

    this.sessions.set(session.id, session);
    // Removed console.log
    
    return session;
  }

  getSession(sessionId: string): LiveSession | null {
    return this.sessions.get(sessionId) || null;
  }

  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      // Removed console.log
    }
  }

  getActiveSessions(): LiveSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }
}