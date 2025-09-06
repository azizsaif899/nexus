#!/usr/bin/env node

/**
 * 🔧 نظام الإصلاح التلقائي v2.0 - مع دعم الوكلاء الذكيين
 * يتضمن فحص وإصلاح السايد بار الثوري والنظام الهجين
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class AutoFixV2 {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.agents = ['cfo', 'developer', 'database', 'operations', 'general'];
    this.modes = ['smart', 'iterative', 'analysis'];
    this.pythonServices = ['gemini-research-agent', 'langgraph-backend'];
  }

  async run() {
    // Removed console.log
    
    await this.checkSidebarAgents();
    await this.checkPythonServices();
    await this.checkSidebarPackage();
    await this.checkSearchSystems();
    await this.checkSecurityV2();
    await this.checkPerformanceV2();
    
    await this.generateReport();
    await this.applyFixes();
    
    // Removed console.log
  }

  async checkSidebarAgents() {
    // Removed console.log
    
    // فحص وجود ملفات الوكلاء
    for (const agent of this.agents) {
      const agentPath = `packages/sidebar-agents/src/agents/${this.capitalize(agent)}Agent.ts`;
      if (!fs.existsSync(agentPath)) {
        this.issues.push({
          type: 'missing_agent',
          severity: 'high',
          message: `الوكيل ${agent} غير موجود`,
          file: agentPath,
          fix: () => this.createMissingAgent(agent)
        });
      }
    }

    // فحص أوضاع المعالجة
    for (const mode of this.modes) {
      const modePath = `packages/sidebar-agents/src/modes/${this.capitalize(mode)}Mode.ts`;
      if (!fs.existsSync(modePath)) {
        this.issues.push({
          type: 'missing_mode',
          severity: 'medium',
          message: `وضع المعالجة ${mode} غير موجود`,
          file: modePath,
          fix: () => this.createMissingMode(mode)
        });
      }
    }

    // فحص تكامل السايد بار مع web-chatbot
    const webChatbotPath = 'apps/web-chatbot/src/app/app.tsx';
    if (fs.existsSync(webChatbotPath)) {
      const content = fs.readFileSync(webChatbotPath, 'utf8');
      if (!content.includes('SidebarSystem')) {
        this.issues.push({
          type: 'sidebar_integration',
          severity: 'high',
          message: 'السايد بار غير متكامل مع web-chatbot',
          file: webChatbotPath,
          fix: () => this.integrateSidebarWithChatbot()
        });
      }
    }

    // Removed console.log
  }

  async checkPythonServices() {
    // Removed console.log
    
    // فحص وجود Gemini Research Agent
    const geminiPath = 'packages/gemini-research-agent/src/backend/src/agent/app.py';
    if (!fs.existsSync(geminiPath)) {
      this.issues.push({
        type: 'missing_python_service',
        severity: 'critical',
        message: 'Gemini Research Agent غير موجود',
        file: geminiPath,
        fix: () => this.createPythonService()
      });
    }

    // فحص requirements.txt
    const requirementsPath = 'packages/gemini-research-agent/src/backend/requirements.txt';
    if (!fs.existsSync(requirementsPath)) {
      this.issues.push({
        type: 'missing_requirements',
        severity: 'medium',
        message: 'ملف requirements.txt غير موجود',
        file: requirementsPath,
        fix: () => this.createRequirementsTxt()
      });
    }

    // فحص تشغيل خدمة Python
    try {
      const { stdout } = await execAsync('curl -s http://localhost:8000/health');
      if (!stdout.includes('healthy')) {
        this.issues.push({
          type: 'python_service_down',
          severity: 'high',
          message: 'خدمة Python غير متاحة',
          fix: () => this.startPythonService()
        });
      }
    } catch (error) {
      this.issues.push({
        type: 'python_service_down',
        severity: 'high',
        message: 'خدمة Python غير متاحة',
        fix: () => this.startPythonService()
      });
    }

    // Removed console.log
  }

  async checkSidebarPackage() {
    // Removed console.log
    
    // فحص package.json للحزمة
    const packagePath = 'packages/sidebar-agents/package.json';
    if (!fs.existsSync(packagePath)) {
      this.issues.push({
        type: 'missing_sidebar_package',
        severity: 'high',
        message: 'حزمة sidebar-agents غير موجودة',
        file: packagePath,
        fix: () => this.createSidebarPackage()
      });
    }

    // فحص SidebarSystem الرئيسي
    const systemPath = 'packages/sidebar-agents/src/index.ts';
    if (fs.existsSync(systemPath)) {
      const content = fs.readFileSync(systemPath, 'utf8');
      if (!content.includes('SidebarSystem')) {
        this.issues.push({
          type: 'missing_sidebar_system',
          severity: 'high',
          message: 'SidebarSystem غير موجود في الحزمة',
          file: systemPath,
          fix: () => this.fixSidebarSystem()
        });
      }
    }

    // فحص تكامل الحزمة مع التطبيقات
    const appsToCheck = ['web-chatbot', 'admin-dashboard'];
    for (const app of appsToCheck) {
      const appPath = `apps/${app}/package.json`;
      if (fs.existsSync(appPath)) {
        const content = fs.readFileSync(appPath, 'utf8');
        if (!content.includes('sidebar-agents')) {
          this.issues.push({
            type: 'sidebar_not_imported',
            severity: 'medium',
            message: `حزمة sidebar-agents غير مستوردة في ${app}`,
            file: appPath,
            fix: () => this.addSidebarDependency(app)
          });
        }
      }
    }

    // Removed console.log
  }

  async checkSearchSystems() {
    // Removed console.log
    
    const searchSystems = [
      'packages/october-implementation',
      'packages/gemini-research-agent',
      'packages/research-core'
    ];

    for (const system of searchSystems) {
      if (!fs.existsSync(system)) {
        this.issues.push({
          type: 'missing_search_system',
          severity: 'high',
          message: `نظام البحث ${system} غير موجود`,
          file: system,
          fix: () => this.createSearchSystem(system)
        });
      }
    }

    // فحص تكامل أنظمة البحث
    const chatbotPath = 'apps/web-chatbot/src/app/app.tsx';
    if (fs.existsSync(chatbotPath)) {
      const content = fs.readFileSync(chatbotPath, 'utf8');
      if (!content.includes('october') && !content.includes('gemini')) {
        this.issues.push({
          type: 'search_integration',
          severity: 'medium',
          message: 'أنظمة البحث غير متكاملة مع الواجهة',
          file: chatbotPath,
          fix: () => this.integrateSearchSystems()
        });
      }
    }

    // Removed console.log
  }

  async checkSecurityV2() {
    // Removed console.log
    
    // فحص security-core
    const securityPath = 'packages/security-core/src/index.ts';
    if (fs.existsSync(securityPath)) {
      const content = fs.readFileSync(securityPath, 'utf8');
      if (!content.includes('25+') && !content.includes('improvements')) {
        this.issues.push({
          type: 'security_outdated',
          severity: 'critical',
          message: 'نظام الأمان غير محدث لـ v2.0',
          file: securityPath,
          fix: () => this.updateSecurityCore()
        });
      }
    }

    // فحص environment variables
    const envPath = '.env';
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const requiredVars = ['GEMINI_API_KEY', 'JWT_SECRET', 'DATABASE_URL'];
      
      for (const varName of requiredVars) {
        if (!content.includes(varName)) {
          this.issues.push({
            type: 'missing_env_var',
            severity: 'high',
            message: `متغير البيئة ${varName} غير موجود`,
            file: envPath,
            fix: () => this.addEnvVar(varName)
          });
        }
      }
    }

    // Removed console.log
  }

  async checkPerformanceV2() {
    // Removed console.log
    
    // فحص package.json scripts
    const packagePath = 'package.json';
    if (fs.existsSync(packagePath)) {
      const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const requiredScripts = [
        'activate:cfo-agent',
        'activate:developer-agent', 
        'fix:sidebar-package',
        'test:sidebar-agents'
      ];

      for (const script of requiredScripts) {
        if (!content.scripts || !content.scripts[script]) {
          this.issues.push({
            type: 'missing_script',
            severity: 'medium',
            message: `Script ${script} غير موجود`,
            file: packagePath,
            fix: () => this.addScript(script)
          });
        }
      }
    }

    // Removed console.log
  }

  // Fix Methods
  async createMissingAgent(agentName) {
    const agentPath = `packages/sidebar-agents/src/agents/${this.capitalize(agentName)}Agent.ts`;
    const agentCode = `export class ${this.capitalize(agentName)}Agent {
  private name = '${this.capitalize(agentName)} Agent';
  
  async processQuery(query: string): Promise<string> {
    // Removed console.log} \${this.name} معالجة: \${query}\`);
    return \`إجابة من \${this.name}: \${query}\`;
  }
  
  getStatus(): { active: boolean; name: string } {
    return { active: true, name: this.name };
  }
}`;

    fs.writeFileSync(agentPath, agentCode);
    this.fixes.push(`تم إنشاء الوكيل ${agentName}`);
  }

  async createMissingMode(modeName) {
    const modePath = `packages/sidebar-agents/src/modes/${this.capitalize(modeName)}Mode.ts`;
    const modeCode = `export class ${this.capitalize(modeName)}Mode {
  async process(query: string, agent: any): Promise<string> {
    const result = await agent.processQuery(query);
    return \`[${this.capitalize(modeName)} Mode] \${result}\`;
  }
}`;

    fs.writeFileSync(modePath, modeCode);
    this.fixes.push(`تم إنشاء وضع المعالجة ${modeName}`);
  }

  async startPythonService() {
    try {
      await execAsync('cd packages/gemini-research-agent/src/backend && python -m uvicorn agent.app:app --reload --port 8000 &');
      this.fixes.push('تم تشغيل خدمة Python');
    } catch (error) {
      console.error('فشل في تشغيل خدمة Python:', error.message);
    }
  }

  async createSidebarPackage() {
    const packageJson = {
      "name": "@azizsys/sidebar-agents",
      "version": "2.0.0",
      "description": "السايد بار الثوري مع 5 وكلاء ذكيين و 3 أوضاع معالجة",
      "main": "src/index.ts",
      "scripts": {
        "build": "tsc",
        "test": "jest"
      },
      "dependencies": {
        "@nestjs/common": "^10.0.0",
        "rxjs": "^7.8.0"
      }
    };
    
    fs.writeFileSync('packages/sidebar-agents/package.json', JSON.stringify(packageJson, null, 2));
    this.fixes.push('تم إنشاء حزمة sidebar-agents');
  }

  async addSidebarDependency(appName) {
    const packagePath = `apps/${appName}/package.json`;
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (!packageJson.dependencies) packageJson.dependencies = {};
      packageJson.dependencies['@azizsys/sidebar-agents'] = 'workspace:*';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      this.fixes.push(`تم إضافة sidebar-agents إلى ${appName}`);
    }
  }

  async generateReport() {
    // Removed console.log
    // Removed console.log);
    
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const highIssues = this.issues.filter(i => i.severity === 'high');
    const mediumIssues = this.issues.filter(i => i.severity === 'medium');
    
    // Removed console.log
    // Removed console.log
    // Removed console.log
    // Removed console.log
    
    if (this.issues.length > 0) {
      // Removed console.log
      this.issues.forEach((issue, index) => {
        const icon = this.getSeverityIcon(issue.severity);
        // Removed console.log
      });
    }
  }

  async applyFixes() {
    if (this.issues.length === 0) {
      // Removed console.log
      return;
    }

    // Removed console.log
    
    for (const issue of this.issues) {
      if (issue.fix) {
        try {
          await issue.fix();
        } catch (error) {
          console.error(`❌ فشل في إصلاح: ${issue.message}`);
        }
      }
    }

    // Removed console.log
    this.fixes.forEach((fix, index) => {
      // Removed console.log
    });
  }

  // Helper Methods
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getAgentEmoji(agent) {
    const emojis = {
      cfo: '💰',
      developer: '👨💻',
      database: '🗄️',
      operations: '⚙️',
      general: '🤖'
    };
    return emojis[agent] || '🤖';
  }

  getSeverityIcon(severity) {
    const icons = {
      critical: '🔴',
      high: '🟡',
      medium: '🟢',
      low: '🔵'
    };
    return icons[severity] || '⚪';
  }
}

// تشغيل النظام
if (require.main === module) {
  const autoFix = new AutoFixV2();
  autoFix.run().catch(console.error);
}

module.exports = AutoFixV2;