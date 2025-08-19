// API Bridge للربط الحقيقي مع النظام
class APIBridge {
  constructor() {
    this.baseURL = 'http://localhost:3333';
    this.healthURL = 'http://localhost:3000';
  }

  // فحص صحة حقيقي
  async realHealthCheck() {
    const services = [
      { name: 'API Server', url: `${this.baseURL}/health` },
      { name: 'Web Chatbot', url: `${this.healthURL}/health` },
      { name: 'Admin Dashboard', url: `${window.location.origin}/health` }
    ];

    const results = [];
    for (const service of services) {
      try {
        const response = await fetch(service.url, { timeout: 5000 });
        results.push({
          name: service.name,
          status: response.ok ? 'healthy' : 'unhealthy',
          code: response.status
        });
      } catch (error) {
        results.push({
          name: service.name,
          status: 'offline',
          error: error.message
        });
      }
    }
    return results;
  }

  // قراءة تقارير حقيقية
  async getRealReports() {
    try {
      const response = await fetch('../docs/6_fixing/reports/central_dashboard.json');
      return await response.json();
    } catch (error) {
      return { error: 'Reports not available' };
    }
  }

  // تشغيل وكيل الرقيب
  async runRealCompliance() {
    try {
      const response = await fetch(`${this.baseURL}/api/compliance/run`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return { error: 'Compliance agent offline' };
    }
  }

  // تفعيل الوكلاء الذكيين
  async activateAgent(agentName) {
    try {
      const response = await fetch(`${this.baseURL}/api/sidebar/agents/${agentName}/activate`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      return { error: `Failed to activate ${agentName}` };
    }
  }

  // استعلام Gemini حقيقي
  async queryGemini(prompt) {
    try {
      const response = await fetch(`${this.baseURL}/api/research/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt })
      });
      return await response.json();
    } catch (error) {
      return { error: 'Gemini service offline' };
    }
  }
}

// تصدير للاستخدام العام
window.APIBridge = new APIBridge();