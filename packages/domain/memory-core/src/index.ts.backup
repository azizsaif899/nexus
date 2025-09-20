export * from './memory-service';

// Smart Memory System Enhanced
export class SmartMemory {
  private conversations: Map<string, any[]> = new Map();
  private contexts: Map<string, any> = new Map();

  constructor() {
    // Removed console.log
  }

  saveConversation(userId: string, message: any): void {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    this.conversations.get(userId)!.push({
      ...message,
      timestamp: new Date()
    });
  }

  getConversationHistory(userId: string): any[] {
    return this.conversations.get(userId) || [];
  }

  saveContext(userId: string, context: any): void {
    this.contexts.set(userId, { ...context, lastUpdated: new Date() });
  }

  getContext(userId: string): any {
    return this.contexts.get(userId) || {};
  }

  getStats(): { conversations: number; contexts: number } {
    return {
      conversations: this.conversations.size,
      contexts: this.contexts.size
    };
  }
}