import { Injectable } from '@nestjs/common';
import { 
  ComplianceAuditorAgent,
  KnowledgeBase,
  GoogleCloudScanner,
  GitHubScanner,
  TerraformState,
  writeMarkdown
} from '@g-assistant/compliance-agent';

@Injectable()
export class ComplianceService {
  async runAudit() {
    try {
      const kb = new KnowledgeBase('packages/compliance-agent/src/policies');
      const gcp = new GoogleCloudScanner(process.env.GCP_PROJECT_ID || 'demo');
      const gh = new GitHubScanner(
        process.env.GITHUB_TOKEN || 'demo',
        'azizsaif899',
        'g-assistant'
      );
      const tf = new TerraformState(
        process.env.TF_STATE_PATH || 'infrastructure/terraform.tfstate'
      );

      const agent = new ComplianceAuditorAgent(kb, gcp, gh, tf);
      const report = await agent.runFullAudit();
      const markdownFile = writeMarkdown(report, 'docs/6_fixing/auto-fix-system/quality-monitor/reports');

      return {
        success: true,
        report,
        markdownFile,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async healthCheck() {
    try {
      const kb = new KnowledgeBase('packages/compliance-agent/src/policies');
      const gcp = new GoogleCloudScanner(process.env.GCP_PROJECT_ID || 'demo');
      const gh = new GitHubScanner(process.env.GITHUB_TOKEN || 'demo', 'azizsaif899', 'g-assistant');
      const tf = new TerraformState(process.env.TF_STATE_PATH || 'infrastructure/terraform.tfstate');

      const agent = new ComplianceAuditorAgent(kb, gcp, gh, tf);
      return await agent.quickHealthCheck();
    } catch (error) {
      return {
        status: 'critical',
        issues: -1,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }
  }
}