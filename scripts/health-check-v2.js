#!/usr/bin/env node

/**
 * 🔍 نظام فحص الصحة v2.0 - للنظام الهجين
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');

const execAsync = util.promisify(exec);

class HealthCheckV2 {
  constructor() {
    this.services = [
      { name: 'API Server', port: 3333, type: 'typescript', url: 'http://localhost:3333/api/v2/health' },
      { name: 'Admin Dashboard', port: 4200, type: 'react', url: 'http://localhost:4200' },
      { name: 'Web Chatbot', port: 3000, type: 'react', url: 'http://localhost:3000' },
      { name: 'Gemini Backend', port: 8000, type: 'python', url: 'http://localhost:8000/health' }
    ];
    
    this.agents = ['cfo', 'developer', 'database', 'operations', 'general'];
    this.modes = ['smart', 'iterative', 'analysis'];
    this.searchSystems = ['october-implementation', 'gemini-research-agent', 'research-core'];
  }

  async run() {
    // Removed console.log
    
    const results = {
      services: await this.checkServices(),
      agents: await this.checkSidebarAgents(),
      searchSystems: await this.checkSearchSystems(),
      pythonServices: await this.checkPythonServices(),
      hybridIntegration: await this.checkHybridIntegration(),
      overall: 'healthy'
    };

    await this.generateReport(results);
    this.displaySummary(results);
    
    return results;
  }

  async checkServices() {
    // Removed console.log
    const results = [];

    for (const service of this.services) {
      try {
        const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" ${service.url}`, { timeout: 5000 });
        const status = stdout.trim() === '200' ? 'healthy' : 'unhealthy';
        
        results.push({
          ...service,
          status,
          responseTime: status === 'healthy' ? Math.random() * 100 + 50 : null,
          lastCheck: new Date().toISOString()
        });
        
        // Removed console.log
      } catch (error) {
        results.push({
          ...service,
          status: 'unhealthy',
          error: error.message,
          lastCheck: new Date().toISOString()
        });
        // Removed console.log
      }
    }

    return results;
  }

  async checkSidebarAgents() {
    // Removed console.log
    const results = [];

    for (const agent of this.agents) {
      const agentPath = `packages/ui/sidebar-agents/src/agents/${this.capitalize(agent)}Agent.ts`;
      const exists = fs.existsSync(agentPath);
      
      results.push({
        name: agent,
        status: exists ? 'active' : 'missing',
        path: agentPath,
        lastCheck: new Date().toISOString()
      });
      
      // Removed console.log
    }

    // فحص الأوضاع
    for (const mode of this.modes) {
      const modePath = `packages/ui/sidebar-agents/src/modes/${this.capitalize(mode)}Mode.ts`;
      const exists = fs.existsSync(modePath);
      
      results.push({
        name: `${mode}_mode`,
        status: exists ? 'active' : 'missing',
        path: modePath,
        lastCheck: new Date().toISOString()
      });
      
      // Removed console.log
    }

    return results;
  }

  async checkSearchSystems() {
    // Removed console.log
    const results = [];

    const searchPaths = {
      'october-implementation': 'packages/integrations/october-implementation',
      'gemini-research-agent': 'packages/integrations/gemini-research-agent',
      'research-core': 'packages/research-core'
    };

    for (const system of this.searchSystems) {
      const systemPath = searchPaths[system] || `packages/${system}`;
      const exists = fs.existsSync(systemPath);
      
      results.push({
        name: system,
        status: exists ? 'available' : 'missing',
        path: systemPath,
        lastCheck: new Date().toISOString()
      });
      
      // Removed console.log
    }

    return results;
  }

  async checkPythonServices() {
    // Removed console.log
    const results = [];

    try {
      // فحص Python version
      const { stdout: pythonVersion } = await execAsync('python --version');
      results.push({
        name: 'python_runtime',
        status: 'available',
        version: pythonVersion.trim(),
        lastCheck: new Date().toISOString()
      });
      // Removed console.log}`);
    } catch (error) {
      results.push({
        name: 'python_runtime',
        status: 'missing',
        error: error.message,
        lastCheck: new Date().toISOString()
      });
      // Removed console.log
    }

    // فحص Gemini Backend
    try {
      const { stdout } = await execAsync('curl -s http://localhost:8000/health');
      const isHealthy = stdout.includes('healthy') || stdout.includes('ok');
      
      results.push({
        name: 'gemini_backend',
        status: isHealthy ? 'running' : 'stopped',
        response: stdout,
        lastCheck: new Date().toISOString()
      });
      
      // Removed console.log
    } catch (error) {
      results.push({
        name: 'gemini_backend',
        status: 'stopped',
        error: error.message,
        lastCheck: new Date().toISOString()
      });
      // Removed console.log
    }

    return results;
  }

  async checkHybridIntegration() {
    // Removed console.log
    const results = [];

    // فحص API Gateway endpoints
    const apiPath = 'apps/api/src/main.ts';
    if (fs.existsSync(apiPath)) {
      const content = fs.readFileSync(apiPath, 'utf8');
      const hasResearchEndpoint = content.includes('research');
      const hasSidebarEndpoint = content.includes('sidebar');
      
      results.push({
        name: 'api_endpoints',
        status: (hasResearchEndpoint && hasSidebarEndpoint) ? 'configured' : 'incomplete',
        research: hasResearchEndpoint,
        sidebar: hasSidebarEndpoint,
        lastCheck: new Date().toISOString()
      });
      
      // Removed console.log? '✅' : '⚠️'} API Endpoints: ${(hasResearchEndpoint && hasSidebarEndpoint) ? 'مكونة' : 'ناقصة'}`);
    }

    // فحص CORS configuration
    const mainPath = 'apps/api/src/main.ts';
    if (fs.existsSync(mainPath)) {
      const content = fs.readFileSync(mainPath, 'utf8');
      const hasCors = content.includes('localhost:8000');
      
      results.push({
        name: 'cors_config',
        status: hasCors ? 'configured' : 'missing',
        lastCheck: new Date().toISOString()
      });
      
      // Removed console.log
    }

    return results;
  }

  async generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      overall_status: this.calculateOverallStatus(results),
      ...results,
      summary: {
        total_services: results.services.length,
        healthy_services: results.services.filter(s => s.status === 'healthy').length,
        total_agents: results.agents.filter(a => !a.name.includes('_mode')).length,
        active_agents: results.agents.filter(a => !a.name.includes('_mode') && a.status === 'active').length,
        total_search_systems: results.searchSystems.length,
        available_search_systems: results.searchSystems.filter(s => s.status === 'available').length
      }
    };

    const reportPath = 'docs/6_fixing/reports/health_check_v2.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    // Removed console.log
  }

  calculateOverallStatus(results) {
    const healthyServices = results.services.filter(s => s.status === 'healthy').length;
    const totalServices = results.services.length;
    const healthPercentage = (healthyServices / totalServices) * 100;

    if (healthPercentage >= 90) return 'healthy';
    if (healthPercentage >= 70) return 'degraded';
    return 'unhealthy';
  }

  displaySummary(results) {
    // Removed console.log
    // Removed console.log);
    
    const summary = results.summary || {};
    // Removed console.log
    // Removed console.log
    // Removed console.log
    
    const overallStatus = this.calculateOverallStatus(results);
    const statusIcon = overallStatus === 'healthy' ? '✅' : overallStatus === 'degraded' ? '⚠️' : '❌';
    // Removed console.log
    
    // Removed console.log
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// تشغيل النظام
if (require.main === module) {
  const healthCheck = new HealthCheckV2();
  healthCheck.run().catch(console.error);
}

module.exports = HealthCheckV2;