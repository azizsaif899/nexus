/**
 * نظام تحليلات الأعمال المتقدم
 */
class BusinessAnalytics {
    constructor() {
        this.metrics = new Map();
        this.sessions = new Map();
        this.startTime = Date.now();
    }

    // تسجيل حدث جديد
    trackEvent(eventType, data) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            data: data,
            sessionId: data.sessionId || 'unknown'
        };

        // إضافة الحدث للمؤشرات
        if (!this.metrics.has(eventType)) {
            this.metrics.set(eventType, []);
        }
        this.metrics.get(eventType).push(event);

        // تحديث إحصائيات الجلسة
        this.updateSessionStats(event);

        console.log(`📊 Event tracked: ${eventType}`, data);
    }

    // تحديث إحصائيات الجلسة
    updateSessionStats(event) {
        const sessionId = event.sessionId;
        
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {
                sessionId: sessionId,
                startTime: event.timestamp,
                lastActivity: event.timestamp,
                events: [],
                language: event.data.language || 'unknown',
                userId: event.data.userId || 'anonymous'
            });
        }

        const session = this.sessions.get(sessionId);
        session.lastActivity = event.timestamp;
        session.events.push(event);
    }

    // الحصول على المؤشرات الأساسية
    getBasicMetrics() {
        const now = Date.now();
        const uptime = now - this.startTime;
        
        return {
            uptime: Math.floor(uptime / 1000), // بالثواني
            totalSessions: this.sessions.size,
            activeSessions: this.getActiveSessions().length,
            totalEvents: this.getTotalEvents(),
            eventsPerMinute: this.getEventsPerMinute(),
            topLanguages: this.getTopLanguages(),
            responseTime: this.getAverageResponseTime()
        };
    }

    // الحصول على الجلسات النشطة (آخر 30 دقيقة)
    getActiveSessions() {
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
        return Array.from(this.sessions.values()).filter(
            session => session.lastActivity > thirtyMinutesAgo
        );
    }

    // إجمالي الأحداث
    getTotalEvents() {
        let total = 0;
        for (const events of this.metrics.values()) {
            total += events.length;
        }
        return total;
    }

    // الأحداث في الدقيقة
    getEventsPerMinute() {
        const oneMinuteAgo = Date.now() - (60 * 1000);
        let recentEvents = 0;
        
        for (const events of this.metrics.values()) {
            recentEvents += events.filter(event => event.timestamp > oneMinuteAgo).length;
        }
        
        return recentEvents;
    }

    // أكثر اللغات استخداماً
    getTopLanguages() {
        const languageCount = new Map();
        
        for (const session of this.sessions.values()) {
            const lang = session.language;
            languageCount.set(lang, (languageCount.get(lang) || 0) + 1);
        }
        
        return Array.from(languageCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([language, count]) => ({ language, count }));
    }

    // متوسط زمن الاستجابة
    getAverageResponseTime() {
        const responseEvents = this.metrics.get('response') || [];
        if (responseEvents.length === 0) return 0;
        
        const totalTime = responseEvents.reduce((sum, event) => {
            return sum + (event.data.responseTime || 0);
        }, 0);
        
        return Math.round(totalTime / responseEvents.length);
    }

    // تحليلات مفصلة للفترة المحددة
    getDetailedAnalytics(period = 'hour') {
        const periodMs = this.getPeriodInMs(period);
        const cutoffTime = Date.now() - periodMs;
        
        const filteredEvents = new Map();
        for (const [eventType, events] of this.metrics.entries()) {
            const recentEvents = events.filter(event => event.timestamp > cutoffTime);
            if (recentEvents.length > 0) {
                filteredEvents.set(eventType, recentEvents);
            }
        }

        return {
            period: period,
            timeRange: {
                from: new Date(cutoffTime).toISOString(),
                to: new Date().toISOString()
            },
            summary: {
                totalEvents: this.getTotalEventsInPeriod(filteredEvents),
                uniqueSessions: this.getUniqueSessionsInPeriod(filteredEvents),
                averageSessionDuration: this.getAverageSessionDuration(cutoffTime),
                errorRate: this.getErrorRate(filteredEvents)
            },
            eventBreakdown: this.getEventBreakdown(filteredEvents),
            languageDistribution: this.getLanguageDistribution(cutoffTime),
            performanceMetrics: this.getPerformanceMetrics(filteredEvents)
        };
    }

    getPeriodInMs(period) {
        const periods = {
            'minute': 60 * 1000,
            'hour': 60 * 60 * 1000,
            'day': 24 * 60 * 60 * 1000,
            'week': 7 * 24 * 60 * 60 * 1000
        };
        return periods[period] || periods['hour'];
    }

    getTotalEventsInPeriod(filteredEvents) {
        let total = 0;
        for (const events of filteredEvents.values()) {
            total += events.length;
        }
        return total;
    }

    getUniqueSessionsInPeriod(filteredEvents) {
        const sessionIds = new Set();
        for (const events of filteredEvents.values()) {
            events.forEach(event => sessionIds.add(event.sessionId));
        }
        return sessionIds.size;
    }

    getAverageSessionDuration(cutoffTime) {
        const recentSessions = Array.from(this.sessions.values())
            .filter(session => session.lastActivity > cutoffTime);
        
        if (recentSessions.length === 0) return 0;
        
        const totalDuration = recentSessions.reduce((sum, session) => {
            return sum + (session.lastActivity - session.startTime);
        }, 0);
        
        return Math.round(totalDuration / recentSessions.length / 1000); // بالثواني
    }

    getErrorRate(filteredEvents) {
        const errorEvents = filteredEvents.get('error') || [];
        const totalEvents = this.getTotalEventsInPeriod(filteredEvents);
        
        return totalEvents > 0 ? (errorEvents.length / totalEvents * 100).toFixed(2) : 0;
    }

    getEventBreakdown(filteredEvents) {
        const breakdown = {};
        for (const [eventType, events] of filteredEvents.entries()) {
            breakdown[eventType] = events.length;
        }
        return breakdown;
    }

    getLanguageDistribution(cutoffTime) {
        const recentSessions = Array.from(this.sessions.values())
            .filter(session => session.lastActivity > cutoffTime);
        
        const distribution = {};
        recentSessions.forEach(session => {
            const lang = session.language;
            distribution[lang] = (distribution[lang] || 0) + 1;
        });
        
        return distribution;
    }

    getPerformanceMetrics(filteredEvents) {
        const responseEvents = filteredEvents.get('response') || [];
        const processingEvents = filteredEvents.get('processing') || [];
        
        return {
            averageResponseTime: this.calculateAverage(responseEvents, 'responseTime'),
            averageProcessingTime: this.calculateAverage(processingEvents, 'processingTime'),
            throughput: responseEvents.length,
            successRate: this.calculateSuccessRate(filteredEvents)
        };
    }

    calculateAverage(events, field) {
        if (events.length === 0) return 0;
        const total = events.reduce((sum, event) => sum + (event.data[field] || 0), 0);
        return Math.round(total / events.length);
    }

    calculateSuccessRate(filteredEvents) {
        const successEvents = filteredEvents.get('success') || [];
        const errorEvents = filteredEvents.get('error') || [];
        const total = successEvents.length + errorEvents.length;
        
        return total > 0 ? ((successEvents.length / total) * 100).toFixed(2) : 100;
    }

    // تصدير البيانات للتحليل الخارجي
    exportData(format = 'json') {
        const data = {
            exportTime: new Date().toISOString(),
            metrics: Object.fromEntries(this.metrics),
            sessions: Array.from(this.sessions.values()),
            summary: this.getBasicMetrics()
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }
        
        return data;
    }

    // مسح البيانات القديمة (تنظيف الذاكرة)
    cleanup(maxAge = 24 * 60 * 60 * 1000) { // 24 ساعة افتراضياً
        const cutoffTime = Date.now() - maxAge;
        
        // تنظيف الأحداث القديمة
        for (const [eventType, events] of this.metrics.entries()) {
            const recentEvents = events.filter(event => event.timestamp > cutoffTime);
            this.metrics.set(eventType, recentEvents);
        }
        
        // تنظيف الجلسات القديمة
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.lastActivity < cutoffTime) {
                this.sessions.delete(sessionId);
            }
        }
        
        console.log('🧹 تم تنظيف البيانات القديمة');
    }
}

module.exports = BusinessAnalytics;