import { GoogleCloudScanner } from '../scanners/gcp-scanner';
import { TerraformState } from '../scanners/terraform-state';
import { Finding } from '../types/audit';
import { v4 as uuid } from 'uuid';

/**
 * فحص استخدام Infrastructure as Code
 */
export async function auditIacUsage(
  gcp: GoogleCloudScanner,
  tf: TerraformState
): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  try {
    const activeServices = await gcp.listActiveServices();
    const tfResources = tf.loadResources();

    // إنشاء مجموعة من أسماء الموارد في Terraform
    const tfNames = new Set(
      tfResources.map(r => `${r.type}.${r.name || ''}`)
    );

    // البحث عن الموارد غير المدارة
    const unmanagedResources = activeServices.filter(service => 
      !tfNames.has(`google_${service.type.replace('.googleapis.com', '')}.${service.name || ''}`)
    );

    if (unmanagedResources.length > 0) {
      findings.push({
        id: uuid(),
        code: 'IAC-001',
        title: 'Unmanaged Cloud Resources',
        description: `Found ${unmanagedResources.length} active services not declared in Terraform state.`,
        severity: 'MEDIUM',
        status: 'OPEN',
        scope: 'CLOUD',
        evidence: unmanagedResources.map(r => ({
          title: `${r.type} ${r.name || ''}`,
          details: `region=${r.region}`
        })),
        recommendation: 'Declare all resources in Terraform or remove manual resources.',
        references: ['docs/governance/compliance_playbook.md#iac'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log(`IAC audit completed: ${findings.length} findings`);
    return findings;
  } catch (error) {
    console.error('Error in IAC audit:', error);
    return [];
  }
}