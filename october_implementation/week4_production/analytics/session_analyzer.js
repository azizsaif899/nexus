/**
 * تحليل الجلسات المتقدم مع Embeddings
 */
class SessionAnalyzer {
    constructor() {
        this.sessionPatterns = new Map();
        this.embeddings = new Map();
    }

    analyzeSession(session) {
        const analysis = {
            sessionId: session.sessionId,
            duration: session.lastActivity - session.startTime,
            eventCount: session.events.length,
            language: session.language,
            userType: this.classifyUserType(session),
            intentPattern: this.extractIntentPattern(session),
            engagement: this.calculateEngagement(session)
        };

        this.sessionPatterns.set(session.sessionId, analysis);
        return analysis;
    }

    classifyUserType(session) {
        const events = session.events;
        const avgResponseTime = events.reduce((sum, e) => sum + (e.data.responseTime || 0), 0) / events.length;
        
        if (events.length > 10 && avgResponseTime < 100) return 'power_user';
        if (events.length > 5) return 'regular_user';
        return 'casual_user';
    }

    extractIntentPattern(session) {
        const intents = session.events
            .map(e => e.data.intent)
            .filter(Boolean);
        
        const intentCounts = {};
        intents.forEach(intent => {
            intentCounts[intent] = (intentCounts[intent] || 0) + 1;
        });

        return Object.entries(intentCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([intent, count]) => ({ intent, count }));
    }

    calculateEngagement(session) {
        const duration = session.lastActivity - session.startTime;
        const eventCount = session.events.length;
        
        if (duration === 0) return 0;
        
        const eventsPerMinute = (eventCount / duration) * 60000;
        
        if (eventsPerMinute > 5) return 'high';
        if (eventsPerMinute > 2) return 'medium';
        return 'low';
    }

    generateSessionReport() {
        const sessions = Array.from(this.sessionPatterns.values());
        
        return {
            totalSessions: sessions.length,
            userTypes: this.groupBy(sessions, 'userType'),
            languages: this.groupBy(sessions, 'language'),
            engagement: this.groupBy(sessions, 'engagement'),
            avgDuration: sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length,
            topIntents: this.getTopIntents(sessions)
        };
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = (groups[group] || 0) + 1;
            return groups;
        }, {});
    }

    getTopIntents(sessions) {
        const allIntents = {};
        sessions.forEach(session => {
            session.intentPattern.forEach(({ intent, count }) => {
                allIntents[intent] = (allIntents[intent] || 0) + count;
            });
        });

        return Object.entries(allIntents)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([intent, count]) => ({ intent, count }));
    }
}

module.exports = SessionAnalyzer;