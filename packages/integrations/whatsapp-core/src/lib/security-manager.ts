export interface SecurityConfig {
  rateLimitPerMinute: number;
  maxMessageLength: number;
  blockedWords: string[];
  allowedCommands: string[];
}

export class SecurityManager {
  private rateLimits = new Map<string, { count: number; resetTime: number }>();
  private config: SecurityConfig = {
    rateLimitPerMinute: 10,
    maxMessageLength: 1000,
    blockedWords: ['spam', 'abuse'],
    allowedCommands: ['help', 'status', 'info']
  };

  checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimits.set(userId, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (userLimit.count >= this.config.rateLimitPerMinute) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  validateMessage(text: string): { valid: boolean; reason?: string } {
    if (text.length > this.config.maxMessageLength) {
      return { valid: false, reason: 'Message too long' };
    }

    const lowerText = text.toLowerCase();
    for (const word of this.config.blockedWords) {
      if (lowerText.includes(word)) {
        return { valid: false, reason: 'Contains blocked content' };
      }
    }

    return { valid: true };
  }

  isCommandAllowed(command: string): boolean {
    return this.config.allowedCommands.includes(command.toLowerCase());
  }
}