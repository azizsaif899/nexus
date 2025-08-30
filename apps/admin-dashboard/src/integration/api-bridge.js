/**
 * AzizSys Ultimate API Bridge
 * جسر التكامل مع جميع خدمات النظام
 */

class UltimateAPIBridge {
    constructor() {
        this.baseUrls = {
            gateway: 'http://localhost:3000',
            api: 'http://localhost:3333',
            gemini: 'http://localhost:8000',
            admin: 'http://localhost:4200'
        };
        
        this.services = new Map();
        this.healthStatus = new Map();
        this.lastHealthCheck = null;
        
        this.init();
    }

    async init() {
        console.log('🔗 API Bridge initializing...');
        await this.discoverServices();
        this.startHealthMonitoring();
        console.log('✅ API Bridge ready');
    }

    // اكتشاف الخدمات المتاحة
    async discoverServices() {
        for (const [name, url] of Object.entries(this.baseUrls)) {
            try {
                const response = await fetch(`${url}/health`, { 
                    method: 'GET',
                    timeout: 5000 
                });
                
                if (response.ok) {
                    this.services.set(name, {
                        name: name,
                        url: url,
                        status: 'healthy',
                        lastCheck: new Date().toISOString()
                    });
                    console.log(`✅ Service discovered: ${name} at ${url}`);
                } else {
                    throw new Error(`Service unhealthy: ${response.status}`);
                }
            } catch (error) {
                this.services.set(name, {
                    name: name,
                    url: url,
                    status: 'unhealthy',
                    error: error.message,
                    lastCheck: new Date().toISOString()
                });
                console.log(`❌ Service unavailable: ${name} - ${error.message}`);
            }
        }
    }

    // بدء مراقبة صحة الخدمات
    startHealthMonitoring() {
        setInterval(async () => {
            await this.performHealthCheck();
        }, 30000); // كل 30 ثانية
    }

    // فحص صحة شامل
    async performHealthCheck() {
        const results = [];
        
        for (const [name, service] of this.services) {
            try {
                const startTime = Date.now();
                const response = await fetch(`${service.url}/health`, {
                    method: 'GET',
                    timeout: 5000
                });
                
                const responseTime = Date.now() - startTime;
                
                if (response.ok) {
                    const healthData = await response.json();
                    
                    this.healthStatus.set(name, {
                        status: 'healthy',
                        responseTime: responseTime,
                        data: healthData,
                        lastCheck: new Date().toISOString()
                    });
                    
                    results.push({
                        service: name,
                        status: 'healthy',
                        responseTime: responseTime,
                        url: service.url
                    });
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                this.healthStatus.set(name, {
                    status: 'unhealthy',
                    error: error.message,
                    lastCheck: new Date().toISOString()
                });
                
                results.push({
                    service: name,
                    status: 'unhealthy',
                    error: error.message,
                    url: service.url
                });
            }
        }
        
        this.lastHealthCheck = new Date().toISOString();
        
        // إرسال نتائج الفحص إلى EventBus
        if (window.eventBus) {
            window.eventBus.emit('health:check:complete', {
                results: results,
                timestamp: this.lastHealthCheck
            });
        }
        
        return results;
    }

    // استعلام Gemini AI
    async queryGemini(message, options = {}) {
        try {
            const response = await fetch(`${this.baseUrls.gemini}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    options: options
                })
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: data,
                    timestamp: new Date().toISOString()
                };
            } else {
                throw new Error(`Gemini API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Gemini query failed:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // تفعيل وكيل ذكي
    async activateAgent(agentId) {
        try {
            const response = await fetch(`${this.baseUrls.api}/api/agents/${agentId}/activate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (window.eventBus) {
                    window.eventBus.emit('agent:activated', {
                        agentId: agentId,
                        data: data,
                        timestamp: new Date().toISOString()
                    });
                }
                
                return {
                    success: true,
                    agent: agentId,
                    data: data
                };
            } else {
                throw new Error(`Agent activation failed: ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to activate agent ${agentId}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على التقارير الحقيقية
    async getRealReports() {
        try {
            const response = await fetch(`${this.baseUrls.api}/api/reports/dashboard`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: data,
                    timestamp: new Date().toISOString()
                };
            } else {
                throw new Error(`Reports API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to get real reports:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // تشغيل سكربت
    async runScript(scriptName, parameters = {}) {
        try {
            const response = await fetch(`${this.baseUrls.api}/api/scripts/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    script: scriptName,
                    parameters: parameters
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                if (window.eventBus) {
                    window.eventBus.emit('script:executed', {
                        script: scriptName,
                        parameters: parameters,
                        result: data,
                        timestamp: new Date().toISOString()
                    });
                }
                
                return {
                    success: true,
                    script: scriptName,
                    result: data
                };
            } else {
                throw new Error(`Script execution failed: ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to run script ${scriptName}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // إعادة تشغيل خدمة
    async restartService(serviceName) {
        try {
            const response = await fetch(`${this.baseUrls.api}/api/services/${serviceName}/restart`, {
                method: 'POST'
            });

            if (response.ok) {
                const data = await response.json();
                
                if (window.eventBus) {
                    window.eventBus.emit('service:restarted', {
                        service: serviceName,
                        result: data,
                        timestamp: new Date().toISOString()
                    });
                }
                
                return {
                    success: true,
                    service: serviceName,
                    result: data
                };
            } else {
                throw new Error(`Service restart failed: ${response.status}`);
            }
        } catch (error) {
            console.error(`Failed to restart service ${serviceName}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على مقاييس الأداء
    async getPerformanceMetrics() {
        try {
            const response = await fetch(`${this.baseUrls.api}/api/metrics/performance`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    metrics: data,
                    timestamp: new Date().toISOString()
                };
            } else {
                throw new Error(`Metrics API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to get performance metrics:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // إرسال حدث إلى EventBus الخلفي
    async emitToBackend(eventType, data) {
        try {
            const response = await fetch(`${this.baseUrls.api}/api/eventbus/emit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: eventType,
                    data: data
                })
            });

            if (response.ok) {
                const result = await response.json();
                return {
                    success: true,
                    eventId: result.eventId,
                    timestamp: new Date().toISOString()
                };
            } else {
                throw new Error(`EventBus emit failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to emit to backend EventBus:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // الحصول على حالة الخدمات
    getServicesStatus() {
        const status = {};
        for (const [name, health] of this.healthStatus) {
            status[name] = health;
        }
        return status;
    }

    // الحصول على إحصائيات API Bridge
    getStats() {
        return {
            discoveredServices: this.services.size,
            healthyServices: Array.from(this.healthStatus.values()).filter(h => h.status === 'healthy').length,
            lastHealthCheck: this.lastHealthCheck,
            services: Object.fromEntries(this.services),
            healthStatus: Object.fromEntries(this.healthStatus)
        };
    }

    // تصدير البيانات
    exportData() {
        const exportData = {
            services: Object.fromEntries(this.services),
            healthStatus: Object.fromEntries(this.healthStatus),
            stats: this.getStats(),
            exportTime: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api_bridge_export_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// إنشاء مثيل API Bridge العام
const APIBridge = new UltimateAPIBridge();

// تصدير للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UltimateAPIBridge, APIBridge };
}

// إضافة إلى النافذة العامة
if (typeof window !== 'undefined') {
    window.APIBridge = APIBridge;
    window.UltimateAPIBridge = UltimateAPIBridge;
}

console.log('🔗 API Bridge Ultimate System loaded and ready!');