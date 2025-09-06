/**
 * نقطة الدخول الرئيسية لوكيل الرقيب
 * Main entry point for Al-Raqib Compliance Agent
 */

export { ComplianceAuditorAgent } from './agents/compliance.agent';
export { KnowledgeBase } from './knowledge/knowledge-base';
export { GoogleCloudScanner } from './scanners/gcp-scanner';
export { GitHubScanner } from './scanners/github-scanner';
export { TerraformState } from './scanners/terraform-state';
export { writeMarkdown } from './reporters/markdown.reporter';
export { auditIacUsage } from './audits/audit.iac-usage';
export { auditDataResidency } from './audits/audit.data-residency';

export * from './types/audit';

// تشغيل مباشر إذا تم استدعاء الملف
if (require.main === module) {
  // Removed console.log
  // Removed console.log
}