import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryService {
  private shortTermMemory = new Map<string, any>();
  private longTermMemory = new Map<string, any[]>();
  private contextMemory = new Map<string, any>();

  // Short-term memory for current session
  setShortTerm(key: string, value: any, ttl: number = 3600000): void {
    const expiresAt = Date.now() + ttl;
    this.shortTermMemory.set(key, { value, expiresAt });
  }

  getShortTerm(key: string): any {
    const item = this.shortTermMemory.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.shortTermMemory.delete(key);
      return null;
    }
    
    return item.value;
  }

  // Long-term memory for persistent storage
  addToLongTerm(sessionId: string, interaction: any): void {
    const history = this.longTermMemory.get(sessionId) || [];
    history.push({
      ...interaction,
      timestamp: new Date(),
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    // Keep only last 100 interactions per session
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.longTermMemory.set(sessionId, history);
  }

  getLongTermHistory(sessionId: string, limit: number = 10): any[] {
    const history = this.longTermMemory.get(sessionId) || [];
    return history.slice(-limit);
  }

  // Context memory for maintaining conversation context
  setContext(sessionId: string, context: any): void {
    this.contextMemory.set(sessionId, {
      ...context,
      lastUpdated: new Date()
    });
  }

  getContext(sessionId: string): any {
    return this.contextMemory.get(sessionId);
  }

  updateContext(sessionId: string, updates: any): void {
    const existing = this.getContext(sessionId) || {};
    this.setContext(sessionId, { ...existing, ...updates });
  }

  // Memory search and retrieval
  searchMemory(sessionId: string, query: string): any[] {
    const history = this.longTermMemory.get(sessionId) || [];
    const queryLower = query.toLowerCase();
    
    return history.filter(item => 
      (item.userInput && item.userInput.toLowerCase().includes(queryLower)) ||
      (item.aiResponse && item.aiResponse.toLowerCase().includes(queryLower)) ||
      (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(queryLower)))
    );
  }

  // Memory cleanup
  cleanupExpiredMemory(): void {
    const now = Date.now();
    
    // Clean short-term memory
    for (const [key, item] of this.shortTermMemory.entries()) {
      if (now > item.expiresAt) {
        this.shortTermMemory.delete(key);
      }
    }
    
    // Clean old context (older than 24 hours)
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    for (const [sessionId, context] of this.contextMemory.entries()) {
      if (context.lastUpdated < dayAgo) {
        this.contextMemory.delete(sessionId);
      }
    }
  }

  // Memory statistics
  getMemoryStats(): any {
    return {
      shortTermEntries: this.shortTermMemory.size,
      longTermSessions: this.longTermMemory.size,
      contextSessions: this.contextMemory.size,
      totalInteractions: Array.from(this.longTermMemory.values())
        .reduce((sum, history) => sum + history.length, 0)
    };
  }

  // Export/Import for persistence
  exportMemory(sessionId?: string): any {
    if (sessionId) {
      return {
        longTerm: this.longTermMemory.get(sessionId) || [],
        context: this.contextMemory.get(sessionId) || {}
      };
    }
    
    return {
      longTerm: Object.fromEntries(this.longTermMemory),
      context: Object.fromEntries(this.contextMemory)
    };
  }

  importMemory(data: any, sessionId?: string): void {
    if (sessionId) {
      if (data.longTerm) this.longTermMemory.set(sessionId, data.longTerm);
      if (data.context) this.contextMemory.set(sessionId, data.context);
    } else {
      if (data.longTerm) {
        for (const [id, history] of Object.entries(data.longTerm)) {
          this.longTermMemory.set(id, history as any[]);
        }
      }
      if (data.context) {
        for (const [id, context] of Object.entries(data.context)) {
          this.contextMemory.set(id, context);
        }
      }
    }
  }
}