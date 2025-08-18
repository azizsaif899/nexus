"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityManager = void 0;
class SecurityManager {
    constructor() {
        this.rateLimits = new Map();
        this.config = {
            rateLimitPerMinute: 10,
            maxMessageLength: 1000,
            blockedWords: ['spam', 'abuse'],
            allowedCommands: ['help', 'status', 'info']
        };
    }
    checkRateLimit(userId) {
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
    validateMessage(text) {
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
    isCommandAllowed(command) {
        return this.config.allowedCommands.includes(command.toLowerCase());
    }
}
exports.SecurityManager = SecurityManager;
//# sourceMappingURL=security-manager.js.map