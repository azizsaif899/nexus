/**
 * نظام إدارة السياق المتقدم للمحادثات
 */
class ContextManager {
    constructor(userId) {
        this.userId = userId;
        this.contexts = new Map();
        this.maxContextAge = 3600000; // ساعة واحدة
    }

    async getContext() {
        const key = `user:${this.userId}:context`;
        const context = this.contexts.get(key);
        
        if (!context) {
            return this.createNewContext();
        }

        if (Date.now() - context.lastUpdate > this.maxContextAge) {
            this.contexts.delete(key);
            return this.createNewContext();
        }

        return context;
    }

    async updateContext(newContext) {
        const key = `user:${this.userId}:context`;
        const current = await this.getContext();
        
        const merged = {
            ...current,
            ...newContext,
            lastUpdate: Date.now(),
            conversationHistory: [
                ...(current.conversationHistory || []),
                ...(newContext.conversationHistory || [])
            ].slice(-10)
        };

        this.contexts.set(key, merged);
        return merged;
    }

    createNewContext() {
        return {
            userId: this.userId,
            language: 'ar',
            intent: null,
            entities: {},
            conversationHistory: [],
            preferences: {},
            lastUpdate: Date.now(),
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    analyzeContext(message) {
        return {
            intent: this.detectIntent(message),
            entities: this.extractEntities(message),
            sentiment: this.analyzeSentiment(message),
            language: this.detectLanguage(message)
        };
    }

    detectIntent(message) {
        const intents = {
            greeting: /مرحبا|أهلا|السلام عليكم/i,
            question: /\?|كيف|ماذا|متى/i,
            request: /أريد|أحتاج|يمكن/i,
            thanks: /شكرا|مشكور/i
        };

        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(message)) return intent;
        }
        return 'general';
    }

    extractEntities(message) {
        const entities = {};
        const numbers = message.match(/\d+/g);
        if (numbers) entities.numbers = numbers.map(n => parseInt(n));
        return entities;
    }

    analyzeSentiment(message) {
        if (/ممتاز|رائع|جيد/i.test(message)) return 'positive';
        if (/سيء|مشكلة|خطأ/i.test(message)) return 'negative';
        return 'neutral';
    }

    detectLanguage(message) {
        if (/[\u0600-\u06FF]/.test(message)) return 'ar';
        if (/[a-zA-Z]/.test(message)) return 'en';
        return 'unknown';
    }
}

module.exports = ContextManager;