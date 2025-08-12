import { Injectable } from '@nestjs/common';

export interface ConversationTurn {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  context?: any;
  intent?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ConversationSession {
  sessionId: string;
  userId: string;
  turns: ConversationTurn[];
  context: {
    topics: string[];
    preferences: Record<string, any>;
    lastActivity: Date;
  };
  metadata: {
    totalTurns: number;
    avgResponseTime: number;
    satisfaction?: number;
  };
}

@Injectable()
export class ConversationMemoryService {
  private sessions = new Map<string, ConversationSession>();
  private readonly MAX_TURNS_PER_SESSION = 50;
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  createSession(userId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.sessions.set(sessionId, {
      sessionId,
      userId,
      turns: [],
      context: {
        topics: [],
        preferences: {},
        lastActivity: new Date()
      },
      metadata: {
        totalTurns: 0,
        avgResponseTime: 0
      }
    });

    return sessionId;
  }

  addTurn(sessionId: string, userMessage: string, aiResponse: string, context?: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const turn: ConversationTurn = {
      id: `turn_${Date.now()}`,
      userMessage,
      aiResponse,
      timestamp: new Date(),
      context,
      intent: this.extractIntent(userMessage),
      sentiment: this.analyzeSentiment(userMessage)
    };

    session.turns.push(turn);
    session.context.lastActivity = new Date();
    session.metadata.totalTurns++;

    // Update topics
    const topics = this.extractTopics(userMessage);
    session.context.topics = [...new Set([...session.context.topics, ...topics])];

    // Keep only recent turns
    if (session.turns.length > this.MAX_TURNS_PER_SESSION) {
      session.turns = session.turns.slice(-this.MAX_TURNS_PER_SESSION);
    }

    this.sessions.set(sessionId, session);
  }

  getContext(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session || session.turns.length === 0) return '';

    const recentTurns = session.turns.slice(-5); // Last 5 turns
    const contextParts = [
      `المواضيع المناقشة: ${session.context.topics.join(', ')}`,
      'المحادثات السابقة:',
      ...recentTurns.map(turn => 
        `المستخدم: ${turn.userMessage}\nالمساعد: ${turn.aiResponse}`
      )
    ];

    return contextParts.join('\n');
  }

  getSession(sessionId: string): ConversationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  updatePreference(sessionId: string, key: string, value: any): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.context.preferences[key] = value;
      this.sessions.set(sessionId, session);
    }
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.context.lastActivity.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }

  private extractIntent(message: string): string {
    const intents = {
      'question': ['ما', 'كيف', 'متى', 'أين', 'لماذا', 'هل'],
      'request': ['أريد', 'أحتاج', 'ممكن', 'يرجى'],
      'complaint': ['مشكلة', 'خطأ', 'لا يعمل', 'فشل'],
      'compliment': ['شكرا', 'ممتاز', 'رائع', 'جيد']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  private analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['شكرا', 'ممتاز', 'رائع', 'جيد', 'أحب', 'سعيد'];
    const negativeWords = ['سيء', 'مشكلة', 'خطأ', 'لا أحب', 'صعب', 'فشل'];

    const positiveCount = positiveWords.filter(word => message.includes(word)).length;
    const negativeCount = negativeWords.filter(word => message.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractTopics(message: string): string[] {
    const topics = [];
    const topicKeywords = {
      'تقنية': ['برمجة', 'كمبيوتر', 'تطبيق', 'موقع', 'ذكاء اصطناعي'],
      'عمل': ['وظيفة', 'شركة', 'مشروع', 'عمل', 'مهنة'],
      'تعليم': ['دراسة', 'جامعة', 'كتاب', 'تعلم', 'دورة'],
      'صحة': ['طبيب', 'مرض', 'علاج', 'صحة', 'دواء']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  getStats(): any {
    return {
      totalSessions: this.sessions.size,
      activeSessions: Array.from(this.sessions.values()).filter(
        s => Date.now() - s.context.lastActivity.getTime() < 60 * 60 * 1000
      ).length,
      totalTurns: Array.from(this.sessions.values()).reduce(
        (sum, s) => sum + s.metadata.totalTurns, 0
      )
    };
  }
}