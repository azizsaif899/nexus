
/**
 * @file Telemetry.js
 * @description نظام مقاييس محسن مع سياق البيئة
 */

class Telemetry {
  constructor() {
    this.environmentContext = this.detectEnvironment();
    this.events = [];
  }

  detectEnvironment() {
    if (typeof SpreadsheetApp !== 'undefined') {
      return 'google_apps_script';
    } else if (typeof process !== 'undefined') {
      return 'nodejs';
    } else if (typeof window !== 'undefined') {
      return 'browser';
    }
    return 'unknown';
  }

  track(event, data = {}) {
    const eventData = {
      event,
      data,
      timestamp: new Date().toISOString(),
      environment: this.environmentContext,
      sessionId: this.getSessionId()
    };

    this.events.push(eventData);
    this.persistEvent(eventData);
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return this.sessionId;
  }

  persistEvent(eventData) {
    try {
      if (this.environmentContext === 'google_apps_script') {
        // حفظ في PropertiesService
        const key = 'telemetry_' + Date.now();
        PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(eventData));
      } else {
        // حفظ في ملف محلي
        console.log('📊 Telemetry:', JSON.stringify(eventData, null, 2));
      }
    } catch (error) {
      console.error('فشل حفظ بيانات المقاييس:', error);
    }
  }

  getReport() {
    return {
      environment: this.environmentContext,
      totalEvents: this.events.length,
      events: this.events.slice(-10), // آخر 10 أحداث
      summary: this.generateSummary()
    };
  }

  generateSummary() {
    const eventTypes = {};
    this.events.forEach(event => {
      eventTypes[event.event] = (eventTypes[event.event] || 0) + 1;
    });
    return eventTypes;
  }
}

export default Telemetry;
